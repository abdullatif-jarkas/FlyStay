import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";

const AuthLayout = () => {
  return (
    <>
      <NavBar isAuth />
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
