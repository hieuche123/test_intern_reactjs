
import anh from "../assets/test.jpg"
import "./GoogleMapOverlay.css"
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import {REACT_APP_GOOGLE_MAPS_KEY} from '../constants/constants'
import "./GoogleMapOverlay.css";
import React, { useState, useEffect } from "react";
import { Marker } from "@react-google-maps/api"; // Import Marker for completeness

const mapContainerStyle = { width: "100vw", height: "100vh" };
const center = { lat: 21.1365, lng: 105.8176 };

const overlayImageStyle = (opacity) => ({
  width: "100vw",
  height: "100vh",
  opacity: opacity,
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: 1,
  pointerEvents: "none", // Ensure no interaction with map
});

const GoogleMapOverlay = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
  });
  const [opacity, setOpacity] = useState(0.5);
  const [map, setMap] = useState(null); // Store the map instance

  useEffect(() => {
    if (map) {
      // Add zoom_changed event listener
      map.addListener("zoom_changed", () => {
        const newZoom = map.getZoom();
        const newOpacity = calculateOpacity(newZoom); // Define calculateOpacity function
        setOpacity(newOpacity);
      });
    }
  }, [map]);

  const calculateOpacity = (zoomLevel) => {
    // Define logic to map zoom level to opacity (e.g., higher zoom -> lower opacity)
    const minZoom = 1; // Minimum zoom level
    const maxZoom = 20; // Maximum zoom level
    const minOpacity = 0.1; // Minimum opacity
    const maxOpacity = 0.8; // Maximum opacity

    const zoomRange = maxZoom - minZoom;
    const opacityRange = maxOpacity - minOpacity;

    const normalizedZoom = (zoomLevel - minZoom) / zoomRange;
    const newOpacity = minOpacity + normalizedZoom * opacityRange;

    return newOpacity;
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        options={{ disableDefaultUI: true }}
        onLoad={(mapInstance) => setMap(mapInstance)} // Store map instance
      >
        { /* Add markers or other map elements here */}
        <Marker position={center} />
      </GoogleMap>
      <img src={anh} alt="Overlay" style={overlayImageStyle(opacity)} />
      <div className="scroll" style={{
        position: 'absolute',
        bottom: '90%',
        left: '90%',
        transform: 'translateX(-50%)',
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 2, // thanh kéo nằm trên cả overlay
        display: 'flex',
        alignItems: 'center',
      }}>
        <div className="scroll-item">
            <input
            className="input-scroll1"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            style={{ marginRight: '10px', }}
            />
            <h5 className="input-scroll2">{`Opacity: ${opacity.toFixed(2)}`}</h5>

        </div>
      </div>
    </div>
  );
};

export default GoogleMapOverlay;