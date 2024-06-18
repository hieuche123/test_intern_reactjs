import React, { useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { Document, Page } from 'react-pdf';
import 'leaflet/dist/leaflet.css';
import './Map.css';

function Map() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [opacity, setOpacity] = useState(1.0);
  const [zoomLevel, setZoomLevel] = useState(10);
  const [viewport, setViewport] = useState({ lat: 51.505, lng: -0.09, zoom: 13 });

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function handleZoomChange(e) {
    setZoomLevel(e.target.value);
  }

  function handleOpacityChange(e) {
    setOpacity(e.target.value / 100);
  }

  function MoveMap({ center }) {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
  }

  return (
    <div className="App">
      <div className="controls">
        <input type="file" accept=".pdf" />
        <label>Opacity:</label>
        <input type="range" min="0" max="100" value={opacity * 100} onChange={handleOpacityChange} />
        <label>Zoom:</label>
        <input type="range" min="1" max="20" value={zoomLevel} onChange={handleZoomChange} />
      </div>
      <div className="map-container">
        <MapContainer center={[viewport.lat, viewport.lng]} zoom={viewport.zoom} scrollWheelZoom={false}>
          <MoveMap center={[viewport.lat, viewport.lng]} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Document file="your-pdf-file.pdf" onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} scale={zoomLevel / 10} width={800} />
          </Document>
        </MapContainer>
      </div>
    </div>
  );
}

export default Map;
