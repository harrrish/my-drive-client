import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PageDirectoryView from "../pages/PageDirectoryView";
import PageUserRegister from "../pages/PageUserRegister";
import PageUserLogin from "../pages/PageUserLogin";
import PageBin from "../pages/PageBin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PageUserLogin />,
  },
  {
    path: "/login",
    element: <PageUserLogin />,
  },
  {
    path: "/register",
    element: <PageUserRegister />,
  },
  {
    path: "/root",
    element: <PageDirectoryView />,
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
