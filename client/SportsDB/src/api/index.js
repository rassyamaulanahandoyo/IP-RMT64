import axios from "axios";
const BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function login({ email, password }) {
  const params = new URLSearchParams();
  params.append("email", email);
  params.append("password", password);

  const { data } = await api.post("/login", params);

  if (data.access_token) {
    localStorage.setItem("token", data.access_token);
  }

  return data;
}

export async function registerStaff({ email, password }) {
  const params = new URLSearchParams();
  params.append("email", email);
  params.append("password", password);

  const { data } = await api.post("/register", params);
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
