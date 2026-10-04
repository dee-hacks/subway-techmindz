# MongoDB Installation Guide for Windows

## Option 1: Install MongoDB Community Edition (Recommended)

### Step 1: Download MongoDB

1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - Version: 7.0 (or latest)
   - Platform: Windows
   - Package: MSI
3. Download the installer

### Step 2: Install MongoDB

1. Run the downloaded `.msi` file
2. Choose "Complete" installation
3. Check "Install MongoDB as a Service" (recommended)
4. Check "Install MongoDB Compass" (optional GUI tool)
5. Click "Install"
6. Wait for installation to complete

### Step 3: Verify Installation

Open a new PowerShell window and run:
```bash
mongod --version
```

You should see the MongoDB version information.

### Step 4: Start MongoDB

If installed as a service (recommended):
```bash
# MongoDB should start automatically
# To check status:
Get-Service -Name MongoDB

# To start if not running:
Start-Service -Name MongoDB
```

If NOT installed as a service:
```bash
# Create data directory
mkdir C:\data\db

# Start MongoDB
mongod --dbpath C:\data\db
```

Keep this terminal running! MongoDB needs to stay running.

### Step 5: Verify MongoDB is Running

Open another terminal and run:
```bash
mongosh
```

If you see `test>` prompt, MongoDB is running successfully!
Type `exit` to quit.

---

## Option 2: Use MongoDB Atlas (Cloud - No Installation!)

If you don't want to install MongoDB locally, use MongoDB Atlas cloud database:

### Step 1: Create Free Account

1. Go to: https://www.mongodb.com/atlas/database
2. Sign up for free
3. Create a new cluster (choose FREE tier)

### Step 2: Get Connection String

1. Click "Connect" on your cluster
2. Choose "Drivers"
3. Copy the connection string
4. It will look like:
   ```
   mongodb+srv://username:password@cluster0.mongodb.net/railassist?retryWrites=true&w=majority
   ```

### Step 3: Update server/.env

Replace the MONGO_URI line with your Atlas connection string:
```env
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/railassist?retryWrites=true&w=majority
```

### Step 4: Whitelist IP Address

1. In Atlas dashboard, go to "Network Access"
2. Click "Add IP Address"
3. Add your IP or use 0.0.0.0/0 for testing (allows any IP)

### Step 5: Create Database User

1. In Atlas, go to "Database Access"
2. Click "Add New Database User"
3. Create username and password
4. Grant "Read and write to any database" permission

---

## Option 3: Quick Alternative - Install via Chocolatey

If you have Chocolatey package manager:

```bash
# Install MongoDB
choco install mongodb

# Start MongoDB
net start MongoDB
```

---

## After MongoDB is Installed

### 1. Seed the Database

```bash
cd "C:\Users\G V Sai Santosh\.cline\data\workspaces\chat\railassist\server"
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

### 2. Start the Backend

```bash
cd "C:\Users\G V Sai Santosh\.cline\data\workspaces\chat\railassist\server"
npm run dev
```

You should see:
```
RailAssist Server running on port 5000
MongoDB Connected: 127.0.0.1
```

### 3. Start the Frontend

Open a NEW terminal:
```bash
cd "C:\Users\G V Sai Santosh\.cline\data\workspaces\chat\railassist\client"
npm run dev
```

You should see:
```
Local: http://localhost:5173/
```

---

## Verification Steps

### Check MongoDB Service (if installed as service)
```bash
Get-Service -Name MongoDB
```
Should show Status: Running

### Test MongoDB Connection
```bash
mongosh
```
Should open MongoDB shell with `test>` prompt

### Test Backend Server
```bash
curl http://localhost:5000/api/health
```
Should return: `{"status":"OK","message":"RailAssist API is running"}`

### Test Frontend
Open browser: http://localhost:5173
Should show RailAssist home page

---

## Common Issues & Solutions

### Issue: "MongoDB service won't start"
**Solution:** 
```bash
# Check logs
Get-Content "C:\Program Files\MongoDB\Server\7.0\log\mongod.log" -Tail 50

# Or start manually to see errors
mongod --dbpath C:\data\db
```

### Issue: "Port 27017 already in use"
**Solution:** Another MongoDB instance is running. Stop it or use different port.

### Issue: "Cannot connect to MongoDB from backend"
**Solution:** 
1. Check MongoDB is running: `Get-Service MongoDB`
2. Verify MONGO_URI in server/.env is correct
3. Check firewall settings

### Issue: "mongosh command not found"
**Solution:** Add MongoDB bin folder to PATH:
```
C:\Program Files\MongoDB\Server\7.0\bin
```

---

## Quick Start (After MongoDB Installation)

```bash
# Terminal 1: Start MongoDB (if not running as service)
mongod --dbpath C:\data\db

# Terminal 2: Start Backend
cd "C:\Users\G V Sai Santosh\.cline\data\workspaces\chat\railassist\server"
npm run dev

# Terminal 3: Start Frontend
cd "C:\Users\G V Sai Santosh\.cline\data\workspaces\chat\railassist\client"
npm run dev
```

---

## Using MongoDB Atlas (Recommended for Testing)

If you choose Option 2 (MongoDB Atlas):

1. Update `server/.env`:
```env
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/railassist?retryWrites=true&w=majority
```

2. No need to start local MongoDB!
3. Just run backend and frontend as usual

---

## Need Help?

- MongoDB Docs: https://docs.mongodb.com/manual/tutorial/
- MongoDB Community: https://www.mongodb.com/community
- Atlas Docs: https://docs.atlas.mongodb.com/

---

## ✅ Once MongoDB is Running

You can proceed with:
1. `npm run seed` - Create demo data
2. `npm run dev` - Start the application
3. Open http://localhost:5173/passenger/12627-S5-42
4. Enjoy the RailAssist prototype! 🚆
