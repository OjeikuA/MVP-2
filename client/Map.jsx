import React, { Component, useRef, useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import GoogleMapReact from 'google-map-react'
import App from './App.jsx';
import LocationPin from './LocationPin.jsx';
import { API_KEY } from '../config.js';

const Map = ({ location, zoomLevel }) => (
  <div className="map">
    <h2 className="map-h2">Here's Your Locale of Interest</h2>

    <div className="google-map">
      <GoogleMapReact
        bootstrapURLKeys={{ key: API_KEY }}
        center={location}
        zoom={zoomLevel}
      >
        <LocationPin
          lat={location.lat}
          lng={location.lng}
          text={location.address}
        />
      </GoogleMapReact>
    </div>
  </div>
)

export default Map;