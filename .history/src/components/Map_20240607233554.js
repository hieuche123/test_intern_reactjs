import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const MapComponent = () => {
  const [image, setImage] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 21.0285, lng: 105.8542 }); // Tọa độ Hà Nội
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
  const overlayRef = useRef(null);
  const mapRef = useRef(null);

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

  const handleMapClick = (event) => {
    setMapCenter({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const handleOverlayDrag = (event) => {
    const overlayRect = overlayRef.current.getBoundingClientRect();
    const mapRect = mapRef.current.getBoundingClientRect();
    const x = event.clientX - overlayRect.width / 2 - mapRect.left;
    const y = event.clientY - overlayRect.height / 2 - mapRect.top;
    setOverlayPosition({ x, y });
  };

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <input type="file" onChange={handleFileUpload} accept="image/*" style={{ position: 'absolute', top: '10px', left: '10px', zIndex: '1001' }} />
      {isLoaded && (
        <GoogleMap
          ref={mapRef}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={mapCenter}
          zoom={10}
          onClick={handleMapClick}
        >
          {image && (
            <div
              ref={overlayRef}
              style={{
                position: 'absolute',
                top: overlayPosition.y + 'px',
                left: overlayPosition.x + 'px',
                cursor: 'move',
                transform: 'translate(-50%, -50%)',
              }}
              onMouseDown={handleOverlayDrag}
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