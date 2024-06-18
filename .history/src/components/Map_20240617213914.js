import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import ResizableBox from 'react-resizable-box';
import 'leaflet/dist/leaflet.css';
import './App.css';

const App = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
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

  const handlePdfScaleChange = (newScale) => {
    setPdfScale(newScale);
  };

  const handlePdfOpacityChange = (newOpacity) => {
    setPdfOpacity(newOpacity);
  };

  const onResizeStop = (width, height) => {
    // Handle resize event if needed
  };

  return (
    <div className="App">
      <input type="file" onChange={handlePdfChange} accept="application/pdf" />
      <div className="map-container">
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true} style={{ height: '600px', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {pdfUrl && (
            <div
              className="pdf-overlay"
              style={{
                opacity: pdfOpacity,
                transform: `scale(${pdfScale})`,
              }}
            >
              <Document file={pdfUrl}>
                <Page pageNumber={1} />
              </Document>
            </div>
          )}
        </MapContainer>
      </div>
      <div className="controls">
        <ResizableBox width={200} height={400} onResizeStop={onResizeStop}>
          <div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={pdfOpacity}
              onChange={(e) => handlePdfOpacityChange(parseFloat(e.target.value))}
            />
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={pdfScale}
              onChange={(e) => handlePdfScaleChange(parseFloat(e.target.value))}
            />
            <p>PDF Size: {pdfScale}</p>
            <p>PDF Position: {pdfPosition.x}, {pdfPosition.y}</p>
            <p>PDF Coordinates: ...</p>
            <p>PDF Bounds: ...</p>
          </div>
        </ResizableBox>
      </div>
    </div>
  );
};

export default App;
