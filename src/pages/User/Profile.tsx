import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import {
  FiUser,
  FiSettings,
  // FiCreditCard,
  // FiHelpCircle,
  // FiHeart,
  FiChevronRight,
  FiLogOut,
} from "react-icons/fi";
import { FaCalendarCheck } from "react-icons/fa";

// Dashboard sections
import ProfileSection from "./Dashboard/ProfileSection";
import BookingsSection from "./Dashboard/BookingsSection";
// import PreferencesSection from "./Dashboard/PreferencesSection";
// import PaymentSection from "./Dashboard/PaymentSection";
// import HelpSection from "./Dashboard/HelpSection";
import SettingsSection from "./Dashboard/SettingsSection";

const Profile = () => {
  const { user, loading } = useUser();
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState("profile");
  const navigate = useNavigate();

  // Handle URL parameters for section navigation
  useEffect(() => {
    const section = searchParams.get("section");
    if (section && ["profile", "bookings", "settings"].includes(section)) {
      setActiveSection(section);
    }
  }, [searchParams]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/auth/login");
  };

  const menuItems = [
    {
      id: "profile",
      label: "Profile",
      icon: FiUser,
      component: ProfileSection,
    },
    {
      id: "bookings",
      label: "My Bookings",
      icon: FaCalendarCheck,
      component: BookingsSection,
    },
    {
      id: "settings",
      label: "Setting",
      icon: FiSettings,
      component: SettingsSection,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">No user data available. Please log in.</p>
      </div>
    );
  }

  const ActiveComponent =
    menuItems.find((item) => item.id === activeSection)?.component ||
    ProfileSection;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img
                src={
                  user.profile_image ||
                  "https://randomuser.me/api/portraits/men/1.jpg"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Hi, {user.name}
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <p className="text-gray-600">
            Manage your profile, rewards, and preferences for all our brands in
            one place.
          </p>
        </div>

        {/* Dashboard Layout */}
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 bg-white rounded-lg shadow-sm p-6">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                );
              })}
            </nav>

            {/* Sign Out Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiLogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <ActiveComponent user={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
