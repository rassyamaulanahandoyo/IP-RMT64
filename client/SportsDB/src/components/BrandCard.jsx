export default function BrandCard({ brand, onDetail }) {
  return (
    <div className="border rounded-lg shadow p-4 flex flex-col">
      <img src={brand.coverUrl} alt={brand.name} className="h-40 w-full object-cover rounded-md" />
      <h3 className="text-lg font-semibold mt-2">{brand.name}</h3>
      <button
        onClick={() => onDetail(brand.id)}
        className="mt-auto bg-blue-500 text-white px-3 py-1 rounded"
      >
        Detail
      </button>
    </div>
  );
}
