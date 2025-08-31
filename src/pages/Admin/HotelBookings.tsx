import React, { useState, useEffect } from "react";
import {
  FaHotel,
  FaSearch,
  FaFilter,
  FaEye,
  FaTimes,
  FaTrash,
  FaSpinner,
  FaCalendarAlt,
  FaUser,
  FaBed,
} from "react-icons/fa";
import { toast } from "sonner";
import axios from "axios";
import {
  HotelBookingAdmin,
  HotelBookingsResponse,
  HotelBookingDetailsResponse,
  BookingActionResponse,
  BookingFilters,
} from "../../types/adminBookings";

const HotelBookings: React.FC = () => {
  const [bookings, setBookings] = useState<HotelBookingAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedBooking, setSelectedBooking] =
    useState<HotelBookingAdmin | null>(null);
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

  // Fetch hotel bookings
  const fetchHotelBookings = async (
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
        page: page.toString(),
        ...searchFilters,
      });

      const response = await axios.get<HotelBookingsResponse>(
        `http://127.0.0.1:8000/api/hotel-bookings?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      console.log("hotel bookings: ", response.data.data);
      if (response.data.status === "success") {
        setBookings(response.data.data);
        if (response.data.meta) {
          setCurrentPage(response.data.meta.current_page);
          setTotalPages(response.data.meta.last_page);
        }
      } else {
        toast.error(response.data.message || "Failed to fetch hotel bookings");
      }
    } catch (error: any) {
      console.error("Error fetching hotel bookings:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch hotel bookings"
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
      const response = await axios.get<HotelBookingDetailsResponse>(
        `http://127.0.0.1:8000/api/hotel-bookings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      console.log("debug: ", response);
      if (response.status === 200) {
        console.log("success");
        setSelectedBooking(response.data.data);
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
        `http://127.0.0.1:8000/api/hotel-bookings/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Hotel booking cancelled successfully");
        fetchHotelBookings(currentPage, filters);
      } else {
        toast.error(response.data.message || "Failed to cancel booking");
      }
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      toast.error(
        error.response?.data?.errors[0] || "Failed to cancel booking"
      );
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
        `http://127.0.0.1:8000/api/hotel-bookings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Hotel booking deleted successfully");
        fetchHotelBookings(currentPage, filters);
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
    fetchHotelBookings(1, searchFilters);
  };

  // Handle filter change
  const handleFilterChange = (key: keyof BookingFilters, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value || undefined,
    };
    setFilters(newFilters);
    fetchHotelBookings(1, newFilters);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchHotelBookings(page, filters);
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

  // Calculate nights
  const calculateNights = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
    fetchHotelBookings();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FaHotel className="text-2xl text-primary-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Hotel Bookings</h1>
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
            <span className="text-gray-600">Loading hotel bookings...</span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <FaBed className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hotel bookings found
            </h3>
            <p className="text-gray-600">
              No hotel bookings match your current filters.
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
                      Hotel Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room & Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
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
                          HB{booking.id.toString().padStart(6, "0")}
                        </div>
                        <div className="text-sm text-gray-500">
                          Room: {booking.Room?.id || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaUser className="text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.user_Info?.name || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.user_Info?.email || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.Hotel?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.Hotel?.city_name || "N/A"},{" "}
                          {booking.Hotel?.country_name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          Rating: {booking.Hotel?.rating || "N/A"}★
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.Room?.room_type || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          Check-in: {formatDate(booking.check_in_date)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Check-out: {formatDate(booking.check_out_date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {calculateNights(
                            booking.check_in_date,
                            booking.check_out_date
                          )}{" "}
                          nights
                        </div>
                        <div className="text-sm text-gray-500">
                          ${booking.Room?.price_per_night || "N/A"}/night
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
                                  message: `Are you sure you want to cancel booking HB${booking.id
                                    .toString()
                                    .padStart(6, "0")}?`,
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
                                message: `Are you sure you want to permanently delete booking HB${booking.id
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
          </>
        )}
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Hotel Booking Details - HB
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
                        {selectedBooking.user_Info.name || "N/A"}
                      </span>
                    </div>
                    {/* <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <span className="ml-2 text-gray-900">
                        {selectedBooking.user_Info.email || "N/A"}
                      </span>
                    </div> */}
                    <div>
                      <span className="font-medium text-gray-700">
                        Email:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {selectedBooking.user_Info.email ? (
                          <a
                            href={`mailto:${selectedBooking.user_Info.email}`}
                            className="text-primary-500 hover:underline"
                          >
                            {selectedBooking.user_Info.email}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Phone Number:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {selectedBooking.user_Info.phone_number ? (
                          <a
                            href={`tel:${selectedBooking.user_Info.phone_number}`}
                            className="text-primary-500 hover:underline"
                          >
                            {selectedBooking.user_Info.phone_number}
                          </a>
                        ) : (
                          "N/A"
                        )}
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

                {/* Hotel Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaHotel className="mr-2" />
                    Hotel Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">
                        Hotel Name:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {selectedBooking.Hotel?.name || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Description:
                      </span>
                      <div className="ml-2 text-gray-900">
                        {selectedBooking.Hotel?.description || "N/A"}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Location:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {selectedBooking.Hotel?.city_name || "N/A"},{" "}
                        {selectedBooking.Hotel?.country_name || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Rating:</span>
                      <span className="ml-2 text-gray-900">
                        {selectedBooking.Hotel?.rating || "N/A"}★
                      </span>
                    </div>
                  </div>
                </div>

                {/* Room Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaBed className="mr-2" />
                    Room Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">
                        Room Number:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {selectedBooking.Room?.id || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Room Type:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {selectedBooking.Room?.room_type || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Price per Night:
                      </span>
                      <span className="ml-2 text-green-500 font-bold">
                        ${selectedBooking.Room?.price_per_night || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Capacity:
                      </span>
                      <span className="ml-2 text-gray-700">
                        {selectedBooking.Room?.capacity || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Total Nights:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {calculateNights(
                          selectedBooking.check_in_date,
                          selectedBooking.check_out_date
                        )}{" "}
                        nights
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Description:
                      </span>
                      <span className="ml-2 text-gray-700">
                        {selectedBooking.Room?.description || "N/A"}
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
                        Check-in Date:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {formatDate(selectedBooking.check_in_date)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Check-out Date:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {formatDate(selectedBooking.check_out_date)}
                      </span>
                    </div>
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
                    <div>
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
                    </div>
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

export default HotelBookings;
