import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, useLoadScript, OverlayView } from '@react-google-maps/api';
import { useDropzone } from 'react-dropzone';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};
const center = {
  lat: 21.0285,
  lng: 105.8542,
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Thay bằng API key của bạn
    libraries,
  });

  const [image, setImage] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState(center);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [currentSize, setCurrentSize] = useState({ width: 0, height: 0 });

  const mapRef = useRef();

  const onMapLoad = map => {
    mapRef.current = map;
  };

  const onDrop = acceptedFiles => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        setImage(reader.result);
        setImageSize({ width: img.width, height: img.height });
        setCurrentSize({ width: img.width, height: img.height });
      };
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  const handleDragEnd = event => {
    const latLng = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setPosition(latLng);
  };

  useEffect(() => {
    if (imageSize.width && imageSize.height) {
      setCurrentSize({
        width: imageSize.width * scale,
        height: imageSize.height * scale,
      });
    }
  }, [scale, imageSize]);

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';

  return (
    <div>
      <div {...getRootProps()} style={{ position: 'absolute', top: 10, left: 10, zIndex: 1, padding: 10, background: 'white', borderRadius: 4 }}>
        <input {...getInputProps()} />
        <p>Kéo & thả ảnh hoặc click để chọn ảnh</p>
      </div>
      <div style={{ position: 'absolute', top: 70, left: 10, zIndex: 1 }}>
        <div>
          <label>Độ trong suốt:</label>
          <Slider min={0} max={1} step={0.01} value={opacity} onChange={setOpacity} />
        </div>
        <div>
          <label>Phóng to/Thu nhỏ:</label>
          <Slider min={0.1} max={5} step={0.1} value={scale} onChange={setScale} />
        </div>
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={center}
        options={options}
        onLoad={onMapLoad}
      >
        {image && (
          <OverlayView
            position={position}
            mapPaneName={OverlayView.OVERLAY_LAYER}
            onDragEnd={handleDragEnd}
          >
            <div style={{ position: 'absolute', transform: `translate(-50%, -50%)` }}>
              <img
                src={image}
                alt="Overlay"
                style={{
                  width: currentSize.width,
                  height: currentSize.height,
                  opacity,
                  cursor: 'move',
                }}
                draggable
                onDragEnd={handleDragEnd}
              />
            </div>
          </OverlayView>
        )}
      </GoogleMap>
      <div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 1, background: 'white', padding: 10, borderRadius: 4 }}>
        <p>Kích thước ban đầu: {imageSize.width} x {imageSize.height}</p>
        <p>Kích thước hiện tại: {currentSize.width} x {currentSize.height}</p>
        <p>Tọa độ: {position.lat}, {position.lng}</p>
      </div>
    </div>
  );
}

export default App;
