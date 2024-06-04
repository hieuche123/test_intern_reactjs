
import anh from "../assets/test.jpg"
import "./GoogleMapOverlay.css"

import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { REACT_APP_GOOGLE_MAPS_KEY } from '../constants/constants';

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

const center = {
  lat: 21.1365,
  lng: 105.8176,
};

const overlayImageStyle = (zoomLevel, opacity) => ({
  width: `${100 + zoomLevel * 2}%`,
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
  const imageRef = useRef(null);

  useEffect(() => {
    const handleZoomChange = (map) => {
      const newZoom = map.getZoom();
      setZoom(newZoom);

      // Update image size based on new zoom
      if (imageRef.current) {
        const imageWidth = imageRef.current.offsetWidth;
        const imageHeight = imageRef.current.offsetHeight;

        const newImageWidth = imageWidth * (1 + (newZoom - zoom) * 0.1); // Adjust multiplier for desired zoom sensitivity
        const newImageHeight = imageHeight * (1 + (newZoom - zoom) * 0.1);

        imageRef.current.style.width = `${newImageWidth}px`;
        imageRef.current.style.height = `${newImageHeight}px`;
      }
    };

    if (isLoaded) {
      const map = new window.google.maps.Map(document.getElementById('map'), {});
      map.addListener('zoom_changed', handleZoomChange);

      // Clean up listener on unmount
      return () => map.removeListener('zoom_changed', handleZoomChange);
    }
  }, [isLoaded, zoom, imageRef]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        options={{ disableDefaultUI: true }}
      />
      <img
        ref={imageRef} // Add ref to the image element
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