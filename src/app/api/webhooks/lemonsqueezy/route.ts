import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { users } from "@/db/schema/user";
import { plans } from "@/db/schema/plans";
import { eq, or } from "drizzle-orm";
import updatePlan from "@/lib/plans/updatePlan";
import downgradeToDefaultPlan from "@/lib/plans/downgradeToDefaultPlan";
import getOrCreateUser from "@/lib/users/getOrCreateUser";
import { allocatePlanCredits } from "@/lib/credits/allocatePlanCredits";

// Verify webhook signature
// LemonSqueezy uses HMAC SHA256 signature
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(payload).digest("hex");
    // Compare signatures in constant time
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(digest)
    );
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

async function handler(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-signature") || "";

    // Verify webhook signature
    const webhookSecret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("LEMON_SQUEEZY_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    if (!verifyWebhookSignature(body, signature, webhookSecret)) {
      console.error("Invalid webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    // LemonSqueezy webhook format: { meta: { event_name: "..." }, data: {...} }
    const eventType = event.meta?.event_name || event.meta?.eventName;
    const data = event.data;

    if (!eventType || !data) {
      console.error("Invalid webhook event structure:", event);
      return NextResponse.json(
        { error: "Invalid event structure" },
        { status: 400 }
      );
    }

    console.log("LemonSqueezy webhook event:", eventType, data);

    switch (eventType) {
      case "subscription_created":
      case "subscription_updated": {
        // LemonSqueezy data structure: { id: "...", attributes: {...}, relationships: {...} }
        const subscription = data.attributes || {};
        const customerId = subscription.customer_id || data.relationships?.customer?.data?.id;
        const subscriptionId = data.id;
        const variantId = subscription.variant_id || data.relationships?.variant?.data?.id;
        const userEmail = subscription.user_email || subscription.customer_email || 
                         subscription.userEmail || subscription.customerEmail;

        if (!userEmail) {
          console.error("No email found in subscription");
          return NextResponse.json({ received: true });
        }

        // Get or create user
        const userResult = await getOrCreateUser({
          emailId: userEmail,
          name: subscription.user_name || null,
        });
        const user = userResult.user;

        // Find plan by variant ID
        const plan = await db
          .select()
          .from(plans)
          .where(
            or(
              eq(plans.monthlyLemonSqueezyVariantId, variantId.toString()),
              eq(plans.yearlyLemonSqueezyVariantId, variantId.toString()),
              eq(plans.onetimeLemonSqueezyVariantId, variantId.toString())
            )
          )
          .limit(1)
          .then((plans) => plans[0]);

        if (!plan) {
          console.error("Plan not found for variant ID:", variantId);
          return NextResponse.json({ received: true });
        }

        // Update user subscription
        await db
          .update(users)
          .set({
            lemonSqueezyCustomerId: customerId.toString(),
            lemonSqueezySubscriptionId: subscriptionId.toString(),
            planId: plan.id,
          })
          .where(eq(users.id, user.id));

        // Allocate plan credits
        await allocatePlanCredits({
          userId: user.id,
          planId: plan.id,
          paymentId: subscriptionId.toString(),
        });

        console.log("Subscription updated for user:", user.id);
        break;
      }

      case "subscription_cancelled":
      case "subscription_expired": {
        const subscriptionId = data.id;

        // Find user by subscription ID
        const user = await db
          .select()
          .from(users)
          .where(eq(users.lemonSqueezySubscriptionId, subscriptionId.toString()))
          .limit(1)
          .then((users) => users[0]);

        if (!user) {
          console.error("User not found for subscription:", subscriptionId);
          return NextResponse.json({ received: true });
        }

        // Downgrade to default plan
        await downgradeToDefaultPlan({ userId: user.id });

        // Clear subscription IDs
        await db
          .update(users)
          .set({
            lemonSqueezySubscriptionId: null,
          })
          .where(eq(users.id, user.id));

        console.log("Subscription cancelled for user:", user.id);
        break;
      }

      case "subscription_resumed": {
        const subscription = data.attributes;
        const subscriptionId = data.id;
        const variantId = subscription.variant_id;

        // Find user by subscription ID
        const user = await db
          .select()
          .from(users)
          .where(eq(users.lemonSqueezySubscriptionId, subscriptionId.toString()))
          .limit(1)
          .then((users) => users[0]);

        if (!user) {
          console.error("User not found for subscription:", subscriptionId);
          return NextResponse.json({ received: true });
        }

        // Find plan by variant ID
        const plan = await db
          .select()
          .from(plans)
          .where(
            or(
              eq(plans.monthlyLemonSqueezyVariantId, variantId.toString()),
              eq(plans.yearlyLemonSqueezyVariantId, variantId.toString()),
              eq(plans.onetimeLemonSqueezyVariantId, variantId.toString())
            )
          )
          .limit(1)
          .then((plans) => plans[0]);

        if (plan) {
          await updatePlan({
            userId: user.id,
            newPlanId: plan.id,
          });

          await allocatePlanCredits({
            userId: user.id,
            planId: plan.id,
            paymentId: subscriptionId.toString(),
          });
        }

        console.log("Subscription resumed for user:", user.id);
        break;
      }

      case "order_created": {
        // Handle one-time payments
        const order = data.attributes || {};
        const orderItems = data.relationships?.order_items?.data || 
                          data.relationships?.orderItems?.data || [];
        const userEmail = order.user_email || order.customer_email ||
                         order.userEmail || order.customerEmail;

        if (!userEmail) {
          console.error("No email found in order");
          return NextResponse.json({ received: true });
        }

        // Get or create user
        const userResult = await getOrCreateUser({
          emailId: userEmail,
          name: order.user_name || null,
        });
        const user = userResult.user;

        // Process order items to find plan
        for (const item of orderItems) {
          const variantId = item.variant_id;

          // Find plan by variant ID
          const plan = await db
            .select()
            .from(plans)
            .where(
              eq(plans.onetimeLemonSqueezyVariantId, variantId.toString())
            )
            .limit(1)
            .then((plans) => plans[0]);

          if (plan) {
            await updatePlan({
              userId: user.id,
              newPlanId: plan.id,
            });

            await allocatePlanCredits({
              userId: user.id,
              planId: plan.id,
              paymentId: order.id || `order_${Date.now()}`,
            });
          }
        }

        console.log("Order processed for user:", user.id);
        break;
      }

      default:
        console.log("Unhandled event type:", eventType);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("LemonSqueezy webhook error:", error);
    return NextResponse.json(
      {
        received: true,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export const POST = handler;
export const maxDuration = 20;

