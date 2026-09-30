@echo off
setlocal enabledelayedexpansion
echo ========================================================
echo   CYBERSHIELD — SUPABASE PRODUCTION DATABASE LAUNCHER
echo ========================================================
echo.
echo Connecting Spring Boot to Supabase Managed PostgreSQL:
echo Host: db.ndoyiyfevnpqdvcsommy.supabase.co:5432
echo Database: postgres
echo.

:: Check .env
if exist .env (
    for /f "tokens=1,* delims==" %%A in (.env) do (
        if "%%A"=="SUPABASE_DB_PASSWORD" (
            if not "%%B"=="" if not "%%B"=="your-database-password" (
                set SUPABASE_DB_PASSWORD=%%B
            )
        )
    )
)

if not defined SUPABASE_DB_PASSWORD (
    echo [PROMPT] Please enter your Supabase Database Password:
    set /p SUPABASE_DB_PASSWORD=
)

if "!SUPABASE_DB_PASSWORD!"=="" (
    echo [ERROR] Database password is required to connect to Supabase PostgreSQL.
    echo Please set SUPABASE_DB_PASSWORD in .env or run in dev mode with run.bat
    pause
    exit /b 1
)

echo [OK] Starting Spring Boot Backend with Supabase Profile...
start "CyberShield Backend API (Supabase PostgreSQL - Port 8080)" cmd /k "cd backend && java -jar target/cybershield-backend-1.0.0.jar --spring.profiles.active=supabase --spring.datasource.url=\"jdbc:postgresql://db.ndoyiyfevnpqdvcsommy.supabase.co:5432/postgres?sslmode=require\" --spring.datasource.username=postgres --spring.datasource.password=\"!SUPABASE_DB_PASSWORD!\" --spring.datasource.driver-class-name=org.postgresql.Driver --spring.flyway.validate-on-migrate=false"

start "CyberShield Frontend UI" cmd /k "cd frontend && npm run dev"

echo.
echo CyberShield Backend API:  http://localhost:8080
echo CyberShield Frontend Web: http://localhost:5174
echo.
echo Press any key to exit this launcher window...
pause > nul
