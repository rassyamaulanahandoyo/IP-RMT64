import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import BrandCard from "../components/BrandCard";

export default function HomePage() {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/brands")
            .then((res) => setItems(res.data || []))
            .catch(console.error);
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: "18px 0"
                }}
            >
                <h3 style={{ margin: 0 }}>Welcome Home🎶</h3>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "20px"
                }}
            >
                {items.map((b, idx) => (
                    <BrandCard
                        key={b.id || idx}
                        brand={b}
                        onDetail={(id) => navigate(`/brands/${id}`)}
                    />
                ))}
            </div>
        </div>
    );
}
