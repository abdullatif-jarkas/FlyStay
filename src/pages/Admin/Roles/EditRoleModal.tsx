import React, { useState, useEffect } from "react";
import axios from "axios";

interface Permission {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  permissions?: Permission[];
}

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  role: Role | null;
}

interface RoleFormData {
  name: string;
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  role,
}) => {
  const [formData, setFormData] = useState<RoleFormData>({
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isOpen && role) {
      setFormData({
        name: role.name,
      });
    }
  }, [isOpen, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    setLoading(true);
    setError("");

    try {
      // Create URL-encoded data as specified in the API requirements
      const urlEncodedData = new URLSearchParams();
      urlEncodedData.append("name", formData.name);

      await axios.put(
        `http://127.0.0.1:8000/api/role/${role.id}`,
        urlEncodedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update role"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setFormData({ name: "" });
    setError("");
    onClose();
  };

  if (!isOpen || !role) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Edit Role</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter role name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Display current permissions (read-only) */}
          {role.permissions && role.permissions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Permissions
              </label>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <span
                    key={permission.id}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {permission.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Updating..." : "Update Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoleModal;
