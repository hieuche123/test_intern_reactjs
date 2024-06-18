import React, { useState, useEffect } from 'react';
import { PDFViewer } from 'react-pdf';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const MAp = () => {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (map) {
      // Hiển thị bản đồ OpenStreetMap
      const map = L.map('map').setView([0, 0], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      setMap(map);
    }
  }, []);

  useEffect(() => {
    if (file) {
      // Phân tích file PDF
      const pdf = PDF.load(file);
      pdf.getPages().then((pages) => {
        setPages(pages);
      });
    }
  }, [file]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const renderPage = (index) => {
    if (pages[index]) {
      return (
        <PDFViewer
          key={index}
          document={pages[index]}
          scaleMode="pageFit"
          height="100%"
        />
      );
    } else {
      return <div>Trang {index + 1} không có sẵn</div>;
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <div id="map" style={{ height: '400px' }}></div>
      {pages.length > 0 && pages.map(renderPage)}
    </div>
  );
};

export default MAp;