import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

interface HeaderProps {
  token: string | null;
}

const Header = ({ token }: HeaderProps) => {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <header className="header">
      <h1 className="logo">Task Master Pro</h1>
      <nav className="navBar">
        {token ? (
          <>
            <Link to="/">Dashboard</Link>
            <a onClick={handleLogout}>Logout</a>
          </>
        ) : (
          <>
            {" "}
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
