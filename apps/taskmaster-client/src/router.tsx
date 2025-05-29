import { createBrowserRouter, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import BoardPage from "./pages/BoardPage/BoardPage";

export const ProtectedRoute = () => {
  const { token, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="layout">
      <Header token={token} />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const PublicRoute = () => {
  const { token, isInitialized } = useAuth();

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="layout">
      <Header token={token} />
      <main className="main">
        <Outlet />
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
      ],
    },
  ]
  // {
  //   future: {
  //     v7_startTransition: true,
  //   },
  // }
);
