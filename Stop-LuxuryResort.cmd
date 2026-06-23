@echo off
setlocal
cd /d "%~dp0"
docker compose -p luxuryresort --profile app down
pause

