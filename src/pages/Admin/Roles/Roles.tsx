import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import {
  TableContainer,
  ActionButtons,
  createViewAction,
  createEditAction,
  createDeleteAction,
  Badge,
} from "../../../components/ui/table";

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

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token"); // أو حسب مكان حفظ التوكن
      const res = await axios.get("http://127.0.0.1:8000/api/role", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoles(res.data.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

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
        header: "Permissions",
        accessorKey: "permissions",
        cell: ({ row }) => {
          const isExpanded = expandedRows.includes(row.original.id);
          return (
            <div>
              <button
                className="flex items-center gap-1 text-primary-600 hover:underline"
                onClick={() => toggleExpand(row.original.id)}
              >
                {isExpanded ? (
                  <>
                    <FaChevronUp />
                    Hide
                  </>
                ) : (
                  <>
                    <FaChevronDown />
                    Show ({row.original.permissions.length})
                  </>
                )}
              </button>
              {isExpanded && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {row.original.permissions.map((permission) => (
                    <Badge key={permission.id} variant="secondary" size="sm">
                      {permission.name}
                    </Badge>
                  ))}
                </div>
              )}
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
              createViewAction(() => console.log("View", row.original)),
              createEditAction(() => console.log("Edit", row.original)),
              createDeleteAction(() => console.log("Delete", row.original)),
            ]}
          />
        ),
        enableSorting: false,
      },
    ],
    [expandedRows]
  );

  return (
    <div className="p-4">
      <TableContainer
        title="Roles Table"
        data={roles}
        columns={columns}
        loading={loading}
        sorting={sorting}
        onSortingChange={setSorting}
        emptyMessage="No roles found"
      />{" "}
    </div>
  );
};

export default Roles;
