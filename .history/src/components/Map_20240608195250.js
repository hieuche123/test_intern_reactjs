import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';

const MapOverlay = ({ image, opacity, zoom }) => {
  const [mapBounds, setMapBounds] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    if (mapBounds) {
      // Calculate image corner coordinates
      const topLeft = mapBounds.getNorthWest();
      const topRight = mapBounds.getNorthEast();
      const bottomLeft = mapBounds.getSouthWest();
      const bottomRight = mapBounds.getSouthEast();

      console.log("Top left:", topLeft, "Top right:", topRight, "Bottom left:", bottomLeft, "Bottom right:", bottomRight);
    }
  }, [mapBounds]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      <img src={image} alt="Overlay" style={{ opacity: opacity, width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', bottom: 10, left: 10, color: 'white' }}>
        <p>Image Size: {image.width}x{image.height}</p>
        <p>Current Zoom: {zoom}</p>
      </div>
    </div>
  );
};

const MapWithOverlay = ({ apiKey, initialZoom, initialCenter }) => {
  const [image, setImage] = useState(null);
  const [opacity, setOpacity] = useState(0.5);
  const [zoom, setZoom] = useState(initialZoom);

  const handleMapChange = ({ bounds, center, zoom }) => {
    // Update map bounds
    console.log("Bounds:", bounds);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        setImage(img);
      };
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <input type="file" onChange={handleFileChange} />
      <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} />
      <input type="range" min="0" max="20" step="1" value={zoom} onChange={(e) => setZoom(parseInt(e.target.value))} />
      <GoogleMapReact
        bootstrapURLKeys={{ key: apiKey }}
        defaultCenter={initialCenter}
        defaultZoom={initialZoom}
        onChange={handleMapChange}
      >
        {image && <MapOverlay image={image} opacity={opacity} zoom={zoom} />}
      </GoogleMapReact>
    </div>
  );
};

// Usage
const apiKey = 'AIzaSyA3bsDl1xddiU_w38hA-fsGea8kWsp5uJM'; // Replace with your Google Maps API key
const initialCenter = { lat: 0, lng: 0 }; // Initial center of the map
const initialZoom = 10; // Initial zoom level of the map

const App = () => {
  return <MapWithOverlay apiKey={apiKey} initialCenter={initialCenter} initialZoom={initialZoom} />;
};

export default App;
