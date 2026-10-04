import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { seatAPI, requestAPI } from '../services/api';

const PassengerStatus = () => {
  const { qrId } = useParams();
  const [location, setLocation] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const seatResponse = await seatAPI.getByQrId(qrId);
        setLocation(seatResponse.data);

        const requestsResponse = await requestAPI.getAll({
          seatId: seatResponse.data.seat._id
        });
        setRequests(requestsResponse.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [qrId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'REQUESTED': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-orange-100 text-orange-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'NORMAL': return 'bg-green-100 text-green-800';
      case 'URGENT': return 'bg-orange-100 text-orange-800';
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      WATER: '💧', FOOD: '🍱', CLEANING: '🧹', GENERAL_ASSISTANCE: '🧑‍✈️',
      MEDICAL_ASSISTANCE: '🩺', SECURITY_CONCERN: '🔐', LOST_CHILD: '👶',
      SERIOUS_COACH_ISSUE: '🚻', PERSONAL_SAFETY: '🚨', FIRE: '🔥',
      MEDICAL_EMERGENCY: '🚑', ACCIDENT: '⚠️', OTHER_EMERGENCY: '🆘', EMERGENCY_SOS: '🆘'
    };
    return icons[category] || '📋';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary-600 text-white py-6 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-2">🚆 RailAssist</h1>
          {location && (
            <div className="bg-primary-700 rounded-lg p-4">
              <p className="text-lg font-semibold">
                Train: {location.train.trainNumber} - {location.train.trainName}
              </p>
              <p className="text-md">
                Coach: {location.coach.coachNumber} • Berth: {location.seat.seatNumber}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Your Requests
          </h2>

          {requests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-600 mb-4">No requests yet</p>
              <Link to={`/passenger/${qrId}`} className="btn-primary inline-block">
                Request Assistance
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{getCategoryIcon(request.category)}</div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {request.category.replace(/_/g, ' ')}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className={`badge ${getStatusColor(request.status)}`}>
                        {request.status.replace(/_/g, ' ')}
                      </span>
                      <span className={`badge ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                    </div>
                  </div>

                  {request.description && (
                    <p className="text-gray-600 text-sm mb-4">{request.description}</p>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Request ID:</span> {request.requestId}
                      </div>
                      {request.status === 'RESOLVED' && (
                        <div className="text-green-600 font-semibold flex items-center gap-2">
                          <span>✅</span> Resolved
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              to={`/passenger/${qrId}`}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerStatus;
