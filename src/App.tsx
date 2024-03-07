import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { useContext } from "react";
import { ThemeContext } from "./context/theme";

const App = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={`min-h-dvh ${theme === "dark" ? "dark" : ""}`}>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
