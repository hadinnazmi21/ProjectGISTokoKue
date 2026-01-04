// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import DaftarToko from "./pages/DaftarToko";
import MapPage from "./pages/MapPage";
import About from "./pages/About";
import TokoDetail from "./pages/TokoDetail";
import TokoDetail2 from "./pages/TokoDetail2";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import DashboardOwner from "./pages/dashboard/DashboardOwner";
import DashboardAdmin from "./pages/dashboard/DashboardAdmin";
import LogHistory from "./pages/dashboard/LogHistory";
import Settings from "./pages/dashboard/Settings";

export default function App() {
  return (
    <Routes>
      {/* Public Routes dengan Navbar & Footer */}
      <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
      <Route path="/daftar-toko" element={<><Navbar /><DaftarToko /><Footer /></>} />
      <Route path="/map" element={<><Navbar /><MapPage /><Footer /></>} />
      <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
      
      {/* Toko Detail Routes - 2 versi berbeda */}
      <Route path="/toko/:id" element={<><Navbar /><TokoDetail /><Footer /></>} />
      <Route path="/detail/:id" element={<><Navbar /><TokoDetail2 /><Footer /></>} />

      {/* Auth Routes (tanpa Navbar & Footer) */}
      <Route path="/login" element={<Login />} />

      {/* Dashboard Routes (tanpa Navbar & Footer) */}
      <Route path="/dashboard/owner" element={<DashboardOwner />} />
      <Route path="/dashboard/admin" element={<DashboardAdmin />} />
      <Route path="/dashboard/log-history" element={<LogHistory />} />
      <Route path="/dashboard/settings" element={<Settings />} />

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}