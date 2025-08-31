import React, { useState, useEffect } from "react";
import {
  FaPlane,
  FaSearch,
  FaFilter,
  FaEye,
  FaTimes,
  FaTrash,
  FaSpinner,
  FaCalendarAlt,
  FaUser,
  FaTicketAlt,
  FaPlaneDeparture,
} from "react-icons/fa";
import { toast } from "sonner";
import axios from "axios";
import {
  FlightBookingAdmin,
  FlightBookingsResponse,
  FlightBookingDetailsResponse,
  BookingActionResponse,
  BookingFilters,
} from "../../types/adminBookings";

const FlightBookings: React.FC = () => {
  const [bookings, setBookings] = useState<FlightBookingAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedBooking, setSelectedBooking] =
    useState<FlightBookingAdmin | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "cancel" | "delete";
    id: number;
    title: string;
    message: string;
  } | null>(null);

  // Pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<BookingFilters>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch flight bookings
  const fetchFlightBookings = async (
    page = 1,
    searchFilters: BookingFilters = {}
  ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to access this page");
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        ...searchFilters,
      });

      const response = await axios.get<FlightBookingsResponse>(
        `http://127.0.0.1:8000/api/flight-bookings?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      if (response.data.status === "success") {
        setBookings(response.data.data);
        if (response.data.meta) {
          setCurrentPage(response.data.meta.current_page);
          setTotalPages(response.data.meta.last_page);
        }
      } else {
        toast.error(response.data.message || "Failed to fetch flight bookings");
      }
    } catch (error: any) {
      console.error("Error fetching flight bookings:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch flight bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch booking details
  const fetchBookingDetails = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get<FlightBookingDetailsResponse>(
        `http://127.0.0.1:8000/api/flight-bookings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      if (response.data.status === "success") {
        setSelectedBooking(response.data.data[0]);
        setShowDetailsModal(true);
      } else {
        toast.error(response.data.message || "Failed to fetch booking details");
      }
    } catch (error: any) {
      console.error("Error fetching booking details:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch booking details"
      );
    }
  };

  // Cancel booking
  const cancelBooking = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setActionLoading(id);
      const response = await axios.post<BookingActionResponse>(
        `http://127.0.0.1:8000/api/flight-bookings/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Flight booking cancelled successfully");
        fetchFlightBookings(currentPage, filters);
      } else {
        toast.error(response.data.message || "Failed to cancel booking");
      }
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    } finally {
      setActionLoading(null);
      setShowConfirmModal(false);
      setConfirmAction(null);
    }
  };

  // Delete booking
  const deleteBooking = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setActionLoading(id);
      const response = await axios.delete<BookingActionResponse>(
        `http://127.0.0.1:8000/api/flight-bookings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Flight booking deleted successfully");
        fetchFlightBookings(currentPage, filters);
      } else {
        toast.error(response.data.message || "Failed to delete booking");
      }
    } catch (error: any) {
      console.error("Error deleting booking:", error);
      toast.error(error.response?.data?.message || "Failed to delete booking");
    } finally {
      setActionLoading(null);
      setShowConfirmModal(false);
      setConfirmAction(null);
    }
  };

  // Handle search
  const handleSearch = () => {
    const searchFilters = {
      ...filters,
      search: searchTerm,
    };
    setFilters(searchFilters);
    fetchFlightBookings(1, searchFilters);
  };

  // Handle filter change
  const handleFilterChange = (key: keyof BookingFilters, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value || undefined,
    };
    setFilters(newFilters);
    fetchFlightBookings(1, newFilters);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchFlightBookings(page, filters);
  };

  // Handle action confirmation
  const handleActionConfirm = () => {
    if (!confirmAction) return;

    if (confirmAction.type === "cancel") {
      cancelBooking(confirmAction.id);
    } else if (confirmAction.type === "delete") {
      deleteBooking(confirmAction.id);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Confirmed",
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending",
      },
      cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" },
      failed: { bg: "bg-gray-100", text: "text-gray-800", label: "Failed" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.failed;

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  useEffect(() => {
    fetchFlightBookings();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FaPlane className="text-2xl text-primary-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Flight Bookings</h1>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status || ""}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="failed">Failed</option>
          </select>

          {/* Date From */}
          <input
            type="date"
            value={filters.date_from || ""}
            onChange={(e) => handleFilterChange("date_from", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          {/* Date To */}
          <input
            type="date"
            value={filters.date_to || ""}
            onChange={(e) => handleFilterChange("date_to", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center"
          >
            <FaSearch className="mr-2" />
            Search
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="animate-spin text-2xl text-primary-600 mr-3" />
            <span className="text-gray-600">Loading flight bookings...</span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <FaTicketAlt className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No flight bookings found
            </h3>
            <p className="text-gray-600">
              No flight bookings match your current filters.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Flight Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          FL{booking.id.toString().padStart(6, "0")}
                        </div>
                        <div className="text-sm text-gray-500">
                          Seat: {booking.seat_number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaUser className="text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.user_name || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.user_email || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.flight?.airline || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          Flight{" "}
                          {booking.flight?.flight_number || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.flight_cabin?.class_name || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.departure_airport?.IATA_code || "N/A"}{" "}
                          →{" "}
                          {booking.arrival_airport?.IATA_code || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.departure_airport?.city_name || "N/A"}{" "}
                          →{" "}
                          {booking.arrival_airport?.city_name || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.flight?.departure_time
                            ? formatDate(
                                booking.flight.departure_time
                              )
                            : "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.flight?.departure_time
                            ? formatTime(
                                booking.flight.departure_time
                              )
                            : "N/A"}{" "}
                          -{" "}
                          {booking.flight?.arrival_time
                            ? formatTime(
                                booking.flight.arrival_time
                              )
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => fetchBookingDetails(booking.id)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          {booking.status !== "cancelled" && (
                            <button
                              onClick={() => {
                                setConfirmAction({
                                  type: "cancel",
                                  id: booking.id,
                                  title: "Cancel Booking",
                                  message: `Are you sure you want to cancel booking FL${booking.id
                                    .toString()
                                    .padStart(6, "0")}?`
                                    ,
                                });
                                setShowConfirmModal(true);
                              }}
                              disabled={actionLoading === booking.id}
                              className="text-yellow-600 hover:text-yellow-900 transition-colors disabled:opacity-50"
                              title="Cancel Booking"
                            >
                              {actionLoading === booking.id ? (
                                <FaSpinner className="animate-spin" />
                              ) : (
                                <FaTimes />
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setConfirmAction({
                                type: "delete",
                                id: booking.id,
                                title: "Delete Booking",
                                message: `Are you sure you want to permanently delete booking FL${booking.id
                                  .toString()
                                  .padStart(
                                    6,
                                    "0"
                                  )}? This action cannot be undone.`,
                              });
                              setShowConfirmModal(true);
                            }}
                            disabled={actionLoading === booking.id}
                            className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                            title="Delete Booking"
                          >
                            {actionLoading === booking.id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaTrash />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Page <span className="font-medium">{currentPage}</span> of{" "}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const page = i + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === page
                                  ? "z-10 bg-primary-50 border-primary-500 text-primary-600"
                                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        }
                      )}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Flight Booking Details - FL
                {selectedBooking.id.toString().padStart(6, "0")}
              </h2>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedBooking(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaUser className="mr-2" />
                    Customer Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">Name:</span>
                      <span className="ml-2 text-gray-900">
                        {selectedBooking.user_name || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <span className="ml-2 text-gray-900">
                        {selectedBooking.user_email || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        User ID:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {selectedBooking.user_id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Flight Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaPlane className="mr-2" />
                    Flight Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">
                        Airline:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {selectedBooking.flight?.airline || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Flight Number:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {selectedBooking.flight?.flight_number ||
                          "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Class:</span>
                      <span className="ml-2 text-gray-900">
                        {selectedBooking.flight_cabin?.class_name || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Seat Number:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {selectedBooking.seat_number}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Price:</span>
                      <span className="ml-2 text-green-600 font-bold">
                        ${selectedBooking.flight_cabin?.price || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Route Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaPlaneDeparture className="mr-2" />
                    Route Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">From:</span>
                      <span className="ml-2 text-gray-900">
                        {selectedBooking.departure_airport?.name || "N/A"}{" "}
                        (
                        {selectedBooking.departure_airport?.IATA_code || "N/A"}
                        )
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">To:</span>
                      <span className="ml-2 text-gray-900">
                        {selectedBooking.arrival_airport?.name || "N/A"}{" "}
                        (
                        {selectedBooking.arrival_airport?.IATA_code || "N/A"}
                        )
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Departure:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {selectedBooking.flight?.departure_time
                          ? new Date(
                              selectedBooking.flight.departure_time
                            ).toLocaleString()
                          : "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Arrival:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {selectedBooking.flight?.arrival_time
                          ? new Date(
                              selectedBooking.flight.arrival_time
                            ).toLocaleString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    Booking Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">
                        Booking Date:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {formatDate(selectedBooking.booking_date)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className="ml-2">
                        {getStatusBadge(selectedBooking.status)}
                      </span>
                    </div>
                    {/* <div>
                      <span className="font-medium text-gray-700">
                        Created:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {new Date(selectedBooking.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Updated:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {new Date(selectedBooking.updated_at).toLocaleString()}
                      </span>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <FaTimes className="text-red-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {confirmAction.title}
                  </h3>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600">{confirmAction.message}</p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setConfirmAction(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleActionConfirm}
                  disabled={actionLoading !== null}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
                >
                  {actionLoading !== null && (
                    <FaSpinner className="animate-spin mr-2" />
                  )}
                  {confirmAction.type === "cancel"
                    ? "Cancel Booking"
                    : "Delete Booking"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightBookings;
