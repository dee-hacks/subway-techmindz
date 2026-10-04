import { useState, useEffect } from 'react';
import { trainAPI, coachAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ManageTrains = () => {
  const [trains, setTrains] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ trainNumber: '', trainName: '', source: '', destination: '' });

  useEffect(() => { loadTrains(); }, []);

  const loadTrains = async () => {
    try {
      const res = await trainAPI.getAll();
      setTrains(res.data);
    } catch (err) { toast.error('Failed to load trains'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await trainAPI.create(formData);
      toast.success('Train added');
      setShowForm(false);
      setFormData({ trainNumber: '', trainName: '', source: '', destination: '' });
      loadTrains();
    } catch (err) { toast.error('Failed to add train'); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div><Link to="/admin/dashboard" className="text-primary-600">← Back</Link></div>
          <h1 className="text-2xl font-bold">Manage Trains</h1>
          <button onClick={() => setShowForm(!showForm)} className="bg-primary-600 text-white px-4 py-2 rounded">Add Train</button>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input placeholder="Train Number" value={formData.trainNumber} onChange={(e) => setFormData({...formData, trainNumber: e.target.value})} className="px-4 py-2 border rounded" required />
              <input placeholder="Train Name" value={formData.trainName} onChange={(e) => setFormData({...formData, trainName: e.target.value})} className="px-4 py-2 border rounded" required />
              <input placeholder="Source" value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value})} className="px-4 py-2 border rounded" required />
              <input placeholder="Destination" value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} className="px-4 py-2 border rounded" required />
            </div>
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">Save Train</button>
          </form>
        )}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr><th className="px-6 py-3 text-left">Train Number</th><th className="px-6 py-3 text-left">Name</th><th className="px-6 py-3 text-left">Route</th><th className="px-6 py-3 text-left">Actions</th></tr>
            </thead>
            <tbody>
              {trains.map((train) => (
                <tr key={train._id} className="border-t">
                  <td className="px-6 py-4">{train.trainNumber}</td>
                  <td className="px-6 py-4">{train.trainName}</td>
                  <td className="px-6 py-4">{train.source} → {train.destination}</td>
                  <td className="px-6 py-4">
                    <Link to={`/admin/coaches?trainId=${train._id}`} className="text-primary-600 mr-2">Coaches</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageTrains;
