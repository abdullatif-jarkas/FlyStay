import React, { useEffect, useState } from "react";
import { SortingState } from "@tanstack/react-table";
import CreatePermission from "./CreatePermission";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import {
  TableContainer,
  ActionButtons,
  createEditAction,
  createDeleteAction,
  Badge,
} from "../../../components/ui/table";

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

const Permissions = () => {
  const [data, setData] = useState<Permission[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);

  const fetchPermissions = async (pageNumber: number) => {
    const token = localStorage.getItem("token");

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
      setData(json.data || []);
      setTotalPages(json.pagination?.total_pages || 1);
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    }
  };

  const handleEdit = (permission: Permission) => {
    // You can open a modal or navigate to edit page
    alert(`Editing permission: ${permission.name}`);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this permission?"
    );
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/permission/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        alert("Permission deleted successfully.");
        fetchPermissions(page); // Refresh table
      } else {
        alert("Failed to delete permission.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong.");
    }
  };

  useEffect(() => {
    fetchPermissions(page);
  }, [page]);

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
        header: "Guard",
        accessorKey: "guard",
        enableSorting: true,
      },
      {
        header: "Created At",
        accessorKey: "created_at",
        cell: (info) => new Date(info.getValue() as string).toLocaleString(),
        enableSorting: true,
      },
      {
        header: "Roles",
        accessorKey: "related_roles",
        cell: (info) => (
          <div className="flex flex-wrap gap-1">
            {(info.getValue() as Role[]).map((role) => (
              <Badge key={role.id} variant="primary" size="sm">
                {role.name}
              </Badge>
            ))}
          </div>
        ),
        enableSorting: false,
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <ActionButtons
            actions={[
              createEditAction(() => handleEdit(row.original)),
              createDeleteAction(() => handleDelete(row.original.id)),
            ]}
          />
        ),
        enableSorting: false,
      },
    ],
    []
  );

  // Create pagination object for TableContainer
  const paginationData = {
    current_page: page,
    total_pages: totalPages,
    next_page_url: page < totalPages ? "next" : null,
    prev_page_url: page > 1 ? "prev" : null,
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Permissions</h1>
      <CreatePermission onCreated={() => fetchPermissions(page)} />

      <TableContainer
        data={data}
        columns={columns}
        // loading={loading}
        sorting={sorting}
        onSortingChange={setSorting}
        pagination={paginationData}
        onPageChange={setPage}
        emptyMessage="No permissions found"
      />
    </div>
  );
};

export default Permissions;
