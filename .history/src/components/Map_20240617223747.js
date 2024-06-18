import React, { useState } from 'react';
import { MapContainer, TileLayer,Rectangle, useMapEvent } from 'react-leaflet';
import { Document, Page, pdfjs } from 'react-pdf';
import 'leaflet/dist/leaflet.css';
import './Map.css';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const App = () => {
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfScale, setPdfScale] = useState(1);
  const [pdfOpacity, setPdfOpacity] = useState(1);
  const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [opacity, setOpacity] = useState(1.0);
    const [scale, setScale] = useState(1.0);
    const [pdfPosition, setPdfPosition] = useState({ lat: 51.505, lng: -0.09 });
    const [pdfBounds, setPdfBounds] = useState(null);
  
  const handleDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
      };
    
      const handleMapMove = (event) => {
        const newCenter = event.target.getCenter();
        setPdfPosition({
          lat: newCenter.lat,
          lng: newCenter.lng,
        });
      };
    
      const handleZoomEnd = (event) => {
        // Optionally handle zoom end event
      };
    
      const MapMoveEvents = () => {
        const map = useMapEvent('move', () => {
          const newCenter = map.getCenter();
          setPdfPosition({
            lat: newCenter.lat,
            lng: newCenter.lng,
          });
        });
    
        return null;
      };
    
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

  const handleMapZoom = () => {
    // Handle map zoom event if needed
  };

  const handlePdfScaleChange = (event) => {
    const newScale = parseFloat(event.target.value);
    setPdfScale(newScale);
    // Adjust PDF size based on newScale
  };

  const handlePdfOpacityChange = (event) => {
    const newOpacity = parseFloat(event.target.value);
    setPdfOpacity(newOpacity);
    // Adjust PDF opacity based on newOpacity
  };

  return (
    <div className="App">
      <input type="file" onChange={handlePdfChange} accept="application/pdf" />
      <div style={{ position: 'relative', width: '100%', height: '600px' }}>
        <div
          style={{
            position: 'absolute',
            left: '50px',
            top: '50px',
            zIndex: '1',
            opacity: pdfOpacity,
            transform: `scale(${pdfScale})`,
          }}
        >
          {pdfUrl && <embed src={pdfUrl} type="application/pdf" width="600" height="400" />}
        </div>
        <div
          id="map"
          style={{
            position: 'absolute',
            width: 'calc(100% - 100px)',
            height: '100%',
            left: '50%',
            top: '50%',
}}
        >
          {/* Google Map goes here */}

      <MapContainer
        center={[pdfPosition.lat, pdfPosition.lng]}
        zoom={13}
        style={{ height: '100vh', width: '100%' }}
        onMoveend={handleMapMove}
        onZoomend={handleZoomEnd}
      >
        <MapMoveEvents />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {pdfBounds && (
          <Rectangle bounds={pdfBounds} color="blue" fillOpacity={opacity} />
        )}
      </MapContainer>
        </div>
      </div>
      <div>
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

export default App;