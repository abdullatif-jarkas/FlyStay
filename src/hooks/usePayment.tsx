import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  createFlightPaymentIntent,
  confirmFlightPayment,
  getPaymentStatus,
  cancelPaymentIntent,
} from "../services/paymentService";
import {
  PaymentState,
  FlightBookingConfirmation,
} from "../types/payment";

export const usePayment = () => {
  const [paymentState, setPaymentState] = useState<PaymentState>({
    loading: false,
    clientSecret: null,
    error: null,
    success: false,
  });

  /**
   * Create payment intent for flight booking
   */
  const createPaymentIntent = useCallback(
    async (bookingId: number, airline: string): Promise<string | null> => {
      setPaymentState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        success: false,
      }));

      try {
        const clientSecret = await createFlightPaymentIntent(
          bookingId,
          airline
        );
        setPaymentState((prev) => ({
          ...prev,
          loading: false,
          clientSecret,
          error: null,
        }));

        toast.success("Payment intent created successfully!");
        return clientSecret;
      } catch (error: any) {
        const errorMessage = error.message || "Failed to create payment intent";

        setPaymentState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
          clientSecret: null,
        }));

        toast.error(errorMessage);
        return null;
      }
    },
    []
  );

  /**
   * Confirm payment after successful Stripe payment
   */
  const confirmPayment = useCallback(
    async (
      paymentIntentId: string,
      bookingId: number
    ): Promise<FlightBookingConfirmation | null> => {
      setPaymentState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const confirmation = await confirmFlightPayment(
          paymentIntentId,
          bookingId
        );

        setPaymentState((prev) => ({
          ...prev,
          loading: false,
          success: true,
          error: null,
        }));

        toast.success("Flight booking confirmed successfully!");
        return confirmation;
      } catch (error: any) {
        const errorMessage = error.message || "Failed to confirm payment";

        setPaymentState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));

        toast.error(errorMessage);
        return null;
      }
    },
    []
  );

  /**
   * Check payment status
   */
  const checkPaymentStatus = useCallback(
    async (
      paymentIntentId: string
    ): Promise<{
      status: string;
      amount: number;
      currency: string;
    } | null> => {
      try {
        const status = await getPaymentStatus(paymentIntentId);
        return status;
      } catch (error: any) {
        const errorMessage = error.message || "Failed to check payment status";
        toast.error(errorMessage);
        return null;
      }
    },
    []
  );

  /**
   * Cancel payment intent
   */
  const cancelPayment = useCallback(
    async (paymentIntentId: string): Promise<boolean> => {
      setPaymentState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const success = await cancelPaymentIntent(paymentIntentId);

        setPaymentState((prev) => ({
          ...prev,
          loading: false,
          error: success ? null : "Failed to cancel payment",
        }));

        if (success) {
          toast.info("Payment canceled successfully");
        } else {
          toast.error("Failed to cancel payment");
        }

        return success;
      } catch (error: any) {
        const errorMessage = error.message || "Failed to cancel payment";

        setPaymentState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));

        toast.error(errorMessage);
        return false;
      }
    },
    []
  );

  /**
   * Reset payment state
   */
  const resetPaymentState = useCallback(() => {
    setPaymentState({
      loading: false,
      clientSecret: null,
      error: null,
      success: false,
    });
  }, []);

  /**
   * Handle Stripe payment success
   */
  const handleStripePaymentSuccess = useCallback(
    async (
      paymentIntent: any,
      bookingId: number
    ): Promise<FlightBookingConfirmation | null> => {
      if (paymentIntent.status === "succeeded") {
        return await confirmPayment(paymentIntent.id, bookingId);
      } else {
        toast.error("Payment was not successful");
        return null;
      }
    },
    [confirmPayment]
  );

  /**
   * Handle Stripe payment error
   */
  const handleStripePaymentError = useCallback((error: any) => {
    const errorMessage = error.message || "Payment failed";

    setPaymentState((prev) => ({
      ...prev,
      loading: false,
      error: errorMessage,
    }));

    toast.error(errorMessage);
  }, []);

  return {
    paymentState,
    createPaymentIntent,
    confirmPayment,
    checkPaymentStatus,
    cancelPayment,
    resetPaymentState,
    handleStripePaymentSuccess,
    handleStripePaymentError,
    // Computed properties
    isLoading: paymentState.loading,
    hasError: !!paymentState.error,
    isSuccess: paymentState.success,
    clientSecret: paymentState.clientSecret,
    error: paymentState.error,
  };
};
