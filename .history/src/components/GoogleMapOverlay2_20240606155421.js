import React, { useState } from "react"
const mapStyles = {
  width: '100%',
  height: '100%',
};

const imageBounds = {
  north: 40.773941,
  south: 40.712216,
  east: -74.12544,
  west: -74.22655,
};




const GoogleMapOverlay2 = () => {
  mapRef = (ref) => {
    let historicalOverlay = new google.maps.GroundOverlay(
      'https://storage.googleapis.com/geo-devrel-public-buckets/newark_nj_1922-661x516.jpeg',
      imageBounds
    );
    historicalOverlay.setMap(ref.map);
  };

  return (
    <LoadScript googleMapsApiKey={"AIzaSyBa7UlmsSGVz7NA2HkBdfevTBiwIPP2mdY"}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={center}
        onCenterChanged={() => console.log("Center changed")}
        onZoomChanged={() => console.log("Zoom changed")}
      >
        <GroundOverlay
          url="https://res.cloudinary.com/drwwfkcmg/image/upload/v1717530568/google-map/kgzq4xxfinm1dmv3q5mj.jpg"
          bounds={imageBounds}
          opacity={opacity}
        />
        <PoiMarkers pois={locations} />
      </GoogleMap>
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1000 }}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={opacity}
          onChange={e => setOpacity(parseFloat(e.target.value))}
        />
      </div>
    </LoadScript>
  )
}

const PoiMarkers = props => {
  return (
    <>
      {props.pois.map(poi => (
        <Marker key={poi.key} position={poi.location}>
          <Pin
            background={"#FBBC04"}
            glyphColor={"#000"}
            borderColor={"#000"}
          />
        </Marker>
      ))}
    </>
  )
}



export default GoogleMapOverlay2;
