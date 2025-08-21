// Favorites API interfaces
export interface Favorite {
  id: number;
  user_id: number;
  favoritable_type: 'App\\Models\\Hotel' | 'App\\Models\\Room';
  favoritable_id: number;
}

export interface UserWithFavorites {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  roles: Array<{
    id: number;
    name: string;
  }>;
  permissions: any[];
  favorites: Favorite[];
}

export interface UserFavoritesResponse {
  status: string;
  message: string;
  data: UserWithFavorites[];
}

export interface FavoriteActionResponse {
  status: string;
  message: string;
  data?: any;
}

// Parsed favorites for easier use
export interface ParsedFavorites {
  hotels: number[]; // Array of hotel IDs
  rooms: number[];  // Array of room IDs
}

// Favorite context types
export interface FavoritesContextType {
  favorites: ParsedFavorites;
  isLoading: boolean;
  error: string | null;
  toggleHotelFavorite: (hotelId: number) => Promise<void>;
  toggleRoomFavorite: (roomId: number) => Promise<void>;
  isHotelFavorite: (hotelId: number) => boolean;
  isRoomFavorite: (roomId: number) => boolean;
  refreshFavorites: () => Promise<void>;
}
