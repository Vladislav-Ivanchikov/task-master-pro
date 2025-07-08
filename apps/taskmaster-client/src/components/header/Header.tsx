import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

interface HeaderProps {
  token: string | null;
}

const Header = ({ token }: HeaderProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <h1 className="logo">TMP</h1>
      <nav className="nav">
        {token ? (
          <>
            <Link to="/">Dashboard</Link>
            <Link to="/profile">Profile</Link>
            <a onClick={handleLogout}>Logout</a>
          </>
        ) : (
          <div className="auth-links">
            {" "}
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
