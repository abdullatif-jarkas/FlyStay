import React, { useState, useEffect } from "react";
import {
  FaHotel,
  FaStar,
  FaMapMarkerAlt,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaCalendarCheck,
  FaTimes,
} from "react-icons/fa";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  SuggestedHotel,
  SuggestedHotelsProps,
  SuggestedHotelsState,
  SuggestedHotelsFilters,
  RATING_OPTIONS,
  SORT_OPTIONS,
  SORT_ORDER_OPTIONS,
} from "../../types/suggestedHotels";
import { suggestedHotelsService } from "../../services/suggestedHotelsService";

const SuggestedHotels: React.FC<SuggestedHotelsProps> = ({
  cityId,
  cityName,
  isVisible,
  onClose,
}) => {
  const navigate = useNavigate();
  const [state, setState] = useState<SuggestedHotelsState>({
    hotels: [],
    loading: false,
    error: null,
    pagination: null,
    filters: {},
  });

  const [showFilters, setShowFilters] = useState(false);
  
  console.log("cityId: ", cityId);
  console.log("cityName: ", cityName);
  console.log("isVisible: ", isVisible);
  console.log("onClose: ", onClose);

  // Fetch suggested hotels
  const fetchHotels = async (
    page = 1,
    filters: SuggestedHotelsFilters = {}
  ) => {
    if (!isVisible) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response =
        await suggestedHotelsService.fetchSuggestedHotelsWithCache({
          cityId,
          page,
          per_page: 6, // Show 6 hotels per page for better layout
          filters,
        });
      console.log("suggested: ", response);
      setState((prev) => ({
        ...prev,
        hotels: response.data,
        pagination: response.pagination,
        filters,
        loading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load suggested hotels";
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      toast.error(errorMessage);
    }
  };

  // Load hotels when component becomes visible
  useEffect(() => {
    if (isVisible && cityId) {
      fetchHotels(1, state.filters);
    }
  }, [isVisible, cityId]);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<SuggestedHotelsFilters>) => {
    const updatedFilters = { ...state.filters, ...newFilters };
    fetchHotels(1, updatedFilters);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && state.pagination && page <= state.pagination.total_pages) {
      fetchHotels(page, state.filters);
    }
  };

  // Handle hotel actions
  const handleViewDetails = (hotelId: number) => {
    navigate(`/hotel/${hotelId}`);
  };
  
  // Render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`text-sm ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  // Render hotel card
  const renderHotelCard = (hotel: SuggestedHotel) => (
    <div
      key={hotel.id}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
    >
      {/* Hotel Image */}
      <div className="h-48 bg-gray-200 relative">
        {hotel.image_url ? (
          <img
            src={hotel.image_url}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FaHotel className="text-4xl text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md shadow-sm">
          {renderStarRating(hotel.rating)}
        </div>
      </div>

      {/* Hotel Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 truncate">
          {hotel.name}
        </h3>

        <div className="flex items-center text-gray-600 mb-2">
          <FaMapMarkerAlt className="text-sm mr-1" />
          <span className="text-sm">{hotel.city_name}</span>
        </div>

        <p
          className="text-gray-600 text-sm mb-4 overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {hotel.description}
        </p>

        {hotel.price_per_night && (
          <div className="mb-4">
            <span className="text-lg font-bold text-primary-600">
              ${hotel.price_per_night}
            </span>
            <span className="text-sm text-gray-600 ml-1">per night</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewDetails(hotel.id)}
            className="flex-1 px-3 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 transition-colors flex items-center justify-center"
          >
            <FaEye className="mr-1" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  if (!isVisible) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FaHotel className="text-2xl text-primary-600 mr-3" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Recommended Hotels in {cityName}
            </h2>
            <p className="text-gray-600 text-sm">
              Complete your trip with a comfortable stay
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
            aria-label="Close suggested hotels"
          >
            <FaTimes className="text-xl" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium mb-3"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <select
                value={state.filters.rating || ""}
                onChange={(e) =>
                  handleFilterChange({
                    rating: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Ratings</option>
                {RATING_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={state.filters.sort_by || "rating"}
                onChange={(e) =>
                  handleFilterChange({
                    sort_by: e.target.value as "rating" | "price" | "name",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <select
                value={state.filters.sort_order || "desc"}
                onChange={(e) =>
                  handleFilterChange({
                    sort_order: e.target.value as "asc" | "desc",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {SORT_ORDER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {state.loading ? (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="animate-spin text-2xl text-primary-600 mr-3" />
          <span className="text-gray-600">Loading recommended hotels...</span>
        </div>
      ) : state.error ? (
        <div className="text-center py-12">
          <div className="text-red-600 mb-2">{state.error}</div>
          <button
            onClick={() => fetchHotels(1, state.filters)}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Try Again
          </button>
        </div>
      ) : state.hotels.length === 0 ? (
        <div className="text-center py-12">
          <FaHotel className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hotels found
          </h3>
          <p className="text-gray-600">
            No hotels are available in {cityName} at the moment.
          </p>
        </div>
      ) : (
        <>
          {/* Hotels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {state.hotels.map(renderHotelCard)}
          </div>

          {/* Pagination */}
          {state.pagination && state.pagination.total_pages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() =>
                  handlePageChange(state.pagination!.current_page - 1)
                }
                disabled={state.pagination.current_page === 1}
                className="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaChevronLeft />
              </button>

              <span className="px-4 py-2 text-sm text-gray-600">
                Page {state.pagination.current_page} of{" "}
                {state.pagination.total_pages}
              </span>

              <button
                onClick={() =>
                  handlePageChange(state.pagination!.current_page + 1)
                }
                disabled={
                  state.pagination.current_page === state.pagination.total_pages
                }
                className="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SuggestedHotels;
