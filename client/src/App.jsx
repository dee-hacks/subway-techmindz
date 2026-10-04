import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Passenger from './pages/Passenger.jsx';
import PassengerRequest from './pages/PassengerRequest.jsx';
import PassengerStatus from './pages/PassengerStatus.jsx';
import Emergency from './pages/Emergency.jsx';
import StaffLogin from './pages/StaffLogin.jsx';
import StaffDashboard from './pages/StaffDashboard.jsx';
import RequestDetails from './pages/RequestDetails.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ManageTrains from './pages/ManageTrains.jsx';
import ManageCoaches from './pages/ManageCoaches.jsx';
import ManageSeats from './pages/ManageSeats.jsx';
import ManageStaff from './pages/ManageStaff.jsx';
import ManageAssignments from './pages/ManageAssignments.jsx';
import QRGenerator from './pages/QRGenerator.jsx';
import QRScanner from './pages/QRScanner.jsx';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scan" element={<QRScanner />} />
        <Route path="/passenger/:qrId" element={<Passenger />} />
        <Route path="/passenger/:qrId/request" element={<PassengerRequest />} />
        <Route path="/passenger/:qrId/status" element={<PassengerStatus />} />
        <Route path="/passenger/:qrId/emergency" element={<Emergency />} />
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/requests/:id" element={<RequestDetails />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/trains" element={<ManageTrains />} />
        <Route path="/admin/coaches" element={<ManageCoaches />} />
        <Route path="/admin/seats" element={<ManageSeats />} />
        <Route path="/admin/staff" element={<ManageStaff />} />
        <Route path="/admin/assign-staff" element={<ManageAssignments />} />
        <Route path="/admin/qr-generator" element={<QRGenerator />} />
      </Routes>
    </div>
  );
}

export default App;
