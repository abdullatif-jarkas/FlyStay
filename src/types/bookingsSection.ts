import { ReactNode } from "react";

export interface ApiHotelBooking {
  id: number;
  user_id: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  booking_date: string;
  status: "confirmed" | "pending" | "failed" | "cancelled";
}

export interface ApiFlightBooking {
  id: number;
  user_id: number;
  flight_cabins_id: number;
  booking_date: string;
  seat_number: number;
  status: "confirmed" | "pending" | "failed" | "cancelled";
}

export interface HotelBookingAPI {
  id: number;
  user_id: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  booking_date: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  duration: string;
  user_Info: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    phone_number: string;
  };
  Room: {
    id: number;
    hotel_id: number;
    room_type: string;
    price_per_night: string;
    capacity: number;
    description: string;
  };
  Payments: any[];
}

export interface BookingProviderProps {
  children: ReactNode;
}

export interface BookingContextType {
  hotelBookings: HotelBookingAPI[];
  addHotelBooking: (booking: HotelBookingAPI) => void;
  updateBookingStatus: (bookingId: number, status: 'pending' | 'confirmed' | 'cancelled') => void;
  removeBooking: (bookingId: number) => void;
  getBookingById: (bookingId: number) => HotelBookingAPI | undefined;
  refreshBookings: () => void;
}


export interface ApiBookingsResponse {
  status: string;
  message: string;
  data: {
    "hotel-bookings": ApiHotelBooking[];
    "flight-bookings": ApiFlightBooking[];
  };
}

// Display interfaces (converted from API data)
export interface FlightBooking {
  id: number;
  booking_reference: string;
  flight_details: {
    airline: string;
    flight_number: string;
    departure_airport: string;
    arrival_airport: string;
    departure_time: string;
    arrival_time: string;
  };
  passenger_details: {
    name: string;
    email: string;
  };
  status: "confirmed" | "pending" | "cancelled" | "failed";
  total_amount: number;
  booking_date: string;
  seat_number: number;
}

export interface HotelBooking {
  id: number;
  booking_reference: string;
  hotel_name: string;
  room_type: string;
  check_in_date: string;
  check_out_date: string;
  guest_details: {
    name: string;
    email: string;
  };
  status: "confirmed" | "pending" | "cancelled" | "failed";
  total_amount: number;
  booking_date: string;
  nights: number;
}

export interface BookingsSectionProps {
  user?: {
    id: number;
    name: string;
    email: string;
  };
}