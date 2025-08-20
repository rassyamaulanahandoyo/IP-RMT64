import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import BrandDetailPage from "./pages/BrandDetailPage";
import CMSLoginPage from "./pages/CMSLoginPage";
import CMSBrandListPage from "./pages/CMSBrandListPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/brands/:id" element={<BrandDetailPage />} />
        <Route path="/cms/login" element={<CMSLoginPage />} />
        <Route path="/cms/brands" element={<CMSBrandListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App