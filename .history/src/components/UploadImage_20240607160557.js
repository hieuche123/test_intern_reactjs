// src/components/UploadImage.js
import React, { useState } from 'react';

const UploadImage = ({ setImageOverlay }) => {
  const [image, setImage] = useState(null);
  const [topLeft, setTopLeft] = useState({ lat: 21.028511, lng: 105.804817 });
  const [bottomRight, setBottomRight] = useState({ lat: 21.018511, lng: 105.814817 });

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
        north: topLeft.lat,
        south: bottomRight.lat,
        east: bottomRight.lng,
        west: topLeft.lng
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
