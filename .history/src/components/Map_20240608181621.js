import React, { useState, useRef } from 'react';
import { GoogleMap, useLoadScript, OverlayView } from '@react-google-maps/api';
import { useDropzone } from 'react-dropzone';

const mapContainerStyle = {
  width: '100%',
  height: '100vh'
};

const center = {
  lat: 10.762622,
  lng: 106.660172
};

const MapComponent = () => {
  const [image, setImage] = useState(null);
  const [opacity, setOpacity] = useState(0.5);
  const [position, setPosition] = useState(center);
  const [size, setSize] = useState({ width: 100, height: 100 });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(acceptedFiles[0]);
    }
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  const handleDragEnd = (e) => {
    setPosition({
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    });
  };

  const handleSizeChange = (e) => {
    const newSize = { ...size, [e.target.name]: e.target.value };
    setSize(newSize);
  };

  return (
    <div>
      <div {...getRootProps()} style={{ border: '2px dashed #888', padding: '10px', marginBottom: '10px' }}>
        <input {...getInputProps()} />
        <p>Kéo thả hoặc chọn ảnh để tải lên</p>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={opacity}
        onChange={(e) => setOpacity(parseFloat(e.target.value))}
      />
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={15} center={center}>
        {image && (
          <OverlayView
            position={position}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={() => ({ x: -size.width / 2, y: -size.height / 2 })}
          >
            <div
              style={{
                position: 'absolute',
                width: `${size.width}px`,
                height: `${size.height}px`,
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                opacity,
                cursor: 'move'
              }}
              draggable="true"
              onDragEnd={handleDragEnd}
            />
          </OverlayView>
        )}
      </GoogleMap>
      <div>
        <label>
          Width:
          <input
            type="number"
            name="width"
            value={size.width}
            onChange={handleSizeChange}
          />
        </label>
        <label>
          Height:
          <input
            type="number"
            name="height"
            value={size.height}
            onChange={handleSizeChange}
          />
        </label>
        <p>Position: {position.lat}, {position.lng}</p>
      </div>
    </div>
  );
};

export default MapComponent;
