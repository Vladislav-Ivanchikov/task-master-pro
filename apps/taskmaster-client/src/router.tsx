import { createBrowserRouter } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import ProfilePage from "./pages/ProfilePage";

export const ProtectedRoute = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  // console.log("ProtectedRoute", token);

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
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/" />;
  }

  // console.log("PublicRoute", token);

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

export const router = createBrowserRouter([
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
    ],
  },
]);
