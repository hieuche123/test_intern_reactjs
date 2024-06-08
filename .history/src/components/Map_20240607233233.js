import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const MapComponent = () => {
  const [image, setImage] = useState(null);
  const [opacity, setOpacity] = useState(0.5);
  const [mapCenter, setMapCenter] = useState({ lat: 21.0285, lng: 105.8542 }); // Tọa độ Hà Nội
  const [mapZoom, setMapZoom] = useState(10);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const overlayRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'YOUR_API_KEY',
  });

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.src = image;
    }
  }, [image]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleOpacityChange = (event) => {
    setOpacity(parseFloat(event.target.value));
  };

  const handleMapClick = (event) => {
    setMapCenter({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const handleOverlayMouseDown = (event) => {
    setIsDragging(true);
    const overlayRect = overlayRef.current.getBoundingClientRect();
    const offsetX = event.clientX - overlayRect.left;
    const offsetY = event.clientY - overlayRect.top;
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleOverlayMouseMove = (event) => {
    if (isDragging) {
      const mapRect = event.currentTarget.parentElement.getBoundingClientRect();
      const x = event.clientX - mapRect.left - dragOffset.x;
      const y = event.clientY - mapRect.top - dragOffset.y;
      overlayRef.current.style.left = `${x}px`;
      overlayRef.current.style.top = `${y}px`;
    }
  };

  const handleOverlayMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <input type="file" onChange={handleFileUpload} accept="image/*" style={{ position: 'absolute', top: '10px', left: '10px', zIndex: '1001' }} />
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={opacity}
        onChange={handleOpacityChange}
        style={{ position: 'absolute', top: '10px', left: '60px', zIndex: '1001' }}
      />
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={mapCenter}
          zoom={mapZoom}
          onClick={handleMapClick}
        >
          {image && (
            <div
              ref={overlayRef}
              style={{
                position: 'absolute',
                cursor: isDragging ? 'grabbing' : 'grab',
                transition: isDragging ? 'none' : 'all 0.3s',
                opacity: opacity,
              }}
              onMouseDown={handleOverlayMouseDown}
              onMouseMove={handleOverlayMouseMove}
              onMouseUp={handleOverlayMouseUp}
            >
              <img src={image} alt="Map Overlay" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            </div>
          )}
        </GoogleMap>
      )}
    </div>
  );
};

export default MapComponent;
