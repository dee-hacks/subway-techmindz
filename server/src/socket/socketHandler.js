import { Server } from 'socket.io';
import { setIO } from './io.js';

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  setIO(io);

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_staff_room', () => {
      socket.join('staff_room');
      console.log(`Staff joined room: ${socket.id}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
