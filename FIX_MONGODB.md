# Fix MongoDB Connection Error

## Problem: MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017

MongoDB Server is not installed/running. You have Compass but not the Server.

## Quick Fix: Install MongoDB Server

1. Download from: https://www.mongodb.com/try/download/community
   - Select: Windows, Version 7.0, MSI

2. Run installer:
   - Choose "Complete"
   - CHECK "Install MongoDB as a Service"
   - Click Install

3. After install, MongoDB runs automatically

4. Verify:
   Get-Service MongoDB

## Alternative: Use MongoDB Atlas (No Installation!)

1. Go to: https://www.mongodb.com/atlas/database
2. Sign up FREE
3. Create cluster (M0 free tier)
4. Get connection string
5. Update server/.env with your Atlas connection string

## Then Run Your App

1. cd server && npm run seed
2. cd server && npm run dev
3. cd client && npm run dev
4. Open: http://localhost:5173/passenger/12627-S5-42
