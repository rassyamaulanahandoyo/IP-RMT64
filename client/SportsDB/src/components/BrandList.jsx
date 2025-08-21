import BrandCard from "../components/BrandCard";
import { useEffect, useState } from "react";

export default function BrandList() {
  const [brands, setBrands] = useState([]);
  const [cartCount, setCartCount] = useState(
    JSON.parse(localStorage.getItem("cart"))?.length || 0
  );

  useEffect(() => {
    fetch("http://localhost:3000/brands")
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch((err) => console.error(err));
  }, []);

  const handleAddToCart = (brand) => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      const exist = cart.find((item) => item.id === brand.id);
      if (exist) {
        alert("Produk sudah ada di keranjang!");
        return;
      }

      cart.push({
        id: brand.id,
        name: brand.brand || brand.name,
        type: brand.type || "",
        price: brand.price || 0,
        description: brand.description || "",
        imgUrl: brand.imgUrl || brand.coverUrl,
      });

      localStorage.setItem("cart", JSON.stringify(cart));

      setCartCount(cart.length);

      alert("Produk berhasil ditambahkan ke keranjang!");
    } catch (error) {
      console.error("Gagal menambahkan produk:", error);
      alert("Terjadi kesalahan saat menambahkan produk.");
    }
  };

  const handleDetail = (id) => {
    window.location.href = `/brands/${id}`;
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Daftar Produk</h2>
        <button
          onClick={() => (window.location.href = "/cart")}
          style={{
            padding: "8px 14px",
            backgroundColor: "#343639",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            position: "relative",
          }}
        >
          Lihat Keranjang 🛒
          {cartCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-6px",
                right: "-6px",
                backgroundColor: "red",
                color: "white",
                borderRadius: "50%",
                padding: "2px 8px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {brands.map((brand) => (
          <BrandCard
            key={brand.id}
            brand={brand}
            onDetail={handleDetail}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
