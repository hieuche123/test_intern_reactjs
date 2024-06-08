import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, useLoadScript, GroundOverlay, Marker } from '@react-google-maps/api';
import { useDropzone } from 'react-dropzone';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};
const defaultCenter = {
  lat: 21.0285,
  lng: 105.8542,
};
const defaultOptions = {
  disableDefaultUI: true,
  zoomControl: true,
};

function Map() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyA3bsDl1xddiU_w38hA-fsGea8kWsp5uJM', // Thay YOUR_GOOGLE_MAPS_API_KEY bằng API key của bạn
    libraries,
  });

  const [image, setImage] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(14);
  const [imageBounds, setImageBounds] = useState(null);
  const [imagePosition, setImagePosition] = useState(defaultCenter);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [cornerCoordinates, setCornerCoordinates] = useState({ ne: null, nw: null, se: null, sw: null });

  const onDrop = acceptedFiles => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        setImage(reader.result);
        setImageSize({ width: img.width, height: img.height });
        setImageBounds({
          north: mapCenter.lat + 0.01,
          south: mapCenter.lat - 0.01,
          east: mapCenter.lng + 0.01,
          west: mapCenter.lng - 0.01,
        });
      };
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  const handleOpacityChange = (value) => {
    setOpacity(value);
  };

  const handleScaleChange = (value) => {
    setScale(value);
  };

  const handleMapMove = () => {
    setMapCenter({
      lat: mapRef.current.getCenter().lat(),
      lng: mapRef.current.getCenter().lng(),
    });
    setMapZoom(mapRef.current.getZoom());
    setImagePosition(mapRef.current.getCenter());
  };

  const mapRef = useRef();

  useEffect(() => {
    if (mapRef.current && mapCenter) {
      setImageBounds({
        north: mapCenter.lat + 0.01,
        south: mapCenter.lat - 0.01,
        east: mapCenter.lng + 0.01,
        west: mapCenter.lng - 0.01,
      });
    }
  }, [mapCenter]);

  useEffect(() => {
    if (imageSize.width && imageSize.height && imagePosition) {
      const cornerNE = { lat: imagePosition.lat + imageSize.height / 2, lng: imagePosition.lng + imageSize.width / 2 };
      const cornerNW = { lat: imagePosition.lat + imageSize.height / 2, lng: imagePosition.lng - imageSize.width / 2 };
      const cornerSE = { lat: imagePosition.lat - imageSize.height / 2, lng: imagePosition.lng + imageSize.width / 2 };
      const cornerSW = { lat: imagePosition.lat - imageSize.height / 2, lng: imagePosition.lng - imageSize.width / 2 };
      setCornerCoordinates({ ne: cornerNE, nw: cornerNW, se: cornerSE, sw: cornerSW });
    }
  }, [imageSize, imagePosition]);

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
          <Slider min={0} max={1} step={0.01} value={opacity} onChange={handleOpacityChange} />
        </div>
        <div>
          <label>Phóng to/Thu nhỏ:</label>
          <Slider min={0} max={2} step={0.01} value={scale} onChange={handleScaleChange} />
        </div>
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={mapZoom}
        center={mapCenter}
        options={defaultOptions}
        onLoad={map => mapRef.current = map}
        onDragEnd={handleMapMove}
        onZoomChanged={handleMapMove}
      >
        {imageBounds && (
          <GroundOverlay
            bounds={imageBounds}
            url={image}
            opacity={opacity}
          />
        )}
        {cornerCoordinates.ne && (
          <>
            <Marker position={cornerCoordinates.ne} label={`NE (${cornerCoordinates.ne.lat.toFixed(6)}, ${cornerCoordinates.ne.lng.toFixed(6)})`} />
            <Marker position={cornerCoordinates.nw} label={`NW (${cornerCoordinates.nw.lat.toFixed(6)}, ${cornerCoordinates.nw.lng.toFixed(6)})`} />
            <Marker position={cornerCoordinates.se} label={`SE (${cornerCoordinates.se.lat.toFixed(6)}, ${cornerCoordinates.se.lng.toFixed(6)})`} />
            <Marker position={cornerCoordinates.sw} label={`SW (${cornerCoordinates.sw.lat.toFixed(6)}, ${cornerCoordinates.sw.lng.toFixed(6)})`} />
          </>
        )}
      </GoogleMap>
      <div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 1, background: 'white', padding: 10, borderRadius: 4 }}>
        <p>Kích thước ban đầu: {imageSize.width} x {imageSize.height}</p>
        <p>Vị trí của ảnh: {imagePosition.lat.toFixed(6)}, {imagePosition.lng.toFixed(6)}</p>
      </div>
    </div>
  );
}

export default Map;