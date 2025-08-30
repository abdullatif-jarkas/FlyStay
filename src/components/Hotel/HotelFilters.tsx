import React, { useEffect, useState } from "react";
import {
  FaStar,
  FaGlobe,
  FaTimes,
  FaFilter,
  FaTrash,
  FaSearch,
  FaCity,
} from "react-icons/fa";
import { HotelFilters as IHotelFilters } from "../../services/hotelService";

export interface HotelFiltersProps {
  filters: IHotelFilters;
  countries: string[];
  cities: string[];
  onFilterByName: (name: string) => void;
  onFilterByRating: (rating: number) => void;
  onFilterByCity: (city: string) => void;
  onFilterByCountry: (country: string) => void;
  onRemoveNameFilter: () => void;
  onRemoveRatingFilter: () => void;
  onRemoveCityFilter: () => void;
  onRemoveCountryFilter: () => void;
  onClearFilters: () => void;
  loading?: boolean;
}

const HotelFilters: React.FC<HotelFiltersProps> = ({
  filters,
  countries,
  cities,
  onFilterByName,
  onFilterByRating,
  onFilterByCity,
  onFilterByCountry,
  onRemoveNameFilter,
  onRemoveRatingFilter,
  onRemoveCityFilter,
  onRemoveCountryFilter,
  onClearFilters,
  loading = false,
}) => {
  const ratings = [1, 2, 3, 4, 5];
  const hasFilters = Object.keys(filters).length > 0;
  const [tempName, setTempName] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempName(e.target.value);
  };

  const handleBlur = () => {
    onFilterByName(tempName);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: rating }, (_, i) => (
      <FaStar key={i} className="text-yellow-400" />
    ));
  };
  
  useEffect(() => {
    setTempName(filters.name || "");
  }, [filters.name]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FaFilter className="mr-2 text-primary-500" />
          Filters
        </h3>

        {hasFilters && (
          <button
            onClick={onClearFilters}
            disabled={loading}
            className="text-sm text-red-600 hover:text-red-700 flex items-center disabled:opacity-50"
          >
            <FaTrash className="mr-1" />
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Hotel Name Search */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
            <FaSearch className="mr-2 text-primary-500" />
            Hotel Name
          </h4>

          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search hotels by name..."
              value={tempName}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
            />
            {filters.name && (
              <button
                onClick={onRemoveNameFilter}
                disabled={loading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
            <FaStar className="mr-2 text-yellow-400" />
            Star Rating
          </h4>

          <div className="space-y-2">
            {ratings.map((rating) => (
              <button
                key={rating}
                onClick={() => onFilterByRating(rating)}
                disabled={loading}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors disabled:opacity-50 ${
                  filters.rating === rating
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {renderStars(rating)}
                  </div>
                  <span className="text-sm font-medium">
                    {rating} Star{rating !== 1 ? "s" : ""}
                  </span>
                </div>

                {filters.rating === rating && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveRatingFilter();
                    }}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <FaTimes />
                  </button>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* City Filter */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
            <FaCity className="mr-2 text-blue-500" />
            City
          </h4>
          {cities.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => onFilterByCity(city)}
                  disabled={loading}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors disabled:opacity-50 ${
                    filters.city === city
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-sm font-medium text-left">{city}</span>

                  {filters.city === city && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveCityFilter();
                      }}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <FaTimes />
                    </button>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 p-3 border border-gray-200 rounded-lg">
              No cities available
            </div>
          )}
        </div>

        {/* Country Filter */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
            <FaGlobe className="mr-2 text-green-500" />
            Country
          </h4>

          {countries.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {countries.map((country) => (
                <button
                  key={country}
                  onClick={() => onFilterByCountry(country)}
                  disabled={loading}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors disabled:opacity-50 ${
                    filters.country === country
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-sm font-medium text-left">
                    {country}
                  </span>

                  {filters.country === country && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveCountryFilter();
                      }}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <FaTimes />
                    </button>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 p-3 border border-gray-200 rounded-lg">
              No countries available
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Active Filters:
          </h4>
          <div className="space-y-2">
            {filters.name && (
              <div className="flex items-center justify-between p-2 bg-primary-50 rounded-lg">
                <span className="text-sm text-primary-700">
                  Name: "{filters.name}"
                </span>
                <button
                  onClick={onRemoveNameFilter}
                  className="text-primary-600 hover:text-primary-700"
                >
                  <FaTimes />
                </button>
              </div>
            )}

            {filters.rating && (
              <div className="flex items-center justify-between p-2 bg-primary-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {renderStars(filters.rating)}
                  </div>
                  <span className="text-sm text-primary-700">
                    {filters.rating} Star{filters.rating !== 1 ? "s" : ""}
                  </span>
                </div>
                <button
                  onClick={onRemoveRatingFilter}
                  className="text-primary-600 hover:text-primary-700"
                >
                  <FaTimes />
                </button>
              </div>
            )}

            {filters.city && (
              <div className="flex items-center justify-between p-2 bg-primary-50 rounded-lg">
                <span className="text-sm text-primary-700">
                  City: {filters.city}
                </span>
                <button
                  onClick={onRemoveCityFilter}
                  className="text-primary-600 hover:text-primary-700"
                >
                  <FaTimes />
                </button>
              </div>
            )}

            {filters.country && (
              <div className="flex items-center justify-between p-2 bg-primary-50 rounded-lg">
                <span className="text-sm text-primary-700">
                  Country: {filters.country}
                </span>
                <button
                  onClick={onRemoveCountryFilter}
                  className="text-primary-600 hover:text-primary-700"
                >
                  <FaTimes />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelFilters;
