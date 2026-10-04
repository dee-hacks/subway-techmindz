import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { trainAPI, coachAPI, seatAPI, requestAPI } from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ trains: 0, coaches: 0, seats: 0, requests: 0 });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    loadStats();
  }, [user, navigate]);

  const loadStats = async () => {
    try {
      const [trains, coaches, seats, requests] = await Promise.all([
        trainAPI.getAll(),
        coachAPI.getAll(),
        seatAPI.getAll(),
        requestAPI.getAll()
      ]);
      setStats({
        trains: trains.data.length,
        coaches: coaches.data.length,
        seats: seats.data.length,
        requests: requests.data.length
      });
    } catch (err) {
      toast.error('Failed to load stats');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-purple-600 mb-8">RailAssist Admin</h1>
          <nav className="space-y-2">
            <Link to="/admin/dashboard" className="sidebar-link active"><span>📊</span><span>Dashboard</span></Link>
            <Link to="/admin/trains" className="sidebar-link"><span>🚆</span><span>Trains</span></Link>
            <Link to="/admin/coaches" className="sidebar-link"><span>🚃</span><span>Coaches</span></Link>
            <Link to="/admin/seats" className="sidebar-link"><span>💺</span><span>Seats</span></Link>
<Link to="/admin/assign-staff" className="sidebar-link"><span>📋</span><span>Assign Staff</span></Link>
            <Link to="/admin/staff" className="sidebar-link"><span>👨‍✈️</span><span>Staff</span></Link>
            <Link to="/admin/qr-generator" className="sidebar-link"><span>📱</span><span>QR Generator</span></Link>
          </nav>
        </div>
        <div className="absolute bottom-0 w-64 p-6 border-t">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">{user?.name?.charAt(0)}</div>
            <div><p className="font-semibold text-sm">{user?.name}</p><p className="text-xs text-gray-600">Admin</p></div>
          </div>
          <button onClick={handleLogout} className="w-full text-left text-red-600 text-sm font-medium">Logout</button>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <div className="mb-8"><h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2><p className="text-gray-600">System overview and management</p></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6"><div className="text-3xl font-bold text-gray-800">{stats.trains}</div><div className="text-gray-600">Trains</div></div>
          <div className="bg-white rounded-lg shadow-md p-6"><div className="text-3xl font-bold text-gray-800">{stats.coaches}</div><div className="text-gray-600">Coaches</div></div>
          <div className="bg-white rounded-lg shadow-md p-6"><div className="text-3xl font-bold text-gray-800">{stats.seats}</div><div className="text-gray-600">Seats</div></div>
          <div className="bg-white rounded-lg shadow-md p-6"><div className="text-3xl font-bold text-gray-800">{stats.requests}</div><div className="text-gray-600">Total Requests</div></div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link to="/admin/trains" className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"><div className="text-3xl mb-2">🚆</div><div className="font-semibold">Manage Trains</div></Link>
            <Link to="/admin/coaches" className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"><div className="text-3xl mb-2">🚃</div><div className="font-semibold">Manage Coaches</div></Link>
            <Link to="/admin/seats" className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"><div className="text-3xl mb-2">💺</div><div className="font-semibold">Manage Seats</div></Link>
            <Link to="/admin/staff" className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"><div className="text-3xl mb-2">👨‍✈️</div><div className="font-semibold">Manage Staff</div></Link>
            <Link to="/admin/qr-generator" className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"><div className="text-3xl mb-2">📱</div><div className="font-semibold">QR Generator</div></Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
