import { usePage } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";

export default function LayoutMain({ children }) {
  const { flash } = usePage().props;

  if (flash.success) {
    toast.success(flash.success);
  }

  if (flash.error) {
    toast.error(flash.error);
  }
  return (
    <>
      {children}

      <Toaster
        toastOptions={{
          style: {
            background: "var(--color-base-100)",
            border: "1px solid var(--app-border)",
            color: "var(--color-base-content)",
          },
        }}
      />
    </>
  );
}
