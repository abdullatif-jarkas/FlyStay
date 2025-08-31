import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  FaPlane,
  FaSpinner,
  FaExclamationTriangle,
  FaClock,
  FaMapMarkerAlt,
  FaArrowRight,
  FaUsers,
  FaStickyNote,
  FaCreditCard,
  FaArrowLeft,
} from "react-icons/fa";
import {
  Flight,
  FlightCabin,
  formatPrice,
  getClassBadgeColor,
  formatDateTime,
} from "../../types/flightCabin";
import FlightBookingModal from "../../components/Flight/FlightBookingModal";

// API Response interface for flight details
interface FlightDetailsResponse {
  status: string;
  message?: string;
  data: {
    flight: Flight;
    flight_cabins: FlightCabin[];
  };
}

const FlightPurchase = () => {
  const { flightId } = useParams<{ flightId: string }>();
  const navigate = useNavigate();

  // State management
  const [flight, setFlight] = useState<Flight | null>(null);
  const [flightCabins, setFlightCabins] = useState<FlightCabin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Booking modal state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedFlightCabin, setSelectedFlightCabin] =
    useState<FlightCabin | null>(null);

  const token = localStorage.getItem("token");

  // Fetch flight details
  const fetchFlightDetails = useCallback(async () => {
    if (!flightId) {
      setError("Flight ID is required");
      setLoading(false);
      return;
    }

    if (!token) {
      toast.error("Please login to view flight details");
      navigate("/auth/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get<FlightDetailsResponse>(
        `http://127.0.0.1:8000/api/flight/${flightId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        setFlight(response.data.data[0]);
        setFlightCabins(response.data.data[0].flight_details || []);
      } else {
        setError(response.data.message || "Failed to fetch flight details");
      }
    } catch (err: any) {
      console.error("Error fetching flight details:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to fetch flight details";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [flightId, token, navigate]);

  // Fetch flight details on component mount
  useEffect(() => {
    fetchFlightDetails();
  }, [fetchFlightDetails]);

  // Handle flight class selection
  const handleSelectClass = useCallback((flightCabin: FlightCabin) => {
    setSelectedFlightCabin(flightCabin);
    setBookingModalOpen(true);
  }, []);

  // Handle booking success
  const handleBookingSuccess = useCallback(
    (confirmation: { booking_reference: string; booking_id?: number }) => {
      toast.success(
        `Booking confirmed! Reference: ${confirmation.booking_reference}`
      );
      // setBookingModalOpen(false);
      // setSelectedFlightCabin(null);
      // Optionally navigate to booking confirmation page
      // navigate(`/booking-confirmation/${confirmation.booking_id}`);
    },
    []
  );

  // Handle booking modal close
  const handleCloseBookingModal = useCallback(() => {
    setBookingModalOpen(false);
    setSelectedFlightCabin(null);
  }, []);

  // Calculate flight duration
  const calculateFlightDuration = (
    departure: string,
    arrival: string
  ): string => {
    const departureTime = new Date(departure);
    const arrivalTime = new Date(arrival);
    const durationMs = arrivalTime.getTime() - departureTime.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-primary-500 animate-spin mb-4 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Flight Details
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch the flight information...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !flight) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <FaExclamationTriangle className="text-4xl text-red-500 mb-4 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to Load Flight
          </h2>
          <p className="text-gray-600 mb-6">{error || "Flight not found"}</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/flight")}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Back to Flights
            </button>
            <button
              onClick={fetchFlightDetails}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/flight")}
                className="mr-4 p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Flight Details
                </h1>
                <p className="text-gray-600 mt-1">
                  Choose your preferred class and book your flight
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Flight Information Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center mb-6">
            <FaPlane className="text-primary-500 text-2xl mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {flight.airline} {flight.flight_number}
              </h2>
              <p className="text-gray-600">Flight Information</p>
            </div>
          </div>

          {/* Route and Schedule */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Route Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-primary-500" />
                Route
              </h3>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  {/* Departure */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {flight.departure_airport?.IATA_code || "N/A"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {flight.departure_airport?.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {flight.departure_airport?.city_name},{" "}
                      {flight.departure_airport?.country_name}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex-1 flex items-center justify-center">
                    <FaArrowRight className="text-primary-500 text-xl mx-4" />
                  </div>

                  {/* Arrival */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {flight.arrival_airport?.IATA_code || "N/A"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {flight.arrival_airport?.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {flight.arrival_airport?.city_name},{" "}
                      {flight.arrival_airport?.country_name}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaClock className="mr-2 text-primary-500" />
                Schedule
              </h3>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Departure:</span>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatDateTime(flight.departure_time)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Arrival:</span>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatDateTime(flight.arrival_time)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-gray-600">Duration:</span>
                  <div className="font-semibold text-primary-600">
                    {calculateFlightDuration(
                      flight.departure_time,
                      flight.arrival_time
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flight Classes Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Available Classes
            </h2>
            <p className="text-gray-600">Choose your preferred travel class</p>
          </div>

          {flightCabins.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <FaExclamationTriangle className="text-4xl text-yellow-500 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Classes Available
              </h3>
              <p className="text-gray-600">
                Unfortunately, there are no available classes for this flight at
                the moment.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flightCabins.map((cabin) => (
                <div
                  key={cabin.id}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  {/* Class Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getClassBadgeColor(
                          cabin.class_name
                        )}`}
                      >
                        {cabin.class_name}
                      </span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {formatPrice(cabin.price)}
                        </div>
                        <div className="text-sm text-gray-500">per person</div>
                      </div>
                    </div>
                  </div>

                  {/* Class Details */}
                  <div className="p-6">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 flex items-center">
                          <FaUsers className="mr-2" />
                          Available Seats
                        </span>
                        <span className="font-semibold text-gray-900">
                          {cabin.available_seats}
                        </span>
                      </div>

                      {cabin.note && (
                        <div className="flex items-start">
                          <FaStickyNote className="mr-2 mt-1 text-gray-400" />
                          <div>
                            <span className="text-gray-600 text-sm">Note:</span>
                            <p className="text-gray-700 text-sm mt-1">
                              {cabin.note}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Select Button */}
                    <button
                      onClick={() => handleSelectClass(cabin)}
                      disabled={cabin.available_seats === 0}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                        cabin.available_seats === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-primary-600 text-white hover:bg-primary-700"
                      }`}
                    >
                      <FaCreditCard className="mr-2" />
                      {cabin.available_seats === 0
                        ? "Sold Out"
                        : "Select & Book"}
                    </button>

                    {cabin.available_seats <= 5 &&
                      cabin.available_seats > 0 && (
                        <p className="text-orange-600 text-sm mt-2 text-center">
                          Only {cabin.available_seats} seats left!
                        </p>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Flight Booking Modal */}
      <FlightBookingModal
        isOpen={bookingModalOpen}
        onClose={handleCloseBookingModal}
        flight={flight}
        flightCabin={selectedFlightCabin}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
};

export default FlightPurchase;
