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

const overlayImageStyle = (scale, opacity, top, left) => ({
  width: `${100 * scale}%`,
  height: `${100 * scale}%`,
  opacity: opacity,
  position: 'absolute',
  top: `${top}px`,
  left: `${left}px`,
  transform: 'translate(-50%, -50%)',
  zIndex: 1,
});

const GoogleMapOverlay = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
  });

  const [opacity, setOpacity] = useState(0.5);
  const [mapZoom, setMapZoom] = useState(13);
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ top: 0, left: 0 });
  const mapRef = useRef();

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const updateImagePosition = () => {
      const center = map.getCenter();
      const projection = map.getProjection();
      const centerPoint = projection.fromLatLngToPoint(center);
      const scale = Math.pow(2, map.getZoom());

      setImagePosition({
        top: centerPoint.y * scale,
        left: centerPoint.x * scale,
      });
    };

    map.addListener('zoom_changed', () => {
      setMapZoom(map.getZoom());
      setImageZoom(Math.pow(2, map.getZoom() - 13));
      updateImagePosition();
    });

    map.addListener('center_changed', () => {
      updateImagePosition();
    });

    window.addEventListener('resize', updateImagePosition);

    return () => {
      window.removeEventListener('resize', updateImagePosition);
    };
  }, []);

  const handleImageDrag = (e) => {
    const map = mapRef.current;
    if (!map) return;

    const offsetX = e.clientX - window.innerWidth / 2;
    const offsetY = e.clientY - window.innerHeight / 2;

    const projection = map.getProjection();
    const scale = Math.pow(2, map.getZoom());

    const newLatLng = projection.fromPointToLatLng({
      x: offsetX / scale,
      y: offsetY / scale,
    });

    map.setCenter(newLatLng);
  };

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
      />
      <img
        src={anh}
        alt="Overlay"
        style={overlayImageStyle(imageZoom, opacity, imagePosition.top, imagePosition.left)}
        onMouseDown={handleImageDrag}
        onTouchStart={handleImageDrag}
      />
      <div className="scroll" style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 2,
      }}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={opacity}
          onChange={(e) => setOpacity(parseFloat(e.target.value))}
        />
        <h5>{`Opacity: ${opacity.toFixed(2)}`}</h5>
      </div>
    </div>
  );
};

export default GoogleMapOverlay;
