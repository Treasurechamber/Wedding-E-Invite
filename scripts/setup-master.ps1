# One-time setup: create master user in Supabase Auth + master_users table
# Usage: .\scripts\setup-master.ps1 -Email "master@gmail.com" -Password "YourSecurePassword"
#        .\scripts\setup-master.ps1 -Email "master@gmail.com" -Password "YourSecurePassword" -Url "https://wedding-e-invite-n3.vercel.app"
# Add SUPABASE_SERVICE_ROLE_KEY to .env.local (local) or Vercel env vars (production)

param(
    [Parameter(Mandatory=$true)]
    [string]$Email,
    [Parameter(Mandatory=$true)]
    [string]$Password,
    [string]$Url = "http://localhost:3000"
)

$body = @{ email = $Email; password = $Password } | ConvertTo-Json
Write-Host "Calling $Url/api/setup-master ..."
try {
    $response = Invoke-RestMethod -Uri "$Url/api/setup-master" -Method Post -Body $body -ContentType "application/json"
    Write-Host "Success: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) { Write-Host $_.ErrorDetails.Message -ForegroundColor Red }
}
