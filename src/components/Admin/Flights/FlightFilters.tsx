import React, { useCallback, useEffect, useState } from "react";
import {
  FaFilter,
  FaTimes,
  FaCalendarAlt,
  FaPlane,
  FaClock,
  FaGlobe,
} from "react-icons/fa";
import { AdminFlightFiltersProps } from "../../../types/flight";

const FlightFilters: React.FC<AdminFlightFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  loading,
}) => {
  const [tempAirline, setTempAirline] = useState(filters.airline || "");
  const [tempCountry, setTempCountry] = useState(filters.arrival_country || "");

  useEffect(() => {
    setTempAirline(filters.airline || "");
    setTempCountry(filters.arrival_country || "");
  }, [filters.airline, filters.arrival_country]);

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };
  
  const handleAirlineChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTempAirline(e.target.value);
    },
    []
  );

  const handleAirlineBlur = useCallback(() => {
    handleFilterChange("airline", tempAirline);
  }, [tempAirline, handleFilterChange]);

  const handleCountryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTempCountry(e.target.value);
    },
    []
  );

  const handleCountryBlur = useCallback(() => {
    handleFilterChange("arrival_country", tempCountry);
  }, [tempCountry, handleFilterChange]);

  const hasActiveFilters = Object.values(filters).some((value) => {
    if (typeof value === "boolean") return value;
    return value !== "" && value !== undefined && value !== null;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FaFilter className="text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Flight Filters
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            disabled={loading}
            className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            <FaTimes className="mr-1" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Flight Time Filters */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Flight Time Filters
          </label>

          {/* Old Flights Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="old_flights"
              checked={filters.old_flights || false}
              onChange={(e) => {
                // If checking old_flights, uncheck later_flight
                if (e.target.checked && filters.later_flight) {
                  handleFilterChange("later_flight", false);
                }
                handleFilterChange("old_flights", e.target.checked);
              }}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="old_flights" className="ml-2 text-sm text-gray-700">
              <div className="flex items-center">
                <FaClock className="mr-1 text-gray-400" />
                Show Past Flights (departed)
              </div>
            </label>
          </div>

          {/* Later Flights Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="later_flight"
              checked={filters.later_flight || false}
              onChange={(e) => {
                // If checking later_flight, uncheck old_flights
                if (e.target.checked && filters.old_flights) {
                  handleFilterChange("old_flights", false);
                }
                handleFilterChange("later_flight", e.target.checked);
              }}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="later_flight"
              className="ml-2 text-sm text-gray-700"
            >
              <div className="flex items-center">
                <FaClock className="mr-1 text-gray-400" />
                Show Future Flights (upcoming)
              </div>
            </label>
          </div>
        </div>

        {/* Airline Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Airline
          </label>
          <div className="relative">
            <FaPlane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search airline..."
              value={tempAirline}
              onChange={handleAirlineChange}
              onBlur={handleAirlineBlur}
              // onChange={(e) => handleFilterChange("airline", e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Arrival Country Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Arrival Country
          </label>
          <div className="relative">
            <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search country..."
              value={tempCountry}
              onChange={handleCountryChange}
              onBlur={handleCountryBlur}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* From Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="datetime-local"
              value={filters.from_date || ""}
              max={filters.to_date || undefined}
              onChange={(e) => handleFilterChange("from_date", e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* To Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="datetime-local"
              value={filters.to_date || ""}
              min={filters.from_date || undefined}
              onChange={(e) => handleFilterChange("to_date", e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.old_flights && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Past Flights
              </span>
            )}
            {filters.later_flight && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Future Flights
              </span>
            )}
            {filters.airline && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Airline: {filters.airline}
              </span>
            )}
            {filters.arrival_country && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Country: {filters.arrival_country}
              </span>
            )}
            {filters.from_date && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                From: {new Date(filters.from_date).toLocaleDateString()}
              </span>
            )}
            {filters.to_date && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                To: {new Date(filters.to_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightFilters;
