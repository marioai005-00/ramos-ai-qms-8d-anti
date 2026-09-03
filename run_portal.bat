@echo off
setlocal
cd /d "%~dp0"
echo ========================================================
echo  RAMOS AI-QMS 8D Commander - Portal Launcher (Live Update)
echo ========================================================

:: 1. Cleanly restart any running portal server on port 8080
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080" ^| findstr "LISTENING"') do (
  echo [INFO] Terminating outdated server instance (PID: %%a)...
  taskkill /F /PID %%a >nul 2>nul
)

:: 2. Launch fresh portal_server.py in background
echo [INFO] Starting latest RAMOS AI-QMS portal server...
where pythonw >nul 2>nul
if errorlevel 1 (
  start "RAMOS AI-QMS Portal" /min python "%~dp0portal_server.py"
) else (
  start "" pythonw "%~dp0portal_server.py"
)

:: Wait 2 seconds for server to bind port
timeout /t 2 /nobreak >nul

:: 3. Launch browser directly to localhost:8080
echo [INFO] Launching default browser to http://localhost:8080 ...
start http://localhost:8080

echo [OK] Latest AI-QMS 8D Portal is now running with zero caching.
exit /b 0
