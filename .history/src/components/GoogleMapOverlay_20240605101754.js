import React, { useState, useRef, useEffect } from 'react';
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

const overlayImageStyle = (scale, opacity, offsetX, offsetY) => ({
  width: `${100 * scale}%`,
  height: `${100 * scale}%`,
  opacity: opacity,
  position: 'absolute',
  top: `calc(50% - ${offsetY}px)`,
  left: `calc(50% - ${offsetX}px)`,
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
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const mapRef = useRef();
  const imageRef = useRef();

  const calculateImagePosition = () => {
    const map = mapRef.current;
    const image = imageRef.current;
    if (map && image) {
      const center = map.getCenter();
      const ne = map.getBounds().getNorthEast();
      const offsetX = Math.abs(center.lng() - ne.lng()) * (imageZoom - 1) * (100 / imageZoom);
      const offsetY = Math.abs(center.lat() - ne.lat()) * (imageZoom - 1) * (100 / imageZoom);
      setImagePosition({ x: offsetX, y: offsetY });
    }
  };

  const onMapLoad = (map) => {
    mapRef.current = map;
    calculateImagePosition();
  };

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      map.addListener('zoom_changed', () => {
        setMapZoom(map.getZoom());
        setImageZoom(prevZoom => Math.pow(2, map.getZoom() - 13));
      });
      map.addListener('center_changed', calculateImagePosition);
    }
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

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={mapZoom}
        onLoad={onMapLoad}
      />
      <img
        ref={imageRef}
        src={anh}
        alt="Overlay"
        style={overlayImageStyle(imageZoom, opacity, imagePosition.x, imagePosition.y)}
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
