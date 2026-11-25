import { Routes, Route, Navigate } from "react-router-dom";
import SellerAuth from "./pages/seller/SellerAuth.jsx";

// Placeholder only. The real dashboard will be built after the backend
// (Node.js + Express + MySQL) login is connected.
function SellerDashboardPlaceholder() {
  return (
    <div style={{ padding: "48px", textAlign: "center" }}>
      <h1>Seller Dashboard</h1>
      <p>Coming soon. This page will open after real login is connected.</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<SellerAuth />} />
      <Route path="/seller/dashboard" element={<SellerDashboardPlaceholder />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
