@echo off
echo ========================================
echo   RailAssist - Quick Start
echo ========================================
echo.

echo [1/3] Installing server dependencies...
cd server
call npm install
echo.

echo [2/3] Installing client dependencies...
cd ../client
call npm install
echo.

echo [3/3] Setup complete!
echo.
echo ========================================
echo   To run the application:
echo ========================================
echo.
echo 1. Start MongoDB:
echo    mongod
echo.
echo 2. Seed the database (first time only):
echo    cd server
echo    npm run seed
echo.
echo 3. Start backend server:
echo    cd server
echo    npm run dev
echo.
echo 4. Start frontend (new terminal):
echo    cd client
echo    npm run dev
echo.
echo ========================================
echo   Demo URLs:
echo ========================================
echo.
echo   Home: http://localhost:5173
echo   Passenger Demo: http://localhost:5173/passenger/12627-S5-42
echo   Staff Login: http://localhost:5173/staff/login
echo   Admin Login: http://localhost:5173/admin/login
echo.
echo   Demo Accounts:
echo   - Staff: staff@railassist.com / Staff@123
echo   - Admin: admin@railassist.com / Admin@123
echo.
pause
