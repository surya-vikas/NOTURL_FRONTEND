function ToastContainer({ toasts, onDismiss }) {
  if (!Array.isArray(toasts) || toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-50 flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg backdrop-blur ${
            toast.type === "error"
              ? "border-rose-200 bg-rose-50/95 text-rose-700"
              : "border-emerald-200 bg-emerald-50/95 text-emerald-700"
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-2">
            <p>{toast.message}</p>
            <button
              type="button"
              className="rounded-md border border-transparent bg-transparent px-1 py-0.5 text-xs font-bold text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              x
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
