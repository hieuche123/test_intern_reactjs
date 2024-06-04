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

const overlayImageStyle = (scale, opacity) => ({
  width: `${100 * scale}%`,
  height: `${100 * scale}%`,
  opacity: opacity,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 1,
  pointerEvents: 'none',
});

const GoogleMapOverlay = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
  });

  const [opacity, setOpacity] = useState(0.5);
  const [zoom, setZoom] = useState(13);
  const [previousZoom, setPreviousZoom] = useState(13); // Lưu zoom level trước đó
  const [centerPosition, setCenterPosition] = useState(center); // Lưu vị trí trung tâm trước đó
  const mapRef = useRef();

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    map.addListener('zoom_changed', () => {
      setZoom(map.getZoom());
    });
  }, []);

  useEffect(() => {
    const handleScroll = (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        setZoom(prevZoom => Math.min(prevZoom + 1, 21)); // Tăng zoom level của Google Map lên
      } else {
        setZoom(prevZoom => Math.max(prevZoom - 1, 1)); // Giảm zoom level của Google Map xuống
      }
    };

    window.addEventListener('wheel', handleScroll, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      const previousCenter = map.getCenter(); // Lấy vị trí trung tâm trước đó
      const previousScale = Math.pow(2, (previousZoom - 13) / 2); // Tính tỷ lệ zoom trước đó

      const scaleDifference = Math.pow(2, (zoom - previousZoom) / 2); // Tính sự khác biệt về tỷ lệ zoom
      const newScale = previousScale * scaleDifference; // Tính tỷ lệ zoom mới

      const newCenter = {
        lat: previousCenter.lat(),
        lng: previousCenter.lng(),
      };

      setCenterPosition(newCenter); // Cập nhật vị trí trung tâm mới
      setPreviousZoom(zoom); // Cập nhật zoom level trước đó

      map.panTo(newCenter); // Di chuyển bản đồ đến vị trí mới
      map.setZoom(zoom); // Cập nhật zoom level
    }
  }, [zoom]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={centerPosition} // Sử dụng vị trí trung tâm đã lưu
        zoom={zoom}
        options={{ disableDefaultUI: true }}
        onLoad={onMapLoad}
      />
      <img
        src={anh}
        alt="Overlay"
        style={overlayImageStyle(scale, opacity)}
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