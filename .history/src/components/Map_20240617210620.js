import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/umd/Page/AnnotationLayer.css';
import './App.css'; // File CSS tùy chỉnh (nếu cần)

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const App = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setPdfFile(file);
  };

  const handleLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleMapClick = (event) => {
    setMapCenter({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  return (
    <div className="App">
      <div className="pdf-upload">
        <input type="file" onChange={handleFileChange} />
        {pdfFile && (
          <div className="pdf-preview">
            <Document file={pdfFile} onLoadSuccess={handleLoadSuccess}>
              {Array.from(new Array(numPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} />
              ))}
            </Document>
          </div>
        )}
      </div>
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} // Thay thế bằng API key của bạn
      >
        <GoogleMap
          center={mapCenter}
          zoom={10}
          onClick={handleMapClick}
          mapContainerStyle={{ width: '100%', height: '500px', marginTop: '20px' }}
        >
          {mapCenter && <Marker position={mapCenter} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default App;
