import { useEffect, useState } from "react";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  const handleRemove = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleQuantityChange = (id, delta) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max((item.quantity || 1) + delta, 1);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.price * (item.quantity || 1)),
    0
  );

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const customer = JSON.parse(localStorage.getItem("user")) || {
        name: "Guest",
        email: "guest@example.com",
      };

      const response = await fetch("http://localhost:3000/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            id: item.id,
            name: item.name || item.brand,
            type: item.type || "Tidak ada tipe",
            price: item.price,
            quantity: item.quantity || 1,
          })),
          totalPrice,
          customer,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Checkout gagal");
        return;
      }

      window.snap.pay(data.token, {
        onSuccess: function (result) {
          alert("Pembayaran berhasil!");
          console.log(result);
          localStorage.removeItem("cart");
          setCartItems([]);
          window.dispatchEvent(new Event("cartUpdated"));
        },
        onPending: function (result) {
          alert("Menunggu pembayaran...");
          console.log(result);
        },
        onError: function (result) {
          alert("Pembayaran gagal!");
          console.log(result);
        },
        onClose: function () {
          alert("Kamu menutup popup pembayaran.");
        },
      });
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Terjadi kesalahan saat checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "20px auto", padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", fontWeight: "bold", fontSize: "24px" }}>
        Keranjang Belanja
      </h2>

      {cartItems.length === 0 ? (
        <p style={{ fontSize: "16px", color: "#555" }}>
          Keranjang kosong. Yuk, tambahkan produk!
        </p>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    flex: 1,
                  }}
                >
                  <img
                    src={
                      item.coverUrl ||
                      item.imgUrl ||
                      "https://via.placeholder.com/100x100?text=No+Image"
                    }
                    alt={item.name || item.brand}
                    style={{
                      width: "90px",
                      height: "90px",
                      borderRadius: "6px",
                      objectFit: "cover",
                    }}
                  />

                  <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: "18px" }}>
                      {item.name || item.brand}
                    </h3>
                    <p
                      style={{
                        margin: "0 0 6px",
                        color: "#666",
                        fontSize: "14px",
                        maxWidth: "350px",
                      }}
                    >
                      {item.description || "Deskripsi produk belum tersedia."}
                    </p>
                    <p
                      style={{
                        margin: "0 0 4px",
                        color: "#4b5563",
                        fontSize: "14px",
                      }}
                    >
                      <strong>Tipe:</strong> {item.type || "Tidak ada tipe"}
                    </p>
                    <p
                      style={{
                        margin: "0 0 8px",
                        fontWeight: "bold",
                        fontSize: "16px",
                        color: "#1f2937",
                      }}
                    >
                      Rp {item.price.toLocaleString("id-ID")}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginTop: "6px",
                      }}
                    >
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        style={quantityBtnStyle}
                      >
                        -
                      </button>
                      <span>{item.quantity || 1}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        style={quantityBtnStyle}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRemove(item.id)}
                  style={removeBtnStyle}
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "20px",
              padding: "16px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            <span>Total :</span>
            <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
          </div>

          <div style={{ marginTop: "20px", textAlign: "right" }}>
            <button
              onClick={handleCheckout}
              disabled={loading}
              style={checkoutBtnStyle}
            >
              {loading ? "Memproses..." : "Checkout Sekarang"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const quantityBtnStyle = {
  padding: "4px 8px",
  backgroundColor: "#383939ff",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
};

const removeBtnStyle = {
  padding: "8px 12px",
  backgroundColor: "#343332ff",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  height: "36px",
};

const checkoutBtnStyle = {
  padding: "12px 20px",
  backgroundColor: "#1f2937",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
};
