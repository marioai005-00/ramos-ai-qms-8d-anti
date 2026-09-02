@echo off
setlocal
cd /d "%~dp0"
echo ========================================================
echo  AI-QMS 8D Commander - Portal Launcher
echo ========================================================
where pythonw >nul 2>nul
if errorlevel 1 (
  start "AI-QMS Portal" python "%~dp0portal_server.py"
) else (
  start "" pythonw "%~dp0portal_server.py"
)
echo [OK] Latest AI 8D Portal is opening at localhost.
echo      On the dashboard, click the D1-D8 example button.
exit /b 0
