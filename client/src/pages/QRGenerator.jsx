import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { seatAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const QRGenerator = () => {
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => { loadSeats(); }, []);

  useEffect(() => {
    let cancelled = false;
    if (selectedSeat?.qrId) {
      QRCode.toDataURL(getQRUrl(selectedSeat.qrId), { width: 256, margin: 2, errorCorrectionLevel: 'H' })
        .then((url) => { if (!cancelled) setQrDataUrl(url); })
        .catch(() => { if (!cancelled) toast.error('Failed to generate QR code'); });
    } else {
      setQrDataUrl('');
    }
    return () => { cancelled = true; };
  }, [selectedSeat]);

  const loadSeats = async () => {
    try { const res = await seatAPI.getAll(); setSeats(res.data); } catch (err) { toast.error('Failed to load seats'); }
  };

  const getQRUrl = (qrId) => {
    return `${window.location.origin}/passenger/${qrId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link to="/admin/dashboard" className="text-primary-600">← Back to Dashboard</Link>
          <h1 className="text-2xl font-bold mt-2">QR Code Generator</h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Select a Seat</h2>
            <div className="bg-white rounded-lg shadow-md p-6 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {seats.map((seat) => (
                  <div
                    key={seat._id}
                    onClick={() => setSelectedSeat(seat)}
                    className={`p-3 rounded border-2 cursor-pointer transition-all ${selectedSeat?._id === seat._id ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="font-semibold">{seat.qrId}</div>
                    <div className="text-sm text-gray-600">Seat {seat.seatNumber}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            {selectedSeat ? (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-xl font-semibold mb-4">QR Code</h2>
                <div className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
                    {qrDataUrl ? (
                      <img src={qrDataUrl} alt={`QR code for seat ${selectedSeat.qrId}`} width="256" height="256" />
                    ) : (
                      <div className="w-64 h-64 flex items-center justify-center text-gray-400">Generating...</div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-lg mb-1">{selectedSeat.qrId}</p>
                    <p className="text-sm text-gray-600 mb-3">Seat {selectedSeat.seatNumber}</p>
                    <p className="text-xs text-gray-500 mb-1 break-all">{getQRUrl(selectedSeat.qrId)}</p>
                    <p className="text-sm text-primary-600 font-medium">
                      📷 Scan this QR with the camera to open the passenger page
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-6xl mb-4">📱</div>
                <p className="text-gray-600">Select a seat to generate QR code</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;