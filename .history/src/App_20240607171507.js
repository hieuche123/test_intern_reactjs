// src/App.js
import React, { useState } from 'react';
import Map from './components/Map';
import UploadImage from './components/UploadImage';

const App = () => {
  const [imageOverlay, setImageOverlay] = useState(null);

  return (
    <div>
      <UploadImage setImageOverlay={setImageOverlay} />
      <Map imageOverlay={imageOverlay} />
    </div>
  );
}

export default App;
