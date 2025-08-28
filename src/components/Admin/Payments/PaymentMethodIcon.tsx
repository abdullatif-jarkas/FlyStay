import React from 'react';
import { FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';
import { AdminPaymentMethodIconProps } from '../../../types/payment';

const PaymentMethodIcon: React.FC<AdminPaymentMethodIconProps> = ({ 
  method, 
  size = 'md' 
}) => {
  const getMethodConfig = () => {
    switch (method) {
      case 'cash':
        return {
          icon: FaMoneyBillWave,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          text: 'Cash',
        };
      case 'stripe':
        return {
          icon: FaCreditCard,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          text: 'Stripe',
        };
      default:
        return {
          icon: FaCreditCard,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          text: method,
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'w-6 h-6',
          icon: 'text-xs',
        };
      case 'lg':
        return {
          container: 'w-10 h-10',
          icon: 'text-lg',
        };
      default:
        return {
          container: 'w-8 h-8',
          icon: 'text-sm',
        };
    }
  };

  const config = getMethodConfig();
  const Icon = config.icon;
  const sizeClasses = getSizeClasses();

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full ${config.bgColor} ${sizeClasses.container}`}
      title={config.text}
    >
      <Icon className={`${config.color} ${sizeClasses.icon}`} />
    </div>
  );
};

export default PaymentMethodIcon;
