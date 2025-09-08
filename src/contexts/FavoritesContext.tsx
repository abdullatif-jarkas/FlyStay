import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  FavoritesContextType,
  ParsedFavorites,
  UserFavoritesResponse,
  FavoriteActionResponse,
  Favorite,
  FavoritesProviderProps,
} from "../types/favorites";

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};



export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<ParsedFavorites>({
    hotels: [],
    rooms: [],
    flights: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  // Parse favorites from API response
  const parseFavorites = useCallback(
    (favoritesArray: Favorite[]): ParsedFavorites => {
      const hotels: number[] = [];
      const rooms: number[] = [];
      const flights: number[] = [];

      favoritesArray.forEach((favorite) => {
        if (favorite.favoritable_type === "App\\Models\\Hotel") {
          hotels.push(favorite.favoritable_id);
        } else if (favorite.favoritable_type === "App\\Models\\Room") {
          rooms.push(favorite.favoritable_id);
        } else if (favorite.favoritable_type === "App\\Models\\Flight") {
          flights.push(favorite.favoritable_id);
        }
      });

      return { hotels, rooms, flights };
    },
    []
  );

  // Fetch user favorites
  const refreshFavorites = useCallback(async () => {
    if (!token) {
      setFavorites({ hotels: [], rooms: [], flights: [] });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get<UserFavoritesResponse>(
        "http://127.0.0.1:8000/api/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.status === "success" && response.data.data.length > 0) {
        const userFavorites = response.data.data[0].favorites;
        const parsedFavorites = parseFavorites(userFavorites);
        setFavorites(parsedFavorites);
      } else {
        setFavorites({ hotels: [], rooms: [], flights: [] });
      }
    } catch (err: unknown) {
      console.error("Error fetching favorites:", err);
      const errorMessage =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      setError(errorMessage || "Failed to fetch favorites");
      setFavorites({ hotels: [], rooms: [], flights: [] });
    } finally {
      setIsLoading(false);
    }
  }, [token, parseFavorites]);

  // Toggle hotel favorite
  const toggleHotelFavorite = useCallback(
    async (hotelId: number) => {
      if (!token) {
        toast.error("Please login to manage favorites");
        return;
      }

      const isCurrentlyFavorite = favorites.hotels.includes(hotelId);

      // Optimistic update
      setFavorites((prev) => ({
        ...prev,
        hotels: isCurrentlyFavorite
          ? prev.hotels.filter((id) => id !== hotelId)
          : [...prev.hotels, hotelId],
      }));

      try {
        const response = await axios.post<FavoriteActionResponse>(
          `http://127.0.0.1:8000/api/favorite/hotel/${hotelId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (response.data.status === "success") {
          toast.success(
            isCurrentlyFavorite
              ? "Hotel removed from favorites"
              : "Hotel added to favorites"
          );
        } else {
          // Revert optimistic update on failure
          setFavorites((prev) => ({
            ...prev,
            hotels: isCurrentlyFavorite
              ? [...prev.hotels, hotelId]
              : prev.hotels.filter((id) => id !== hotelId),
          }));
          toast.error(response.data.message || "Failed to update favorites");
        }
      } catch (err: unknown) {
        console.error("Error toggling hotel favorite:", err);

        // Revert optimistic update on error
        setFavorites((prev) => ({
          ...prev,
          hotels: isCurrentlyFavorite
            ? [...prev.hotels, hotelId]
            : prev.hotels.filter((id) => id !== hotelId),
        }));

        const errorMessage =
          err instanceof Error && "response" in err
            ? (err as { response?: { data?: { message?: string } } }).response
                ?.data?.message
            : undefined;
        toast.error(errorMessage || "Failed to update favorites");
      }
    },
    [token, favorites.hotels]
  );

  // Toggle room favorite
  const toggleRoomFavorite = useCallback(
    async (roomId: number) => {
      if (!token) {
        toast.error("Please login to manage favorites");
        return;
      }

      const isCurrentlyFavorite = favorites.rooms.includes(roomId);

      // Optimistic update
      setFavorites((prev) => ({
        ...prev,
        rooms: isCurrentlyFavorite
          ? prev.rooms.filter((id) => id !== roomId)
          : [...prev.rooms, roomId],
      }));

      try {
        const response = await axios.post<FavoriteActionResponse>(
          `http://127.0.0.1:8000/api/favorite/room/${roomId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (response.data.status === "success") {
          toast.success(
            isCurrentlyFavorite
              ? "Room removed from favorites"
              : "Room added to favorites"
          );
        } else {
          // Revert optimistic update on failure
          setFavorites((prev) => ({
            ...prev,
            rooms: isCurrentlyFavorite
              ? [...prev.rooms, roomId]
              : prev.rooms.filter((id) => id !== roomId),
          }));
          toast.error(response.data.message || "Failed to update favorites");
        }
      } catch (err: unknown) {
        console.error("Error toggling room favorite:", err);

        // Revert optimistic update on error
        setFavorites((prev) => ({
          ...prev,
          rooms: isCurrentlyFavorite
            ? [...prev.rooms, roomId]
            : prev.rooms.filter((id) => id !== roomId),
        }));

        const errorMessage =
          err instanceof Error && "response" in err
            ? (err as { response?: { data?: { message?: string } } }).response
                ?.data?.message
            : undefined;
        toast.error(errorMessage || "Failed to update favorites");
      }
    },
    [token, favorites.rooms]
  );

  // Toggle flight favorite
  const toggleFlightFavorite = useCallback(
    async (flightId: number) => {
      if (!token) {
        toast.error("Please login to manage favorites");
        return;
      }

      const isCurrentlyFavorite = favorites.flights.includes(flightId);

      // Optimistic update
      setFavorites((prev) => ({
        ...prev,
        flights: isCurrentlyFavorite
          ? prev.flights.filter((id) => id !== flightId)
          : [...prev.flights, flightId],
      }));

      try {
        const response = await axios.post<FavoriteActionResponse>(
          `http://127.0.0.1:8000/api/favorite/flight/${flightId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (response.data.status === "success") {
          toast.success(
            isCurrentlyFavorite
              ? "Flight removed from favorites"
              : "Flight added to favorites"
          );
        } else {
          // Revert optimistic update on failure
          setFavorites((prev) => ({
            ...prev,
            flights: isCurrentlyFavorite
              ? [...prev.flights, flightId]
              : prev.flights.filter((id) => id !== flightId),
          }));
          toast.error(response.data.message || "Failed to update favorites");
        }
      } catch (err: unknown) {
        console.error("Error toggling flight favorite:", err);

        // Revert optimistic update on error
        setFavorites((prev) => ({
          ...prev,
          flights: isCurrentlyFavorite
            ? [...prev.flights, flightId]
            : prev.flights.filter((id) => id !== flightId),
        }));

        const errorMessage =
          err instanceof Error && "response" in err
            ? (err as { response?: { data?: { message?: string } } }).response
                ?.data?.message
            : undefined;
        toast.error(errorMessage || "Failed to update favorites");
      }
    },
    [token, favorites.flights]
  );

  // Check if hotel is favorite
  const isHotelFavorite = useCallback(
    (hotelId: number): boolean => {
      return favorites.hotels.includes(hotelId);
    },
    [favorites.hotels]
  );

  // Check if room is favorite
  const isRoomFavorite = useCallback(
    (roomId: number): boolean => {
      return favorites.rooms.includes(roomId);
    },
    [favorites.rooms]
  );

  // Check if flight is favorite
  const isFlightFavorite = useCallback(
    (flightId: number): boolean => {
      return favorites.flights.includes(flightId);
    },
    [favorites.flights]
  );

  // Load favorites on mount and token change
  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  const value: FavoritesContextType = {
    favorites,
    isLoading,
    error,
    toggleHotelFavorite,
    toggleRoomFavorite,
    toggleFlightFavorite,
    isHotelFavorite,
    isRoomFavorite,
    isFlightFavorite,
    refreshFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
