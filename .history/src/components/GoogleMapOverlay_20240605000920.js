
import anh from "../assets/test.jpg"
import "./GoogleMapOverlay.css"
import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, useMapEvents } from '@react-google-maps/api';
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

  const mapRef = React.useRef(null);

  useEffect(() => {
    const handleMapZoomChange = () => {
      const newScale = mapRef.current.getZoom(); // Get current map zoom level
      const newOpacity = Math.max(
        0.2, // Minimum opacity (20%)
        Math.min(1, 0.5 + (newScale - 1) / 1.5) // Adjust opacity based on scale
      );

      setScale(newScale);
      setOpacity(newOpacity);
    };

    // Add event listener for zoom change on map
    mapRef.current.addEventListener('zoom_changed', handleMapZoomChange);

    return () => {
      // Remove event listener on component unmount
      mapRef.current.removeEventListener('zoom_changed', handleMapZoomChange);
    };
  }, [mapRef]); // Recalculate on map reference change

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        options={{ disableDefaultUI: true, zoomControl: false }} // Disable zoom controls
        ref={mapRef}
      />
      <img
        src="path/to/your/image.jpg"
        alt="Overlay"
        style={overlayImageStyle(scale, opacity)}
      />
    </div>
  );
};

export default GoogleMapOverlay;