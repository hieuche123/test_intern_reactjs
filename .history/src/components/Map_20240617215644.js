import React, { useState } from 'react';
import { MapContainer, TileLayer, ImageOverlay } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css'; // Tùy chỉnh CSS cho bản đồ và PDF overlay

const App = () => {
  const [pdfUrl, setPdfUrl] = useState(''); // URL của file PDF
  const [pdfBounds, setPdfBounds] = useState(null); // Định vị của overlay trên bản đồ
  const [pdfOpacity, setPdfOpacity] = useState(1); // Độ mờ của overlay PDF
  const [pdfScale, setPdfScale] = useState(1); // Tỉ lệ thu phóng của overlay PDF

  // Xử lý khi chọn file PDF từ input
  const handlePdfChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPdfUrl(reader.result);
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

  // Xử lý khi thay đổi tỉ lệ thu phóng của overlay PDF
  const handlePdfScaleChange = (event) => {
    const newScale = parseFloat(event.target.value);
    setPdfScale(newScale);
  };

  return (
    <div className="App">
      {/* Input để chọn file PDF */}
      <input type="file" onChange={handlePdfChange} accept="application/pdf" />

      {/* Các controls để điều chỉnh độ mờ và tỉ lệ thu phóng của PDF */}
      <div className="controls">
        <label>Opacity:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={pdfOpacity}
          onChange={handlePdfOpacityChange}
        />
        <span>{pdfOpacity}</span>
        
        <label>Scale:</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={pdfScale}
          onChange={handlePdfScaleChange}
        />
        <span>{pdfScale}</span>
      </div>

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
