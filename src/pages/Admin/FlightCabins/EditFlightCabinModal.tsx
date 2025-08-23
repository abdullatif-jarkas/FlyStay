import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlane, FaTimes, FaSpinner } from "react-icons/fa";
import {
  EditFlightCabinModalProps,
  EditFlightCabinFormData,
  FlightCabinFormErrors,
  Flight,
  FlightsResponse,
  FLIGHT_CLASSES,
  FLIGHT_CABIN_ENDPOINTS,
} from "../../../types/flightCabin";

const EditFlightCabinModal: React.FC<EditFlightCabinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  flightCabin,
}) => {
  const [formData, setFormData] = useState<EditFlightCabinFormData>({
    flight_id: "",
    class_name: "",
    price: "",
    available_seats: "",
    note: "",
  });
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFlights, setLoadingFlights] = useState(false);
  const [errors, setErrors] = useState<FlightCabinFormErrors>({});

  const token = localStorage.getItem("token");

  // Initialize form data when modal opens or flightCabin changes
  useEffect(() => {
    if (isOpen && flightCabin) {
      setFormData({
        flight_id: flightCabin.flight_id.toString(),
        class_name: flightCabin.class_name,
        price: flightCabin.price,
        available_seats: flightCabin.available_seats.toString(),
        note: flightCabin.note || "",
      });
      fetchFlights();
    }
  }, [isOpen, flightCabin]);

  const fetchFlights = async () => {
    setLoadingFlights(true);

    try {
      // First, fetch the first page to get pagination info
      const firstPageResponse = await axios.get(
        `http://127.0.0.1:8000${FLIGHT_CABIN_ENDPOINTS.FLIGHTS}?page=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (firstPageResponse.data.status === "success") {
        const firstPageData: FlightsResponse = firstPageResponse.data;
        let allFlights: Flight[] = [...firstPageData.data];

        // Check if there are more pages to fetch
        const totalPages = firstPageData.pagination?.total_pages || 1;

        if (totalPages > 1) {
          // Fetch remaining pages in parallel
          const pagePromises: Promise<
            import("axios").AxiosResponse<FlightsResponse>
          >[] = [];

          for (let page = 2; page <= totalPages; page++) {
            const pagePromise = axios.get<FlightsResponse>(
              `http://127.0.0.1:8000${FLIGHT_CABIN_ENDPOINTS.FLIGHTS}?page=${page}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
              }
            );
            pagePromises.push(pagePromise);
          }

          // Wait for all pages to complete
          const pageResponses = await Promise.all(pagePromises);

          // Combine all flight data
          pageResponses.forEach((response) => {
            if (response.data.status === "success") {
              const pageData: FlightsResponse = response.data;
              allFlights = [...allFlights, ...pageData.data];
            }
          });
        }

        // Set all flights to state
        setFlights(allFlights);
        console.log(
          `Fetched ${allFlights.length} flights from ${totalPages} page(s)`
        );
      }
    } catch (err: unknown) {
      console.error("Error fetching flights:", err);
      // Set empty array on error to prevent UI issues
      setFlights([]);
    } finally {
      setLoadingFlights(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FlightCabinFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FlightCabinFormErrors = {};

    if (!formData.flight_id.trim()) {
      newErrors.flight_id = "Flight is required";
    }

    if (!formData.class_name.trim()) {
      newErrors.class_name = "Class name is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (
      isNaN(parseFloat(formData.price)) ||
      parseFloat(formData.price) <= 0
    ) {
      newErrors.price = "Price must be a valid positive number";
    }

    if (!formData.available_seats.trim()) {
      newErrors.available_seats = "Available seats is required";
    } else if (
      isNaN(parseInt(formData.available_seats)) ||
      parseInt(formData.available_seats) <= 0
    ) {
      newErrors.available_seats =
        "Available seats must be a valid positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !flightCabin) return;

    setLoading(true);
    setErrors({});

    try {
      const submitData = new FormData();
      submitData.append("flight_id", formData.flight_id);
      submitData.append("class_name", formData.class_name);
      submitData.append("price", formData.price);
      submitData.append("available_seats", formData.available_seats);
      submitData.append("note", formData.note);
      submitData.append("_method", "PUT");

      const response = await axios.post(
        `http://127.0.0.1:8000${FLIGHT_CABIN_ENDPOINTS.UPDATE(flightCabin.id)}`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        onSuccess();
        handleClose();
      } else {
        setErrors({
          general: response.data.message || "Failed to update flight cabin",
        });
      }
    } catch (err: any) {
      console.error("Error updating flight cabin:", err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({
          general:
            err.response?.data?.message || "Failed to update flight cabin",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      flight_id: "",
      class_name: "",
      price: "",
      available_seats: "",
      note: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen || !flightCabin) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <FaPlane className="text-primary-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Flight Cabin
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.general}
            </div>
          )}

          {/* Flight Selection */}
          <div className="mb-4">
            <label
              htmlFor="flight_id"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Flight *
            </label>
            <select
              id="flight_id"
              name="flight_id"
              value={formData.flight_id}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.flight_id ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loadingFlights}
            >
              <option value="">
                {loadingFlights ? "Loading all flights..." : "Select a flight"}
              </option>
              {flights.map((flight) => (
                <option key={flight.id} value={flight.id}>
                  {flight.airline} {flight.flight_number} -{" "}
                  {flight.departure_airport?.IATA_code || "N/A"} →{" "}
                  {flight.arrival_airport?.IATA_code || "N/A"}
                </option>
              ))}
            </select>
            {errors.flight_id && (
              <p className="mt-1 text-sm text-red-600">{errors.flight_id}</p>
            )}
          </div>

          {/* Class Name */}
          <div className="mb-4">
            <label
              htmlFor="class_name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Class *
            </label>
            <select
              id="class_name"
              name="class_name"
              value={formData.class_name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.class_name ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select a class</option>
              {FLIGHT_CLASSES.map((flightClass) => (
                <option key={flightClass.value} value={flightClass.value}>
                  {flightClass.label}
                </option>
              ))}
            </select>
            {errors.class_name && (
              <p className="mt-1 text-sm text-red-600">{errors.class_name}</p>
            )}
          </div>

          {/* Price */}
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Price (USD) *
            </label>
            <input
              type="number"
              step="0.01"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.price ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter price"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          {/* Available Seats */}
          <div className="mb-4">
            <label
              htmlFor="available_seats"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Available Seats *
            </label>
            <input
              type="number"
              id="available_seats"
              name="available_seats"
              value={formData.available_seats}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.available_seats ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter number of available seats"
            />
            {errors.available_seats && (
              <p className="mt-1 text-sm text-red-600">
                {errors.available_seats}
              </p>
            )}
          </div>

          {/* Note */}
          <div className="mb-6">
            <label
              htmlFor="note"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Note (Optional)
            </label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter any additional notes"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {loading && <FaSpinner className="animate-spin mr-2" />}
              Update Flight Cabin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFlightCabinModal;
