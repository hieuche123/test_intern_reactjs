import React, { useRef, useState, useEffect } from 'react';
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
  const mapRef = useRef(null);
  const [image, setImage] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [latLng, setLatLng] = useState({ lat: center.lat, lng: center.lng });
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
    if (mapRef.current) {
      const projection = mapRef.current.getProjection();
      if (projection) {
        const worldCoordinateCenter = projection.fromLatLngToPoint(center);
        const pixelOffset = new window.google.maps.Point(
          (data.x / scale) + worldCoordinateCenter.x,
          (data.y / scale) + worldCoordinateCenter.y
        );
        const newLatLng = projection.fromPointToLatLng(pixelOffset);
        setLatLng({ lat: newLatLng.lat(), lng: newLatLng.lng() });
      }
    }
  };

  const handleLoad = (map) => {
    mapRef.current = map;
  };

  const handleScaleChange = (e) => {
    const newScale = parseFloat(e.target.value);
    setScale(newScale);
    if (mapRef.current) {
      const projection = mapRef.current.getProjection();
      if (projection) {
        const worldCoordinateCenter = projection.fromLatLngToPoint(center);
        const pixelOffset = new window.google.maps.Point(
          (position.x / newScale) + worldCoordinateCenter.x,
          (position.y / newScale) + worldCoordinateCenter.y
        );
        const newLatLng = projection.fromPointToLatLng(pixelOffset);
        setLatLng({ lat: newLatLng.lat(), lng: newLatLng.lng() });

        // Update image position when scale changes
        const newPixelOffset = new window.google.maps.Point(
          (position.x / newScale) + worldCoordinateCenter.x,
          (position.y / newScale) + worldCoordinateCenter.y
        );
        const newImageLatLng = projection.fromPointToLatLng(newPixelOffset);
        setLatLng({ lat: newImageLatLng.lat(), lng: newImageLatLng.lng() });
      }
    }
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
      <input
        type="range"
        min="0.1"
        max="2"
        step="0.01"
        value={scale}
        onChange={handleScaleChange}
      />
      <p>Scale: {scale}</p>
      <p>
        Position: ({position.x}, {position.y}) | Size: ({size.width}px, {size.height}px)
      </p>
      <p>
        Coordinates: ({latLng.lat}, {latLng.lng})
      </p>
      <LoadScript googleMapsApiKey="AIzaSyA3bsDl1xddiU_w38hA-fsGea8kWsp5uJM">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onLoad={handleLoad}
        >
          {image && (
            <Draggable onDrag={handleDrag}>
              <div
                style={{
                  position: 'absolute',
                  top: position.y,
                  left: position.x,
                  opacity: opacity,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  zIndex: 1000
                }}
              >
                <img src={image} alt="overlay" style={{ width: size.width, height: size.height }} />
              </div>
            </Draggable>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default MapComponent;
