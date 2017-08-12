import { withGoogleMap, GoogleMap, InfoWindow } from 'react-google-maps';
import Marker from './marker';

const SimpleMap = withGoogleMap(props =>
  <GoogleMap
    ref={props.onMapLoad}
    defaultOptions={{
      styles: [
        // Hides all the other businesses on the map
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    }}
    defaultZoom={17}
    defaultCenter={props.center}
    onClick={props.onMapClick}
  > {props.markers.map((marker, index) =>
      <Marker key={marker.key} {...marker} />
    )}
  </GoogleMap>
);

export default ({ onMapLoad, markers, center }) => {
  return (
    <SimpleMap
      containerElement={
        <div
          style={{
            height: '100vh',
            width: '50%',
          }}
        />
      }
      mapElement={<div style={{ height: `100%` }} />}
      onMapLoad={onMapLoad}
      center={center}
      onMapClick={() => {}}
      markers={markers}
      onMarkerRightClick={() => {}}
    />
  );
};
