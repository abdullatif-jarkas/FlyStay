import React, { useState } from "react";
import axios from "axios";
import { FaKey, FaTimes, FaSpinner, FaUserShield } from "react-icons/fa";
import {
  AssignPermissionToRoleModalProps,
  ROLE_PERMISSION_ENDPOINTS,
} from "../../../types/rolePermission";

const AssignPermissionToRoleModal: React.FC<
  AssignPermissionToRoleModalProps
> = ({ isOpen, onClose, onSuccess, role, availablePermissions }) => {
  const [selectedPermissionId, setSelectedPermissionId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPermissionId || !role) return;

    setLoading(true);
    setError("");

    try {
      const selectedPermission = availablePermissions.find(
        (permission) => permission.id.toString() === selectedPermissionId
      );
      if (!selectedPermission) {
        setError("Please select a valid permission");
        return;
      }

      const formData = new FormData();
      formData.append("role_name", role.name);
      formData.append("permission_name", selectedPermission.name);

      const response = await axios.post(
        ROLE_PERMISSION_ENDPOINTS.ASSIGN_PERMISSION_TO_ROLE,
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
        setSelectedPermissionId("");
      } else {
        setError(
          response.data.message || "Failed to assign permission to role"
        );
      }
    } catch (err: any) {
      console.error("Error assigning permission to role:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.permission_name?.[0] ||
          err.response?.data?.errors?.role_name?.[0] ||
          "Failed to assign permission to role"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedPermissionId("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  // Filter out permissions that role already has
  const rolePermissionNames =
    role?.permissions?.map((permission) => permission.name) || [];
  const availablePermissionsToAssign = availablePermissions.filter(
    (permission) => !rolePermissionNames.includes(permission.name)
  );

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FaKey className="text-green-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              Assign Permission to Role
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
          {role && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Assigning permission to role:
              </p>
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
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This permission will be automatically
              granted to all users who have this role assigned.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Permission
            </label>
            <select
              value={selectedPermissionId}
              onChange={(e) => setSelectedPermissionId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="">Choose a permission...</option>
              {availablePermissionsToAssign.map((permission) => (
                <option key={permission.id} value={permission.id}>
                  {permission.name}
                </option>
              ))}
            </select>
            {availablePermissionsToAssign.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                No additional permissions available to assign to this role.
              </p>
            )}
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
              disabled={
                loading ||
                !selectedPermissionId ||
                availablePermissionsToAssign.length === 0
              }
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && <FaSpinner className="animate-spin mr-2" />}
              {loading ? "Assigning..." : "Assign Permission"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignPermissionToRoleModal;
