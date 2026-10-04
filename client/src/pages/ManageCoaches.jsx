import { useState, useEffect } from 'react';
import { coachAPI, trainAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ManageCoaches = () => {
  const [coaches, setCoaches] = useState([]);
  const [trains, setTrains] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ trainId: '', coachNumber: '', coachType: 'Sleeper', totalSeats: 20 });

  useEffect(() => { loadCoaches(); loadTrains(); }, []);

  const loadCoaches = async () => {
    try { const res = await coachAPI.getAll(); setCoaches(res.data); } catch (err) { toast.error('Failed to load coaches'); }
  };

  const loadTrains = async () => {
    try { const res = await trainAPI.getAll(); setTrains(res.data); } catch (err) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await coachAPI.create(formData);
      toast.success('Coach added');
      setShowForm(false);
      setFormData({ trainId: '', coachNumber: '', coachType: 'Sleeper', totalSeats: 20 });
      loadCoaches();
    } catch (err) { toast.error('Failed to add coach'); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/admin/dashboard" className="text-primary-600">← Back</Link>
          <h1 className="text-2xl font-bold">Manage Coaches</h1>
          <button onClick={() => setShowForm(!showForm)} className="bg-primary-600 text-white px-4 py-2 rounded">Add Coach</button>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <select value={formData.trainId} onChange={(e) => setFormData({...formData, trainId: e.target.value})} className="px-4 py-2 border rounded" required>
                <option value="">Select Train</option>
                {trains.map(t => <option key={t._id} value={t._id}>{t.trainNumber} - {t.trainName}</option>)}
              </select>
              <input placeholder="Coach Number (e.g., S5)" value={formData.coachNumber} onChange={(e) => setFormData({...formData, coachNumber: e.target.value})} className="px-4 py-2 border rounded" required />
              <select value={formData.coachType} onChange={(e) => setFormData({...formData, coachType: e.target.value})} className="px-4 py-2 border rounded">
                <option value="Sleeper">Sleeper</option>
                <option value="AC 3-Tier">AC 3-Tier</option>
                <option value="AC 2-Tier">AC 2-Tier</option>
                <option value="General">General</option>
              </select>
              <input type="number" placeholder="Total Seats" value={formData.totalSeats} onChange={(e) => setFormData({...formData, totalSeats: parseInt(e.target.value)})} className="px-4 py-2 border rounded" required />
            </div>
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">Save Coach</button>
          </form>
        )}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr><th className="px-6 py-3 text-left">Coach</th><th className="px-6 py-3 text-left">Type</th><th className="px-6 py-3 text-left">Seats</th></tr>
            </thead>
            <tbody>
              {coaches.map((coach) => (
                <tr key={coach._id} className="border-t">
                  <td className="px-6 py-4">{coach.coachNumber}</td>
                  <td className="px-6 py-4">{coach.coachType}</td>
                  <td className="px-6 py-4">{coach.totalSeats}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageCoaches;
