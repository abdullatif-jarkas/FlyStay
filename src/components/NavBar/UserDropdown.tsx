import { FC } from "react";
import { Link } from "react-router-dom";
import {
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { setActiveSection } from "../../store/sectionSlice";
import { UserDropdownProps } from "../../types/userDropdown";


const UserDropdown: FC<UserDropdownProps> = ({ onLogout }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleClick = () => {
    dispatch(setActiveSection("profile"));
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
      {/* Menu items */}
      <div className="py-2">
        <Link
          to="/user/profile"
          onClick={handleClick}
          className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors"
        >
          <FiUser className="text-primary-500 mr-3" />
          <span>My Account</span>
          <span className="ml-auto text-gray-400">›</span>
        </Link>
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
