import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaKey,
  FaUsersCog,
  FaUsers,
  FaBars,
  FaHotel,
  FaBed,
  FaPlaneDeparture,
  FaCity,
  FaSignOutAlt,
  FaChair,
} from "react-icons/fa";
import { useState } from "react";
import Logo from "../components/ui/Logo";
import LogoImg from "./../assets/Logo/Logo.png";
import { MdFlight } from "react-icons/md";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const currentPath = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        collapsed={collapsed}
        backgroundColor="#fff"
        className="text-[#07689f]"
        breakPoint="md"
      >
        <div className="flex flex-col h-full justify-between">
          {/* Top: Header + Menu */}
          <div>
            <div
              className={`flex items-center border-b border-[#07679f33] ${
                collapsed ? "justify-center" : "justify-between"
              } p-4`}
            >
              {!collapsed && (
                <div className="text-xl font-bold w-[100px]">
                  <Link to="/" className="flex items-center">
                    <Logo url={LogoImg} />
                  </Link>
                </div>
              )}
              <button onClick={() => setCollapsed(!collapsed)}>
                <FaBars className="cursor-pointer" />
              </button>
            </div>

            <Menu
              menuItemStyles={{
                button: {
                  color: "#07689f",
                  "&:hover": {
                    backgroundColor: "#2f83b2",
                    color: "#fff",
                  },
                  "&.ps-active": {
                    backgroundColor: "#2f83b2",
                    color: "#fff",
                  },
                },
              }}
            >
              {/* 1. General */}
              <MenuItem
                icon={<FaTachometerAlt />}
                onClick={() => navigate("/admin")}
                active={currentPath === "/admin"}
                title="Dashboard"
              >
                Dashboard
              </MenuItem>

              {/* 2. User Management */}
              <SubMenu icon={<FaUsersCog />} label="User Management">
                <MenuItem
                  icon={<FaKey />}
                  onClick={() => navigate("/admin/permissions")}
                  active={currentPath === "/admin/permissions"}
                >
                  Permissions
                </MenuItem>
                <MenuItem
                  icon={<FaUsersCog />}
                  onClick={() => navigate("/admin/roles")}
                  active={currentPath === "/admin/roles"}
                >
                  Roles
                </MenuItem>
                <MenuItem
                  icon={<FaUsers />}
                  onClick={() => navigate("/admin/users")}
                  active={currentPath === "/admin/users"}
                >
                  Users
                </MenuItem>
              </SubMenu>

              {/* 3. Travel */}
              <SubMenu icon={<MdFlight />} label="Travel">
                <MenuItem
                  icon={<MdFlight />}
                  onClick={() => navigate("/admin/flights")}
                  active={currentPath === "/admin/flights"}
                >
                  Flights
                </MenuItem>
                <MenuItem
                  icon={<FaChair />}
                  onClick={() => navigate("/admin/flight-cabins")}
                  active={currentPath === "/admin/flight-cabins"}
                >
                  Flight Cabins
                </MenuItem>
                <MenuItem
                  icon={<FaPlaneDeparture />}
                  onClick={() => navigate("/admin/airports")}
                  active={currentPath === "/admin/airports"}
                >
                  Airports
                </MenuItem>
                <MenuItem
                  icon={<FaCity />}
                  onClick={() => navigate("/admin/cities")}
                  active={currentPath === "/admin/cities"}
                >
                  Cities
                </MenuItem>
              </SubMenu>

              {/* 4. Accommodation */}
              <SubMenu icon={<FaHotel />} label="Accommodation">
                <MenuItem
                  icon={<FaHotel />}
                  onClick={() => navigate("/admin/hotels")}
                  active={currentPath === "/admin/hotels"}
                >
                  Hotels
                </MenuItem>
                <MenuItem
                  icon={<FaBed />}
                  onClick={() => navigate("/admin/rooms")}
                  active={currentPath === "/admin/rooms"}
                >
                  Rooms
                </MenuItem>
              </SubMenu>
            </Menu>
          </div>

          {/* Bottom: Logout */}
          <div
            className={`p-4 border-t ${
              collapsed && "flex justify-center"
            } border-[#07679f33]`}
          >
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-[#07689f] hover:text-[#f2b203] cursor-pointer transition-colors"
            >
              <FaSignOutAlt />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </Sidebar>

      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
