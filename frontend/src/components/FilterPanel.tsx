import React from 'react';
import './FilterPanel.css';

interface FilterProps {
  distance: number | 'any';
  vehicle: 'car' | 'bike' | 'any';
  onFilterChange: (filters: { distance: number | 'any'; vehicle: 'car' | 'bike' | 'any' }) => void;
}

export default function FilterPanel({ distance, vehicle, onFilterChange }: FilterProps) {
  return (
    <div className="filter-panel improved-filter-panel">
      <h3 className="filter-title">Filters</h3>
      <div className="filter-group">
        <label htmlFor="distance-select" className="filter-label">Distance</label>
        <select
          id="distance-select"
          className="filter-select"
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
      </div>
      <div className="filter-group">
        <label htmlFor="vehicle-select" className="filter-label">Vehicle Type</label>
        <select
          id="vehicle-select"
          className="filter-select"
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
    </div>
  );
}