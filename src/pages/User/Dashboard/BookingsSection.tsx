import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  FaPlane,
  FaHotel,
  FaCalendarAlt,
  FaTicketAlt,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaEye,
  FaSpinner,
  FaInbox,
  FaCreditCard,
} from "react-icons/fa";
import { useBooking, HotelBookingAPI } from "../../../contexts/BookingContext";
import PaymentModal from "../../../components/Payment/PaymentModal";

// Booking interfaces
interface FlightBooking {
  id: number;
  booking_reference: string;
  flight_details: {
    airline: string;
    flight_number: string;
    departure_airport: string;
    arrival_airport: string;
    departure_time: string;
    arrival_time: string;
  };
  passenger_details: {
    name: string;
    email: string;
  };
  status: "confirmed" | "pending" | "cancelled";
  total_amount: number;
  booking_date: string;
}

interface HotelBooking {
  id: number;
  booking_reference: string;
  hotel_name: string;
  room_type: string;
  check_in_date: string;
  check_out_date: string;
  guest_details: {
    name: string;
    email: string;
  };
  status: "confirmed" | "pending" | "cancelled";
  total_amount: number;
  booking_date: string;
  nights: number;
}

interface BookingsSectionProps {
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

const BookingsSection: React.FC<BookingsSectionProps> = () => {
  const [activeTab, setActiveTab] = useState<"all" | "flights" | "hotels">(
    "all"
  );
  const [paymentLoading, setPaymentLoading] = useState<number | null>(null);

  // Payment modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<{
    bookingId: number;
    amount: number;
    clientSecret: string;
  } | null>(null);

  const { hotelBookings, updateBookingStatus } = useBooking();
  const token = localStorage.getItem("token");

  // Mock data - replace with actual API calls
  const [flightBookings] = useState<FlightBooking[]>([]);

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time
  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: {
        icon: FaCheckCircle,
        color: "text-green-600 bg-green-100",
        text: "Confirmed",
      },
      pending: {
        icon: FaClock,
        color: "text-yellow-600 bg-yellow-100",
        text: "Pending",
      },
      cancelled: {
        icon: FaTimes,
        color: "text-red-600 bg-red-100",
        text: "Cancelled",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="mr-1" />
        {config.text}
      </span>
    );
  };

  // Handle payment for hotel booking
  const handlePayment = async (bookingId: number, amount: number) => {
    console.log("first")
    if (!token) {
      toast.error("Please login to complete payment");
      return;
    }

    setPaymentLoading(bookingId);

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/payments/hotel-booking/${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (
        response.data.status === "success" &&
        response.data.data &&
        response.data.data.length > 0
      ) {
        const clientSecret = response.data.data[0];
        
        // Set up payment modal with client secret
        setCurrentPayment({
          bookingId,
          amount,
          clientSecret,
        });
        setPaymentModalOpen(true);

        toast.info("Redirecting to secure payment...");
      } else {
        toast.error(response.data.message || "Failed to initialize payment");
      }
    } catch (err: unknown) {
      console.error("Error initializing payment:", err);
      const errorMessage =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      toast.error(errorMessage || "Failed to initialize payment");
    } finally {
      setPaymentLoading(null);
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = () => {
    if (currentPayment) {
      updateBookingStatus(currentPayment.bookingId, "confirmed");
      toast.success(
        "Payment completed successfully! Your booking is now confirmed."
      );
      setCurrentPayment(null);
    }
  };

  // Handle payment error
  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`);
  };

  // Close payment modal
  const closePaymentModal = () => {
    setPaymentModalOpen(false);
    setCurrentPayment(null);
  };

  // Convert API hotel bookings to display format
  const convertApiHotelBookings = (apiBookings: HotelBookingAPI[]) => {
    return apiBookings.map((booking) => ({
      id: booking.id,
      booking_reference: `HT${booking.id.toString().padStart(6, "0")}`,
      hotel_name: `Hotel (Room ${booking.Room.room_type})`,
      room_type: booking.Room.room_type,
      check_in_date: booking.check_in_date.split("T")[0],
      check_out_date: booking.check_out_date.split("T")[0],
      guest_details: {
        name: booking.user_Info.name,
        email: booking.user_Info.email,
      },
      status: booking.status,
      total_amount: booking.amount,
      booking_date: booking.booking_date,
      nights: parseInt(booking.duration.split(" ")[0]),
      type: "hotel" as const,
    }));
  };

  // Filter bookings based on active tab
  const getFilteredBookings = () => {
    const convertedHotelBookings = convertApiHotelBookings(hotelBookings);
    const allBookings = [
      ...flightBookings.map((booking) => ({
        ...booking,
        type: "flight" as const,
      })),
      ...convertedHotelBookings,
    ].sort(
      (a, b) =>
        new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime()
    );

    switch (activeTab) {
      case "flights":
        return allBookings.filter((booking) => booking.type === "flight");
      case "hotels":
        return allBookings.filter((booking) => booking.type === "hotel");
      default:
        return allBookings;
    }
  };

  const filteredBookings = getFilteredBookings();

  // Calculate booking statistics
  const convertedHotelBookingsForStats = convertApiHotelBookings(hotelBookings);
  const totalBookings =
    flightBookings.length + convertedHotelBookingsForStats.length;
  const confirmedBookings = [
    ...flightBookings,
    ...convertedHotelBookingsForStats,
  ].filter((b) => b.status === "confirmed").length;
  const pendingBookings = [
    ...flightBookings,
    ...convertedHotelBookingsForStats,
  ].filter((b) => b.status === "pending").length;
  const totalSpent = [...flightBookings, ...convertedHotelBookingsForStats]
    .filter((b) => b.status === "confirmed")
    .reduce((sum, booking) => sum + booking.total_amount, 0);

  // Flight Booking Card Component
  function FlightBookingCard({
    booking,
  }: {
    booking: FlightBooking & { type: "flight" };
  }) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaPlane className="text-blue-600" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {booking.flight_details.departure_airport} →{" "}
                {booking.flight_details.arrival_airport}
              </h3>
              {getStatusBadge(booking.status)}
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">
                  {booking.flight_details.airline}
                </span>{" "}
                • Flight {booking.flight_details.flight_number}
              </p>
              <p>
                {formatDate(booking.flight_details.departure_time)} •
                {formatTime(booking.flight_details.departure_time)} -{" "}
                {formatTime(booking.flight_details.arrival_time)}
              </p>
              <p>
                Booking Reference:{" "}
                <span className="font-medium">{booking.booking_reference}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-lg font-bold text-gray-900 mb-2">
            {formatCurrency(booking.total_amount)}
          </div>
          <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <FaEye className="mr-1" />
            View Details
          </button>
        </div>
      </div>
    );
  }

  // Hotel Booking Card Component
  function HotelBookingCard({
    booking,
  }: {
    booking: HotelBooking & { type: "hotel" };
  }) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaHotel className="text-green-600" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {booking.hotel_name}
              </h3>
              {getStatusBadge(booking.status)}
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">{booking.room_type}</span> •
                {booking.nights} night{booking.nights !== 1 ? "s" : ""}
              </p>
              <p>
                <FaCalendarAlt className="inline mr-1" />
                {formatDate(booking.check_in_date)} -{" "}
                {formatDate(booking.check_out_date)}
              </p>
              <p>
                Booking Reference:{" "}
                <span className="font-medium">{booking.booking_reference}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-lg font-bold text-gray-900 mb-2">
            {formatCurrency(booking.total_amount)}
          </div>
          <div className="space-y-2">
            {booking.status === "pending" ? (
              <button
                onClick={() => handlePayment(booking.id, booking.total_amount)}
                disabled={paymentLoading === booking.id}
                className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paymentLoading === booking.id ? (
                  <>
                    <FaSpinner className="animate-spin mr-1" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCreditCard className="mr-1" />
                    Pay Now
                  </>
                )}
              </button>
            ) : (
              <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <FaEye className="mr-1" />
                View Details
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Bookings</h2>
          <p className="text-gray-600">View and manage your travel bookings</p>
        </div>

        {/* Statistics Cards */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaTicketAlt className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-900">
                    Total Bookings
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {totalBookings}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaCheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-900">
                    Confirmed
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {confirmedBookings}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaClock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-900">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {pendingBookings}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaTicketAlt className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-900">
                    Total Spent
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(totalSpent)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "all", label: "All Bookings", icon: FaTicketAlt },
              { id: "flights", label: "Flights", icon: FaPlane },
              { id: "hotels", label: "Hotels", icon: FaHotel },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id as "all" | "flights" | "hotels")
                  }
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bookings List */}
        <div className="p-6">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <FaInbox className="text-4xl text-gray-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Bookings Found
              </h3>
              <p className="text-gray-600">
                {activeTab === "all"
                  ? "You haven't made any bookings yet."
                  : `You haven't made any ${activeTab} bookings yet.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={`${booking.type}-${booking.id}`}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  {booking.type === "flight" ? (
                    <FlightBookingCard
                      booking={booking as FlightBooking & { type: "flight" }}
                    />
                  ) : (
                    <HotelBookingCard
                      booking={booking as HotelBooking & { type: "hotel" }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {currentPayment && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={closePaymentModal}
          clientSecret={currentPayment.clientSecret}
          bookingId={currentPayment.bookingId}
          amount={currentPayment.amount}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      )}
    </>
  );
};

export default BookingsSection;
