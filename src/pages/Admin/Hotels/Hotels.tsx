import { useEffect, useMemo, useState, useCallback } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import axios from "axios";
import {
  FaPlus,
  FaImages,
  FaStar,
} from "react-icons/fa";
import { TableContainer } from "../../../components/ui/table";
import { ActionButtons } from "../../../components/ui/table";
import { Hotel } from "../../../types/hotel";
import CreateHotelModal from "./CreateHotelModal";
import EditHotelModal from "./EditHotelModal";
import ShowHotelModal from "./ShowHotelModal";
import DeleteHotelModal from "./DeleteHotelModal";
import UpdateHotelImagesModal from "./UpdateHotelImagesModal";

export interface Pagination {
  current_page: number;
  total_pages: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

const Hotels = () => {
  const [data, setData] = useState<Hotel[]>([]);
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
  const [updateImagesModalOpen, setUpdateImagesModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);

  const token = localStorage.getItem("token");

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params: any = {
        page,
      };
      const res = await axios.get("http://127.0.0.1:8000/api/hotel", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        params,
      });

      if (res.data.status === "success") {
        setData(res.data.data);
        setPagination(res.data.pagination);

        console.log(res.data.data);
      } else {
        setError("Failed to load hotels");
      }
    } catch (err) {
      setError("Failed to load data!");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, token]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  // Modal handlers
  const handleCreateSuccess = useCallback(() => {
    fetchHotels();
    setCreateModalOpen(false);
  }, [fetchHotels]);

  const handleEditSuccess = useCallback(() => {
    fetchHotels();
    setEditModalOpen(false);
    setSelectedHotel(null);
  }, [fetchHotels]);

  const handleDeleteSuccess = useCallback(() => {
    fetchHotels();
    setDeleteModalOpen(false);
    setSelectedHotel(null);
  }, [fetchHotels]);

  const handleUpdateImagesSuccess = useCallback(() => {
    fetchHotels();
    setUpdateImagesModalOpen(false);
    setSelectedHotel(null);
  }, [fetchHotels]);

  // Action handlers
  const handleView = useCallback((hotel: Hotel) => {
    setSelectedHotelId(hotel.id);
    setShowModalOpen(true);
  }, []);

  const handleEdit = useCallback((hotel: Hotel) => {
    setSelectedHotel(hotel);
    setEditModalOpen(true);
  }, []);

  const handleDelete = useCallback((hotel: Hotel) => {
    setSelectedHotel(hotel);
    setDeleteModalOpen(true);
  }, []);

  const handleManageImages = useCallback((hotel: Hotel) => {
    setSelectedHotel(hotel);
    setUpdateImagesModalOpen(true);
  }, []);

  const columns = useMemo<ColumnDef<Hotel>[]>(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        enableSorting: true,
        cell: ({ row }) => (
          <span className="font-mono text-sm">{row.original.id}</span>
        ),
      },
      {
        header: "Hotel Name",
        accessorKey: "name",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="font-medium text-gray-900">{row.original.name}</div>
        ),
      },
      {
        header: "City",
        accessorFn: (row) => `${row.city.name}`,
        id: "city",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="text-gray-700">{row.original.city.name}</div>
        ),
      },
      {
        header: "Rating",
        accessorKey: "rating",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`text-sm ${
                  star <= row.original.rating
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-1 text-gray-600">({row.original.rating})</span>
          </div>
        ),
      },
      {
        header: "Images",
        accessorFn: (row) => row.images?.length || 0,
        id: "images",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <FaImages className="text-blue-500" />
            <span className="text-gray-600">
              {row.original.images?.length || 0}
            </span>
          </div>
        ),
      },
      {
        header: "Actions",
        id: "actions",
        enableSorting: false,
        cell: ({ row }) => (
          <ActionButtons
            onView={() => handleView(row.original)}
            onEdit={() => handleEdit(row.original)}
            onDelete={() => handleDelete(row.original)}
            additionalActions={[
              {
                label: "Manage Images",
                onClick: () => handleManageImages(row.original),
                icon: <FaImages className="w-4 h-4" />,
                variant: "primary",
              },
            ]}
          />
        ),
      },
    ],
    [handleView, handleEdit, handleDelete, handleManageImages]
  );

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Hotels Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage hotel listings, images, and details
              </p>
            </div>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              <FaPlus />
              Create New Hotel
            </button>
          </div>
        </div>

        <div className="p-6">
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
            pagination={pagination || undefined}
            onPageChange={pagination ? setPage : undefined}
            emptyMessage="No hotels found"
          />
        </div>
      </div>

      {/* Modals */}
      <CreateHotelModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <EditHotelModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedHotel(null);
        }}
        onSuccess={handleEditSuccess}
        hotel={selectedHotel}
      />

      <ShowHotelModal
        isOpen={showModalOpen}
        onClose={() => {
          setShowModalOpen(false);
          setSelectedHotelId(null);
        }}
        hotelId={selectedHotelId}
      />

      <DeleteHotelModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedHotel(null);
        }}
        onSuccess={handleDeleteSuccess}
        hotel={selectedHotel}
      />

      <UpdateHotelImagesModal
        isOpen={updateImagesModalOpen}
        onClose={() => {
          setUpdateImagesModalOpen(false);
          setSelectedHotel(null);
        }}
        onSuccess={handleUpdateImagesSuccess}
        hotel={selectedHotel}
      />
    </div>
  );
};

export default Hotels;
