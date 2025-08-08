import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FaHotel, FaFilter, FaSearch } from "react-icons/fa";
import { useHotels } from "../../hooks/useHotels";
import { Hotel as IHotel } from "../../types/hotel";
import HotelFilters from "../../components/Hotel/HotelFilters";
import HotelResults from "../../components/Hotel/HotelResults";

const Hotel = () => {
  const navigate = useNavigate();

  const {
    hotels,
    loading,
    error,
    countries,
    filters,
    filterByRating,
    filterByCountry,
    removeRatingFilter,
    removeCountryFilter,
    clearFilters,
    refreshHotels,
    hasFilters,
    hotelCount,
  } = useHotels();

  // Handle hotel details view
  const handleViewDetails = useCallback((hotel: IHotel) => {
    // Navigate to hotel details page or show modal
    toast.info(`Viewing details for ${hotel.name}`);
    // You can implement navigation to hotel details page here
    navigate(`/hotel/${hotel.id}`);
  }, []);

  // Handle hotel booking
  const handleBookNow = useCallback((hotel: IHotel) => {
    // Navigate to hotel booking page or show booking modal
    toast.info(`Booking ${hotel.name}`);
    // You can implement navigation to hotel booking page here
    navigate(`/hotel/${hotel.id}/book`);
  }, []);

  // Handle add to favorites
  const handleAddToFavorites = useCallback(async (hotel: IHotel) => {
    try {
      // Implement add to favorites API call
      toast.success(`${hotel.name} added to favorites!`);
    } catch (err: any) {
      console.error("Add to favorites error:", err);
      toast.error("Failed to add hotel to favorites");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaHotel className="text-primary-500 text-3xl mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Hotels</h1>
                <p className="text-gray-600 mt-1">
                  Discover and book amazing hotels worldwide
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={refreshHotels}
                disabled={loading}
                className="flex items-center px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50"
              >
                <FaSearch className="mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <FaHotel className="text-primary-500 mr-2" />
                <span className="text-gray-600">
                  {hotelCount} hotel{hotelCount !== 1 ? "s" : ""} available
                </span>
              </div>

              {hasFilters && (
                <div className="flex items-center">
                  <FaFilter className="text-primary-500 mr-2" />
                  <span className="text-gray-600">Filters applied</span>
                </div>
              )}
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                disabled={loading}
                className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <HotelFilters
              filters={filters}
              countries={countries}
              onFilterByRating={filterByRating}
              onFilterByCountry={filterByCountry}
              onRemoveRatingFilter={removeRatingFilter}
              onRemoveCountryFilter={removeCountryFilter}
              onClearFilters={clearFilters}
              loading={loading}
            />
          </div>

          {/* Results */}
          <div className="flex-1">
            <HotelResults
              hotels={hotels}
              loading={loading}
              error={error}
              onViewDetails={handleViewDetails}
              onBookNow={handleBookNow}
              onAddToFavorites={handleAddToFavorites}
              hasFilters={hasFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotel;
