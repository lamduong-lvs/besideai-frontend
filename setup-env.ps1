# Setup Environment Variables for Vercel
$projectId = "prj_drULofGjhZuwVIPFq0U4slBTkkQY"
$teamId = "team_6Jzy8AoBF3835V2Usk9Tz9pv"

# Database URL
$DATABASE_URL = "postgresql://postgres.jzwiqnrxyyxznwttswoc:Dv007009lvs@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

# Auth
$NEXTAUTH_SECRET = "XwwOGt3dQuaqfcn4j3nQCPqCrNhcPTght2f5EqBftjo="
$NEXTAUTH_URL = "https://besideai.work"
$NEXT_PUBLIC_APP_URL = "https://besideai.work"

# Google Auth
$GOOGLE_CLIENT_ID = "231692293394-5v3o1utvr68t42d6vhfc5nsn1tn8mc2o.apps.googleusercontent.com"
$GOOGLE_CLIENT_SECRET = "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"

# Sign in enabled
$NEXT_PUBLIC_SIGNIN_ENABLED = "true"

Write-Host "Adding environment variables to Vercel..."
Write-Host "Note: You'll need to confirm each variable as sensitive (y)"

# Add variables
echo y | vercel env add DATABASE_URL production --scope $teamId
echo y | vercel env add NEXTAUTH_SECRET production --scope $teamId
echo y | vercel env add NEXTAUTH_URL production --scope $teamId
echo y | vercel env add NEXT_PUBLIC_APP_URL production --scope $teamId
echo y | vercel env add GOOGLE_CLIENT_ID production --scope $teamId
echo y | vercel env add GOOGLE_CLIENT_SECRET production --scope $teamId
echo y | vercel env add NEXT_PUBLIC_SIGNIN_ENABLED production --scope $teamId

Write-Host "Environment variables added successfully!"

