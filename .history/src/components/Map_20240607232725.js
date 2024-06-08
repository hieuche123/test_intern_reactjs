import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, OverlayView, useJsApiLoader } from '@react-google-maps/api';

const MapComponent = () => {
  const [image, setImage] = useState(null);
  const [opacity, setOpacity] = useState(0.5);
  const [mapCenter, setMapCenter] = useState({ lat: 21.0285, lng: 105.8542 }); // Tọa độ Hà Nội
  const [mapZoom, setMapZoom] = useState(10);
  const [overlaySize, setOverlaySize] = useState({ width: 0, height: 0 });
  const overlayRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'YOUR_API_KEY',
  });

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.onload = () => {
        setOverlaySize({ width: img.width, height: img.height });
      };
      img.src = image;
    }
  }, [image]);

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

  const handleMapClick = (event) => {
    setMapCenter({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const getPixelPositionOffset = (width, height) => ({
    x: -width / 2,
    y: -height / 2,
  });

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <input type="file" onChange={handleFileUpload} accept="image/*" style={{ position: 'absolute', top: '10px', left: '10px', zIndex: '1001' }} />
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={opacity}
        onChange={handleOpacityChange}
        style={{ position: 'absolute', top: '10px', left: '60px', zIndex: '1001' }}
      />
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={mapCenter}
          zoom={mapZoom}
          onClick={handleMapClick}
        >
          {image && (
            <OverlayView
              position={mapCenter}
              mapPaneName={OverlayView.OVERLAY_LAYER}
              getPixelPositionOffset={() => getPixelPositionOffset(overlaySize.width, overlaySize.height)}
            >
              {({ position, getPixelPositionOffset }) => (
                <div
                  style={{
                    position: 'absolute',
                    width: overlaySize.width,
                    height: overlaySize.height,
                    top: 0,
                    left: 0,
                    opacity: opacity,
                    ...getPixelPositionOffset(overlaySize.width, overlaySize.height),
                  }}
                >
                  <img src={image} alt="Map Overlay" style={{ width: '100%', height: '100%' }} />
                </div>
              )}
            </OverlayView>
          )}
        </GoogleMap>
      )}
    </div>
  );
};

export default MapComponent;
