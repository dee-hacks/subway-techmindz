import { useState, useEffect } from 'react';
import { seatAPI, coachAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ManageSeats = () => {
  const [seats, setSeats] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ coachId: '', seatNumber: '', qrId: '' });

  useEffect(() => { loadSeats(); loadCoaches(); }, []);

  const loadSeats = async () => {
    try { const res = await seatAPI.getAll(); setSeats(res.data); } catch (err) { toast.error('Failed to load seats'); }
  };

  const loadCoaches = async () => {
    try { const res = await coachAPI.getAll(); setCoaches(res.data); } catch (err) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await seatAPI.create(formData);
      toast.success('Seat added');
      setShowForm(false);
      setFormData({ coachId: '', seatNumber: '', qrId: '' });
      loadSeats();
    } catch (err) { toast.error('Failed to add seat'); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/admin/dashboard" className="text-primary-600">← Back</Link>
          <h1 className="text-2xl font-bold">Manage Seats</h1>
          <button onClick={() => setShowForm(!showForm)} className="bg-primary-600 text-white px-4 py-2 rounded">Add Seat</button>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <select value={formData.coachId} onChange={(e) => setFormData({...formData, coachId: e.target.value})} className="px-4 py-2 border rounded" required>
                <option value="">Select Coach</option>
                {coaches.map(c => <option key={c._id} value={c._id}>{c.coachNumber}</option>)}
              </select>
              <input placeholder="Seat Number" value={formData.seatNumber} onChange={(e) => setFormData({...formData, seatNumber: e.target.value})} className="px-4 py-2 border rounded" required />
              <input placeholder="QR ID (e.g., 12627-S5-01)" value={formData.qrId} onChange={(e) => setFormData({...formData, qrId: e.target.value})} className="px-4 py-2 border rounded" required />
            </div>
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">Save Seat</button>
          </form>
        )}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr><th className="px-6 py-3 text-left">QR ID</th><th className="px-6 py-3 text-left">Seat</th><th className="px-6 py-3 text-left">Coach</th></tr>
            </thead>
            <tbody>
              {seats.slice(0, 20).map((seat) => (
                <tr key={seat._id} className="border-t">
                  <td className="px-6 py-4 font-mono text-sm">{seat.qrId}</td>
                  <td className="px-6 py-4">{seat.seatNumber}</td>
                  <td className="px-6 py-4">{seat.coachId?.coachNumber || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageSeats;
