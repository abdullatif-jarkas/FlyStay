import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { JSX } from "react";

interface Props {
  allowedRoles: string[];
  children: JSX.Element;
}

const ProtectedRoute = ({ allowedRoles, children }: Props) => {
  const { role } = useAppSelector((state) => state.user);
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" />;
  // }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
