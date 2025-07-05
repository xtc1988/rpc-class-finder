@echo off
setlocal enabledelayedexpansion
chcp 932 > nul 2>&1
echo ======================================
echo RPC Class Finder Startup Script
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
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    echo This may take a few minutes.
    echo.
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencies installed successfully!
    echo.
) else (
    echo [OK] Dependencies are already installed
    echo.
)

echo ======================================
echo Starting server...
echo ======================================
echo.
echo Browser will open automatically in 5 seconds...
echo.
echo To exit, close this window or press Ctrl+C.
echo.

REM Wait 5 seconds then open browser
timeout /t 5 /nobreak > nul
start http://localhost:3000

REM Start server
npm run dev:renderer