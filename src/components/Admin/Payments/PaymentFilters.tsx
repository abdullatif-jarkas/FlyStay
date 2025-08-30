import React from "react";
import { FaFilter, FaTimes, FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import { AdminPaymentFiltersProps } from "../../../types/payment";

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
    (value) => value !== "" && value !== undefined && value !== null
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
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status || ""}
            onChange={(e) => handleFilterChange("status", e.target.value)}
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
            value={filters.method || ""}
            onChange={(e) => handleFilterChange("method", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Methods</option>
            <option value="cash">Cash</option>
            <option value="stripe">Stripe</option>
          </select>
        </div>

        {/* Object Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Booking Type
          </label>
          <select
            value={filters.object_type || ""}
            onChange={(e) => handleFilterChange("object_type", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="FlightBooking">Flight Bookings</option>
            <option value="HotelBooking">Hotel Bookings</option>
          </select>
        </div>

        {/* Sort Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Sort Order
          </label>
          <select
            value={filters.sort_type || "desc"}
            onChange={(e) => handleFilterChange("sort_type", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {/* Exact Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exact Date
          </label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={filters.date || ""}
              onChange={(e) => handleFilterChange("date", e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* From Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={filters.from_date || ""}
              onChange={(e) => handleFilterChange("from_date", e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* To Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={filters.to_date || ""}
              onChange={(e) => handleFilterChange("to_date", e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Minimum Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Amount
          </label>
          <div className="relative">
            <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              placeholder="0"
              min="0"
              step="0.01"
              value={filters.amount || ""}
              onChange={(e) =>
                handleFilterChange(
                  "amount",
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFilters;
