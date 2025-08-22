import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function CMSRegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/register", { email, password });
      alert("Registrasi berhasil! Silakan login.");
      navigate("/cms/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registrasi gagal");
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
          Daftar
        </h2>

        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email"
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
              marginBottom: "20px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
            }}
          />

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
            Daftar
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <span>Sudah punya akun? </span>
          <a
            href="/cms/login"
            style={{ color: "#0071e3", textDecoration: "none" }}
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
