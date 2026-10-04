import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { requestAPI } from '../services/api';
import toast from 'react-hot-toast';

const RequestDetails = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestAPI.getOne(id)
      .then(res => setRequest(res.data))
      .catch(() => toast.error('Failed to fetch request'))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status) => {
    await requestAPI.updateStatus(id, status);
    toast.success('Updated');
    window.location.reload();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div></div>;
  if (!request) return <div className="min-h-screen flex items-center justify-center"><p>Request not found</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Request Details</h1>
            <Link to="/staff/dashboard" className="text-primary-600">← Back</Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold">{request.category.replace(/_/g, ' ')}</h2>
            <span className="badge bg-blue-100 text-blue-800">{request.status.replace(/_/g, ' ')}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div><p className="text-sm text-gray-600">Train</p><p className="font-semibold">{request.trainId?.trainNumber}</p></div>
            <div><p className="text-sm text-gray-600">Coach</p><p className="font-semibold">{request.coachId?.coachNumber}</p></div>
            <div><p className="text-sm text-gray-600">Berth</p><p className="font-semibold">{request.seatId?.seatNumber}</p></div>
          </div>
          <div className="border-t pt-4 mb-4">
            <p className="text-sm text-gray-600 mb-1">Request ID</p>
            <p className="font-mono">{request.requestId}</p>
          </div>
          {request.description && <div className="border-t pt-4 mb-4"><p className="text-sm text-gray-600 mb-1">Description</p><p>{request.description}</p></div>}
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-2">Actions</p>
            {request.status === 'REQUESTED' && <button onClick={() => updateStatus('ACCEPTED')} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">Accept</button>}
            {request.status === 'ACCEPTED' && <button onClick={() => updateStatus('IN_PROGRESS')} className="bg-orange-600 text-white px-4 py-2 rounded mr-2">Start Response</button>}
            {request.status === 'IN_PROGRESS' && <button onClick={() => updateStatus('RESOLVED')} className="bg-green-600 text-white px-4 py-2 rounded mr-2">Resolve</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
