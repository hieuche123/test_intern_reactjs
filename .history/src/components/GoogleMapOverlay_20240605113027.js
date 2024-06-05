import React, { useState, useRef, useCallback } from 'react';
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

const GoogleMapOverlay = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
  });

  const mapRef = useRef();
  const imageRef = useRef();
  const [mapCenter, setMapCenter] = useState(center);
  const [imageCenter, setImageCenter] = useState({ x: 0, y: 0 });

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    const bounds = map.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const center = {
      lat: (ne.lat() + sw.lat()) / 2,
      lng: (ne.lng() + sw.lng()) / 2
    };
    setMapCenter(center);
    updateImagePosition(center, bounds);
  }, []);

  const updateImagePosition = useCallback((mapCenter, bounds) => {
    const map = mapRef.current;
    const image = imageRef.current;
    if (map && image) {
      const mapSize = map.getDiv().getBoundingClientRect();
      const imageWidth = image.width;
      const imageHeight = image.height;
      const offsetX = (mapCenter.lng - center.lng) / (bounds.east - bounds.west) * mapSize.width;
      const offsetY = (center.lat - mapCenter.lat) / (bounds.north - bounds.south) * mapSize.height;
      setImageCenter({ x: imageWidth / 2 - offsetX, y: imageHeight / 2 - offsetY });
    }
  }, []);

  const onMapMove = useCallback(() => {
    const map = mapRef.current;
    const center = map.getCenter();
    const bounds = map.getBounds();
    setMapCenter({ lat: center.lat(), lng: center.lng() });
    updateImagePosition({ lat: center.lat(), lng: center.lng() }, bounds);
  }, [updateImagePosition]);

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
        center={mapCenter}
        zoom={13}
        options={mapOptions}
        onLoad={onMapLoad}
        onBoundsChanged={onMapMove}
      />
      <img
        ref={imageRef}
        src={anh}
        alt="Overlay"
        style={{
          position: 'absolute',
          top: `calc(50% - ${imageCenter.y}px)`,
          left: `calc(50% - ${imageCenter.x}px)`,
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default GoogleMapOverlay;
