import { h } from "preact";
import Router from "preact-router";
import AdminLogin from "../pages/AdminLogin";
import { AuthProvider } from "../context/AuthContext";

const AppRoutes = () => {
  return (
    <AuthProvider>
    <Router>
      <AdminLogin path="/access-panel" />
    </Router>
  </AuthProvider>
  );
};

export default AppRoutes;