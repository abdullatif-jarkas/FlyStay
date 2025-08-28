// Payment-related TypeScript interfaces

export interface PaymentIntentRequest {
  airline: string;
}

export interface PaymentIntentResponse {
  status: string;
  message: string;
  data: string[]; // Array containing the client secret
}

export interface FlightBookingPaymentData {
  flight_cabin_id: number;
  airline: string;
  passenger_details?: {
    name: string;
    email: string;
    phone: string;
  };
  seat_preference?: string;
}

export interface PaymentError {
  status: string;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaymentState {
  loading: boolean;
  clientSecret: string | null;
  error: string | null;
  success: boolean;
}

// Stripe-related interfaces
export interface StripePaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

// Flight booking confirmation
export interface FlightBookingConfirmation {
  booking_id: number;
  flight_cabin_id: number;
  payment_intent_id: string;
  status: "confirmed" | "pending" | "failed";
  booking_reference: string;
  passenger_details: {
    name: string;
    email: string;
    phone: string;
  };
  flight_details: {
    airline: string;
    flight_number: string;
    departure_airport: string;
    arrival_airport: string;
    departure_time: string;
    arrival_time: string;
    class: string;
    seat_number?: string;
  };
  payment_details: {
    amount: number;
    currency: string;
    payment_method: string;
    transaction_id: string;
  };
  created_at: string;
}

// Modal props for payment components
export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  flightCabinId: number;
  airline: string;
  onSuccess?: (confirmation: FlightBookingConfirmation) => void;
  onError?: (error: string) => void;
}

export interface FlightBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: any; // Flight object
  flightCabin: any; // FlightCabin object
  onBookingSuccess?: (confirmation: FlightBookingConfirmation) => void;
}

// Payment method types
export type PaymentMethod = "stripe" | "paypal" | "bank_transfer";

export interface PaymentMethodOption {
  id: PaymentMethod;
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
}

// Constants
export const PAYMENT_ENDPOINTS = {
  CREATE_FLIGHT_PAYMENT_INTENT: (flightCabinId: number) =>
    `/api/payments/flight-booking/${flightCabinId}`,
  CONFIRM_PAYMENT: "/api/payments/confirm",
  GET_PAYMENT_STATUS: (paymentIntentId: string) =>
    `/api/payments/status/${paymentIntentId}`,
} as const;

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
  CANCELED: "canceled",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

// Utility functions
export const formatPaymentAmount = (
  amount: number,
  currency = "USD"
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount / 100); // Stripe amounts are in cents
};

export const getPaymentStatusColor = (status: PaymentStatus): string => {
  switch (status) {
    case PAYMENT_STATUS.SUCCEEDED:
      return "text-green-600 bg-green-100";
    case PAYMENT_STATUS.PENDING:
    case PAYMENT_STATUS.PROCESSING:
      return "text-yellow-600 bg-yellow-100";
    case PAYMENT_STATUS.FAILED:
    case PAYMENT_STATUS.CANCELED:
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const getPaymentStatusText = (status: PaymentStatus): string => {
  switch (status) {
    case PAYMENT_STATUS.SUCCEEDED:
      return "Payment Successful";
    case PAYMENT_STATUS.PENDING:
      return "Payment Pending";
    case PAYMENT_STATUS.PROCESSING:
      return "Processing Payment";
    case PAYMENT_STATUS.FAILED:
      return "Payment Failed";
    case PAYMENT_STATUS.CANCELED:
      return "Payment Canceled";
    default:
      return "Unknown Status";
  }
};

// ===== ADMIN PAYMENT MANAGEMENT TYPES =====

export interface AdminPayment {
  id: number;
  user_id: number;
  payable_type: "App\\Models\\FlightBooking" | "App\\Models\\HotelBooking";
  payable_id: number;
  amount: number;
  method: "cash" | "stripe";
  status: "completed" | "pending" | "failed";
  transaction_id?: string;
  verified: boolean;
  verified_by?: number;
  created_at: string;
  updated_at: string;
  payable?: AdminFlightBooking | AdminHotelBooking;
  user?: AdminPaymentUser;
  verifier?: AdminPaymentUser;
}

export interface AdminPaymentUser {
  id: number;
  name: string;
  email: string;
}

export interface AdminFlightBooking {
  id: number;
  user_id: number;
  flight_cabins_id: number;
  booking_date: string;
  seat_number: number;
  status: string;
  flight_cabin?: {
    id: number;
    flight_id: number;
    cabin_type: string;
    price: number;
    flight?: {
      id: number;
      airline: string;
      flight_number: string;
      departure_airport: string;
      arrival_airport: string;
      departure_time: string;
      arrival_time: string;
    };
  };
}

export interface AdminHotelBooking {
  id: number;
  user_id: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  booking_date: string;
  status: string;
  room?: {
    id: number;
    hotel_id: number;
    room_type: string;
    price_per_night: number;
    hotel?: {
      id: number;
      name: string;
      location: string;
    };
  };
}

export interface AdminPaymentResponse {
  status: string;
  message: string;
  data: AdminPayment[];
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

export interface AdminPaymentDetailsResponse {
  status: string;
  message: string;
  data: AdminPayment;
}

export interface AdminPaymentFilters {
  status?: "completed" | "pending" | "failed" | "";
  method?: "cash" | "stripe" | "";
  verified?: boolean | "";
  date_from?: string;
  date_to?: string;
  amount_min?: number;
  amount_max?: number;
  search?: string;
  payable_type?:
    | "App\\Models\\FlightBooking"
    | "App\\Models\\HotelBooking"
    | "";
}

export interface AdminPaymentStats {
  total_payments: number;
  total_amount: number;
  completed_payments: number;
  pending_payments: number;
  failed_payments: number;
  cash_payments: number;
  stripe_payments: number;
  verified_payments: number;
  unverified_payments: number;
}

export interface AdminPaymentExportData {
  id: number;
  user_name: string;
  user_email: string;
  booking_type: string;
  booking_id: number;
  amount: number;
  method: string;
  status: string;
  transaction_id: string;
  verified: string;
  verified_by: string;
  created_at: string;
}

// Component Props Interfaces
export interface AdminPaymentListProps {
  payments: AdminPayment[];
  loading: boolean;
  error: string | null;
  onPaymentSelect: (payment: AdminPayment) => void;
  onRefresh: () => void;
}

export interface AdminPaymentDetailsModalProps {
  payment: AdminPayment | null;
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
}

export interface AdminPaymentFiltersProps {
  filters: AdminPaymentFilters;
  onFiltersChange: (filters: AdminPaymentFilters) => void;
  onClearFilters: () => void;
  loading: boolean;
}

export interface AdminPaymentStatusBadgeProps {
  status: "completed" | "pending" | "failed";
  size?: "sm" | "md" | "lg";
}

export interface AdminPaymentMethodIconProps {
  method: "cash" | "stripe";
  size?: "sm" | "md" | "lg";
}

export interface AdminPaymentStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}
