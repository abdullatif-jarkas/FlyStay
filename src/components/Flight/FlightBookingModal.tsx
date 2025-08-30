import React, { useState, useEffect } from "react";
import {
  FaPlane,
  FaTimes,
  FaSpinner,
  FaCreditCard,
  FaUser,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import axios from "axios";
import { usePayment } from "../../hooks/usePayment";
import {
  FlightBookingModalProps,
  FlightBookingConfirmation,
} from "../../types/payment";
import { formatPrice } from "../../types/flightCabin";

interface PassengerDetails {
  name: string;
  email: string;
  phone: string;
}

interface FlightBookingResponse {
  status: string;
  message: string;
  data: {
    id: number;
    user_id: number;
    flight_cabins_id: number;
    booking_date: string;
    seat_number: number;
    status: string;
  };
}

const FlightBookingModal: React.FC<FlightBookingModalProps> = ({
  isOpen,
  onClose,
  flight,
  flightCabin,
  onBookingSuccess,
}) => {
  const [passengerDetails, setPassengerDetails] = useState<PassengerDetails>({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Partial<PassengerDetails>>({});
  const [step, setStep] = useState<"details" | "payment" | "confirmation">(
    "details"
  );
  const [bookingConfirmation, setBookingConfirmation] =
    useState<FlightBookingConfirmation | null>(null);
  const [createdBookingId, setCreatedBookingId] = useState<number | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const {
    createPaymentIntent,
    handleStripePaymentSuccess,
    handleStripePaymentError,
    isLoading,
    hasError,
    error,
    clientSecret,
    resetPaymentState,
  } = usePayment();

  const STRIPE_PUBLISHABLE_KEY =
    import.meta.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_your_publishable_key_here";
  console.log("publish key", STRIPE_PUBLISHABLE_KEY);
  const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep("details");
      setPassengerDetails({ name: "", email: "", phone: "" });
      setErrors({});
      setBookingConfirmation(null);
      setCreatedBookingId(null);
      setBookingLoading(false);
      resetPaymentState();
    }
  }, [isOpen, resetPaymentState]);

  const validatePassengerDetails = (): boolean => {
    const newErrors: Partial<PassengerDetails> = {};

    if (!passengerDetails.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!passengerDetails.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(passengerDetails.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!passengerDetails.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(passengerDetails.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PassengerDetails, value: string) => {
    setPassengerDetails((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Create flight booking (Step 1)
  const createFlightBooking = async (): Promise<number | null> => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to make a booking");
      return null;
    }

    try {
      setBookingLoading(true);

      const formData = new FormData();
      formData.append("flight_cabins_id", flightCabin.id.toString());

      const response = await axios.post<FlightBookingResponse>(
        "http://127.0.0.1:8000/api/flight-bookings",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        const bookingId = response.data.data.id;
        setCreatedBookingId(bookingId);
        toast.success("Booking created successfully!");
        return bookingId;
      } else {
        toast.error(response.data.errors.flight_cabins_id[0] || "Failed to create booking");
        return null;
      }
    } catch (error: unknown) {
      console.error("Error creating flight booking:", error);
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      toast.error(errorMessage || "Failed to create booking");
      return null;
    } finally {
      setBookingLoading(false);
    }
  };

  const handleProceedToPayment = async () => {
    if (!validatePassengerDetails()) {
      return;
    }

    try {
      // Step 1: Create the flight booking
      const bookingId = await createFlightBooking();

      if (!bookingId) {
        return; // Error already handled in createFlightBooking
      }

      // Step 2: Create payment intent using the booking ID
      const secret = await createPaymentIntent(bookingId, flight.airline);

      if (secret) {
        setStep("payment");
      }
    } catch (error) {
      console.error("Error in booking process:", error);
    }
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
      // Use the created booking ID instead of flight cabin ID
      const bookingIdToUse = createdBookingId || flightCabin.id;

      const confirmation = await handleStripePaymentSuccess(
        paymentIntent,
        bookingIdToUse
      );
      if (confirmation) {
        setBookingConfirmation(confirmation);
        setStep("confirmation");
        onBookingSuccess?.(confirmation);
      }
    } catch (error) {
      console.error("Error handling payment success:", error);
    }
  };

  const handleClose = () => {
    setStep("details");
    setPassengerDetails({ name: "", email: "", phone: "" });
    setErrors({});
    setBookingConfirmation(null);
    setCreatedBookingId(null);
    setBookingLoading(false);
    resetPaymentState();
    onClose();
  };

  if (!isOpen || !flight || !flightCabin) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <FaPlane className="text-primary-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              {step === "details" && "Passenger Details"}
              {step === "payment" && "Payment"}
              {step === "confirmation" && "Booking Confirmed"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Flight Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Flight Details</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Flight:</span>
                <span className="ml-2 font-medium">
                  {flight.airline} {flight.flight_number}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Class:</span>
                <span className="ml-2 font-medium">
                  {flightCabin.class_name}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Route:</span>
                <span className="ml-2 font-medium">
                  {flight.departure_airport?.IATA_code} →{" "}
                  {flight.arrival_airport?.IATA_code}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Price:</span>
                <span className="ml-2 font-medium text-green-600">
                  {formatPrice(flightCabin.price)}
                </span>
              </div>
            </div>
          </div>

          {/* Step Content */}
          {step === "details" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Passenger Information
              </h3>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={passengerDetails.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={passengerDetails.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPhone className="inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={passengerDetails.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Error Display */}
              {hasError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceedToPayment}
                  disabled={isLoading || bookingLoading}
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  {(isLoading || bookingLoading) && (
                    <FaSpinner className="animate-spin mr-2" />
                  )}
                  <FaCreditCard className="mr-2" />
                  {bookingLoading
                    ? "Creating Booking..."
                    : "Proceed to Payment"}
                </button>
              </div>
            </div>
          )}

          {step === "payment" && clientSecret && (
            <Elements options={{ clientSecret }} stripe={stripePromise}>
              <StripeCheckoutForm onSuccess={handlePaymentSuccess} />
            </Elements>
          )}

          {step === "confirmation" && bookingConfirmation && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPlane className="text-2xl text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Booking Confirmed!
              </h3>
              <p className="text-gray-600 mb-4">
                Your flight has been successfully booked.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <h4 className="font-semibold mb-2">Booking Reference</h4>
                <p className="text-lg font-mono text-primary-600 mb-4">
                  {bookingConfirmation.booking_reference}
                </p>
                <p className="text-sm text-gray-600">
                  A confirmation email has been sent to {passengerDetails.email}
                </p>
              </div>

              <button
                onClick={handleClose}
                className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightBookingModal;

const StripeCheckoutForm = ({
  onSuccess,
}: {
  onSuccess: (paymentIntent: any) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required",
    });

    if (result.error) {
      toast.error(result.error.message || "Payment failed");
    } else if (result.paymentIntent?.status === "succeeded") {
      onSuccess(result.paymentIntent);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
      >
        {loading ? "Processing..." : "Pay now"}
      </button>
    </form>
  );
};
