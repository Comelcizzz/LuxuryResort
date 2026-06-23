@echo off
setlocal EnableExtensions

rem Maven Enforcer + Spring Boot need JDK 21. This script:
rem   1) Uses JAVA_HOME if it already points at a jdk-21* install
rem   2) Else searches Program Files for Eclipse Adoptium / Microsoft jdk-21*
rem   3) Prepends that JDK to PATH so mvnw uses it

set "JAVA21="
if defined JAVA_HOME (
  echo "%JAVA_HOME%" | findstr /I "jdk-21" >nul
  if not errorlevel 1 if exist "%JAVA_HOME%\bin\java.exe" set "JAVA21=%JAVA_HOME%"
)

if not defined JAVA21 (
  for /d %%D in ("%ProgramFiles%\Eclipse Adoptium\jdk-21*") do (
    if exist "%%~D\bin\java.exe" (
      set "JAVA21=%%~D"
      goto :found
    )
  )
  for /d %%D in ("%ProgramFiles%\Microsoft\jdk-21*") do (
    if exist "%%~D\bin\java.exe" (
      set "JAVA21=%%~D"
      goto :found
    )
  )
)
:found

if not defined JAVA21 (
  echo.
  echo === JDK 21 not found ===
  echo Install Temurin 21: https://adoptium.net/temurin/releases/?version=21
  echo Choose Windows x64, MSI, then reopen CMD.
  echo Or set manually in this window ^(path must contain jdk-21...^):
  echo   set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.xx.x-hotspot"
  echo   set "PATH=%%JAVA_HOME%%\bin;%%PATH%%"
  echo.
  exit /b 1
)

set "JAVA_HOME=%JAVA21%"
set "PATH=%JAVA21%\bin;%PATH%"

echo Using JDK 21:
echo JAVA_HOME=%JAVA_HOME%
"%JAVA_HOME%\bin\java.exe" -version
echo.

pushd "%~dp0..\..\backend" || exit /b 1
call mvnw.cmd clean spring-boot:run %*
set "ERR=%ERRORLEVEL%"
popd
exit /b %ERR%
