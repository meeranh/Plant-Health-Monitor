@echo off
title Switching to Main Branch
echo ================================
echo    Switching to Main Branch
echo ================================
echo.

echo Checking for uncommitted changes...
git diff-index --quiet HEAD --
if %errorlevel% neq 0 (
    echo Found uncommitted changes, stashing them...
    git stash push -m "Auto-stash before switching to main - %date% %time%"
)

echo Pulling latest main branch...
git pull origin main
if %errorlevel% neq 0 (
    echo ERROR: Failed to pull main branch
    pause
    exit /b 1
)

echo Switching to main branch...
git checkout main
if %errorlevel% neq 0 (
    echo ERROR: Failed to checkout main branch
    pause
    exit /b 1
)

echo Successfully switched to main branch!
echo You can now run run.bat to start the development server.
pause
