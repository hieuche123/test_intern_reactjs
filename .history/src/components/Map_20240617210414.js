import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import 'leaflet/dist/leaflet.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import './Map.css'; // Custom styles

function Map() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfScale, setPdfScale] = useState(1.0);
  const [pdfOpacity, setPdfOpacity] = useState(1.0);
  const [pdfPosition, setPdfPosition] = useState({ latitude: 0, longitude: 0 });

  const fileInputRef = useRef(null);

  // Function to handle file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log('File uploaded:', file.name);
      // Here you can process the uploaded file if needed
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Custom hook to get map instance
  function MapEvents() {
    const map = useMapEvents({
      move: () => {
        // Get map center coordinates
        const center = map.getCenter();
        setPdfPosition({ latitude: center.lat, longitude: center.lng });
      },
      zoom: () => {
        // Get current zoom level
        const zoom = map.getZoom();
        console.log('Zoom level:', zoom);
        // Here you can adjust PDF scale accordingly
      },
    });
    return null;
  }

  useEffect(() => {
    // Load PDF and process it if needed
  }, []);

  return (
    <div className="App">
      <div className="sidebar">
        <input type="file" onChange={handleFileChange} ref={fileInputRef} />
        <br />
        <label>PDF Opacity</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={pdfOpacity}
          onChange={(e) => setPdfOpacity(parseFloat(e.target.value))}
        />
        <br />
        <label>PDF Scale</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={pdfScale}
          onChange={(e) => setPdfScale(parseFloat(e.target.value))}
        />
        <br />
        <div>
          PDF Position:
          <br />
          Latitude: {pdfPosition.latitude.toFixed(6)}
          <br />
          Longitude: {pdfPosition.longitude.toFixed(6)}
        </div>
      </div>
      <MapContainer center={[0, 0]} zoom={2} style={{ height: '100vh', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapEvents />
        {/* Add PDF overlay here */}
        {/* You can add markers or other components on the map as needed */}
      </MapContainer>
      {/* Add PDF viewer component */}
      <div className="pdf-viewer">
        <Document
          file="path_to_your_pdf.pdf" // Replace with your PDF file path
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={pdfScale} />
          ))}
        </Document>
      </div>
    </div>
  );
}

export default Map;