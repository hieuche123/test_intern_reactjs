import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import anh from "../assets/test.jpg";
import { REACT_APP_GOOGLE_MAPS_KEY } from '../constants/constants';
import "./GoogleMapOverlay.css";

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
  position: 'relative',
  overflow: 'hidden',
};

const center = {
  lat: 21.1365,
  lng: 105.8176,
};

const overlayImageStyle = (scale, opacity, center) => ({
  width: `${100 * scale}%`,
  height: `${100 * scale}%`,
  opacity: opacity,
  position: 'absolute',
  top: `calc(50% - ${center.y}px)`, // Dựa trên vị trí trung tâm của ảnh
  left: `calc(50% - ${center.x}px)`, // Dựa trên vị trí trung tâm của ảnh
  transform: 'translate(-50%, -50%)',
  zIndex: 1,
  pointerEvents: 'none',
});

const GoogleMapOverlay = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
  });

  const [opacity, setOpacity] = useState(0.5);
  const [mapZoom, setMapZoom] = useState(13);
  const [imageZoom, setImageZoom] = useState(1);
  const [imageCenter, setImageCenter] = useState({ x: 0, y: 0 }); // Lưu trữ vị trí trung tâm của ảnh
  const mapRef = useRef();

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    map.addListener('zoom_changed', () => {
      setMapZoom(map.getZoom());
      setImageZoom(prevZoom => Math.pow(2, map.getZoom() - 13)); // Tính tỷ lệ zoom của ảnh dựa trên zoom level của Google Map
    });
  }, []);

  useEffect(() => {
    const handleScroll = (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        setMapZoom(prevZoom => Math.min(prevZoom + 1, 21)); // Tăng zoom level của Google Map lên
        setImageZoom(prevZoom => prevZoom * 2); // Tăng tỷ lệ zoom của ảnh lên gấp đôi
      } else {
        setMapZoom(prevZoom => Math.max(prevZoom - 1, 1)); // Giảm zoom level của Google Map xuống
        setImageZoom(prevZoom => Math.max(prevZoom / 2, 1)); // Giảm tỷ lệ zoom của ảnh xuống một nửa, nhưng không nhỏ hơn 1
      }
    };

    window.addEventListener('wheel', handleScroll, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  const mapOptions = {
    disableDefaultUI: true,
    gestureHandling: 'cooperative', // Đảm bảo việc cuộn không thay đổi vị trí bản đồ
  };

  const bounds = { // Tạo bounds từ kích thước của khung hình màn hình
    north: center.lat + 0.01,
    south: center.lat - 0.01,
    east: center.lng + 0.01,
    west: center.lng - 0.01,
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={mapZoom}
        options={mapOptions}
        onLoad={onMapLoad}
        onBoundsChanged={() => { // Khi khung hình của bản đồ thay đổi
          const map = mapRef.current;
          if (map) {
            const newBounds = map.getBounds(); // Lấy bounds mới
            if (!newBounds.contains(center)) { // Nếu trung tâm không nằm trong bounds mới
              map.fitBounds(bounds); // Thu phóng bản đồ để vùng hiển thị chứa trung tâm
            }
          }
          const centerPoint = map.getProjection().fromLatLngToPoint(center); // Lấy vị trí trung tâm dưới dạng pixel
          setImageCenter({ // Cập nhật vị trí trung tâm của ảnh dựa trên vị trí trung tâm mới của bản đồ
            x: centerPoint.x * Math.pow(2, mapZoom - 13),
            y: centerPoint.y * Math.pow(2, mapZoom - 13),
          });
        }}
      />
      <img
        src={anh}
        alt="Overlay"
        style={overlayImageStyle(imageZoom, opacity, imageCenter)} // Truyền vào vị trí trung tâm của ảnh
      />
      <div className="scroll" style={{
        position: 'absolute',
        bottom: '90%',
        left: '90%',
        transform: 'translateX(-50%)',
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 2,
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
            style={{ marginRight: '10px' }}
          />
          <h5 className="input-scroll2">{`Opacity: ${opacity.toFixed(2)}`}</h5>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapOverlay;
