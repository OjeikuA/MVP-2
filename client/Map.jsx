import React, { useEffect } from 'react';
import { APIProvider, Map as GoogleMap, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import LocationPin from './LocationPin.jsx';

const MapController = ({ location, zoomLevel }) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.panTo({ lat: location.lat, lng: location.lng });
      map.setZoom(zoomLevel);
    }
  }, [map, location.lat, location.lng, zoomLevel]);

  return (
    <AdvancedMarker position={{ lat: location.lat, lng: location.lng }}>
      <LocationPin text={location.address} />
    </AdvancedMarker>
  );
};

const Map = ({ location, zoomLevel, header = "Find a Locale of Interest" }) => (
  <div className="map">
    <h2 className="map-h2">{header}</h2>
    <div className="google-map">
      <APIProvider apiKey={process.env.GOOGLE_API_KEY}>
        <GoogleMap
          defaultCenter={{ lat: location.lat, lng: location.lng }}
          defaultZoom={zoomLevel}
          mapId="DEMO_MAP_ID"
          style={{ width: '100%', height: '100%' }}
        >
          <MapController location={location} zoomLevel={zoomLevel} />
        </GoogleMap>
      </APIProvider>
    </div>
  </div>
);

export default Map;
