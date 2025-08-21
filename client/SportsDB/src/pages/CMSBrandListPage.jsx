import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api";

export default function CMSBrandListPage() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await api.get("/brands");
      setBrands(res.data);
    } catch (err) {
      console.error("Gagal fetch brands:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin mau hapus brand ini?")) return;
    try {
      await api.delete(`/brands/${id}`);
      fetchBrands();
      alert("Brand berhasil dihapus!");
    } catch (err) {
      alert("Gagal menghapus brand");
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ fontSize: "24px", fontWeight: "700" }}>Brand List</h2>
        <button
          style={{
            padding: "10px 18px",
            backgroundColor: "#111827",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/cms/brands/create")}
        >
          Add New Brand
        </button>
      </div>

      <div
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(21, 20, 20, 0.08)",
          backgroundColor: "#fff",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#f9fafb" }}>
            <tr>
              <th style={thStyle}>Image</th>
              <th style={thStyle}>Brand</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  Loading data...
                </td>
              </tr>
            ) : brands.length > 0 ? (
              brands.map((brand) => (
                <tr key={brand.id}>
                  <td style={tdStyle}>
                    <img
                      src={brand.coverUrl}
                      alt={brand.brand}
                      style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
                    />
                  </td>
                  <td style={tdStyle}>{brand.brand}</td>
                  <td style={tdStyle}>Rp {brand.price.toLocaleString()}</td>
                  <td style={tdStyle}>
                    <button
                      style={{ ...btnBase, backgroundColor: "#232324ff", color: "#fff", marginRight: "8px" }}
                      onClick={() => navigate(`/cms/brands/edit/${brand.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      style={{ ...btnBase, backgroundColor: "#c53030", color: "#fff" }}
                      onClick={() => handleDelete(brand.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  No brands available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "14px 16px",
  fontSize: "14px",
  fontWeight: "600",
};

const tdStyle = {
  padding: "14px 16px",
  fontSize: "14px",
  color: "#4b5563",
  verticalAlign: "middle",
};

const btnBase = {
  padding: "8px 12px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "500",
  transition: "opacity 0.2s ease",
};
