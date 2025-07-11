import { useEffect, useState, useCallback } from "react";
import { SortingState } from "@tanstack/react-table";

import { FaPlus } from "react-icons/fa";
import {
  TableContainer,
  ActionButtons,
  createViewAction,
  createEditAction,
  createDeleteAction,
} from "../../../components/ui/table";
import CreatePermissionModal from "./CreatePermissionModal";
import EditPermissionModal from "./EditPermissionModal";
import ShowPermissionModal from "./ShowPermissionModal";
import DeletePermissionModal from "./DeletePermissionModal";

interface Role {
  id: number;
  name: string;
  guard: string;
}

interface Permission {
  id: number;
  name: string;
  guard: string;
  created_at: string;
  related_roles: Role[];
}

import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

const Permissions = () => {
  const [data, setData] = useState<Permission[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);
  const [selectedPermissionId, setSelectedPermissionId] = useState<
    number | null
  >(null);

  const token = localStorage.getItem("token");

  const fetchPermissions = useCallback(
    async (pageNumber: number) => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/permission?page=${pageNumber}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const json = await res.json();
        if (json.status === "success") {
          setData(json.data || []);
          setTotalPages(json.pagination?.total_pages || 1);
        } else {
          setError("Failed to load permissions");
        }
      } catch (err) {
        setError("Failed to load permissions");
        console.error("Failed to fetch permissions:", err);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // Handler functions
  const handleView = useCallback((permission: Permission) => {
    setSelectedPermissionId(permission.id);
    setIsShowModalOpen(true);
  }, []);

  const handleEdit = useCallback((permission: Permission) => {
    setSelectedPermission(permission);
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback((permission: Permission) => {
    setSelectedPermission(permission);
    setIsDeleteModalOpen(true);
  }, []);

  const handleCreateSuccess = useCallback(() => {
    fetchPermissions(page); // Refresh the table
    toast.success("Permission created successfully");
  }, [fetchPermissions, page]);

  const handleEditSuccess = useCallback(() => {
    fetchPermissions(page); // Refresh the table
    toast.info("Permission updated successfully");
  }, [fetchPermissions, page]);

  const handleDeleteSuccess = useCallback(() => {
    fetchPermissions(page); // Refresh the table
    toast.error("Permission deleted successfully");
  }, [fetchPermissions, page]);

  useEffect(() => {
    fetchPermissions(page);
  }, [page, fetchPermissions]);

  const columns = useMemo<ColumnDef<Permission>[]>(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        enableSorting: true,
      },
      {
        header: "Name",
        accessorKey: "name",
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

  // Create pagination object for TableContainer
  const paginationData = {
    current_page: page,
    total_pages: totalPages,
    next_page_url: page < totalPages ? "next" : null,
    prev_page_url: page > 1 ? "prev" : null,
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Permissions Management</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <FaPlus />
          Create New Permission
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
        pagination={paginationData}
        onPageChange={setPage}
        emptyMessage="No permissions found"
      />

      {/* Modals */}
      <CreatePermissionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <EditPermissionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        permission={selectedPermission}
      />

      <ShowPermissionModal
        isOpen={isShowModalOpen}
        onClose={() => setIsShowModalOpen(false)}
        permissionId={selectedPermissionId}
      />

      <DeletePermissionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={handleDeleteSuccess}
        permission={selectedPermission}
      />
    </div>
  );
};

export default Permissions;
