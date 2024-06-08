// src/components/UploadImage.js
import React, { useState } from 'react';

const UploadImage = ({ setImageOverlay }) => {
  const [image, setImage] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: 21.1807985,lng: 105.620778 });

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
        north: coordinates.lat + 0.01,
        south: coordinates.lat - 0.01,
        east: coordinates.lng + 0.01,
        west: coordinates.lng - 0.01
      }
    });
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={handleSetOverlay}>Set Overlay</button>
    </div>
  );
}

export default UploadImage;