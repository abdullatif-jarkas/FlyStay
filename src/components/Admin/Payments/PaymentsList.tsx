import React from 'react';
import {
  FaEye,
  FaSpinner,
  FaExclamationTriangle,
  FaSync,
  FaUser,
  FaCalendarAlt,
  FaReceipt,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';
import { AdminPaymentListProps } from '../../../types/payment';
import PaymentStatusBadge from './PaymentStatusBadge';
import PaymentMethodIcon from './PaymentMethodIcon';

const PaymentsList: React.FC<AdminPaymentListProps> = ({
  payments,
  loading,
  error,
  onPaymentSelect,
  onRefresh,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const getBookingTypeName = (type: string) => {
    if (type.includes('Hotel')) return 'Hotel';
    if (type.includes('Flight')) return 'Flight';
    return 'Booking';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-12 text-center">
          <FaSpinner className="animate-spin text-4xl text-primary-600 mb-4 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Payments</h3>
          <p className="text-gray-600">Please wait while we fetch the payment data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-12 text-center">
          <FaExclamationTriangle className="text-4xl text-red-500 mb-4 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Payments</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onRefresh}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FaSync className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-12 text-center">
          <FaReceipt className="text-4xl text-gray-400 mb-4 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payments Found</h3>
          <p className="text-gray-600">No payments match your current filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verified
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaReceipt className="text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">#{payment.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaUser className="text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {payment.user?.name || 'Unknown'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.user?.email || 'No email'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {getBookingTypeName(payment.payable_type)} #{payment.payable_id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatAmount(payment.amount)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <PaymentMethodIcon method={payment.method} size="sm" />
                    <span className="ml-2 text-sm text-gray-900 capitalize">
                      {payment.method}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PaymentStatusBadge status={payment.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {payment.verified_by ? (
                      <FaCheckCircle className="text-green-600" />
                    ) : (
                      <FaTimesCircle className="text-red-600" />
                    )}
                    <span className={`ml-2 text-sm ${payment.verified_by ? 'text-green-600' : 'text-red-600'}`}>
                      {payment.verified_by ? 'Yes' : 'No'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">
                      {formatDate(payment.date)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onPaymentSelect(payment)}
                    className="inline-flex items-center px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    <FaEye className="mr-1" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        <div className="divide-y divide-gray-200">
          {payments.map((payment) => (
            <div key={payment.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <FaReceipt className="text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-900">#{payment.id}</span>
                </div>
                <PaymentStatusBadge status={payment.status} size="sm" />
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Customer:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {payment.user?.name || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatAmount(payment.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Method:</span>
                  <div className="flex items-center">
                    <PaymentMethodIcon method={payment.method} size="sm" />
                    <span className="ml-2 text-sm text-gray-900 capitalize">
                      {payment.method}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Verified:</span>
                  <div className="flex items-center">
                    {payment.verified_by ? (
                      <FaCheckCircle className="text-green-600" />
                    ) : (
                      <FaTimesCircle className="text-red-600" />
                    )}
                    <span className={`ml-1 text-sm ${payment.verified_by ? 'text-green-600' : 'text-red-600'}`}>
                      {payment.verified_by ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Date:</span>
                  <span className="text-sm text-gray-900">
                    {formatDate(payment.date)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onPaymentSelect(payment)}
                className="w-full inline-flex items-center justify-center px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                <FaEye className="mr-2" />
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentsList;
