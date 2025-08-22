import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Swal from "sweetalert2";

export default function CMSLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleReady, setGoogleReady] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/login", { email, password });
      localStorage.setItem("access_token", data.access_token);
      navigate("/cms/brands");
    } catch (err) {
      alert(err.response?.data?.message || "Login gagal");
    }
  };

  const handleGoogleResponse = async (response) => {
    try {
      const { data } = await api.post("/google-login", { tokenId: response.credential });
      localStorage.setItem("access_token", data.access_token);
      navigate("/cms/brands");
    } catch (err) {
      alert(err.response?.data?.message || "Login dengan Google gagal");
    }
  };

  useEffect(() => {
		if (localStorage.getItem("access_token")) {
			Swal.fire("Kamu sudah login!");
			navigate("/");
		}

		google.accounts.id.initialize({
			client_id: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
			callback: handleGoogleResponse,
		});
		google.accounts.id.renderButton(
			document.getElementById("google-login"),
			{ theme: "outline", size: "large" }, 
		);
		google.accounts.id.prompt();
	}, []);

  const handleGoogleLogin = () => {
    if (googleReady && window.google) {
      window.google.accounts.id.prompt();
    } else {
      alert("Google API belum siap, tunggu sebentar...");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontFamily: "Helvetica, Arial, sans-serif",
        backgroundColor: "#fff",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px", padding: "0 20px" }}>
        <h2 style={{ fontWeight: "600", textAlign: "center", marginBottom: "30px", fontSize: "28px" }}>Login</h2>

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
            <a href="#" style={{ fontSize: "13px", color: "#0071e3", textDecoration: "none" }}>Lupa password?</a>
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
          <a href="#" style={{ fontSize: "14px", color: "#0071e3", textDecoration: "none" }}>Daftar akun</a>
        </div>

        <div style={{ display: "flex", alignItems: "center", margin: "20px 0" }}>
          <hr style={{ flex: 1, border: "none", borderTop: "1px solid #ccc" }} />
          <span style={{ margin: "0 10px", fontSize: "12px", color: "#666" }}>ATAU</span>
          <hr style={{ flex: 1, border: "none", borderTop: "1px solid #ccc" }} />
        </div>

        <div
          id="google-login"
          style={{
            width: "100%",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "25px",
            padding: "10px",
            fontWeight: "500",
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google Logo"
            style={{ width: "18px", height: "18px" }}
          />
          Masuk dengan Google
        </div>
      </div>
    </div>
  );
}
