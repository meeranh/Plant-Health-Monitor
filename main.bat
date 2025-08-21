@echo off
echo Switching to main branch and starting development server...
git checkout main
if %errorlevel% neq 0 (
    echo Error: Failed to checkout main branch
    pause
    exit /b 1
)
echo Starting Next.js development server on main branch...
pnpm run dev
pause
