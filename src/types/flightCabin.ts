// Flight Cabin related TypeScript interfaces

export interface Flight {
  id: number;
  airline: string;
  flight_number: string;
  departure_airport_id: number;
  arrival_airport_id: number;
  departure_time: string;
  arrival_time: string;
  departure_airport?: {
    id: number;
    name: string;
    IATA_code: string;
    city: {
      id: number;
      name: string;
      country: string;
    };
  };
  arrival_airport?: {
    id: number;
    name: string;
    IATA_code: string;
    city: {
      id: number;
      name: string;
      country: string;
    };
  };
}

export interface FlightCabinBooking {
  id: number;
  user_id: number;
  flight_cabins_id: number;
  booking_date: string;
  seat_number: number;
  status: string;
}

export interface FlightCabin {
  id: number;
  flight_id: number;
  class_name: string; // Economy, Business, First
  price: string; // decimal as string
  available_seats: number;
  note?: string;
  created_at?: string;
  updated_at?: string;
  flight: Flight;
  bookings?: FlightCabinBooking[];
}

// Form data interfaces
export interface CreateFlightCabinFormData {
  flight_id: string;
  class_name: string;
  price: string;
  available_seats: string;
  note: string;
}

export interface EditFlightCabinFormData {
  flight_id: string;
  class_name: string;
  price: string;
  available_seats: string;
  note: string;
}

// API response interfaces
export interface FlightCabinResponse {
  status: string;
  message?: string;
  data: FlightCabin[];
  pagination?: {
    current_page: number;
    total_pages: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    per_page: number;
    total: number;
  };
}

export interface SingleFlightCabinResponse {
  status: string;
  message?: string;
  data: FlightCabin;
}

export interface FlightsResponse {
  status: string;
  message?: string;
  data: Flight[];
  pagination?: {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
}

// Modal props interfaces
export interface CreateFlightCabinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface EditFlightCabinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  flightCabin: FlightCabin | null;
}

export interface ShowFlightCabinModalProps {
  isOpen: boolean;
  onClose: () => void;
  flightCabinId: number | null;
}

export interface DeleteFlightCabinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  flightCabin: FlightCabin | null;
}

// Form errors
export type FlightCabinFormErrors = {
  [K in keyof CreateFlightCabinFormData]?: string;
} & {
  general?: string;
};

// Constants
export const FLIGHT_CLASSES = [
  { value: "Economy", label: "Economy" },
  { value: "Business", label: "Business" },
  { value: "First", label: "First Class" },
] as const;

export const FLIGHT_CABIN_ENDPOINTS = {
  LIST: "/api/flight-cabin",
  CREATE: "/api/flight-cabin",
  SHOW: (id: number) => `/api/flight-cabin/${id}`,
  UPDATE: (id: number) => `/api/flight-cabin/${id}`,
  DELETE: (id: number) => `/api/flight-cabin/${id}`,
  FLIGHTS: "/api/flight",
} as const;

// Utility functions
export const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numPrice);
};

export const getClassBadgeColor = (className: string): string => {
  switch (className.toLowerCase()) {
    case "economy":
      return "bg-blue-100 text-blue-800";
    case "business":
      return "bg-purple-100 text-purple-800";
    case "first":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const formatFlightRoute = (flight: Flight): string => {
  const departure = flight.departure_airport?.IATA_code || "N/A";
  const arrival = flight.arrival_airport?.IATA_code || "N/A";
  return `${departure} → ${arrival}`;
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
