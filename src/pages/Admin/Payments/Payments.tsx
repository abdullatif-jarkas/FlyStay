import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import {
  FaDollarSign,
  FaReceipt,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaCreditCard,
  FaShieldAlt,
  FaDownload,
  FaSync,
} from 'react-icons/fa';
import {
  AdminPayment,
  AdminPaymentResponse,
  AdminPaymentDetailsResponse,
  AdminPaymentFilters,
  AdminPaymentStats,
} from '../../../types/payment';
import PaymentsList from '../../../components/Admin/Payments/PaymentsList';
import PaymentDetailsModal from '../../../components/Admin/Payments/PaymentDetailsModal';
import PaymentFilters from '../../../components/Admin/Payments/PaymentFilters';
import PaymentStatsCard from '../../../components/Admin/Payments/PaymentStatsCard';

const Payments: React.FC = () => {
  // State
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<AdminPayment | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState<AdminPaymentFilters>({});
  const [stats, setStats] = useState<AdminPaymentStats>({
    total_payments: 0,
    total_amount: 0,
    completed_payments: 0,
    pending_payments: 0,
    failed_payments: 0,
    cash_payments: 0,
    stripe_payments: 0,
    verified_payments: 0,
    unverified_payments: 0,
  });

  const token = localStorage.getItem('token');

  // Fetch payments
  const fetchPayments = useCallback(async (page: number = 1, currentFilters: AdminPaymentFilters = {}) => {
    if (!token) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
      });

      // Add filters to query params
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== '' && value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await axios.get<AdminPaymentResponse>(
        `http://127.0.0.1:8000/api/payments?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      if (response.data.status === 'success') {
        setPayments(response.data.data);
        if (response.data.pagination) {
          setCurrentPage(response.data.pagination.current_page);
          setTotalPages(response.data.pagination.total_pages);
          setTotalResults(response.data.pagination.total);
        }
        
        // Calculate stats from current data
        calculateStats(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch payments');
      }
    } catch (err: unknown) {
      console.error('Error fetching payments:', err);
      const errorMessage =
        err instanceof Error && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(errorMessage || 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Calculate statistics
  const calculateStats = (paymentsData: AdminPayment[]) => {
    const newStats: AdminPaymentStats = {
      total_payments: paymentsData.length,
      total_amount: paymentsData.reduce((sum, payment) => sum + payment.amount, 0),
      completed_payments: paymentsData.filter(p => p.status === 'completed').length,
      pending_payments: paymentsData.filter(p => p.status === 'pending').length,
      failed_payments: paymentsData.filter(p => p.status === 'failed').length,
      cash_payments: paymentsData.filter(p => p.method === 'cash').length,
      stripe_payments: paymentsData.filter(p => p.method === 'stripe').length,
      verified_payments: paymentsData.filter(p => p.verified).length,
      unverified_payments: paymentsData.filter(p => !p.verified).length,
    };
    setStats(newStats);
  };

  // Fetch payment details
  const fetchPaymentDetails = async (paymentId: number) => {
    if (!token) return;

    try {
      setDetailsLoading(true);
      const response = await axios.get<AdminPaymentDetailsResponse>(
        `http://127.0.0.1:8000/api/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      if (response.data.status === 'success') {
        setSelectedPayment(response.data.data);
      } else {
        toast.error(response.data.message || 'Failed to fetch payment details');
      }
    } catch (err: unknown) {
      console.error('Error fetching payment details:', err);
      toast.error('Failed to fetch payment details');
    } finally {
      setDetailsLoading(false);
    }
  };

  // Handle payment selection
  const handlePaymentSelect = (payment: AdminPayment) => {
    setSelectedPayment(payment);
    setDetailsModalOpen(true);
    fetchPaymentDetails(payment.id);
  };

  // Handle filters change
  const handleFiltersChange = (newFilters: AdminPaymentFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    fetchPayments(1, newFilters);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    const emptyFilters: AdminPaymentFilters = {};
    setFilters(emptyFilters);
    setCurrentPage(1);
    fetchPayments(1, emptyFilters);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchPayments(page, filters);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchPayments(currentPage, filters);
  };

  // Export payments (placeholder)
  const handleExport = () => {
    toast.info('Export functionality will be implemented soon');
  };

  // Load initial data
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage all payment transactions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <FaDownload className="mr-2" />
            Export
          </button>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            <FaSync className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PaymentStatsCard
          title="Total Payments"
          value={stats.total_payments}
          icon={<FaReceipt />}
          color="text-blue-600"
          loading={loading}
        />
        <PaymentStatsCard
          title="Total Amount"
          value={stats.total_amount}
          icon={<FaDollarSign />}
          color="text-green-600"
          loading={loading}
        />
        <PaymentStatsCard
          title="Completed"
          value={stats.completed_payments}
          icon={<FaCheckCircle />}
          color="text-green-600"
          loading={loading}
        />
        <PaymentStatsCard
          title="Pending"
          value={stats.pending_payments}
          icon={<FaClock />}
          color="text-yellow-600"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PaymentStatsCard
          title="Failed"
          value={stats.failed_payments}
          icon={<FaExclamationTriangle />}
          color="text-red-600"
          loading={loading}
        />
        <PaymentStatsCard
          title="Cash Payments"
          value={stats.cash_payments}
          icon={<FaMoneyBillWave />}
          color="text-green-600"
          loading={loading}
        />
        <PaymentStatsCard
          title="Stripe Payments"
          value={stats.stripe_payments}
          icon={<FaCreditCard />}
          color="text-blue-600"
          loading={loading}
        />
        <PaymentStatsCard
          title="Verified"
          value={stats.verified_payments}
          icon={<FaShieldAlt />}
          color="text-green-600"
          loading={loading}
        />
      </div>

      {/* Filters */}
      <PaymentFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        loading={loading}
      />

      {/* Payments List */}
      <PaymentsList
        payments={payments}
        loading={loading}
        error={error}
        onPaymentSelect={handlePaymentSelect}
        onRefresh={handleRefresh}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <p className="text-sm text-gray-700">
              Showing page <span className="font-medium">{currentPage}</span> of{' '}
              <span className="font-medium">{totalPages}</span> ({totalResults} total results)
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || loading}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || loading}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      <PaymentDetailsModal
        payment={selectedPayment}
        isOpen={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedPayment(null);
        }}
        loading={detailsLoading}
      />
    </div>
  );
};

export default Payments;
