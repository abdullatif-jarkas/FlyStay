import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FaSpinner, FaCheck, FaTimes } from "react-icons/fa";
import { UserData } from "../../hooks/useUser";

interface ProfileSectionProps {
  user: UserData;
  onUserUpdate?: (updatedUser: UserData) => void;
}

interface ProfileFormData {
  name: string;
  email: string;
  phone_number: string;
}

interface ProfileErrors {
  name?: string;
  email?: string;
  phone_number?: string;
  general?: string;
}

const ProfileSection = ({ user, onUserUpdate }: ProfileSectionProps) => {
  // Edit state management
  const [editingBasic, setEditingBasic] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form data state
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user.name || "",
    email: user.email || "",
    phone_number: user.phone_number || "",
  });

  // Error state
  const [errors, setErrors] = useState<ProfileErrors>({});

  const token = localStorage.getItem("token");

  // Handle form input changes
  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: ProfileErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Full name must be at least 2 characters long";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.phone_number && formData.phone_number.trim()) {
      // يقبل: 0969686425 أو +963969686425
      const phoneRegex = /^(0\d{9}|\+[1-9]\d{7,14})$/;
      if (!phoneRegex.test(formData.phone_number.replace(/[\s\-\(\)]/g, ""))) {
        newErrors.phone_number = "Please enter a valid phone number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (section: "basic" | "contact") => {
    if (!token) {
      toast.error("Please login to update your profile");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await axios.put(
        "http://localhost:8000/api/update-profile",
        {
          name: formData.name,
          email: formData.email,
          phone_number: formData.phone_number || null,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Profile updated successfully!");

        // Update user data in parent component if callback provided
        if (onUserUpdate) {
          const updatedUser: UserData = {
            ...user,
            name: formData.name,
            email: formData.email,
            phone_number: formData.phone_number || undefined,
          };
          onUserUpdate(updatedUser);
        }

        // Update localStorage
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          const updatedUserData = {
            ...userData,
            name: formData.name,
            email: formData.email,
            phone_number: formData.phone_number || null,
          };
          localStorage.setItem("userData", JSON.stringify(updatedUserData));
        }

        // Exit edit mode
        if (section === "basic") {
          setEditingBasic(false);
        } else {
          setEditingContact(false);
        }
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (err: unknown) {
      console.error("Error updating profile:", err);

      if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response.data;

        if (err.response.status === 422 && errorData.errors) {
          // Handle validation errors
          setErrors(errorData.errors);
        } else if (errorData.message) {
          setErrors({ general: errorData.message });
          toast.error(errorData.message);
        } else {
          toast.error("Failed to update profile");
        }
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle edit mode toggle
  const handleEditToggle = (section: "basic" | "contact") => {
    if (section === "basic") {
      if (editingBasic) {
        // Cancel editing - reset form data
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone_number: user.phone_number || "",
        });
        setErrors({});
      }
      setEditingBasic(!editingBasic);
    } else {
      if (editingContact) {
        // Cancel editing - reset form data
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone_number: user.phone_number || "",
        });
        setErrors({});
      }
      setEditingContact(!editingContact);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Basic Information Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Basic Information
          </h2>
          <button
            onClick={() => handleEditToggle("basic")}
            disabled={loading || editingContact}
            className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editingBasic ? "Cancel" : "Edit"}
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Make Sure This Information Matches Your Travel ID, Like Your Passport
          Or License.
        </p>

        {/* General Error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            {editingBasic ? (
              <div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="Enter your full name"
                  disabled={loading}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-900">{user.name}</p>
            )}
          </div>
        </div>

        {/* Save/Cancel buttons for Basic Information */}
        {editingBasic && (
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => handleEditToggle("basic")}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaTimes className="mr-2 inline" />
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("basic")}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2 inline" />
                  Saving...
                </>
              ) : (
                <>
                  <FaCheck className="mr-2 inline" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Contact Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
          <button
            onClick={() => handleEditToggle("contact")}
            disabled={loading || editingBasic}
            className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editingContact ? "Cancel" : "Edit"}
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Receive Account Activity Alerts And Trip Updates By Sharing This
          Information.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            {editingContact ? (
              <div>
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) =>
                    handleInputChange("phone_number", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone_number
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your mobile number"
                  disabled={loading}
                />
                {errors.phone_number && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phone_number}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">
                {user.phone_number || "Not Provided"}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            {editingContact ? (
              <div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your email address"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-900">{user.email}</p>
            )}
          </div>
        </div>

        {/* Save/Cancel buttons for Contact Information */}
        {editingContact && (
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => handleEditToggle("contact")}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaTimes className="mr-2 inline" />
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("contact")}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2 inline" />
                  Saving...
                </>
              ) : (
                <>
                  <FaCheck className="mr-2 inline" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
