// src/components/UploadImage.js
import React, { useState } from 'react';

const UploadImage = ({ setImageOverlay }) => {
  const [image, setImage] = useState(null);
  const [topLeft, setTopLeft] = useState({ lat: '', lng: '' });
  const [bottomRight, setBottomRight] = useState({ lat: '', lng: '' });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSetOverlay = () => {
    setImageOverlay({
      url: image,
      bounds: {
        north: parseFloat(topLeft.lat),
        south: parseFloat(bottomRight.lat),
        east: parseFloat(bottomRight.lng),
        west: parseFloat(topLeft.lng)
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
          onChange={(e) => setTopLeft({ ...topLeft, lat: e.target.value })}
        />
        <label>Longitude: </label>
        <input
          type="number"
          value={topLeft.lng}
          onChange={(e) => setTopLeft({ ...topLeft, lng: e.target.value })}
        />
      </div>
      <div>
        <label>Bottom Right Latitude: </label>
        <input
          type="number"
          value={bottomRight.lat}
          onChange={(e) => setBottomRight({ ...bottomRight, lat: e.target.value })}
        />
        <label>Longitude: </label>
        <input
          type="number"
          value={bottomRight.lng}
          onChange={(e) => setBottomRight({ ...bottomRight, lng: e.target.value })}
        />
      </div>
      <button onClick={handleSetOverlay}>Set Overlay</button>
    </div>
  );
}

export default UploadImage;
