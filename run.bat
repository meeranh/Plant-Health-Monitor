@echo off
title Foolproof Branch - Next.js Dev Server
echo ================================
echo  Foolproof Branch Development
================================
echo.

echo Installing dependencies...
pnpm i
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo Starting Next.js development server...
echo Press Ctrl+C to stop the server
echo.
pnpm run dev

echo.
echo Development server stopped.
pause
