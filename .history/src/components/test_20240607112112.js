import React, { useState } from "react";
import { GoogleMap, LoadScript, GroundOverlay } from "@react-google-maps/api";

const mapContainerStyle = {
  height: "100vh",
  width: "100%"
};

const center = {
  lat: 21.1152005,
  lng: 105.8281097
};

const widthImage = 1031; // in pixels
const heightImage = 729; // in pixels
const mapScale = 25000; // tỷ lệ của ảnh bản đồ (1:25000)

const Test = () => {
  const [opacity, setOpacity] = useState(0.35);

  const calculateBounds = () => {
    // Chuyển đổi kích thước ảnh sang đơn vị thực tế (mét)
    const widthInMeters = widthImage / mapScale;
    const heightInMeters = heightImage / mapScale;

    // Tính toán lại `imageBounds`
    const imageBounds = {
      north: center.lat + heightInMeters / 2,
      south: center.lat - heightInMeters / 2,
      east: center.lng + widthInMeters / 2,
      west: center.lng - widthInMeters / 2
    };

    return imageBounds;
  };

  return (
    <LoadScript googleMapsApiKey={"YOUR_API_KEY"}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={center}
      >
        <GroundOverlay
          url="https://your-image-url.jpg"
          bounds={calculateBounds()}
          opacity={opacity}
        />
      </GoogleMap>
      <div style={{ position: "absolute", top: 60, right: 10, zIndex: 1000 }}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={opacity}
          onChange={e => setOpacity(parseFloat(e.target.value))}
        />
      </div>
    </LoadScript>
  );
};

export default Test;
