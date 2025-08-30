import React, { useState } from "react";
import axios from "axios";
import { FaExclamationTriangle, FaTrash } from "react-icons/fa";

interface Permission {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  permissions?: Permission[];
}

interface DeleteRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  role: Role | null;
}

const DeleteRoleModal: React.FC<DeleteRoleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  role,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    if (!role) return;

    setLoading(true);
    setError("");

    try {
      await axios.delete(`http://127.0.0.1:8000/api/role/${role.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete role"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  if (!isOpen || !role) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0">
            <FaExclamationTriangle className="text-red-500 text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Delete Role</h2>
            <p className="text-gray-600 text-sm">
              This action cannot be undone
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete the role{" "}
            <strong>"{role.name}"</strong>?
          </p>

          {role.permissions && role.permissions.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-sm font-medium mb-2">
                ⚠️ This role has {role.permissions.length} permission(s)
                assigned:
              </p>
              <div className="flex flex-wrap gap-1">
                {role.permissions.slice(0, 3).map((permission) => (
                  <span
                    key={permission.id}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800"
                  >
                    {permission.name}
                  </span>
                ))}
                {role.permissions.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                    +{role.permissions.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Deleting...
              </>
            ) : (
              <>
                <FaTrash />
                Delete Role
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteRoleModal;
