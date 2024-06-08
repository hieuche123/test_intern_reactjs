import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, Marker, OverlayView, useJsApiLoader } from '@react-google-maps/api';

const MapComponent = () => {
  const [image, setImage] = useState(null);
  const [opacity, setOpacity] = useState(0.5);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [mapZoom, setMapZoom] = useState(5);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const mapRef = useRef();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'YOUR_API_KEY',
  });

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

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
      };
      img.src = image;
    }
  }, [image]);

  return (
    <div>
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
          mapContainerStyle={{ width: '100%', height: '400px' }}
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
              mapPaneName={OverlayView.OVERLAY_LAYER}
              getPixelPositionOffset={(width, height) => ({
                x: -(width / 2),
                y: -(height / 2),
              })}
            >
              <div style={{ opacity }}>
                <img
                  src={image}
                  alt="Map Overlay"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
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