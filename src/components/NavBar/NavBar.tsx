import { BsQuestionCircle } from "react-icons/bs";
import Button from "../ui/Button";
import Logo from "../ui/Logo";
import SearchInput from "../ui/SearchInput";
import LogoImg from "./../../assets/Logo/Logo.png";
import UnitedKingdom from "./../../assets/Navbar/united-kingdom.png";
import { navbarLinks } from "../../data/Navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { FaRegHeart } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { useUser } from "../../hooks/useUser";
import { toast } from "sonner";
import UserDropdown from "./UserDropdown";
import { MdDashboard } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/userSlice";

const NavBar = ({ isAuth }: { isAuth?: boolean }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const hiddenRoutes = ["/user"];
  const hideBottomSection = hiddenRoutes.some((route) =>
    location.pathname.includes(route)
  );
  const role = useAppSelector((state) => state.user.role);

  useEffect(() => {
    
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      // await logout();
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("role");
      dispatch(logout());
      setIsLoggedIn(false);
      setShowUserDropdown(false);
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      setIsLoggedIn(false);
      setShowUserDropdown(false);
      navigate("/");
    }
  };

  // Logged in navbar (matches the image)
  if (isLoggedIn) {
    return (
      <>
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <Logo url={LogoImg} />
          </Link>
          <SearchInput />
          <div className="flex items-center gap-6">
            {/* Favorites */}
            <Link to="/favorites" className="text-primary-500">
              <FaRegHeart className="text-xl" />
            </Link>

            {/* Phone */}
            <Link to="/contact" className="text-primary-500">
              <FaPhoneAlt className="text-xl" />
            </Link>

            {/* Dashboard */}
            {!(role === "customer" || role === null) && (
              <Link
                to="/admin"
                className="text-primary-500 flex items-center gap-1"
              >
                <MdDashboard className="text-xl" />
                <span className="hidden md:inline">Dashboard</span>
              </Link>
            )}
            {/* User account with dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  setShowUserDropdown(!showUserDropdown)
                  // navigate("/user/profile");
                }}
                className="cursor-pointer flex items-center gap-2"
              >
                <div className="hidden md:block">
                  <div className="border-l-3 pl-2 text-sm flex flex-col items-start text-primary-500">
                    <span className="font-extrabold">Your Account</span>
                    {user?.name || "User"}
                  </div>
                </div>
              </button>

              {showUserDropdown && (
                <UserDropdown user={user} onLogout={handleLogout} />
              )}
            </div>
          </div>
        </nav>
        {isAuth || hideBottomSection ? (
          ""
        ) : (
          <div className="lower-nav pb-10">
            <div className="nav-links flex justify-center gap-4 mt-7">
              {navbarLinks.map((link, index) => (
                <Button
                  title={link.title}
                  to={link.to}
                  key={index}
                  styles={link.styles}
                />
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  // Original navbar for non-logged in users
  return (
    <nav
      className={`${
        isAuth ? "py-[21px]" : " pt-6 pb-10"
      } container mx-auto px-4`}
    >
      <div className="upper-nav flex justify-between items-center">
        <Link to="/">
          <Logo url={LogoImg} />
        </Link>
        <div
          className={`${
            isAuth ? "justify-end" : "justify-center"
          } info-search-lang flex items-center grow gap-4`}
        >
          <div className="info-lang flex gap-6 items-center">
            <BsQuestionCircle className="text-primary-500 text-xl" />
            <img src={UnitedKingdom} alt="lang" />
          </div>
          {isAuth ? "" : <SearchInput />}
        </div>
        {isAuth ? (
          ""
        ) : (
          <div className="nav-buttons flex ml-7 gap-2 items-center">
            <Button
              title="Sign In"
              to="/auth/login"
              styles="border border-primary-500 text-primary-500 px-4 py-2 rounded-md bg-primary-500 text-white"
            />
            <Button
              title="Register"
              to="/auth/register"
              styles="border border-primary-500 text-primary-500 px-4 py-2 rounded-md"
            />
          </div>
        )}
      </div>
      {isAuth ? (
        ""
      ) : (
        <div className="lower-nav">
          <div className="nav-links flex justify-center gap-4 mt-10">
            {navbarLinks.map((link, index) => (
              <Button
                title={link.title}
                to={link.to}
                key={index}
                styles={link.styles}
              />
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
