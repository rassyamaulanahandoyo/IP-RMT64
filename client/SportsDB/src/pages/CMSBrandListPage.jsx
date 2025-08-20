import { useEffect, useState } from "react";
import api from "../utils/api";

export default function CMSBrandListPage() {
  const [brands, setBrands] = useState([]);

  const fetchBrands = () => {
    api.get("/brands")
      .then(res => setBrands(res.data))
      .catch(console.error);
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus brand ini?")) return;
    try {
      await api.delete(`/brands/${id}`);
      fetchBrands();
    } catch (err) {
      alert("Gagal hapus");
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">CMS Brands</h2>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {brands.map(b => (
            <tr key={b.id}>
              <td className="border p-2">{b.id}</td>
              <td className="border p-2">{b.name}</td>
              <td className="border p-2">
                <button onClick={() => handleDelete(b.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
