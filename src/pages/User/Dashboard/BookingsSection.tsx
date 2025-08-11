import React, { useState, useEffect } from "react";
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
  FaExclamationTriangle,
  FaInbox,
} from "react-icons/fa";

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
  user: any;
}

const BookingsSection: React.FC<BookingsSectionProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<"all" | "flights" | "hotels">(
    "all"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Mock data - replace with actual API calls
  const [flightBookings] = useState<FlightBooking[]>([
    // {
    //   id: 1,
    //   booking_reference: "FL123456",
    //   flight_details: {
    //     airline: "Emirates",
    //     flight_number: "EK123",
    //     departure_airport: "DXB",
    //     arrival_airport: "JFK",
    //     departure_time: "2024-12-15T10:30:00Z",
    //     arrival_time: "2024-12-15T18:45:00Z",
    //   },
    //   passenger_details: {
    //     name: user?.name || "John Doe",
    //     email: user?.email || "john@example.com",
    //   },
    //   status: "confirmed",
    //   total_amount: 1250.0,
    //   booking_date: "2024-11-20T09:15:00Z",
    // },
    // {
    //   id: 2,
    //   booking_reference: "FL789012",
    //   flight_details: {
    //     airline: "Qatar Airways",
    //     flight_number: "QR456",
    //     departure_airport: "DOH",
    //     arrival_airport: "LHR",
    //     departure_time: "2024-12-20T14:20:00Z",
    //     arrival_time: "2024-12-20T19:30:00Z",
    //   },
    //   passenger_details: {
    //     name: user?.name || "John Doe",
    //     email: user?.email || "john@example.com",
    //   },
    //   status: "pending",
    //   total_amount: 890.0,
    //   booking_date: "2024-11-22T16:30:00Z",
    // },
    // {
    //   id: 3,
    //   booking_reference: "FL345678",
    //   flight_details: {
    //     airline: "Turkish Airlines",
    //     flight_number: "TK789",
    //     departure_airport: "IST",
    //     arrival_airport: "CDG",
    //     departure_time: "2024-11-10T08:15:00Z",
    //     arrival_time: "2024-11-10T11:30:00Z",
    //   },
    //   passenger_details: {
    //     name: user?.name || "John Doe",
    //     email: user?.email || "john@example.com",
    //   },
    //   status: "confirmed",
    //   total_amount: 650.0,
    //   booking_date: "2024-10-15T13:20:00Z",
    // },
  ]);

  const [hotelBookings] = useState<HotelBooking[]>([
    // {
    //   id: 1,
    //   booking_reference: "HT345678",
    //   hotel_name: "Grand Plaza Hotel",
    //   room_type: "Deluxe Suite",
    //   check_in_date: "2024-12-15",
    //   check_out_date: "2024-12-18",
    //   guest_details: {
    //     name: user?.name || "John Doe",
    //     email: user?.email || "john@example.com",
    //   },
    //   status: "confirmed",
    //   total_amount: 450.0,
    //   booking_date: "2024-11-18T11:45:00Z",
    //   nights: 3,
    // },
    // {
    //   id: 2,
    //   booking_reference: "HT901234",
    //   hotel_name: "Ocean View Resort",
    //   room_type: "Standard Room",
    //   check_in_date: "2024-12-22",
    //   check_out_date: "2024-12-25",
    //   guest_details: {
    //     name: user?.name || "John Doe",
    //     email: user?.email || "john@example.com",
    //   },
    //   status: "cancelled",
    //   total_amount: 320.0,
    //   booking_date: "2024-11-25T14:20:00Z",
    //   nights: 3,
    // },
    // {
    //   id: 3,
    //   booking_reference: "HT567890",
    //   hotel_name: "City Center Inn",
    //   room_type: "Business Room",
    //   check_in_date: "2024-11-05",
    //   check_out_date: "2024-11-07",
    //   guest_details: {
    //     name: user?.name || "John Doe",
    //     email: user?.email || "john@example.com",
    //   },
    //   status: "confirmed",
    //   total_amount: 280.0,
    //   booking_date: "2024-10-20T10:30:00Z",
    //   nights: 2,
    // },
  ]);

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

  // Filter bookings based on active tab
  const getFilteredBookings = () => {
    const allBookings = [
      ...flightBookings.map((booking) => ({
        ...booking,
        type: "flight" as const,
      })),
      ...hotelBookings.map((booking) => ({
        ...booking,
        type: "hotel" as const,
      })),
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
  const totalBookings = flightBookings.length + hotelBookings.length;
  const confirmedBookings = [...flightBookings, ...hotelBookings].filter(
    (b) => b.status === "confirmed"
  ).length;
  const pendingBookings = [...flightBookings, ...hotelBookings].filter(
    (b) => b.status === "pending"
  ).length;
  const totalSpent = [...flightBookings, ...hotelBookings]
    .filter((b) => b.status === "confirmed")
    .reduce((sum, booking) => sum + booking.total_amount, 0);

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-center">
          <FaSpinner className="animate-spin text-2xl text-primary-500 mr-3" />
          <span className="text-gray-600">Loading your bookings...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center">
          <FaExclamationTriangle className="text-4xl text-red-500 mb-4 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Bookings
          </h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
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
                <p className="text-sm font-medium text-green-900">Confirmed</p>
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
                onClick={() => setActiveTab(tab.id as any)}
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
  );

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
          <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <FaEye className="mr-1" />
            View Details
          </button>
        </div>
      </div>
    );
  }
};

export default BookingsSection;
