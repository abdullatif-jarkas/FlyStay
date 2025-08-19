import { FC } from "react";
import { Link } from "react-router-dom";
import {
  FiLogOut,
  FiSettings,
  FiUser,
  FiHelpCircle,
  FiCreditCard,
} from "react-icons/fi";
import { UserData } from "../../hooks/useUser";

interface UserDropdownProps {
  user: UserData | null;
  onLogout: () => void;
}

const UserDropdown: FC<UserDropdownProps> = ({ user, onLogout }) => {
  return (
    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
      {/* User info header */}
      {/* <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div>
            <div className="font-medium">{user?.name || "User"}</div>
            <div className="text-sm text-gray-500">{user?.email || "user@example.com"}</div>
          </div>
        </div>
      </div> */}

      {/* Menu items */}
      <div className="py-2">
        <Link
          to="/user/profile"
          className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors"
        >
          <FiUser className="text-primary-500 mr-3" />
          <span>My Account</span>
          <span className="ml-auto text-gray-400">›</span>
        </Link>
        {/*         
        <Link to="/user/payments" className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors">
          <FiCreditCard className="text-primary-500 mr-3" />
          <span>Payments</span>
          <span className="ml-auto text-gray-400">›</span>
        </Link>
        
        <Link to="/user/settings" className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors">
          <FiSettings className="text-primary-500 mr-3" />
          <span>Settings</span>
          <span className="ml-auto text-gray-400">›</span>
        </Link>
        
        <Link to="/support" className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors">
          <FiHelpCircle className="text-primary-500 mr-3" />
          <span>Support</span>
          <span className="ml-auto text-gray-400">›</span>
        </Link> */}
      </div>

      {/* Sign out button */}
      <div className="border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-3 text-red-500 hover:bg-gray-100 transition-colors"
        >
          <FiLogOut className="mr-3" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default UserDropdown;
