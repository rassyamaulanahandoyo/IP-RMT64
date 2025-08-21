import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import BrandDetailPage from "./pages/BrandDetailPage";
import CMSLoginPage from "./pages/CMSLoginPage";
import CMSBrandListPage from "./pages/CMSBrandListPage";
import CMSBrandForm from "./pages/CMSBrandForm";
import BrandList from "./components/BrandList";
import CartPage from "./pages/CartPage";
import CMSRegisterPage from "./pages/CMSRegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/brands" element={<BrandList />} />
        <Route path="/brands/:id" element={<BrandDetailPage />} />
        <Route path="/cart" element={<CartPage />} />

        <Route path="/cms/login" element={<CMSLoginPage />} />
        <Route path="/cms/brands" element={<CMSBrandListPage />} />
        <Route path="/cms/brands/create" element={<CMSBrandForm mode="create" />} />
        <Route path="/cms/brands/edit/:id" element={<CMSBrandForm mode="edit" />} />
        <Route path="/cms/register" element={<CMSRegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
