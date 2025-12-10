# Inngest Background Jobs - Complete Setup Summary ✅

## 🎉 Setup Status: COMPLETE!

Inngest background jobs have been fully configured and are ready to use!

---

## ✅ Completed Configuration

### 1. **Code Setup** ✅
- ✅ Inngest client configured (`src/lib/inngest/client.ts`)
- ✅ API route created (`src/app/api/inngest/route.ts`)
- ✅ Functions registered:
  - `hello-world` - Example/test function
  - `expire-credits` - Scheduled cron job (daily at 2 AM)
- ✅ Event schemas defined
- ✅ Local dev server configured (port 8288)

### 2. **Environment Variables (Vercel)** ✅
All required environment variables are configured:

| Variable | Environment | Status | Added |
|----------|-------------|--------|-------|
| `INNGEST_EVENT_KEY` | Production | ✅ | 8m ago |
| `INNGEST_EVENT_KEY` | Preview | ✅ | 8m ago |
| `INNGEST_SIGNING_KEY` | Production | ✅ | 8m ago |
| `INNGEST_SIGNING_KEY` | Preview | ✅ | 8m ago |

### 3. **Dependencies** ✅
- ✅ `inngest` package installed (v3.34.5)
- ✅ `inngest-cli` installed (v1.5.6)
- ✅ Dev script configured in `package.json`

---

## 📋 Current Functions

### 1. Hello World Function
**File**: `src/lib/inngest/functions/hello-world.ts`

- **Event**: `test/hello.world`
- **Purpose**: Example function for testing Inngest setup
- **Usage**: Send test events to verify everything works

**Test Event**:
```json
{
  "name": "test/hello.world",
  "data": {
    "email": "test@example.com"
  }
}
```

### 2. Expire Credits Function
**File**: `src/lib/inngest/functions/expire-credits.ts`

- **Schedule**: Daily at 2:00 AM UTC (Cron: `0 2 * * *`)
- **Purpose**: Automatically expire user credits that have passed their expiration date
- **Features**:
  - ✅ Batch processing (50 transactions per batch)
  - ✅ Parallel execution for performance
  - ✅ Comprehensive error handling
  - ✅ Idempotent (prevents duplicate processing)
  - ✅ Detailed logging

**What it does**:
1. Finds all credit transactions that expired today
2. Processes them in parallel batches
3. Creates "expired" transactions to deduct credits
4. Logs all results and errors

---

## 🚀 How to Use

### Local Development

Start the dev server (Inngest runs automatically):

```bash
cd Frontend
pnpm dev
```

This starts:
- Next.js dev server: `http://localhost:3000`
- Inngest dev UI: `http://localhost:8288`
- React Email dev: `http://localhost:3001`

**Monitor jobs locally:**
- Open: http://localhost:8288
- See all function executions in real-time
- View logs and errors
- Test functions with events

### Production

Your functions are automatically available at:
- **Webhook URL**: `https://besideai.work/api/inngest`
- **Inngest Dashboard**: https://app.inngest.com

---

## 🧪 Testing Functions

### Test Hello World Function

1. **Via Inngest Dashboard:**
   - Go to https://app.inngest.com
   - Navigate to your app
   - Go to **Functions** → `hello-world`
   - Click **"Send Test Event"**
   - Event name: `test/hello.world`
   - Data: `{ "email": "test@example.com" }`
   - Click **Send** and watch execution

2. **Via Code:**
```typescript
import { inngest } from "@/lib/inngest/client";

await inngest.send({
  name: "test/hello.world",
  data: {
    email: "user@example.com",
  },
});
```

### Monitor Scheduled Jobs

The `expire-credits` function runs automatically:
- **Schedule**: Daily at 2:00 AM UTC
- **Monitor**: Check Inngest dashboard → Functions → `expire-credits`
- **View Runs**: See execution history and results

---

## 📝 Creating New Functions

### Example: Welcome Email Sequence

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
      await sendMail(
        event.data.email,
        "Welcome to BesideAI! 👋",
        "<h1>Welcome!</h1><p>Thanks for signing up.</p>"
      );
    });

    // Wait 3 days
    await step.sleep("wait-3-days", "3d");

    // Send follow-up
    await step.run("send-tips", async () => {
      await sendMail(
        event.data.email,
        "Here are some tips 💡",
        "<h1>Tips</h1><p>Here are some helpful tips...</p>"
      );
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

---

## 🔍 Monitoring & Debugging

### Inngest Dashboard
- **URL**: https://app.inngest.com
- **Functions**: View all functions and their status
- **Events**: See all events sent to Inngest
- **Runs**: Monitor function executions with detailed logs
- **Logs**: View execution history, errors, and retries

### Vercel Logs
- Check Vercel function logs for: `/api/inngest`
- Monitor webhook deliveries and errors
- View execution times and performance

### Local Dev UI
- **URL**: http://localhost:8288
- Real-time function monitoring
- Event testing interface
- Execution logs and debugging

---

## 🎯 Best Practices

### 1. Use Step Functions
```typescript
// ✅ Good - Each step is retryable independently
await step.run("fetch-data", async () => fetchData());
await step.run("process", async () => process());
await step.run("save", async () => save());

// ❌ Bad - All-or-nothing, harder to retry
await fetchData();
await process();
await save();
```

### 2. Handle Errors Gracefully
```typescript
try {
  await step.run("send-email", async () => {
    await sendEmail();
  });
} catch (error) {
  logger.error("Failed to send:", error);
  // Re-throw to trigger automatic retry
  throw error;
}
```

### 3. Keep Jobs Idempotent
- Jobs might run multiple times (retries)
- Use unique IDs to prevent duplicates
- Check state before performing actions
- Example: Check if email already sent before sending

### 4. Use Logging
```typescript
async ({ step, logger }) => {
  logger.info("Starting job", { userId: event.data.userId });
  
  await step.run("process", async () => {
    logger.info("Processing...");
    // ... your logic
  });
  
  logger.info("Job completed");
}
```

---

## 🚨 Troubleshooting

### Functions Not Appearing in Dashboard
- ✅ Check that `INNGEST_EVENT_KEY` is set correctly
- ✅ Verify API route is accessible: `https://besideai.work/api/inngest`
- ✅ Check Vercel deployment logs
- ✅ Ensure functions are exported in `functions/index.ts`

### Events Not Triggering Functions
- ✅ Verify event name matches exactly (case-sensitive)
- ✅ Check event schema in `InngestEvents` type
- ✅ Ensure function is exported in `functions/index.ts`
- ✅ Check Inngest dashboard for event delivery

### Local Dev Server Not Starting
- ✅ Check if port 8288 is available
- ✅ Run `pnpm install` to ensure dependencies
- ✅ Check for errors in terminal
- ✅ Try restarting the dev server

### Scheduled Jobs Not Running
- ✅ Verify cron expression is correct
- ✅ Check timezone (UTC by default)
- ✅ Monitor Inngest dashboard for scheduled runs
- ✅ Check function logs for errors

---

## 📚 Resources

- **Inngest Docs**: https://www.inngest.com/docs
- **Vercel Integration**: https://www.inngest.com/docs/deploy/vercel
- **Function Examples**: https://www.inngest.com/docs/functions
- **Event Schemas**: https://www.inngest.com/docs/events
- **Cron Scheduling**: https://www.inngest.com/docs/guides/scheduled-functions

---

## ✅ Verification Checklist

- [x] Inngest client configured
- [x] API route created
- [x] Functions registered
- [x] Environment variables added to Vercel
- [x] Dependencies installed
- [ ] Test functions in Inngest dashboard
- [ ] Verify scheduled job (expire-credits) runs
- [ ] Monitor function executions
- [ ] Test local development

---

## 🎉 Next Steps

1. **Test Functions**
   - Go to Inngest dashboard
   - Test `hello-world` function
   - Monitor `expire-credits` scheduled run

2. **Create Custom Functions**
   - Add email sequences
   - Create scheduled tasks
   - Build webhook handlers

3. **Monitor & Optimize**
   - Watch execution logs
   - Monitor performance
   - Optimize batch sizes

---

**Status**: ✅ Inngest is fully configured and ready to use! All environment variables are set, functions are registered, and the system is ready for production use. 🚀

