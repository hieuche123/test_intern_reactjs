import React from 'react';
import { GoogleMap, LoadScript, GroundOverlay } from '@react-google-maps/api';

  width: '100%',
  height: '100vh'

const center = {
  lat: 21.1807985,
  lng: 105.620778
};

const Map = ({ imageOverlay }) => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyA3bsDl1xddiU_w38hA-fsGea8kWsp5uJM">
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