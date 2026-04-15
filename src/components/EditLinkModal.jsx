import { useEffect, useState } from "react";
import { FiEdit3, FiX } from "react-icons/fi";

function EditLinkModal({ open, linkItem, onClose, onSave, isSubmitting }) {
  const [originalUrl, setOriginalUrl] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }
    setOriginalUrl(String(linkItem?.originalUrl || ""));
  }, [open, linkItem]);

  if (!open || !linkItem) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[72] flex items-center justify-center bg-slate-950/60 px-4">
      <article className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Link Control
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              Edit Link
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            aria-label="Close edit link modal"
          >
            <FiX />
          </button>
        </div>

        <form
          className="mt-5 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSave?.(originalUrl);
          }}
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Original URL
            </label>
            <input
              type="url"
              value={originalUrl}
              onChange={(event) => setOriginalUrl(event.target.value)}
              placeholder="https://example.com/new-destination"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              required
            />
          </div>

          <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            Short URL remains the same. Only destination URL changes.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/25 transition duration-300 hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FiEdit3 />
            {isSubmitting ? "Saving..." : "Save Link Changes"}
          </button>
        </form>
      </article>
    </div>
  );
}

export default EditLinkModal;
