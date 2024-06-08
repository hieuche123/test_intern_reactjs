import React, { useState, useEffect } from 'react';

const GoogleMapOverlay = () => {
  const [opacity, setOpacity] = useState(0.5); // Giả sử độ mờ mặc định là 0.5
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Khởi tạo Google Map
    const initMap = () => {
      const mapOptions = {
        center: { lat: 21.1152005, lng: 105.8281097 },
        zoom: 12,
      };
      const googleMap = new window.google.maps.Map(document.getElementById('map'), mapOptions);
      setMap(googleMap);
    };

    // Load Google Map API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA3bsDl1xddiU_w38hA-fsGea8kWsp5uJM&callback=initMap`;
    script.async = true;
    document.body.appendChild(script);

    // Xóa script khi component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Hàm để thêm hình ảnh cắt ra lên bản đồ
  const addOverlayImage = () => {
    if (!map) return;

    const imageBounds = {
      north: 21.1152005 + 0.01, // Giả sử kích thước ảnh là 0.01 độ
      south: 21.1152005 - 0.01,
      east: 105.8281097 + 0.01,
      west: 105.8281097 - 0.01,
    };

    const overlayOptions = {
      opacity: opacity,
      clickable: false,
      map: map,
      bounds: imageBounds,
    };

    const overlay = new window.google.maps.GroundOverlay(
      'path_to_your_image.jpg',
      imageBounds,
      overlayOptions
    );

    overlay.setMap(map);
  };

  return (
    <div>
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={opacity}
        onChange={(e) => setOpacity(parseFloat(e.target.value))}
      />
      <button onClick={addOverlayImage}>Add Image Overlay</button>
    </div>
  );
};

export default GoogleMapOverlay;
