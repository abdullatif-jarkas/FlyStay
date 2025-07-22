import React, { useState } from "react";
import axios from "axios";
import { FaTrash, FaTimes, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { User, ROLE_PERMISSION_ENDPOINTS } from "../../../types/rolePermission";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  user,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationText, setConfirmationText] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (confirmationText !== user.name) {
      setError("Please type the user name exactly to confirm deletion");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.delete(
        `${ROLE_PERMISSION_ENDPOINTS.DELETE_USER}/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        onSuccess();
        onClose();
        setConfirmationText("");
      } else {
        setError(response.data.message || "Failed to delete user");
      }
    } catch (err: any) {
      console.error("Error deleting user:", err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.errors?.name?.[0] ||
        "Failed to delete user"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmationText("");
    setError("");
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FaTrash className="text-red-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              Delete User
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center mb-2">
              <FaExclamationTriangle className="text-red-500 mr-2" />
              <p className="font-medium text-red-800">Danger Zone</p>
            </div>
            <p className="text-sm text-red-700">
              You are about to permanently delete the user "{user.name}". 
              This action cannot be undone and will remove all associated data, roles, and permissions.
            </p>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">User to delete:</p>
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            {user.roles && user.roles.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                This user has {user.roles.length} role(s) assigned
              </p>
            )}
            {user.permissions && user.permissions.length > 0 && (
              <p className="text-sm text-gray-500">
                This user has {user.permissions.length} direct permission(s) assigned
              </p>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type "{user.name}" to confirm deletion:
            </label>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder={`Type "${user.name}" here`}
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || confirmationText !== user.name}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && <FaSpinner className="animate-spin mr-2" />}
              {loading ? "Deleting..." : "Delete User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteUserModal;
