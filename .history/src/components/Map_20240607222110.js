import React, { useState } from 'react';
import { GoogleMap, OverlayView } from '@react-google-maps/api';

const MapOverlay = ({ image, opacity, position, map }) => {
  const overlayRef = React.useRef(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const onLoad = () => {
    const { naturalWidth, naturalHeight } = image;
    setImageDimensions({ width: naturalWidth, height: naturalHeight });
  };

  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_LAYER}
      getPixelPositionOffset={(width, height) => ({
        x: -(width / 2),
        y: -(height / 2),
      })}
    >
      <div
        style={{
          opacity,
          width: imageDimensions.width,
          height: imageDimensions.height,
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        ref={overlayRef}
      >
        <img
          src={image.src}
          alt="Map Overlay"
          onLoad={onLoad}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </OverlayView>
  );
};

const Map = () => {
  const [image, setImage] = useState(null);
  const [opacity, setOpacity] = useState(0.5);
  const [position, setPosition] = useState({ lat: 0, lng: 0 });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage({ src: e.target.result, file });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={opacity}
        onChange={(event) => setOpacity(parseFloat(event.target.value))}
      />
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '400px' }}
        center={position}
        zoom={8}
        onClick={(e) => setPosition(e.latLng.toJSON())}
      >
        {image && (
          <MapOverlay
            image={image}
            opacity={opacity}
            position={position}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default Map;
