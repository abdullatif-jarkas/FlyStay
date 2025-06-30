import React, { useState, useEffect } from "react";
import axios from "axios";

interface Airport {
  id: number;
  name: string;
  IATA_code: string;
  city: {
    name: string;
  };
  country: string;
}

interface Flight {
  id: number;
  airline: string;
  flight_number: string;
  departure_airport_id: number;
  arrival_airport_id: number;
  departure_time: string;
  arrival_time: string;
}

interface EditFlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  flight: Flight | null;
}

interface FlightFormData {
  airline: string;
  flight_number: string;
  departure_airport_id: string;
  arrival_airport_id: string;
  departure_time: string;
  arrival_time: string;
}

const EditFlightModal: React.FC<EditFlightModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  flight,
}) => {
  const [formData, setFormData] = useState<FlightFormData>({
    airline: "",
    flight_number: "",
    departure_airport_id: "",
    arrival_airport_id: "",
    departure_time: "",
    arrival_time: "",
  });
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isOpen && flight) {
      // Format datetime for input fields
      const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      };

      setFormData({
        airline: flight.airline,
        flight_number: flight.flight_number,
        departure_airport_id: flight.departure_airport_id.toString(),
        arrival_airport_id: flight.arrival_airport_id.toString(),
        departure_time: formatDateTime(flight.departure_time),
        arrival_time: formatDateTime(flight.arrival_time),
      });
      fetchAirports();
    }
  }, [isOpen, flight]);

  const fetchAirports = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/get-all-airports", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setAirports(res.data.data || []);
    } catch (error) {
      console.error("Error fetching airports:", error);
      setError("Failed to load airports");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flight) return;

    setLoading(true);
    setError("");

    try {
      await axios.put(`http://127.0.0.1:8000/api/flight/${flight.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update flight");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen || !flight) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Flight</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Airline
            </label>
            <input
              type="text"
              name="airline"
              value={formData.airline}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Flight Number
            </label>
            <input
              type="text"
              name="flight_number"
              value={formData.flight_number}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departure Airport
            </label>
            <select
              name="departure_airport_id"
              value={formData.departure_airport_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select Departure Airport</option>
              {airports.map((airport) => (
                <option key={airport.id} value={airport.id}>
                  {airport.name} ({airport.IATA_code}) - {airport.city.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Arrival Airport
            </label>
            <select
              name="arrival_airport_id"
              value={formData.arrival_airport_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select Arrival Airport</option>
              {airports.map((airport) => (
                <option key={airport.id} value={airport.id}>
                  {airport.name} ({airport.IATA_code}) - {airport.city.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departure Time
            </label>
            <input
              type="datetime-local"
              name="departure_time"
              value={formData.departure_time}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Arrival Time
            </label>
            <input
              type="datetime-local"
              name="arrival_time"
              value={formData.arrival_time}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Flight"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFlightModal;
