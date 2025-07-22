import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import FlightSearchBar from "../../components/Search/FlightSearchBar";
import FlightFilters from "../../components/Flight/FlightFilters";
import FlightResults from "../../components/Flight/FlightResults";
import {
  FlightSearchParams,
  FlightFilters as IFlightFilters,
  Flight as IFlight,
  FlightSortOption,
  Airline,
  FlightSearchResponse,
} from "../../types/flight";

const Flight = () => {
  const [searchParams, setSearchParams] = useState<FlightSearchParams | null>(
    null
  );
  const [flights, setFlights] = useState<IFlight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [sortBy, setSortBy] = useState<FlightSortOption>("price_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [availableAirlines, setAvailableAirlines] = useState<Airline[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [durationRange, setDurationRange] = useState({ min: 60, max: 1440 });
  const [showAllFlights, setShowAllFlights] = useState(true);

  const [filters, setFilters] = useState<IFlightFilters>({
    price_range: { min: 0, max: 2000 },
    airlines: [],
    departure_time_range: { start: "00:00", end: "23:59" },
    arrival_time_range: { start: "00:00", end: "23:59" },
    duration_range: { min: 60, max: 1440 },
    stops: [],
    aircraft_types: [],
    departure_airports: [],
    arrival_airports: [],
  });

  const searchFlights = useCallback(
    async (params: FlightSearchParams, page = 1) => {
      setLoading(true);
      setError("");

      try {
        const searchData = {
          origin: params.origin,
          destination: params.destination,
          departure_date: params.departure_date,
          return_date: params.return_date,
          trip_type: params.trip_type,
          adults: params.passengers.adults,
          children: params.passengers.children,
          infants: params.passengers.infants,
          flight_class: params.flight_class,
          sort_by: sortBy,
          page,
          ...filters,
        };

        const response = await axios.post(
          "http://127.0.0.1:8000/api/flight/search",
          searchData,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.status === "success") {
          const data: FlightSearchResponse = response.data;
          setFlights(data.data);

          if (data.pagination) {
            setCurrentPage(data.pagination.current_page);
            setTotalPages(data.pagination.total_pages);
            setTotalResults(data.pagination.total_results);
          }

          if (data.filters) {
            setAvailableAirlines(data.filters.available_airlines);
            setPriceRange(data.filters.price_range);
            setDurationRange(data.filters.duration_range);
          }
        } else {
          setError("Failed to search flights");
          setFlights([]);
        }
      } catch (err: any) {
        console.error("Flight search error:", err);
        setError(
          err.response?.data?.message ||
            "Failed to search flights. Please try again."
        );
        setFlights([]);
      } finally {
        setLoading(false);
      }
    },
    [sortBy, filters]
  );

  const fetchAllFlights = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://127.0.0.1:8000/api/flight?page=${page}&sort_by=${sortBy}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (response.data.status === "success") {
          const data = response.data;
          setFlights(data.data || []);

          if (data.pagination) {
            setCurrentPage(data.pagination.current_page);
            setTotalPages(data.pagination.total_pages);
            setTotalResults(data.pagination.total_results);
          }

          if (data.filters) {
            setAvailableAirlines(data.filters.available_airlines || []);
            setPriceRange(data.filters.price_range || { min: 0, max: 2000 });
            setDurationRange(
              data.filters.duration_range || { min: 60, max: 1440 }
            );
          }
        } else {
          setError("Failed to fetch flights");
          setFlights([]);
        }
      } catch (err: any) {
        console.error("Fetch flights error:", err);
        setError(
          err.response?.data?.message ||
            "Failed to fetch flights. Please try again."
        );
        setFlights([]);
      } finally {
        setLoading(false);
      }
    },
    [sortBy]
  );

  // Fetch all flights on component mount
  useEffect(() => {
    fetchAllFlights(1);
  }, [fetchAllFlights]);

  const handleSearch = (params: FlightSearchParams) => {
    setShowAllFlights(false);
    setSearchParams(params);
    setCurrentPage(1);
    searchFlights(params, 1);
  };

  const handleSortChange = (newSort: FlightSortOption) => {
    setSortBy(newSort);
    if (searchParams && !showAllFlights) {
      searchFlights(searchParams, currentPage);
    } else if (showAllFlights) {
      fetchAllFlights(currentPage);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (searchParams && !showAllFlights) {
      searchFlights(searchParams, page);
    } else if (showAllFlights) {
      fetchAllFlights(page);
    }
  };

  const handleFiltersChange = (newFilters: IFlightFilters) => {
    setFilters(newFilters);
    if (searchParams && !showAllFlights) {
      setCurrentPage(1);
      searchFlights(searchParams, 1);
    }
  };

  const handleShowAllFlights = () => {
    setShowAllFlights(true);
    setSearchParams(null);
    setCurrentPage(1);
    fetchAllFlights(1);
  };

  const handleFlightSelect = (flight: IFlight) => {
    // Navigate to flight purchase page
    window.location.href = `/flight/purchase/${flight.id}`;
  };

  const handleViewDetails = (flight: IFlight) => {
    // Show flight details modal or navigate to details page
    toast.info(`Viewing details for flight ${flight.flight_number}`);
  };

  const handleAddToFavorites = async (flight: IFlight) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to add flights to favorites");
        return;
      }

      await axios.post(
        `http://127.0.0.1:8000/api/flight/${flight.id}/favorite`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      toast.success("Flight added to favorites!");
    } catch (err: any) {
      console.error("Add to favorites error:", err);
      toast.error(
        err.response?.data?.message || "Failed to add flight to favorites"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar Section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {showAllFlights ? "All Available Flights" : "Search Flights"}
            </h1>
            {!showAllFlights && (
              <button
                onClick={handleShowAllFlights}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-400 cursor-pointer transition-colors"
              >
                View All Flights
              </button>
            )}
          </div>
          <FlightSearchBar onSearch={handleSearch} loading={loading} />
        </div>
      </div>

      {/* Results Section */}
      {(searchParams || showAllFlights) && (
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Filters Sidebar - Only show for search results */}
            {!showAllFlights && (
              <div className="w-80 flex-shrink-0">
                <FlightFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  availableAirlines={availableAirlines}
                  priceRange={priceRange}
                  durationRange={durationRange}
                />
              </div>
            )}

            {/* Results */}
            <div className={showAllFlights ? "w-full" : "flex-1"}>
              {showAllFlights && totalResults > 0 && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800">
                    Showing all available flights ({totalResults} flights found)
                  </p>
                </div>
              )}
              <FlightResults
                flights={flights}
                loading={loading}
                error={error}
                sortBy={sortBy}
                onSortChange={handleSortChange}
                onFlightSelect={handleFlightSelect}
                onViewDetails={handleViewDetails}
                onAddToFavorites={handleAddToFavorites}
                pagination={{
                  current_page: currentPage,
                  total_pages: totalPages,
                  total_results: totalResults,
                  onPageChange: handlePageChange,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Welcome Section - Show when no search and no flights loaded yet */}
      {!searchParams && !showAllFlights && flights.length === 0 && !loading && (
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <svg
                  className="mx-auto h-24 w-24 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Find Your Perfect Flight
              </h2>
              <p className="text-gray-600 mb-8">
                Search for flights to your destination or browse all available
                flights.
              </p>
              <button
                onClick={handleShowAllFlights}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Browse All Flights
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flight;
