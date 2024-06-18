import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';

const App = () => {
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfScale, setPdfScale] = useState(1);
  const [pdfOpacity, setPdfOpacity] = useState(1);
  const [pdfPosition, setPdfPosition] = useState({ lat: 21.1503718, lng: 105.8266315 });

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
  };

  const handlePdfOpacityChange = (event) => {
    const newOpacity = parseFloat(event.target.value);
    setPdfOpacity(newOpacity);
  };

  const PdfMarker = () => {
    const map = useMapEvents({
      click(e) {
        setPdfPosition(e.latlng);
      },
    });

    const pdfRef = useRef();

    useEffect(() => {
      if (pdfRef.current) {
        const { lat, lng } = pdfPosition;
        const point = map.latLngToLayerPoint([lat, lng]);
        pdfRef.current.style.left = `${point.x}px`;
        pdfRef.current.style.top = `${point.y}px`;
      }
    }, [pdfPosition, map]);

    return (
      <div
        ref={pdfRef}
        style={{
          position: 'absolute',
          zIndex: 10000,
          opacity: pdfOpacity,
          transform: `translate(-50%, -50%) scale(${pdfScale})`,
        }}
      >
        {pdfUrl && <embed src={pdfUrl} type="application/pdf" width="500" height="500" />}
      </div>
    );
  };

  return (
    <div className="App">
      <input
        style={{
          backgroundColor: '#fff',
          position: 'absolute',
          right: '50px',
          top: '10px',
          zIndex: '10000',
        }}
        type="file"
        onChange={handlePdfChange}
        accept="application/pdf"
      />
      <div style={{ position: 'relative', width: '100%', height: '600px' }} className="pdf-map">
        <div id="map" style={{ width: '100%', height: '100%' }}>
          <MapContainer
            center={[pdfPosition.lat, pdfPosition.lng]}
            zoom={13}
            style={{ height: '100vh', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <PdfMarker />
          </MapContainer>
        </div>
      </div>
      <div
        style={{
          backgroundColor: '#fff',
          position: 'absolute',
          right: '50px',
          top: '50px',
          zIndex: '10000',
        }}
      >
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
          min="0.1"
          max="10"
          step="0.01"
          value={pdfScale}
          onChange={handlePdfScaleChange}
        />
        <p>PDF Size: {pdfScale}</p>
        <p>PDF Position: {pdfPosition.lat}, {pdfPosition.lng}</p>
      </div>
    </div>
  );
};

export default App;
