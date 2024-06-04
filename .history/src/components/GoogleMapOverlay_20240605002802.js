import React, { useState, useRef, useCallback } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import anh from "../assets/test.jpg";
import { REACT_APP_GOOGLE_MAPS_KEY } from '../constants/constants';
import "./GoogleMapOverlay.css";

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
  position: 'relative',
};

const center = {
  lat: 21.1365,
  lng: 105.8176,
};

const overlayImageStyle = (zoom, opacity) => {
  const scale = Math.pow(2, (zoom - 13) / 2); // Adjust scaling as needed
  return {
    width: `${scale * 100}%`,
    height: `${scale * 100}%`,
    opacity: opacity,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1,
    pointerEvents: 'none',
  };
};

const GoogleMapOverlay = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
  });

  const [opacity, setOpacity] = useState(0.5);
  const [zoom, setZoom] = useState(13);
  const mapRef = useRef();

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    map.addListener('zoom_changed', () => {
      setZoom(map.getZoom());
    });
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        options={{ disableDefaultUI: true }}
        onLoad={onMapLoad}
      />
      <img
        src={anh}
        alt="Overlay"
        style={overlayImageStyle(zoom, opacity)}
      />
      <div className="scroll" style={{
        position: 'absolute',
        bottom: '10%',
        left: '10%',
        transform: 'translateX(-50%)',
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 2, // Ensure the slider is above the overlay
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
            style={{ marginRight: '10px' }}
          />
          <h5 className="input-scroll2">{`Opacity: ${opacity.toFixed(2)}`}</h5>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapOverlay;