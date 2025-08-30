import React, { useCallback, useMemo, useState, useEffect } from "react";
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

// Memoized Section component to prevent unnecessary re-renders
const Section = React.memo<{
  title: string;
  icon: React.ReactNode;
  sectionKey: string;
  isExpanded: boolean;
  onToggle: (section: string) => void;
  children: React.ReactNode;
}>(({ title, icon, sectionKey, isExpanded, onToggle, children }) => (
  <div className="border border-gray-200 rounded-lg mb-4">
    <button
      onClick={() => onToggle(sectionKey)}
      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center space-x-3">
        <span className="text-primary-600">{icon}</span>
        <span className="font-medium text-gray-900">{title}</span>
      </div>
      {isExpanded ? (
        <FaChevronUp className="text-gray-400" />
      ) : (
        <FaChevronDown className="text-gray-400" />
      )}
    </button>
    {isExpanded && (
      <div className="px-4 pb-4 border-t border-gray-100">{children}</div>
    )}
  </div>
));

Section.displayName = "Section";

const FlightFilters: React.FC<FlightFiltersProps> = React.memo(
  ({ filters, onFiltersChange, availableAirlines }) => {
    const [expandedSections, setExpandedSections] = useState({
      airline: true,
      time_frame: false,
      date_range: false,
      arrival_country: false,
    });
    const [tempAirline, setTempAirline] = useState(filters.airline || "");

    useEffect(() => {
      setTempAirline(filters.airline || "");
    }, [filters.airline]);

    // Memoized callbacks to prevent unnecessary re-renders
    const toggleSection = useCallback(
      (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({
          ...prev,
          [section]: !prev[section],
        }));
      },
      []
    );

    const update = useCallback(
      (updates: Partial<IFlightFilters>) => {
        onFiltersChange({ ...filters, ...updates });
      },
      [filters, onFiltersChange]
    );

    const clearAll = useCallback(() => {
      onFiltersChange({
        ...filters,
        old_flights: false,
        later_flight: false,
        airline: "",
        from_date: "",
        to_date: "",
        arrival_country: "",
      });
    }, [filters, onFiltersChange]);

    // Memoized computed value
    const hasActiveFilters = useMemo(() => {
      return (
        filters.old_flights ||
        filters.later_flight ||
        (filters.airline && filters.airline !== "") ||
        (filters.from_date && filters.to_date) ||
        (filters.arrival_country && filters.arrival_country !== "")
      );
    }, [
      filters.old_flights,
      filters.later_flight,
      filters.airline,
      filters.from_date,
      filters.to_date,
      filters.arrival_country,
    ]);

    // Optimized event handlers for airline input
    const handleAirlineChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempAirline(e.target.value);
      },
      []
    );

    const handleAirlineBlur = useCallback(() => {
      update({ airline: tempAirline });
    }, [tempAirline, update]);

    // Optimized toggle function with proper typing
    const handleToggleSection = useCallback(
      (sectionKey: string) => {
        toggleSection(sectionKey as keyof typeof expandedSections);
      },
      [toggleSection]
    );

    // Memoized event handlers for radio buttons and other inputs
    const handleAllFlightsChange = useCallback(() => {
      update({ old_flights: false, later_flight: false });
    }, [update]);

    const handleOldFlightsChange = useCallback(() => {
      update({ old_flights: true, later_flight: false });
    }, [update]);

    const handleLaterFlightsChange = useCallback(() => {
      update({ old_flights: false, later_flight: true });
    }, [update]);

    const handleFromDateChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        update({ from_date: e.target.value });
      },
      [update]
    );

    const handleToDateChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        update({ to_date: e.target.value });
      },
      [update]
    );

    const handleArrivalCountryChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        update({ arrival_country: e.target.value });
      },
      [update]
    );

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Flight Filters
            </h3>
            {hasActiveFilters && (
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
          <Section
            title="Time Frame"
            icon={<FaClock />}
            sectionKey="time_frame"
            isExpanded={expandedSections.time_frame}
            onToggle={handleToggleSection}
          >
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="time_frame"
                  checked={!filters.old_flights && !filters.later_flight}
                  onChange={handleAllFlightsChange}
                  className="mr-3 text-primary-600"
                />
                <span className="text-sm">All Flights</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="time_frame"
                  checked={filters.old_flights}
                  onChange={handleOldFlightsChange}
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
                  onChange={handleLaterFlightsChange}
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
          <Section
            title="Airline"
            icon={<FaPlane />}
            sectionKey="airline"
            isExpanded={expandedSections.airline}
            onToggle={handleToggleSection}
          >
            <div className="space-y-2">
              <input
                type="text"
                value={tempAirline}
                placeholder="Search airline (e.g., Turkish Airlines)"
                onChange={handleAirlineChange}
                onBlur={handleAirlineBlur}
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
            isExpanded={expandedSections.date_range}
            onToggle={handleToggleSection}
          >
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.from_date || ""}
                  onChange={handleFromDateChange}
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
                  onChange={handleToDateChange}
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
            isExpanded={expandedSections.arrival_country}
            onToggle={handleToggleSection}
          >
            <div className="space-y-2">
              <input
                type="text"
                value={filters.arrival_country || ""}
                placeholder="e.g. Turkey, France, Germany"
                onChange={handleArrivalCountryChange}
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
  }
);

FlightFilters.displayName = "FlightFilters";

export default FlightFilters;
