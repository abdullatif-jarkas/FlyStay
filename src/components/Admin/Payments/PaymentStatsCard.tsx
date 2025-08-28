import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import { AdminPaymentStatsCardProps } from '../../../types/payment';

const PaymentStatsCard: React.FC<AdminPaymentStatsCardProps> = ({
  title,
  value,
  icon,
  color,
  loading = false,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-center">
            {loading ? (
              <FaSpinner className="animate-spin text-gray-400 text-2xl" />
            ) : (
              <p className={`text-2xl font-bold ${color}`}>
                {typeof value === 'number' && title.toLowerCase().includes('amount')
                  ? `$${value.toLocaleString()}`
                  : value.toLocaleString()}
              </p>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          {React.cloneElement(icon as React.ReactElement, {
            className: `text-xl ${color}`,
          })}
        </div>
      </div>
    </div>
  );
};

export default PaymentStatsCard;
