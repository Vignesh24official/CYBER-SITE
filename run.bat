@echo off
echo ========================================================
echo   CYBERSHIELD — STARTING FRONTEND AND BACKEND SERVERS
echo ========================================================
echo.

start "CyberShield Backend API (Port 8080)" cmd /k "cd backend && java "-Dspring.profiles.active=dev" "-Dspring.datasource.driver-class-name=org.h2.Driver" "-Dspring.datasource.url=jdbc:h2:mem:cybershield;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE" -jar target/cybershield-backend-1.0.0.jar"

start "CyberShield Frontend UI" cmd /k "cd frontend && npm run dev"

echo CyberShield Backend API: http://localhost:8080
echo CyberShield Frontend Web UI: http://localhost:5173
echo.
echo Press any key to exit this launcher window...
pause > nul
