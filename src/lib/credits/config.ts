import { z } from "zod";
import {
  PlanBasedCredits,
  type CreditsConfig,
  type OnRegisterCredits,
} from "./credits";

// Define available credit types
export const creditTypeSchema = z.enum([
  "image_generation",
  "video_generation",
]);

// Pricing configuration per credit type
export const creditsConfig: CreditsConfig = {
  image_generation: {
    name: "Image Generation Credits",
    currency: "USD",
    minimumAmount: 1,
    // Volume pricing (pay-as-you-go)
    slabs: [
      { from: 0, to: 1000, pricePerUnit: 0.01 },
      { from: 1001, to: 5000, pricePerUnit: 0.009 }, // volume discount
    ],
  },
  video_generation: {
    name: "Video Generation Credits",
    currency: "USD",
    minimumAmount: 1,
    // Dynamic pricing based on plan (defaults to $0.01/unit)
    priceCalculator: (amountOfCredits, userPlan) => {
      // Example: cheaper rate for premium users
      const premiumRate = 0.008;
      const defaultRate = 0.01;
      const isPremium = userPlan?.codename === "premium";
      return amountOfCredits * (isPremium ? premiumRate : defaultRate);
    },
  },
};

// Enable credits globally
export const enableCredits = true;

// Signup bonus credits
export const onRegisterCredits: OnRegisterCredits = {
  image_generation: {
    amount: 50,
    expiryAfter: 30, // days
  },
};

// Plan-based credit grants on upgrade/change
export const onPlanChangeCredits: PlanBasedCredits = {
  professional: {
    image_generation: {
      amount: 200,
      expiryAfter: 30,
    },
  },
  premium: {
    image_generation: {
      amount: 500,
      expiryAfter: 30,
    },
    video_generation: {
      amount: 200,
      expiryAfter: 30,
    },
  },
};
