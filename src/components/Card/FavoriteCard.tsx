import React from "react";
import { FaHeart, FaPlane, FaHotel, FaCity, FaStar, FaTrash, FaEye } from "react-icons/fa";
import { MdLocationOn, MdAccessTime } from "react-icons/md";
import { Link } from "react-router-dom";

// Types for different favorite items
interface FavoriteHotel {
  id: number;
  name: string;
  address?: string;
  city: string;
  rating?: number;
  image?: string;
  created_at: string;
  type: 'hotel';
}

interface FavoriteFlight {
  id: number;
  airline: string;
  flight_number: string;
  departure_airport: {
    name: string;
    IATA_code: string;
  };
  arrival_airport: {
    name: string;
    IATA_code: string;
  };
  departure_time: string;
  arrival_time: string;
  created_at: string;
  type: 'flight';
}

interface FavoriteCity {
  id: number;
  name: string;
  country: string;
  image?: string;
  created_at: string;
  type: 'city';
}

type FavoriteItem = FavoriteHotel | FavoriteFlight | FavoriteCity;

interface FavoriteCardProps {
  item: FavoriteItem;
  onRemove: () => void;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ item, onRemove }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCardIcon = () => {
    switch (item.type) {
      case 'hotel':
        return <FaHotel className="text-blue-500" />;
      case 'flight':
        return <FaPlane className="text-green-500" />;
      case 'city':
        return <FaCity className="text-purple-500" />;
      default:
        return <FaHeart className="text-red-500" />;
    }
  };

  const getViewLink = () => {
    switch (item.type) {
      case 'hotel':
        return `/hotel/${item.id}`;
      case 'flight':
        return `/flight/purchase/${item.id}`;
      case 'city':
        return `/city/${item.id}`;
      default:
        return '#';
    }
  };

  const renderHotelCard = (hotel: FavoriteHotel) => (
    <>
      <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
        {hotel.image ? (
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
            <FaHotel className="text-4xl text-blue-400" />
          </div>
        )}
        <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          Hotel
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{hotel.name}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <MdLocationOn className="mr-1" />
          <span className="text-sm">{hotel.city}</span>
        </div>
        {hotel.address && (
          <p className="text-sm text-gray-500 mb-2">{hotel.address}</p>
        )}
        {hotel.rating && (
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`text-sm ${
                  i < hotel.rating! ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">({hotel.rating}/5)</span>
          </div>
        )}
      </div>
    </>
  );

  const renderFlightCard = (flight: FavoriteFlight) => (
    <>
      <div className="relative h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-t-lg overflow-hidden flex items-center justify-center">
        <FaPlane className="text-4xl text-green-400" />
        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          Flight
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {flight.airline} {flight.flight_number}
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <div className="font-medium">{flight.departure_airport.IATA_code}</div>
              <div className="text-gray-500">{flight.departure_airport.name}</div>
            </div>
            <FaPlane className="text-gray-400 transform rotate-90" />
            <div className="text-sm text-right">
              <div className="font-medium">{flight.arrival_airport.IATA_code}</div>
              <div className="text-gray-500">{flight.arrival_airport.name}</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <MdAccessTime className="mr-1" />
              <span>{formatTime(flight.departure_time)}</span>
            </div>
            <div className="flex items-center">
              <MdAccessTime className="mr-1" />
              <span>{formatTime(flight.arrival_time)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderCityCard = (city: FavoriteCity) => (
    <>
      <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
        {city.image ? (
          <img
            src={city.image}
            alt={city.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200">
            <FaCity className="text-4xl text-purple-400" />
          </div>
        )}
        <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          City
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{city.name}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <MdLocationOn className="mr-1" />
          <span className="text-sm">{city.country}</span>
        </div>
      </div>
    </>
  );

  const renderCardContent = () => {
    switch (item.type) {
      case 'hotel':
        return renderHotelCard(item as FavoriteHotel);
      case 'flight':
        return renderFlightCard(item as FavoriteFlight);
      case 'city':
        return renderCityCard(item as FavoriteCity);
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {renderCardContent()}
      
      {/* Footer with actions and date */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Added {formatDate(item.created_at)}
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={getViewLink()}
              className="p-2 text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
              title="View details"
            >
              <FaEye className="text-sm" />
            </Link>
            <button
              onClick={onRemove}
              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Remove from favorites"
            >
              <FaTrash className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteCard;
