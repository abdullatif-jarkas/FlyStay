import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaKey, FaShieldAlt, FaCalendarAlt, FaUsers } from "react-icons/fa";

interface Role {
  id: number;
  name: string;
  guard_name: string;
}

interface PermissionDetails {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at?: string;
  roles: Role[];
}

interface ShowPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  permissionId: number | null;
}

const ShowPermissionModal: React.FC<ShowPermissionModalProps> = ({
  isOpen,
  onClose,
  permissionId,
}) => {
  const [permission, setPermission] = useState<PermissionDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isOpen && permissionId) {
      fetchPermissionDetails();
    }
  }, [isOpen, permissionId]);

  const fetchPermissionDetails = async () => {
    if (!permissionId) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/permission/${permissionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        setPermission(response.data.data[0]);
      } else {
        setError("Failed to load permission details");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load permission details"
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
    setPermission(null);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaKey className="text-primary-600" />
            Permission Details
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
            <span className="ml-2 text-gray-600">
              Loading permission details...
            </span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {permission && !loading && (
          <div className="space-y-6">
            {/* Permission Basic Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaKey className="text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Permission Information
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    ID
                  </label>
                  <p className="text-gray-800 font-mono">{permission.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Name
                  </label>
                  <p className="text-gray-800 font-semibold">
                    {permission.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Guard
                  </label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {permission.guard_name}
                  </span>
                </div>
              </div>
            </div>

            {/* Associated Roles */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FaUsers className="text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Associated Roles ({permission.roles.length})
                </h3>
              </div>
              {permission.roles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {permission.roles.map((role) => (
                    <div
                      key={role.id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                    >
                      <FaShieldAlt className="mr-1 text-xs" />
                      {role.name}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 italic">
                  No roles are associated with this permission
                </p>
              )}
            </div>

            {/* Timestamps */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FaCalendarAlt className="text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Timestamps
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Created At
                  </label>
                  <p className="text-gray-800">
                    {formatDate(permission.created_at)}
                  </p>
                </div>
                {permission.updated_at && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Updated At
                    </label>
                    <p className="text-gray-800">
                      {formatDate(permission.updated_at)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Usage Statistics */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FaShieldAlt className="text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Usage Statistics
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {permission.roles.length}
                  </p>
                  <p className="text-gray-600">Roles Using</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {permission.guard_name}
                  </p>
                  <p className="text-gray-600">Guard Type</p>
                </div>
              </div>
            </div>
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

export default ShowPermissionModal;
