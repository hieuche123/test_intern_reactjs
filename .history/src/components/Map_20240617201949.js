import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { pdfjs, Document, Page } from 'react-pdf';
import Draggable from 'react-draggable';
import 'leaflet/dist/leaflet.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import './Map.css';

// Cấu hình đường dẫn worker cho react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PDFOverlay({ pdfFile, opacity, scale, position, onPositionChange, onScaleChange }) {
  const map = useMap();
  const [pdfSize, setPdfSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef();

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setPdfSize({ width, height });
    }
  }, [scale]);

  useEffect(() => {
    const onZoomEnd = () => {
      onScaleChange(map.getZoom());
    };
    map.on('zoomend', onZoomEnd);
    return () => {
      map.off('zoomend', onZoomEnd);
    };
  }, [map, onScaleChange]);

  const handleDrag = (e, ui) => {
    onPositionChange({ x: ui.x, y: ui.y });
  };

  return (
    <Draggable position={position} onDrag={handleDrag}>
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          opacity,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <Document file={pdfFile} onLoadSuccess={({ numPages }) => setPdfSize({ ...pdfSize, numPages })}>
          <Page pageNumber={1} width={pdfSize.width} />
        </Document>
      </div>
    </Draggable>
  );
}

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [opacity, setOpacity] = useState(0.5);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

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

  const handleOpacityChange = (e) => {
    setOpacity(e.target.value);
  };

  const handleScaleChange = (zoomLevel) => {
    setScale(Math.pow(2, zoomLevel - 13));
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={opacity}
        onChange={handleOpacityChange}
      />
      <MapContainer
        center={[21.028511, 105.804817]}
        zoom={13}
        style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {pdfFile && (
          <PDFOverlay
            pdfFile={pdfFile}
            opacity={opacity}
            scale={scale}
            position={position}
            onPositionChange={setPosition}
            onScaleChange={handleScaleChange}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default Map;
