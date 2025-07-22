import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaTimes, FaSpinner, FaUserShield, FaKey, FaCalendarAlt, FaEnvelope } from "react-icons/fa";
import { User, ROLE_PERMISSION_ENDPOINTS } from "../../../types/rolePermission";

interface ShowUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number | null;
}

const ShowUserModal: React.FC<ShowUserModalProps> = ({
  isOpen,
  onClose,
  userId,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails();
    }
  }, [isOpen, userId]);

  const fetchUserDetails = async () => {
    if (!userId) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${ROLE_PERMISSION_ENDPOINTS.USERS}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (response.data.status === "success") {
        setUser(response.data.data[0]);
      } else {
        setError("Failed to load user details");
      }
    } catch (err: any) {
      console.error("Error fetching user details:", err);
      setError("Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUser(null);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FaUser className="text-primary-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              User Details
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <FaSpinner className="animate-spin text-2xl text-primary-500 mr-3" />
              <span>Loading user details...</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {user && !loading && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FaUser className="mr-2" />
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Name</label>
                    <p className="text-gray-900 font-medium">{user.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900 flex items-center">
                      <FaEnvelope className="mr-2 text-gray-400" />
                      {user.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Email Verified</label>
                    <p className="text-gray-900">
                      {user.email_verified_at ? (
                        <span className="text-green-600">✓ Verified</span>
                      ) : (
                        <span className="text-red-600">✗ Not Verified</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Member Since</label>
                    <p className="text-gray-900 flex items-center">
                      <FaCalendarAlt className="mr-2 text-gray-400" />
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Roles */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FaUserShield className="mr-2 text-blue-600" />
                  Assigned Roles ({user.roles?.length || 0})
                </h4>
                {user.roles && user.roles.length > 0 ? (
                  <div className="space-y-3">
                    {user.roles.map((role) => (
                      <div key={role.id} className="bg-white rounded-lg p-3 border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{role.name}</p>
                            {role.permissions && (
                              <p className="text-sm text-gray-600">
                                {role.permissions.length} permission(s)
                              </p>
                            )}
                          </div>
                          {role.created_at && (
                            <p className="text-xs text-gray-500">
                              Since {new Date(role.created_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {role.permissions && role.permissions.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-600 mb-1">Permissions from this role:</p>
                            <div className="flex flex-wrap gap-1">
                              {role.permissions.map((permission) => (
                                <span
                                  key={permission.id}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                >
                                  {permission.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 italic">No roles assigned</p>
                )}
              </div>

              {/* Direct Permissions */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FaKey className="mr-2 text-green-600" />
                  Direct Permissions ({user.permissions?.length || 0})
                </h4>
                {user.permissions && user.permissions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.permissions.map((permission) => (
                      <span
                        key={permission.id}
                        className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                      >
                        {permission.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 italic">No direct permissions assigned</p>
                )}
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Summary</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{user.roles?.length || 0}</p>
                    <p className="text-sm text-gray-600">Roles</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{user.permissions?.length || 0}</p>
                    <p className="text-sm text-gray-600">Direct Permissions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      {(user.roles?.reduce((acc, role) => acc + (role.permissions?.length || 0), 0) || 0) + (user.permissions?.length || 0)}
                    </p>
                    <p className="text-sm text-gray-600">Total Permissions</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowUserModal;
