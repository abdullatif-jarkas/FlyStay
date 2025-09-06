import { useEffect, useMemo, useState, useCallback } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import axios from "axios";
import { Pagination } from "../Cities/Cities";
import {
  TableContainer,
  ActionButtons,
  createViewAction,
  createEditAction,
  createDeleteAction,
} from "../../../components/ui/table";
import CreateFlightModal from "./CreateFlightModal";
import EditFlightModal from "./EditFlightModal";
import ShowFlightModal from "./ShowFlightModal";
import FlightFilters from "../../../components/Admin/Flights/FlightFilters";
import { toast } from "sonner";
import { Flight, AdminFlightFilters } from "../../../types/flight";

const FlightAdmin = () => {
  const [data, setData] = useState<Flight[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>();
  const [error, setError] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<AdminFlightFilters>({
    sort_type: "desc", // Default to newest first
  });

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedFlightId, setSelectedFlightId] = useState<number | null>(null);

  const token = localStorage.getItem("token");

  const fetchFlights = useCallback(
    async (currentFilters: AdminFlightFilters = {}) => {
      try {
        setLoading(true);
        setError("");

        // Build query parameters
        const queryParams = new URLSearchParams({
          page: page.toString(),
        });

        // Add filters to query params
        Object.entries(currentFilters).forEach(([key, value]) => {
          if (value !== "" && value !== undefined && value !== null) {
            if (typeof value === "boolean") {
              // Only add boolean filters if they are true
              if (value) {
                queryParams.append(key, "1");
              }
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });

        const res = await axios.get(
          `http://127.0.0.1:8000/api/flight?${queryParams.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (res.data.status === "success") {
          setData(res.data.data);
          setPagination(res.data.pagination);

          if (res.data.data.length === 0) {
            setError("No flights found with the current filters!");
          }
        } else {
          setError(res.data.message || "Failed to fetch flights");
        }
      } catch (error) {
        console.error("Error fetching flights:", error);
        const errorMessage =
          error instanceof Error && "response" in error
            ? (error as { response?: { data?: { message?: string } } }).response
                ?.data?.message
            : undefined;
        setError(errorMessage || "Failed to load flights!");
      } finally {
        setLoading(false);
      }
    },
    [page, token]
  );

  useEffect(() => {
    fetchFlights(filters);
  }, [page, filters, fetchFlights]);

  // Filter handlers
  const handleFiltersChange = (newFilters: AdminFlightFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
    fetchFlights(newFilters);
  };

  const handleClearFilters = () => {
    const emptyFilters: AdminFlightFilters = {
      sort_type: "desc", // Keep default sort
    };
    setFilters(emptyFilters);
    setPage(1);
    fetchFlights(emptyFilters);
  };

  // Handler functions
  const handleView = useCallback((flight: Flight) => {
    setSelectedFlightId(flight.id);
    setIsShowModalOpen(true);
  }, []);

  const handleEdit = useCallback((flight: Flight) => {
    setSelectedFlight(flight);
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (flight: Flight) => {
      if (
        !window.confirm(
          `Are you sure you want to delete flight ${flight.flight_number}?`
        )
      ) {
        return;
      }

      try {
        await axios.delete(`http://127.0.0.1:8000/api/flight/${flight.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        fetchFlights(filters); // Refresh the table
        toast.error("Flight deleted successfully");
      } catch (err) {
        console.error("Error deleting flight:", err);
        alert("Failed to delete flight");
      }
    },
    [token, fetchFlights, filters]
  );

  const handleCreateSuccess = useCallback(() => {
    fetchFlights(filters); // Refresh the table
    toast.success("Flight created successfully");
  }, [fetchFlights, filters]);

  const handleEditSuccess = useCallback(() => {
    fetchFlights(filters); // Refresh the table
    toast.info("Flight updated successfully");
  }, [fetchFlights, filters]);

  const columns = useMemo<ColumnDef<Flight>[]>(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        enableSorting: true,
      },
      {
        header: "Flight Number",
        accessorKey: "flight_number",
        enableSorting: true,
      },
      {
        header: "Airline",
        accessorKey: "airline",
        enableSorting: true,
      },
      {
        header: "Departure",
        accessorKey: "departure_time",
        cell: (info) => {
          const date = new Date(info.getValue() as string);
          return (
            <div className="text-sm">
              <div className="font-medium">{date.toLocaleDateString()}</div>
              <div className="text-gray-500">{date.toLocaleTimeString()}</div>
            </div>
          );
        },
        enableSorting: true,
      },
      {
        header: "Arrival",
        accessorKey: "arrival_time",
        cell: (info) => {
          const date = new Date(info.getValue() as string);
          return (
            <div className="text-sm">
              <div className="font-medium">{date.toLocaleDateString()}</div>
              <div className="text-gray-500">{date.toLocaleTimeString()}</div>
            </div>
          );
        },
        enableSorting: true,
      },
      {
        header: "Route",
        id: "route",
        cell: ({ row }) => {
          const flight = row.original;
          return (
            <div className="text-sm">
              <div className="font-medium">
                {flight.departure_airport?.city_name || "N/A"} →{" "}
                {flight.arrival_airport?.city_name || "N/A"}
              </div>
              <div className="text-gray-500">
                {flight.departure_airport?.country_name || "N/A"} →{" "}
                {flight.arrival_airport?.country_name || "N/A"}
              </div>
            </div>
          );
        },
        enableSorting: false,
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <ActionButtons
            actions={[
              createViewAction(() => handleView(row.original)),
              createEditAction(() => handleEdit(row.original)),
              createDeleteAction(() => handleDelete(row.original)),
            ]}
          />
        ),
        enableSorting: false,
      },
    ],
    [handleView, handleEdit, handleDelete]
  );

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Flight Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor all flight schedules
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Create New Flight
        </button>
      </div>

      {/* Filters */}
      <FlightFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        loading={loading}
      />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Flights Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <TableContainer
          title="Flights List"
          data={data}
          columns={columns}
          loading={loading}
          sorting={sorting}
          onSortingChange={setSorting}
          pagination={pagination || undefined}
          onPageChange={handlePageChange}
          emptyMessage="No Flights found"
        />
      </div>

      {/* Modals */}
      <CreateFlightModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <EditFlightModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        flight={selectedFlight}
      />

      <ShowFlightModal
        isOpen={isShowModalOpen}
        onClose={() => setIsShowModalOpen(false)}
        flightId={selectedFlightId}
      />
    </div>
  );
};

export default FlightAdmin;
