import type { AxiosError, AxiosResponse } from "axios";
import camelcaseKeys from "camelcase-keys";
import { useNavigate } from "react-router";
import snakecaseKeys from "snakecase-keys";
import { taskListApi } from "@/api";
import type { HttpMethods } from "@/types/http-methods";
import type { ProblemDetails } from "@/types/problem-details";
import { useAuth } from "./use-auth";
import { useI18n } from "./use-i18n";
import { useToast } from "./use-toast";

type RequestArgs<TRequest, TResponse> = {
  body?: TRequest;
  retryToAuth?: boolean;
  params?: Record<string, string>;
  onSuccess?: (data: TResponse, status: number) => void;
  onError?: (error: ProblemDetails) => void;
};

export const useHttpRequest = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const { language, t } = useI18n();

  const request = async <TRequest = null, TResponse = null>(
    method: HttpMethods,
    url: string,
    args?: RequestArgs<TRequest, TResponse>,
  ) => {
    try {
      const requestBody = args?.body
        ? snakecaseKeys(args.body, { deep: true })
        : null;

      const response: AxiosResponse<TResponse> = await taskListApi.request({
        url,
        method,
        data: requestBody,
        params: args?.params,
        withCredentials: true,
        headers: {
          "Accept-Language": language,
        },
      });

      const data = camelcaseKeys(response.data as object, {
        deep: true,
      }) as TResponse;

      args?.onSuccess?.(data, response.status);
    } catch (error: unknown) {
      const problem = error as AxiosError<ProblemDetails>;

      if (!problem.response) {
        toast.error(t("unable_to_connect_to_the_server"));

        navigate("/sign-in");

        return;
      }

      const errorResponse = problem.response.data;

      const cannotGetCurrentUser =
        problem.response.config.method === "get" &&
        errorResponse.status === 401 &&
        errorResponse.instance === "/api/users/me";

      if (args?.retryToAuth && cannotGetCurrentUser) {
        const hasSuccess = await renewRefreshToken();

        if (hasSuccess) await request(method, url, args);

        return;
      }

      args?.onError?.(errorResponse);
    }
  };

  const { renewRefreshToken } = useAuth(request);

  return { request };
};
