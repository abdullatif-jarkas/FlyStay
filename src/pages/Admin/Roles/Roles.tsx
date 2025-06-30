import axios from "axios";
import { useEffect, useState, useMemo, useCallback } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  FaChevronDown,
  FaChevronUp,
  FaPlus,
} from "react-icons/fa";
import {
  TableContainer,
  ActionButtons,
  createViewAction,
  createEditAction,
  createDeleteAction,
  Badge,
} from "../../../components/ui/table";
import CreateRoleModal from "./CreateRoleModal";
import EditRoleModal from "./EditRoleModal";
import ShowRoleModal from "./ShowRoleModal";
import DeleteRoleModal from "./DeleteRoleModal";

type Permission = {
  id: number;
  name: string;
};

type Role = {
  id: number;
  name: string;
  permissions: Permission[];
};

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [error, setError] = useState("");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  const token = localStorage.getItem("token");

  const fetchRoles = useCallback(async () => {
    try {
      setError("");
      const res = await axios.get("http://127.0.0.1:8000/api/role", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.data.status === "success") {
        setRoles(res.data.data);
      } else {
        setError("Failed to load roles");
      }
    } catch (err: any) {
      setError("Failed to load roles");
      console.error("Error fetching roles:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Handler functions
  const handleView = useCallback((role: Role) => {
    setSelectedRoleId(role.id);
    setIsShowModalOpen(true);
  }, []);

  const handleEdit = useCallback((role: Role) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback((role: Role) => {
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  }, []);

  const handleCreateSuccess = useCallback(() => {
    fetchRoles(); // Refresh the table
  }, [fetchRoles]);

  const handleEditSuccess = useCallback(() => {
    fetchRoles(); // Refresh the table
  }, [fetchRoles]);

  const handleDeleteSuccess = useCallback(() => {
    fetchRoles(); // Refresh the table
  }, [fetchRoles]);

  const toggleExpand = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const columns = useMemo<ColumnDef<Role>[]>(
    () => [
      {
        header: "#",
        accessorFn: (_, index) => index + 1,
        id: "index",
        enableSorting: false,
      },
      {
        header: "Role Name",
        accessorKey: "name",
        cell: (info) => (
          <span className="font-medium capitalize">
            {info.getValue() as string}
          </span>
        ),
        enableSorting: true,
      },
      {
        header: "Permissions Count",
        accessorFn: (row) => row.permissions.length,
        id: "permissionsCount",
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
    [expandedRows, handleView, handleEdit, handleDelete]
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Roles Management</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <FaPlus />
          Create New Role
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <TableContainer
        data={roles}
        columns={columns}
        loading={loading}
        sorting={sorting}
        onSortingChange={setSorting}
      />

      {/* Modals */}
      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <EditRoleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        role={selectedRole}
      />

      <ShowRoleModal
        isOpen={isShowModalOpen}
        onClose={() => setIsShowModalOpen(false)}
        roleId={selectedRoleId}
      />

      <DeleteRoleModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={handleDeleteSuccess}
        role={selectedRole}
      />
    </div>
  );
};

export default Roles;
