import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { ProtectedRouteProps } from "../../types/protectedRoute";

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { role } = useAppSelector((state) => state.user);

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/auth/login" />;
  }

  return children;
};

export default ProtectedRoute;
