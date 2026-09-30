@echo off
setlocal enabledelayedexpansion
echo ========================================================
echo   CYBERSHIELD — SUPABASE & DEFENSE PLATFORM LAUNCHER
echo ========================================================
echo.

set PROFILE=dev
set DB_INFO=Local In-Memory Database (H2)

:: Read root .env file if available
if exist .env (
    for /f "tokens=1,* delims==" %%A in (.env) do (
        set line=%%A
        if not "!line:~0,1!"=="#" (
            if "%%A"=="SUPABASE_DB_PASSWORD" (
                if not "%%B"=="" if not "%%B"=="your-database-password" (
                    set SUPABASE_DB_PASSWORD=%%B
                    set PROFILE=supabase
                    set DB_INFO=Supabase Managed PostgreSQL (ndoyiyfevnpqdvcsommy.supabase.co)
                )
            )
            if "%%A"=="SPRING_PROFILES_ACTIVE" (
                if "%%B"=="supabase" if defined SUPABASE_DB_PASSWORD (
                    set PROFILE=supabase
                )
            )
        )
    )
)

echo [DATABASE] Using profile: !PROFILE!
echo [DATABASE] Target: !DB_INFO!
if "!PROFILE!"=="dev" (
    echo [TIP] To connect backend to live Supabase Postgres, set your SUPABASE_DB_PASSWORD in .env
)
echo.

if "!PROFILE!"=="supabase" (
    start "CyberShield Backend API (Supabase PostgreSQL - Port 8080)" cmd /k "cd backend && java -jar target/cybershield-backend-1.0.0.jar --spring.profiles.active=supabase --spring.datasource.url=\"jdbc:postgresql://db.ndoyiyfevnpqdvcsommy.supabase.co:5432/postgres?sslmode=require\" --spring.datasource.username=postgres --spring.datasource.password=\"!SUPABASE_DB_PASSWORD!\" --spring.datasource.driver-class-name=org.postgresql.Driver --spring.flyway.validate-on-migrate=false"
) else (
    start "CyberShield Backend API (Dev H2 - Port 8080)" cmd /k "cd backend && java "-Dspring.profiles.active=dev" "-Dspring.datasource.driver-class-name=org.h2.Driver" "-Dspring.datasource.url=jdbc:h2:mem:cybershield;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE" -jar target/cybershield-backend-1.0.0.jar"
)

start "CyberShield Frontend UI" cmd /k "cd frontend && npm run dev"

echo CyberShield Backend API:  http://localhost:8080
echo CyberShield Frontend Web: http://localhost:5174
echo.
echo Press any key to exit this launcher window...
pause > nul

