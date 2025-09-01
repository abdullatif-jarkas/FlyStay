import React, { useState, useEffect } from "react";
import { FaPlane, FaTimes, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FlightBookingModalProps } from "../../types/payment";
import { formatPrice } from "../../types/flightCabin";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { setActiveSection } from "../../store/sectionSlice";
import SuggestedHotels from "./SuggestedHotels";

interface FlightBookingResponse {
  status: string;
  message: string;
  data: Array<{
    id: number;
    user_id: number;
    flight_cabins_id: number;
    booking_date: string;
    seat_number: number;
    status: string;
  }>;
  errors?: {
    flight_cabins_id?: string[];
  };
}

const FlightBookingModal: React.FC<FlightBookingModalProps> = ({
  isOpen,
  onClose,
  flight,
  flightCabin,
  onBookingSuccess,
}) => {
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showSuggestedHotels, setShowSuggestedHotels] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setBookingLoading(false);
      setBookingSuccess(false);
      setShowSuggestedHotels(false);
    }
  }, [isOpen]);

  // Create flight booking directly
  const handleBookFlight = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to make a booking");
      return;
    }

    try {
      setBookingLoading(true);

      const formData = new FormData();
      formData.append("flight_cabins_id", flightCabin.id.toString());

      const response = await axios.post<FlightBookingResponse>(
        "http://127.0.0.1:8000/api/flight-bookings",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        setBookingSuccess(true);
        toast.success("Booking created successfully!");

        // Show suggested hotels for the destination city
        if (flight.arrival_airport?.city_name) {
          setShowSuggestedHotels(true);
        } else {
          // If no destination city, redirect to profile after delay
          setTimeout(() => {
            onClose();
            // navigate("/user/profile");
            // dispatch(setActiveSection("bookings"));
          }, 1000);
        }

        // Call success callback if provided
        if (onBookingSuccess) {
          onBookingSuccess({
            booking_reference: `FL${response.data.data[0].id
              .toString()
              .padStart(6, "0")}`,
            flight_details: {
              airline: flight.airline,
              flight_number: flight.flight_number,
              departure_airport: flight.departure_airport?.IATA_code || "",
              arrival_airport: flight.arrival_airport?.IATA_code || "",
              departure_time: flight.departure_time,
              arrival_time: flight.arrival_time,
              class: flightCabin.class_name,
              seat_number: response.data.data[0].seat_number?.toString(),
            },
            passenger_details: {
              name: "Passenger", // This would come from user data
              email: "passenger@example.com",
              phone: "+1234567890",
            },
            total_amount: flightCabin.price,
            booking_date: new Date().toISOString(),
          });
        }
      } else {
        const errorMessage =
          response.data.errors?.flight_cabins_id?.[0] ||
          response.data.message ||
          "Failed to create booking";
        toast.error(errorMessage);
      }
    } catch (error: unknown) {
      console.error("Error creating flight booking:", error);
      const errorMessage =
        error instanceof Error && "response" in error
          ? (
              error as {
                response?: {
                  data?: {
                    errors?: { flight_cabins_id?: string[] };
                    message?: string;
                  };
                };
              }
            ).response?.data?.errors[0] ||
            (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      toast.error(errorMessage || "Failed to create booking");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleClose = () => {
    setBookingLoading(false);
    setBookingSuccess(false);
    setShowSuggestedHotels(false);
    onClose();
  };

  const handleViewProfile = () => {
    onClose();
    navigate("/user/profile");
    dispatch(setActiveSection("bookings"));
  };

  if (!isOpen || !flight || !flightCabin) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-lg shadow-xl w-full mx-4 max-h-[90vh] overflow-y-auto ${
          showSuggestedHotels ? "max-w-6xl" : "max-w-2xl"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <FaPlane className="text-primary-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              {bookingSuccess ? "Booking Confirmed!" : "Confirm Flight Booking"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={bookingLoading}
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Flight Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Flight Details</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Flight:</span>
                <span className="ml-2 font-medium">
                  {flight.airline} {flight.flight_number}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Class:</span>
                <span className="ml-2 font-medium">
                  {flightCabin.class_name}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Route:</span>
                <span className="ml-2 font-medium">
                  {flight.departure_airport?.IATA_code} →{" "}
                  {flight.arrival_airport?.IATA_code}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Price:</span>
                <span className="ml-2 font-medium text-green-600">
                  {formatPrice(flightCabin.price)}
                </span>
              </div>
            </div>
          </div>

          {/* Booking Status */}
          {bookingSuccess ? (
            <div>
              {/* Success Message */}
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-2xl text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Booking Created Successfully!
                </h3>
                <p className="text-gray-600 mb-4">
                  Your flight booking has been created. You can complete the
                  payment from your profile.
                </p>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 mb-6">
                  <button
                    onClick={handleViewProfile}
                    className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    View My Bookings
                  </button>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
              {/* Suggested Hotels */}
              {showSuggestedHotels && flight.arrival_airport?.city_name && (
                <SuggestedHotels
                  cityId={flight.arrival_airport.city_id}
                  cityName={flight.arrival_airport.city_name}
                  isVisible={showSuggestedHotels}
                  onClose={() => setShowSuggestedHotels(false)}
                />
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Booking Process
                </h4>
                <p className="text-sm text-blue-800">
                  This will create your flight booking. You can complete the
                  payment later from your profile page.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  disabled={bookingLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookFlight}
                  disabled={bookingLoading}
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  {bookingLoading && (
                    <FaSpinner className="animate-spin mr-2" />
                  )}
                  <FaPlane className="mr-2" />
                  {bookingLoading ? "Creating Booking..." : "Book Flight"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightBookingModal;
