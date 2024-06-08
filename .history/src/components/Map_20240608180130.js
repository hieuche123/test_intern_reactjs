import React from 'react';
import { GoogleMap, LoadScript, GroundOverlay } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 40.712776, // Vĩ độ của trung tâm bản đồ
  lng: -74.005974, // Kinh độ của trung tâm bản đồ
};

const bounds = {
  north: 40.773941, // Vĩ độ của cạnh trên của hình ảnh
  south: 40.712216, // Vĩ độ của cạnh dưới của hình ảnh
  east: -74.12544, // Kinh độ của cạnh phải của hình ảnh
  west: -74.22655, // Kinh độ của cạnh trái của hình ảnh
};

const imageUrl = 'URL_TO_YOUR_IMAGE'; // Đường dẫn tới hình ảnh của bạn

const MapComponent = () => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyA3bsDl1xddiU_w38hA-fsGea8kWsp5uJM">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
      >
        <GroundOverlay
          url={imageUrl}
          bounds={bounds}
          opacity={0.6} // Độ trong suốt của hình ảnh, có thể điều chỉnh
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;