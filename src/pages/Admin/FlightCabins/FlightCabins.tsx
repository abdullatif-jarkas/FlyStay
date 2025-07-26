import { useEffect, useMemo, useState, useCallback } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { toast } from "sonner";
import {
  TableContainer,
  ActionButtons,
  createViewAction,
  createEditAction,
  createDeleteAction,
} from "../../../components/ui/table";
import {
  FlightCabin,
  FlightCabinResponse,
  FLIGHT_CABIN_ENDPOINTS,
  formatPrice,
  getClassBadgeColor,
  formatFlightRoute,
  formatDateTime,
} from "../../../types/flightCabin";
import CreateFlightCabinModal from "./CreateFlightCabinModal";
import EditFlightCabinModal from "./EditFlightCabinModal";
import ShowFlightCabinModal from "./ShowFlightCabinModal";
import DeleteFlightCabinModal from "./DeleteFlightCabinModal";

export interface Pagination {
  current_page: number;
  total_pages: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  per_page: number;
  total: number;
}

const FlightCabins = () => {
  const [data, setData] = useState<FlightCabin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFlightCabin, setSelectedFlightCabin] = useState<FlightCabin | null>(null);
  const [selectedFlightCabinId, setSelectedFlightCabinId] = useState<number | null>(null);

  const token = localStorage.getItem("token");

  const fetchFlightCabins = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params: any = {
        page,
      };

      if (sorting.length > 0) {
        const sort = sorting[0];
        params.sort_by = sort.id;
        params.sort_direction = sort.desc ? "desc" : "asc";
      }

      const response = await axios.get(
        `http://127.0.0.1:8000${FLIGHT_CABIN_ENDPOINTS.LIST}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          params,
        }
      );

      if (response.data.status === "success") {
        const responseData: FlightCabinResponse = response.data;
        setData(responseData.data);
        if (responseData.pagination) {
          setPagination(responseData.pagination);
        }
      } else {
        setError("Failed to fetch flight cabins");
      }
    } catch (err: any) {
      setError("Failed to fetch flight cabins");
      console.error("Error fetching flight cabins:", err);
    } finally {
      setLoading(false);
    }
  }, [page, sorting, token]);

  useEffect(() => {
    fetchFlightCabins();
  }, [fetchFlightCabins]);

  const handleView = useCallback((flightCabin: FlightCabin) => {
    setSelectedFlightCabinId(flightCabin.id);
    setShowModalOpen(true);
  }, []);

  const handleEdit = useCallback((flightCabin: FlightCabin) => {
    setSelectedFlightCabin(flightCabin);
    setEditModalOpen(true);
  }, []);

  const handleDelete = useCallback((flightCabin: FlightCabin) => {
    setSelectedFlightCabin(flightCabin);
    setDeleteModalOpen(true);
  }, []);

  const handleCreateSuccess = useCallback(() => {
    fetchFlightCabins();
    toast.success("Flight cabin created successfully");
  }, [fetchFlightCabins]);

  const handleEditSuccess = useCallback(() => {
    fetchFlightCabins();
    toast.info("Flight cabin updated successfully");
  }, [fetchFlightCabins]);

  const handleDeleteSuccess = useCallback(() => {
    fetchFlightCabins();
    toast.error("Flight cabin deleted successfully");
  }, [fetchFlightCabins]);

  const columns = useMemo<ColumnDef<FlightCabin>[]>(
    () => [
      {
        header: "#",
        accessorFn: (_, index) => (page - 1) * (pagination?.per_page || 10) + index + 1,
        id: "index",
        enableSorting: false,
      },
      {
        header: "Flight Info",
        accessorKey: "flight",
        cell: (info) => {
          const flight = info.getValue() as FlightCabin["flight"];
          return (
            <div className="space-y-1">
              <div className="font-medium text-gray-900">
                {flight.airline} {flight.flight_number}
              </div>
              <div className="text-sm text-gray-600">
                {formatFlightRoute(flight)}
              </div>
              <div className="text-xs text-gray-500">
                {formatDateTime(flight.departure_time)}
              </div>
            </div>
          );
        },
        enableSorting: false,
      },
      {
        header: "Class",
        accessorKey: "class_name",
        cell: (info) => {
          const className = info.getValue() as string;
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getClassBadgeColor(
                className
              )}`}
            >
              {className}
            </span>
          );
        },
        enableSorting: true,
      },
      {
        header: "Price",
        accessorKey: "price",
        cell: (info) => (
          <span className="font-medium text-green-600">
            {formatPrice(info.getValue() as string)}
          </span>
        ),
        enableSorting: true,
      },
      {
        header: "Available Seats",
        accessorKey: "available_seats",
        cell: (info) => {
          const seats = info.getValue() as number;
          const bookings = (info.row.original.bookings || []).length;
          return (
            <div className="space-y-1">
              <div className="font-medium">{seats} available</div>
              {bookings > 0 && (
                <div className="text-xs text-gray-500">{bookings} booked</div>
              )}
            </div>
          );
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
    [page, pagination?.per_page, handleView, handleEdit, handleDelete]
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Flight Cabins Management</h1>
          <p className="text-gray-600 mt-1">Manage flight cabin classes and pricing</p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <FaPlus />
          Add Flight Cabin
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <TableContainer
        data={data}
        columns={columns}
        loading={loading}
        sorting={sorting}
        onSortingChange={setSorting}
        pagination={
          pagination
            ? {
                pageIndex: pagination.current_page - 1,
                pageSize: pagination.per_page,
                pageCount: pagination.total_pages,
                canPreviousPage: pagination.current_page > 1,
                canNextPage: pagination.current_page < pagination.total_pages,
                previousPage: () => setPage(Math.max(1, page - 1)),
                nextPage: () => setPage(Math.min(pagination.total_pages, page + 1)),
                setPageIndex: (pageIndex: number) => setPage(pageIndex + 1),
              }
            : undefined
        }
      />

      {/* Modals */}
      <CreateFlightCabinModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <EditFlightCabinModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        flightCabin={selectedFlightCabin}
      />

      <ShowFlightCabinModal
        isOpen={showModalOpen}
        onClose={() => setShowModalOpen(false)}
        flightCabinId={selectedFlightCabinId}
      />

      <DeleteFlightCabinModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onSuccess={handleDeleteSuccess}
        flightCabin={selectedFlightCabin}
      />
    </div>
  );
};

export default FlightCabins;
