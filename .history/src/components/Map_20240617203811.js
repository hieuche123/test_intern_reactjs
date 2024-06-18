import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { pdfjs, Document, Page } from 'react-pdf';
import 'leaflet/dist/leaflet.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import './Map.css';

// Cấu hình đường dẫn worker cho react-pdf
import pdfWorker from 'pdfjs-dist/build/pdf.worker.entry';
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

function PDFOverlay({ pdfFile, opacity, scale, position, onPositionChange, onScaleChange }) {
  const map = useMap();
  const containerRef = useRef();
  const pdfRef = useRef();
  const [dragging, setDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onZoomEnd = () => {
      onScaleChange(map.getZoom());
    };
    map.on('zoomend', onZoomEnd);
    return () => {
      map.off('zoomend', onZoomEnd);
    };
  }, [map, onScaleChange]);

  const onMouseDown = (e) => {
    setStartPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
    setDragging(true);
  };

  const onMouseMove = (e) => {
    if (dragging) {
      onPositionChange({ x: e.clientX - startPosition.x, y: e.clientY - startPosition.y });
    }
  };

  const onMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        cursor: dragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={onMouseDown}
    >
      <div ref={pdfRef} style={{ width: '100%', height: '100%' }}>
        <Document file={pdfFile}>
          <Page pageNumber={1} />
        </Document>
      </div>
    </div>
  );
}

function Map() {
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
