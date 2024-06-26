
import anh from "../assets/test.jpg"
import "./GoogleMapOverlay.css"
import React, { useState } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import {REACT_APP_GOOGLE_MAPS_KEY} from '../constants/constants'
const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

const center = {
  lat: 21.1365, 
  lng: 105.8176, 
};

const overlayImageStyle = (opacity) => ({
  width: '100vw',
  height: '100vh',
  opacity: opacity,
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 1, 
  pointerEvents: 'none', // Đảm bảo không can thiệp vào tương tác bản đồ
});

const GoogleMapOverlay = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY, 
  });

  const [opacity, setOpacity] = useState(0.5);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        options={{ disableDefaultUI: true }}
      />
      <img
        src={anh} 
        alt="Overlay"
        style={overlayImageStyle(opacity)}
      />
      <div className="scroll" style={{
        position: 'absolute',
        bottom: '90%',
        left: '90%',
        transform: 'translateX(-50%)',
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 2, // thanh kéo nằm trên cả overlay
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