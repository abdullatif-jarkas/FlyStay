import React from 'react';
import { FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { AdminPaymentStatusBadgeProps } from '../../../types/payment';

const PaymentStatusBadge: React.FC<AdminPaymentStatusBadgeProps> = ({ 
  status, 
  size = 'md' 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return {
          icon: FaCheckCircle,
          color: 'text-green-600 bg-green-100 border-green-200',
          text: 'Completed',
        };
      case 'pending':
        return {
          icon: FaClock,
          color: 'text-yellow-600 bg-yellow-100 border-yellow-200',
          text: 'Pending',
        };
      case 'failed':
        return {
          icon: FaExclamationTriangle,
          color: 'text-red-600 bg-red-100 border-red-200',
          text: 'Failed',
        };
      default:
        return {
          icon: FaClock,
          color: 'text-gray-600 bg-gray-100 border-gray-200',
          text: status,
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  const sizeClasses = getSizeClasses();

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${config.color} ${sizeClasses}`}
    >
      <Icon className={`mr-1 ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'}`} />
      {config.text}
    </span>
  );
};

export default PaymentStatusBadge;
