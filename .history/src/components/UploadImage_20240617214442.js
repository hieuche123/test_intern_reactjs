// src/components/UploadImage.js
import React, { useState } from 'react';

const UploadImage = ({ setImageOverlay }) => {
  const [image, setImage] = useState(null);
  const [topLeft, setTopLeft] = useState({ lat: '', lng: '' });
  const [bottomRight, setBottomRight] = useState({ lat: '', lng: '' });

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
        north: parseFloat(topLeft.lat),
        south: parseFloat(bottomRight.lat),
        east: parseFloat(bottomRight.lng),
        west: parseFloat(topLeft.lng)
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
          onChange={(e) => setTopLeft({ ...topLeft, lat: e.target.value })}
        />
        <label>Longitude: </label>
        <input
          type="number"
          value={topLeft.lng}
          onChange={(e) => setTopLeft({ ...topLeft, lng: e.target.value })}
        />
      </div>
      <div>
        <label>Bottom Right Latitude: </label>
        <input
          type="number"
          value={bottomRight.lat}
          onChange={(e) => setBottomRight({ ...bottomRight, lat: e.target.value })}
        />
        <label>Longitude: </label>
        <input
          type="number"
          value={bottomRight.lng}
          onChange={(e) => setBottomRight({ ...bottomRight, lng: e.target.value })}
        />
      </div>
      <button onClick={handleSetOverlay}>Set Overlay</button>
    </div>
  );
}

export default UploadImage;












// import React, { useState } from 'react';

// const App = () => {
//   const [pdfUrl, setPdfUrl] = useState('');
//   const [pdfScale, setPdfScale] = useState(1);
//   const [pdfOpacity, setPdfOpacity] = useState(1);
//   const [pdfPosition, setPdfPosition] = useState({ x: 0, y: 0 });
//   import { MapContainer, TileLayer,Rectangle, useMapEvent } from 'react-leaflet';

//   const handlePdfChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPdfUrl(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleMapZoom = () => {
//     // Handle map zoom event if needed
//   };

//   const handlePdfScaleChange = (event) => {
//     const newScale = parseFloat(event.target.value);
//     setPdfScale(newScale);
//     // Adjust PDF size based on newScale
//   };

//   const handlePdfOpacityChange = (event) => {
//     const newOpacity = parseFloat(event.target.value);
//     setPdfOpacity(newOpacity);
//     // Adjust PDF opacity based on newOpacity
//   };

//   return (
//     <div className="App">
//       <input type="file" onChange={handlePdfChange} accept="application/pdf" />
//       <div style={{ position: 'relative', width: '100%', height: '600px' }}>
//         <div
//           style={{
//             position: 'absolute',
//             left: '50px',
//             top: '50px',
//             zIndex: '1',
//             opacity: pdfOpacity,
//             transform: `scale(${pdfScale})`,
//           }}
//         >
//           {pdfUrl && <embed src={pdfUrl} type="application/pdf" width="600" height="400" />}
//         </div>
//         <div
//           id="map"
//           style={{
//             position: 'absolute',
//             width: 'calc(100% - 100px)',
//             height: '100%',
//             left: 'calc(50px + 600px + 20px)',
//             top: '50px',
//           }}
//         >
//           {/* Google Map goes here */}

      // <MapContainer
      //   center={[pdfPosition.lat, pdfPosition.lng]}
      //   zoom={13}
      //   style={{ height: '400px', width: '100%' }}
      //   onMoveend={handleMapMove}
      //   onZoomend={handleZoomEnd}
      // >
      //   <MapMoveEvents />
      //   <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      //   {pdfBounds && (
      //     <Rectangle bounds={pdfBounds} color="blue" fillOpacity={opacity} />
      //   )}
      // </MapContainer>
//         </div>
//       </div>
//       <div>
//         <input
//           type="range"
//           min="0"
//           max="1"
//           step="0.1"
//           value={pdfOpacity}
//           onChange={handlePdfOpacityChange}
//         />
//         <input
//           type="range"
//           min="0.5"
//           max="2"
//           step="0.1"
//           value={pdfScale}
//           onChange={handlePdfScaleChange}
//         />
//         <p>PDF Size: {pdfScale}</p>
//         <p>PDF Position: {pdfPosition.x}, {pdfPosition.y}</p>
//         <p>PDF Coordinates: ...</p>
//         <p>PDF Bounds: ...</p>
//       </div>
//     </div>
//   );
// };

// export default App;



















// import React, { useState } from 'react';
// import { MapContainer, TileLayer,Rectangle, useMapEvent } from 'react-leaflet';
// import { Document, Page, pdfjs } from 'react-pdf';
// import 'leaflet/dist/leaflet.css';
// import './Map.css';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// const Map = () => {
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [opacity, setOpacity] = useState(1.0);
//   const [scale, setScale] = useState(1.0);
//   const [pdfPosition, setPdfPosition] = useState({ lat: 51.505, lng: -0.09 });
//   const [pdfBounds, setPdfBounds] = useState(null);

//   const handleDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   const handleMapMove = (event) => {
//     const newCenter = event.target.getCenter();
//     setPdfPosition({
//       lat: newCenter.lat,
//       lng: newCenter.lng,
//     });
//   };

//   const handleZoomEnd = (event) => {
//     // Optionally handle zoom end event
//   };

//   const MapMoveEvents = () => {
//     const map = useMapEvent('move', () => {
//       const newCenter = map.getCenter();
//       setPdfPosition({
//         lat: newCenter.lat,
//         lng: newCenter.lng,
//       });
//     });

//     return null;
//   };

//   return (
//     <div className="App">
//       <input type="file" onChange={(e) => console.log(e.target.files[0])} />
//       <div>
//         <input
//           type="range"
//           min="0"
//           max="1"
//           step="0.1"
//           value={opacity}
//           onChange={(e) => setOpacity(parseFloat(e.target.value))}
//         />
//         Opacity: {opacity}
//       </div>
//       <div>
//         <input
//           type="range"
//           min="0.1"
//           max="3"
//           step="0.1"
//           value={scale}
//           onChange={(e) => setScale(parseFloat(e.target.value))}
//         />
//         Scale: {scale}
//       </div>
//       <div>
//         <Document
//           file="somefile.pdf"
//           onLoadSuccess={handleDocumentLoadSuccess}
//         >
//           <Page
//             pageNumber={pageNumber}
//             scale={scale}
//             onLoadSuccess={({ width, height }) => {
//               const bounds = [[pdfPosition.lat - height / 2, pdfPosition.lng - width / 2], [pdfPosition.lat + height / 2, pdfPosition.lng + width / 2]];
//               setPdfBounds(bounds);
//             }}
//           />
//         </Document>
//       </div>
//       <MapContainer
//         center={[pdfPosition.lat, pdfPosition.lng]}
//         zoom={13}
//         style={{ height: '400px', width: '100%' }}
//         onMoveend={handleMapMove}
//         onZoomend={handleZoomEnd}
//       >
//         <MapMoveEvents />
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//         {pdfBounds && (
//           <Rectangle bounds={pdfBounds} color="blue" fillOpacity={opacity} />
//         )}
//       </MapContainer>
//     </div>
//   );
// };

// export default Map;
