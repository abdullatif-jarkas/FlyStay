import { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaTimes,
  FaClock,
  FaPlane,
  FaCalendarAlt,
  FaGlobe,
  FaHistory,
  FaArrowRight,
} from "react-icons/fa";
import {
  FlightFiltersProps,
  FlightFilters as IFlightFilters,
} from "../../types/flight";

const FlightFilters: React.FC<FlightFiltersProps> = ({
  filters,
  onFiltersChange,
  availableAirlines,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    airline: true,
    time_frame: false,
    date_range: false,
    arrival_country: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) =>
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));

  const update = (updates: Partial<IFlightFilters>) =>
    onFiltersChange({ ...filters, ...updates });

  const clearAll = () =>
    onFiltersChange({
      ...filters,
      old_flights: false,
      later_flight: false,
      airline: "",
      from_date: "",
      to_date: "",
      arrival_country: "",
    });

  const hasFilters = () =>
    filters.old_flights ||
    filters.later_flight ||
    (filters.airline && filters.airline !== "") ||
    (filters.from_date && filters.to_date) ||
    (filters.arrival_country && filters.arrival_country !== "");

  const Section = ({
    title,
    icon,
    sectionKey,
    children,
  }: {
    title: string;
    icon: React.ReactNode;
    sectionKey: keyof typeof expandedSections;
    children: React.ReactNode;
  }) => (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex justify-between items-center w-full py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          <span className="text-primary-600 mr-3">{icon}</span>
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        <span className="text-gray-400">
          {expandedSections[sectionKey] ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>
      {expandedSections[sectionKey] && (
        <div className="pb-4 px-1">{children}</div>
      )}
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Flight Filters
          </h3>
          {hasFilters() && (
            <button
              onClick={clearAll}
              className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm font-medium transition-colors"
            >
              <FaTimes className="text-xs" />
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Time frame: Old or Upcoming */}
        <Section title="Time Frame" icon={<FaClock />} sectionKey="time_frame">
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="time_frame"
                checked={!filters.old_flights && !filters.later_flight}
                onChange={() =>
                  update({ old_flights: false, later_flight: false })
                }
                className="mr-3 text-primary-600"
              />
              <span className="text-sm">All Flights</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="time_frame"
                checked={filters.old_flights}
                onChange={() =>
                  update({ old_flights: true, later_flight: false })
                }
                className="mr-3 text-primary-600"
              />
              <div className="flex items-center">
                <FaHistory className="mr-2 text-gray-500" />
                <span className="text-sm">Past Flights</span>
              </div>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="time_frame"
                checked={filters.later_flight}
                onChange={() =>
                  update({ later_flight: true, old_flights: false })
                }
                className="mr-3 text-primary-600"
              />
              <div className="flex items-center">
                <FaArrowRight className="mr-2 text-green-500" />
                <span className="text-sm">Upcoming Flights</span>
              </div>
            </label>
          </div>
        </Section>

        {/* Airline Filter */}
        <Section title="Airline" icon={<FaPlane />} sectionKey="airline">
          <div className="space-y-2">
            <input
              type="text"
              value={filters.airline || ""}
              placeholder="Search airline (e.g., Turkish Airlines)"
              onChange={(e) => update({ airline: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
            <p className="text-xs text-gray-500">
              Enter airline name to filter flights
            </p>
          </div>
        </Section>

        {/* Date Range */}
        <Section
          title="Departure Date Range"
          icon={<FaCalendarAlt />}
          sectionKey="date_range"
        >
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.from_date || ""}
                onChange={(e) => update({ from_date: e.target.value })}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.to_date || ""}
                onChange={(e) => update({ to_date: e.target.value })}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>
            <p className="text-xs text-gray-500">
              Filter flights by departure date range
            </p>
          </div>
        </Section>

        {/* Arrival Country */}
        <Section
          title="Arrival Country"
          icon={<FaGlobe />}
          sectionKey="arrival_country"
        >
          <div className="space-y-2">
            <input
              type="text"
              value={filters.arrival_country || ""}
              placeholder="e.g. Turkey, France, Germany"
              onChange={(e) => update({ arrival_country: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
            <p className="text-xs text-gray-500">
              Filter flights by destination country
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default FlightFilters;
