import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Document, Page, pdfjs } from 'react-pdf';
import 'leaflet/dist/leaflet.css';
import './Map.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Map = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [opacity, setOpacity] = useState(1.0);
  const [scale, setScale] = useState(1.0);
  const [mapCenter, setMapCenter] = useState({ lat: 51.505, lng: -0.09 });
  const [pdfPosition, setPdfPosition] = useState({ lat: 51.505, lng: -0.09 });
  const [pdfBounds, setPdfBounds] = useState(null);

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleMapMove = (event) => {
    const newCenter = event.target.getCenter();
    setMapCenter({
      lat: newCenter.lat,
      lng: newCenter.lng,
    });
  };

  const handlePdfLoadSuccess = ({ width, height }) => {
    // Calculate initial position and bounds for PDF
    const center = mapCenter;
    const bounds = [[center.lat - height / 2, center.lng - width / 2], [center.lat + height / 2, center.lng + width / 2]];
    setPdfBounds(bounds);
    setPdfPosition(center);
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
        <Document file="somefile.pdf" onLoadSuccess={handleDocumentLoadSuccess}>
          <Page
            pageNumber={pageNumber}
            scale={scale}
            onLoadSuccess={handlePdfLoadSuccess}
            loading="Loading PDF..."
          />
        </Document>
      </div>
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
        onMove={handleMapMove}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {pdfBounds && (
          <Marker position={[pdfPosition.lat, pdfPosition.lng]}>
            <Popup>
              PDF Position: {pdfPosition.lat.toFixed(4)}, {pdfPosition.lng.toFixed(4)}
              <br />
              PDF Bounds: {pdfBounds.map((coord) => coord.map((val) => val.toFixed(4)).join(', ')).join('; ')}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
