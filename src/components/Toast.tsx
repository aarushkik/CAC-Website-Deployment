"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, CircleAlert, X } from "lucide-react";

interface ToastOptions {
  message: string;
  tone?: "success" | "error";
  action?: { label: string; onClick: () => void };
}

interface ToastState extends ToastOptions {
  id: number;
}

const ToastContext = createContext<(options: ToastOptions) => void>(() => {});

/** Shows short confirmations ("Saved to your log") with an optional Undo. */
export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const dismiss = useCallback(() => {
    clearTimeout(timer.current);
    setToast(null);
  }, []);

  const show = useCallback((options: ToastOptions) => {
    clearTimeout(timer.current);
    setToast({ ...options, id: Date.now() });
    // Leave time to reach Undo; errors stay a little longer.
    timer.current = setTimeout(() => setToast(null), options.tone === "error" ? 9000 : 7000);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        className="no-print pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-4 sm:justify-end"
      >
        {toast && (
          <div
            key={toast.id}
            role={toast.tone === "error" ? "alert" : "status"}
            className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-xl bg-ink px-4 py-3 text-sm text-white shadow-lift"
          >
            {toast.tone === "error" ? (
              <CircleAlert className="mt-0.5 h-5 w-5 flex-none text-caution" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-[#5fd3a4]" aria-hidden="true" />
            )}
            <p className="flex-1 pt-0.5">{toast.message}</p>
            {toast.action && (
              <button
                type="button"
                className="rounded-md px-2 py-0.5 font-bold text-caution hover:bg-white/10"
                onClick={() => {
                  toast.action?.onClick();
                  dismiss();
                }}
              >
                {toast.action.label}
              </button>
            )}
            <button
              type="button"
              aria-label="Dismiss"
              className="rounded-md p-0.5 text-concrete-300 hover:bg-white/10 hover:text-white"
              onClick={dismiss}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}
