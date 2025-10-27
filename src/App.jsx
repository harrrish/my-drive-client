import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PageDirectoryView from "../pages/Home";
import PageUserRegister from "../pages/Register";
import PageUserLogin from "../pages/Login";
import PageBin from "../pages/Bin";
import PageUserProfile from "../pages/Profile";
import PagePurchasePremium from "../pages/Purchase";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PageDirectoryView />,
  },
  {
    path: "/directory",
    element: <PageDirectoryView />,
  },
  {
    path: "/directory/:dirID",
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
    path: "/profile",
    element: <PageUserProfile />,
  },
  {
    path: "/bin",
    element: <PageBin />,
  },
  {
    path: "/purchase-premium",
    element: <PagePurchasePremium />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
