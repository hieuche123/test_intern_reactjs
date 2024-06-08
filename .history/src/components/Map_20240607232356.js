import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, GroundOverlay, useJsApiLoader } from '@react-google-maps/api';

const MapComponent = () => {
  const [image, setImage] = useState(null);
  const [opacity, setOpacity] = useState(0.5);
  const [mapCenter, setMapCenter] = useState({ lat: 21.0285, lng: 105.8542 }); // Tọa độ Hà Nội
  const [mapZoom, setMapZoom] = useState(10);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [overlayBounds, setOverlayBounds] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const overlayRef = useRef(null);
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyA3bsDl1xddiU_w38hA-fsGea8kWsp5uJM',
  });

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
        const north = mapCenter.lat + (img.height / 2) * 0.00009;
        const south = mapCenter.lat - (img.height / 2) * 0.00009;
        const east = mapCenter.lng + (img.width / 2) * 0.00009;
        const west = mapCenter.lng - (img.width / 2) * 0.00009;
        setOverlayBounds({ north, south, east, west });
      };
      img.src = image;
    }
  }, [image, mapCenter]);

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
    if (!isDragging) {
      setMapCenter({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    }
  };

  const handleOverlayMouseDown = () => {
    setIsDragging(true);
  };

  const handleOverlayMouseUp = () => {
    setIsDragging(false);
  };

  const handleOverlayMouseMove = (event) => {
    if (isDragging && overlayRef.current && mapRef.current) {
      const newBounds = calculateNewBounds(event);
      setOverlayBounds(newBounds);
    }
  };

  const calculateNewBounds = (event) => {
    const bounds = overlayRef.current.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const offsetX = event.latLng.lng() - mapRef.current.getCenter().lng();
    const offsetY = event.latLng.lat() - mapRef.current.getCenter().lat();
    const newNe = { lat: ne.lat() + offsetY, lng: ne.lng() + offsetX };
    const newSw = { lat: sw.lat() + offsetY, lng: sw.lng() + offsetX };
    return new window.google.maps.LatLngBounds(newSw, newNe);
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
          onMouseUp={handleOverlayMouseUp}
          onMouseMove={handleOverlayMouseMove}
          ref={mapRef}
        >
          {overlayBounds && (
            <GroundOverlay
              url={image}
              bounds={overlayBounds}
              options={{
                opacity: opacity,
              }}
              onMouseDown={handleOverlayMouseDown}
              ref={overlayRef}
            />
          )}
        </GoogleMap>
      )}
    </div>
  );
};

export default MapComponent;
