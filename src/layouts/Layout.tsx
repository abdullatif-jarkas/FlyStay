import { Outlet } from "react-router"
import NavBar from "../components/NavBar/NavBar"
import Footer from "../components/Footer/Footer"
import { useEffect, useState } from "react"

const Layout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Layout
