import React from "react";
import {
  FaHotel,
  FaStar,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaImage,
} from "react-icons/fa";
import { Hotel } from "../../types/hotel";
import FavoriteButton from "../Favorites/FavoriteButton";

export interface HotelCardProps {
  hotel: Hotel;
  onViewDetails: (hotel: Hotel) => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onViewDetails }) => {
  // Get primary image or first image
  const primaryImage =
    hotel.images?.find((img) => img.is_primary) || hotel.images?.[0];

  // Generate star rating display
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-yellow-400 opacity-50" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }

    return stars;
  };

  // Truncate description
  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Hotel Image */}
      <div className="relative h-48 bg-gray-200">
        {primaryImage ? (
          <img
            src={primaryImage.url || primaryImage.url}
            alt={primaryImage.alt || hotel.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : null}

        {/* Fallback when no image or image fails to load */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gray-100 ${
            primaryImage ? "hidden" : ""
          }`}
        >
          <FaImage className="text-4xl text-gray-400" />
        </div>

        {/* Favorite Button */}
        <div className="absolute top-3 right-3">
          <FavoriteButton
            type="hotel"
            id={hotel.id}
            size="md"
            className="bg-white bg-opacity-90 hover:bg-opacity-100"
          />
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-white bg-opacity-90 rounded-lg px-2 py-1">
          <div className="flex items-center space-x-1">
            <FaStar className="text-yellow-400 text-sm" />
            <span className="text-sm font-semibold text-gray-900">
              {hotel.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Hotel Information */}
      <div className="p-6 flex flex-col grow justify-between">
        <div>
          {/* Hotel Name and Location */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
              {hotel.name}
            </h3>

            <div className="flex items-center text-gray-600 mb-2">
              <FaMapMarkerAlt className="mr-2 text-primary-500" />
              <span className="text-sm">
                {hotel.city.name}, {hotel.country.name}
              </span>
            </div>

            {hotel.address && (
              <p className="text-sm text-gray-500 line-clamp-1">
                {hotel.address}
              </p>
            )}
          </div>

          {/* Star Rating */}
          <div className="flex items-center mb-4">
            <div className="flex items-center space-x-1 mr-2">
              {renderStars(hotel.rating)}
            </div>
            <span className="text-sm text-gray-600">
              ({hotel.rating} stars)
            </span>
          </div>

          {/* Description */}
          {hotel.description && (
            <div className="mb-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                {truncateDescription(hotel.description)}
              </p>
            </div>
          )}
        </div>

        <div>
          {/* Hotel Features/Amenities */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <FaHotel className="mr-2 text-primary-500" />
                <span>Hotel ID: {hotel.id}</span>
              </div>
              {hotel.rooms && hotel.rooms.length > 0 && (
                <div className="flex items-center">
                  <span className="text-primary-600 font-medium">
                    {hotel.rooms.length} room
                    {hotel.rooms.length !== 1 ? "s" : ""} available
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => onViewDetails(hotel)}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
            >
              <FaInfoCircle className="mr-2" />
              View Details
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              {hotel.images && hotel.images.length > 0 && (
                <span>
                  {hotel.images.length} photo
                  {hotel.images.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
