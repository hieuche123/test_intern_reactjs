
import anh from "../assets/test.jpg"
import "./GoogleMapOverlay.css"
import React, { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import {REACT_APP_GOOGLE_MAPS_KEY} from '../constants/constants'

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

const center = {
  lat: 21.1365,
  lng: 105.8176,
};

const overlayImageStyle = (zoomLevel, opacity) => ({
  width: `${100 + zoomLevel * 2}%`, // Adjust size based on zoom (experiment for best results)
  height: `${100 + zoomLevel * 2}%`,
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
    // Update zoom state when map zoom changes
    const handleZoomChange = (map) => {
      setZoom(map.getZoom());
    };
    if (isLoaded) {
      const map = new window.google.maps.Map(document.getElementById('map'), {});
      map.addListener('zoom_changed', handleZoomChange);
      // Clean up listener on unmount
      return () => map.removeListener('zoom_changed', handleZoomChange);
    }
  }, [isLoaded]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <GoogleMap
        id="map" // Provide an ID for the map element
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