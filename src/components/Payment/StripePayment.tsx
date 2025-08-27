import React, { useState, useEffect } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { stripePromise, stripeConfig } from "../../config/stripe";
import { toast } from "sonner";
import {
  FaSpinner,
  FaCreditCard,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowLeft,
} from "react-icons/fa";

interface StripePaymentProps {
  clientSecret: string;
  bookingId: number;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
  onError: (error: string) => void;
}

interface PaymentFormProps {
  bookingId: number;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
  onError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  bookingId,
  amount,
  onSuccess,
  onCancel,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage("");

    const { error } = await stripe.confirmPayment({
      elements,
      // confirmParams: {
      //   return_url: `${window.location.origin}/profile?section=bookings&payment=success&booking=${bookingId}`,
      // },
      redirect: "if_required",
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "An error occurred during payment");
        onError(error.message || "Payment failed");
      } else {
        setMessage("An unexpected error occurred");
        onError("An unexpected error occurred");
      }
      toast.error(error.message || "Payment failed");
    } else {
      // Payment succeeded
      toast.success("Payment completed successfully!");
      onSuccess();
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onCancel}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Bookings
          </button>
          <div className="flex items-center text-green-600">
            <FaCreditCard className="mr-2" />
            <span className="font-medium">Secure Payment</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Complete Payment
        </h2>
        <p className="text-gray-600">
          Complete your hotel booking payment securely with Stripe
        </p>
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Payment Summary</h3>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Booking #{bookingId}</span>
          <span className="text-xl font-bold text-green-600">
            {formatCurrency(amount)}
          </span>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 border border-gray-200 rounded-lg">
          <PaymentElement
            options={{
              layout: "tabs",
            }}
          />
        </div>

        {message && (
          <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
            <FaExclamationTriangle className="text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{message}</span>
          </div>
        )}

        <div className="space-y-3">
          <button
            type="submit"
            disabled={isLoading || !stripe || !elements}
            className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Processing Payment...
              </>
            ) : (
              <>
                <FaCreditCard className="mr-2" />
                Pay {formatCurrency(amount)}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Security Notice */}
      <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
        <FaCheckCircle className="mr-2 text-green-500" />
        <span>Secured by Stripe • Your payment information is encrypted</span>
      </div>
    </div>
  );
};

const StripePayment: React.FC<StripePaymentProps> = ({
  clientSecret,
  bookingId,
  amount,
  onSuccess,
  onCancel,
  onError,
}) => {
  const [stripeLoading, setStripeLoading] = useState(true);

  useEffect(() => {
    if (clientSecret) {
      setStripeLoading(false);
    }
  }, [clientSecret]);

  if (stripeLoading) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <FaSpinner className="text-4xl text-primary-500 animate-spin mb-4 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Initializing Payment
          </h2>
          <p className="text-gray-600">
            Please wait while we prepare your secure payment...
          </p>
        </div>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: stripeConfig.appearance,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm
        bookingId={bookingId}
        amount={amount}
        onSuccess={onSuccess}
        onCancel={onCancel}
        onError={onError}
      />
    </Elements>
  );
};

export default StripePayment;
