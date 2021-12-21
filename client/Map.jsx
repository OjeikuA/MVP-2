import React, { Component, useRef, useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import GoogleMapReact from 'google-map-react'
import App from './App.jsx';
import LocationPin from './LocationPin.jsx';
// import { API_KEY } from '../config.js';

const Map = ({ location, zoomLevel, header = "Find a Locale of Interest" }) => (
  <div className="map">
    <h2 className="map-h2">{header}</h2>

    <div className="google-map">
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyA2alD8pmzJrvKCYYu6NaI-hF_o5dPX1O0' }}
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