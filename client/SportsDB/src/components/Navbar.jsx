import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const total = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
      setCartCount(total);
    };

    updateCartCount(); 

    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 20px",
        backgroundColor: "#020101dc",
        color: "#fff",
      }}
    >
      <h1 style={{ margin: 6, cursor: "pointer" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
          SportsDB
        </Link>
      </h1>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Link to="/" style={btnStyle}>Home</Link>
        <Link to="/cms/login" style={btnStyle}>Login</Link>
        <Link to="/cms/register" style={btnStyle}>Daftar</Link>

        <Link
          to="/cart"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            color: "#fff",
            textDecoration: "none",
            fontSize: "20px",
          }}
        >
          <FaShoppingCart />
          {cartCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-5px",
                right: "-10px",
                background: "red",
                color: "white",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {cartCount}
            </span>
          )}
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
