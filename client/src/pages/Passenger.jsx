import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { seatAPI } from '../services/api';
import toast from 'react-hot-toast';

const Passenger = () => {
  const { qrId } = useParams();
  const [searchParams] = useSearchParams();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await seatAPI.getByQrId(qrId);
        const data = response.data;
        setLocation(data);

        // Remember the scanned seat so the Emergency SOS can reuse it later
        // (train/coach/seat) without requiring a re-scan or login.
        try {
          localStorage.setItem('lastScannedSeat', JSON.stringify({
            seatId: data.seat?._id,
            trainNumber: data.train?.trainNumber,
            trainName: data.train?.trainName,
            coachNumber: data.coach?.coachNumber,
            seatNumber: data.seat?.seatNumber
          }));
        } catch (e) {
          // ignore storage errors
        }
      } catch (err) {
        setError('Invalid QR code. Please scan a valid RailAssist QR code.');
        toast.error('Invalid QR code');
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [qrId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Identifying your location...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid QR Code</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/" className="btn-primary inline-block">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const passengerName = location.seat?.passengerName || searchParams.get('name') || 'RailAssist Passenger';
  const passengerAge = location.seat?.passengerAge || searchParams.get('age') || '—';
  const seatLabel = `${location.coach.coachNumber}-${location.seat.seatNumber}`;

  const assistanceCategories = [
    { category: 'WATER', icon: '💧', label: 'Water', color: 'bg-blue-500' },
    { category: 'FOOD', icon: '🍱', label: 'Food', color: 'bg-orange-500' },
    { category: 'CLEANING', icon: '🧹', label: 'Cleaning', color: 'bg-green-500' },
    { category: 'GENERAL_ASSISTANCE', icon: '🧑‍✈️', label: 'Assistance', color: 'bg-purple-500' },
    { category: 'MEDICAL_ASSISTANCE', icon: '🩺', label: 'Medical', color: 'bg-red-500' },
    { category: 'SECURITY_CONCERN', icon: '🔐', label: 'Security', color: 'bg-yellow-500' },
    { category: 'LOST_CHILD', icon: '👶', label: 'Lost Child', color: 'bg-pink-500' },
    { category: 'SERIOUS_COACH_ISSUE', icon: '🚻', label: 'Coach Issue', color: 'bg-gray-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary-600 text-white py-6 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-2">🚆 RailAssist</h1>

          {/* Passenger details read from the scanned seat QR */}
          <div className="bg-primary-800/80 rounded-lg p-4 mb-3">
            <p className="text-sm text-primary-100 mb-1">Passenger</p>
            <p className="text-xl font-bold">{passengerName}</p>
            <div className="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-md">
              <span><span className="text-primary-100">Age:</span> {passengerAge}</span>
              <span><span className="text-primary-100">Seat:</span> {seatLabel}</span>
            </div>
            <p className="text-sm text-primary-100 mt-2">
              Train: {location.train?.trainNumber} - {location.train?.trainName}
            </p>
          </div>

          <div className="bg-primary-700 rounded-lg p-4">
            <p className="text-sm text-primary-100 mb-1">Your Location</p>
            <p className="text-lg font-semibold">
              Coach: {location.coach.coachNumber} • Berth: {location.seat.seatNumber}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          How can we help you?
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Select the type of assistance you need
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
          {assistanceCategories.map((item) => (
            <Link
              key={item.category}
              to={`/passenger/${qrId}/request?category=${item.category}`}
              className={`${item.color} text-white rounded-lg p-6 text-center hover:opacity-90 transition-opacity shadow-md hover:shadow-lg`}
            >
              <div className="text-4xl mb-2">{item.icon}</div>
              <div className="font-semibold">{item.label}</div>
            </Link>
          ))}
        </div>

        <div className="max-w-md mx-auto mb-8">
          <Link
            to={`/passenger/${qrId}/emergency`}
            className="btn-emergency w-full text-center block"
          >
            <div className="text-3xl mb-2">🚨</div>
            <div className="text-xl font-bold">EMERGENCY</div>
            <div className="text-sm">REQUEST IMMEDIATE HELP</div>
          </Link>
        </div>

        <div className="text-center">
          <Link
            to={`/passenger/${qrId}/status`}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Track your request status →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Passenger;
