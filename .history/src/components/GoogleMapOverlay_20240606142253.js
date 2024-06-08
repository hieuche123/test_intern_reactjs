import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
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

const GoogleMapOverlay = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
  });

  const [opacity, setOpacity] = useState(0.5);
  const [imageScale, setImageScale] = useState(1);
  const [imageStyle, setImageStyle] = useState({});
  const mapRef = useRef();

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    const updateImageStyle = () => {
      const bounds = map.getBounds();
      if (bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const mapDiv = map.getDiv().getBoundingClientRect();

        const mapWidth = mapDiv.width;
        const mapHeight = mapDiv.height;

        const latDiff = ne.lat() - sw.lat();
        const lngDiff = ne.lng() - sw.lng();

        const latScale = mapHeight / latDiff;
        const lngScale = mapWidth / lngDiff;

        const newImageScale = Math.min(latScale, lngScale);
        const newWidth = (160 * newImageScale) + "px";
        const newHeight = (160 * newImageScale) + "px";

        setImageScale(newImageScale);
        setImageStyle({
          width: newWidth,
          height: newHeight,
          opacity: opacity,
          objectFit: 'contain',
        });
      }
    };

    updateImageStyle();

    map.addListener('zoom_changed', updateImageStyle);
    map.addListener('bounds_changed', updateImageStyle);
  }, [opacity]);

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
        zoom={13}
        options={mapOptions}
        onLoad={onMapLoad}
      />
      <div className="overlay-container">
        <img
          src={anh2}
          alt="Overlay"
          style={imageStyle}
        />
      </div>
      <div className="scroll">
        <div className="scroll-item">
          <input
            className="input-scroll1"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
          />
          <h5 className="input-scroll2">{`Độ mờ: ${opacity.toFixed(2)}`}</
