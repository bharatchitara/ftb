import { GoogleMap, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import { useState } from 'react';

interface UserLocation {
  lat: number;
  lng: number;
  label: string;
  name?: string;
  email?: string;
  phone?: string;
  vehicleType?: string;
  address?: string;
}

interface MapProps {
  center: { lat: number; lng: number };
  userLocation?: { lat: number; lng: number };
  otherUsersLocations?: UserLocation[];
  onMapLoad?: () => void;
  radius?: number | null; // in kilometers
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

export default function Map({
  center,
  userLocation,
  otherUsersLocations = [],
  onMapLoad,
  radius,
}: MapProps) {
  const [selectedMarker, setSelectedMarker] = useState<UserLocation | null>(null);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={12}
      onLoad={onMapLoad}
    >
      {/* Show radius circle */}
      {userLocation && radius && (
        <Circle
          key={`${userLocation.lat},${userLocation.lng},${radius}`}
          center={userLocation}
          radius={radius * 1000}
          options={{
            fillColor: '#3182ce33',
            strokeColor: '#3182ce',
            strokeOpacity: 0.7,
            fillOpacity: 0.15,
            strokeWeight: 2,
            clickable: false,
            draggable: false,
            editable: false,
            zIndex: 1,
          }}
        />
      )}

      {/* User Marker */}
      {userLocation && (
        <Marker
          position={userLocation}
          label="You"
          icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
        />
      )}

      {/* Other Users' Markers */}
      {otherUsersLocations.map((user) => (
        <Marker
          key={user.email || user.label}
          position={{ lat: user.lat, lng: user.lng }}
          label={user.label}
          icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' }}
          onClick={() => setSelectedMarker(user)}
        />
      ))}

      {/* InfoWindow with full details */}
      {selectedMarker && (
        <InfoWindow
          position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div style={{ maxWidth: '200px' }}>
            <h4>{selectedMarker.label}</h4>
            {selectedMarker.name && <p><strong>Name:</strong> {selectedMarker.name}</p>}
            {selectedMarker.email && <p><strong>Email:</strong> {selectedMarker.email}</p>}
            {selectedMarker.phone && <p><strong>Phone:</strong> {selectedMarker.phone}</p>}
            {selectedMarker.vehicleType && <p><strong>Vehicle:</strong> {selectedMarker.vehicleType}</p>}
            {selectedMarker.address && <p><strong>Address:</strong> {selectedMarker.address}</p>}
            <p><strong>Latitude:</strong> {selectedMarker.lat}</p>
            <p><strong>Longitude:</strong> {selectedMarker.lng}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}