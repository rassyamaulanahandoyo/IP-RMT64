import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import BrandCard from "../components/BrandCard";

export default function HomePage() {
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/brands")
      .then(res => setBrands(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      {brands.map(b => (
        <BrandCard key={b.id} brand={b} onDetail={(id) => navigate(`/brands/${id}`)} />
      ))}
    </div>
  );
}
