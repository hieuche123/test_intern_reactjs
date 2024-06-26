// src/App.js
import React, { useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, OverlayView } from '@react-google-maps/api';
import { useDropzone } from 'react-dropzone';
import '../../src/App.css';

import React, { useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, OverlayView } from '@react-google-maps/api';
import { useDropzone } from 'react-dropzone';
import './App.css';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};
const center = {
  lat: 37.7749,
  lng: -122.4194,
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'YOUR_API_KEY_HERE', // Thay YOUR_API_KEY_HERE bằng API key thực tế của bạn
    libraries,
  });

  const [image, setImage] = useState(null);
  const [transparency, setTransparency] = useState(0.5);
  const [position, setPosition] = useState(center);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height });
        setImage(reader.result);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  const handleDragEnd = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setPosition({ lat, lng });
  };

  return (
    <div>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Kéo và thả hình ảnh tại đây, hoặc nhấn để chọn file</p>
      </div>
      <div className="slider-container">
        <label>Độ trong suốt:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={transparency}
          onChange={(e) => setTransparency(parseFloat(e.target.value))}
        />
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
      >
        {image && (
          <OverlayView
            position={position}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div
              style={{
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                opacity: transparency,
                pointerEvents: 'auto',
              }}
              onDragStart={(e) => e.preventDefault()}
              draggable="true"
              onDragEnd={handleDragEnd}
            >
              <img
                src={image}
                alt="overlay"
                style={{
                  width: `${dimensions.width}px`,
                  height: `${dimensions.height}px`,
                }}
              />
            </div>
          </OverlayView>
        )}
      </GoogleMap>
      {image && (
        <div className="info">
          <p>Kích thước ảnh: {dimensions.width} x {dimensions.height}</p>
          <p>Tọa độ: Lat: {position.lat}, Lng: {position.lng}</p>
        </div>
      )}
    </div>
  );
}

export default App;
