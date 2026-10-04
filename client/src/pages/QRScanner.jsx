import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState('');
  const scannerRef = useRef(null);
  const imageInputRef = useRef(null);
  const html5QrRef = useRef(null);
  const navigate = useNavigate();

  // Extract the qrId from a scanned URL (e.g. ".../passenger/12627-S5-42")
  const extractQrId = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const match = trimmed.match(/\/passenger\/([^/?#]+)/);
    if (match) return match[1];

    // If it's a full URL without the /passenger path, fall back to the last path segment
    if (/^https?:\/\//i.test(trimmed)) {
      const parts = trimmed.split('/').filter(Boolean);
      return parts.length ? parts[parts.length - 1] : null;
    }

    return trimmed;
  };

  const goToQr = (value) => {
    const qrId = extractQrId(value);
    if (!qrId) {
      toast.error('Invalid QR code. Please scan a valid RailAssist QR code.');
      return;
    }
    // Navigating to /passenger/:qrId shows the assistance options
    navigate(`/passenger/${encodeURIComponent(qrId)}`);
  };

  const stopCamera = async () => {
    if (html5QrRef.current) {
      try {
        await html5QrRef.current.stop();
      } catch (err) {
        // ignore stop errors
      }
      html5QrRef.current.clear();
      html5QrRef.current = null;
    }
    if (scannerRef.current) {
      scannerRef.current.innerHTML = '';
    }
    setScanning(false);
  };

  const startCamera = async () => {
    setCameraError('');
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const html5QrCode = new Html5Qrcode('qr-reader-region');
      html5QrRef.current = html5QrCode;
      setScanning(true);

      // Build a list of camera candidates to try, from most specific to least.
      const startConfigs = [];
      startConfigs.push({ facingMode: 'environment' }); // rear camera (mobiles)
      startConfigs.push({ facingMode: 'user' });        // front camera (laptops)

      // Enumerate the real cameras available on this device and add their ids.
      // Using the exact device id is the most reliable way to start the camera.
      let camIds = [];
      try {
        const cameras = await Html5Qrcode.getCameras();
        camIds = (cameras || []).map((cam) => cam.id);
      } catch (e) {
        // listing cameras failed; continue with the generic configurations
      }
      camIds.forEach((id) => startConfigs.push(id));

      // Last fallback: no constraint -> browser picks its default camera.
      startConfigs.push({});

      let started = false;
      for (const config of startConfigs) {
        try {
          await html5QrCode.start(
            config,
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => {
              toast.success('QR code scanned!');
              stopCamera();
              goToQr(decodedText);
            },
            () => {
              // per-frame decode error; ignore
            }
          );
          started = true;
          break;
        } catch (e) {
          // try the next camera candidate
        }
      }

      if (!started) {
        await stopCamera();
        setCameraError(
          'Could not access the camera. Please: 1) click the camera (Allow) prompt, ' +
          '2) make sure the app is served over HTTPS or localhost, and 3) check no other app is using the camera.'
        );
        toast.error('Camera unavailable.');
      }
    } catch (err) {
      setScanning(false);
      setCameraError(
        'Unable to start the camera. Camera access requires HTTPS or localhost and ' +
        'browser permission. Please allow camera access and try again.'
      );
      toast.error('Camera unavailable.');
    }
  };

  useEffect(() => {
    return () => {
      // Clean up camera on unmount
      if (html5QrRef.current) {
        try {
          html5QrRef.current.stop().then(() => html5QrRef.current.clear());
        } catch (err) {
          // ignore
        }
      }
    };
  }, []);

  // Scan a QR code from an uploaded photo / image file (no camera needed).
  const handleImageScan = async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    setImageError('');
    setImagePreview(URL.createObjectURL(file));

    // Turn off the camera first so the two html5-qrcode instances don't clash.
    if (scanning) {
      await stopCamera();
    }

    const html5QrCode = new (await import('html5-qrcode')).Html5Qrcode('image-scan-region', false);
    try {
      const decodedText = await html5QrCode.scanFile(file, true);
      toast.success('QR code scanned from photo!');
      html5QrCode.clear();
      goToQr(decodedText);
    } catch (err) {
      html5QrCode.clear();
      setImageError('No QR code was found in that photo. Please try a clearer picture of the QR code.');
      toast.error('No QR code found in the photo.');
    }

    // Reset the input so the same file can be chosen again.
    if (event.target) event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-primary-600">← Back to Home</Link>
          <h1 className="text-2xl font-bold">Scan QR Code</h1>
          <span className="w-16"></span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">📷</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Scan Your Seat QR Code</h2>
            <p className="text-gray-600 text-sm">
              Point your camera at the QR code at your seat. Once scanned, you will see the
              assistance options available for your journey.
            </p>
          </div>

          {/* The QR element must ALWAYS be in the DOM so html5-qrcode can attach
              to it. It's hidden until scanning actually starts. */}
          <div
            id="qr-reader-region"
            ref={scannerRef}
            className={`rounded-lg overflow-hidden border border-gray-200 mb-4 ${scanning ? 'block' : 'hidden'}`}
          ></div>

          {!scanning ? (
            <button
              onClick={startCamera}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Start Camera Scan
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Stop Camera
            </button>
          )}

          {cameraError && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              {cameraError}
            </div>
          )}

          {/* OR divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="text-sm text-gray-400">OR</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Upload a QR photo - in the same section as camera scanning */}
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🖼️</div>
            <h3 className="text-lg font-bold text-gray-800">Scan from a Photo / Image</h3>
            <p className="text-gray-600 text-sm mt-1">
              No camera? Upload a photo that contains the QR code and it will be scanned from the image.
            </p>
          </div>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageScan}
          />
          <button
            onClick={() => imageInputRef.current && imageInputRef.current.click()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Upload QR Photo
          </button>

          {/* Element html5-qrcode uses to render the uploaded image preview for scanning */}
          <div id="image-scan-region" className="hidden"></div>

          {imagePreview && (
            <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
              <img src={imagePreview} alt="Uploaded QR photo" className="w-full h-auto" />
            </div>
          )}

          {imageError && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              {imageError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;