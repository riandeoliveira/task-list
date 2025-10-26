import { useState } from "react";
import { useNavigate } from "react-router";
import { z } from "zod";
import { useUserStore } from "@/stores/user-store";
import type { User } from "@/types/user";
import type { useHttpRequest } from "./use-http-request";
import { useI18n } from "./use-i18n";
import { useLocalStorage } from "./use-local-storage";
import { useToast } from "./use-toast";

export const useAuth = (
  request: ReturnType<typeof useHttpRequest>["request"],
) => {
  const toast = useToast();
  const navigate = useNavigate();
  const userStore = useUserStore();

  const { t } = useI18n();

  const [hasUserSession, setHasUserSession] = useLocalStorage(
    "has_user_session",
    false,
    z.boolean(),
  );

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const renewRefreshToken = async () => {
    let hasSuccess = false;

    await request("POST", "/users/renew-refresh-token", {
      onSuccess: () => {
        setIsAuthenticated(true);

        hasSuccess = true;
      },
      onError: (error) => {
        if (error.status === 401 && hasUserSession) {
          toast.warning(t("session_expired_warning"));
        }

        if (error.status !== 401) {
          toast.error(error.detail);
        }

        endUserSession();

        hasSuccess = false;
      },
    });

    return hasSuccess;
  };

  const getCurrentUser = async () => {
    await request<null, User>("GET", "/users/me", {
      retryToAuth: true,
      onSuccess: (data) => {
        userStore.setCurrentUser(data);

        setIsAuthenticated(true);
      },
      onError: () => {
        setIsAuthenticated(false);
      },
    });
  };

  const endUserSession = () => {
    setHasUserSession(false);
    setIsAuthenticated(false);

    navigate("/sign-in");
  };

  return {
    isAuthenticated,
    hasUserSession,
    renewRefreshToken,
    getCurrentUser,
    endUserSession,
    setHasUserSession,
  };
};
