import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function login({ email, password }) {
  const { data } = await api.post("/login", { email, password });
  if (data.access_token) {
    localStorage.setItem("access_token", data.access_token);
  }
  return data;
}

export async function registerStaff({ email, password }) {
  const { data } = await api.post("/register", { email, password });
  return data;
}

export async function fetchBrands() {
  const { data } = await api.get("/brands");
  return data;
}

export async function fetchBrandById(id) {
  const { data } = await api.get(`/brands/${id}`);
  return data;
}

export async function createBrand(brand) {
  const payload = mapBrandToServer(brand);
  const { data } = await api.post("/brands", payload);
  return data;
}

export async function updateBrand(id, brand) {
  const payload = mapBrandToServer(brand);
  const { data } = await api.put(`/brands/${id}`, payload);
  return data;
}

export async function deleteBrand(id) {
  const { data } = await api.delete(`/brands/${id}`);
  return data;
}

export async function generateSummary(text) {
  const { data } = await api.post("/ai/summary", { text });
  return data.summary;
}

function mapBrandToServer(b = {}) {
  return {
    brand: b.brand ?? "",
    type: b.type ?? "",
    price: Number(b.price) || 0,
    description: b.description ?? "",
    coverUrl: b.coverUrl ?? "",
  };
}

export default api;
