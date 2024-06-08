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
  const [imageScale, setImageScale] = useState(1);
  const [imageCenter, setImageCenter] = useState({ x: 0, y: 0 });
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
        src={anh}
        alt="Overlay"
        style={overlayImageStyle(imageScale, opacity, imageCenter)}
      />
      <div className="scroll" style={{
        position: 'absolute',
        bottom: '90%',