// src/Map.js
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Document, Page } from 'react-pdf-js';

function Map() {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [center, setCenter] = useState([51.505, -0.09]); // Initial center for map

  const onFileChange = (event) => {
    const file = event.target.files[0];
    setPdfFile(file);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onPageLoadSuccess = (page) => {
    setPageNumber(page);
  };

  const onMapClick = (e) => {
    setCenter([e.latlng.lat, e.latlng.lng]);
  };

  return (
    <div className="App">
      <h1>Upload PDF and Display on Map</h1>
      <input type="file" accept="application/pdf" onChange={onFileChange} />
      <div className="map-container">
        <MapContainer center={center} zoom={13} onClick={onMapClick} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {pdfFile && (
            <Marker position={center}>
              <Popup>
                <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                  <Page pageNumber={pageNumber} onLoadSuccess={onPageLoadSuccess} />
                </Document>
                <p>Page {pageNumber} of {numPages}</p>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default Map;
