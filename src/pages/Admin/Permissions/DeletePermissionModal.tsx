import React, { useState } from "react";
import axios from "axios";
import { FaExclamationTriangle, FaTrash, FaUsers } from "react-icons/fa";

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

interface DeletePermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  permission: Permission | null;
}

const DeletePermissionModal: React.FC<DeletePermissionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  permission,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    if (!permission) return;

    setLoading(true);
    setError("");

    try {
      await axios.delete(`http://127.0.0.1:8000/api/permission/${permission.id}`, {
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
        "Failed to delete permission"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  if (!isOpen || !permission) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0">
            <FaExclamationTriangle className="text-red-500 text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Delete Permission</h2>
            <p className="text-gray-600 text-sm">This action cannot be undone</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete the permission <strong>"{permission.name}"</strong>?
          </p>
          
          {/* Permission Details */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <label className="block text-gray-600 font-medium">ID</label>
                <p className="text-gray-800 font-mono">{permission.id}</p>
              </div>
              <div>
                <label className="block text-gray-600 font-medium">Guard</label>
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                  {permission.guard}
                </span>
              </div>
            </div>
          </div>

          {/* Associated Roles Warning */}
          {permission.related_roles.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <FaUsers className="text-yellow-600" />
                <p className="text-yellow-800 text-sm font-medium">
                  ⚠️ This permission is associated with {permission.related_roles.length} role(s):
                </p>
              </div>
              <div className="flex flex-wrap gap-1">
                {permission.related_roles.slice(0, 3).map((role) => (
                  <span
                    key={role.id}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800"
                  >
                    {role.name}
                  </span>
                ))}
                {permission.related_roles.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                    +{permission.related_roles.length - 3} more
                  </span>
                )}
              </div>
              <p className="text-yellow-700 text-xs mt-2">
                Deleting this permission may affect the functionality of these roles.
              </p>
            </div>
          )}

          {/* Creation Date Info */}
          <div className="mt-3 text-xs text-gray-500">
            Created: {new Date(permission.created_at).toLocaleDateString()}
          </div>
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
                Delete Permission
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePermissionModal;
