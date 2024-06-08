import React, { useState, useEffect } from 'react';
import { GoogleMap, GroundOverlay, useJsApiLoader } from '@react-google-maps/api';

const MapComponent = () => {
  const [image, setImage] = useState(null);
  const [opacity, setOpacity] = useState(0.5);
  const [mapCenter, setMapCenter] = useState({ lat: 21.0285, lng: 105.8542 }); // Tọa độ Hà Nội
  const [mapZoom, setMapZoom] = useState(1);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyA3bsDl1xddiU_w38hA-fsGea8kWsp5uJM',
  });

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
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

  const handleMapLoad = (map) => {
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(mapCenter);
    map.fitBounds(bounds);
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
          onLoad={(map) => handleMapLoad(map)}
        >
          {image && (
            <GroundOverlay
              url={image}
              bounds={{
                north: mapCenter.lat + (imageSize.height / 2) * 0.00009,
                south: mapCenter.lat - (imageSize.height / 2) * 0.00009,
                east: mapCenter.lng + (imageSize.width / 2) * 0.00009,
                west: mapCenter.lng - (imageSize.width / 2) * 0.00009,
              }}
              options={{
                opacity: opacity,
              }}
            />
          )}
        </GoogleMap>
      )}
      <div>
        Image Size: {imageSize.width} x {imageSize.height}
      </div>
    </div>
  );
};

export default MapComponent;
