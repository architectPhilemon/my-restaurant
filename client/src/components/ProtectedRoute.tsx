import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: "admin" | "user"; // optional role restriction
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth(); // ✅ use isLoading instead of loading

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role && user.role !== role) {   // ✅ safe role check
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
