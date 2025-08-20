import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function CMSLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let { data } = await api.post("/login", { email, password });
      localStorage.setItem("access_token", data.access_token);
      navigate("/cms/brands");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#fff",
        fontFamily: "Helvetica, Arial, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px", padding: "0 20px" }}>
        <h2
          style={{
            fontWeight: "600",
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "28px",
          }}
        >
          Login
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email atau no. handphone"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
            }}
          />

          <div style={{ textAlign: "right", marginBottom: "20px" }}>
            <a
              href="#"
              style={{
                fontSize: "13px",
                color: "#0071e3",
                textDecoration: "none",
              }}
            >
              Lupa password?
            </a>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              backgroundColor: "#0071e3",
              color: "#fff",
              padding: "10px",
              border: "none",
              borderRadius: "25px",
              fontWeight: "500",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>

        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <a
            href="#"
            style={{
              fontSize: "14px",
              color: "#0071e3",
              textDecoration: "none",
            }}
          >
            Daftar akun
          </a>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "20px 0",
          }}
        >
          <hr style={{ flex: 1, border: "none", borderTop: "1px solid #ccc" }} />
          <span style={{ margin: "0 10px", fontSize: "12px", color: "#666" }}>
            ATAU
          </span>
          <hr style={{ flex: 1, border: "none", borderTop: "1px solid #ccc" }} />
        </div>

        <button
          style={{
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            backgroundColor: "#fff",
            fontWeight: "500",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          <span style={{ marginRight: "8px", fontSize: "16px" }}>G</span> Masuk
          dengan Google
        </button>
      </div>
    </div>
  );
}


