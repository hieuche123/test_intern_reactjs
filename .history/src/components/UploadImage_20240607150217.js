// src/components/UploadImage.js
import React, { useState } from 'react';

const UploadImage = ({ setImageOverlay }) => {
  const [image, setImage] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: 21.1807985,
    lng: 105.620778 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

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
    const boundsHeight = 0.02;  // Adjust this value to fit your needs
    const boundsWidth = boundsHeight * aspectRatio;

    setImageOverlay({
      url: image,
      bounds: {
        north: coordinates.lat + boundsHeight / 2,
        south: coordinates.lat - boundsHeight / 2,
        east: coordinates.lng + boundsWidth / 2,
        west: coordinates.lng - boundsWidth / 2
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
