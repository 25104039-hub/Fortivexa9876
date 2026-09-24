@echo off
title FORTIVEXA - SIH 2026 TRL 5 Prototype Launcher
cls
echo ========================================================================
echo   FORTIVEXA : Cybercrime Predictive Intelligence Platform
echo   Smart India Hackathon 2026 Final Round Prototype
echo   Problem Statement: SIH26184 ^| Team: 25 (FORTIVEXA)
echo   Level: TRL 5 - Technology Validated in Relevant Environment
echo ========================================================================
echo.
echo Launching local server and opening web browser...
echo.
python "%~dp0run_prototype.py"
if %errorlevel% neq 0 (
    echo.
    echo [!] Python command failed. Attempting py launcher...
    py "%~dp0run_prototype.py"
)
pause
