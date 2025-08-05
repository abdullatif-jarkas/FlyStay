import { useState } from 'react';
import {
  FaChevronDown,
  FaChevronUp,
  FaTimes,
  FaClock,
  FaPlane,
  FaCalendarAlt
} from 'react-icons/fa';
import {
  FlightFiltersProps,
  FlightFilters as IFlightFilters
} from '../../types/flight';

const FlightFilters: React.FC<FlightFiltersProps> = ({
  filters,
  onFiltersChange,
  availableAirlines
}) => {
  const [expandedSections, setExpandedSections] = useState({
    airline: true,
    time_frame: false,
    date_range: false,
    arrival_country: false
  });

  const toggleSection = (section: keyof typeof expandedSections) =>
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));

  const update = (updates: Partial<IFlightFilters>) =>
    onFiltersChange({ ...filters, ...updates });

  const clearAll = () =>
    onFiltersChange({
      old_flights: false,
      later_flight: false,
      airline: '',
      from_date: '',
      to_date: '',
      arrival_country: ''
    });

  const hasFilters = () =>
    filters.old_flights ||
    filters.later_flight ||
    filters.airline !== '' ||
    (filters.from_date !== '' && filters.to_date !== '') ||
    filters.arrival_country !== '';

  const Section = ({
    title,
    icon,
    sectionKey,
    children
  }: {
    title: string;
    icon: React.ReactNode;
    sectionKey: keyof typeof expandedSections;
    children: React.ReactNode;
  }) => (
    <div className="border-b pb-3 mb-3">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex justify-between w-full mb-2"
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
    <div className="p-4 bg-white border rounded max-w-sm">
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold">Filters</h3>
        {hasFilters() && (
          <button onClick={clearAll} className="text-red-500 flex flex-row-reverse items-center gap-0.5 cursor-pointer">
            <FaTimes /> Clear All
          </button>
        )}
      </div>

      {/* Time frame: Old or Upcoming */}
      <Section title="Time Frame" icon={<FaClock />} sectionKey="time_frame">
        <label className="flex items-center mb-2">
          <input
            type="radio"
            name="time_frame"
            checked={filters.old_flights}
            onChange={() => update({ old_flights: true, later_flight: false })}
            className="mr-2"
          />
          Old Flights
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="time_frame"
            checked={filters.later_flight}
            onChange={() => update({ later_flight: true, old_flights: false })}
            className="mr-2"
          />
          Upcoming Flights
        </label>
      </Section>

      {/* Airline Filter */}
      <Section title="Airline" icon={<FaPlane />} sectionKey="airline">
        <input
          type="text"
          value={filters.airline}
          placeholder="Search airline"
          onChange={e => update({ airline: e.target.value })}
          className="w-full border px-2 py-1 rounded"
        />
      </Section>

      {/* Date Range */}
      <Section
        title="Departure Date Range"
        icon={<FaCalendarAlt />}
        sectionKey="date_range"
      >
        <div className="flex space-x-2">
          <input
            type="date"
            value={filters.from_date}
            onChange={e => update({ from_date: e.target.value })}
            className="w-1/2 border px-2 py-1 rounded"
          />
          <input
            type="date"
            value={filters.to_date}
            onChange={e => update({ to_date: e.target.value })}
            className="w-1/2 border px-2 py-1 rounded"
          />
        </div>
      </Section>

      {/* Arrival Country */}
      <Section
        title="Arrival Country"
        icon={<FaPlane />}
        sectionKey="arrival_country"
      >
        <input
          type="text"
          value={filters.arrival_country}
          placeholder="e.g. Turkey"
          onChange={e => update({ arrival_country: e.target.value })}
          className="w-full border px-2 py-1 rounded"
        />
      </Section>

    </div>
  );
};

export default FlightFilters;
