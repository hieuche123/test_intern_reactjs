import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const MapComponent = () => {
  const [image, setImage] = useState(null);
  const [opacity, setOpacity] = useState(0.5);
  const [mapCenter, setMapCenter] = useState({ lat: 21.0285, lng: 105.8542 }); // Tọa độ Hà Nội
  const [mapZoom, setMapZoom] = useState(10);
  const [overlayBounds, setOverlayBounds] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const overlayRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'YOUR_API_KEY',
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
    const offsetX = event.latLng.lng() - markerRef.current.getPosition().lng();
    const offsetY = event.latLng.lat() - markerRef.current.getPosition().lat();
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
            <Overlay
              image={image}
              bounds={overlayBounds}
              opacity={opacity}
              onMouseDown={handleOverlayMouseDown}
              ref={overlayRef}
            />
          )}
        </GoogleMap>
      )}
    </div>
  );
};

const Overlay = React.forwardRef(({ image, bounds, opacity, onMouseDown }, ref) => {
  const map = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'YOUR_API_KEY',
  }).google;
  const overlay = new map.GroundOverlay(image, bounds, { opacity });

  React.useImperativeHandle(ref, () => overlay);

  const marker = new map.Marker({
    position: bounds.getNorthEast(),
    map: overlay.getMap(),
    draggable: true,
    icon: {
      path: map.SymbolPath.CIRCLE,
      scale: 5,
    },
  });

  marker.addListener('drag', () => {
    const newBounds = calculateNewBounds(marker);
    overlay.setBounds(newBounds);
  });

  const calculateNewBounds = (marker) => {
    const offsetX = marker.getPosition().lng() - bounds.getNorthEast().lng();
    const offsetY = marker.getPosition().lat() - bounds.getNorthEast().lat();
    const newNorthEast = { lat: bounds.getNorthEast().lat() + offsetY, lng: bounds.getNorthEast().lng() + offsetX };
    const newSouthWest = { lat: bounds.getSouthWest().lat() + offsetY, lng: bounds.getSouthWest().lng() + offsetX };
    return new map.LatLngBounds(newSouthWest, newNorthEast);
  };

  return null;
});

export default MapComponent;
