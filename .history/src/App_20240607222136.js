// src/App.js
import React, { useState } from 'react';
import Map from './components/Map';
import UploadImage from './components/UploadImage';

const App = () => {
  const [imageOverlay, setImageOverlay] = useState(null);

  return (
    <div>
      <Map />
    </div>
  );
}

export default App;
