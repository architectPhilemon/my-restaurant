// src/components/ProtectedRoute.tsx
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: "admin" | "user"; // optional role restriction
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth(); // ✅ use isLoading instead of loading

  // Wait for auth check
  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  // If not logged in → redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If route requires a role → check user.role safely
  if (role && (user.role ?? "user") !== role) {
    return <Navigate to="/" replace />;
  }

  // Otherwise → allow access
  return <>{children}</>;
};

export default ProtectedRoute;
