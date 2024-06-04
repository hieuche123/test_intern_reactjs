
import anh from "../assets/test.jpg"
import "./GoogleMapOverlay.css"
import {REACT_APP_GOOGLE_MAPS_KEY} from '../constants/constants'
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

const overlayImageStyle = (opacity) => ({
  width: '100vw',
  height: '100vh',
  opacity,
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 1,
  pointerEvents: 'none', // Đảm bảo không can thiệp vào tương tác bản đồ
});

const GoogleMapOverlay = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
  });

  const [opacity, setOpacity] = useState(0.5);
  const [zoomSensitivity, setZoomSensitivity] = useState(0.01); // Adjust zoom sensitivity

  useEffect(() => {
    const handleWheel = (event) => {
      const deltaY = event.deltaY; // Detect scroll direction (up/down)

      // Prevent default browser zoom behavior
      event.preventDefault();

      // Calculate new opacity based on scroll amount and sensitivity
      const newOpacity = Math.max(
        0,
        Math.min(1, opacity + (deltaY > 0 ? -zoomSensitivity : zoomSensitivity))
      );
      setOpacity(newOpacity);
    };

    // Add event listener on component mount
    window.addEventListener('wheel', handleWheel);

    // Remove event listener on component unmount (cleanup)
    return () => window.removeEventListener('wheel', handleWheel);
  }, [opacity, zoomSensitivity]); // Recalculate on opacity or sensitivity change

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        options={{ disableDefaultUI: true }}
      />
      <img src="path/to/your/image.jpg" alt="Overlay" style={overlayImageStyle(opacity)} />
    </div>
  );
};

export default GoogleMapOverlay;