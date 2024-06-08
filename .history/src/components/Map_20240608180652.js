import React, { useState } from "react"
import { createRoot } from "react-dom/client"
import {
  GoogleMap,
  LoadScript,
  GroundOverlay,
  Marker
} from "@react-google-maps/api"
import { Pin } from "@vis.gl/react-google-maps"

const mapContainerStyle = {
  height: "100vh",
  width: "100%"
}

const center = {
  lat: 21.1324,
  lng: 105.8272048137921
}

// Kích thước hình ảnh
const widthImage = 1031 // in pixels
const heightImage = 729 // in pixels
const mapScale = 29 // tỷ lệ của ảnh bản đồ (1:25000)

// Chuyển đổi kích thước ảnh sang đơn vị thực tế (mét)
const widthInMeters = widthImage * mapScale
const heightInMeters = heightImage * mapScale

// Chuyển đổi đơn vị thực tế sang độ (latitude, longitude)
// 1 độ latitude = 111 km
const metersPerDegreeLatitude = 111000
// 1 độ longitude = 111 km * cos(latitude) (do Trái Đất hình cầu)
const metersPerDegreeLongitude = 111000 * Math.cos(center.lat * (Math.PI / 180))

// Tính tỷ lệ chuyển đổi từ mét sang độ
const ratioLat = 1 / metersPerDegreeLatitude
const ratioLng = 1 / metersPerDegreeLongitude

// Tính toán lại `imageBounds`
// Chúng ta cần điều chỉnh tỷ lệ khung hình của ảnh để phù hợp với tỷ lệ khung hình của Google Maps tại mức zoom ban đầu
const imageBounds = {
  north: center.lat + (heightInMeters * ratioLat / 2),
  south: center.lat - (heightInMeters * ratioLat / 2),
  east: center.lng + (widthInMeters * ratioLng / 2),
  west: center.lng - (widthInMeters * ratioLng / 2)
}

console.log("Image Bounds:", imageBounds)

const locations = [
  { key: "operaHouse", location: { lat: -33.8567844, lng: 151.213108 } },
  { key: "tarongaZoo", location: { lat: -33.8472767, lng: 151.2188164 } },
  { key: "manlyBeach", location: { lat: -33.8209738, lng: 151.2563253 } },
  { key: "hyderPark", location: { lat: -33.8690081, lng: 151.2052393 } },
  { key: "theRocks", location: { lat: -33.8587568, lng: 151.2058246 } },
  { key: "circularQuay", location: { lat: -33.858761, lng: 151.2055688 } },
  { key: "harbourBridge", location: { lat: -33.852228, lng: 151.2038374 } },
  { key: "kingsCross", location: { lat: -33.8737375, lng: 151.222569 } },
  { key: "botanicGardens", location: { lat: -33.864167, lng: 151.216387 } },
  { key: "museumOfSydney", location: { lat: -33.8636005, lng: 151.2092542 } },
  { key: "maritimeMuseum", location: { lat: -33.869395, lng: 151.198648 } },
  { key: "kingStreetWharf", location: { lat: -33.8665445, lng: 151.1989808 } },
  { key: "aquarium", location: { lat: -33.869627, lng: 151.202146 } },
  { key: "darlingHarbour", location: { lat: -33.87488, lng: 151.1987113 } },
  { key: "barangaroo", location: { lat: -33.8605523, lng: 151.1972205 } }
]

const Map = () => {
  const [opacity, setOpacity] = useState(0.35)
  return (
    <LoadScript googleMapsApiKey={"AIzaSyA3bsDl1xddiU_w38hA-fsGea8kWsp5uJM"}>
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
      <div style={{ position: "absolute", top: 60, right: 10, zIndex: 1000 }}>
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



export default Map