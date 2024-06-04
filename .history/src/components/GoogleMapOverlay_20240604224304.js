import anh from "../assets/test.jpg";
import "./GoogleMapOverlay.css";
import React, { useState } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { REACT_APP_GOOGLE_MAPS_KEY } from "../constants/constants";

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
  pointerEvents: "none", // Đảm bảo không can thiệp vào tương tác bản đồ
});

const GoogleMapOverlay = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
  });

  const [opacity, setOpacity] = useState(0.5);
  const [zoomLevel, setZoomLevel] = useState(1); // Mức thu phóng ban đầu

  const handleZoomChange = (newZoomLevel) => {
    setZoomLevel(newZoomLevel);
    const opacity = calculateOpacity(newZoomLevel); // Áp dụng logic tính toán độ mờ dựa trên mức thu phóng
    setOpacity(opacity);
  };

  if (loadError) return <div>Lỗi tải bản đồ</div>;
  if (!isLoaded) return <div>Đang tải bản đồ</div>;

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoomLevel} // Sử dụng biến zoomLevel thay vì zoom cố định
        options={{ ...options, zoomControl: false }} // Tắt zoom mặc định
        onZoomChanged={(event) => handleZoomChange(event.zoom)} // Bắt sự kiện thay đổi zoom
      />
      <img
        src={anh}
        alt="Lớp phủ"
        style={overlayImageStyle(opacity)}
      />
      {/* Thêm phần tử điều khiển thu phóng tùy chỉnh tại đây */}
    </div>
  );
};

export default GoogleMapOverlay;