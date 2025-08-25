// src/components/FilterPanel.tsx
import React from 'react';

interface FilterProps {
  distance: number | 'any';
  vehicle: 'car' | 'bike' | 'any';
  onFilterChange: (filters: { distance: number | 'any'; vehicle: 'car' | 'bike' | 'any' }) => void;
}

export default function FilterPanel({ distance, vehicle, onFilterChange }: FilterProps) {
  return (
    <div className="filter-panel">
      <h3>Filters</h3>

      <label>Distance:</label>
      <select
        value={distance}
        onChange={(e) =>
          onFilterChange({
            distance: e.target.value === 'any' ? 'any' : parseInt(e.target.value),
            vehicle,
          })
        }
      >
        <option value="any">Any</option>
        <option value="2">2 km</option>
        <option value="5">5 km</option>
        <option value="10">10 km</option>
      </select>

      <label>Vehicle Type:</label>
      <select
        value={vehicle}
        onChange={(e) =>
          onFilterChange({
            distance,
            vehicle: e.target.value as 'car' | 'bike' | 'any',
          })
        }
      >
        <option value="any">Any</option>
        <option value="car">Car</option>
        <option value="bike">Bike</option>
      </select>
    </div>
  );
}
