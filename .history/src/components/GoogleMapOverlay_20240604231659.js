
import anh from "../assets/test.jpg"
import "./GoogleMapOverlay.css"
import React, { useState } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import {REACT_APP_GOOGLE_MAPS_KEY} from '../constants/constants'
import anh from "../assets/test.jpg"

      <div className="scroll" style={{
        position: 'absolute',
        bottom: '90%',
        left: '90%',
        transform: 'translateX(-50%)',
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 2, // thanh kéo nằm trên cả overlay
        display: 'flex',
        alignItems: 'center',
      }}>
        <div className="scroll-item">
            <input
            className="input-scroll1"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            style={{ marginRight: '10px', }}
            />
            <h5 className="input-scroll2">{`Opacity: ${opacity.toFixed(2)}`}</h5>

        </div>
      </div>
    </div>
  );
};

export default GoogleMapOverlay;