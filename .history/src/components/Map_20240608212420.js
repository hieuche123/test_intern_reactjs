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
  lat: 21.136663,
  lng: 105.7473446,
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'YOUR_API_KEY', // Thay YOUR_API_KEY bằng API key của bạn
    libraries,
  });

  const [image, setImage] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState(center);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [currentSize, setCurrentSize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(14); // Thêm trạng thái zoom
  const [corners, setCorners] = useState({}); // Khai báo biến corners

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
      };
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  const handleImageMove = (latLng) => {
    setPosition(latLng);
  };

  useEffect(() => {
    if (imageSize.width && imageSize.height) {
      const newScale = scale * (14 / zoom); // Tính toán tỉ lệ mới dựa trên mức độ zoom
      setCurrentSize({
        width: imageSize.width * newScale,
        height: imageSize.height * newScale,
      });
    }
  }, [scale, imageSize, zoom]);

  useEffect(() => {
    if (mapRef.current && imageSize.width && imageSize.height) {
      const bounds = calculateImageBounds(position, currentSize);
      setCorners(bounds);
    }
  }, [position, currentSize]);

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

  const onZoomChanged = () => {
    const newZoom = mapRef.current.getZoom();
    setZoom(newZoom);
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
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={center}
        options={options}
        onLoad={onMapLoad}
        onClick={(e) => handleImageMove({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
        onZoomChanged={onZoomChanged} // Thêm sự kiện onZoomChanged
      >
        {image && (
          <OverlayView
            position={position}
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
        <p>Vị trí trung tâm: {position.lat}, {position.lng}</p>
        {corners.ne && (
          <div
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
  lat: 21.136663,
  lng: 105.7473446,
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'YOUR_API_KEY', // Thay YOUR_API_KEY bằng API key của bạn
    libraries,
  });

  const [image, setImage] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState(center);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [currentSize, setCurrentSize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(14); // Thêm trạng thái zoom
  const [corners, setCorners] = useState({}); // Khai báo biến corners

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
      };
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  const handleImageMove = (latLng) => {
    setPosition(latLng);
  };

  useEffect(() => {
    if (imageSize.width && imageSize.height) {
      const newScale = scale * (14 / zoom); // Tính toán tỉ lệ mới dựa trên mức độ zoom
      setCurrentSize({
        width: imageSize.width * newScale,
        height: imageSize.height * newScale,
      });
    }
  }, [scale, imageSize, zoom]);

  useEffect(() => {
    if (mapRef.current && imageSize.width && imageSize.height) {
      const bounds = calculateImageBounds(position, currentSize);
      setCorners(bounds);
    }
  }, [position, currentSize]);

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

  const onZoomChanged = () => {
    const newZoom = mapRef.current.getZoom();
    setZoom(newZoom);
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
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={center}
        options={options}
        onLoad={onMapLoad}
        onClick={(e) => handleImageMove({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
        onZoomChanged={onZoomChanged} // Thêm sự kiện onZoomChanged
      >
        {image && (
          <OverlayView
            position={position}
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
        <p>Vị trí trung tâm: {position.lat}, {position.lng}</p>
        {corners.ne && (
          <div
>
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
