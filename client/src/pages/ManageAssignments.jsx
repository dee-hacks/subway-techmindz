import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { trainAPI, coachAPI, staffAPI } from '../services/api';
import toast from 'react-hot-toast';

const ManageAssignments = () => {
  const [trains, setTrains] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [t, c, s] = await Promise.all([
        trainAPI.getAll(),
        coachAPI.getAll(),
        staffAPI.getAll()
      ]);
      setTrains(t.data);
      setCoaches(c.data);
      setStaff(s.data);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const assignStaff = async (coachId, staffId) => {
    try {
      await coachAPI.update(coachId, { assignedStaff: staffId || null });
      toast.success(staffId ? 'Staff assigned to coach' : 'Staff removed from coach');
      load();
    } catch (err) {
      toast.error('Failed to assign staff');
    }
  };

  const getTrainName = (trainId) => {
    const t = trains.find((tr) => tr._id === trainId);
    return t ? `${t.trainNumber} - ${t.trainName}` : 'Unknown Train';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Link to="/admin/dashboard" className="text-primary-600">← Back to Dashboard</Link>
      <h1 className="text-3xl font-bold text-gray-800 mb-1 mt-2">Assign Staff to Coaches</h1>
      <p className="text-gray-600 mb-8">Pick the coach and the staff member who will handle it.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: assign staff per coach */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Coaches</h2>
          {coaches.length === 0 ? (
            <p className="text-gray-500">No coaches available.</p>
          ) : (
            <div className="space-y-4">
              {coaches.map((coach) => (
                <div key={coach._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="mb-2">
                    <p className="font-semibold text-gray-800">Coach {coach.coachNumber} <span className="text-xs text-gray-500">({coach.coachType})</span></p>
                    <p className="text-sm text-gray-600">Train: {getTrainName(coach.trainId?._id || coach.trainId)}</p>
                    <p className="text-sm text-gray-600">Seats: {coach.totalSeats}</p>
                    <p className="text-sm text-gray-600">
                      Assigned Staff:{' '}
                      <span className="font-semibold text-primary-600">
                        {coach.assignedStaff ? coach.assignedStaff.name : 'None'}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <select
                      value={coach.assignedStaff?._id || ''}
                      onChange={(e) => assignStaff(coach._id, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">— Assign a staff —</option>
                      {staff.map((st) => (
                        <option key={st._id} value={st._id}>{st.name} ({st.email})</option>
                      ))}
                    </select>
                    {coach.assignedStaff && (
                      <button
                        onClick={() => assignStaff(coach._id, '')}
                        className="px-3 py-2 rounded bg-red-100 text-red-700 text-sm hover:bg-red-200"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: which staff handles which coach */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Assigned Staff Overview</h2>
          {staff.length === 0 ? (
            <p className="text-gray-500">No staff members created yet.</p>
          ) : (
            <div className="space-y-4">
              {staff.map((st) => {
                const assigned = coaches.filter((c) => c.assignedStaff?._id === st._id);
                return (
                  <div key={st._id} className="border border-gray-200 rounded-lg p-4">
                    <p className="font-semibold text-gray-800">{st.name}</p>
                    <p className="text-sm text-gray-600 mb-1">{st.email}</p>
                    {assigned.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {assigned.map((c) => (
                          <span key={c._id} className="badge badge-normal">
                            Coach {c.coachNumber} · {getTrainName(c.trainId?._id || c.trainId)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No coach assigned</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* QR code checking note */}
          <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <p className="text-sm text-primary-800">
              📱 <strong>QR code checking/generation</strong> is available in the{" "}
              <Link to="/admin/qr-generator" className="underline font-semibold">QR Generator</Link> page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAssignments;