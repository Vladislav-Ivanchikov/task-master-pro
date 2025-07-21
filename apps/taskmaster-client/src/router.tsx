import { createBrowserRouter, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import BoardPage from "./pages/BoardPage/BoardPage";
import TaskDetailsPage from "./pages/TaskDetailsPage/TaskDetailsPage";
import { Loader } from "@taskmaster/ui-kit";

export const ProtectedRoute = () => {
  const { token, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return <Loader size="lg" />;
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="layout">
      <Header token={token} />
      <main className="main">
        {!isInitialized ? <Loader size="lg" /> : <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export const PublicRoute = () => {
  const { token, isInitialized } = useAuth();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="layout">
      <Header token={token} />
      <main className="main">
        {!isInitialized ? <Loader size="lg" /> : <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export const router = createBrowserRouter(
  [
    {
      element: <PublicRoute />,
      children: [
        { path: "/login", element: <LoginPage /> },
        { path: "/register", element: <RegisterPage /> },
      ],
    },
    {
      element: <ProtectedRoute />,
      children: [
        { path: "/", element: <DashboardPage /> },
        { path: "/profile", element: <ProfilePage /> },
        { path: "/boards/:boardId", element: <BoardPage /> },
        {
          path: "/boards/:boardId/tasks/:taskId",
          element: <TaskDetailsPage />,
        },
      ],
    },
  ]
  // {
  //   future: {
  //     v7_startTransition: true,
  //   },
  // }
);
