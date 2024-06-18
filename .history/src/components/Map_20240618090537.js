import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Rectangle, useMapEvents } from 'react-leaflet';
import { Document, Page, pdfjs } from 'react-pdf';
import 'leaflet/dist/leaflet.css';
import './Map.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const App = () => {
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfScale, setPdfScale] = useState(1);
  const [pdfOpacity, setPdfOpacity] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [pdfPosition, setPdfPosition] = useState({ lat: 51.505, lng: -0.09 });
  const [pdfBounds, setPdfBounds] = useState(null);

  useEffect(() => {
    if (pdfPosition && pdfScale) {
      // Calculate the bounds based on the position and scale
      const bounds = [
        [pdfPosition.lat - 0.005 * pdfScale, pdfPosition.lng - 0.005 * pdfScale],
        [pdfPosition.lat + 0.005 * pdfScale, pdfPosition.lng + 0.005 * pdfScale],
      ];
      setPdfBounds(bounds);
    }
  }, [pdfPosition, pdfScale]);

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
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
    useMapEvents({
      move: (e) => {
        const newCenter = e.target.getCenter();
        setPdfPosition({
          lat: newCenter.lat,
          lng: newCenter.lng,
        });
      },
    });

    return null;
  };

  const handlePdfScaleChange = (event) => {
    const newScale = parseFloat(event.target.value);
    setPdfScale(newScale);
  };

  const handlePdfOpacityChange = (event) => {
    const newOpacity = parseFloat(event.target.value);
    setPdfOpacity(newOpacity);
  };

  return (
    <div className="App">
      <input type="file" onChange={handlePdfChange} accept="application/pdf" />
      <div style={{ position: 'relative', width: '100%', height: '600px' }} className="pdf-map">
        {pdfUrl && (
          <div
            style={{
              position: 'absolute',
              left: '50px',
              top: '50px',
              zIndex: '1',
              opacity: pdfOpacity,
              transform: `scale(${pdfScale})`,
              pointerEvents: 'none',
            }}
          >
            <Document file={pdfUrl} onLoadSuccess={handleDocumentLoadSuccess}>
              <Page pageNumber={1} width={600} />
            </Document>
          </div>
        )}
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
          <MapContainer
            className="google-map"
            center={[pdfPosition.lat, pdfPosition.lng]}
            zoom={13}
            style={{ height: '100vh', width: '100%' }}
            onMoveend={handleMapMove}
            onZoomend={handleZoomEnd}
          >
            <MapMoveEvents />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {pdfBounds && (
              <Rectangle bounds={pdfBounds} color="blue" fillOpacity={pdfOpacity} />
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
        <p>PDF Position: {pdfPosition.lat}, {pdfPosition.lng}</p>
      </div>
    </div>
  );
};

export default App;
