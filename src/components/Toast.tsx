import { useEffect } from "react";

type ToastProps = {
  open: boolean;
  message: string;
  variant?: "info" | "success" | "warning" | "danger";
  onClose: () => void;
};

function variantClasses(variant: ToastProps["variant"]) {
  switch (variant) {
    case "success":
      return "border-white bg-green-700 text-text";
    case "warning":
      return "border-white bg-yellow-400 text-text";
    case "danger":
      return "border-white bg-red-700 text-text";
    default:
      return "border-border text-text";
  }
}

export function Toast({ open, message, variant = "info", onClose }: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [open, onClose]);

  return (
    <div
      className={`
        fixed bottom-4 left-1/2 z-50 w-[min(520px,calc(100%-2rem))] -translate-x-1/2
        transition-all duration-500 ease-in-out
        ${open 
          ? "opacity-100 translate-y-0 visible" 
          : "opacity-0 translate-y-4 invisible"}
      `}
    >
      <div className={`rounded-xl border bg-card px-4 py-3 shadow-soft ${variantClasses(variant)}`}>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}
