import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { connectSocket, getSocket } from '../services/socket';

const StaffDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/staff/login');
      return;
    }
    connectSocket();
    loadRequests();
    const socket = getSocket();
    socket.on('new_request', (request) => {
      setRequests([request, ...requests]);
      toast.success('New request!');
    });
    return () => {
      socket.off('new_request');
    };
  }, [user, navigate]);

  const loadRequests = async () => {
    try {
      const res = await requestAPI.getAll();
      setRequests(res.data);
    } catch (err) {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await requestAPI.updateStatus(id, status);
      toast.success('Updated');
      loadRequests();
    } catch (err) {
      toast.error('Failed');
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filter === 'PENDING') return ['REQUESTED', 'ACCEPTED', 'IN_PROGRESS'].includes(r.status);
    if (filter === 'COMPLETED') return r.status === 'RESOLVED';
    if (filter === 'NOT_COMPLETED') return r.status === 'CANCELLED';
    if (filter === 'REJECTED') return r.status === 'REJECTED';
    if (filter === 'MY') return r.targetStaff?._id === user?._id;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Staff Dashboard</h1>
        <button onClick={() => { logout(); navigate('/staff/login'); }} className="text-red-600">Logout</button>
      </div>
      <div className="container mx-auto p-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-6 rounded shadow">
            <div className="text-3xl font-bold">{requests.length}</div>
            <div>Total Requests</div>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <div className="text-3xl font-bold text-yellow-600">{requests.filter(r => r.status === 'REQUESTED').length}</div>
            <div>Pending</div>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <div className="text-3xl font-bold text-orange-600">{requests.filter(r => r.status === 'IN_PROGRESS').length}</div>
            <div>In Progress</div>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <div className="text-3xl font-bold text-green-600">{requests.filter(r => r.status === 'RESOLVED').length}</div>
            <div>Completed</div>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <div className="text-3xl font-bold text-red-600">{requests.filter(r => r.status === 'CANCELLED').length}</div>
            <div>Not Completed</div>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <div className="text-3xl font-bold text-gray-500">{requests.filter(r => r.status === 'REJECTED').length}</div>
            <div>Rejected</div>
          </div>
        </div>

        {/* Status filter so staff can focus on requests they need to complete */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setFilter('')} className={`px-4 py-2 rounded ${filter === '' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border'}`}>All</button>
          <button onClick={() => setFilter('PENDING')} className={`px-4 py-2 rounded ${filter === 'PENDING' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border'}`}>To Complete</button>
          <button onClick={() => setFilter('COMPLETED')} className={`px-4 py-2 rounded ${filter === 'COMPLETED' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border'}`}>Completed</button>
          <button onClick={() => setFilter('NOT_COMPLETED')} className={`px-4 py-2 rounded ${filter === 'NOT_COMPLETED' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border'}`}>Not Completed</button>
          <button onClick={() => setFilter('REJECTED')} className={`px-4 py-2 rounded ${filter === 'REJECTED' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border'}`}>Rejected</button>
          <button onClick={() => setFilter('MY')} className={`px-4 py-2 rounded ${filter === 'MY' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border'}`}>My Coach</button>
        </div>

        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-white p-8 text-center rounded shadow">
              <div className="text-6xl mb-4">📋</div>
              <p>No requests</p>
            </div>
          ) : filteredRequests.map((request) => (
            <div key={request._id} className="bg-white p-6 rounded shadow border-l-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">🚨 {request.category.replace(/_/g, ' ')}</h3>
                  <div className="text-sm text-gray-600">
                    <p><strong>Train:</strong> {request.trainId ? `${request.trainId.trainNumber} - ${request.trainId.trainName}` : '— (SOS — staff to locate)'}</p>
                    <p><strong>Coach:</strong> {request.coachId?.coachNumber || '—'} • <strong>Berth:</strong> {request.seatId?.seatNumber || '—'}</p>
                    {request.location ? (
                      <p><strong>Location:</strong> {
                        request.location.trainNumber
                          ? `${request.location.trainNumber}-${request.location.coachNumber}-${request.location.seatNumber}`
                          : (request.location.lat != null ? `GPS: ${Number(request.location.lat).toFixed(4)}, ${Number(request.location.lng).toFixed(4)}` : 'Collected')
                      }</p>
                    ) : null}
                    {request.description ? <p><strong>Details:</strong> {request.description}</p> : null}
                    {request.targetStaff ? (
                      <p><strong>For Staff:</strong> {request.targetStaff.name}</p>
                    ) : null}
                    {request.foodItems && request.foodItems.length > 0 ? (
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-gray-600 mb-1">Food Items:</p>
                        <div className="flex flex-wrap gap-1">
                          {request.foodItems.map((item, idx) => (
                            <span key={idx} className="badge badge-normal">{item}</span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    <p><strong>Time:</strong> {new Date(request.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="ml-4 flex flex-col items-end gap-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    request.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                    request.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    request.status === 'REJECTED' ? 'bg-gray-200 text-gray-700' :
                    request.status === 'IN_PROGRESS' ? 'bg-orange-100 text-orange-800' :
                    request.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {request.status === 'RESOLVED' ? 'Completed' : request.status === 'CANCELLED' ? 'Not Completed' : request.status === 'REJECTED' ? 'Rejected' : request.status.replace(/_/g, ' ')}
                  </span>
                  {request.status === 'REQUESTED' && (
                    <>
                      <button onClick={() => updateStatus(request._id, 'ACCEPTED')} className="bg-green-600 text-white px-4 py-2 rounded">✓ Accept</button>
                      <button onClick={() => updateStatus(request._id, 'REJECTED')} className="bg-red-600 text-white px-4 py-2 rounded">✗ Reject</button>
                    </>
                  )}
                  {request.status === 'ACCEPTED' && <button onClick={() => updateStatus(request._id, 'IN_PROGRESS')} className="bg-orange-600 text-white px-4 py-2 rounded">Start Work</button>}
                  {request.status === 'IN_PROGRESS' && (
                    <>
                      <button onClick={() => updateStatus(request._id, 'RESOLVED')} className="bg-green-600 text-white px-4 py-2 rounded">✓ Completed</button>
                      <button onClick={() => updateStatus(request._id, 'CANCELLED')} className="bg-red-600 text-white px-4 py-2 rounded">✗ Not Completed</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
