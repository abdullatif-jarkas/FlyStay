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

interface Flight {
  id: number;
  airline: string;
  flight_number: string;
  departure_airport_id: number;
  arrival_airport_id: number;
  departure_time: Date;
  arrival_time: Date;
  created_at: Date;
  updated_at: Date;
  departure_airport: {
    id: number;
    name: string;
    city_id: number;
    IATA_code: string;
  };
  arrival_airport: {
    id: number;
    name: string;
    city_id: number;
    IATA_code: string;
  };
}

const FlightAdmin = () => {
  const [data, setData] = useState<Flight[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>();
  const [error, setError] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedFlightId, setSelectedFlightId] = useState<number | null>(null);

  const token = localStorage.getItem("token");

  const fetchFlights = useCallback(async () => {
    try {
      const params = {
        page,
      };

      const res = await axios.get("http://127.0.0.1:8000/api/flight", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        params,
      });
      console.log(res);
      if (res.data.data.length === 0) {
        setError("No flights found!");
        return;
      }

      if (res.data.status === "success") {
        setData(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      setError("Faild to load data!");
    } finally {
      setLoading(false);
    }
  }, [page, token]);

  useEffect(() => {
    fetchFlights();
  }, [page]);

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

        fetchFlights(); // Refresh the table
      } catch (err) {
        console.error("Error deleting flight:", err);
        alert("Failed to delete flight");
      }
    },
    [token, fetchFlights]
  );

  const handleCreateSuccess = useCallback(() => {
    fetchFlights(); // Refresh the table
  }, [fetchFlights]);

  const handleEditSuccess = useCallback(() => {
    fetchFlights(); // Refresh the table
  }, [fetchFlights]);

  const columns = useMemo<ColumnDef<Flight>[]>(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        enableSorting: true,
      },
      {
        header: "Airline",
        accessorKey: "airline",
        enableSorting: true,
      },
      {
        header: "Arrival Airport",
        accessorKey: "arrival_airport.name",
        enableSorting: true,
      },
      {
        header: "Departure Airport",
        accessorKey: "departure_airport.name",
        enableSorting: true,
      },
      {
        header: "Departure Time",
        accessorKey: "departure_time",
        cell: (info) => {
          const date = new Date(info.getValue() as string);
          return date.toLocaleString();
        },
        enableSorting: true,
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

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Flight Management</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Create New Flight
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <TableContainer
        title="Flights List"
        data={data}
        columns={columns}
        loading={loading}
        sorting={sorting}
        onSortingChange={setSorting}
        pagination={pagination || undefined}
        onPageChange={pagination ? setPage : undefined}
        emptyMessage="No Flights found"
      />

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
