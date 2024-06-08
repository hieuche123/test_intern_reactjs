import React, { useState } from 'react';
import axios from 'axios';

const GoogleMapOverlay = () => {
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);

  const apiKey = 'AIzaSyA3bsDl1xddiU_w38hA-fsGea8kWsp5uJM'; // Thay thế bằng API key của bạn

  const getCoordinates = async () => {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: address,
          key: apiKey
        }
      });

      if (response.data.status === 'OK') {
        const location = response.data.results[0].geometry.location;
        setLatitude(location.lat);
        setLongitude(location.lng);
        setError(null);
      } else {
        setError('Không thể tìm thấy tọa độ cho địa chỉ này.');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tìm kiếm tọa độ.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getCoordinates();
  };

  return (
    <div>
      <h1>Geocode Address</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Nhập địa chỉ"
        />
        <button type="submit">Tìm tọa độ</button>
      </form>
      {latitude && longitude && (
        <div>
          <h2>Kết quả:</h2>
          <p>Latitude: {latitude}</p>
          <p>Longitude: {longitude}</p>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default GoogleMapOverlay;
