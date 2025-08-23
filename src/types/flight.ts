// Flight-related TypeScript interfaces

export interface Airport {
  id: number;
  name: string;
  IATA_code: string;
  city_name: number;
  city: {
    id: number;
    name: string;
    country: string;
  };
  country: string;
}

export interface Airline {
  id: number;
  name: string;
  code: string;
  logo?: string;
}
export interface Flight {
  id: number;
  airline: string;
  flight_number: string;
  departure_airport_id: number;
  arrival_airport_id: number;
  departure_time: string;
  arrival_time: string;
  price: number;
  available_seats: number;
  aircraft_type?: string;
  flight_details: {
    id: number;
    flight_id: number;
    class_name: string;
    price: string;
    available_seats: number;
    note?: string;
  }[];
  flight_class: "economy" | "business" | "first";
  duration_minutes: number;
  stops: number;
  created_at: string;
  updated_at: string;
  departure_airport: Airport;
  arrival_airport: Airport;
}

// Search parameters
export interface FlightSearchParams {
  origin: string;
  destination: string;
  departure_date: string;
  return_date?: string;
  trip_type: "one-way" | "round-trip" | "multi-city";
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  flight_class: "economy" | "business" | "first";
}

// Filter parameters
export interface FlightFilters {
  price_range: {
    min: number;
    max: number;
  };
  airlines: string[];
  departure_time_range: {
    start: string; // HH:MM format
    end: string; // HH:MM format
  };
  arrival_time_range: {
    start: string;
    end: string;
  };
  duration_range: {
    min: number; // in minutes
    max: number;
  };
  stops: number[]; // [0, 1, 2] for direct, 1 stop, 2+ stops
  aircraft_types: string[];
  departure_airports: string[];
  arrival_airports: string[];

  // Advanced filters matching backend scope
  old_flights?: boolean;
  later_flight?: boolean;
  airline?: string;
  from_date?: string;
  to_date?: string;
  arrival_country?: string;
}

// Sort options
export type FlightSortOption =
  | "price_asc"
  | "price_desc"
  | "duration_asc"
  | "duration_desc"
  | "departure_time_asc"
  | "departure_time_desc"
  | "arrival_time_asc"
  | "arrival_time_desc";

// API response interfaces
export interface FlightSearchResponse {
  status: string;
  message?: string;
  data: Flight[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_results: number;
    per_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
  filters?: {
    available_airlines: Airline[];
    price_range: { min: number; max: number };
    duration_range: { min: number; max: number };
  };
}

export interface AirportsResponse {
  status: string;
  message?: string;
  data: Airport[];
}

// Component props interfaces
export interface FlightSearchBarProps {
  onSearch: (params: FlightSearchParams) => void;
  loading?: boolean;
  initialValues?: Partial<FlightSearchParams>;
}

export interface FlightFiltersProps {
  filters: FlightFilters;
  onFiltersChange: (filters: FlightFilters) => void;
  availableAirlines: Airline[];
  priceRange: { min: number; max: number };
  durationRange: { min: number; max: number };
}

export interface FlightCardProps {
  flight: Flight;
  onSelect: (flight: Flight) => void;
  onViewDetails: (flight: Flight) => void;
  onAddToFavorites: (flight: Flight) => void;
  onBookNow?: (flight: Flight) => void;
  isSelected?: boolean;
  isFavorite?: boolean;
}

export interface FlightResultsProps {
  flights: Flight[];
  loading: boolean;
  error?: string;
  sortBy: FlightSortOption;
  onSortChange: (sort: FlightSortOption) => void;
  onFlightSelect: (flight: Flight) => void;
  onViewDetails: (flight: Flight) => void;
  onAddToFavorites: (flight: Flight) => void;
  onBookNow?: (flight: Flight) => void;
  pagination?: {
    current_page: number;
    total_pages: number;
    total_results: number;
    onPageChange: (page: number) => void;
  };
}

// Form data interfaces
export interface FlightSearchFormData {
  origin: string;
  destination: string;
  departure_date: string;
  return_date: string;
  trip_type: string;
  adults: number;
  children: number;
  infants: number;
  flight_class: string;
}

// Utility types
export type FlightSearchErrors = {
  [K in keyof FlightSearchFormData]?: string;
} & {
  general?: string;
};

// Constants
export const TRIP_TYPES = [
  { value: "one-way", label: "One Way" },
  { value: "round-trip", label: "Round Trip" },
  { value: "multi-city", label: "Multi City" },
] as const;

export const FLIGHT_CLASSES = [
  { value: "economy", label: "Economy" },
  { value: "business", label: "Business" },
  { value: "first", label: "First Class" },
] as const;

export const SORT_OPTIONS = [
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "duration_asc", label: "Duration: Shortest" },
  { value: "duration_desc", label: "Duration: Longest" },
  { value: "departure_time_asc", label: "Departure: Earliest" },
  { value: "departure_time_desc", label: "Departure: Latest" },
] as const;

export const STOPS_OPTIONS = [
  { value: 0, label: "Direct" },
  { value: 1, label: "1 Stop" },
  { value: 2, label: "2+ Stops" },
] as const;

// Helper functions types
export interface FlightUtils {
  formatDuration: (minutes: number) => string;
  formatTime: (dateString: string) => string;
  formatDate: (dateString: string) => string;
  calculateLayoverTime: (flight: Flight) => string;
  getStopsText: (stops: number) => string;
}
