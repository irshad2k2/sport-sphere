import React from "react";
import { createBrowserRouter } from "react-router-dom";
const Dashboard = React.lazy(() => import("../views/dashboard"));
const SignupPage = React.lazy(() => import("../views/signup"));
const Logout = React.lazy(() => import("../views/logout"));
const SigninPage = React.lazy(() => import("../views/signin"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard></Dashboard>,
  },
  {
    path: "dashboard",
    element: <Dashboard></Dashboard>,
  },
  {
    path: "signup",
    element: <SignupPage></SignupPage>,
  },
  {
    path: "signin",
    element: <SigninPage></SigninPage>,
  },
  {
    path: "logout",
    element: <Logout></Logout>,
  },
]);

export default router;
