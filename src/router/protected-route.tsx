import { useEffect } from "react";
import { Outlet } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useHttp } from "@/hooks/use-http";

export const ProtectedRoute = () => {
  const { request } = useHttp();
  const { getCurrentUser, isAuthenticated } = useAuth(request);

  useEffect(() => {
    getCurrentUser();
  }, []);

  if (!isAuthenticated) return null;

  return <Outlet />;
};
