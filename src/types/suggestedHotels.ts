// Suggested Hotels API TypeScript interfaces

export interface SuggestedHotel {
  id: number;
  name: string;
  city_name: string;
  rating: number;
  description: string;
  image_url?: string;
  price_per_night?: number;
  address?: string;
}

export interface SuggestedHotelsResponse {
  status: string;
  message?: string;
  data: SuggestedHotel[];
  pagination: {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
}

export interface SuggestedHotelsApiError {
  status: string;
  message: string;
  errors?: Record<string, string[]>;
}

// Props for suggested hotels components
export interface SuggestedHotelsProps {
  cityId: number;
  cityName: string;
  isVisible: boolean;
  onClose?: () => void;
}

export interface SuggestedHotelCardProps {
  hotel: SuggestedHotel;
  onViewDetails: (hotelId: number) => void;
  onBookNow: (hotelId: number) => void;
}

// Filter and sort options for suggested hotels
export interface SuggestedHotelsFilters {
  rating?: number;
  price_range?: {
    min: number;
    max: number;
  };
  sort_by?: 'rating' | 'price' | 'name';
  sort_order?: 'asc' | 'desc';
}

// API service types
export interface FetchSuggestedHotelsParams {
  cityId: number;
  page?: number;
  per_page?: number;
  filters?: SuggestedHotelsFilters;
}

export interface SuggestedHotelsState {
  hotels: SuggestedHotel[];
  loading: boolean;
  error: string | null;
  pagination: SuggestedHotelsResponse['pagination'] | null;
  filters: SuggestedHotelsFilters;
}

// Constants
export const SUGGESTED_HOTELS_ENDPOINTS = {
  GET_BY_CITY: (cityId: number) => `/api/cities/${cityId}/hotels`,
} as const;

export const HOTELS_PER_PAGE = 10;

export const RATING_OPTIONS = [
  { value: 5, label: '5 Stars' },
  { value: 4, label: '4+ Stars' },
  { value: 3, label: '3+ Stars' },
  { value: 2, label: '2+ Stars' },
  { value: 1, label: '1+ Stars' },
] as const;

export const SORT_OPTIONS = [
  { value: 'rating', label: 'Rating' },
  { value: 'price', label: 'Price' },
  { value: 'name', label: 'Name' },
] as const;

export const SORT_ORDER_OPTIONS = [
  { value: 'desc', label: 'High to Low' },
  { value: 'asc', label: 'Low to High' },
] as const;
