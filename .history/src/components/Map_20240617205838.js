import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Document, Page } from 'react-pdf';
import 'leaflet/dist/leaflet.css';

function PDFOverlay({ pdfFile }) {
  return (
    <div className="PDFOverlay">
      <Document file={pdfFile}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
}

function MapComponent() {
  const [pdfFile, setPdfFile] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = () => {
        setPdfFile(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Vui lòng tải lên tệp PDF.");
    }
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100vh', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        {pdfFile && <PDFOverlay pdfFile={pdfFile} />}
      </MapContainer>
    </div>
  );
}

export default MapComponent;
