import React, { useState, useEffect } from "react";
import axios from "axios";
import { Flight } from "../../../types/flight";
interface ShowFlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  flightId: number | null;
}

const ShowFlightModal: React.FC<ShowFlightModalProps> = ({
  isOpen,
  onClose,
  flightId,
}) => {
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isOpen && flightId) {
      fetchFlightDetails();
    }
  }, [isOpen, flightId]);

  const fetchFlightDetails = async () => {
    if (!flightId) return;

    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/flight/${flightId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (res.data.status === "success") {
        setFlight(res.data.data[0]);
      } else {
        setError("Failed to load flight details");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load flight details");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString([], {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Flight Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {flight && !loading && (
          <div className="space-y-6">
            {/* Flight Basic Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Flight Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Flight ID
                  </label>
                  <p className="text-gray-800 font-medium">{flight.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Airline
                  </label>
                  <p className="text-gray-800 font-medium">{flight.airline}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Flight Number
                  </label>
                  <p className="text-gray-800 font-medium">
                    {flight.flight_number}
                  </p>
                </div>
              </div>
            </div>

            {/* Airport Information */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Route Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Departure */}
                <div className="border-r border-blue-200 pr-4">
                  <h4 className="font-medium text-blue-800 mb-2">Departure</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Airport
                      </label>
                      <p className="text-gray-800">
                        {flight.departure_airport.name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        IATA Code
                      </label>
                      <p className="text-gray-800 font-mono">
                        {flight.departure_airport.IATA_code}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Date & Time
                      </label>
                      <p className="text-gray-800">
                        {formatDateTime(flight.departure_time)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Arrival */}
                <div className="pl-4">
                  <h4 className="font-medium text-green-800 mb-2">Arrival</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Airport
                      </label>
                      <p className="text-gray-800">
                        {flight.arrival_airport.name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        IATA Code
                      </label>
                      <p className="text-gray-800 font-mono">
                        {flight.arrival_airport.IATA_code}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Date & Time
                      </label>
                      <p className="text-gray-800">
                        {formatDateTime(flight.arrival_time)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Flight Duration */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Flight Duration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Departure Date
                  </label>
                  <p className="text-gray-800">
                    {formatDate(flight.departure_time)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Departure Time
                  </label>
                  <p className="text-gray-800">
                    {formatTime(flight.departure_time)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Arrival Time
                  </label>
                  <p className="text-gray-800">
                    {formatTime(flight.arrival_time)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowFlightModal;
