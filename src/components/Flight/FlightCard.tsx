import { FaPlane, FaInfoCircle, FaArrowRight } from "react-icons/fa";
import { FlightCardProps } from "../../types/flight";
import FavoriteButton from "../Favorites/FavoriteButton";

const FlightCard: React.FC<FlightCardProps> = ({
  flight,
  onSelect,
  isSelected = false,
}) => {
  const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const calculateFlightDuration = (
    departure: string,
    arrival: string
  ): string => {
    const departureTime = new Date(departure);
    const arrivalTime = new Date(arrival);
    const durationMs = arrivalTime.getTime() - departureTime.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const prices =
    flight.flight_details && flight.flight_details.length > 0
      ? flight.flight_details.map((detail) => parseFloat(detail.price))
      : [];

  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

  const departureTime = formatTime(flight.departure_time);
  const arrivalTime = formatTime(flight.arrival_time);

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
            <FavoriteButton
              type="flight"
              id={flight.id}
              size="md"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            />
          </div>
        </div>

        {/* Flight Route and Times */}
        <div className="flex items-center justify-between mb-4">
          {/* Departure */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {departureTime}
            </div>
            <div className="text-sm text-gray-600">
              {formatDate(flight.departure_time)}
            </div>
            <div className="text-sm text-gray-500">
              {flight.departure_airport.country_name}
            </div>
            <div className="text-xs text-gray-400">
              {flight.departure_airport.city_name}
            </div>
          </div>

          {/* Flight Path */}
          <div className="flex-1 mx-6">
            <div className="flex items-center justify-center relative">
              <div className="flex-1 h-px bg-gray-300"></div>
              <div className="flex flex-col items-center justify-center gap-2 mx-2 bg-white px-2">
                <FaPlane className="text-primary-500 transform rotate-90" />
                {calculateFlightDuration(
                  flight.departure_time,
                  flight.arrival_time
                )}
              </div>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
          </div>

          {/* Arrival */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {arrivalTime}
            </div>
            <div className="text-sm text-gray-600">
              {formatDate(flight.arrival_time)}
            </div>
            <div className="text-sm text-gray-500">
              {flight.arrival_airport.country_name}
            </div>
            <div className="text-xs text-gray-400">
              {flight.arrival_airport.city_name}
            </div>
          </div>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="text-right">
            <div className="text-2xl font-bold text-green-500">
              {minPrice === null || maxPrice === null ? (
                <span className="text-gray-400 text-sm italic">
                  Price not available
                </span>
              ) : minPrice === maxPrice ? (
                <>${minPrice.toFixed(2)}</>
              ) : (
                <>
                  <span className="text-sm font-normal text-gray-500">
                    from{" "}
                  </span>
                  ${minPrice.toFixed(2)}
                  <span className="text-sm font-normal text-gray-500">
                    {" "}
                    to{" "}
                  </span>
                  ${maxPrice.toFixed(2)}
                </>
              )}
            </div>

            <div className="text-sm text-gray-500 text-left">per person</div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => onSelect(flight)}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center"
            >
              Select
              <FaArrowRight className="ml-1" />
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
