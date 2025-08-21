import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import BrandCard from "../components/BrandCard";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [summaries, setSummaries] = useState({});
  const [loadingSummary, setLoadingSummary] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/brands")
      .then((res) => {
        setItems(res.data || []);
      })
      .catch(console.error);
  }, []);

  const handleGenerateSummary = async (brand) => {
    setLoadingSummary((prev) => ({ ...prev, [brand.id]: true }));
    try {
      const { data } = await api.post("/ai/summary", { text: brand.description });
      setSummaries((prev) => ({ ...prev, [brand.id]: data.summary }));
    } catch (err) {
      console.error(err);
      setSummaries((prev) => ({ ...prev, [brand.id]: "Gagal membuat ringkasan" }));
    } finally {
      setLoadingSummary((prev) => ({ ...prev, [brand.id]: false }));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>Welcome Home 🎶</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {items.map((b) => (
          <BrandCard
            key={b.id}
            brand={b}
            summary={summaries[b.id]}
            loading={loadingSummary[b.id]}
            onDetail={(id) => navigate(`/brands/${id}`)}
            onGenerateSummary={() => handleGenerateSummary(b)}
          />
        ))}
      </div>
    </div>
  );
}
