import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, useLoadScript, OverlayView } from '@react-google-maps/api';
import { useDropzone } from 'react-dropzone';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};
const initialCenter = {
  lat: 21.136663,
  lng: 105.7473446,
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyA3bsDl1xddiU_w38hA-fsGea8kWsp5uJM', 
    libraries,
  });

  const [image, setImage] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState(initialCenter);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [currentSize, setCurrentSize] = useState({ width: 0, height: 0 });
  const [corners, setCorners] = useState({});
  const [mapZoom, setMapZoom] = useState(14);

  const mapRef = useRef();
  const imgRef = useRef();

  const [centerInput, setCenterInput] = useState(initialCenter);
  const [cornerInputs, setCornerInputs] = useState({
    ne: { lat: '', lng: '' },
    nw: { lat: '', lng: '' },
    se: { lat: '', lng: '' },
    sw: { lat: '', lng: '' },
  });
  const [sizeInputs, setSizeInputs] = useState({ width: '', height: '' });

  const onMapLoad = map => {
    mapRef.current = map;
    // Lắng nghe sự kiện thay đổi tỷ lệ zoom của bản đồ
    map.addListener('zoom_changed', () => {
      setMapZoom(map.getZoom());
    });
  };

  const onDrop = acceptedFiles => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        setImage(reader.result);
        setImageSize({ width: img.width, height: img.height });
        setCurrentSize({ width: img.width, height: img.height });
        setSizeInputs({ width: img.width, height: img.height });
      };
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  const handleImageMove = (latLng) => {
    setPosition(latLng);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const [section, coord] = name.split('_');

    if (section === 'center') {
      setCenterInput({ ...centerInput, [coord]: parseFloat(value) });
    } else if (section === 'size') {
      setSizeInputs({ ...sizeInputs, [coord]: parseInt(value, 10) });
    } else {
      setCornerInputs({ 
        ...cornerInputs, 
        [section]: { ...cornerInputs[section], [coord]: parseFloat(value) } 
      });
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setPosition(centerInput);
    setCorners({
      ne: new window.google.maps.LatLng(cornerInputs.ne.lat, cornerInputs.ne.lng),
      nw: new window.google.maps.LatLng(cornerInputs.nw.lat, cornerInputs.nw.lng),
      se: new window.google.maps.LatLng(cornerInputs.se.lat, cornerInputs.se.lng),
      sw: new window.google.maps.LatLng(cornerInputs.sw.lat, cornerInputs.sw.lng),
    });
    setImageSize(sizeInputs);
    setCurrentSize({
      width: sizeInputs.width * scale,
      height: sizeInputs.height * scale,
    });
  };

  useEffect(() => {
    if (imageSize.width && imageSize.height) {
      const map = mapRef.current;
      const mapWidth = map.getDiv().offsetWidth;
      const mapHeight = map.getDiv().offsetHeight;
      const mapAspectRatio = mapWidth / mapHeight;
      const imageAspectRatio = imageSize.width / imageSize.height;

      let newWidth, newHeight;
      if (mapAspectRatio > imageAspectRatio) {
        newWidth = mapWidth;
        newHeight = mapWidth / imageAspectRatio;
      } else {
        newWidth = mapHeight * imageAspectRatio;
        newHeight = mapHeight;
      }

      setCurrentSize({
        width: newWidth * scale,
        height: newHeight * scale,
      });
    }
  }, [scale, imageSize, mapRef]);

  useEffect(() => {
    if (mapRef.current && imageSize.width && imageSize.height) {
      const bounds = calculateImageBounds(position, currentSize);
      setCorners(bounds);
    }
  }, [position, currentSize]);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      const zoomScale = Math.pow(2, mapZoom - 14); // Điều chỉnh hệ số phóng to/thu nhỏ dựa trên mức zoom hiện tại
      setCurrentSize({
        width: imageSize.width * scale * zoomScale,
        height: imageSize.height * scale * zoomScale,
      });
    }
  }, [mapZoom, scale, imageSize]);

  const calculateImageBounds = (center, size) => {
    const map = mapRef.current;
    const overlayProjection = map.getProjection();
    
    const centerPoint = overlayProjection.fromLatLngToPoint(new window.google.maps.LatLng(center));
    const halfWidth = size.width / 2;
    const halfHeight = size.height / 2;

    const ne = overlayProjection.fromPointToLatLng(new window.google.maps.Point(centerPoint.x + halfWidth, centerPoint.y - halfHeight));
    const nw = overlayProjection.fromPointToLatLng(new window.google.maps.Point(centerPoint.x - halfWidth, centerPoint.y - halfHeight));
    const se = overlayProjection.fromPointToLatLng(new window.google.maps.Point(centerPoint.x + halfWidth, centerPoint.y + halfHeight));
    const sw = overlayProjection.fromPointToLatLng(new window.google.maps.Point(centerPoint.x - halfWidth, centerPoint.y + halfHeight));

    return { ne, nw, se, sw };
  };

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';

  return (
    <div>
      <div {...getRootProps()} style={{ position: 'absolute', top: 10, left: 10, zIndex: 1, padding: 10, background: 'white', borderRadius: 4 }}>
        <input {...getInputProps()} />
        <p>Kéo & thả ảnh hoặc click để chọn ảnh</p>
      </div>
      <div style={{ position: 'absolute', top: 80, left: 10, zIndex: 1,background: 'white', padding: 10, borderRadius: 4 }}>
        <div>
          <label>Độ trong suốt:</label>
          <Slider min={0} max={1} step={0.01} value={opacity} onChange={setOpacity} />
        </div>
        <div>
          <label>Phóng to/Thu nhỏ:</label>
          <Slider min={0} max={2} step={0.001} value={scale} onChange={setScale} />
        </div>
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={mapZoom}
        center={initialCenter}  // Set this to initialCenter so map position does not change
        options={options}
        onLoad={onMapLoad}
        onClick={(e) => handleImageMove({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
      >
        {image && (
          <OverlayView
            position={position}
            mapPaneName={OverlayView.OVERLAY_LAYER}
          >
            <div
              ref={imgRef}
              style={{ position: 'absolute', transform: `translate(-50%, -50%)`, cursor: 'move' }}
            >
              <img
                src={image}
                alt="Overlay"
                style={{
                  width: currentSize.width,
                  height: currentSize.height,
                  opacity,
                }}
                draggable={false}
              />
            </div>
          </OverlayView>
        )}
      </GoogleMap>
      <div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 1, background: 'white', padding: 10, borderRadius: 4 }}>
        <form onSubmit={handleFormSubmit}>
        <div>
            <label>Vị trí trung tâm:</label>
            <input 
              type="number" 
              step="any" 
              name="center_lat" 
              value={centerInput.lat} 
              onChange={handleInputChange} 
            />
            <input 
              type="number" 
              step="any" 
              name="center_lng" 
              value={centerInput.lng} 
              onChange={handleInputChange} 
            />
          </div>
          <div>
            <label>Góc đông bắc:</label>
            <input 
              type="number" 
              step="any" 
              name="ne_lat" 
              value={cornerInputs.ne.lat} 
              onChange={handleInputChange} 
            />
            <input 
              type="number" 
              step="any" 
              name="ne_lng" 
              value={cornerInputs.ne.lng} 
              onChange={handleInputChange} 
            />
          </div>
          <div>
            <label>Góc tây bắc:</label>
            <input 
              type="number" 
              step="any" 
              name="nw_lat" 
              value={cornerInputs.nw.lat} 
              onChange={handleInputChange} 
            />
            <input 
              type="number" 
              step="any" 
              name="nw_lng" 
              value={cornerInputs.nw.lng} 
              onChange={handleInputChange} 
            />
          </div>
          <div>
            <label>Góc đông nam:</label>
            <input 
              type="number" 
              step="any" 
              name="se_lat" 
              value={cornerInputs.se.lat} 
              onChange={handleInputChange} 
            />
            <input 
              type="number" 
              step="any" 
              name="se_lng" 
              value={cornerInputs.se.lng} 
              onChange={handleInputChange} 
            />
          </div>
          <div>
            <label>Góc tây nam:</label>
            <input 
              type="number" 
              step="any" 
              name="sw_lat" 
              value={cornerInputs.sw.lat} 
              onChange={handleInputChange} 
            />
            <input 
              type="number" 
              step="any" 
              name="sw_lng" 
              value={cornerInputs.sw.lng} 
              onChange={handleInputChange} 
            />
          </div>
          <div>
            <label>Kích thước ảnh (width x height):</label>
            <input 
              type="number" 
              step="any"
              name="size_width" 
              value={sizeInputs.width} 
              onChange={handleInputChange} 
            />
            <input 
              type="number" 
              name="size_height" 
              value={sizeInputs.height} 
              onChange={handleInputChange} 
            />
          </div>
          <button type="submit">Cập nhật</button>
        </form>
        <p>Khi click vào đâu trên bản đồ thì tâm ảnh nằm ở đó</p>
        <p>Kích thước ban đầu: {imageSize.width} x {imageSize.height}</p>
        <p>Kích thước hiện tại: {currentSize.width} x {currentSize.height}</p>
        <p>Vị trí trung tâm: {position.lat}, {position.lng}</p>
        {corners.ne && (
          <div>
            <p>Góc đông bắc: {corners.ne.lat()}, {corners.ne.lng()}</p>
            <p>Góc tây bắc: {corners.nw.lat()}, {corners.nw.lng()}</p>
            <p>Góc đông nam: {corners.se.lat()}, {corners.se.lng()}</p>
            <p>Góc tây nam: {corners.sw.lat()}, {corners.sw.lng()}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
