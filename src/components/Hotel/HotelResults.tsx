import React from "react";
import {
  FaSpinner,
  FaExclamationTriangle,
  FaHotel,
  FaSearch,
} from "react-icons/fa";
import { Hotel } from "../../types/hotel";
import HotelCard from "./HotelCard";

export interface HotelResultsProps {
  hotels: Hotel[];
  loading: boolean;
  error?: string;
  onViewDetails: (hotel: Hotel) => void;
  onAddToFavorites?: (hotel: Hotel) => void;
  hasFilters?: boolean;
}

const HotelResults: React.FC<HotelResultsProps> = ({
  hotels,
  loading,
  error,
  onViewDetails,
  onAddToFavorites,
  hasFilters = false,
}) => {
  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <FaSpinner className="text-4xl text-primary-500 animate-spin mb-4" />
        <p className="text-gray-600">Searching for hotels...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <FaExclamationTriangle className="text-4xl text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Search Error
        </h3>
        <p className="text-gray-600 text-center max-w-md">{error}</p>
      </div>
    );
  }

  // No hotels found
  if (hotels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <FaSearch className="text-4xl text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {hasFilters ? "No Hotels Match Your Filters" : "No Hotels Found"}
        </h3>
        <p className="text-gray-600 text-center max-w-md">
          {hasFilters
            ? "Try adjusting your filters to see more results."
            : "We couldn't find any hotels at the moment. Please try again later."}
        </p>
      </div>
    );
  }

  // Results header
  const resultsHeader = (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <FaHotel className="text-primary-500 mr-3 text-xl" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {hasFilters ? "Filtered Results" : "All Hotels"}
          </h2>
          <p className="text-gray-600">
            {hotels.length} hotel{hotels.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {resultsHeader}

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hotels.map((hotel) => (
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            onViewDetails={onViewDetails}
            onAddToFavorites={onAddToFavorites}
            isFavorite={false} // You can implement favorite logic here
          />
        ))}
      </div>

      {/* Results footer */}
      {hotels.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Showing {hotels.length} hotel{hotels.length !== 1 ? "s" : ""}
              {hasFilters && " matching your filters"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelResults;
