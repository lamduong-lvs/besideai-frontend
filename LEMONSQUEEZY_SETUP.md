# LemonSqueezy Payment Integration Setup 🍋

Complete guide to LemonSqueezy payment integration in BesideAI application.

## ✅ Current Status

LemonSqueezy integration has been configured!

### Configuration

- **API Key**: ✅ Configured in Vercel
- **Webhook Handler**: ✅ Created at `/api/webhooks/lemonsqueezy`
- **Checkout Integration**: ✅ Implemented
- **Status**: Ready for product configuration

## 🔧 Implementation Details

### 1. API Key Configuration

**Environment Variable**: `LEMONSQUEEZY_API_KEY`
- ✅ Added to Vercel Production environment
- Value: Configured (encrypted)

### 2. Webhook Handler

**File**: `src/app/api/webhooks/lemonsqueezy/route.ts`

**Supported Events:**
- ✅ `subscription_created` - New subscription created
- ✅ `subscription_updated` - Subscription updated
- ✅ `subscription_cancelled` - Subscription cancelled
- ✅ `subscription_expired` - Subscription expired
- ✅ `subscription_resumed` - Subscription resumed
- ✅ `order_created` - One-time payment completed

**Webhook Security:**
- Signature verification using HMAC SHA-256
- Requires `LEMON_SQUEEZY_WEBHOOK_SECRET` environment variable

### 3. Checkout Integration

**File**: `src/lib/lemonsqueezy/index.ts`

Creates checkout sessions for:
- Monthly subscriptions
- Yearly subscriptions
- One-time payments

**Features:**
- Test mode support via `LEMONSQUEEZY_TEST_MODE` environment variable
- Email pre-fill from user account
- Automatic redirect to LemonSqueezy checkout

## 🔐 Environment Variables

### Production (Vercel)

✅ **LEMONSQUEEZY_API_KEY** - Configured
- Your LemonSqueezy API key

⏳ **LEMON_SQUEEZY_WEBHOOK_SECRET** - **Required**
- Get from LemonSqueezy Dashboard > Settings > Webhooks
- Add webhook endpoint first to get secret

⏳ **LEMONSQUEEZY_STORE_ID** - Optional
- Your LemonSqueezy store ID
- May be needed for some operations

⏳ **LEMONSQUEEZY_TEST_MODE** - Optional
- Set to `"true"` for test mode
- Default: `"false"` (production mode)

### Local Development

Add to `.env.local`:

```bash
LEMONSQUEEZY_API_KEY="your_api_key_here"
LEMON_SQUEEZY_WEBHOOK_SECRET="your_webhook_secret_here"
LEMONSQUEEZY_STORE_ID="your_store_id_here"
LEMONSQUEEZY_TEST_MODE="true"  # For testing
```

## 🌐 Webhook Setup

### Step 1: Add Webhook Endpoint in LemonSqueezy

1. **Go to LemonSqueezy Dashboard**
   - Visit: https://app.lemonsqueezy.com/settings/webhooks

2. **Create New Webhook**
   - Click "Create Webhook"
   - **Webhook URL**: `https://besideai.work/api/webhooks/lemonsqueezy`
   - (Or use current Vercel URL for testing)

3. **Select Events**
   Enable these webhook events:
   - ✅ `subscription_created`
   - ✅ `subscription_updated`
   - ✅ `subscription_cancelled`
   - ✅ `subscription_expired`
   - ✅ `subscription_resumed`
   - ✅ `order_created`

4. **Get Webhook Secret**
   - After creating webhook, copy the **Signing Secret**
   - Add to Vercel as `LEMON_SQUEEZY_WEBHOOK_SECRET`

### Step 2: Add Webhook Secret to Vercel

```bash
# Add webhook secret to Vercel
vercel env add LEMON_SQUEEZY_WEBHOOK_SECRET production
# Paste the signing secret when prompted
```

### Step 3: Test Webhook

1. **Use LemonSqueezy Test Mode**
   - Set `LEMONSQUEEZY_TEST_MODE="true"` in Vercel
   - Create test subscriptions
   - Verify webhook events are received

2. **Check Webhook Logs**
   - Monitor in LemonSqueezy Dashboard > Webhooks
   - Check Vercel function logs
   - Verify events are processed correctly

## 🛍️ Product Configuration

### Step 1: Create Products in LemonSqueezy

1. **Go to Products**
   - Visit: https://app.lemonsqueezy.com/products

2. **Create Products**
   For each plan, create:
   - **Monthly Subscription** - Recurring monthly
   - **Yearly Subscription** - Recurring yearly
   - **One-time Payment** - Lifetime/one-time (if applicable)

3. **Configure Variants**
   - Set pricing for each variant
   - Configure billing cycles
   - Add product descriptions
   - Set trial periods (if needed)

### Step 2: Get Variant IDs

For each product variant:
1. Go to Product > Variants
2. Click on variant
3. Copy the **Variant ID** (e.g., `123456`)

### Step 3: Map Plans in Super Admin

1. **Go to Super Admin Dashboard**
   - Visit: `/super-admin/plans`
   - (Requires super admin access)

2. **Edit Each Plan**
   - Click "Edit" on a plan
   - Add LemonSqueezy Variant IDs:
     - **Monthly LemonSqueezy Variant ID**: `monthly_variant_id`
     - **Yearly LemonSqueezy Variant ID**: `yearly_variant_id`
     - **One-time LemonSqueezy Variant ID**: `onetime_variant_id`

3. **Save Plan**
   - Plan is now linked to LemonSqueezy products

## 🔘 Adding Subscribe Buttons

### Using getSubscribeUrl Helper

```tsx
import getSubscribeUrl, { PlanType, PlanProvider } from '@/lib/plans/getSubscribeUrl'

function PricingCard({ plan }) {
  // Monthly subscription with 7-day trial
  const monthlyUrl = getSubscribeUrl({
    codename: plan.codename,
    type: PlanType.MONTHLY,
    provider: PlanProvider.LEMON_SQUEEZY,
    trialPeriodDays: 7
  })

  // Yearly subscription with 14-day trial
  const yearlyUrl = getSubscribeUrl({
    codename: plan.codename,
    type: PlanType.YEARLY,
    provider: PlanProvider.LEMON_SQUEEZY,
    trialPeriodDays: 14
  })

  // One-time payment
  const onetimeUrl = getSubscribeUrl({
    codename: plan.codename,
    type: PlanType.ONETIME,
    provider: PlanProvider.LEMON_SQUEEZY
  })

  return (
    <div className="pricing-card">
      <h2>{plan.name}</h2>
      <div className="buttons">
        {plan.hasMonthlyPricing && (
          <Link href={monthlyUrl}>
            <Button>Subscribe Monthly</Button>
          </Link>
        )}
        {plan.hasYearlyPricing && (
          <Link href={yearlyUrl}>
            <Button>Subscribe Yearly</Button>
          </Link>
        )}
        {plan.hasOnetimePricing && (
          <Link href={onetimeUrl}>
            <Button>Buy Lifetime</Button>
          </Link>
        )}
      </div>
    </div>
  )
}
```

## 🔄 Subscription Flow

### User Subscription Process

1. **User Clicks Subscribe**
   - Redirected to `/app/subscribe?codename=plan&type=monthly&provider=lemonsqueezy`
   - System checks for existing subscription

2. **Checkout Session Created**
   - Creates LemonSqueezy checkout session
   - Pre-fills user email
   - Redirects to LemonSqueezy checkout page

3. **Payment Completed**
   - User completes payment on LemonSqueezy
   - Redirected back to success/error page

4. **Webhook Processing**
   - LemonSqueezy sends webhook event
   - System updates user subscription
   - Allocates plan credits
   - User can access plan features

### Subscription Management

- **Upgrade/Downgrade**: Handled automatically via webhooks
- **Cancellation**: User cancels in LemonSqueezy → webhook updates database
- **Resume**: User resumes in LemonSqueezy → webhook reactivates plan

## 🎯 Features Available

✅ **Automatic Plan Updates**
- Upgrades/downgrades handled via webhooks
- Plan changes reflected immediately

✅ **LemonSqueezy-Managed Billing**
- Customer portal access
- Automatic invoice generation
- Payment retry logic

✅ **Webhook Handling**
- Real-time subscription updates
- Secure signature verification
- Error handling and logging

✅ **Payment Tracking**
- Subscription status in database
- Customer ID tracking
- Subscription ID tracking

✅ **Usage Monitoring**
- Plan credits allocation
- Subscription lifecycle tracking

## 🧪 Testing

### Test Mode Setup

1. **Enable Test Mode**
   ```bash
   # In Vercel or .env.local
   LEMONSQUEEZY_TEST_MODE="true"
   ```

2. **Create Test Products**
   - Use test mode in LemonSqueezy
   - Create test variants
   - Map to plans in super admin

3. **Test Subscription Flow**
   - Create test checkout session
   - Complete test payment
   - Verify webhook events
   - Check database updates

### Testing Checklist

- [ ] Test monthly subscription creation
- [ ] Test yearly subscription creation
- [ ] Test one-time payment
- [ ] Test subscription upgrade
- [ ] Test subscription downgrade
- [ ] Test subscription cancellation
- [ ] Test subscription resumption
- [ ] Verify webhook events received
- [ ] Verify database updates
- [ ] Verify plan credits allocated

## 🔍 Troubleshooting

### Common Issues

#### 1. "Invalid API Key" Error

**Problem**: API key not recognized

**Solution**:
- Verify API key in Vercel environment variables
- Check for typos or extra spaces
- Regenerate key in LemonSqueezy dashboard if needed
- Ensure key has correct permissions

#### 2. Webhook Not Receiving Events

**Problem**: Webhooks not being received

**Solution**:
- Verify webhook URL is correct: `https://besideai.work/api/webhooks/lemonsqueezy`
- Check webhook secret is configured
- Verify webhook events are enabled in LemonSqueezy
- Check Vercel function logs for errors
- Test webhook endpoint manually

#### 3. "Invalid Signature" Error

**Problem**: Webhook signature verification fails

**Solution**:
- Verify `LEMON_SQUEEZY_WEBHOOK_SECRET` is correct
- Check webhook secret matches LemonSqueezy dashboard
- Ensure raw body is used for signature verification
- Check for encoding issues

#### 4. Plan Not Found Error

**Problem**: Variant ID doesn't match any plan

**Solution**:
- Verify variant IDs in super admin dashboard
- Check variant IDs match LemonSqueezy products
- Ensure plan has correct LemonSqueezy variant IDs set
- Verify variant IDs are strings, not numbers

#### 5. Subscription Not Updating

**Problem**: Webhook received but subscription not updated

**Solution**:
- Check webhook handler logs
- Verify user email matches
- Check database for user record
- Verify plan exists in database
- Check for errors in webhook processing

## 🔐 Security Best Practices

1. **Never Commit Secrets**
   - `.env.local` is in `.gitignore`
   - Use Vercel environment variables for production
   - Rotate API keys regularly

2. **Webhook Security**
   - Always verify webhook signatures
   - Use HTTPS for webhook endpoints
   - Monitor webhook events for suspicious activity

3. **API Key Security**
   - Limit API key permissions
   - Use separate keys for test/production
   - Rotate keys periodically

4. **Error Handling**
   - Log all webhook errors
   - Don't expose sensitive data in errors
   - Implement retry logic for failed webhooks

## 📊 Monitoring

### LemonSqueezy Dashboard

- **Webhooks**: Monitor webhook delivery status
- **Subscriptions**: Track subscription lifecycle
- **Orders**: View payment history
- **Analytics**: Revenue and conversion metrics

### Application Logs

- **Vercel Function Logs**: Check webhook processing
- **Database Logs**: Monitor subscription updates
- **Error Tracking**: Monitor failed webhooks

## 🚀 Production Checklist

- [x] API key added to Vercel
- [ ] Webhook endpoint created
- [ ] Webhook secret added to Vercel
- [ ] Products created in LemonSqueezy
- [ ] Variant IDs mapped to plans
- [ ] Webhook events enabled
- [ ] Test mode disabled
- [ ] Webhook URL configured in LemonSqueezy
- [ ] Test subscription flow
- [ ] Monitor webhook delivery

## 📚 Resources

- **LemonSqueezy Dashboard**: https://app.lemonsqueezy.com
- **LemonSqueezy API Docs**: https://docs.lemonsqueezy.com/api
- **Webhook Guide**: https://docs.lemonsqueezy.com/help/webhooks
- **Super Admin Plans**: `/super-admin/plans`

## 🎉 Success!

LemonSqueezy integration is configured! Once you:
1. Add webhook secret to Vercel
2. Configure webhook in LemonSqueezy dashboard
3. Create products and map variant IDs
4. Test the subscription flow

Your application will be ready to accept payments and manage subscriptions through LemonSqueezy! 🚀

