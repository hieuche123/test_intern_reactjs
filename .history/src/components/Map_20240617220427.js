import React, { useState } from 'react';
import { MapContainer, TileLayer, ImageOverlay } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const App = () => {
  const [pdfUrl, setPdfUrl] = useState(''); // URL của file PDF
  const [pdfBounds, setPdfBounds] = useState(null); // Định vị của overlay trên bản đồ
  const [pdfOpacity, setPdfOpacity] = useState(1); // Độ mờ của overlay PDF

  // Xử lý khi chọn file PDF từ input
  const handlePdfChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result;
        console.log('PDF URL:', url); // Kiểm tra URL trong console log
        setPdfUrl(url);
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý khi bản đồ được di chuyển để cập nhật vị trí của overlay PDF
  const handleMapMove = (event) => {
    const bounds = event.target.getBounds();
    setPdfBounds([
      [bounds._southWest.lat, bounds._southWest.lng],
      [bounds._northEast.lat, bounds._northEast.lng],
    ]);
  };

  // Xử lý khi thay đổi độ mờ của overlay PDF
  const handlePdfOpacityChange = (event) => {
    const newOpacity = parseFloat(event.target.value);
    setPdfOpacity(newOpacity);
  };

  return (
    <div className="App">
      {/* Input để chọn file PDF */}
      <input type="file" onChange={handlePdfChange} accept="application/pdf" />

      {/* Bản đồ */}
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: '600px', width: '100%' }}
        onMoveend={handleMapMove}
      >
        {/* TileLayer để hiển thị bản đồ */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* ImageOverlay để hiển thị PDF như một overlay trên bản đồ */}
        {pdfUrl && pdfBounds && (
          <ImageOverlay url={pdfUrl} bounds={pdfBounds} opacity={pdfOpacity} />
        )}
      </MapContainer>
    </div>
  );
};

export default App;
