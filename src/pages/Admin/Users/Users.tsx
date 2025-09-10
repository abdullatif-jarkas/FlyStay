import { useEffect, useMemo, useState, useCallback } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import axios from "axios";
import { FaKey, FaUserPlus, FaUsers, FaTimes, FaTrash } from "react-icons/fa";
import { TableContainer, ActionButtons } from "../../../components/ui/table";
import { toast } from "sonner";
import {
  User,
  Role,
  Permission,
  ROLE_PERMISSION_ENDPOINTS,
} from "../../../types/rolePermission";
import AssignRoleModal from "./AssignRoleModal";
import RemoveRoleModal from "./RemoveRoleModal";
import AssignPermissionToUserModal from "./AssignPermissionToUserModal";
import RemovePermissionFromUserModal from "./RemovePermissionFromUserModal";
import ShowUserModal from "./ShowUserModal";
import DeleteUserModal from "./DeleteUserModal";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Available roles and permissions for dropdowns
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<
    Permission[]
  >([]);

  // Modal states
  const [isAssignRoleModalOpen, setIsAssignRoleModalOpen] = useState(false);
  const [isRemoveRoleModalOpen, setIsRemoveRoleModalOpen] = useState(false);
  const [isAssignPermissionModalOpen, setIsAssignPermissionModalOpen] =
    useState(false);
  const [isRemovePermissionModalOpen, setIsRemovePermissionModalOpen] =
    useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);

  const token = localStorage.getItem("token");

  const fetchUsers = useCallback(
    async (currentPage = 1) => {
      try {
        setError("");
        setLoading(true);
        const res = await axios.get(
          `${ROLE_PERMISSION_ENDPOINTS.USERS}?page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (res.data.status === "success") {
          setUsers(res.data.data);
          if (res.data.pagination) {
            setTotalPages(res.data.pagination.total_pages);
            setTotalResults(res.data.pagination.total);
          }
        } else {
          setError("Failed to load users");
        }
      } catch (err: any) {
        setError("Failed to load users");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const fetchRoles = useCallback(async () => {
    try {
      const res = await axios.get(ROLE_PERMISSION_ENDPOINTS.ROLES, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.data.status === "success") {
        setAvailableRoles(res.data.data);
      }
    } catch (err: any) {
      console.error("Error fetching roles:", err);
    }
  }, [token]);

  const fetchPermissions = useCallback(async () => {
    try {
      // أول شي منجيب الصفحة الأولى
      const firstPageResponse = await axios.get(
        `${ROLE_PERMISSION_ENDPOINTS.PERMISSIONS}?page=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (firstPageResponse.data.status === "success") {
        const firstPageData = firstPageResponse.data;
        let allPermissions = [...firstPageData.data];

        // نجيب عدد الصفحات الكاملة
        const totalPages = firstPageData.pagination?.total_pages || 1;

        if (totalPages > 1) {
          // منجهز كل الطلبات لباقي الصفحات
          const pagePromises: Promise<import("axios").AxiosResponse<any>>[] =
            [];

          for (let page = 2; page <= totalPages; page++) {
            const pagePromise = axios.get(
              `${ROLE_PERMISSION_ENDPOINTS.PERMISSIONS}?page=${page}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
              }
            );
            pagePromises.push(pagePromise);
          }

          // مننتظر كل الطلبات مع بعض
          const pageResponses = await Promise.all(pagePromises);

          // مندمج النتائج كلها
          pageResponses.forEach((response) => {
            if (response.data.status === "success") {
              allPermissions = [...allPermissions, ...response.data.data];
            }
          });
        }

        // منحفظ كل الصلاحيات بالـ state
        setAvailablePermissions(allPermissions);
      }
    } catch (err: any) {
      console.error("Error fetching permissions:", err);
      setAvailablePermissions([]);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers(page);
    fetchRoles();
    fetchPermissions();
  }, [page, fetchUsers, fetchRoles, fetchPermissions]);

  // Handler functions
  const handleView = useCallback((user: User) => {
    setSelectedUserId(user.id);
    setIsShowModalOpen(true);
  }, []);

  const handleAssignRole = useCallback((user: User) => {
    setSelectedUser(user);
    setIsAssignRoleModalOpen(true);
  }, []);

  const handleRemoveRole = useCallback((user: User, role: Role) => {
    setSelectedUser(user);
    setSelectedRole(role);
    setIsRemoveRoleModalOpen(true);
  }, []);

  const handleAssignPermission = useCallback((user: User) => {
    setSelectedUser(user);
    setIsAssignPermissionModalOpen(true);
  }, []);

  const handleRemovePermission = useCallback(
    (user: User, permission: Permission) => {
      setSelectedUser(user);
      setSelectedPermission(permission);
      setIsRemovePermissionModalOpen(true);
    },
    []
  );

  const handleDeleteUser = useCallback((user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  }, []);

  const handleSuccess = useCallback(() => {
    fetchUsers(page);
    toast.success("Operation completed successfully");
  }, [fetchUsers, page]);

  const columns = useMemo<ColumnDef<User>[]>(
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
        header: "Email",
        accessorKey: "email",
        enableSorting: true,
      },
      {
        header: "Roles",
        accessorFn: (row) => row.roles?.length || 0,
        id: "rolesCount",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.roles?.map((role) => (
              <div
                key={role.id}
                className="group relative inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full hover:bg-blue-200 transition-colors"
              >
                <span>{role.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveRole(row.original, role);
                  }}
                  className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-red-600"
                  title={`Remove role: ${role.name}`}
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        ),
        enableSorting: true,
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <ActionButtons
            onView={() => handleView(row.original)}
            additionalActions={[
              {
                label: "Assign Role",
                onClick: () => handleAssignRole(row.original),
                icon: <FaUserPlus className="w-4 h-4" />,
                variant: "primary",
              },
              {
                label: "Assign Permission",
                onClick: () => handleAssignPermission(row.original),
                icon: <FaKey className="w-4 h-4" />,
                variant: "secondary",
              },
              {
                label: "Delete User",
                onClick: () => handleDeleteUser(row.original),
                icon: <FaTrash className="w-4 h-4" />,
                variant: "danger",
              },
            ]}
          />
        ),
        enableSorting: false,
      },
    ],
    [
      handleView,
      handleAssignRole,
      handleAssignPermission,
      handleRemoveRole,
      handleRemovePermission,
      handleDeleteUser,
    ]
  );

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Users Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage user roles and permissions
              </p>
            </div>
            <div className="flex items-center gap-2">
              <FaUsers className="text-primary-500 text-xl" />
              <span className="text-sm text-gray-600">
                {totalResults} Total Users
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <TableContainer
            data={users}
            columns={columns}
            loading={loading}
            sorting={sorting}
            onSortingChange={setSorting}
            pagination={{
              current_page: page,
              total_pages: totalPages,
              total_results: totalResults,
              per_page: 10,
              next_page_url: null,
              prev_page_url: null,
            }}
            onPageChange={setPage}
            emptyMessage="No users found"
          />
        </div>
      </div>

      {/* Modals */}
      <AssignRoleModal
        isOpen={isAssignRoleModalOpen}
        onClose={() => setIsAssignRoleModalOpen(false)}
        onSuccess={handleSuccess}
        user={selectedUser}
        availableRoles={availableRoles}
      />

      <RemoveRoleModal
        isOpen={isRemoveRoleModalOpen}
        onClose={() => setIsRemoveRoleModalOpen(false)}
        onSuccess={handleSuccess}
        user={selectedUser}
        roleToRemove={selectedRole}
      />

      <AssignPermissionToUserModal
        isOpen={isAssignPermissionModalOpen}
        onClose={() => setIsAssignPermissionModalOpen(false)}
        onSuccess={handleSuccess}
        user={selectedUser}
        availablePermissions={availablePermissions}
      />

      <RemovePermissionFromUserModal
        isOpen={isRemovePermissionModalOpen}
        onClose={() => setIsRemovePermissionModalOpen(false)}
        onSuccess={handleSuccess}
        user={selectedUser}
        permissionToRemove={selectedPermission}
      />

      <ShowUserModal
        isOpen={isShowModalOpen}
        onClose={() => setIsShowModalOpen(false)}
        userId={selectedUserId}
        onRemoveRole={handleRemoveRole}
        onRemovePermission={handleRemovePermission}
      />

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={handleSuccess}
        user={selectedUser}
      />
    </div>
  );
};

export default Users;
