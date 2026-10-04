import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { seatAPI, requestAPI } from '../services/api';
import toast from 'react-hot-toast';

const PassengerRequest = () => {
  const { qrId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get('category');

  const [location, setLocation] = useState(null);
  const [description, setDescription] = useState('');
  const [foodItems, setFoodItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const foodMenu = [
    'Veg Thali', 'Non-Veg Thali', 'Chicken Biryani', 'Veg Biryani',
    'Idli Sambar', 'Masala Dosa', 'Upma', 'Samosa (2 pcs)',
    'Vada Pao', 'Tea', 'Coffee', 'Bottled Water'
  ];

  const toggleFood = (item) => {
    setFoodItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      toast.error('Location not loaded yet');
      return;
    }

    setSubmitting(true);

    try {
      await requestAPI.create({
        seatId: location.seat._id,
        category,
        description,
        foodItems
      });

      toast.success('Request submitted successfully!');
      navigate(`/passenger/${qrId}/status`);
    } catch (err) {
      toast.error('Failed to submit request');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryLabel = (cat) => {
    const labels = {
      WATER: '💧 Water',
      FOOD: '🍱 Food',
      CLEANING: '🧹 Cleaning',
      GENERAL_ASSISTANCE: '🧑‍✈️ General Assistance',
      MEDICAL_ASSISTANCE: '🩺 Medical Assistance',
      SECURITY_CONCERN: '🔐 Security Concern',
      LOST_CHILD: '👶 Lost Child',
      SERIOUS_COACH_ISSUE: '🚻 Serious Coach Issue'
    };
    return labels[cat] || cat;
  };

  if (!location) {
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
          <div className="bg-primary-700 rounded-lg p-4">
            <p className="text-lg font-semibold">
              Train: {location.train.trainNumber} - {location.train.trainName}
            </p>
            <p className="text-md">
              Coach: {location.coach.coachNumber} • Berth: {location.seat.seatNumber}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Request Assistance
            </h2>
            <p className="text-gray-600 mb-6">
              You are requesting: <span className="font-semibold text-primary-600">
                {getCategoryLabel(category)}
              </span>
            </p>

            <form onSubmit={handleSubmit}>
              {category === 'FOOD' && (
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Food Menu — select the items you need
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {foodMenu.map((item) => {
                      const selected = foodItems.includes(item);
                      return (
                        <button
                          type="button"
                          key={item}
                          onClick={() => toggleFood(item)}
                          className={`p-3 rounded-lg border-2 text-left text-sm font-medium transition-colors ${
                            selected ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {selected ? '✓ ' : ''}{item}
                        </button>
                      );
                    })}
                  </div>
                  {foodItems.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      Selected: <span className="font-semibold">{foodItems.join(', ')}</span>
                    </p>
                  )}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Additional Details (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="4"
                  placeholder="Provide any additional information that might help staff..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
                <Link
                  to={`/passenger/${qrId}`}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerRequest;
