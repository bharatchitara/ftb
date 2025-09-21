import { useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';

export default function AddressAutocomplete({ value, onChange, onSelect }) {
  const autocompleteRef = useRef(null);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      onSelect({
        address: place.formatted_address,
        latitude: lat,
        longitude: lng,
      });
    }
  };

  return (
    <Autocomplete
      onLoad={ref => (autocompleteRef.current = ref)}
      onPlaceChanged={handlePlaceChanged}
    >
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Enter address"
        className="profile-input"
        
      />
    </Autocomplete>
  );
}