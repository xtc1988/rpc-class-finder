@echo off
setlocal enabledelayedexpansion
chcp 932 > nul 2>&1
echo ======================================
echo RPC Class Finder Initial Setup
echo ======================================
echo.

REM Check if Node.js is installed
where node > nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed.
    echo.
    echo Please download and install Node.js from:
    echo https://nodejs.org/
    echo.
    echo Recommended: Download LTS version
    echo.
    pause
    start https://nodejs.org/
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo.

echo npm version:
npm --version
echo.

echo ======================================
echo Installing dependencies...
echo ======================================
echo.
echo This may take a few minutes.
echo Please wait...
echo.

npm install

if errorlevel 1 (
    echo.
    echo [ERROR] Error occurred during installation.
    echo.
    echo Please check:
    echo 1. Internet connection
    echo 2. Firewall settings for npm
    echo.
    pause
    exit /b 1
)

echo.
echo ======================================
echo [OK] Setup completed successfully!
echo ======================================
echo.
echo Next steps:
echo 1. Double-click start.bat to launch the app
echo 2. To edit CSV files, check public/csv folder
echo.
pause