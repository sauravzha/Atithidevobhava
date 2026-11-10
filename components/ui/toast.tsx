"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastProps = {
  id: string;
  message: string;
  variant?: "default" | "success" | "error";
  onClose?: () => void;
  duration?: number;
  className?: string;
};

export type ToastContextType = {
  /** Push a toast onto the queue. Returns the generated id. */
  toast: (
    options: Omit<ToastProps, "id" | "onClose"> & { onClose?: () => void },
  ) => string;
  /** Dismiss a specific toast by id. */
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextType | null>(null);

/** Maximum number of simultaneously visible toasts. */
const MAX_VISIBLE = 3;

let nextId = 0;
function generateId(): string {
  nextId += 1;
  return `toast-${nextId}-${Date.now()}`;
}

const variantBorder: Record<NonNullable<ToastProps["variant"]>, string> = {
  default: "border-l-primary",
  success: "border-l-forest",
  error: "border-l-error",
};

/* ------------------------------------------------------------------ */
/*  Single toast item                                                  */
/* ------------------------------------------------------------------ */

function ToastItem({
  id,
  message,
  variant = "default",
  duration = 5000,
  onClose,
  className,
  onDismiss,
}: ToastProps & { onDismiss: (id: string) => void }) {
  React.useEffect(() => {
    if (duration <= 0) return;

    const timer = window.setTimeout(() => {
      onDismiss(id);
      onClose?.();
    }, duration);

    return () => window.clearTimeout(timer);
  }, [id, duration, onDismiss, onClose]);

  const handleClose = () => {
    onDismiss(id);
    onClose?.();
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center justify-between gap-4 bg-surface border border-rule border-l-2 rounded-[3px] px-6 py-3 text-sm font-body text-text transition-colors duration-[120ms] motion-reduce:transition-none",
        variantBorder[variant ?? "default"],
        className,
      )}
    >
      <p className="flex-1">{message}</p>

      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={handleClose}
        className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] text-secondary hover:text-text transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded-[3px] motion-reduce:transition-none"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Provider                                                            */
/* ------------------------------------------------------------------ */

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    (
      options: Omit<ToastProps, "id" | "onClose"> & { onClose?: () => void },
    ): string => {
      const id = generateId();
      setToasts((prev) => {
        const next = [...prev, { ...options, id }];
        // keep only the newest toasts up to the limit
        return next.length > MAX_VISIBLE ? next.slice(-MAX_VISIBLE) : next;
      });
      return id;
    },
    [],
  );

  const value = React.useMemo<ToastContextType>(
    () => ({ toast, dismiss }),
    [toast, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast container pinned to bottom of viewport */}
      {toasts.length > 0 && (
        <div
          aria-label="Notifications"
          className="fixed bottom-6 left-6 right-6 z-50 flex flex-col gap-2 sm:left-auto sm:max-w-[420px]"
        >
          {toasts.map((t) => (
            <ToastItem key={t.id} {...t} onDismiss={dismiss} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook                                                                */
/* ------------------------------------------------------------------ */

export function useToast(): ToastContextType {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>.");
  }
  return ctx;
}
