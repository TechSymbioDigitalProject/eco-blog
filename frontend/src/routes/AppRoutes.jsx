import { h } from "preact";
import Router from "preact-router";
import AdminLogin from "../pages/AdminLogin";
import AdminHome from "../pages/AdminHome";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

const PublicRoutes = () => (
  <Router>
    
  </Router>
);

const ProtectedRoutes = () => (
  <AuthProvider>
    <Router>
      <AdminLogin path="/access-panel" />
      <ProtectedRoute path="/admin-home">
        <AdminHome />
      </ProtectedRoute>
    </Router>
  </AuthProvider>
);

const AppRoutes = () => (
  <>
    <PublicRoutes />
    <ProtectedRoutes />
  </>
);

export default AppRoutes;
