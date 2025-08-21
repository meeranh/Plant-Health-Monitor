@echo off
echo Switching to foolproof branch and starting development server...
git pull origin foolproof
git checkout foolproof
if %errorlevel% neq 0 (
    echo Error: Failed to checkout foolproof branch
    pause
    exit /b 1
)
echo Starting Next.js development server on fallback branch...
pnpm i
pnpm run dev
pause
