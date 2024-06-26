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

const GoogleMapOverlay = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
  });

  const [opacity, setOpacity] = useState(0.5);
  const [mapZoom, setMapZoom] = useState(13);
  const [imageScale, setImageScale] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const mapRef = useRef();

  const updateImagePosition = useCallback(() => {
    const map = mapRef.current;
    if (map) {
      const bounds = map.getBounds();
      if (bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const mapCenter = map.getCenter();

        const mapDiv = map.getDiv().getBoundingClientRect();
        const imageCenterX = (mapCenter.lng() - center.lng) / (ne.lng() - sw.lng()) * mapDiv.width + imagePosition.x;
        const imageCenterY = (center.lat - mapCenter.lat()) / (ne.lat() - sw.lat()) * mapDiv.height + imagePosition.y;

        setImagePosition({ x: imageCenterX, y: imageCenterY });
      }
    }
  }, [imagePosition]);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;

    map.addListener('zoom_changed', () => {
      const newZoom = map.getZoom();
      setMapZoom(newZoom);
      setImageScale(Math.pow(2, newZoom - 13));
      updateImagePosition();
    });

    map.addListener('center_changed', () => {
      updateImagePosition();
    });
  }, [updateImagePosition]);

  useEffect(() => {
    updateImagePosition();
  }, [mapZoom, updateImagePosition]);

  const handlePositionChange = (e) => {
    const { name, value } = e.target;
    setImagePosition(prevState => ({
      ...prevState,
      [name]: parseFloat(value)
    }));
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
        className="overlay-image"
        style={{
          width: `${100 * imageScale}%`,
          height: 'auto',
          opacity: opacity,
          transform: `translate(-50%, -50%) scale(${imageScale})`,
          top: `calc(50% - ${imagePosition.y}px)`,
          left: `calc(50% - ${imagePosition.x}px)`,
        }}
      />
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
          <h5 className="input-scroll2">{`Opacity: ${opacity.toFixed(2)}`}</h5>
        </div>
        <div className="scroll-item">
          <label>X Position:</label>
          <input
            type="number"
            name="x"
            value={imagePosition.x}
            onChange={handlePositionChange}
          />
        </div>
        <div className="scroll-item">
          <label>Y Position:</label>
          <input
            type="number"
            name="y"
            value={imagePosition.y}
            onChange={handlePositionChange}
          />
        </div>
      </div>
    </div>
  );
};

export default GoogleMapOverlay;
