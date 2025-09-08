import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise, stripeConfig } from "../../config/stripe";
import { FaSpinner } from "react-icons/fa";
import { StripePaymentProps } from "../../types/stripe";
import { PaymentForm } from "./PaymentForm";

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
