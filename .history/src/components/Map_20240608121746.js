// src/App.js
import React, { useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, OverlayView } from '@react-google-maps/api';
import { useDropzone } from 'react-dropzone';
import '../../src/App.css';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};
const center = {
  lat: 21.028511,
  lng: 105.804817
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyA3bsDl1xddiU_w38hA-fsGea8kWsp5uJM', // Thay YOUR_API_KEY_HERE bằng API key thực tế của bạn
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
        console.log("anh",reader.result)
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
            hgdghdgfdddddddddddd
            <div
              style={{
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                opacity: transparency,
                pointerEvents: 'none',
              }}
            >
              <img
                src={image}
                alt="overlay"
                style={{
                  width: '100%',
                  height: 'auto',
                  pointerEvents: 'auto', // Allow interaction
                  cursor: 'move',
                }}
                draggable="true"
                onDragStart={(e) => e.preventDefault()} // Prevent default drag behavior
                onDragEnd={(e) => {
                  const lat = position.lat + ((e.clientY - window.innerHeight / 2) / window.innerHeight) * 0.01;
                  const lng = position.lng + ((e.clientX - window.innerWidth / 2) / window.innerWidth) * 0.01;
                  setPosition({ lat, lng });
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
