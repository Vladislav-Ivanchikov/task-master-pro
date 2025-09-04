import { Toast } from "@taskmaster/ui-kit/dist/components/toast/toast.types.js";

export const errorInfo = (
  error: unknown,
  showToast: (toast: Omit<Toast, "id">) => void
) => {
  let message = "Unknown error";

  if (error instanceof Error && error.message) {
    message = error.message;
  } else if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as any).message === "string"
  ) {
    message = (error as any).message;
  }

  showToast({ message, type: "error" });
};
