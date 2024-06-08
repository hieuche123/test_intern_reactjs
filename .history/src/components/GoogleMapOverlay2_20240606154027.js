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
    <>
        <div>
          <Map
            ref={(ref) => {
              this.mapRef(ref);
            }}
            google={this.props.google}
            zoom={12}
            style={mapStyles}
            initialCenter={{ lat: 40.74, lng: -74.18 }}
          >
            <Marker position={{ lat: 40.74, lng: -74.18 }} />
          </Map>
        </div>
      </>
  )
}





export default GoogleMapOverlay2;
