import anh from "../assets/test.jpg";
import "./GoogleMapOverlay.css";
import React, { useState, useEffect } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { REACT_APP_GOOGLE_MAPS_KEY } from "../constants/constants";
import { customZoomEventEmitter } from "./CustomZoomEventEmitter";

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = {
  lat: 21.1365,
  lng: 105.8176,
};

const overlayImageStyle = (opacity) => ({
  width: "100vw",
  height: "100vh",
  opacity: opacity,
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: 1,
  pointerEvents: "none", // Ensure image doesn't interfere with map interaction
});

const GoogleMapOverlay = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
  });

  const [opacity, setOpacity] = useState(0.5);
  const [simulatedZoomLevel, setSimulatedZoomLevel] = useState(1); // Initial zoom level

  // Function to adjust opacity based on simulated zoom (replace with your logic)
  const calculateOpacity = (zoomLevel) => {
    // Example: Higher zoom -> lower opacity
    return 1 - zoomLevel / 10; // Adjust the formula as needed
  };

  // Handle zoom changes in the custom control (if applicable)
  const handleSimulatedZoomChange = (newZoomLevel) => {
    setSimulatedZoomLevel(newZoomLevel);
    const newOpacity = calculateOpacity(newZoomLevel);
    setOpacity(newOpacity);
  };

  // Trigger custom zoom event when map zoom changes
  const handleMapEvent = (event) => {
    if (event.name === 'zoom_changed' || event.name === 'zoomend') {
      const zoomLevel = event.zoom;
      customZoomEventEmitter.emit('customZoom', zoomLevel);
    }
  };

  useEffect(() => {
    // Add event listener for map events
    google.maps.event.addListener(map, 'zoom_changed', handleMapEvent);
    google.maps.event.addListener(map, 'zoomend', handleMapEvent);

    // Listen for custom zoom events and update opacity
    customZoomEventEmitter.on('customZoom', (zoomLevel) => {
      const newOpacity = calculateOpacity(zoomLevel);
      setOpacity(newOpacity);
    });

    return () => {
      // Remove event listeners on component unmount
      google.maps.event.removeListener(map, 'zoom_changed', handleMapEvent);
      google.maps.event.removeListener(map, 'zoomend', handleMapEvent);

      customZoomEventEmitter.off('customZoom');
    };
  }, [map]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13} // Set a default zoom for the map
        options={{ disableDefaultUI: true }} // Hide default zoom controls
      />
      <img src={anh} alt="Overlay" style={overlayImageStyle(opacity)} />
      {/* Add your custom zoom control element here, calling handleSimulatedZoomChange */}
    </div>
  );
};

export default GoogleMapOverlay;