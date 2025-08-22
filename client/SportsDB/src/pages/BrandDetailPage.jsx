import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function BrandDetailPage() {
    const { id } = useParams();
    const [brand, setBrand] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/brands/${id}`)
            .then((res) => setBrand(res.data))
            .catch(console.error);
    }, [id]);

    if (!brand) return <p style={{ padding: "20px", textAlign: "center" }}>Loading...</p>;

    return (
        <div
            style={{
                maxWidth: "600px",
                margin: "40px auto",
                padding: "20px",
                border: "1px solid #e0e2e6ff",
                borderRadius: "12px",
                backgroundColor: "#ffffffff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
        >
            <button
                onClick={() => navigate(-1)}
                style={{
                    marginBottom: "16px",
                    padding: "8px 12px",
                    backgroundColor: "#f2f3f5ff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f2f3f5ff")}
            >
                 Back to Home
            </button>

            <img
                src={brand.imgUrl || brand.coverUrl}
                alt={brand.brand || brand.name}
                style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "16px",
                }}
            />

            <h2
                style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#2a2b2cff",
                    marginBottom: "6px",
                }}
            >
                {brand.brand || brand.name}
            </h2>

            {brand.type && (
                <h4
                    style={{
                        fontSize: "16px",
                        color: "#2d2f32ff",
                        marginBottom: "12px",
                    }}
                >
                    {brand.type}
                </h4>
            )}

            <p
                style={{
                    fontSize: "14px",
                    color: "#404042ff",
                    marginBottom: "12px",
                    lineHeight: "1.6",
                }}
            >
                {brand.description}
            </p>

            {brand.price !== undefined && (
                <p
                    style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#1f2937",
                    }}
                >
                    Rp {brand.price?.toLocaleString()}
                </p>
            )}
        </div>
    );
}
