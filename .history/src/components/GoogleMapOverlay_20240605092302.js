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
  pointerEvents: 'none',
});

const GoogleMapOverlay = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
  });

  const [opacity, setOpacity] = useState(0.5);
  const [mapZoom, setMapZoom] = useState(13);
  const [imageZoom, setImageZoom] = useState(1);
  const [mapCenter, setMapCenter] = useState(center);
  const [imagePosition, setImagePosition] = useState({ top: '50%', left: '50%' });
  const mapRef = useRef();

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    map.addListener('zoom_changed', () => {
      setMapZoom(map.getZoom());
      setImageZoom(Math.pow(2, map.getZoom() - 13));
    });
    map.addListener('center_changed', () => {
      const center = map.getCenter();
      setMapCenter({ lat: center.lat(), lng: center.lng() });
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

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      const projection = map.getProjection();
      if (projection) {
        const point = projection.fromLatLngToPoint(new window.google.maps.LatLng(mapCenter.lat, mapCenter.lng));
        const scale = Math.pow(2, mapZoom);
        const pixelCenter = new window.google.maps.Point(point.x * scale, point.y * scale);
        const containerPixelCenter = {
          top: pixelCenter.y - (mapContainerStyle.height / 2),
          left: pixelCenter.x - (mapContainerStyle.width / 2),
        };
        setImagePosition(containerPixelCenter);
      }
    }
  }, [mapCenter, mapZoom]);

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
