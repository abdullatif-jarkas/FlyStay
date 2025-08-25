import React, { useState } from "react";
import { FaHeart, FaSpinner } from "react-icons/fa";
import { useFavorites } from "../../contexts/FavoritesContext";

interface FavoriteButtonProps {
  type: "hotel" | "room" | "flight";
  id: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  type,
  id,
  className = "",
  size = "md",
  showText = false,
}) => {
  const {
    isHotelFavorite,
    isRoomFavorite,
    isFlightFavorite,
    toggleHotelFavorite,
    toggleRoomFavorite,
    toggleFlightFavorite,
  } = useFavorites();

  const [isToggling, setIsToggling] = useState(false);

  const isFavorite =
    type === "hotel"
      ? isHotelFavorite(id)
      : type === "room"
      ? isRoomFavorite(id)
      : isFlightFavorite(id);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isToggling) return;

    setIsToggling(true);

    try {
      if (type === "hotel") {
        await toggleHotelFavorite(id);
      } else if (type === "room") {
        await toggleRoomFavorite(id);
      } else {
        await toggleFlightFavorite(id);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsToggling(false);
    }
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      button: "p-1.5",
      icon: "text-sm",
      text: "text-xs",
    },
    md: {
      button: "p-2",
      icon: "text-base",
      text: "text-sm",
    },
    lg: {
      button: "p-3",
      icon: "text-lg",
      text: "text-base",
    },
  };

  const config = sizeConfig[size];

  return (
    <button
      onClick={handleToggle}
      disabled={isToggling}
      className={`
        ${config.button}
        rounded-full
        transition-all
        duration-200
        flex
        items-center
        justify-center
        ${
          isFavorite
            ? "bg-red-100 text-red-600 hover:bg-red-200"
            : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-500"
        }
        ${isToggling ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
        ${className}
      `}
      title={
        isToggling
          ? "Updating..."
          : isFavorite
          ? `Remove ${type} from favorites`
          : `Add ${type} to favorites`
      }
    >
      {isToggling ? (
        <FaSpinner className={`${config.icon} animate-spin`} />
      ) : (
        <FaHeart
          className={`${config.icon} ${
            isFavorite ? "text-red-600" : "text-current"
          }`}
          style={{
            fill: isFavorite ? "currentColor" : "none",
            stroke: isFavorite ? "currentColor" : "currentColor",
            strokeWidth: isFavorite ? 0 : 2,
          }}
        />
      )}

      {showText && (
        <span className={`ml-2 ${config.text} font-medium`}>
          {isToggling
            ? "Updating..."
            : isFavorite
            ? "Favorited"
            : "Add to Favorites"}
        </span>
      )}
    </button>
  );
};

export default FavoriteButton;
