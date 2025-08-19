import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  FaBed,
  FaSpinner,
  FaExclamationTriangle,
  FaUsers,
  FaDollarSign,
  FaArrowLeft,
  FaImage,
  FaCalendarAlt,
  FaCreditCard,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";
import {
  Room,
  RoomDetailsResponse,
  RoomBookingRequest,
} from "../../types/hotel";
import { useBooking, HotelBookingAPI } from "../../contexts/BookingContext";

// API Response interface for hotel booking
interface HotelBookingResponse {
  status: string;
  message: string;
  data: HotelBookingAPI[];
}

const RoomDetails = () => {
  const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>();
  const navigate = useNavigate();
  const { addHotelBooking } = useBooking();

  // State management
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // Booking form state
  const [checkInDate, setCheckInDate] = useState<string>("");
  const [checkOutDate, setCheckOutDate] = useState<string>("");
  const [formErrors, setFormErrors] = useState<{
    checkIn?: string;
    checkOut?: string;
  }>({});

  const token = localStorage.getItem("token");

  // Fetch room details
  const fetchRoomDetails = useCallback(async () => {
    if (!roomId) {
      setError("Room ID is required");
      setLoading(false);
      return;
    }

    if (!token) {
      toast.error("Please login to view room details");
      navigate("/auth/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get<RoomDetailsResponse>(
        `http://127.0.0.1:8000/api/room/${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        setRoom(response.data.data[0]);
      } else {
        setError(response.data.message || "Failed to fetch room details");
      }
    } catch (err: any) {
      console.error("Error fetching room details:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to fetch room details";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [roomId, token, navigate]);

  // Fetch room details on component mount
  useEffect(() => {
    fetchRoomDetails();
  }, [fetchRoomDetails]);

  // Format price
  const formatPrice = (price: string): string => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numPrice);
  };

  // Calculate total nights and price
  const calculateBookingDetails = () => {
    if (!checkInDate || !checkOutDate || !room) return null;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (nights <= 0) return null;

    const pricePerNight = parseFloat(room.price_per_night);
    const totalPrice = nights * pricePerNight;

    return {
      nights,
      pricePerNight,
      totalPrice,
    };
  };

  // Validate booking form
  const validateBookingForm = (): boolean => {
    const errors: { checkIn?: string; checkOut?: string } = {};
    const today = new Date().toISOString().split("T")[0];

    if (!checkInDate) {
      errors.checkIn = "Check-in date is required";
    } else if (checkInDate < today) {
      errors.checkIn = "Check-in date cannot be in the past";
    }

    if (!checkOutDate) {
      errors.checkOut = "Check-out date is required";
    } else if (checkOutDate <= checkInDate) {
      errors.checkOut = "Check-out date must be after check-in date";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle booking submission
  const handleBookingSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateBookingForm() || !room) return;

      setBookingLoading(true);

      try {
        const bookingData: RoomBookingRequest = {
          room_id: room.id,
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
        };

        const response = await axios.post<HotelBookingResponse>(
          "http://127.0.0.1:8000/api/hotel-bookings",
          bookingData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (
          response.data.status === "success" &&
          response.data.data.length > 0
        ) {
          const newBooking = response.data.data[0];

          // Add booking to context
          addHotelBooking(newBooking);

          toast.success(
            `Booking created successfully! Reference: ${newBooking.id}`
          );
          toast.info("Your booking is pending. Complete payment to confirm.");

          // Navigate to profile bookings section
          navigate("/profile?section=bookings");
        } else {
          toast.error(response.data.message || "Booking failed");
        }
      } catch (err: any) {
        console.error("Error creating booking:", err);
        const errorMessage =
          err.response?.data?.message || "Failed to create booking";
        toast.error(errorMessage);
      } finally {
        setBookingLoading(false);
      }
    },
    [room, checkInDate, checkOutDate, token, navigate, addHotelBooking]
  );

  // Get today's date for min date validation
  const today = new Date().toISOString().split("T")[0];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-primary-500 animate-spin mb-4 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Room Details
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch the room information...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <FaExclamationTriangle className="text-4xl text-red-500 mb-4 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to Load Room
          </h2>
          <p className="text-gray-600 mb-6">{error || "Room not found"}</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate(`/hotel/${hotelId}`)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Back to Hotel
            </button>
            <button
              onClick={fetchRoomDetails}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const bookingDetails = calculateBookingDetails();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(`/hotel/${hotelId}`)}
                className="mr-4 p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Room Details
                </h1>
                <p className="text-gray-600 mt-1">Book your perfect room</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Room Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Basic Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                <FaBed className="text-primary-500 text-2xl mr-3" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {room.room_type}
                  </h2>
                  <p className="text-gray-600">Room Information</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Capacity:</span>
                    <div className="flex items-center">
                      <FaUsers className="mr-2 text-primary-500" />
                      <span className="font-semibold text-gray-900">
                        {room.capacity} guest{room.capacity !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Price per night:</span>
                    <div className="flex items-center">
                      <FaDollarSign className="mr-2 text-green-500" />
                      <span className="font-bold text-green-600 text-lg">
                        {formatPrice(room.price_per_night)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Room ID:</span>
                    <span className="font-semibold text-gray-900">
                      #{room.id}
                    </span>
                  </div>
                </div>
              </div>

              {room.description && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <FaInfoCircle className="mr-2 text-primary-500" />
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {room.description}
                  </p>
                </div>
              )}
            </div>

            {/* Room Images */}
            {room.images && room.images.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FaImage className="mr-2 text-primary-500" />
                  Room Images
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {room.images.map((image, index) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.image_path || image.url}
                        alt={`Room ${room.room_type} - Image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FaCalendarAlt className="mr-2 text-primary-500" />
                Book This Room
              </h3>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {/* Check-in Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={today}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      formErrors.checkIn ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.checkIn && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.checkIn}
                    </p>
                  )}
                </div>

                {/* Check-out Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date *
                  </label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    min={checkInDate || today}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      formErrors.checkOut ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.checkOut && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.checkOut}
                    </p>
                  )}
                </div>

                {/* Booking Summary */}
                {bookingDetails && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold text-gray-900">
                      Booking Summary
                    </h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Nights:</span>
                      <span className="font-medium">
                        {bookingDetails.nights}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Price per night:</span>
                      <span className="font-medium">
                        {formatPrice(bookingDetails.pricePerNight.toString())}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                      <span>Total:</span>
                      <span className="text-green-600">
                        {formatPrice(bookingDetails.totalPrice.toString())}
                      </span>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={bookingLoading || !checkInDate || !checkOutDate}
                  className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {bookingLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Creating Booking...
                    </>
                  ) : (
                    <>
                      <FaCreditCard className="mr-2" />
                      Book Room
                    </>
                  )}
                </button>

                {/* Success Message */}
                <div className="text-center">
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <FaCheckCircle className="mr-2 text-green-500" />
                    <span>
                      Booking will be pending until payment is completed
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
