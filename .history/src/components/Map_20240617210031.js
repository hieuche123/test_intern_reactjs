import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Document, Page } from 'react-pdf';

const Map = () => {
  const [pdfFile, setPdfFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setPdfFile(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {pdfFile && (
        <div>
          <Document file={pdfFile}>
            <Page pageNumber={1} />
          </Document>
          <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '400px' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default Map;