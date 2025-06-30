import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaShieldAlt, FaCalendarAlt } from "react-icons/fa";

interface Permission {
  id: number;
  name: string;
}

interface RoleDetails {
  id: number;
  name: string;
  permissions: Permission[];
  created_at?: string;
  updated_at?: string;
}

interface ShowRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleId: number | null;
}

const ShowRoleModal: React.FC<ShowRoleModalProps> = ({
  isOpen,
  onClose,
  roleId,
}) => {
  const [role, setRole] = useState<RoleDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isOpen && roleId) {
      fetchRoleDetails();
    }
  }, [isOpen, roleId]);

  const fetchRoleDetails = async () => {
    if (!roleId) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/role/${roleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.data.status === "success") {
        setRole(response.data.data[0]);
      } else {
        setError("Failed to load role details");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        "Failed to load role details"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const handleClose = () => {
    setRole(null);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaShieldAlt className="text-primary-600" />
            Role Details
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-2 text-gray-600">Loading role details...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {role && !loading && (
          <div className="space-y-6">
            {/* Role Basic Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaUser className="text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-800">Role Information</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600">ID</label>
                  <p className="text-gray-800 font-mono">{role.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Name</label>
                  <p className="text-gray-800 font-semibold capitalize">{role.name}</p>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FaShieldAlt className="text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Permissions ({role.permissions.length})
                  {}
                </h3>
              </div>
              {role.permissions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission) => (
                    <span
                      key={permission.id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                    >
                      {permission.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 italic">No permissions assigned to this role</p>
              )}
            </div>

            {/* Timestamps */}
            {(role.created_at || role.updated_at) && (
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FaCalendarAlt className="text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Timestamps</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {role.created_at && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Created At</label>
                      <p className="text-gray-800">{formatDate(role.created_at)}</p>
                    </div>
                  )}
                  {role.updated_at && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Updated At</label>
                      <p className="text-gray-800">{formatDate(role.updated_at)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowRoleModal;
