import { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestAPI } from '../services/api';
import toast from 'react-hot-toast';

const Home = () => {
  // train-train image used as the full-page blurred background
  const heroImageUrl = '/train-train.webp';

  const [sendingSos, setSendingSos] = useState(false);
  const [sosSent, setSosSent] = useState(false);

  const sendSos = async () => {
    if (sendingSos || sosSent) return;
    setSendingSos(true);

    try {
      // 1) Use the seat saved from an earlier QR scan, if any.
      let seatId = null;
      try {
        const stored = localStorage.getItem('lastScannedSeat');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.seatId) seatId = parsed.seatId;
        }
      } catch (e) {
        // ignore bad stored data
      }

      // 2) Try to read GPS silently (optional). Never blocks the SOS.
      let gps = null;
      if (navigator.geolocation) {
        try {
          gps = await new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
              () => resolve(null),
              { enableHighAccuracy: false, timeout: 5000, maximumAge: 10000 }
            );
          });
        } catch (e) {
          gps = null;
        }
      }

      // 3) Send the emergency (works even without seatId and gps).
      await requestAPI.createEmergency({ seatId, gps });
      setSosSent(true);
      toast.success('🚨 Emergency sent! Nearest staff has been alerted.');
    } catch (err) {
      toast.error('Failed to send emergency. Please try again.');
    } finally {
      setSendingSos(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary-500 to-primary-700">
      {/* Full-page background image (blurred, with a dark overlay for readability) */}
      {heroImageUrl && (
        <>
          <img
            src={heroImageUrl}
            alt="RailAssist Background Image"
            className="absolute inset-0 w-full h-full object-cover blur-lg scale-110"
          />
          <div className="absolute inset-0 bg-primary-900/60"></div>
        </>
      )}

      <div className="relative z-10">
        {/* Navigation bar */}
        <nav className="bg-primary-900/40 backdrop-blur-sm border-b border-white/10" style = {{ backgroundColor: 'rgba(20, 83, 228, 0.4)' }}>
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Profile photo - kept as the rail emoji */}
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-2xl">🚆</div>
              <span className="text-white font-bold text-xl">RailAssist</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/scan" className="text-white hover:text-primary-100 font-medium">Scan QR</Link>
              <Link to="/staff/login" className="text-white hover:text-primary-100 font-medium">Staff Login</Link>
              <Link to="/admin/login" className="bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-lg transition-colors">Admin Login</Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <div className="container mx-auto px-4 py-16 text-center text-white">
          <div className="text-6xl mb-4">🚆</div>
          <h1 className="text-5xl font-bold mb-4">RailAssist</h1>
          <p className="text-xl text-primary-100">
            QR-Based Railway Passenger Assistance & Emergency Response System
          </p>
        </div>

        {/* Main action section */}
        <div className="container mx-auto px-4 py-8 pb-16">
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl p-8">
              <div className="text-center">
                <div className="text-5xl mb-4">👤</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Passenger</h2>
                <p className="text-gray-600 mb-6">
                  Scan a QR code at your seat to request assistance or emergency help
                </p>
                <Link
                  to="/scan"
                  className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  📷 Scan QR Code
                </Link>
              </div>
            </div>

            {/* Emergency SOS - sends directly to nearest staff */}
            <div className="mt-6">
              <button
                onClick={sendSos}
                disabled={sendingSos || sosSent}
                className="w-full btn-emergency text-center block disabled:opacity-60"
              >
                🚨 EMERGENCY SOS
              </button>
              {sosSent && (
                <p className="text-center text-white mt-3">
                  ✅ Emergency sent — the nearest staff has been alerted and is on the way.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;