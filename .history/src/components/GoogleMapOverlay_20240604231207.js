
import anh from "../assets/test.jpg"
import "./GoogleMapOverlay.css"
import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { REACT_APP_GOOGLE_MAPS_KEY } from '../constants/constants';

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

const center = {
  lat: 21.1365,
  lng: 105.8176,
};

const overlayImageStyle = (zoomLevel) => ({
  width: `calc(100vw * ${zoomLevel})`, // Adjust width based on zoom
  height: `calc(100vh * ${zoomLevel})`, // Adjust height based on zoom
  opacity: 0.5, // Adjust opacity as needed
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 1,
  pointerEvents: 'none', // Prevent image interaction
});

const GoogleMapOverlay = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
  });

  const [zoomLevel, setZoomLevel] = useState(1); // Initial zoom level

  useEffect(() => {
    // Update zoom level on map zoom change
    const handleZoomChange = (map) => setZoomLevel(map.getZoom());
    if (isLoaded) {
      const map = window.google.maps.event.addListener(
        window.google.maps.__gmap_id,
        'zoom_changed',
        handleZoomChange
      );
      return () => window.google.maps.event.removeListener(map); // Cleanup
    }
  }, [isLoaded]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoomLevel} // Use dynamic zoom level
        options={{ disableDefaultUI: true }}
        onZoomChanged={(map) => setZoomLevel(map.getZoom())} // Update state on zoom change
      />
      <img
        src={anh}
        alt="Overlay"
        style={overlayImageStyle(zoomLevel)} // Dynamic image size based on zoom
      />
      {/* ... rest of your code (optional scroll control) */}
    </div>
  );
};

export default GoogleMapOverlay;