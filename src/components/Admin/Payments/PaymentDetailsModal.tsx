import React from 'react';
import {
  FaTimes,
  FaUser,
  FaCalendarAlt,
  FaDollarSign,
  FaReceipt,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaHotel,
  FaPlane,
} from 'react-icons/fa';
import { AdminPaymentDetailsModalProps } from '../../../types/payment';
import PaymentStatusBadge from './PaymentStatusBadge';
import PaymentMethodIcon from './PaymentMethodIcon';

const PaymentDetailsModal: React.FC<AdminPaymentDetailsModalProps> = ({
  payment,
  isOpen,
  onClose,
  loading,
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  const formatAmount = (amount: number) => {
    return `$${amount}`;
  };

  const getBookingTypeIcon = (type: string) => {
    if (type.includes('Hotel')) return <FaHotel className="text-blue-600" />;
    if (type.includes('Flight')) return <FaPlane className="text-green-600" />;
    return <FaReceipt className="text-gray-600" />;
  };

  const getBookingTypeName = (type: string) => {
    if (type.includes('Hotel')) return 'Hotel Booking';
    if (type.includes('Flight')) return 'Flight Booking';
    return 'Booking';
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <FaSpinner className="animate-spin text-4xl text-primary-600 mb-4" />
              <p className="text-gray-600 ml-4">Loading payment details...</p>
            </div>
          ) : payment[0] ? (
            <div className="space-y-6">
              {/* Payment Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FaReceipt className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Payment ID</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">#{payment[0].id}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FaDollarSign className="text-green-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Amount</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{formatAmount(payment[0].amount)}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <PaymentMethodIcon method={payment[0].method} size="sm" />
                    <span className="text-sm font-medium text-gray-600 ml-2">Method</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{payment[0].method}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Status</span>
                  </div>
                  <PaymentStatusBadge status={payment[0].status} size="lg" />
                </div>
              </div>

              {/* User Information */}
              {payment[0].user && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaUser className="mr-2 text-blue-600" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                      <p className="text-gray-900">{payment[0].user.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                      <p className="text-gray-900">{payment[0].user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Booking Information */}
              {payment[0].payable && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    {getBookingTypeIcon(payment[0].payable_type)}
                    <span className="ml-2">{getBookingTypeName(payment[0].payable_type)} Information</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Booking ID</label>
                      <p className="text-gray-900">#{payment[0].payable_id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Booking Date</label>
                      <p className="text-gray-900">
                        {formatDate('booking_date' in payment[0].payable ?? payment[0].payable.booking_date )}
                      </p>
                    </div>
                  </div>

                  {/* Additional booking details based on type */}
                  {payment[0].payable_type.includes('Hotel') && 'check_in_date' in payment[0].payable && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Check-in Date</label>
                        <p className="text-gray-900">{formatDate(payment[0].payable.check_in_date)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Check-out Date</label>
                        <p className="text-gray-900">{formatDate(payment[0].payable.check_out_date)}</p>
                      </div>
                    </div>
                  )}

                  {payment[0].payable_type.includes('Flight') && 'seat_number' in payment[0].payable && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Seat Number</label>
                        <p className="text-gray-900">{payment[0].payable.seat_number}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Flight Cabin ID</label>
                        <p className="text-gray-900">#{payment[0].payable.flight_cabins_id}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Payment Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FaReceipt className="mr-2 text-purple-600" />
                  Payment Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {payment[0].transaction_id && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Transaction ID</label>
                      <p className="text-gray-900 font-mono text-sm">{payment[0].transaction_id}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Verification Status</label>
                    <div className="flex items-center">
                      {payment[0].verified ? (
                        <>
                          <FaCheckCircle className="text-green-600 mr-2" />
                          <span className="text-green-600 font-medium">Verified</span>
                        </>
                      ) : (
                        <>
                          <FaTimesCircle className="text-red-600 mr-2" />
                          <span className="text-red-600 font-medium">Unverified</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {payment[0].verified && payment[0].verifier && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Verified By</label>
                    <p className="text-gray-900">{payment[0].verifier.name} ({payment[0].verifier.email})</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No payment details available.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;
