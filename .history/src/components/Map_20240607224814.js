import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, OverlayView, useJsApiLoader } from '@react-google-maps/api';

const MapComponent = () => {
  const [image, setImage] = useState(null);
  const [opacity, setOpacity] = useState(0.5);
  const [mapCenter, setMapCenter] = useState({ lat: 21.0285, lng: 105.8542 }); // Tọa độ Hà Nội
  const [mapZoom, setMapZoom] = useState(10);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const mapRef = useRef();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'YOUR_API_KEY',
  });

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
        // Tính toán vị trí ban đầu của hình ảnh
        const imageInitialPosition = {
          lat: mapCenter.lat,
          lng: mapCenter.lng - (img.width / 2) * (360 / (Math.pow(2, mapZoom)) * Math.cos((mapCenter.lat * Math.PI) / 180)),
        };
        setMapCenter(imageInitialPosition);
      };
      img.src = image;
    }
  }, [image, mapCenter, mapZoom]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleOpacityChange = (event) => {
    setOpacity(parseFloat(event.target.value));
  };

  const handleMapDrag = () => {
    const map = mapRef.current;
    if (map) {
      setMapCenter(map.getCenter().toJSON());
    }
  };

  const handleMapZoom = () => {
    const map = mapRef.current;
    if (map) {
      setMapZoom(map.getZoom());
    }
  };

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <input type="file" onChange={handleFileUpload} accept="image/*" />
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={opacity}
        onChange={handleOpacityChange}
      />
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={mapCenter}
          zoom={mapZoom}
          onLoad={(map) => {
            mapRef.current = map;
            handleMapDrag();
            handleMapZoom();
          }}
          onDragEnd={handleMapDrag}
          onZoomChanged={handleMapZoom}
        >
          {image && (
            <OverlayView
              position={mapCenter}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              {({ getPixelPositionOffset }) => (
                <div
                  style={getPixelPositionOffset({ x: -(imageSize.width / 2), y: -(imageSize.height / 2) })}
                >
                  <img
                    src={image}
                    alt="Map Overlay"
                    style={{ width: imageSize.width, height: imageSize.height, opacity }}
                  />
                </div>
              )}
            </OverlayView>
          )}
        </GoogleMap>
      )}
      <div>
        Image Size: {imageSize.width} x {imageSize.height}
      </div>
      <div>
        Image Coordinates: {mapCenter.lat}, {mapCenter.lng}
      </div>
    </div>
  );
};

export default MapComponent;
