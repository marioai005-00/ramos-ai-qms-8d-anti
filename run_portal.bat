@echo off
setlocal
cd /d "%~dp0"
echo ========================================================
echo  AI-QMS 8D Commander - Portal Launcher
echo ========================================================
start "" "%~dp0index.html"
echo [OK] AI 8D Portal launched in default browser.
exit /b 0
