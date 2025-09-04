// src/components/ProtectedRoute.tsx
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: "admin" | "user"; // optional role restriction
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // Wait until we know user state
  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If a role is required and user doesn’t match, block access
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // Otherwise allow access
  return <>{children}</>;
};

export default ProtectedRoute;
