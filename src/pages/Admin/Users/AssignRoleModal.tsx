import React, { useState } from "react";
import axios from "axios";
import { FaUserPlus, FaTimes, FaSpinner } from "react-icons/fa";
import {
  AssignRoleModalProps,
  ROLE_PERMISSION_ENDPOINTS,
} from "../../../types/rolePermission";

const AssignRoleModal: React.FC<AssignRoleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  user,
  availableRoles,
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleId || !user) return;

    setLoading(true);
    setError("");

    try {
      const selectedRole = availableRoles.find(
        (role) => role.id.toString() === selectedRoleId
      );
      if (!selectedRole) {
        setError("Please select a valid role");
        return;
      }

      const formData = new FormData();
      formData.append("user_id", user.id.toString());
      formData.append("name", selectedRole.name);

      const response = await axios.post(
        ROLE_PERMISSION_ENDPOINTS.ASSIGN_ROLE,
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
        setSelectedRoleId("");
      } else {
        setError(response.data.message || "Failed to assign role");
      }
    } catch (err: any) {
      console.error("Error assigning role:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.name?.[0] ||
          "Failed to assign role"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedRoleId("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  // Filter out roles that user already has
  const userRoleNames = user?.roles?.map((role) => role.name) || [];
  const availableRolesToAssign = availableRoles.filter(
    (role) => !userRoleNames.includes(role.name)
  );

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FaUserPlus className="text-primary-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              Assign Role to User
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
          {user && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Assigning role to:</p>
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role
            </label>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Choose a role...</option>
              {availableRolesToAssign.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                  {role.permissions &&
                    ` (${role.permissions.length} permissions)`}
                </option>
              ))}
            </select>
            {availableRolesToAssign.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                No additional roles available to assign to this user.
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
                !selectedRoleId ||
                availableRolesToAssign.length === 0
              }
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && <FaSpinner className="animate-spin mr-2" />}
              {loading ? "Assigning..." : "Assign Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignRoleModal;
