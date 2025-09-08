import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FiShield, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";
import {
  FaSpinner,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";

const SettingsSection = () => {
  // Change password state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<{
    current_password?: string;
    new_password?: string;
    new_password_confirmation?: string;
    general?: string;
  }>({});

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    confirmText: "",
    confirmCheckbox: false,
  });
  const [deleteErrors, setDeleteErrors] = useState<{
    confirmText?: string;
    confirmCheckbox?: string;
    general?: string;
  }>({});

  // Handle password form input changes
  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear specific field error when user starts typing
    if (passwordErrors[field as keyof typeof passwordErrors]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors: typeof passwordErrors = {};

    if (!passwordForm.current_password) {
      errors.current_password = "Current password is required";
    }

    if (!passwordForm.new_password) {
      errors.new_password = "New password is required";
    } else if (passwordForm.new_password.length < 8) {
      errors.new_password = "New password must be at least 8 characters long";
    }

    if (!passwordForm.new_password_confirmation) {
      errors.new_password_confirmation = "Password confirmation is required";
    } else if (
      passwordForm.new_password !== passwordForm.new_password_confirmation
    ) {
      errors.new_password_confirmation = "Passwords do not match";
    }

    if (passwordForm.current_password === passwordForm.new_password) {
      errors.new_password =
        "New password must be different from current password";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle password change submission
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login to change your password");
      return;
    }

    if (!validatePasswordForm()) {
      return;
    }

    setPasswordLoading(true);
    setPasswordErrors({});

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/change-password",
        passwordForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Password changed successfully!");

        // Reset form and hide change password section
        setPasswordForm({
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        });
        setShowChangePassword(false);
        setPasswordErrors({});
      } else {
        toast.error(response.data.errors[0] || "Failed to change password");
      }
    } catch (err: unknown) {
      console.error("Error changing password:", err);

      if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response.data;

        if (err.response.status === 422 && errorData.errors) {
          // Handle validation errors
          setPasswordErrors(errorData.errors);
        } else if (errorData.message) {
          setPasswordErrors({ general: errorData.errors[0] });
          toast.error(errorData.errors[0]);
        } else {
          toast.error("Failed to change password");
        }
      } else {
        toast.error("Failed to change password. Please try again.");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  // Cancel password change
  const handleCancelPasswordChange = () => {
    setPasswordForm({
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    });
    setPasswordErrors({});
    setShowChangePassword(false);
  };

  // Get user data from localStorage
  const getUserData = () => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  };

  // Handle delete confirmation input changes
  const handleDeleteInputChange = (field: string, value: string | boolean) => {
    setDeleteConfirmation((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear specific field error when user starts typing/changing
    if (deleteErrors[field as keyof typeof deleteErrors]) {
      setDeleteErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Validate delete confirmation
  const validateDeleteConfirmation = (): boolean => {
    const errors: typeof deleteErrors = {};
    const userData = getUserData();

    if (!deleteConfirmation.confirmText.trim()) {
      errors.confirmText = "Please type DELETE to confirm";
    } else if (deleteConfirmation.confirmText !== "DELETE") {
      errors.confirmText = "Please type DELETE exactly as shown";
    }

    if (!deleteConfirmation.confirmCheckbox) {
      errors.confirmCheckbox =
        "You must confirm that you understand the consequences";
    }

    setDeleteErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!token) {
      toast.error("Please login to delete your account");
      return;
    }

    if (!validateDeleteConfirmation()) {
      return;
    }

    setDeleteLoading(true);
    setDeleteErrors({});

    try {
      const response = await axios.delete(
        "http://127.0.0.1:8000/api/delete-account",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Account deleted successfully");

        // Clear all user data from localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        localStorage.removeItem("role");

        // Close modal
        setShowDeleteModal(false);

        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error(response.data.message || "Failed to delete account");
      }
    } catch (err: unknown) {
      console.error("Error deleting account:", err);

      if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response.data;

        if (err.response.status === 422 && errorData.errors) {
          // Handle validation errors
          setDeleteErrors(errorData.errors);
        } else if (errorData.message) {
          setDeleteErrors({ general: errorData.message });
          toast.error(errorData.message);
        } else {
          toast.error("Failed to delete account");
        }
      } else {
        toast.error("Failed to delete account. Please try again.");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle delete modal close
  const handleCloseDeleteModal = () => {
    setDeleteConfirmation({
      confirmText: "",
      confirmCheckbox: false,
    });
    setDeleteErrors({});
    setShowDeleteModal(false);
  };

  // Handle delete button click
  const handleDeleteButtonClick = () => {
    setShowDeleteModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Account Security Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <FiShield className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Account Security
          </h2>
        </div>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-medium text-gray-900">Password</h3>
                <p className="text-sm text-gray-600">
                  Last updated 3 months ago
                </p>
              </div>
              <button
                onClick={() => setShowChangePassword(!showChangePassword)}
                disabled={passwordLoading}
                className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {showChangePassword ? "Cancel" : "Change Password"}
              </button>
            </div>

            {/* Change Password Form */}
            {showChangePassword && (
              <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleChangePassword} className="space-y-4">
                  {/* General Error */}
                  {passwordErrors.general && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm text-red-600">
                        {passwordErrors.general}
                      </p>
                    </div>
                  )}

                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordForm.current_password}
                        onChange={(e) =>
                          handlePasswordInputChange(
                            "current_password",
                            e.target.value
                          )
                        }
                        className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          passwordErrors.current_password
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter your current password"
                        disabled={passwordLoading}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        disabled={passwordLoading}
                      >
                        {showPasswords.current ? (
                          <FiEyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <FiEye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.current_password && (
                      <p className="mt-1 text-sm text-red-600">
                        {passwordErrors.current_password}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordForm.new_password}
                        onChange={(e) =>
                          handlePasswordInputChange(
                            "new_password",
                            e.target.value
                          )
                        }
                        className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          passwordErrors.new_password
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter your new password"
                        disabled={passwordLoading}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        disabled={passwordLoading}
                      >
                        {showPasswords.new ? (
                          <FiEyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <FiEye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.new_password && (
                      <p className="mt-1 text-sm text-red-600">
                        {passwordErrors.new_password}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Password must be at least 8 characters long
                    </p>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordForm.new_password_confirmation}
                        onChange={(e) =>
                          handlePasswordInputChange(
                            "new_password_confirmation",
                            e.target.value
                          )
                        }
                        className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          passwordErrors.new_password_confirmation
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Confirm your new password"
                        disabled={passwordLoading}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        disabled={passwordLoading}
                      >
                        {showPasswords.confirm ? (
                          <FiEyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <FiEye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.new_password_confirmation && (
                      <p className="mt-1 text-sm text-red-600">
                        {passwordErrors.new_password_confirmation}
                      </p>
                    )}
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCancelPasswordChange}
                      disabled={passwordLoading}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {passwordLoading ? (
                        <>
                          <FaSpinner className="animate-spin mr-2 inline" />
                          Changing Password...
                        </>
                      ) : (
                        "Change Password"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Danger Zone Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
        <div className="flex items-center gap-3 mb-6">
          <FiTrash2 className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-semibold text-red-900">Danger Zone</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <h3 className="font-medium text-red-900">Delete Account</h3>
              <p className="text-sm text-red-700">
                Permanently delete your account and all data
              </p>
            </div>
            <button
              onClick={handleDeleteButtonClick}
              disabled={deleteLoading}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleteLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2 inline" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <FaExclamationTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Delete Account
                  </h3>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to permanently delete your account? This
                  action cannot be undone and will:
                </p>

                <ul className="text-sm text-gray-600 mb-4 list-disc list-inside space-y-1">
                  <li>Delete all your personal information</li>
                  <li>Cancel all your bookings</li>
                  <li>Remove all your travel history</li>
                  <li>Delete all your saved preferences</li>
                </ul>

                {getUserData() && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">
                        Account: {getUserData().name}
                      </p>
                      <p className="text-gray-600">
                        Email: {getUserData().email}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* General Error */}
              {deleteErrors.general && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                  <p className="text-sm text-red-600">{deleteErrors.general}</p>
                </div>
              )}

              {/* Confirmation Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="font-bold text-red-600">DELETE</span> to
                  confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmation.confirmText}
                  onChange={(e) =>
                    handleDeleteInputChange("confirmText", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    deleteErrors.confirmText
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Type DELETE here"
                  disabled={deleteLoading}
                />
                {deleteErrors.confirmText && (
                  <p className="mt-1 text-sm text-red-600">
                    {deleteErrors.confirmText}
                  </p>
                )}
              </div>

              {/* Confirmation Checkbox */}
              <div className="mb-6">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={deleteConfirmation.confirmCheckbox}
                    onChange={(e) =>
                      handleDeleteInputChange(
                        "confirmCheckbox",
                        e.target.checked
                      )
                    }
                    className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    disabled={deleteLoading}
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I understand that this action is permanent and cannot be
                    undone
                  </span>
                </label>
                {deleteErrors.confirmCheckbox && (
                  <p className="mt-1 text-sm text-red-600">
                    {deleteErrors.confirmCheckbox}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCloseDeleteModal}
                  disabled={deleteLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaTimes className="mr-2 inline" />
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={
                    deleteLoading ||
                    !deleteConfirmation.confirmText ||
                    !deleteConfirmation.confirmCheckbox
                  }
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2 inline" />
                      Deleting Account...
                    </>
                  ) : (
                    <>
                      <FaExclamationTriangle className="mr-2 inline" />
                      Delete My Account
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsSection;
