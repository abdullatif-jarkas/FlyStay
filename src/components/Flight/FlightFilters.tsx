import { useState } from 'react';
import { 
  FaChevronDown, 
  FaChevronUp, 
  FaTimes,
  FaClock,
  FaDollarSign,
  FaPlane,
  FaRoute
} from 'react-icons/fa';
import { 
  FlightFiltersProps, 
  FlightFilters as IFlightFilters,
  STOPS_OPTIONS 
} from '../../types/flight';

const FlightFilters: React.FC<FlightFiltersProps> = ({
  filters,
  onFiltersChange,
  availableAirlines,
  priceRange,
  durationRange
}) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    airlines: true,
    stops: true,
    departure_time: false,
    arrival_time: false,
    duration: false,
    aircraft: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilters = (updates: Partial<IFlightFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      price_range: { min: priceRange.min, max: priceRange.max },
      airlines: [],
      departure_time_range: { start: '00:00', end: '23:59' },
      arrival_time_range: { start: '00:00', end: '23:59' },
      duration_range: { min: durationRange.min, max: durationRange.max },
      stops: [],
      aircraft_types: [],
      departure_airports: [],
      arrival_airports: []
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.airlines.length > 0 ||
      filters.stops.length > 0 ||
      filters.aircraft_types.length > 0 ||
      filters.price_range.min !== priceRange.min ||
      filters.price_range.max !== priceRange.max ||
      filters.duration_range.min !== durationRange.min ||
      filters.duration_range.max !== durationRange.max ||
      filters.departure_time_range.start !== '00:00' ||
      filters.departure_time_range.end !== '23:59' ||
      filters.arrival_time_range.start !== '00:00' ||
      filters.arrival_time_range.end !== '23:59'
    );
  };

  const FilterSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    sectionKey: keyof typeof expandedSections;
    children: React.ReactNode;
  }> = ({ title, icon, sectionKey, children }) => (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
      >
        <div className="flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </div>
        {expandedSections[sectionKey] ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      {expandedSections[sectionKey] && children}
    </div>
  );

  return (
    <div className="w-full max-w-sm bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters() && (
          <button
            onClick={clearAllFilters}
            className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center"
          >
            <FaTimes className="mr-1" />
            Clear All
          </button>
        )}
      </div>

      {/* Price Range */}
      <FilterSection
        title="Price Range"
        icon={<FaDollarSign className="text-green-500" />}
        sectionKey="price"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>${filters.price_range.min}</span>
            <span>${filters.price_range.max}</span>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={filters.price_range.min}
              onChange={(e) => updateFilters({
                price_range: { ...filters.price_range, min: parseInt(e.target.value) }
              })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={filters.price_range.max}
              onChange={(e) => updateFilters({
                price_range: { ...filters.price_range, max: parseInt(e.target.value) }
              })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.price_range.min}
              onChange={(e) => updateFilters({
                price_range: { ...filters.price_range, min: parseInt(e.target.value) || 0 }
              })}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.price_range.max}
              onChange={(e) => updateFilters({
                price_range: { ...filters.price_range, max: parseInt(e.target.value) || 0 }
              })}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      </FilterSection>

      {/* Airlines */}
      <FilterSection
        title="Airlines"
        icon={<FaPlane className="text-blue-500" />}
        sectionKey="airlines"
      >
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {availableAirlines.map((airline) => (
            <label key={airline.id} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.airlines.includes(airline.name)}
                onChange={(e) => {
                  const newAirlines = e.target.checked
                    ? [...filters.airlines, airline.name]
                    : filters.airlines.filter(a => a !== airline.name);
                  updateFilters({ airlines: newAirlines });
                }}
                className="mr-3 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{airline.name}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Stops */}
      <FilterSection
        title="Stops"
        icon={<FaRoute className="text-orange-500" />}
        sectionKey="stops"
      >
        <div className="space-y-2">
          {STOPS_OPTIONS.map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.stops.includes(option.value)}
                onChange={(e) => {
                  const newStops = e.target.checked
                    ? [...filters.stops, option.value]
                    : filters.stops.filter(s => s !== option.value);
                  updateFilters({ stops: newStops });
                }}
                className="mr-3 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Departure Time */}
      <FilterSection
        title="Departure Time"
        icon={<FaClock className="text-purple-500" />}
        sectionKey="departure_time"
      >
        <div className="space-y-3">
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">From</label>
              <input
                type="time"
                value={filters.departure_time_range.start}
                onChange={(e) => updateFilters({
                  departure_time_range: { ...filters.departure_time_range, start: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">To</label>
              <input
                type="time"
                value={filters.departure_time_range.end}
                onChange={(e) => updateFilters({
                  departure_time_range: { ...filters.departure_time_range, end: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Arrival Time */}
      <FilterSection
        title="Arrival Time"
        icon={<FaClock className="text-indigo-500" />}
        sectionKey="arrival_time"
      >
        <div className="space-y-3">
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">From</label>
              <input
                type="time"
                value={filters.arrival_time_range.start}
                onChange={(e) => updateFilters({
                  arrival_time_range: { ...filters.arrival_time_range, start: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">To</label>
              <input
                type="time"
                value={filters.arrival_time_range.end}
                onChange={(e) => updateFilters({
                  arrival_time_range: { ...filters.arrival_time_range, end: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Duration */}
      <FilterSection
        title="Flight Duration"
        icon={<FaClock className="text-red-500" />}
        sectionKey="duration"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{Math.floor(filters.duration_range.min / 60)}h {filters.duration_range.min % 60}m</span>
            <span>{Math.floor(filters.duration_range.max / 60)}h {filters.duration_range.max % 60}m</span>
          </div>
          <input
            type="range"
            min={durationRange.min}
            max={durationRange.max}
            value={filters.duration_range.min}
            onChange={(e) => updateFilters({
              duration_range: { ...filters.duration_range, min: parseInt(e.target.value) }
            })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="range"
            min={durationRange.min}
            max={durationRange.max}
            value={filters.duration_range.max}
            onChange={(e) => updateFilters({
              duration_range: { ...filters.duration_range, max: parseInt(e.target.value) }
            })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </FilterSection>
    </div>
  );
};

export default FlightFilters;
