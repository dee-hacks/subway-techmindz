# 🚆 RailAssist - Setup Guide

## Project Location
```
C:\Users\G V Sai Santosh\.cline\data\workspaces\chat\railassist
```

## Step-by-Step Installation

### 1. Open PowerShell or Command Prompt

### 2. Navigate to the project folder
```bash
cd "C:\Users\G V Sai Santosh\.cline\data\workspaces\chat\railassist"
```
cd ../
### 3. Install Server Dependencies
```bash
cd server
npm install
```
⏱️ This may take 2-3 minutes. Wait for it to complete.

### 4. Install Client Dependencies
```bash
cd ../client
npm install
```
⏱️ This may take 3-5 minutes. Wait for it to complete.

### 5. Verify MongoDB is Running
Make sure MongoDB is installed and running on your system:
```bash
# Check if MongoDB is running
mongosh
```
If it connects, MongoDB is running. Press Ctrl+C to exit.

### 6. Seed the Database (First Time Only)
```bash
cd server
npm run seed
```

You should see:
```
=== SEED DATA CREATED SUCCESSFULLY ===

Demo Accounts:
Admin: admin@railassist.com / Admin@123
Staff: staff@railassist.com / Staff@123

Sample Train:
Train: 12627 - Karnataka Express
Coaches: S1, S2, S3, S4, S5
Total Seats: 100
```

### 7. Start the Backend Server
Open a terminal and run:
```bash
cd "C:\Users\G V Sai Santosh\.cline\data\workspaces\chat\railassist\server"
npm run dev
```

You should see:
```
RailAssist Server running on port 5000
MongoDB Connected: 127.0.0.1
```

Keep this terminal running.

### 8. Start the Frontend Application
Open a **new** terminal window and run:
```bash
cd "C:\Users\G V Sai Santosh\.cline\data\workspaces\chat\railassist\client"
npm run dev
```

You should see:
```
VITE v5.0.0  ready in 300 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## 🎯 Access the Application

Open your browser and navigate to:

### For Passengers
```
http://localhost:5173/passenger/12627-S5-42
http://localhost:5173/passenger/12627-S1-01
```

### For Staff
```
http://localhost:5173/staff/login
```
- Email: `staff@railassist.com`
- Password: `Staff@123`

### For Admin
```
http://localhost:5173/admin/login
```
- Email: `admin@railassist.com`
- Password: `Admin@123`

## 🧪 Test the Complete Flow

### Demo Scenario

1. **Open Passenger Interface**
   - Go to: http://localhost:5173/passenger/12627-S5-42

2. **Submit an Emergency Request**
   - Click the red "EMERGENCY" button
   - Select "Personal Safety"
   - Click "SEND SOS"
   - Confirm the emergency

3. **Watch Staff Dashboard**
   - Open another browser window
   - Go to: http://localhost:5173/staff/login
   - Login with: staff@railassist.com / Staff@123
   - See the emergency request appear instantly!

4. **Manage the Request**
   - Click "Accept" → Status becomes ACCEPTED
   - Click "Start Response" → Status becomes IN_PROGRESS
   - Click "Resolve" → Status becomes RESOLVED

5. **Check Passenger Status**
   - Go back to passenger window
   - Click "Track your request status"
   - See the status updated!

## 📋 Troubleshooting

### Port Already in Use
If port 5000 or 5173 is already in use:

**Backend:**
Edit `server/.env`:
```
PORT=5001
```

**Frontend:**
Edit `client/vite.config.js`:
```javascript
server: {
  port: 5174,
  // ...
}
```

### MongoDB Not Running
Start MongoDB:
```bash
# Windows
net start MongoDB

# Or if installed as a service
mongod --dbpath "C:\data\db"
```

### Dependencies Installation Fails
Delete node_modules and package-lock.json, then reinstall:
```bash
# In server directory
rm -rf node_modules package-lock.json
npm install

# In client directory
rm -rf node_modules package-lock.json
npm install
```

### Reset Database
To clear and reseed the database:
```bash
cd server
npm run seed
```

## 📁 Project Structure

The project is located at:
```
C:\Users\G V Sai Santosh\.cline\data\workspaces\chat\railassist\
├── client\                    # React frontend
│   ├── src\
│   │   ├── pages\            # 15 pages
│   │   ├── services\         # API & Socket services
│   │   └── context\          # Auth context
│   └── package.json
├── server\                    # Node.js backend
│   ├── src\
│   │   ├── controllers\      # 6 controllers
│   │   ├── models\           # 5 Mongoose models
│   │   ├── routes\           # 6 route files
│   │   └── seed\             # Database seed script
│   └── package.json
└── README.md
```

## 🎓 What You Can Do

### As a Passenger
- Scan QR codes (simulated by URL)
- View train/coach/berth location
- Request assistance (8 categories)
- Send emergency SOS (5 types)
- Track request status

### As Staff
- Login to dashboard
- View real-time requests
- Accept and manage requests
- Filter by priority/status
- Track request lifecycle

### As Admin
- Manage trains (add/edit/delete)
- Manage coaches per train
- Manage seats and QR codes
- Manage staff accounts
- View system statistics
- Generate QR codes

## 🚀 Features Demonstrated

✅ QR-based location identification
✅ 8 assistance categories
✅ 5 emergency types with SOS
✅ Real-time Socket.IO updates
✅ Request lifecycle management
✅ Staff dashboard with filtering
✅ Admin CRUD operations
✅ QR code generation
✅ JWT authentication
✅ Responsive mobile-first design

## 📞 Support

If you encounter issues:
1. Check MongoDB is running
2. Verify ports 5000 and 5173 are available
3. Check terminal output for error messages
4. Ensure all dependencies installed successfully

## 🎉 Ready to Demo!

Once everything is running, you can demonstrate:
1. Passenger scanning QR and submitting emergency
2. Staff receiving it in real-time
3. Staff managing the request lifecycle
4. Passenger seeing status updates
5. Admin managing trains and generating QR codes

Enjoy your RailAssist prototype! 🚆
