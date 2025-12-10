# Database Setup Guide

## ✅ Current Status

Your Supabase database has been successfully configured!

- **Project ID**: `jzwiqnrxyyxznwttswoc`
- **Region**: `us-east-1`
- **Status**: `ACTIVE_HEALTHY`
- **Database Host**: `db.jzwiqnrxyyxznwttswoc.supabase.co`

## 📊 Database Tables

All 12 tables have been created and are ready to use:

1. `app_user` - User accounts
2. `account` - OAuth accounts
3. `session` - User sessions
4. `verificationToken` - Email verification tokens
5. `authenticator` - WebAuthn authenticators
6. `plans` - Subscription plans
7. `coupon` - Coupon codes
8. `credit_transactions` - Credit transactions
9. `paypal_access_tokens` - PayPal tokens
10. `paypal_context` - PayPal context
11. `contact` - Contact form submissions
12. `waitlist` - Waitlist entries

## 🔧 Local Development Setup

### 1. Create `.env.local` file

Create a `.env.local` file in the `Frontend/` directory with the following content:

```bash
# Database
# Use connection pooling for better performance
DATABASE_URL="postgresql://postgres.jzwiqnrxyyxznwttswoc:Dv007009lvs@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

# Auth
NEXTAUTH_SECRET="XwwOGt3dQuaqfcn4j3nQCPqCrNhcPTght2f5EqBftjo="
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Google Auth
GOOGLE_CLIENT_ID="231692293394-5v3o1utvr68t42d6vhfc5nsn1tn8mc2o.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="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"

# Sign in enabled
NEXT_PUBLIC_SIGNIN_ENABLED="true"
```

### 2. Connection String Formats

**Connection Pooling (Recommended for Production):**
```
postgresql://postgres.jzwiqnrxyyxznwttswoc:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Direct Connection (For Local Development):**
```
postgresql://postgres:[PASSWORD]@db.jzwiqnrxyyxznwttswoc.supabase.co:5432/postgres
```

### 3. Verify Database Connection

Run the following command to verify your database connection:

```bash
pnpm drizzle-kit push
```

This will sync your schema with the database.

## 🚀 Production Environment

Environment variables are already configured in Vercel:

- ✅ `DATABASE_URL` - Supabase connection string (pooler)
- ✅ `NEXTAUTH_SECRET` - Generated secret
- ✅ `NEXTAUTH_URL` - `https://besideai.work`
- ✅ `NEXT_PUBLIC_APP_URL` - `https://besideai.work`
- ✅ `GOOGLE_CLIENT_ID` - Google OAuth
- ✅ `GOOGLE_CLIENT_SECRET` - Google OAuth
- ✅ `NEXT_PUBLIC_SIGNIN_ENABLED` - `true`

## 📝 Database Configuration Files

### `src/db/index.ts`
```typescript
import { drizzle } from "drizzle-orm/postgres-js";

export const db = drizzle(process.env.DATABASE_URL!);
```

### `drizzle.config.ts`
```typescript
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

## 🔍 Troubleshooting

### Connection Issues

1. **Verify connection string format**
   - Make sure password is URL-encoded if it contains special characters
   - Use pooler connection for production: port `6543`
   - Use direct connection for local: port `5432`

2. **Check Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/jzwiqnrxyyxznwttswoc
   - Settings > Database > Connection string
   - Verify your password is correct

3. **IP Restrictions**
   - Supabase allows all IPs by default
   - If you have restrictions, add your IP in Supabase Dashboard

### Schema Sync Issues

1. **Check drizzle.config.ts**
   - Verify `schema` path points to `./src/db/schema`
   - Verify `out` path points to `./drizzle`

2. **Run migrations manually**
   ```bash
   pnpm drizzle-kit push
   ```

3. **Check for errors**
   - Look for console errors during schema push
   - Verify all schema files are correctly exported

## 📚 Next Steps

1. **Set up database indexes** for better performance
2. **Configure Row Level Security (RLS)** if needed
3. **Set up database backups** in Supabase Dashboard
4. **Monitor database usage** in Supabase Dashboard

## 🔗 Useful Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/jzwiqnrxyyxznwttswoc
- **Supabase Docs**: https://supabase.com/docs
- **Drizzle ORM Docs**: https://orm.drizzle.team/docs/overview

