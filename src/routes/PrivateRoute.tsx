import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken, selectUser } from "../store/reducers/authSlice";

interface PrivateRouteProps {
  allowedRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/user"} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
