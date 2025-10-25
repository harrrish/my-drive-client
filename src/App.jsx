import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PageDirectoryView from "../pages/PageDirectoryView";
import PageUserRegister from "../pages/PageUserRegister";
import PageUserLogin from "../pages/PageUserLogin";
import PageBin from "../pages/PageBin";
import PageUserProfile from "../pages/PageUserProfile";
import PagePurchasePremium from "../pages/PagePurchasePremium";

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
