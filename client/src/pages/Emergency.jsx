import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { seatAPI, requestAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Emergency = () => {
  const { qrId } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [description, setDescription] = useState('');

  const emergencyTypes = [
    { value: 'PERSONAL_SAFETY', label: 'Personal Safety', icon: '🚨' },
    { value: 'FIRE', label: 'Fire', icon: '🔥' },
    { value: 'MEDICAL_EMERGENCY', label: 'Medical Emergency', icon: '🚑' },
    { value: 'ACCIDENT', label: 'Accident', icon: '⚠️' },
    { value: 'OTHER_EMERGENCY', label: 'Other Emergency', icon: '🆘' }
  ];

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await seatAPI.getByQrId(qrId);
        setLocation(response.data);
      } catch (err) {
        toast.error('Invalid QR code');
        navigate('/');
      }
    };
    fetchLocation();
  }, [qrId, navigate]);

  const handleSubmit = async () => {
    if (!location || !selectedType) {
      toast.error('Please select an emergency type');
      return;
    }
    setSubmitting(true);
    try {
      await requestAPI.create({
        seatId: location.seat._id,
        category: selectedType,
        description: 'Emergency SOS'
      });
      toast.success('Emergency request sent! Staff has been alerted.');
      navigate(`/passenger/${qrId}/status`);
    } catch (err) {
      toast.error('Failed to send emergency request');
    } finally {
      setSubmitting(false);
      setShowConfirm(false);
    }
  };

  if (!location) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emergency-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-50">
      <div className="bg-emergency-600 text-white py-6 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-2">Emergency SOS</h1>
          <div className="bg-emergency-700 rounded-lg p-4">
            <p className="text-lg font-semibold">Train: {location.train.trainNumber}</p>
            <p className="text-md">Coach: {location.coach.coachNumber} Berth: {location.seat.seatNumber}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {!showConfirm ? (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🚨</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">EMERGENCY SOS</h2>
                <p className="text-gray-600">Select emergency type and confirm</p>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-6">
                {emergencyTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedType === type.value ? 'border-emergency-600 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{type.icon}</div>
                      <div className="font-semibold text-gray-800">{type.label}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Details (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Describe the emergency..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={!selectedType}
                  className="flex-1 btn-emergency disabled:opacity-50"
                >
                  SEND SOS
                </button>
                <Link to={`/passenger/${qrId}`} className="px-6 py-3 border border-gray-300 rounded-lg">Cancel</Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Confirm Emergency</h2>
                <p className="text-gray-600">This will alert all staff immediately</p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold mb-2">Details:</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Type:</span> {emergencyTypes.find(t => t.value === selectedType)?.label}</p>
                  <p><span className="font-semibold">Location:</span> Coach {location.coach.coachNumber}, Berth {location.seat.seatNumber}</p>
                  <p><span className="font-semibold">Train:</span> {location.train.trainNumber}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 btn-emergency disabled:opacity-50"
                >
                  {submitting ? 'Sending...' : 'CONFIRM SOS'}
                </button>
                <button onClick={() => setShowConfirm(false)} className="px-6 py-3 border border-gray-300 rounded-lg">Back</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Emergency;
