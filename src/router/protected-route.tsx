import { useEffect } from "react";
import { Outlet } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useHttpRequest } from "@/hooks/use-http-request";

export const ProtectedRoute = () => {
  const { request } = useHttpRequest();
  const { getCurrentUser, isAuthenticated } = useAuth(request);

  useEffect(() => {
    getCurrentUser();
  }, []);

  if (!isAuthenticated) return null;

  return <Outlet />;
};
