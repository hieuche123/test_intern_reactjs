import React, { useState } from 'react';

const GeolocationCalculator = () => {
  const [coordinates, setCoordinates] = useState([{ lat: '', lng: '' }]);
  const [result, setResult] = useState(null);

  const handleInputChange = (index, event) => {
    const values = [...coordinates];
    values[index][event.target.name] = event.target.value;
    setCoordinates(values);
  };

  const handleAddCoordinate = () => {
    setCoordinates([...coordinates, { lat: '', lng: '' }]);
  };

  const handleRemoveCoordinate = (index) => {
    const values = [...coordinates];
    values.splice(index, 1);
    setCoordinates(values);
  };

  const handleCalculate = () => {
    const validCoords = coordinates.filter(coord => coord.lat && coord.lng);
    if (validCoords.length === 0) {
      alert('Please enter at least one valid coordinate');
      return;
    }

    const meanCoordinate = calculateMeanCoordinate(validCoords);
    setResult(meanCoordinate);
  };

  const calculateMeanCoordinate = (coords) => {
    let x = 0;
    let y = 0;
    let z = 0;

    coords.forEach(({ lat, lng }) => {
      const latRad = degreesToRadians(parseFloat(lat));
      const lngRad = degreesToRadians(parseFloat(lng));
      x += Math.cos(latRad) * Math.cos(lngRad);
      y += Math.cos(latRad) * Math.sin(lngRad);
      z += Math.sin(latRad);
    });

    const total = coords.length;
    x /= total;
    y /= total;
    z /= total;

    const lngMean = Math.atan2(y, x);
    const hyp = Math.sqrt(x * x + y * y);
    const latMean = Math.atan2(z, hyp);

    return {
      lat: radiansToDegrees(latMean),
      lng: radiansToDegrees(lngMean)
    };
  };

  const degreesToRadians = (degrees) => {
    return degrees * Math.PI / 180;
  };

  const radiansToDegrees = (radians) => {
    return radians * 180 / Math.PI;
  };

  return (
    <div>
      <h1>Geolocation Calculator</h1>
      {coordinates.map((coordinate, index) => (
        <div key={index}>
          <input
            type="text"
            name="lat"
            placeholder="Latitude"
            value={coordinate.lat}
            onChange={event => handleInputChange(index, event)}
          />
          <input
            type="text"
            name="lng"
            placeholder="Longitude"
            value={coordinate.lng}
            onChange={event => handleInputChange(index, event)}
          />
          <button onClick={() => handleRemoveCoordinate(index)}>Remove</button>
        </div>
      ))}
      <button onClick={handleAddCoordinate}>Add Coordinate</button>
      <button onClick={handleCalculate}>Calculate Mean Coordinate</button>
      {result && (
        <div>
          <h2>Mean Coordinate:</h2>
          <p>Latitude: {result.lat}</p>
          <p>Longitude: {result.lng}</p>
        </div>
      )}
    </div>
  );
};

export default GeolocationCalculator;
