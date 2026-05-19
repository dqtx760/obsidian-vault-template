@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ==============================
echo   Obsidian Vault Git Sync
echo ==============================
echo.

echo [1/3] Pulling latest changes...
git pull origin master
if errorlevel 1 (
    echo Pull failed!
    pause
    exit /b 1
)

echo.
echo [2/3] Staging all changes...
git add -A

echo.
echo [3/3] Committing and pushing...
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set TODAY=%%a-%%b-%%c
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set NOW=%%a%%b
git commit -m "sync %TODAY% %NOW%" 2>nul
if errorlevel 1 (
    echo No new changes to commit.
) else (
    git push origin master
    if errorlevel 1 (
        echo Push failed!
        pause
        exit /b 1
    )
)

echo.
echo ==============================
echo   Sync complete!
echo ==============================
timeout /t 3
