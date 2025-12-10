# Google Login Setup Guide

## ✅ Current Status

Google Authentication has been successfully configured for BesideAI!

### Google OAuth Credentials

- **Client ID**: `231692293394-5v3o1utvr68t42d6vhfc5nsn1tn8mc2o.apps.googleusercontent.com`
- **Project ID**: `besideai-login-frontend`
- **Status**: ✅ Configured and Active

### Authorized Redirect URIs

The following redirect URIs have been configured in Google Cloud Console:

**Production:**
- `https://besideai.work/api/auth/callback/google`
- `https://www.besideai.work/api/auth/callback/google`
- `https://besideai.work/callback`
- `https://www.besideai.work/callback`

**Development (Local):**
- `http://localhost:3000/api/auth/callback/google`

### Authorized JavaScript Origins

- `https://besideai.work`
- `https://www.besideai.work`

## 🔧 Configuration Details

### 1. Auth Provider Configuration

**File**: `src/auth.ts`

```typescript
import GoogleProvider from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    // ... other providers
  ],
});
```

### 2. Sign-In Form

**File**: `src/components/auth/auth-form.tsx`

The sign-in form includes a "Continue with Google" button that:
- Uses Google icon from `react-icons/fa`
- Handles loading states
- Redirects to `/app` after successful authentication
- Supports callback URLs

### 3. Environment Variables

**Production (Vercel):**
✅ `GOOGLE_CLIENT_ID` - Configured
✅ `GOOGLE_CLIENT_SECRET` - Configured

**Local Development:**
Add to `.env.local`:
```bash
GOOGLE_CLIENT_ID="231692293394-5v3o1utvr68t42d6vhfc5nsn1tn8mc2o.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="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"
```

## 🧪 Testing

### Local Development Testing

1. **Start development server:**
   ```bash
   pnpm dev
   ```

2. **Visit sign-in page:**
   ```
   http://localhost:3000/sign-in
   ```

3. **Test Google login:**
   - Click "Continue with Google"
   - You should be redirected to Google OAuth consent screen
   - After authorization, you'll be redirected back to `/app`

### Production Testing

1. **Visit production sign-in page:**
   ```
   https://besideai.work/sign-in
   ```
   (or your current Vercel URL)

2. **Test Google login:**
   - Click "Continue with Google"
   - Complete OAuth flow
   - Verify redirect to `/app` after login

## 🔍 Verification Checklist

- [x] Google OAuth credentials created
- [x] Redirect URIs configured in Google Console
- [x] Authorized domains added
- [x] Environment variables set in Vercel
- [x] Google Provider configured in `auth.ts`
- [x] Sign-in form includes Google button
- [x] Production redirect URIs match domain

## 🛠️ Troubleshooting

### Common Issues

#### 1. "Invalid Redirect URI" Error

**Problem**: Redirect URI doesn't match exactly

**Solution**:
- Verify redirect URI in Google Console matches exactly:
  - `https://besideai.work/api/auth/callback/google`
  - No trailing slashes
  - Correct protocol (https/http)
  - Exact path: `/api/auth/callback/google`

#### 2. "Unauthorized Domain" Error

**Problem**: Domain not authorized in Google Console

**Solution**:
- Add domain to "Authorized domains" in OAuth consent screen:
  - `besideai.work`
  - `www.besideai.work`
  - `localhost:3000` (for development)

#### 3. Production Login Not Working

**Problem**: Google login works locally but not in production

**Solution**:
- Verify environment variables in Vercel Dashboard
- Check that production redirect URI is authorized
- Ensure `NEXTAUTH_URL` is set to production domain
- Redeploy after adding environment variables

#### 4. Environment Variables Not Loading

**Problem**: `GOOGLE_CLIENT_ID` or `GOOGLE_CLIENT_SECRET` is undefined

**Solution**:
- Verify variables are set in Vercel (Project Settings > Environment Variables)
- Ensure variables are set for "Production" environment
- Redeploy application after adding variables
- Check variable names match exactly (case-sensitive)

## 🔐 Security Best Practices

1. **Never commit secrets to Git**
   - `.env.local` is already in `.gitignore`
   - Use Vercel environment variables for production

2. **Regularly rotate client secrets**
   - Update in Google Console
   - Update in Vercel environment variables
   - Redeploy application

3. **Limit OAuth scopes**
   - Current setup uses default scopes (email, profile)
   - Only request necessary permissions

4. **Monitor OAuth usage**
   - Check Google Cloud Console > APIs & Services > Credentials
   - Monitor for unusual activity

5. **Use HTTPS in production**
   - Required for OAuth redirects
   - Vercel provides SSL automatically

## 📝 Google Cloud Console Links

- **Credentials**: https://console.cloud.google.com/apis/credentials
- **OAuth Consent Screen**: https://console.cloud.google.com/apis/credentials/consent
- **Project Dashboard**: https://console.cloud.google.com/home/dashboard?project=besideai-login-frontend

## 🚀 Next Steps

### Add More OAuth Providers

You can add additional providers following the same pattern:

1. **GitHub**
   ```typescript
   import GitHubProvider from "next-auth/providers/github";
   
   GitHubProvider({
     clientId: process.env.GITHUB_CLIENT_ID,
     clientSecret: process.env.GITHUB_CLIENT_SECRET,
   })
   ```

2. **Facebook**
   ```typescript
   import FacebookProvider from "next-auth/providers/facebook";
   
   FacebookProvider({
     clientId: process.env.FACEBOOK_CLIENT_ID,
     clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
   })
   ```

### Enable Password Authentication

To enable traditional email/password login:

1. Update `src/lib/config.ts`:
   ```typescript
   auth: {
     enablePasswordAuth: true,
   }
   ```

2. The sign-in form will automatically show password fields

## ✅ Success!

Your users can now sign in with their Google accounts! 🎉

The authentication flow:
1. User clicks "Continue with Google"
2. Redirected to Google OAuth consent screen
3. User authorizes the application
4. Redirected back to `/api/auth/callback/google`
5. NextAuth creates/updates user session
6. User redirected to `/app` dashboard

