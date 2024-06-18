import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvent } from 'react-leaflet';
import { Document, Page, pdfjs } from 'react-pdf';
import 'leaflet/dist/leaflet.css';
import './App.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const App = () => {
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

  return (
    <div className="App">
      <input type="file" onChange={(e) => console.log(e.target.files[0])} />
      <div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={opacity}
          onChange={(e) => setOpacity(parseFloat(e.target.value))}
        />
        Opacity: {opacity}
      </div>
      <div>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={scale}
          onChange={(e) => setScale(parseFloat(e.target.value))}
        />
        Scale: {scale}
      </div>
      <div>
        <Document
          file="somefile.pdf"
          onLoadSuccess={handleDocumentLoadSuccess}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            onLoadSuccess={({ width, height }) => {
              const bounds = [[pdfPosition.lat - height / 2, pdfPosition.lng - width / 2], [pdfPosition.lat + height / 2, pdfPosition.lng + width / 2]];
              setPdfBounds(bounds);
            }}
          />
        </Document>
      </div>
      <MapContainer
        center={[pdfPosition.lat, pdfPosition.lng]}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
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
  );
};

export default App;
