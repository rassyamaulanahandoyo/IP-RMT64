import { useState, useEffect } from "react";
import axios from "axios";
import BrandCard from "../components/BrandCard";

export default function BrandList() {
  const [brands, setBrands] = useState([]);
  const [summaries, setSummaries] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [cartCount, setCartCount] = useState(
    JSON.parse(localStorage.getItem("cart"))?.length || 0
  );

  useEffect(() => {
    fetch("http://localhost:3000/brands")
      .then(res => res.json())
      .then(data => setBrands(data))
      .catch(err => console.error(err));
  }, []);

  const handleGenerateSummary = async (brandId, description) => {
    setLoadingId(brandId);
    try {
      const response = await axios.post("http://localhost:3000/ai/summary", {
        text: description,
      });
      setSummaries(prev => ({ ...prev, [brandId]: response.data.summary }));
    } catch (err) {
      console.error("AI summary error:", err.response?.data || err.message);
      alert("Gagal generate summary AI");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDetail = (id) => window.location.href = `/brands/${id}`;

  const handleAddToCart = (brand) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.findIndex(i => i.id === brand.id);

    if (index > -1) {
      cart[index].quantity = (cart[index].quantity || 1) + 1;
    } else {
      cart.push({
        id: brand.id,
        name: brand.brand || brand.name,
        type: brand.type || "",
        price: brand.price || 0,
        description: brand.description || "",
        imgUrl: brand.imgUrl || brand.coverUrl,
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setCartCount(cart.length);
    window.dispatchEvent(new CustomEvent("cartUpdated"));
    alert("Produk berhasil ditambahkan ke keranjang!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: "20px" }}>
        {brands.map((brand) => (
          <BrandCard
            key={brand.id}
            brand={brand}
            summary={summaries[brand.id]}
            loading={loadingId === brand.id}
            onGenerateSummary={() => handleGenerateSummary(brand.id, brand.description)}
            onDetail={handleDetail}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
