import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import anh from "../assets/test.jpg";
import anh2 from "../assets/duan24h.net_BĐQHSDĐ_Dong_Anh_HN_2030.jpg";
import { REACT_APP_GOOGLE_MAPS_KEY } from '../constants/constants';
import "./GoogleMapOverlay.css";

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
  position: 'relative',
  overflow: 'hidden',
};

const center = {
  lat: 21.1365,
  lng: 105.8176,
};

const overlayImageStyle = (scale, opacity, imageCenter, initialX, initialY) => ({
  width: `${160 * scale}%`,
  height: `${160 * scale}%`,
  opacity: opacity,
  position: 'absolute',
  top: `calc(${initialY}% + ${imageCenter.y}px)`,
  left: `calc(${initialX}% + ${imageCenter.x}px)`,
  transform: 'translate(-50%, -50%)',
  zIndex: 1,
  pointerEvents: 'none',
  objectFit: 'contain'
});

const GoogleMapOverlay = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
  });

  const [opacity, setOpacity] = useState(0.5);
  const [mapZoom, setMapZoom] = useState(13);
  const [imageScale, setImageScale] = useState(1);
  const [imageCenter, setImageCenter] = useState({ x: 0, y: 0 });
  const [initialX, setInitialX] = useState(50);  // Initial x position in percentage
  const [initialY, setInitialY] = useState(50);  // Initial y position in percentage
  const mapRef = useRef();

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    map.addListener('zoom_changed', () => {
      const newZoom = map.getZoom();
      setMapZoom(newZoom);
      setImageScale(Math.pow(2, newZoom - 13));
    });
  }, []);

  const onMapIdle = useCallback(() => {
    const map = mapRef.current;
    if (map) {
      const bounds = map.getBounds();
      if (bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const mapCenter = map.getCenter();

        const mapDiv = map.getDiv().getBoundingClientRect();
        const imageCenterX = (mapCenter.lng() - center.lng) / (ne.lng() - sw.lng()) * mapDiv.width;
        const imageCenterY = (center.lat - mapCenter.lat()) / (ne.lat() - sw.lat()) * mapDiv.height;

        setImageCenter({ x: imageCenterX, y: imageCenterY });
      }
    }
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      const boundsListener = map.addListener('bounds_changed', onMapIdle);
      return () => {
        boundsListener.remove();
      };
    }
  }, [onMapIdle]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  const mapOptions = {
    disableDefaultUI: true,
    gestureHandling: 'cooperative',
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={mapZoom}
        options={mapOptions}
        onLoad={onMapLoad}
        onIdle={onMapIdle}
      />
      <img
        src={anh2}
        alt="Overlay"
        style={overlayImageStyle(imageScale, opacity, imageCenter, initialX, initialY)}
      />
      <div className="controls" style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        <div className="control-item">
          <label>Độ mờ: {opacity.toFixed(2)}</label>
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
        </div>
        <div className="control-item">
          <label>Vị trí X ban đầu: {initialX}</label>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={initialX}
            onChange={(e) => setInitialX(parseInt(e.target.value))}
          />
        </div>
        <div className="control-item">
          <label>Vị trí Y ban đầu: {initialY}</label>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={initialY}
            onChange={(e) => setInitialY(parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default GoogleMapOverlay;
