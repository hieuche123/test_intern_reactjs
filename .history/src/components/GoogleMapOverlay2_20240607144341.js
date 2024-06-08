import React from 'react';
import { GoogleMap, LoadScript, GroundOverlay } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const center = {
  lat: 21.028511,
  lng: 105.804817
};

const Map = ({ imageOverlay }) => {
  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
      >
        {imageOverlay && (
          <GroundOverlay
            url={imageOverlay.url}
            bounds={imageOverlay.bounds}
            opacity={0.6}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(Map);