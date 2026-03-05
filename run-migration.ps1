# PowerShell script to run migration via Supabase API
$ErrorActionPreference = "Stop"

# Load environment variables
$envContent = Get-Content .env -Raw
$SUPABASE_URL = ($envContent | Select-String -Pattern 'VITE_SUPABASE_URL=(.+)' | ForEach-Object { $_.Matches.Groups[1].Value }).Trim()
$SUPABASE_SERVICE_KEY = ($envContent | Select-String -Pattern 'SUPABASE_SERVICE_ROLE_KEY=(.+)' | ForEach-Object { $_.Matches.Groups[1].Value }).Trim()

Write-Host "Reading migration file..." -ForegroundColor Cyan
$migrationSQL = Get-Content "supabase/migrations/20260228000100_fix_all_critical_errors.sql" -Raw

Write-Host "Connecting to Supabase..." -ForegroundColor Cyan
Write-Host "URL: $SUPABASE_URL" -ForegroundColor Gray

# Execute SQL via Supabase REST API
$headers = @{
    "apikey" = $SUPABASE_SERVICE_KEY
    "Authorization" = "Bearer $SUPABASE_SERVICE_KEY"
    "Content-Type" = "application/json"
}

$body = @{
    query = $migrationSQL
} | ConvertTo-Json

try {
    Write-Host "Executing migration..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/rpc/exec_sql" -Method Post -Headers $headers -Body $body
    Write-Host "✅ Migration executed successfully!" -ForegroundColor Green
    Write-Host $response
} catch {
    Write-Host "❌ Migration failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Try alternative approach - split into statements
    Write-Host "`nTrying alternative approach (statement by statement)..." -ForegroundColor Yellow
    
    $statements = $migrationSQL -split ';' | Where-Object { $_.Trim() -ne '' }
    $successCount = 0
    $failCount = 0
    
    foreach ($statement in $statements) {
        $trimmed = $statement.Trim()
        if ($trimmed -eq '' -or $trimmed.StartsWith('--')) { continue }
        
        try {
            $stmtBody = @{ query = $trimmed + ';' } | ConvertTo-Json
            Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/rpc/exec_sql" -Method Post -Headers $headers -Body $stmtBody | Out-Null
            $successCount++
            Write-Host "✓" -NoNewline -ForegroundColor Green
        } catch {
            $failCount++
            Write-Host "✗" -NoNewline -ForegroundColor Red
            Write-Host "`nFailed statement: $($trimmed.Substring(0, [Math]::Min(100, $trimmed.Length)))..." -ForegroundColor Red
            Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host "`n`nResults: $successCount succeeded, $failCount failed" -ForegroundColor Cyan
    
    if ($failCount -gt 0) {
        exit 1
    }
}
