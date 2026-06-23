# Run in PowerShell as Administrator.
# Starts PostgreSQL service, sets postgres user password to "postgres" (match backend/.env),
# creates database luxuryresort.
# Prerequisite: pg_hba.conf uses "trust" for local/127.0.0.1/::1 until you run ALTER USER, then revert to scram-sha-256.

$ErrorActionPreference = "Stop"

$serviceName = "postgresql-x64-16"
$psqlCandidates = @(
    "C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files\PostgreSQL\17\bin\psql.exe"
)

$psql = $psqlCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $psql) {
    throw "psql.exe not found. Edit psqlCandidates in this script."
}

Write-Host "Service: $serviceName"
if ((Get-Service -Name $serviceName).Status -ne "Running") {
    Start-Service -Name $serviceName
}
Start-Sleep -Seconds 2

Write-Host "ALTER USER postgres PASSWORD 'postgres' ..."
& $psql -U postgres -h 127.0.0.1 -d postgres -v ON_ERROR_STOP=1 -c "ALTER USER postgres WITH PASSWORD 'postgres';"

Write-Host "CREATE DATABASE luxuryresort (ignore error if exists) ..."
& $psql -U postgres -h 127.0.0.1 -d postgres -c "CREATE DATABASE luxuryresort;" 2>$null

Write-Host ""
Write-Host "Done. Next steps (required):"
Write-Host "1) Edit pg_hba.conf: change trust back to scram-sha-256 for local, 127.0.0.1/32, ::1/128"
Write-Host "2) Restart-Service $serviceName"
Write-Host "3) From repo: cd backend; .\mvnw.cmd spring-boot:run"
Write-Host "4) From repo root: npm run dev:diploma-frontend"
