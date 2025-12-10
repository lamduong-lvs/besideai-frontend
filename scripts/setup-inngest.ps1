# Inngest Setup Script for Windows PowerShell
# This script helps you add INNGEST_EVENT_KEY to Vercel

Write-Host "=== Inngest Setup Script ===" -ForegroundColor Cyan
Write-Host ""

# Check if event key is provided
if ($args.Count -eq 0) {
    Write-Host "Usage: .\scripts\setup-inngest.ps1 YOUR_EVENT_KEY" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To get your event key:" -ForegroundColor Yellow
    Write-Host "1. Sign up at https://www.inngest.com/" -ForegroundColor White
    Write-Host "2. Create a new app in dashboard" -ForegroundColor White
    Write-Host "3. Go to Settings → Keys" -ForegroundColor White
    Write-Host "4. Copy your Event Key (starts with 'inn_')" -ForegroundColor White
    Write-Host ""
    exit 1
}

$eventKey = $args[0]

# Validate event key format
if (-not $eventKey.StartsWith("inn_")) {
    Write-Host "⚠️  Warning: Event key should start with 'inn_'" -ForegroundColor Yellow
    Write-Host "   Continuing anyway..." -ForegroundColor Yellow
    Write-Host ""
}

# Add to Vercel
Write-Host "Adding INNGEST_EVENT_KEY to Vercel Production..." -ForegroundColor Cyan
Write-Host ""

try {
    $eventKey | vercel env add INNGEST_EVENT_KEY production
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Successfully added INNGEST_EVENT_KEY to Vercel!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Deploy to production: vercel deploy --prod" -ForegroundColor White
        Write-Host "2. Check Inngest dashboard: https://app.inngest.com" -ForegroundColor White
        Write-Host "3. Verify functions are synced" -ForegroundColor White
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

