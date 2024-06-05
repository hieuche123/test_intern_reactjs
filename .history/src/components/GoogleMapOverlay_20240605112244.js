import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import anh from "../assets/test.jpg";
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

const overlayImageStyle = (scale, opacity, imageCenter) => ({
  width: `${100 * scale}%`,
  height: `${100 * scale}%`,
  opacity: opacity,
  position: 'absolute',
  top: `calc(50% - ${imageCenter.y}px)`,
  left: `calc(50% - ${imageCenter.x}px)`,
  transform: 'translate(-50%, -50%)',
  zIndex: 1,
  pointerEvents: 'none',
});

const GoogleMapOverlay = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
  });

  const [opacity, setOpacity] = useState(0.5);
  const [mapZoom, setMapZoom] = useState(13);
  const [imageZoom, setImageZoom] = useState(1);
  const [imageCenter, setImageCenter] = useState({ x: 0, y: 0 });
  const mapRef = useRef();

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    map.addListener('zoom_changed', () => {
      setMapZoom(map.getZoom());
      setImageZoom(prevZoom => Math.pow(2, map.getZoom() - 13));
    });
  }, []);

  useEffect(() => {
    const handleScroll = (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        setMapZoom(prevZoom => Math.min(prevZoom + 1, 21));
        setImageZoom(prevZoom => prevZoom * 2);
      } else {
        setMapZoom(prevZoom => Math.max(prevZoom - 1, 1));
        setImageZoom(prevZoom => Math.max(prevZoom / 2, 1));
      }
    };

    window.addEventListener('wheel', handleScroll, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, []);

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
        onBoundsChanged={() => {
          const map = mapRef.current;
          if (map) {
            const mapSize = map.getDiv().getBoundingClientRect();
            const imageCenterX = mapSize.width / 2;
            const imageCenterY = mapSize.height / 2;
            setImageCenter({ x: imageCenterX, y: imageCenterY });
          }
        }}
      />
      <img
        src={anh}
        alt="Overlay"
        style={overlayImageStyle(imageZoom, opacity, imageCenter)}
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
            style={{ marginRight: '10px' }}
          />
          <h5 className="input-scroll2">{`Opacity: ${opacity.toFixed(2)}`}</h5>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapOverlay;
