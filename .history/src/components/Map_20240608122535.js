// // src/App.js
// import React, { useState, useCallback } from 'react';
// import { GoogleMap, useLoadScript, OverlayView } from '@react-google-maps/api';
// import { useDropzone } from 'react-dropzone';
// import '../../src/App.css';

import React, { useRef, useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import Draggable from 'react-draggable';

const containerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: 10.8231,
  lng: 106.6297
};

function MapComponent() {
  const [image, setImage] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setSize({ width: img.width, height: img.height });
      };
      img.src = event.target.result;
      setImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br />
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={opacity}
        onChange={(e) => setOpacity(e.target.value)}
      />
      <p>Opacity: {opacity}</p>
      <p>
        Position: ({position.x}, {position.y}) | Size: ({size.width}px, {size.height}px)
      </p>
      <LoadScript googleMapsApiKey="AIzaSyA3bsDl1xddiU_w38hA-fsGea8kWsp5uJM">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
          {image && (
            <Draggable onDrag={handleDrag}>
              <div
                style={{
                  position: 'absolute',
                  top: position.y,
                  left: position.x,
                  opacity: opacity,
                  zIndex: 1000
                }}
              >
                <img src={image} alt="overlay" style={{ width: '100%', height: '100%' }} />
              </div>
            </Draggable>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default MapComponent;
