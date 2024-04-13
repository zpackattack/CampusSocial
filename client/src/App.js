import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import "./style.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import University from "./pages/profile/Univeristy";
import RSO from "./pages/profile/RSO";
import RSOPage from "./pages/home/RSOPage";
import JoinedRSO from "./pages/home/JoinedRSO";
import CreateRSORequest from "./pages/RSO/CreateNewRSO";
import YourRSORequests from "./pages/RSO/YourRSORequests";
import ApproveRSORequests from "./pages/RSO/rsoRequestPortal";
import CreateUniversity from "./pages/register/CreateUniversity";
import UniversityRequestPortal from "./pages/university/UniversityRequestPortal";
import EventPortal from "./pages/eventPortal/eventPortal";
import YourAdminRSOs from "./pages/home/YourAdminRSOs";




function App() {
  
  
  const { currentUser } = useContext(AuthContext);

  const { darkMode } = useContext(DarkModeContext);

  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div className={`theme-${darkMode ? "dark" : "light"}`}>
          <Navbar />
          <div style={{ display: "flex" }}>
            <LeftBar />
            <div style={{ flex: 6 }}>
              <Outlet />
            </div>
            <RightBar />
          </div>
        </div>
      </QueryClientProvider>
    );
  };

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/university/:universityID",
          element: <University />,
        },
        {
          path: "/rso/:rsoID",
          element: <RSO />,
        },
        {
          path: "/allRSOs",
          element: <RSOPage />,
        },
        {
          path: "/userRSOs",
          element: <JoinedRSO />,
        },
        {
          path: "/createRSO",
          element: <CreateRSORequest />,
        },
        {
          path: "/yourRSORequests",
          element: <YourRSORequests />,
        },
        {
          path: "/yourAdminRSOs",
          element: <YourAdminRSOs />,
        },
        {
          path: "/EventPortal",
          element: <EventPortal />,
        },
        {
          path: "/RSORequests",
          element: <ApproveRSORequests />,
        },
        {
          path: "/UniversityRequests",
          element: <UniversityRequestPortal />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/createUniversity",
      element: <CreateUniversity />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
