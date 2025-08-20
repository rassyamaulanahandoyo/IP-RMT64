import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function BrandDetailPage() {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/brands/${id}`)
      .then(res => setBrand(res.data))
      .catch(console.error);
  }, [id]);

  if (!brand) return <p className="p-4">Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <button onClick={() => navigate(-1)} className="mb-4 bg-gray-300 px-3 py-1 rounded">&larr; Back</button>
      <div className="border shadow p-4 rounded">
        <img src={brand.coverUrl} alt={brand.name} className="w-full h-60 object-cover rounded mb-4" />
        <h1 className="text-2xl font-bold">{brand.name}</h1>
        <p className="mt-2">{brand.description}</p>
      </div>
    </div>
  );
}
