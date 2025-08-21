import { useNavigate } from "react-router-dom";

export default function BrandCard({ brand, onDetail }) {
  const navigate = useNavigate();

  const handleAddToCart = (item) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const index = existingCart.findIndex((i) => i.id === item.id);
    if (index > -1) {
      existingCart[index].quantity = (existingCart[index].quantity || 1) + 1;
    } else {
      existingCart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));

    window.dispatchEvent(new CustomEvent("cartUpdated"));

    navigate("/cart");
  };

  const imageSource =
    brand.coverUrl ||
    brand.imgUrl ||
    "https://via.placeholder.com/400x250?text=No+Image";

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        cursor: "pointer",
        height: "100%",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.18)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
      }}
    >
      <img
        src={imageSource}
        alt={brand.brand}
        style={{
          width: "100%",
          height: "220px",
          objectFit: "cover",
          backgroundColor: "#f3f4f6",
        }}
      />

      <div
        style={{
          padding: "16px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2 style={{
            margin: "0 0 4px",
            fontSize: "18px",
            fontWeight: "bold",
            color: "#111827",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minHeight: "44px",
          }}>{brand.brand}</h2>

          <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 8px", fontStyle: "italic" }}>
            {brand.type || "Tipe tidak tersedia"}
          </p>

          <p style={{
            fontSize: "14px",
            color: "#4b5563",
            marginBottom: "10px",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minHeight: "60px",
          }}>
            {brand.description || "Deskripsi produk belum tersedia."}
          </p>

          <p style={{ fontWeight: "bold", fontSize: "16px", color: "#1f2937", margin: 0 }}>
            Rp {brand.price?.toLocaleString("id-ID")}
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
          <button
            style={{
              flex: 1,
              padding: "10px 14px",
              backgroundColor: "#343639",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
            }}
            onClick={() => onDetail(brand.id)}
          >
            Lihat Detail
          </button>

          <button
            style={{
              flex: 1,
              padding: "10px 14px",
              backgroundColor: "#383939ff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
            }}
            onClick={() => handleAddToCart(brand)}
          >
            Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}
