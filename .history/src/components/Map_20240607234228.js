import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const MapComponent = () => {
  const [image, setImage] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 21.0285, lng: 105.8542 }); // Tọa độ Hà Nội
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
  const overlayRef = useRef(null);
  const mapRef = useRef(null);
  const mouseDownPositionRef = useRef(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyA3bsDl1xddiU_w38hA-fsGea8kWsp5uJM',
  });

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
      };
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

  const handleOverlayMouseDown = (event) => {
    mouseDownPositionRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
    document.addEventListener('mousemove', handleOverlayMouseMove);
    document.addEventListener('mouseup', handleOverlayMouseUp);
  };

  const handleOverlayMouseMove = (event) => {
    const mapRect = mapRef.current.getBoundingClientRect();
    const offsetX = event.clientX - mouseDownPositionRef.current.x;
    const offsetY = event.clientY - mouseDownPositionRef.current.y;
    const x = overlayPosition.x + offsetX;
    const y = overlayPosition.y + offsetY;
    setOverlayPosition({ x, y });
    setMapCenter({
      lat: mapCenter.lat - offsetY / mapRect.height * (mapRef.current.getZoom() / 10),
      lng: mapCenter.lng + offsetX / mapRect.width * (mapRef.current.getZoom() / 10),
    });
    mouseDownPositionRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  };

  const handleOverlayMouseUp = () => {
    document.removeEventListener('mousemove', handleOverlayMouseMove);
    document.removeEventListener('mouseup', handleOverlayMouseUp);
  };

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <input type="file" onChange={handleFileUpload} accept="image/*" style={{ position: 'absolute', top: '10px', left: '10px', zIndex: '1001' }} />
      <div style={{ position: 'absolute', top: '50px', left: '10px', zIndex: '1001' }}>
        Image Position: {overlayPosition.x}, {overlayPosition.y}
        <br />
        Image Size: {imageSize.width} x {imageSize.height}
      </div>
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
              onMouseDown={handleOverlayMouseDown}
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
