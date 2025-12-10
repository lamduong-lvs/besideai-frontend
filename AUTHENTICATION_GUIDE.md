# Authentication Guide 🔐

Complete guide to authentication in BesideAI application.

## ✅ Current Authentication Status

### Enabled Authentication Methods

1. **Google OAuth** ✅
   - Client ID configured
   - Redirect URIs set up
   - Production ready

2. **Email Magic Links** ✅
   - Passwordless authentication
   - Email verification flow

3. **Password Authentication** ✅
   - Enabled in config
   - Sign up with email + password
   - Password reset flow
   - Secure password hashing (bcrypt)

## 🔑 Password Authentication

### Configuration

**File**: `src/lib/config.ts`

```typescript
auth: {
  enablePasswordAuth: true, // ✅ Enabled
}
```

### Features

✅ **Sign Up** - Email + password registration
✅ **Sign In** - Email + password login
✅ **Password Reset** - Forgot password flow
✅ **Secure Hashing** - bcrypt with salt
✅ **Password Validation** - Built-in validation rules

### User Flow

#### Sign Up Flow

1. User visits `/sign-up`
2. Enters email address
3. Receives verification email with token
4. Clicks link → redirected to `/sign-up/set-password`
5. Sets password
6. Account created and logged in

#### Sign In Flow

1. User visits `/sign-in`
2. Clicks "Continue with Google" OR
3. Enters email + password
4. Redirected to `/app` dashboard

#### Password Reset Flow

1. User clicks "Forgot password?" on sign-in page
2. Redirected to `/reset-password`
3. Enters email address
4. Receives reset link via email
5. Clicks link → sets new password
6. Automatically logged in

### Security Features

- **bcrypt Hashing** - Passwords never stored in plain text
- **Salt + Pepper** - Additional security layers
- **Time-limited Tokens** - Reset links expire after 30 minutes
- **One-time Use** - Reset tokens can only be used once
- **Email Verification** - Required on signup

## 👤 User Authentication in Your App

### Client-Side: useUser Hook

For client components, use the `useUser` hook:

**File**: `src/lib/users/useUser.ts`

```typescript
'use client'

import useUser from '@/lib/users/useUser'

export default function ProfileButton() {
  const { user, isLoading, error, mutate } = useUser()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <button onClick={() => signIn()}>Sign In</button>
  }

  return (
    <div className="flex items-center gap-2">
      <img 
        src={user.image} 
        alt={user.name} 
        className="w-8 h-8 rounded-full" 
      />
      <span>{user.name}</span>
    </div>
  )
}
```

**Features:**
- 🔄 Automatic revalidation
- 🎭 Type-safe user data
- ⌛ Loading states
- 🚫 Error handling
- 🔌 Offline support

### Server-Side: auth() Function

For server components and API routes:

```typescript
// src/app/profile/page.tsx
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const session = await auth()
  
  if (!session) {
    redirect('/sign-in')
  }

  return (
    <div className="p-6">
      <h1>Welcome {session.user.name}!</h1>
      <p>Email: {session.user.email}</p>
      <p>User ID: {session.user.id}</p>
    </div>
  )
}
```

**When to Use:**
- ✅ Server Components
- ✅ API Routes
- ✅ Server Actions
- ✅ Middleware
- ✅ Layout Components

### Protected API Routes: withAuthRequired

Secure your API routes with `withAuthRequired`:

**File**: `src/lib/auth/withAuthRequired.ts`

```typescript
// src/app/api/app/user-settings/route.ts
import { withAuthRequired } from '@/lib/auth/withAuthRequired'
import { NextResponse } from 'next/server'

export const GET = withAuthRequired(async (req, context) => {
  const { session, getUser, getCurrentPlan } = context
  
  // Access user data from session
  const userId = session.user.id
  
  // Get full user data
  const user = await getUser()
  
  // Get current plan
  const plan = await getCurrentPlan()
  
  return NextResponse.json({ user, plan })
})

export const POST = withAuthRequired(async (req, context) => {
  const { session } = context
  const data = await req.json()
  
  // Update user settings
  await updateUserSettings(session.user.id, data)
  
  return NextResponse.json({ success: true })
})
```

**Benefits:**
- 🔒 Automatic authentication checking
- 🎭 Type-safe session data
- 🚫 Automatic error responses (401 Unauthorized)
- 📝 Session context in handler
- ⚡ Zero-config setup

## 📋 Authentication Examples

### Protected Dashboard Page

```typescript
// src/app/(in-app)/app/page.tsx
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/sign-in')
  }

  return (
    <div className="p-6">
      <h1>Dashboard</h1>
      <p>Welcome back, {session.user.name}!</p>
      {/* Your dashboard content */}
    </div>
  )
}
```

### User Settings Component (Client)

```typescript
'use client'

import useUser from '@/lib/users/useUser'
import { useState } from 'react'

export function UserSettings() {
  const { user, isLoading, mutate } = useUser()
  const [name, setName] = useState(user?.name || '')

  if (isLoading) return <div>Loading settings...</div>
  if (!user) return <div>Please sign in</div>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const response = await fetch('/api/app/user-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })

    if (response.ok) {
      mutate() // Revalidate user data
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input 
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input"
      />
      <button type="submit" className="btn">
        Save Changes
      </button>
    </form>
  )
}
```

### Protected API Route Example

```typescript
// src/app/api/app/credits/route.ts
import { withAuthRequired } from '@/lib/auth/withAuthRequired'
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { creditTransactions } from '@/db/schema/credits'

export const GET = withAuthRequired(async (req, context) => {
  const { session } = context
  
  // Get user's credit transactions
  const transactions = await db
    .select()
    .from(creditTransactions)
    .where(eq(creditTransactions.userId, session.user.id))
  
  return NextResponse.json({ transactions })
})
```

## 🎯 Best Practices

### 1. Choose the Right Method

- **`useUser`** - For client components that need reactive user data
- **`auth()`** - For server components and initial data fetching
- **`withAuthRequired`** - For API routes that need authentication

### 2. Error Handling

```typescript
// Always handle loading states
if (isLoading) return <LoadingSpinner />

// Provide clear error messages
if (error) return <ErrorMessage message={error.message} />

// Implement proper redirects
if (!session) redirect('/sign-in')
```

### 3. Security Tips

- ✅ Validate on both client and server
- ✅ Never expose sensitive data to client
- ✅ Use HTTPS in production (Vercel provides automatically)
- ✅ Implement proper CORS policies
- ✅ Rate limit authentication endpoints

### 4. Performance

- ✅ Cache authentication state
- ✅ Use loading skeletons
- ✅ Implement proper revalidation
- ✅ Use SWR for client-side data fetching

## 🔐 Session Strategy

Indie Kit uses **JWT session strategy** by default:

**File**: `src/auth.ts`

```typescript
session: {
  strategy: "jwt",
}
```

**Benefits:**
- Fast - No database queries for session validation
- Scalable - Works across multiple servers
- Stateless - No session storage needed

**Session Data:**
- `user.id` - User ID
- `user.email` - User email
- `user.impersonatedBy` - Admin impersonation (if applicable)

## 📧 Email Flows

### Sign Up Email

When user signs up:
1. Verification email sent
2. Contains token link
3. User clicks link → sets password
4. Account activated

### Password Reset Email

When user requests password reset:
1. Reset email sent
2. Contains reset token link
3. Token expires after 30 minutes
4. One-time use only

### Magic Link Email

When user uses email authentication:
1. Magic link email sent
2. Contains sign-in link
3. Link expires after configured time
4. User clicks → automatically signed in

## 🚀 Adding More Auth Providers

Indie Kit supports 80+ authentication providers through Auth.js!

### Popular Providers

- 🐙 **GitHub** - Perfect for developer tools
- 📘 **Facebook** - Great for social apps
- 🐦 **Twitter/X** - Social media integration
- 💼 **LinkedIn** - B2B and professional apps
- 🍎 **Apple** - iOS app requirement
- 🔷 **Microsoft** - Enterprise applications

### How to Add a Provider

1. **Get Provider Credentials**
   - Create OAuth app with provider
   - Get Client ID and Client Secret
   - Configure redirect URI

2. **Add Environment Variables**
   ```bash
   # Example for GitHub
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   ```

3. **Add to auth.ts**
   ```typescript
   import GitHubProvider from "next-auth/providers/github";
   
   providers: [
     GitHubProvider({
       clientId: process.env.GITHUB_CLIENT_ID,
       clientSecret: process.env.GITHUB_CLIENT_SECRET,
     }),
     // ... other providers
   ]
   ```

4. **Update Vercel Environment Variables**
   - Add credentials to Vercel dashboard
   - Redeploy application

### Provider Documentation

- **Official Docs**: [Auth.js Providers](https://authjs.dev/getting-started/providers)
- **Provider List**: [All 80+ Providers](https://authjs.dev/reference/core/providers)

## 📝 API Endpoints

### Authentication Endpoints

- `POST /api/auth/signup-request` - Request signup email
- `POST /api/auth/complete-signup` - Complete signup with password
- `POST /api/auth/reset-password-request` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/callback/[provider]` - OAuth callback

### User Endpoints

- `GET /api/app/me` - Get current user data
- `POST /api/app/user-settings` - Update user settings

## ✅ Verification Checklist

- [x] Password authentication enabled
- [x] Google OAuth configured
- [x] Email magic links working
- [x] Password reset flow functional
- [x] useUser hook available
- [x] withAuthRequired utility available
- [x] auth() function available
- [x] Protected routes working
- [x] Environment variables configured

## 🔗 Related Documentation

- **Database Setup**: `DATABASE_SETUP.md`
- **Google Auth Setup**: `GOOGLE_AUTH_SETUP.md`
- **NextAuth Docs**: https://authjs.dev/
- **Auth.js Providers**: https://authjs.dev/getting-started/providers

## 🎉 Success!

Your authentication system is fully configured and ready to use! Users can:
- Sign up with email + password
- Sign in with Google OAuth
- Sign in with email magic links
- Reset forgotten passwords
- Access protected routes and API endpoints

