import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';

interface UserLocation {
  lat: number;
  lng: number;
  label: string;
  name?: string;
  email?: string;
  phone?: string;
  vehicleType?: string;
}

interface MapProps {
  apiKey: string;
  center: { lat: number; lng: number };
  userLocation?: { lat: number; lng: number };
  otherUsersLocations?: UserLocation[];
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

export default function Map({
  apiKey,
  center,
  userLocation,
  otherUsersLocations = [],
}: MapProps) {
  const [selectedMarker, setSelectedMarker] = useState<UserLocation | null>(null);

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={12}>
        {/* User Marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            label="You"
            icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
          />
        )}

        {/* Other Users' Markers */}
        {otherUsersLocations.map((user, index) => (
          <Marker
            key={index}
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
              <p><strong>Lat:</strong> {selectedMarker.lat}</p>
              <p><strong>Lng:</strong> {selectedMarker.lng}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}
