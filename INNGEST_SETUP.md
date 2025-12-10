# Inngest Background Jobs Setup Guide 🚀

## Overview

Inngest is already configured in your codebase! This guide will help you complete the production setup.

## ✅ Already Configured

- ✅ Inngest client (`src/lib/inngest/client.ts`)
- ✅ API route (`src/app/api/inngest/route.ts`)
- ✅ Functions (`src/lib/inngest/functions/`)
  - `hello-world.ts` - Example function
  - `expire-credits.ts` - Scheduled cron job (runs daily at 2 AM)
- ✅ Local development server (runs on `http://localhost:8288`)

## 🔧 Production Setup Steps

### Step 1: Create Inngest Account

1. **Sign up at [Inngest.com](https://www.inngest.com/)**
   - Go to https://www.inngest.com/
   - Click "Sign Up" (free tier available)
   - You can use GitHub for quick signup

2. **Create a New App**
   - After signing up, create a new app in the dashboard
   - Name it: `BesideAI` (or your preferred name)

3. **Get Your Event Key**
   - Go to your app settings in Inngest dashboard
   - Navigate to: **Settings** → **Keys**
   - Copy your `Event Key` (starts with `inn_`)

### Step 2: Add Event Key to Vercel

Once you have your event key, run this command:

```bash
cd Frontend
echo "YOUR_EVENT_KEY_HERE" | vercel env add INNGEST_EVENT_KEY production
```

Or manually add it via Vercel dashboard:
1. Go to https://vercel.com/lamduong-lvs-projects/besideai/settings/environment-variables
2. Add new variable:
   - **Name**: `INNGEST_EVENT_KEY`
   - **Value**: Your event key from Inngest
   - **Environment**: Production (and Preview if needed)

### Step 3: Install Vercel Integration (Recommended)

1. **Install Inngest Integration from Vercel Marketplace**
   - Go to: https://vercel.com/integrations
   - Search for "Inngest"
   - Click "Add Integration"
   - Connect your Inngest account
   - Select your Vercel project: `besideai`

2. **Benefits of Integration**
   - Automatic webhook configuration
   - Functions auto-sync
   - Better monitoring and debugging

### Step 4: Deploy

After adding the environment variable:

```bash
cd Frontend
vercel deploy --prod
```

### Step 5: Verify Setup

1. **Check Inngest Dashboard**
   - Visit: https://app.inngest.com
   - Go to your app
   - Check **Functions** tab
   - You should see:
     - `hello-world` function
     - `expire-credits` function (scheduled)

2. **Test a Function**
   - In Inngest dashboard, go to **Functions**
   - Click on `hello-world`
   - Use the "Send Test Event" button
   - Event name: `test/hello.world`
   - Data: `{ "email": "test@example.com" }`
   - Watch the execution in real-time

## 📋 Current Functions

### 1. Hello World (`hello-world`)
- **Event**: `test/hello.world`
- **Purpose**: Example function for testing
- **Usage**: Send test events to verify setup

### 2. Expire Credits (`expire-credits`)
- **Schedule**: Daily at 2:00 AM (Cron: `0 2 * * *`)
- **Purpose**: Automatically expire user credits that have passed their expiration date
- **Features**:
  - Batch processing (50 transactions per batch)
  - Parallel execution
  - Error handling and logging
  - Idempotent (prevents duplicate processing)

## 🧪 Local Development

Inngest works out of the box locally:

```bash
pnpm dev
```

This starts:
- Next.js dev server (port 3000)
- Inngest dev server (port 8288)
- React Email dev server (port 3001)

**Monitor jobs locally:**
- Open: http://localhost:8288
- See all function executions
- View logs and errors
- Test functions in real-time

## 📝 Example: Creating a New Function

Here's how to create a welcome email sequence:

```typescript
// src/lib/inngest/functions/welcome-email.ts
import { inngest } from "../client";
import sendMail from "@/lib/email/sendMail";

export const welcomeEmailSequence = inngest.createFunction(
  { id: "welcome-email-sequence" },
  { event: "user/signup" },
  async ({ event, step }) => {
    // Send immediately
    await step.run("send-welcome", async () => {
      await sendMail({
        to: event.data.email,
        subject: "Welcome to BesideAI! 👋",
        html: "<h1>Welcome!</h1><p>Thanks for signing up.</p>"
      });
    });

    // Wait 3 days
    await step.sleep("wait-3-days", "3d");

    // Send follow-up
    await step.run("send-tips", async () => {
      await sendMail({
        to: event.data.email,
        subject: "Here are some tips 💡",
        html: "<h1>Tips</h1><p>Here are some helpful tips...</p>"
      });
    });
  }
);
```

**Add to functions index:**
```typescript
// src/lib/inngest/functions/index.ts
import { welcomeEmailSequence } from "./welcome-email";

export type InngestEvents = {
  // ... existing events
  "user/signup": {
    data: {
      email: string;
      name?: string;
    };
  };
};

export const functions = [
  helloWorld,
  expireCredits,
  welcomeEmailSequence, // Add here
];
```

**Trigger the function:**
```typescript
import { inngest } from "@/lib/inngest/client";

// When user signs up
await inngest.send({
  name: "user/signup",
  data: {
    email: user.email,
    name: user.name,
  },
});
```

## 🔍 Monitoring & Debugging

### Inngest Dashboard
- **Functions**: View all functions and their status
- **Events**: See all events sent to Inngest
- **Runs**: Monitor function executions
- **Logs**: View detailed execution logs

### Vercel Logs
- Check Vercel function logs for API route: `/api/inngest`
- Monitor webhook deliveries

## 🎯 Best Practices

1. **Use Step Functions**
   ```typescript
   // ✅ Good - Each step is retryable
   await step.run("fetch-data", async () => fetchData());
   await step.run("process", async () => process());
   ```

2. **Handle Errors Gracefully**
   ```typescript
   try {
     await step.run("send-email", async () => {
       await sendEmail();
     });
   } catch (error) {
     logger.error("Failed to send:", error);
     throw error; // Triggers retry
   }
   ```

3. **Keep Jobs Idempotent**
   - Jobs might run multiple times
   - Use unique IDs to prevent duplicates
   - Check state before performing actions

4. **Test Locally First**
   - Always test functions locally before deploying
   - Use the dev UI at localhost:8288
   - Verify event schemas and data

## 🚨 Troubleshooting

### Functions Not Appearing in Dashboard
- Check that `INNGEST_EVENT_KEY` is set correctly
- Verify API route is accessible: `https://besideai.work/api/inngest`
- Check Vercel deployment logs

### Events Not Triggering Functions
- Verify event name matches exactly
- Check event schema in `InngestEvents` type
- Ensure function is exported in `functions/index.ts`

### Local Dev Server Not Starting
- Check if port 8288 is available
- Try: `pnpm install` to ensure dependencies are installed
- Check for errors in terminal

## 📚 Resources

- **Inngest Docs**: https://www.inngest.com/docs
- **Vercel Integration**: https://www.inngest.com/docs/deploy/vercel
- **Function Examples**: https://www.inngest.com/docs/functions
- **Event Schemas**: https://www.inngest.com/docs/events

## ✅ Checklist

- [ ] Create Inngest account
- [ ] Get event key from dashboard
- [ ] Add `INNGEST_EVENT_KEY` to Vercel
- [ ] Install Vercel integration (optional but recommended)
- [ ] Deploy to production
- [ ] Verify functions in Inngest dashboard
- [ ] Test a function with test event
- [ ] Monitor scheduled jobs (expire-credits runs daily)

---

**Status**: Inngest is configured and ready! Just need to add the event key for production. 🎉

