
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

const overlayImageStyle = (scale, opacity) => ({
  width: '100vw',
  height: '100vh',
  opacity,
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 1,
  pointerEvents: 'none',
  transform: `scale(${scale})`, // Apply CSS transformation
});

const GoogleMapOverlay = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
  });

  const [scale, setScale] = useState(1); // Initial scale
  const [opacity, setOpacity] = useState(0.5);
  const [zoomSensitivity, setZoomSensitivity] = useState(0.05); // Adjust zoom sensitivity

  useEffect(() => {
    const handleWheel = (event) => {
      const deltaY = event.deltaY; // Detect scroll direction (up/down)

      // Prevent default browser zoom behavior
      event.preventDefault();

      // Calculate new scale based on scroll amount and sensitivity
      const newScale = Math.max(
        0.5, // Minimum scale (50%)
        Math.min(
          2, // Maximum scale (200%)
          scale + (deltaY > 0 ? zoomSensitivity * 2 : -zoomSensitivity)
        )
      );

      // Calculate new opacity based on scale
      const newOpacity = Math.max(
        0.2, // Minimum opacity (20%)
        Math.min(1, 0.5 + (newScale - 1) / 1.5) // Adjust opacity based on scale
      );

      setScale(newScale);
      setOpacity(newOpacity);
    };

    // Add event listener on component mount
    window.addEventListener('wheel', handleWheel);

    // Remove event listener on component unmount (cleanup)
    return () => window.removeEventListener('wheel', handleWheel);
  }, [zoomSensitivity]); // Recalculate on sensitivity change

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        options={{ disableDefaultUI: true, zoomControl: false }} // Disable zoom controls
      />
      <img
        src={anh}
        alt="Overlay"
        style={overlayImageStyle(scale, opacity)}
      />
    </div>
  );
};

export default GoogleMapOverlay;