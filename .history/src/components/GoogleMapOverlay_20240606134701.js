import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import anh from "../assets/duan24h.net_BĐQHSDĐ_Dong_Anh_HN_2030.jpg";
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

// Điều chỉnh giá trị ban đầu của imageCenter để thay đổi vị trí ban đầu của hình ảnh
const initialImageCenter = {
  x: 10532.0, // Giá trị x ban đầu
  y: 7415.0, // Giá trị y ban đầu
};

const overlayImageStyle = (scale, opacity, imageCenter) => ({
  width: `${100 * scale}%`,
  height: `${100 * scale}%`,
  opacity: opacity,
  position: 'absolute',
  top: `${imageCenter.y}px`,
  left: `${imageCenter.x}px`,
  transform: 'translate(-50%, -50%)',
  zIndex: 1,
  pointerEvents: 'none',
  objectFit: 'cover', // Thêm thuộc tính object-fit
});

const GoogleMapOverlay = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
  });

  const [opacity, setOpacity] = useState(0.5);
  const [mapZoom, setMapZoom] = useState(13);
  const [imageScale, setImageScale] = useState(1);
  const [imageCenter, setImageCenter] = useState(initialImageCenter); // Sử dụng imageCenter ban đầu
  const mapRef = useRef();

  const updateImagePosition = useCallback(() => {
    const map = mapRef.current;
    if (map) {
      const bounds = map.getBounds();
      if (bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const mapCenter = map.getCenter();

        const mapDiv = map.getDiv().getBoundingClientRect();
        const imageCenterX = (mapCenter.lng() - center.lng) / (ne.lng() - sw.lng()) * mapDiv.width;
        const imageCenterY = (center.lat - mapCenter.lat()) / (ne.lat() - sw.lat()) * mapDiv.height;

        setImageCenter({ x: imageCenterX, y: imageCenterY });
      }
    }
  }, []);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;

    map.addListener('zoom_changed', () => {
      const newZoom = map.getZoom();
      setMapZoom(newZoom);
      setImageScale(Math.pow(2, newZoom - 13));
      updateImagePosition();
    });

    map.addListener('center_changed', () => {
      updateImagePosition();
    });
  }, [updateImagePosition]);

  useEffect(() => {
    updateImagePosition();
  }, [mapZoom, updateImagePosition]);

  if (loadError) return <div>Lỗi khi tải bản đồ</div>;
  if (!isLoaded) return <div>Đang tải bản đồ...</div>;

  const mapOptions = {
    disableDefaultUI: true,
    gestureHandling: 'cooperative',
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={mapZoom}
        options={mapOptions}
        onLoad={onMapLoad}
      />
      <img
        src={anh}
        alt="Overlay"
        style={overlayImageStyle(imageScale, opacity, imageCenter)}
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
          <h5 className="input-scroll2">{`Độ mờ: ${opacity.toFixed(2)}`}</h5>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapOverlay;
