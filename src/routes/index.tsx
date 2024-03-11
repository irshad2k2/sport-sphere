import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../views/dashboard";
import SignupPage from "../views/signup";
import Logout from "../views/logout";
import SigninPage from "../views/signin";

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
