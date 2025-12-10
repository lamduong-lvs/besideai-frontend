# Super Admin Setup Script for Windows PowerShell
# This script helps you add SUPER_ADMIN_EMAILS to Vercel

Write-Host "=== Super Admin Setup Script ===" -ForegroundColor Cyan
Write-Host ""

# Check if email is provided
if ($args.Count -eq 0) {
    Write-Host "Usage: .\scripts\setup-super-admin.ps1 EMAIL1 [EMAIL2] [EMAIL3] ..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  Single admin: .\scripts\setup-super-admin.ps1 admin@besideai.work" -ForegroundColor White
    Write-Host "  Multiple admins: .\scripts\setup-super-admin.ps1 admin1@besideai.work admin2@besideai.work" -ForegroundColor White
    Write-Host ""
    Write-Host "Important:" -ForegroundColor Yellow
    Write-Host "  - Use the exact email you'll sign in with (case-sensitive)" -ForegroundColor White
    Write-Host "  - Multiple emails should be comma-separated" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Join emails with commas (no spaces)
$emails = $args -join ","

Write-Host "Adding SUPER_ADMIN_EMAILS to Vercel Production..." -ForegroundColor Cyan
Write-Host "Emails: $emails" -ForegroundColor Gray
Write-Host ""

try {
    $emails | vercel env add SUPER_ADMIN_EMAILS production
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Successfully added SUPER_ADMIN_EMAILS to Vercel!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Deploy to production: vercel deploy --prod" -ForegroundColor White
        Write-Host "2. Sign in with one of these emails: $emails" -ForegroundColor White
        Write-Host "3. Visit: https://besideai.work/super-admin" -ForegroundColor White
        Write-Host ""
        Write-Host "⚠️  Remember: Email matching is case-sensitive!" -ForegroundColor Yellow
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "❌ Failed to add environment variable" -ForegroundColor Red
        Write-Host "   Please check your Vercel CLI authentication" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host ""
    Write-Host "❌ Error: $_" -ForegroundColor Red
    exit 1
}

