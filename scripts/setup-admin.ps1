# Create admin-only user (for /admin RSVP dashboard, no Master access)
# Usage: .\scripts\setup-admin.ps1 -Email "admin@gmail.com" -Password "YourSecurePassword"
# Add SUPABASE_SERVICE_ROLE_KEY to .env.local (local) or Vercel env vars (production)

param(
    [Parameter(Mandatory=$true)]
    [string]$Email,
    [Parameter(Mandatory=$true)]
    [string]$Password,
    [string]$Url = "http://localhost:3000"
)

$body = @{ email = $Email; password = $Password } | ConvertTo-Json
Write-Host "Calling $Url/api/setup-admin ..."
try {
    $response = Invoke-RestMethod -Uri "$Url/api/setup-admin" -Method Post -Body $body -ContentType "application/json"
    Write-Host "Success: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) { Write-Host $_.ErrorDetails.Message -ForegroundColor Red }
}
