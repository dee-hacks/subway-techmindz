import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Train from '../models/Train.js';
import Coach from '../models/Coach.js';
import Seat from '../models/Seat.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding');

    await User.deleteMany({});
    await Train.deleteMany({});
    await Coach.deleteMany({});
    await Seat.deleteMany({});

    console.log('Cleared existing data');

    // NOTE: passwords are stored as PLAINTEXT here. The User model's
    // pre('save') hook hashes them automatically, so we must NOT hash
    // them manually here (double-hashing would break login).
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@railassist.com',
      password: 'Admin@123',
      role: 'admin',
      isActive: true
    });

    const staff = await User.create({
      name: 'Staff User',
      email: 'staff@railassist.com',
      password: 'Staff@123',
      role: 'staff',
      assignedTrain: null,
      isActive: true
    });

    console.log('Created demo accounts');

    const train = await Train.create({
      trainNumber: '16516',
      trainName: 'Maland Express',
      source: 'Mysuru',
      destination: 'Madikeri',
      isActive: true
    });

    console.log('Created sample train');

    // Only 3 demo seats are created (everything else is cleared above).
    // Each seat gets a unique QR code and carries its train/coach/seat details.
    const demoSeats = [
      { coachNumber: 'S1', seatNumber: '01', passengerName: 'Aarav Sharma', passengerAge: 34 },
      { coachNumber: 'S1', seatNumber: '02', passengerName: 'Meera Iyer', passengerAge: 28 },
      { coachNumber: 'S2', seatNumber: '01', passengerName: 'Rohan Verma', passengerAge: 45 }
    ];

    // Create only the coaches needed for these 3 seats.
    const coaches = [];
    const coachNumbers = [...new Set(demoSeats.map(s => s.coachNumber))];

    for (const coachNumber of coachNumbers) {
      const coach = await Coach.create({
        trainId: train._id,
        coachNumber,
        coachType: 'Sleeper',
        totalSeats: demoSeats.filter(s => s.coachNumber === coachNumber).length
      });
      coaches.push(coach);
    }

    console.log('Created coaches:', coaches.map(c => c.coachNumber).join(', '));

    // Create exactly the 3 demo seats with their QR codes and passenger info.
    for (const ds of demoSeats) {
      const coach = coaches.find(c => c.coachNumber === ds.coachNumber);
      await Seat.create({
        coachId: coach._id,
        seatNumber: ds.seatNumber,
        qrId: `${train.trainNumber}-${ds.coachNumber}-${ds.seatNumber}`,
        passengerName: ds.passengerName,
        passengerAge: ds.passengerAge,
        isActive: true
      });
    }

    console.log('Created 3 demo seats with QR codes');

    console.log('\n=== SEED DATA CREATED SUCCESSFULLY ===');
    console.log('\nDemo Accounts:');
    console.log('Admin: admin@railassist.com / Admin@123');
    console.log('Staff: staff@railassist.com / Staff@123');
    console.log('\nSample Train:');
    console.log(`Train: ${train.trainNumber} - ${train.trainName}`);
    console.log(`Coaches: ${coaches.map(c => c.coachNumber).join(', ')}`);
    console.log(`Total Seats: ${demoSeats.length}`);
    console.log('\nSample QR Codes (demo passengers):');
    demoSeats.forEach((s) => {
      console.log(`${s.passengerName} (${s.passengerAge}) -> http://localhost:5173/passenger/${train.trainNumber}-${s.coachNumber}-${s.seatNumber}`);
    });

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
