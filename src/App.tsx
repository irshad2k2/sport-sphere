import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { Suspense, useContext } from "react";
import { ThemeContext } from "./context/theme";

const App = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={`min-h-dvh ${theme === "dark" ? "dark" : ""}`}>
      <Suspense fallback={<>Loading...</>}>
        <RouterProvider router={router} />
      </Suspense>
    </div>
  );
};

export default App;
