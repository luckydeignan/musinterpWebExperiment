@echo off
echo ========================================
echo   Reading Experiment Server
echo ========================================
echo.
echo Starting server on http://localhost:8000
echo.

REM Try Node.js first (using our simple server)
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using Node.js server...
    timeout /t 2 /nobreak >nul
    start http://localhost:8000/experiment.html
    node server.js
    goto :end
)

REM Try npx http-server
where npx >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using npx http-server...
    timeout /t 2 /nobreak >nul
    start http://localhost:8000/experiment.html
    npx --yes http-server -p 8000 --cors
    goto :end
)

REM Fall back to Python
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using Python server...
    timeout /t 2 /nobreak >nul
    start http://localhost:8000/experiment.html
    python -m http.server 8000
    goto :end
)

echo.
echo ERROR: No suitable server found!
echo Please install Node.js or Python to run the server.
echo.
pause

:end

