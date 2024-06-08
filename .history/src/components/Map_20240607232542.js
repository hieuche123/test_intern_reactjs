import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, GroundOverlay, useJsApiLoader } from '@react-google-maps/api';

const MapComponent = () => {
  const [image, setImage] = useState(null);
  const [opacity, setOpacity] = useState(0.5);
  const [mapCenter, setMapCenter] = useState({ lat: 21.0285, lng: 105.8542 }); // Tọa độ Hà Nội
  const [mapZoom, setMapZoom] = useState(10);
  const [overlayBounds, setOverlayBounds] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const overlayRef = useRef(null);

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

  const handleOverlayMouseMove = (event) => {
    if (overlayRef.current) {
      const newBounds = calculateNewBounds(event);
      setOverlayBounds(newBounds);
    }
  };

  const calculateNewBounds = (event) => {
    const offsetX = event.latLng.lng() - overlayBounds.getNorthEast().lng();
    const offsetY = event.latLng.lat() - overlayBounds.getNorthEast().lat();
    const newNorthEast = { lat: overlayBounds.getNorthEast().lat() + offsetY, lng: overlayBounds.getNorthEast().lng() + offsetX };
    const newSouthWest = { lat: overlayBounds.getSouthWest().lat() + offsetY, lng: overlayBounds.getSouthWest().lng() + offsetX };
    return new window.google.maps.LatLngBounds(newSouthWest, newNorthEast);
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
          onBoundsChanged={() => setMapCenter(overlayBounds.getCenter())}
          onMouseMove={handleOverlayMouseMove}
        >
          {overlayBounds && (
            <GroundOverlay
              url={image}
              bounds={overlayBounds}
              options={{
                opacity: opacity,
              }}
              ref={overlayRef}
            />
          )}
        </GoogleMap>
      )}
    </div>
  );
};

export default MapComponent;
