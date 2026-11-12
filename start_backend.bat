@echo off
echo ========================================================
echo   Starting Jai Krishna Ram Resort Backend Engine
echo   Port: 5000 (REST API / MakeMyTrip Integration)
echo ========================================================
powershell -ExecutionPolicy Bypass -File "%~dp0backend\run_mock_server.ps1"
pause

