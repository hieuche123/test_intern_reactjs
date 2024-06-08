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
    googleMapsApiKey: 'AIzaSyA3bsDl1xddiU_w38hA-fsGea8kWsp5uJM', // Thay bằng API key của bạn
    libraries,
  });

  const [image, setImage] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);
  const [mapCenter, setMapCenter] = useState(center);
  const [mapZoom, setMapZoom] = useState(14);
  const [imagePosition, setImagePosition] = useState(center);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [currentSize, setCurrentSize] = useState({ width: 0, height: 0 });
  const [corners, setCorners] = useState({});

  const mapRef = useRef();
  const imgRef = useRef();

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
        setImagePosition(mapCenter); // Đặt vị trí của ảnh ban đầu là trung tâm của bản đồ
      };
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  const handleImageMove = (latLng) => {
    setImagePosition(latLng);
  };

  const handleMapMove = () => {
    if (mapRef.current) {
      setMapCenter({
        lat: mapRef.current.getCenter().lat(),
        lng: mapRef.current.getCenter().lng(),
      });
      setMapZoom(mapRef.current.getZoom());
    }
  };

  useEffect(() => {
    if (imageSize.width && imageSize.height) {
      setCurrentSize({
        width: imageSize.width * scale,
        height: imageSize.height * scale,
      });
    }
  }, [scale, imageSize]);

  useEffect(() => {
    if (mapRef.current && imageSize.width && imageSize.height) {
      const bounds = calculateImageBounds(imagePosition, currentSize);
      setCorners(bounds);
    }
  }, [imagePosition, currentSize]);

  useEffect(() => {
    if (mapRef.current && imageSize.width && imageSize.height) {
      setImagePosition(mapCenter);
      setCurrentSize({
        width: imageSize.width * scale,
        height: imageSize.height * scale,
      });
    }
  }, [mapCenter, scale, imageSize]);

  useEffect(() => {
    if (mapRef.current && imageSize.width && imageSize.height) {
      setCurrentSize({
        width: imageSize.width * scale,
        height: imageSize.height * scale,
      });
    }
  }, [mapZoom]);

  const calculateImageBounds = (center, size) => {
    const map = mapRef.current;
    const overlayProjection = map.getProjection();
    
    const centerPoint = overlayProjection.fromLatLngToPoint(new window.google.maps.LatLng(center));
    const halfWidth = size.width / 2;
    const halfHeight = size.height / 2;

    const ne = overlayProjection.fromPointToLatLng(new window.google.maps.Point(centerPoint.x + halfWidth, centerPoint.y - halfHeight));
    const nw = overlayProjection.fromPointToLatLng(new window.google.maps.Point(centerPoint.x - halfWidth, centerPoint.y - halfHeight));
    const se = overlayProjection.fromPointToLatLng(new window.google.maps.Point(centerPoint.x + halfWidth, centerPoint.y + halfHeight));
    const sw = overlayProjection.fromPointToLatLng(new window.google.maps.Point(centerPoint.x - halfWidth, centerPoint.y + halfHeight));

    return { ne, nw, se, sw };
  };

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
          <Slider min={0} max={2} step={0.01} value={scale} onChange={setScale} />
        </div>
      </div>
      <GoogleMap
        mapContainerStyle={
          mapContainerStyle}
          zoom={mapZoom}
          center={mapCenter}
          options={options}
          onLoad={onMapLoad}
          onDragEnd={handleMapMove}
          onZoomChanged={handleMapMove}
        >
          {image && (
            <OverlayView
              position={imagePosition}
              mapPaneName={OverlayView.OVERLAY_LAYER}
            >
              <div
                ref={imgRef}
                style={{ position: 'absolute', transform: `translate(-50%, -50%)`, cursor: 'move' }}
              >
                <img
                  src={image}
                  alt="Overlay"
                  style={{
                    width: currentSize.width,
                    height: currentSize.height,
                    opacity,
                  }}
                  draggable={false}
                />
              </div>
            </OverlayView>
          )}
        </GoogleMap>
        <div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 1, background: 'white', padding: 10, borderRadius: 4 }}>
          <p>Kích thước ban đầu: {imageSize.width} x {imageSize.height}</p>
          <p>Kích thước hiện tại: {currentSize.width} x {currentSize.height}</p>
          <p>Vị trí trung tâm của ảnh: {imagePosition.lat}, {imagePosition.lng}</p>
          {corners.ne && (
            <div>
              <p>Góc đông bắc: {corners.ne.lat()}, {corners.ne.lng()}</p>
              <p>Góc tây bắc: {corners.nw.lat()}, {corners.nw.lng()}</p>
              <p>Góc đông nam: {corners.se.lat()}, {corners.se.lng()}</p>
              <p>Góc tây nam: {corners.sw.lat()}, {corners.sw.lng()}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  export default App;
  