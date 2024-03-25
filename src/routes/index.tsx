import React from "react";
import { createBrowserRouter } from "react-router-dom";
const Dashboard = React.lazy(() => import("../views/dashboard"));
const SignupPage = React.lazy(() => import("../views/signup"));
const Logout = React.lazy(() => import("../views/logout"));
const SigninPage = React.lazy(() => import("../views/signin"));
const PasswordPage = React.lazy(() => import("../views/password"));
const NotFound = React.lazy(() => import("../views/notfound/NotFound"))

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
    path: "changepassword",
    element: <PasswordPage></PasswordPage>,
  },
  {
    path: "logout",
    element: <Logout></Logout>,
  },
  {
    path: "*",
    element: <NotFound />
  },
]);

export default router;
