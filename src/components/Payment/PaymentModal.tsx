import React from 'react';
import { FaTimes } from 'react-icons/fa';
import StripePayment from './StripePayment';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientSecret: string;
  bookingId: number;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  clientSecret,
  bookingId,
  amount,
  onSuccess,
  onError,
}) => {
  if (!isOpen) return null;

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleError = (error: string) => {
    onError(error);
    // Don't close modal on error, let user try again
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 transition-opacity" />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>

          {/* Payment Component */}
          <div className="p-6">
            <StripePayment
              clientSecret={clientSecret}
              bookingId={bookingId}
              amount={amount}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
              onError={handleError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
