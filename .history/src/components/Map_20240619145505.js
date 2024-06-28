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
    map.addListener('zoom_changed', () => {
      setMapZoom(map.getZoom());
    });
  };

  const onDrop = acceptedFiles => {
    const file = acceptedFiles[0];
  

    const worker = new Worker('fileWorker.js');
    worker.postMessage(file);
    worker.onmessage = function(e) {
      const { blob } = e.data;
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
      reader.readAsDataURL(blob);
    };
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
      const zoomScale = Math.pow(2, mapZoom - 14);
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
      <div style={{ position: 'absolute', top: 80, left: 10, zIndex: 1, background: 'white', padding: 10, borderRadius: 4 }}>
        <label>Opacity: </label>
        <Slider value={opacity} min={0} max={1} step={0.01} onChange={value => setOpacity(value)} />
      </div>
      <div style={{ position: 'absolute', top: 140, left: 10, zIndex: 1, background: 'white', padding: 10, borderRadius: 4 }}>
        <label>Scale: </label>
        <Slider value={scale} min={0.1} max={5} step={0.1} onChange={value => setScale(value)} />
      </div>
      <div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 1, background: 'white', padding: 10, borderRadius: 4 }}>
        <form onSubmit={handleFormSubmit}>
          <div>
            <label>Center Latitude: </label>
            <input type="number" name="center_lat" value={centerInput.lat} onChange={handleInputChange} />
          </div>
          <div>
            <label>Center Longitude: </label>
            <input type="number" name="center_lng" value={centerInput.lng} onChange={handleInputChange} />
          </div>
          <div>
            <label>Width: </label>
            <input type="number" name="size_width" value={sizeInputs.width} onChange={handleInputChange} />
          </div>
          <div>
            <label>Height: </label>
            <input type="number" name="size_height" value={sizeInputs.height} onChange={handleInputChange} />
          </div>
          <div>
            <label>NE Corner Lat: </label>
            <input type="number" name="ne_lat" value={cornerInputs.ne.lat} onChange={handleInputChange} />
          </div>
          <div>
            <label>NE Corner Lng: </label>
            <input type="number" name="ne_lng" value={cornerInputs.ne.lng} onChange={handleInputChange} />
          </div>
          <div>
            <label>NW Corner Lat: </label>
            <input type="number" name="nw_lat" value={cornerInputs.nw.lat} onChange={handleInputChange} />
          </div>
          <div>
            <label>NW Corner Lng: </label>
            <input type="number" name="nw_lng" value={cornerInputs.nw.lng} onChange={handleInputChange} />
          </div>
          <div>
            <label>SE Corner Lat: </label>
            <input type="number" name="se_lat" value={cornerInputs.se.lat} onChange={handleInputChange} />
          </div>
          <div>
            <label>SE Corner Lng: </label>
            <input type="number" name="se_lng" value={cornerInputs.se.lng} onChange={handleInputChange} />
          </div>
          <div>
            <label>SW Corner Lat: </label>
            <input type="number" name="sw_lat" value={cornerInputs.sw.lat} onChange={handleInputChange} />
          </div>
          <div>
            <label>SW Corner Lng: </label>
            <input type="number" name="sw_lng" value={cornerInputs.sw.lng} onChange={handleInputChange} />
          </div>
          <button type="submit">Apply</button>
        </form>
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={mapZoom}
        center={initialCenter}
        options={options}
        onLoad={onMapLoad}
      >
        {image && corners.ne && (
          <OverlayView
            position={position}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={(width, height) => ({
              x: -(width / 2),
              y: -(height / 2),
            })}
          >
            <div style={{
              position: 'absolute',
              left: `${(corners.nw.lng - corners.ne.lng) / 2}px`,
              top: `${(corners.nw.lat - corners.sw.lat) / 2}px`,
              opacity: opacity,
              transform: `scale(${scale})`,
            }}>
              <img ref={imgRef} src={image} style={{ width: currentSize.width, height: currentSize.height }} alt="overlay" />
            </div>
          </OverlayView>
        )}
      </GoogleMap>
    </div>
  );
}

export default App;
