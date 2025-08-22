import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";

export default function CMSBrandForm({ mode }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        brand: "",
        type: "",
        price: "",
        description: "",
        coverUrl: ""
    });

    useEffect(() => {
        if (mode === "edit" && id) {
            api
                .get(`/brands/${id}`)
                .then((res) => {
                    setForm({
                        brand: res.data.brand,
                        type: res.data.type,
                        description: res.data.description,
                        price: res.data.price,
                        coverUrl: res.data.coverUrl
                    });
                })
                .catch((err) => console.error("Gagal ambil data brand:", err));
        }
    }, [mode, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (mode === "create") {
                await api.post("/brands", form);
                alert("Brand berhasil ditambahkan!");
            } else {
                await api.put(`/brands/${id}`, form);
                alert("Brand berhasil diperbarui!");
            }
            navigate("/cms/brands");
        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan. Coba lagi.");
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "20px auto" }}>
            <h2 style={{ marginBottom: "20px", fontWeight: "bold", fontSize: "22px" }}>
                {mode === "create" ? "Tambah Brand Baru" : "Edit Brand"}
            </h2>
            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    padding: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                }}
            >
                <input
                    type="text"
                    name="brand"
                    placeholder="Nama Brand"
                    value={form.brand}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />
                <input
                    type="text"
                    name="type"
                    placeholder="Tipe Brand"
                    value={form.type}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Harga"
                    value={form.price}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />
                <textarea
                    name="description"
                    placeholder="Deskripsi Brand"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    style={inputStyle}
                />
                <input
                    type="text"
                    name="coverUrl"
                    placeholder="Link Gambar"
                    value={form.coverUrl}
                    onChange={handleChange}
                    style={inputStyle}
                />

                <button
                    type="submit"
                    style={{
                        padding: "10px",
                        backgroundColor: "#111827",
                        color: "#fff",
                        fontWeight: "600",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                    }}
                >
                    {mode === "create" ? "Tambah Brand" : "Simpan Perubahan"}
                </button>
            </form>
        </div>
    );
}

const inputStyle = {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
};
