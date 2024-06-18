import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Đảm bảo import css của leaflet để hiển thị bản đồ đúng cách
import './Map.css'; // File css để điều chỉnh vị trí và kích thước của PDF

const Map = () => {
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfScale, setPdfScale] = useState(1);
  const [pdfOpacity, setPdfOpacity] = useState(1);
  const [pdfPosition, setPdfPosition] = useState({ x: 0, y: 0 });

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

  const handlePdfScaleChange = (event) => {
    const newScale = parseFloat(event.target.value);
    setPdfScale(newScale);
    // Logic to adjust PDF size based on newScale
  };

  const handlePdfOpacityChange = (event) => {
    const newOpacity = parseFloat(event.target.value);
    setPdfOpacity(newOpacity);
    // Logic to adjust PDF opacity based on newOpacity
  };

  return (
    <div className="App">
      <input type="file" onChange={handlePdfChange} accept="application/pdf" />
      <div className="map-container">
        
      </div>
      <div className="controls">
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={pdfOpacity}
          onChange={handlePdfOpacityChange}
        />
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={pdfScale}
          onChange={handlePdfScaleChange}
        />
        <p>PDF Size: {pdfScale}</p>
        <p>PDF Position: {pdfPosition.x}, {pdfPosition.y}</p>
        <p>PDF Coordinates: ...</p>
        <p>PDF Bounds: ...</p>
      </div>
    </div>
  );
};

export default Map;
