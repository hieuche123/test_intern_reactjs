
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

const overlayImageStyle = (zoomLevel, opacity) => ({
  width: `${100 + zoomLevel * 25000}%`,
  height: `${100 + zoomLevel * 25000}%`,
  opacity: opacity,
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 1,
  pointerEvents: 'none',
});

const GoogleMapOverlay = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
  });

  const [opacity, setOpacity] = useState(0.5);
  const [zoom, setZoom] = useState(13); // Initial zoom

  useEffect(() => {
    const handleScroll = (e) => {
      if (e.ctrlKey) {
        const deltaY = e.deltaY; // Positive for scroll up, negative for scroll down
        const zoomChange = deltaY > 0 ? 0.1 : -0.1; // Adjust zoom increment based on scroll direction
        setZoom((prevZoom) => Math.max(0, prevZoom + zoomChange)); // Update zoom with boundaries
      }
    };

    window.addEventListener('wheel', handleScroll);

    return () => window.removeEventListener('wheel', handleScroll);
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        options={{ disableDefaultUI: true }}
      />
      <img
        src={anh}
        alt="Overlay"
        style={overlayImageStyle(zoom, opacity)}
      />
      <div className="scroll" style={{
        position: 'absolute',
        bottom: '90%',
        left: '90%',
        transform: 'translateX(-50%)',
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
      }}>
        <div className="scroll-item">
          <input
            className="input-scroll1"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            style={{ marginRight: '10px', }}
          />
          <h5 className="input-scroll2">{`Opacity: ${opacity.toFixed(2)}`}</h5>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapOverlay;