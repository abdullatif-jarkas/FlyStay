import React from 'react';
import {
  FaFilter,
  FaTimes,
  FaSearch,
  FaCalendarAlt,
  FaDollarSign,
} from 'react-icons/fa';
import { AdminPaymentFiltersProps } from '../../../types/payment';

const PaymentFilters: React.FC<AdminPaymentFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  loading,
}) => {
  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== '' && value !== undefined && value !== null
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FaFilter className="text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            disabled={loading}
            className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            <FaTimes className="mr-1" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Transaction ID, User..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Method Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method
          </label>
          <select
            value={filters.method || ''}
            onChange={(e) => handleFilterChange('method', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Methods</option>
            <option value="cash">Cash</option>
            <option value="stripe">Stripe</option>
          </select>
        </div>

        {/* Verification Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Verification
          </label>
          <select
            value={filters.verified === true ? 'true' : filters.verified === false ? 'false' : ''}
            onChange={(e) => 
              handleFilterChange('verified', e.target.value === '' ? '' : e.target.value === 'true')
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
        </div>

        {/* Date From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date From
          </label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={filters.date_from || ''}
              onChange={(e) => handleFilterChange('date_from', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Date To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date To
          </label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={filters.date_to || ''}
              onChange={(e) => handleFilterChange('date_to', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Amount Min */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Amount
          </label>
          <div className="relative">
            <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              placeholder="0"
              min="0"
              step="0.01"
              value={filters.amount_min || ''}
              onChange={(e) => handleFilterChange('amount_min', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Amount Max */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Amount
          </label>
          <div className="relative">
            <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              placeholder="1000"
              min="0"
              step="0.01"
              value={filters.amount_max || ''}
              onChange={(e) => handleFilterChange('amount_max', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFilters;
