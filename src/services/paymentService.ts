// Payment service for handling Stripe payment intents and flight bookings
import axios from "axios";
import {
  PaymentIntentRequest,
  PaymentIntentResponse,
  PaymentError,
  FlightBookingConfirmation,
  PAYMENT_ENDPOINTS,
} from "../types/payment";

const BASE_URL = "http://127.0.0.1:8000";

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

// Create axios instance with default config
const paymentApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

// Add auth interceptor
paymentApi.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Create a payment intent for flight booking
 * @param bookingId - The ID of the flight booking to process payment for
 * @param airline - The airline name (note: API expects "airline" not "ariline")
 * @returns Promise with payment intent client secret
 */
export const createFlightPaymentIntent = async (
  bookingId: number,
  airline: string
): Promise<string> => {
  try {
    const requestData: PaymentIntentRequest = {
      airline: airline,
    };

    const response = await paymentApi.post<PaymentIntentResponse>(
      PAYMENT_ENDPOINTS.CREATE_FLIGHT_PAYMENT_INTENT(bookingId),
      requestData
    );

    if (response.data.status === "success" && response.data.data.length > 0) {
      return response.data.data[0]; // Return the client secret
    } else {
      throw new Error(
        response.data.message || "Failed to create payment intent"
      );
    }
  } catch (error: any) {
    console.error("Error creating flight payment intent:", error);

    if (error.response?.data) {
      const errorData: PaymentError = error.response.data;
      throw new Error(errorData.message || "Payment intent creation failed");
    }

    throw new Error("Network error occurred while creating payment intent");
  }
};

/**
 * Confirm payment after successful Stripe payment
 * @param paymentIntentId - The Stripe payment intent ID
 * @param bookingId - The flight booking ID
 * @returns Promise with booking confirmation
 */
export const confirmFlightPayment = async (
  paymentIntentId: string,
  bookingId: number
): Promise<FlightBookingConfirmation> => {
  try {
    const response = await paymentApi.post<{
      status: string;
      message: string;
      data: FlightBookingConfirmation;
    }>(PAYMENT_ENDPOINTS.CONFIRM_PAYMENT(bookingId), {
      payment_intent_id: paymentIntentId,
      booking_id: bookingId,
    });

    if (response.data.status === "success") {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to confirm payment");
    }
  } catch (error: any) {
    console.error("Error confirming flight payment:", error);

    if (error.response?.data) {
      const errorData: PaymentError = error.response.data;
      throw new Error(errorData.message || "Payment confirmation failed");
    }

    throw new Error("Network error occurred while confirming payment");
  }
};

/**
 * Get payment status
 * @param paymentIntentId - The Stripe payment intent ID
 * @returns Promise with payment status
 */
export const getPaymentStatus = async (
  paymentIntentId: string
): Promise<{
  status: string;
  amount: number;
  currency: string;
}> => {
  try {
    const response = await paymentApi.get<{
      status: string;
      message: string;
      data: {
        status: string;
        amount: number;
        currency: string;
      };
    }>(PAYMENT_ENDPOINTS.GET_PAYMENT_STATUS(paymentIntentId));

    if (response.data.status === "success") {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to get payment status");
    }
  } catch (error: any) {
    console.error("Error getting payment status:", error);

    if (error.response?.data) {
      const errorData: PaymentError = error.response.data;
      throw new Error(errorData.message || "Failed to get payment status");
    }

    throw new Error("Network error occurred while getting payment status");
  }
};

/**
 * Cancel payment intent
 * @param paymentIntentId - The Stripe payment intent ID
 * @returns Promise with cancellation result
 */
export const cancelPaymentIntent = async (
  paymentIntentId: string
): Promise<boolean> => {
  try {
    const response = await paymentApi.post<{
      status: string;
      message: string;
    }>(`/api/payments/cancel/${paymentIntentId}`);

    return response.data.status === "success";
  } catch (error: any) {
    console.error("Error canceling payment intent:", error);
    return false;
  }
};

/**
 * Get user's flight bookings
 * @returns Promise with user's bookings
 */
export const getUserFlightBookings = async (): Promise<
  FlightBookingConfirmation[]
> => {
  try {
    const response = await paymentApi.get<{
      status: string;
      message: string;
      data: FlightBookingConfirmation[];
    }>("/api/bookings/flights");

    if (response.data.status === "success") {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to get bookings");
    }
  } catch (error: any) {
    console.error("Error getting user flight bookings:", error);

    if (error.response?.data) {
      const errorData: PaymentError = error.response.data;
      throw new Error(errorData.message || "Failed to get bookings");
    }

    throw new Error("Network error occurred while getting bookings");
  }
};

// Export all payment service functions
export default {
  createFlightPaymentIntent,
  confirmFlightPayment,
  getPaymentStatus,
  cancelPaymentIntent,
  getUserFlightBookings,
};
