import axios from "axios";
import { useEffect, useState, useMemo, useCallback } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { FaPlus, FaKey, FaUserPlus, FaUserMinus } from "react-icons/fa";
import {
  TableContainer,
  ActionButtons,
  createViewAction,
  createEditAction,
  createDeleteAction,
} from "../../../components/ui/table";
import CreateRoleModal from "./CreateRoleModal";
import EditRoleModal from "./EditRoleModal";
import ShowRoleModal from "./ShowRoleModal";
import DeleteRoleModal from "./DeleteRoleModal";
import AssignPermissionToRoleModal from "./AssignPermissionToRoleModal";
import RemovePermissionFromRoleModal from "./RemovePermissionFromRoleModal";
import { toast } from "sonner";
import {
  Permission,
  Role,
  ROLE_PERMISSION_ENDPOINTS,
} from "../../../types/rolePermission";

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [error, setError] = useState("");

  // Available permissions for dropdowns
  const [availablePermissions, setAvailablePermissions] = useState<
    Permission[]
  >([]);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAssignPermissionModalOpen, setIsAssignPermissionModalOpen] =
    useState(false);
  const [isRemovePermissionModalOpen, setIsRemovePermissionModalOpen] =
    useState(false);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);

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

  const fetchPermissions = useCallback(async () => {
    try {
      const res = await axios.get(ROLE_PERMISSION_ENDPOINTS.PERMISSIONS, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.data.status === "success") {
        setAvailablePermissions(res.data.data);
      }
    } catch (err: any) {
      console.error("Error fetching permissions:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [fetchRoles, fetchPermissions]);

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

  const handleAssignPermission = useCallback((role: Role) => {
    setSelectedRole(role);
    setIsAssignPermissionModalOpen(true);
  }, []);

  const handleRemovePermission = useCallback(
    (role: Role, permission: Permission) => {
      setSelectedRole(role);
      setSelectedPermission(permission);
      setIsRemovePermissionModalOpen(true);
    },
    []
  );

  const handleCreateSuccess = useCallback(() => {
    fetchRoles(); // Refresh the table
    toast.success("Role created successfully");
  }, [fetchRoles]);

  const handleEditSuccess = useCallback(() => {
    fetchRoles(); // Refresh the table
    toast.info("Role updated successfully");
  }, [fetchRoles]);

  const handleDeleteSuccess = useCallback(() => {
    fetchRoles(); // Refresh the table
    toast.error("Role deleted successfully");
  }, [fetchRoles]);

  const handlePermissionSuccess = useCallback(() => {
    fetchRoles(); // Refresh the table
    toast.success("Permission operation completed successfully");
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
            additionalActions={[
              {
                label: "Assign Permission",
                onClick: () => handleAssignPermission(row.original),
                icon: <FaKey className="w-4 h-4" />,
                variant: "primary",
              },
            ]}
          />
        ),
        enableSorting: false,
      },
    ],
    [expandedRows, handleView, handleEdit, handleDelete, handleAssignPermission]
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

      <AssignPermissionToRoleModal
        isOpen={isAssignPermissionModalOpen}
        onClose={() => setIsAssignPermissionModalOpen(false)}
        onSuccess={handlePermissionSuccess}
        role={selectedRole}
        availablePermissions={availablePermissions}
      />

      <RemovePermissionFromRoleModal
        isOpen={isRemovePermissionModalOpen}
        onClose={() => setIsRemovePermissionModalOpen(false)}
        onSuccess={handlePermissionSuccess}
        role={selectedRole}
        permissionToRemove={selectedPermission}
      />
    </div>
  );
};

export default Roles;
