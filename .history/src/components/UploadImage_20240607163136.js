// src/components/UploadImage.js
import React, { useState } from 'react';

const UploadImage = ({ setImageOverlay }) => {
  const [image, setImage] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [topLeft, setTopLeft] = useState({ lat: 21.028511, lng: 105.804817 });
  const [bottomRight, setBottomRight] = useState({ lat: 21.018511, lng: 105.814817 });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          setImageSize({ width: img.width, height: img.height });
          setImage(reader.result);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSetOverlay = () => {
    const aspectRatio = imageSize.width / imageSize.height;
    const latDiff = topLeft.lat - bottomRight.lat;
    const lngDiff = bottomRight.lng - topLeft.lng;

    // Ensure the aspect ratio of the bounds matches the image's aspect ratio
    let adjustedLatDiff = latDiff;
    let adjustedLngDiff = lngDiff;

    if (latDiff / lngDiff > aspectRatio) {
      adjustedLngDiff = latDiff / aspectRatio;
    } else {
      adjustedLatDiff = lngDiff * aspectRatio;
    }

    setImageOverlay({
      url: image,
      bounds: {
        north: topLeft.lat + adjustedLngDiff,
        south: topLeft.lat - adjustedLatDiff,
        east: topLeft.lng + adjustedLngDiff,
        west: topLeft.lng - adjustedLatDiff,
      }
    });
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <div>
        <label>Top Left Latitude: </label>
        <input
          type="number"
          value={topLeft.lat}
          onChange={(e) => setTopLeft({ ...topLeft, lat: parseFloat(e.target.value) })}
        />
        <label>Longitude: </label>
        <input
          type="number"
          value={topLeft.lng}
          onChange={(e) => setTopLeft({ ...topLeft, lng: parseFloat(e.target.value) })}
        />
      </div>
      <div>
        <label>Bottom Right Latitude: </label>
        <input
          type="number"
          value={bottomRight.lat}
          onChange={(e) => setBottomRight({ ...bottomRight, lat: parseFloat(e.target.value) })}
        />
        <label>Longitude: </label>
        <input
          type="number"
          value={bottomRight.lng}
          onChange={(e) => setBottomRight({ ...bottomRight, lng: parseFloat(e.target.value) })}
        />
      </div>
      <button onClick={handleSetOverlay}>Set Overlay</button>
    </div>
  );
}

export default UploadImage;
