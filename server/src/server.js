import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { setupSocket } from './socket/socketHandler.js';

import authRoutes from './routes/authRoutes.js';
import trainRoutes from './routes/trainRoutes.js';
import coachRoutes from './routes/coachRoutes.js';
import seatRoutes from './routes/seatRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import staffRoutes from './routes/staffRoutes.js';

import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/staff', staffRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'RailAssist API is running' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`RailAssist Server running on port ${PORT}`);
});

const io = setupSocket(server);

connectDB();

export { io };
