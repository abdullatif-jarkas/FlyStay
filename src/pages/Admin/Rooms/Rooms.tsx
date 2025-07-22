import { useEffect, useMemo, useState, useCallback } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import axios from "axios";
import {
  FaPlus,
  FaImages,
  FaBed,
  FaUsers,
  FaDollarSign,
} from "react-icons/fa";
import { TableContainer } from "../../../components/ui/table";
import { ActionButtons } from "../../../components/ui/table";
import { Room } from "../../../types/room";
import ShowRoomModal from "./ShowRoomModal";
import EditRoomModal from "./EditRoomModal";
import CreateRoomModal from "./CreateRoomModal";
import DeleteRoomModal from "./DeleteRoomModal";
import UpdateRoomImagesModal from "./UpdateRoomImagesModal";

const Rooms = () => {
  const [data, setData] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateImagesModalOpen, setUpdateImagesModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const token = localStorage.getItem("token");

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params: any = {
        page,
      };
      const res = await axios.get("http://127.0.0.1:8000/api/room", {
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
        setError("Failed to load rooms");
      }
    } catch (err) {
      setError("Failed to load data!");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, token]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Modal handlers
  const handleCreateSuccess = useCallback(() => {
    fetchRooms();
    setCreateModalOpen(false);
  }, [fetchRooms]);

  const handleEditSuccess = useCallback(() => {
    fetchRooms();
    setEditModalOpen(false);
    setSelectedRoom(null);
  }, [fetchRooms]);

  const handleDeleteSuccess = useCallback(() => {
    fetchRooms();
    setDeleteModalOpen(false);
    setSelectedRoom(null);
  }, [fetchRooms]);

  const handleUpdateImagesSuccess = useCallback(() => {
    fetchRooms();
    setUpdateImagesModalOpen(false);
    setSelectedRoom(null);
  }, [fetchRooms]);

  // Action handlers
  const handleView = useCallback((room: Room) => {
    setSelectedRoomId(room.id);
    setShowModalOpen(true);
  }, []);

  const handleEdit = useCallback((room: Room) => {
    setSelectedRoom(room);
    setEditModalOpen(true);
  }, []);

  const handleDelete = useCallback((room: Room) => {
    setSelectedRoom(room);
    setDeleteModalOpen(true);
  }, []);

  const handleManageImages = useCallback((room: Room) => {
    setSelectedRoom(room);
    setUpdateImagesModalOpen(true);
  }, []);

  const columns = useMemo<ColumnDef<Room>[]>(
    () => [
      {
        header: "#",
        accessorFn: (_, index) => index + 1,
        id: "index",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="text-gray-600 font-medium">
            {row.index + 1 + (page - 1) * 10}
          </div>
        ),
      },
      {
        header: "Room Type",
        accessorKey: "room_type",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <FaBed className="text-primary-500" />
            <div className="font-medium text-gray-800 capitalize">
              {row.original.room_type.replace('_', ' ')}
            </div>
          </div>
        ),
      },
      {
        header: "Hotel",
        accessorKey: "hotel.name",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="text-gray-700">{row.original.hotel.name}</div>
        ),
      },
      {
        header: "Price per Night",
        accessorKey: "price_per_night",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-1 font-semibold text-green-600">
            <FaDollarSign className="text-sm" />
            {row.original.price_per_night}
          </div>
        ),
      },
      {
        header: "Capacity",
        accessorKey: "capacity",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-1 text-gray-700">
            <FaUsers className="text-primary-500" />
            {row.original.capacity} guests
          </div>
        ),
      },
      {
        header: "Images",
        accessorKey: "images",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-1 text-gray-600">
            <FaImages className="text-primary-500" />
            {row.original.images?.length || 0} photos
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
    [page, handleView, handleEdit, handleDelete, handleManageImages]
  );

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Rooms Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage room listings, images, and details
              </p>
            </div>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              <FaPlus />
              Create New Room
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
            emptyMessage="No rooms found"
          />
        </div>
      </div>

      {/* Modals */}
      <CreateRoomModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <EditRoomModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedRoom(null);
        }}
        onSuccess={handleEditSuccess}
        room={selectedRoom}
      />

      <ShowRoomModal
        isOpen={showModalOpen}
        onClose={() => {
          setShowModalOpen(false);
          setSelectedRoomId(null);
        }}
        roomId={selectedRoomId}
      />

      <DeleteRoomModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedRoom(null);
        }}
        onSuccess={handleDeleteSuccess}
        room={selectedRoom}
      />

      <UpdateRoomImagesModal
        isOpen={updateImagesModalOpen}
        onClose={() => {
          setUpdateImagesModalOpen(false);
          setSelectedRoom(null);
        }}
        onSuccess={handleUpdateImagesSuccess}
        room={selectedRoom}
      />
    </div>
  );
};

export default Rooms;
