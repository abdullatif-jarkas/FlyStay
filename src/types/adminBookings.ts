// Flight Booking Types
export interface FlightBookingAdmin {
  id: number;
  user_id: number;
  flight_cabins_id: number;
  booking_date: string;
  seat_number: number;
  status: "confirmed" | "pending" | "failed" | "cancelled";
  total_amount?: number;
  created_at: string;
  updated_at: string;
  // User information (flattened from API response)
  user_name?: string;
  user_email?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  // Flight information (flattened from API response)
  flight?: {
    id: number;
    flight_number: string;
    airline: string;
    departure_time: string;
    arrival_time: string;
  };
  // Airport information (flattened from API response)
  departure_airport?: {
    id: number;
    name: string;
    IATA_code: string;
    city_name?: string;
  };
  arrival_airport?: {
    id: number;
    name: string;
    IATA_code: string;
    city_name?: string;
  };
  flight_cabin?: {
    id: number;
    class_name: string;
    price: number;
    flight?: {
      id: number;
      flight_number: string;
      airline: string;
      departure_time: string;
      arrival_time: string;
      departure_airport?: {
        id: number;
        name: string;
        IATA_code: string;
        city?: {
          id: number;
          name: string;
          country: string;
        };
      };
      arrival_airport?: {
        id: number;
        name: string;
        IATA_code: string;
        city?: {
          id: number;
          name: string;
          country: string;
        };
      };
    };
  };
}

// Hotel Booking Types
export interface HotelBookingAdmin {
  id: number;
  user_id: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  booking_date: string;
  status: "confirmed" | "pending" | "failed" | "cancelled";
  total_amount?: number;
  created_at: string;
  updated_at: string;
  // User information (flattened from API response)
  user_Info?: {
    name: string;
    email: string;
    phone_number?: string;
  };
  // Hotel information (flattened from API response)
  Hotel?: {
    name: string;
    description?: string;
    city_name?: string;
    country_name?: string;
    rating?: number;
  };
  // Room information (flattened from API response)
  Room?: {
    id: number;
    room_type: string;
    price_per_night: number;
    capacity?: number;
    description?: string;
  };
  user?: {
    id: number;
    name: string;
    email: string;
  };
  room?: {
    id: number;
    room_number: string;
    type: string;
    price_per_night: number;
    hotel?: {
      id: number;
      name: string;
      address: string;
      rating: number;
      city?: {
        id: number;
        name: string;
        country: string;
      };
    };
  };
}

// API Response Types
export interface FlightBookingsResponse {
  status: string;
  message: string;
  data: FlightBookingAdmin[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface HotelBookingsResponse {
  status: string;
  message: string;
  data: HotelBookingAdmin[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface FlightBookingDetailsResponse {
  status: string;
  message: string;
  data: FlightBookingAdmin;
}

export interface HotelBookingDetailsResponse {
  status: string;
  message: string;
  data: HotelBookingAdmin;
}

// Action Response Types
export interface BookingActionResponse {
  status: string;
  message: string;
  data?: unknown;
}

// Payment Response Types
export interface PaymentResponse {
  status: string;
  message: string;
  data: string[] | PaymentRecord; // Array containing client secret OR completed payment record
}

export interface PaymentRecord {
  id: number;
  user_id: number;
  method: string;
  transaction_id: string | null;
  verified_by: number;
  amount: string;
  date: string;
  status: string;
  payable_id: number;
  payable_type: string;
  payable?: {
    id: number;
    user_id: number;
    room_id?: number;
    flight_cabins_id?: number;
    check_in_date?: string;
    check_out_date?: string;
    booking_date: string;
    status: string;
  };
}

// Filter and Search Types
export interface BookingFilters {
  status?: string;
  user_id?: number;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface BookingTableProps {
  bookings: FlightBookingAdmin[] | HotelBookingAdmin[];
  loading: boolean;
  onView: (id: number) => void;
  onCancel: (id: number) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Modal Props
export interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: FlightBookingAdmin | HotelBookingAdmin | null;
  type: "flight" | "hotel";
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}
