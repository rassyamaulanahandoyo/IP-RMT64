import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 20px",
        backgroundColor: "#060606ff",
        color: "#fff",
      }}
    >
      <h1 style={{ margin: 6, cursor: "pointer" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
          SportsDB
        </Link>
      </h1>

      <div style={{ display: "flex", gap: "10px" }}>
        <Link to="/" style={btnStyle}>
          Home
        </Link>
        <Link to="/cms/login" style={btnStyle}>
          Login
        </Link>
        <Link to="/cms/register" style={btnStyle}>
          Daftar
        </Link>
      </div>
    </nav>
  );
}

const btnStyle = {
  color: "#fff",
  textDecoration: "none",
  background: "none",
  border: "none",
  cursor: "pointer",
};
