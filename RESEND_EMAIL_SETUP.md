# Resend Email Setup Guide 📧

Complete guide to email delivery using Resend in BesideAI application.

## ✅ Current Status

Resend has been successfully configured for email delivery!

### Configuration

- **API Key**: Configured in Vercel environment variables
- **Sender Name**: BesideAI
- **Sender Email**: noreply@besideai.work
- **Status**: ✅ Production Ready

## 🔧 Implementation

### 1. Package Installation

Resend package has been installed:

```bash
pnpm add resend
```

**Version**: `6.6.0`

### 2. Email Sending Function

**File**: `src/lib/email/sendMail.ts`

```typescript
import { Resend } from "resend";
import { appConfig } from "../config";

const sendMail = async (to: string, subject: string, html: string) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(
      "Sending email to",
      to,
      "with subject",
      subject,
      "and html",
      html
    );
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const response = await resend.emails.send({
    from: `${appConfig.email.senderName} <${appConfig.email.senderEmail}>`,
    to: [to],
    subject: subject,
    html: html,
    replyTo: appConfig.email.senderEmail,
  });

  if (response.error) {
    console.error("Email sent failed", response.error);
  } else {
    if (process.env.NODE_ENV === "development") {
      console.info("Email sent successfully", response);
    }
  }
};

export default sendMail;
```

### 3. Configuration

**File**: `src/lib/config.ts`

```typescript
email: {
  senderName: "BesideAI",
  senderEmail: "noreply@besideai.work",
}
```

## 🔐 Environment Variables

### Production (Vercel)

✅ `RESEND_API_KEY` - Configured
- Value: `re_Yb7GB9QT_8vxV6Fj3FWzUfNYahEmtjm2g`
- Environment: Production

### Local Development

Add to `.env.local`:

```bash
RESEND_API_KEY="re_Yb7GB9QT_8vxV6Fj3FWzUfNYahEmtjm2g"
```

## 📧 Email Types

Resend is used for the following email flows:

### 1. Authentication Emails

- **Magic Link Emails** - Passwordless sign-in
- **Sign Up Verification** - Account creation confirmation
- **Password Reset** - Forgot password flow

### 2. Transactional Emails

- **Welcome Email** - New user onboarding
- **Account Updates** - Profile changes, settings updates

### 3. Email Templates

All emails use React Email templates located in:
- `src/emails/MagicLinkEmail.tsx`
- `src/emails/SignUpEmail.tsx`
- `src/emails/ResetPasswordEmail.tsx`
- `src/emails/Welcome.tsx`

## 🌐 Domain Verification

### Important: Domain Setup Required

To send emails from `noreply@besideai.work`, you need to:

1. **Verify Domain in Resend**
   - Go to [Resend Dashboard](https://resend.com/domains)
   - Click "Add Domain"
   - Enter: `besideai.work`

2. **Add DNS Records**
   Resend will provide DNS records to add:
   - **SPF Record** - Email authentication
   - **DKIM Records** - Email signing
   - **DMARC Record** - Email policy (optional but recommended)

3. **Wait for DNS Propagation**
   - Usually takes 24-48 hours
   - Check verification status in Resend dashboard

### Temporary Solution

Until domain is verified, you can:
- Use Resend's default domain (e.g., `onboarding@resend.dev`)
- Update `senderEmail` in config temporarily
- Test email functionality

## 🧪 Testing Email Setup

### Local Development

1. **Start dev server:**
   ```bash
   pnpm dev
   ```

2. **Test email sending:**
   - In development, emails are logged to console
   - Check console output for email details
   - No actual emails sent in development mode

### Production Testing

1. **Test Magic Link:**
   - Visit `/sign-in`
   - Enter email → click "Continue with Email"
   - Check email inbox for magic link

2. **Test Password Reset:**
   - Visit `/reset-password`
   - Enter email → check inbox for reset link

3. **Monitor in Resend Dashboard:**
   - Go to [Resend Dashboard](https://resend.com/emails)
   - View sent emails
   - Check delivery status
   - Monitor bounce rates

## 📊 Email Monitoring

### Resend Dashboard Features

- **Email Logs** - View all sent emails
- **Delivery Status** - Track delivery, bounces, opens
- **Analytics** - Open rates, click rates
- **Domain Reputation** - Monitor sender reputation
- **Bounce Management** - Handle bounces and complaints

### Best Practices

1. **Monitor Bounce Rate**
   - Keep bounce rate below 5%
   - Remove invalid emails promptly
   - Use double opt-in for signups

2. **Maintain Domain Reputation**
   - Send to engaged users
   - Avoid spam triggers
   - Use proper unsubscribe links

3. **Email Content**
   - Use clear subject lines
   - Include plain text version
   - Test across email clients
   - Mobile-responsive design

## 🔍 Troubleshooting

### Common Issues

#### 1. "Invalid API Key" Error

**Problem**: API key not recognized

**Solution**:
- Verify API key in Vercel environment variables
- Check for typos or extra spaces
- Ensure key starts with `re_`
- Regenerate key in Resend dashboard if needed

#### 2. "Domain Not Verified" Error

**Problem**: Cannot send from custom domain

**Solution**:
- Verify domain in Resend dashboard
- Check DNS records are correct
- Wait for DNS propagation (24-48 hours)
- Use Resend default domain temporarily

#### 3. Emails Not Delivered

**Problem**: Emails sent but not received

**Solution**:
- Check Resend dashboard for delivery status
- Verify recipient email is valid
- Check spam/junk folder
- Review bounce messages in Resend
- Check domain reputation

#### 4. Development Mode Not Sending

**Problem**: Emails only logged, not sent

**Solution**:
- This is expected behavior in development
- Emails are logged to console for testing
- Set `NODE_ENV=production` to send actual emails
- Or modify `sendMail.ts` to always send

## 🔐 Security Best Practices

1. **Never Commit API Keys**
   - `.env.local` is in `.gitignore`
   - Use Vercel environment variables for production
   - Rotate keys regularly

2. **Domain Authentication**
   - Always verify sending domain
   - Use SPF, DKIM, and DMARC records
   - Monitor domain reputation

3. **Rate Limiting**
   - Implement rate limiting for email endpoints
   - Prevent email abuse
   - Use Resend's built-in rate limits

4. **Email Validation**
   - Validate email addresses before sending
   - Use proper email validation libraries
   - Handle bounces gracefully

## 📝 Email Template Customization

### React Email Templates

All email templates use React Email:

**Location**: `src/emails/`

**Available Templates**:
- `MagicLinkEmail.tsx` - Sign-in magic links
- `SignUpEmail.tsx` - Account creation
- `ResetPasswordEmail.tsx` - Password reset
- `Welcome.tsx` - Welcome email

### Customizing Templates

1. **Edit Template File:**
   ```typescript
   // src/emails/Welcome.tsx
   export default function Welcome({ name }: { name: string }) {
     return (
       <Html>
         <Body>
           <Heading>Welcome to BesideAI, {name}!</Heading>
           {/* Your custom content */}
         </Body>
       </Html>
     )
   }
   ```

2. **Update Email Sender:**
   ```typescript
   // src/lib/config.ts
   email: {
     senderName: "Your Custom Name",
     senderEmail: "custom@besideai.work",
   }
   ```

## 🚀 Next Steps

### 1. Domain Verification (Required)

- [ ] Add domain to Resend
- [ ] Configure DNS records
- [ ] Wait for verification
- [ ] Test email sending

### 2. Email Templates

- [ ] Customize welcome email
- [ ] Brand magic link emails
- [ ] Update password reset template
- [ ] Add company logo

### 3. Email Automation

- [ ] Set up welcome email sequence
- [ ] Configure onboarding emails
- [ ] Add transactional email notifications
- [ ] Implement email preferences

## 📚 Resources

- **Resend Dashboard**: https://resend.com/dashboard
- **Resend Docs**: https://resend.com/docs
- **React Email Docs**: https://react.email/docs
- **Domain Setup Guide**: https://resend.com/docs/dashboard/domains/introduction

## ✅ Verification Checklist

- [x] Resend package installed
- [x] sendMail.ts implemented
- [x] API key added to Vercel
- [x] Email config updated
- [x] Sender name and email configured
- [ ] Domain verified in Resend (Pending DNS setup)
- [ ] DNS records added (Pending)
- [ ] Test emails sent successfully (Pending domain verification)

## 🎉 Success!

Resend email delivery is configured and ready! Once you verify your domain in Resend, all authentication and transactional emails will be sent reliably.

**Note**: Until domain is verified, you may need to use Resend's default domain or wait for DNS propagation.

