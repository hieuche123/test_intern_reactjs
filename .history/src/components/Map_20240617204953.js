import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';

// Thiết lập đường dẫn đến các worker của pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Map = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfScale, setPdfScale] = useState(1.0);
  const [pdfOpacity, setPdfOpacity] = useState(1.0);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleZoomChange = (e) => {
    const newScale = parseFloat(e.target.value);
    setPdfScale(newScale);
  };

  const handleOpacityChange = (e) => {
    const newOpacity = parseFloat(e.target.value);
    setPdfOpacity(newOpacity);
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={(e) => console.log(e.target.files[0])} />
      <input type="range" min="0" max="1" step="0.1" value={pdfOpacity} onChange={handleOpacityChange} />
      <input type="range" min="0.5" max="2" step="0.1" value={pdfScale} onChange={handleZoomChange} />

      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Add markers or other overlays here */}
      </MapContainer>

      <div>
        <Document file="/path/to/your/pdf/document.pdf" onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={pdfScale} />
          ))}
        </Document>
      </div>

      <p>Current scale: {pdfScale}</p>
      <p>Current opacity: {pdfOpacity}</p>
    </div>
  );
};

export default Map;
