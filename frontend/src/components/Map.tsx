import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface MapProps {
  apiKey: string;
  center: { lat: number; lng: number };
  userLocation?: { lat: number; lng: number };
  otherUsersLocations?: { lat: number; lng: number; label: string }[];
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

export default function Map({
  apiKey,
  center,
  userLocation,
  otherUsersLocations = [],
}: MapProps) {
  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={12}>
        {userLocation && <Marker position={userLocation} label="You" />}
        {otherUsersLocations.map((loc, index) => (
          <Marker key={index} position={{ lat: loc.lat, lng: loc.lng }} label={loc.label} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
