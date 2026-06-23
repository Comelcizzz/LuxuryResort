@echo off
setlocal
cd /d "%~dp0"

net session >nul 2>&1
if not "%errorlevel%"=="0" (
    echo Requesting administrator permission...
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$launcher = '%~f0'; Start-Process -FilePath $launcher -Verb RunAs"
    exit /b
)

echo Starting Luxury Resort installer...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0install-and-run.ps1"
set "INSTALL_EXIT=%errorlevel%"
echo.
echo If the browser did not open, go to:
echo http://localhost:5173
echo.

if not "%INSTALL_EXIT%"=="0" (
    echo Installer finished with an error. Check installer.log.
    echo Type exit and press Enter to close this window.
) else (
    echo Project is running.
    echo Keep this window open while using the site.
    echo Type exit and press Enter to stop the project and close this window.
)

:WAIT_FOR_EXIT
set "USER_COMMAND="
set /p USER_COMMAND="> "
if /i "%USER_COMMAND%"=="exit" goto STOP_PROJECT
echo Type exit and press Enter when you want to stop the project.
goto WAIT_FOR_EXIT

:STOP_PROJECT
echo Stopping Luxury Resort containers...
docker compose -p luxuryresort --profile app down
echo Done.
