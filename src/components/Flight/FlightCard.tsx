import {
  FaPlane,
  FaClock,
  FaHeart,
  FaRegHeart,
  FaInfoCircle,
  FaArrowRight,
  FaWifi,
  FaUtensils,
} from "react-icons/fa";
import { FlightCardProps } from "../../types/flight";

const FlightCard: React.FC<FlightCardProps> = ({
  flight,
  onSelect,
  onViewDetails,
  onAddToFavorites,
  isSelected = false,
  isFavorite = false,
}) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStopsText = (stops: number) => {
    if (stops === 0) return "Direct";
    if (stops === 1) return "1 Stop";
    return `${stops} Stops`;
  };

  const getFlightClassBadge = (flightClass: string) => {
    const classes = {
      economy: "bg-blue-100 text-blue-800",
      business: "bg-purple-100 text-purple-800",
      first: "bg-gold-100 text-gold-800",
    };
    return classes[flightClass as keyof typeof classes] || classes.economy;
  };

  const departureTime = formatTime(flight.departure_time);
  const arrivalTime = formatTime(flight.arrival_time);
  const duration = formatDuration(flight.duration_minutes);
  const stopsText = getStopsText(flight.stops);

  return (
    <div
      className={`bg-white rounded-lg shadow-md border-2 transition-all duration-200 hover:shadow-lg ${
        isSelected
          ? "border-primary-500 bg-primary-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="p-6">
        {/* Header with Airline and Flight Number */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
              <FaPlane className="text-primary-500 text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{flight.airline}</h3>
              <p className="text-sm text-gray-500">{flight.flight_number}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getFlightClassBadge(
                flight.flight_class
              )}`}
            >
              {flight.flight_class.charAt(0).toUpperCase() +
                flight.flight_class.slice(1)}
            </span>
            <button
              onClick={() => onAddToFavorites(flight)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {isFavorite ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart className="text-gray-400 hover:text-red-500" />
              )}
            </button>
          </div>
        </div>

        {/* Flight Route and Times */}
        <div className="flex items-center justify-between mb-4">
          {/* Departure */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {departureTime}
            </div>
            <div className="text-sm text-gray-500">
              {flight.departure_airport.IATA_code}
            </div>
            <div className="text-xs text-gray-400">
              {flight.departure_airport.city.name}
            </div>
          </div>

          {/* Flight Path */}
          <div className="flex-1 mx-6">
            <div className="flex items-center justify-center relative">
              <div className="flex-1 h-px bg-gray-300"></div>
              <div className="mx-2 bg-white px-2">
                <FaPlane className="text-primary-500 transform rotate-90" />
              </div>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
            <div className="text-center mt-2">
              <div className="text-sm font-medium text-gray-700">
                {duration}
              </div>
              <div className="text-xs text-gray-500">{stopsText}</div>
            </div>
          </div>

          {/* Arrival */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {arrivalTime}
            </div>
            <div className="text-sm text-gray-500">
              {flight.arrival_airport.IATA_code}
            </div>
            <div className="text-xs text-gray-400">
              {flight.arrival_airport.city.name}
            </div>
          </div>
        </div>

        {/* Additional Flight Info */}
        <div className="flex items-center justify-between mb-4 py-3 bg-gray-50 rounded-lg px-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {flight.aircraft_type && (
              <span className="flex items-center">
                <FaPlane className="mr-1 text-xs" />
                {flight.aircraft_type}
              </span>
            )}
            <span className="flex items-center">
              <FaClock className="mr-1 text-xs" />
              {duration}
            </span>
            <span className="text-green-600 font-medium">
              {flight.available_seats} seats left
            </span>
          </div>

          {/* Amenities */}
          <div className="flex items-center space-x-2 text-gray-400">
            <FaWifi className="text-sm" />
            <FaUtensils className="text-sm" />
          </div>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              ${flight.price}
            </div>
            <div className="text-sm text-gray-500">per person</div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => onViewDetails(flight)}
              className="px-4 py-2 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition-colors flex items-center"
            >
              <FaInfoCircle className="mr-2" />
              Details
            </button>
            <button
              onClick={() => onSelect(flight)}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center"
            >
              Select Flight
              <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>

        {/* Low availability warning */}
        {flight.available_seats <= 5 && (
          <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800 flex items-center">
              <FaInfoCircle className="mr-2" />
              Only {flight.available_seats} seats left at this price!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightCard;
