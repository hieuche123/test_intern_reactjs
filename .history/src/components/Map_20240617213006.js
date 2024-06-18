import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import ResizableBox from 'react-resizable-box';

function PdfOverlay({ pdfUrl, opacity, scale, setPosition }) {
  const handlePositionChanged = (newPosition) => {
    // Logic to update PDF position based on newPosition
    setPosition(newPosition);
  };

  return (
    <div>
      <Document file={pdfUrl}>
        <Page pageNumber={1} scale={scale} />
      </Document>
    </div>
  );
}

function Map() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfPosition, setPdfPosition] = useState({ x: 0, y: 0 });
  const [pdfScale, setPdfScale] = useState(1);
  const [pdfOpacity, setPdfOpacity] = useState(1);

  const handlePdfChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setPdfUrl(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleMapZoom = (map) => {
    // Logic to handle map zoom and update PDF scale accordingly
    setPdfScale(map.getZoom() / initialMapZoom);
  };

  const handlePdfScaleChange = (newScale) => {
    // Logic to handle manual PDF scale change and adjust map zoom accordingly
    // (optional, depending on requirements)
  };

  return (
    <div className="App">
      <input type="file" onChange={handlePdfChange} accept="application/pdf" />
      <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true} onZoom={handleMapZoom}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <PdfOverlay pdfUrl={pdfUrl} opacity={pdfOpacity} scale={pdfScale} setPosition={setPdfPosition} />
      </MapContainer>
      <div>
        <ResizableBox width={200} height={400}>
          <div>
            <input type="range" min="0" max="1" step="0.1" value={pdfOpacity} onChange={(e) => setPdfOpacity(e.target.value)} />
            <input type="range" min="0.5" max="2" step="0.1" value={pdfScale} onChange={(e) => handlePdfScaleChange(e.target.value)} />
            <p>PDF Size: {pdfScale}</p>
            <p>PDF Position: {pdfPosition.x}, {pdfPosition.y}</p>
            <p>PDF Coordinates: ...</p>
            <p>PDF Bounds: ...</p>
          </div>
        </ResizableBox>
      </div>
    </div>
  );
}

export default Map;
