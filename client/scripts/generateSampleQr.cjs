// Generates sample QR code PDF files for the demo passengers.
// The QR codes are NOT shown anywhere in the app - these are standalone
// files you can print/display and scan with the camera.
//
// Run:  node scripts/generateSampleQr.cjs
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5173';
const TRAIN_NUMBER = '16516';
const TRAIN_NAME = 'Maland Express';

// IMPORTANT: keep these in sync with server/src/seed/seedData.js
const passengers = [
  { name: 'Aarav Sharma', age: 34, coach: 'S1', seat: '01' },
  { name: 'Meera Iyer', age: 28, coach: 'S1', seat: '02' },
  { name: 'Rohan Verma', age: 45, coach: 'S2', seat: '01' }
];

const outDir = path.join(__dirname, '..', '..', 'sample-QR-Codes');

function qrUrl(p) {
  // The QR encodes the full passenger page URL (name/age/seat are also passed
  // as query params as a fallback, so the names always show when scanned).
  return `${BASE_URL}/passenger/${TRAIN_NUMBER}-${p.coach}-${p.seat}?name=${encodeURIComponent(p.name)}&age=${p.age}&seat=${TRAIN_NUMBER}-${p.coach}-${p.seat}`;
}

async function generatePdf(p, qrPng) {
  const file = path.join(outDir, `Sample-QR-${TRAIN_NUMBER}-${p.coach}-${p.seat}.pdf`);
  const doc = new PDFDocument({ size: 'A4', margins: { top: 40, bottom: 40, left: 40, right: 40 } });

  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(file);
    stream.on('finish', resolve);
    stream.on('error', reject);
    doc.pipe(stream);

    doc.fontSize(22).text('RailAssist - Sample Passenger QR Code', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(13).fillColor('#444').text('Scan this QR code with the camera to open the passenger help page.', { align: 'center' });

    doc.moveDown(1.5);
    // Passenger box
    doc.roundedRect(40, 120, 515, 110, 6).stroke('#225059');
    doc.fontSize(12).fillColor('#225059').text(TRAIN_NAME, 60, 132);
    doc.fontSize(11).fillColor('#333').text(`Train Number : ${TRAIN_NUMBER}`, 60, 152);
    doc.fontSize(11).fillColor('#333').text(`Name         : ${p.name}`, 60, 170);
    doc.fontSize(11).fillColor('#333').text(`Age          : ${p.age}`, 60, 188);
    doc.fontSize(11).fillColor('#333').text(`Seat         : ${p.coach}-${p.seat}`, 60, 206);

    // QR code
    doc.image(qrPng, 162, 300, { width: 270, height: 270 });
    doc.moveDown();
    doc.fontSize(11).fillColor('#333').text(`URL: ${qrUrl(p)}`, 40, 585, { align: 'center' });

    doc.end();
  });
}

async function main() {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const p of passengers) {
    const qrPng = await QRCode.toBuffer(qrUrl(p), {
      type: 'png',
      width: 600,
      margin: 2,
      errorCorrectionLevel: 'H'
    });
    await generatePdf(p, qrPng);
    console.log('Generated:', path.join(outDir, `Sample-QR-${TRAIN_NUMBER}-${p.coach}-${p.seat}.pdf`));
  }

  console.log('\nDone! All 3 sample QR PDFs are in:', outDir);
}

main().catch((err) => {
  console.error('Error generating sample QR codes:', err);
  process.exit(1);
});