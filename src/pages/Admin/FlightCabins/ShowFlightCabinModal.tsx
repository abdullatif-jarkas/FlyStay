import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaPlane, 
  FaTimes, 
  FaSpinner, 
  FaCalendarAlt, 
  FaClock, 
  FaUsers,
  FaDollarSign,
  FaStickyNote
} from "react-icons/fa";
import {
  ShowFlightCabinModalProps,
  FlightCabin,
  SingleFlightCabinResponse,
  FLIGHT_CABIN_ENDPOINTS,
  formatPrice,
  getClassBadgeColor,
  formatFlightRoute,
  formatDateTime,
} from "../../../types/flightCabin";

const ShowFlightCabinModal: React.FC<ShowFlightCabinModalProps> = ({
  isOpen,
  onClose,
  flightCabinId,
}) => {
  const [flightCabin, setFlightCabin] = useState<FlightCabin | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isOpen && flightCabinId) {
      fetchFlightCabin();
    }
  }, [isOpen, flightCabinId]);

  const fetchFlightCabin = async () => {
    if (!flightCabinId) return;

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000${FLIGHT_CABIN_ENDPOINTS.SHOW(flightCabinId)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        const responseData: SingleFlightCabinResponse = response.data;
        setFlightCabin(responseData.data);
      } else {
        setError("Failed to fetch flight cabin details");
      }
    } catch (err: any) {
      console.error("Error fetching flight cabin:", err);
      setError("Failed to fetch flight cabin details");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFlightCabin(null);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <FaPlane className="text-primary-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Flight Cabin Details</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <FaSpinner className="animate-spin text-primary-500 text-2xl mr-3" />
              <span className="text-gray-600">Loading flight cabin details...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {flightCabin && (
            <div className="space-y-6">
              {/* Flight Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <FaPlane className="mr-2 text-primary-500" />
                  Flight Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Airline & Flight Number</label>
                    <p className="text-gray-900 font-medium">
                      {flightCabin.flight.airline} {flightCabin.flight.flight_number}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Route</label>
                    <p className="text-gray-900 font-medium">
                      {formatFlightRoute(flightCabin.flight)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Departure</label>
                    <p className="text-gray-900 flex items-center">
                      <FaCalendarAlt className="mr-2 text-gray-400" />
                      {formatDateTime(flightCabin.flight.departure_time)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Arrival</label>
                    <p className="text-gray-900 flex items-center">
                      <FaClock className="mr-2 text-gray-400" />
                      {formatDateTime(flightCabin.flight.arrival_time)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cabin Information */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Cabin Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Class</label>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getClassBadgeColor(
                        flightCabin.class_name
                      )}`}
                    >
                      {flightCabin.class_name}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <p className="text-green-600 font-bold text-lg flex items-center">
                      <FaDollarSign className="mr-1" />
                      {formatPrice(flightCabin.price)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Available Seats</label>
                    <p className="text-gray-900 font-medium flex items-center">
                      <FaUsers className="mr-2 text-gray-400" />
                      {flightCabin.available_seats} seats
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bookings</label>
                    <p className="text-gray-900 font-medium">
                      {flightCabin.bookings?.length || 0} booked
                    </p>
                  </div>
                </div>

                {flightCabin.note && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FaStickyNote className="mr-2 text-gray-400" />
                      Note
                    </label>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                      {flightCabin.note}
                    </p>
                  </div>
                )}
              </div>

              {/* Bookings Information */}
              {flightCabin.bookings && flightCabin.bookings.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Bookings</h3>
                  <div className="space-y-2">
                    {flightCabin.bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex justify-between items-center bg-white p-3 rounded-md">
                        <div>
                          <p className="font-medium">Seat {booking.seat_number}</p>
                          <p className="text-sm text-gray-600">
                            Booked: {new Date(booking.booking_date).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    ))}
                    {flightCabin.bookings.length > 5 && (
                      <p className="text-sm text-gray-600 text-center">
                        And {flightCabin.bookings.length - 5} more bookings...
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              {(flightCabin.created_at || flightCabin.updated_at) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Record Information</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    {flightCabin.created_at && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Created</label>
                        <p className="text-gray-700">{formatDateTime(flightCabin.created_at)}</p>
                      </div>
                    )}
                    {flightCabin.updated_at && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Last Updated</label>
                        <p className="text-gray-700">{formatDateTime(flightCabin.updated_at)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowFlightCabinModal;
