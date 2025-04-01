import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { Outlet, RouteObject } from "react-router";
import AdminLayout from "../layouts/admin-layout/AdminLayout";
import Dashboard from "../modules/dashboard/Dashboard";
import About from "../modules/dashboard/About";
import Login from "../modules/auth/Login";
import AuthLayout from "../layouts/auth-layout/AuthLayout";
import Logout from "../modules/auth/Logout";
import UserTable from "../modules/users/UserTable";

const TaskModuleWrapper = () => {
  const TaskManagementModule = lazy(() =>
    import("task/TaskModule").catch((err) => {
      console.error("Error loading TaskModule:", err);
      return { default: () => <div>Error loading Task Module</div> };
    }),
  );

  return (
    <Suspense fallback={<div>Loading Task Management Module...</div>}>
      <TaskManagementModule />
    </Suspense>
  );
};

export const routes: RouteObject[] = [
  {
    element: <PrivateRoute allowedRoles={["admin"]} />,
    children: [
      {
        path: "/",
        element: <Navigate to="/admin" replace />,
      },
      {
        path: "/admin",
        element: (
          <AdminLayout>
            <Outlet />
          </AdminLayout>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "/admin/about",
            element: <About />,
          },
          {
            path: "/admin/user",
            element: <UserTable />,
          },
          {
            path: "/admin/tasks/*",
            element: <TaskModuleWrapper />,
          },
        ],
      },
    ],
  },
  {
    element: <PrivateRoute allowedRoles={["basic-user"]} />,
    children: [
      {
        path: "/",
        element: <Navigate to="/user" replace />,
      },
      {
        path: "/user",
        element: (
          <AdminLayout>
            <Outlet />
          </AdminLayout>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: (
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    ),
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
  {
    path: "/logout",
    element: <Logout />,
  },
];
