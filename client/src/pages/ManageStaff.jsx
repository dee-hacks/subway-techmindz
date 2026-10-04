import { useState, useEffect } from 'react';
import { staffAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ManageStaff = () => {
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', assignedTrain: '' });

  useEffect(() => { loadStaff(); }, []);

  const loadStaff = async () => {
    try { const res = await staffAPI.getAll(); setStaff(res.data); } catch (err) { toast.error('Failed to load staff'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await staffAPI.create(formData);
      toast.success('Staff added');
      setShowForm(false);
      setFormData({ name: '', email: '', password: '', assignedTrain: '' });
      loadStaff();
    } catch (err) { toast.error('Failed to add staff'); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/admin/dashboard" className="text-primary-600">← Back</Link>
          <h1 className="text-2xl font-bold">Manage Staff</h1>
          <button onClick={() => setShowForm(!showForm)} className="bg-primary-600 text-white px-4 py-2 rounded">Add Staff</button>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="px-4 py-2 border rounded" required />
              <input placeholder="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="px-4 py-2 border rounded" required />
              <input placeholder="Password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="px-4 py-2 border rounded" required />
              <input placeholder="Train ID (optional)" value={formData.assignedTrain} onChange={(e) => setFormData({...formData, assignedTrain: e.target.value})} className="px-4 py-2 border rounded" />
            </div>
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">Save Staff</button>
          </form>
        )}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr><th className="px-6 py-3 text-left">Name</th><th className="px-6 py-3 text-left">Email</th><th className="px-6 py-3 text-left">Role</th></tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="px-6 py-4">{s.name}</td>
                  <td className="px-6 py-4">{s.email}</td>
                  <td className="px-6 py-4">{s.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageStaff;
