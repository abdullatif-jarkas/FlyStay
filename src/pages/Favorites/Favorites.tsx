import { useState, useEffect } from "react";
import {
  FaHeart,
  FaHotel,
  FaBed,
  FaPlane,
  FaSpinner,
  FaExclamationTriangle,
  FaInbox,
  FaUsers,
  FaDollarSign,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useFavorites } from "../../contexts/FavoritesContext";
import { Hotel } from "../../types/hotel";
import { Flight } from "../../types/flight";
import HotelCard from "../../components/Hotel/HotelCard";
import FavoriteButton from "../../components/Favorites/FavoriteButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type FilterType = "all" | "hotels" | "rooms" | "flights";

type FavoriteHotel = Hotel;

interface FavoriteRoom {
  id: number;
  hotel_id: number;
  room_type: string;
  price_per_night: string;
  capacity: number;
  description: string;
  hotel?: {
    id: number;
    name: string;
    location: string;
  };
}

type FavoriteFlight = Flight;

const Favorites = () => {
  const navigate = useNavigate();
  const { favorites, isLoading, error } = useFavorites();

  const [filter, setFilter] = useState<FilterType>("all");
  const [favoriteHotels, setFavoriteHotels] = useState<FavoriteHotel[]>([]);
  const [favoriteRooms, setFavoriteRooms] = useState<FavoriteRoom[]>([]);
  const [favoriteFlights, setFavoriteFlights] = useState<FavoriteFlight[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string>("");

  const token = localStorage.getItem("token");

  // Fetch detailed data for favorite hotels, rooms, and flights
  useEffect(() => {
    const fetchFavoriteDetails = async () => {
      if (!token || isLoading) return;

      setDataLoading(true);
      setDataError("");

      try {
        // Fetch hotel details
        const hotelPromises = favorites.hotels.map(async (hotelId) => {
          try {
            const response = await axios.get(
              `http://127.0.0.1:8000/api/hotel/${hotelId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
              }
            );
            return response.data.status === "success"
              ? response.data.data[0]
              : null;
          } catch (error) {
            console.error(`Error fetching hotel ${hotelId}:`, error);
            return null;
          }
        });

        // Fetch room details
        const roomPromises = favorites.rooms.map(async (roomId) => {
          try {
            const response = await axios.get(
              `http://127.0.0.1:8000/api/room/${roomId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
              }
            );
            return response.data.status === "success"
              ? response.data.data
              : null;
          } catch (error) {
            console.error(`Error fetching room ${roomId}:`, error);
            return null;
          }
        });

        // Fetch flight details
        const flightPromises = favorites.flights.map(async (flightId) => {
          try {
            const response = await axios.get(
              `http://127.0.0.1:8000/api/flight/${flightId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
              }
            );
            return response.data.status === "success"
              ? response.data.data
              : null;
          } catch (error) {
            console.error(`Error fetching flight ${flightId}:`, error);
            return null;
          }
        });

        const [hotelResults, roomResults, flightResults] = await Promise.all([
          Promise.all(hotelPromises),
          Promise.all(roomPromises),
          Promise.all(flightPromises),
        ]);

        setFavoriteHotels(hotelResults.filter(Boolean));
        setFavoriteRooms(roomResults.filter(Boolean));
        setFavoriteFlights(flightResults.filter(Boolean));
      } catch (err) {
        console.error("Error fetching favorite details:", err);
        setDataError("Failed to load favorite details");
      } finally {
        setDataLoading(false);
      }
    };

    fetchFavoriteDetails();
  }, [favorites, token, isLoading]);

  // Filter favorites based on selected filter
  const getFilteredItems = () => {
    switch (filter) {
      case "hotels":
        return { hotels: favoriteHotels, rooms: [], flights: [] };
      case "rooms":
        return { hotels: [], rooms: favoriteRooms, flights: [] };
      case "flights":
        return { hotels: [], rooms: [], flights: favoriteFlights };
      default:
        return {
          hotels: favoriteHotels,
          rooms: favoriteRooms,
          flights: favoriteFlights,
        };
    }
  };

  const filteredItems = getFilteredItems();
  const totalCount =
    favoriteHotels.length + favoriteRooms.length + favoriteFlights.length;

  // Handle hotel card click
  const handleHotelClick = (hotel: Hotel) => {
    navigate(`/hotel/${hotel.id}`);
  };

  // Handle room card click
  const handleRoomClick = (room: FavoriteRoom) => {
    navigate(`/hotel/${room.hotel_id}/room/${room.id}`);
  };

  // Handle flight card click
  const handleFlightClick = (flight: FavoriteFlight) => {
    navigate(`/flight/purchase/${flight.id}`);
  };

  // Format price
  const formatPrice = (price: string): string => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numPrice);
  };

  // Loading state
  if (isLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-primary-500 animate-spin mb-4 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Favorites
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch your favorites...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || dataError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <FaExclamationTriangle className="text-4xl text-red-500 mb-4 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to Load Favorites
          </h2>
          <p className="text-gray-600 mb-6">{error || dataError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <FaHeart className="text-3xl text-red-500" />
          <h1 className="text-3xl font-bold text-gray-800">My Favorites</h1>
          <span className="bg-primary-100 text-primary-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {totalCount} items
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 w-fit">
          {[
            { id: "all", label: "All", count: totalCount },
            { id: "hotels", label: "Hotels", count: favoriteHotels.length },
            { id: "rooms", label: "Rooms", count: favoriteRooms.length },
            { id: "flights", label: "Flights", count: favoriteFlights.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as FilterType)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === tab.id
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Empty State */}
        {totalCount === 0 ? (
          <div className="text-center py-16">
            <FaInbox className="text-6xl text-gray-300 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Favorites Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start exploring and add hotels or rooms to your favorites!
            </p>
            <button
              onClick={() => navigate("/hotel")}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse Hotels
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Hotels Section */}
            {filteredItems.hotels.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FaHotel className="mr-2 text-primary-500" />
                  Favorite Hotels ({filteredItems.hotels.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.hotels.map((hotel) => (
                    <HotelCard
                      key={hotel.id}
                      hotel={hotel}
                      onViewDetails={handleHotelClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Rooms Section */}
            {filteredItems.rooms.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FaBed className="mr-2 text-primary-500" />
                  Favorite Rooms ({filteredItems.rooms.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.rooms.map((roomData) => {
                    const room = Array.isArray(roomData)
                      ? roomData[0]
                      : roomData;
                    return (
                      <div
                        key={room.id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                        onClick={() => handleRoomClick(room)}
                      >
                        <div className="relative">
                          <div className="h-48 bg-gray-200 flex items-center justify-center">
                            <img src={room.images[0].url} />
                          </div>

                          {/* Favorite Button */}
                          <div className="absolute top-3 right-3">
                            <FavoriteButton
                              type="room"
                              id={room.id}
                              size="md"
                              className="bg-white bg-opacity-90 hover:bg-opacity-100"
                            />
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {room.room_type}
                          </h3>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <FaUsers className="mr-2" />
                              <span>Capacity: {room.capacity} guests</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <FaDollarSign className="mr-2" />
                              <span className="font-semibold text-green-600">
                                {formatPrice(room.price_per_night)} / night
                              </span>
                            </div>
                          </div>

                          {room.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                              {room.description}
                            </p>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRoomClick(room);
                            }}
                            className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Flights Section */}
            {filteredItems.flights.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaPlane className="mr-2 text-primary-500" />
                  Favorite Flights ({filteredItems.flights.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.flights[0].map((flight) => (
                    <div
                    key={flight.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => handleFlightClick(flight)}
                    >
                      {
                        console.log("filtered:, ",flight)
                      }
                      <div className="relative">
                        <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <FaPlane className="text-4xl text-white" />
                        </div>

                        {/* Favorite Button */}
                        <div className="absolute top-3 right-3">
                          <FavoriteButton
                            type="flight"
                            id={flight.id}
                            size="md"
                            className="bg-white bg-opacity-90 hover:bg-opacity-100"
                          />
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {flight.airline} {flight.flight_number}
                        </h3>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <FaMapMarkerAlt className="mr-2" />
                            <span>
                              {flight.departure_airport?.IATA_code || "N/A"} →{" "}
                              {flight.arrival_airport?.IATA_code || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <FaClock className="mr-2" />
                            <span>
                              {new Date(
                                flight.departure_time
                              ).toLocaleDateString()}{" "}
                              at{" "}
                              {new Date(
                                flight.departure_time
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFlightClick(flight);
                          }}
                          className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
