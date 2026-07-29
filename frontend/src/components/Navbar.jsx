import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <Link to="/" className="logo">InvoiceGo</Link>
      <div className="links">
        {token ? (
          <>
            <Link to="/">Dashboard</Link>
            <Link to="/clients">Clients</Link>
            <Link to="/invoices/new"><button className="btn">New Invoice</button></Link>
            <button className="btn secondary" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register"><button className="btn">Sign Up</button></Link>
          </>
        )}
      </div>
    </div>
  );
}
