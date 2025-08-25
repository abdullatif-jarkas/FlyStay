import React from "react";
import {
  FaStar,
  FaGlobe,
  FaTimes,
  FaFilter,
  FaTrash,
} from "react-icons/fa";
import { HotelFilters as IHotelFilters } from "../../services/hotelService";

export interface HotelFiltersProps {
  filters: IHotelFilters;
  countries: string[];
  onFilterByRating: (rating: number) => void;
  onFilterByCountry: (country: string) => void;
  onRemoveRatingFilter: () => void;
  onRemoveCountryFilter: () => void;
  onClearFilters: () => void;
  loading?: boolean;
}

const HotelFilters: React.FC<HotelFiltersProps> = ({
  filters,
  countries,
  onFilterByRating,
  onFilterByCountry,
  onRemoveRatingFilter,
  onRemoveCountryFilter,
  onClearFilters,
  loading = false,
}) => {
  const ratings = [1, 2, 3, 4, 5];
  const hasFilters = Object.keys(filters).length > 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: rating }, (_, i) => (
      <FaStar key={i} className="text-yellow-400" />
    ));
  };

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
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {renderStars(rating)}
                  </div>
                  <span className="text-sm font-medium">
                    {rating} Star{rating !== 1 ? 's' : ''}
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

        {/* Country Filter */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
            <FaGlobe className="mr-2 text-primary-500" />
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
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >{console.log("count: ", countries)}
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
          <h4 className="text-sm font-medium text-gray-900 mb-3">Active Filters:</h4>
          <div className="space-y-2">
            {filters.rating && (
              <div className="flex items-center justify-between p-2 bg-primary-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {renderStars(filters.rating)}
                  </div>
                  <span className="text-sm text-primary-700">
                    {filters.rating} Star{filters.rating !== 1 ? 's' : ''}
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
            
            {filters.country && (
              <div className="flex items-center justify-between p-2 bg-primary-50 rounded-lg">
                <span className="text-sm text-primary-700">
                  {filters.country}
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
