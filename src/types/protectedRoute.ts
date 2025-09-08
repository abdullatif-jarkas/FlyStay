import { JSX } from "react";

export interface ProtectedRouteProps {
  allowedRoles: string[];
  children: JSX.Element;
}