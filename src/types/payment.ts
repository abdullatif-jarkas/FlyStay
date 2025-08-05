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
  status: 'confirmed' | 'pending' | 'failed';
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
export type PaymentMethod = 'stripe' | 'paypal' | 'bank_transfer';

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
  CONFIRM_PAYMENT: '/api/payments/confirm',
  GET_PAYMENT_STATUS: (paymentIntentId: string) => 
    `/api/payments/status/${paymentIntentId}`,
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  CANCELED: 'canceled',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

// Utility functions
export const formatPaymentAmount = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100); // Stripe amounts are in cents
};

export const getPaymentStatusColor = (status: PaymentStatus): string => {
  switch (status) {
    case PAYMENT_STATUS.SUCCEEDED:
      return 'text-green-600 bg-green-100';
    case PAYMENT_STATUS.PENDING:
    case PAYMENT_STATUS.PROCESSING:
      return 'text-yellow-600 bg-yellow-100';
    case PAYMENT_STATUS.FAILED:
    case PAYMENT_STATUS.CANCELED:
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getPaymentStatusText = (status: PaymentStatus): string => {
  switch (status) {
    case PAYMENT_STATUS.SUCCEEDED:
      return 'Payment Successful';
    case PAYMENT_STATUS.PENDING:
      return 'Payment Pending';
    case PAYMENT_STATUS.PROCESSING:
      return 'Processing Payment';
    case PAYMENT_STATUS.FAILED:
      return 'Payment Failed';
    case PAYMENT_STATUS.CANCELED:
      return 'Payment Canceled';
    default:
      return 'Unknown Status';
  }
};
