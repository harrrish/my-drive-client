import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PageDirectoryView from "../pages/PageDirectoryView";
import PageUserRegister from "../pages/PageUserRegister";
import PageUserLogin from "../pages/PageUserLogin";
import PageBin from "../pages/PageBin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PageDirectoryView />,
  },
  {
    path: "/register",
    element: <PageUserRegister />,
  },
  {
    path: "/login",
    element: <PageUserLogin />,
  },
  {
    path: "/bin",
    element: <PageBin />,
  },
  {
    path: "/directory/:folderId",
    element: <PageDirectoryView />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
