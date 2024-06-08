import React, { useRef, useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import Draggable from 'react-draggable';

const containerStyle = {
  width: '100%',
  height: '600px'
};

const defaultCenter = {
  lat: 21.1807985,
  lng: 105.620778
};

function MapComponent() {
  const mapRef = useRef(null);
  const [image, setImage] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [imageLatLng, setImageLatLng] = useState(defaultCenter);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
      };
      img.src = event.target.result;
      setImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
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
        const worldCoordinateCenter = projection.fromLatLngToPoint(defaultCenter);
        const pixelOffset = new window.google.maps.Point(
          (position.x / newScale) + worldCoordinateCenter.x,
          (position.y / newScale) + worldCoordinateCenter.y
        );
        const newImageLatLng = projection.fromPointToLatLng(pixelOffset);
        setImageLatLng({ lat: newImageLatLng.lat(), lng: newImageLatLng.lng() });

        // Update image size when scale changes
        setImageSize({
          width: imageSize.width * (1 / scale) * newScale,
          height: imageSize.height * (1 / scale) * newScale
        });
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
        min="0.000000001"
        max="2"
        step="0.01"
        value={scale}
        onChange={handleScaleChange}
      />
      <p>Scale: {scale}</p>
      <p>
        Position: ({position.x}, {position.y}) | Size: ({imageSize.width}px, {imageSize.height}px)
      </p>
      <p>
        Image Coordinates: ({imageLatLng.lat}, {imageLatLng.lng})
      </p>
      <LoadScript googleMapsApiKey="AIzaSyA3bsDl1xddiU_w38hA-fsGea8kWsp5uJM">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={13}
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
                <img src={image} alt="overlay" style={{ width: imageSize.width, height: imageSize.height }} />
              </div>
            </Draggable>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default MapComponent;
