import { type ExternalToast, toast } from "sonner";
import { cn } from "@/utils/cn";

export const useToast = () => {
  const error = (message: string, data?: ExternalToast) => {
    toast.error(message, {
      ...data,
      className: cn("!bg-red-600 !border-red-600", data?.className),
    });
  };

  const info = (message: string, data?: ExternalToast) => {
    toast.info(message, {
      ...data,
      className: cn("!bg-blue-600 !border-blue-600", data?.className),
    });
  };

  const message = (message: string, data?: ExternalToast) => {
    toast.info(message, data);
  };

  const success = (message: string, data?: ExternalToast) => {
    toast.success(message, {
      ...data,
      className: cn("!bg-green-600 !border-green-600", data?.className),
    });
  };

  const warning = (message: string, data?: ExternalToast) => {
    toast.warning(message, {
      ...data,
      className: cn("!bg-yellow-600 !border-yellow-600", data?.className),
    });
  };

  return {
    error,
    info,
    message,
    success,
    warning,
  };
};
