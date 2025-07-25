import React, { useState } from "react";
import axios from "axios";
import { FaKey, FaTimes, FaSpinner, FaExclamationTriangle, FaUserShield } from "react-icons/fa";
import { RemovePermissionFromRoleModalProps, ROLE_PERMISSION_ENDPOINTS } from "../../../types/rolePermission";

const RemovePermissionFromRoleModal: React.FC<RemovePermissionFromRoleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  role,
  permissionToRemove,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationText, setConfirmationText] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !permissionToRemove) return;

    if (confirmationText !== permissionToRemove.name) {
      setError("Please type the permission name exactly to confirm removal");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("role_name", role.name);
      formData.append("permission_name", permissionToRemove.name);

      const response = await axios.post(
        ROLE_PERMISSION_ENDPOINTS.REMOVE_PERMISSION_FROM_ROLE,
        formData,
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
        setError(response.data.message || "Failed to remove permission from role");
      }
    } catch (err: any) {
      console.error("Error removing permission from role:", err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.errors?.permission_name?.[0] ||
        err.response?.data?.errors?.role_name?.[0] ||
        "Failed to remove permission from role"
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

  if (!isOpen || !role || !permissionToRemove) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FaKey className="text-red-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              Remove Permission from Role
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
              <p className="font-medium text-red-800">Warning</p>
            </div>
            <p className="text-sm text-red-700">
              You are about to remove the permission "{permissionToRemove.name}" from role "{role.name}". 
              This will affect all users who have this role and will revoke this permission from them 
              (unless they have it through another role or direct assignment).
            </p>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Role:</p>
            <div className="flex items-center mt-1">
              <FaUserShield className="text-blue-500 mr-2" />
              <p className="font-medium text-gray-900">{role.name}</p>
            </div>
            {role.permissions && (
              <p className="text-sm text-gray-500 mt-1">
                Currently has {role.permissions.length} permission(s)
              </p>
            )}
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Permission to remove:</p>
            <p className="font-medium text-gray-900">{permissionToRemove.name}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type "{permissionToRemove.name}" to confirm removal:
            </label>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder={`Type "${permissionToRemove.name}" here`}
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
              disabled={loading || confirmationText !== permissionToRemove.name}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && <FaSpinner className="animate-spin mr-2" />}
              {loading ? "Removing..." : "Remove Permission"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RemovePermissionFromRoleModal;
