import { useEffect } from "react";
import { FiCheck, FiMoon, FiSun, FiX } from "react-icons/fi";

const themeOptions = [
  {
    id: "light",
    label: "Day Mode",
    description: "Bright background for daytime use.",
    Icon: FiSun,
  },
  {
    id: "dark",
    label: "Night Mode",
    description: "Low-light interface for evening use.",
    Icon: FiMoon,
  },
];

function SettingsPanel({ open, theme, onThemeChange, onClose }) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[85] flex items-center justify-center bg-slate-950/60 px-4"
      onClick={onClose}
      role="presentation"
    >
      <article
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Preferences
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              Settings
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            aria-label="Close settings panel"
          >
            <FiX />
          </button>
        </div>

        <section className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
            Appearance
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {themeOptions.map((option) => {
              const isSelected = theme === option.id;
              const Icon = option.Icon;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onThemeChange?.(option.id)}
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-sm dark:border-blue-400 dark:bg-blue-900/20"
                      : "border-slate-200 bg-white hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-500"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                      <Icon />
                    </span>
                    {isSelected ? (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                        <FiCheck size={14} />
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {option.label}
                  </p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      </article>
    </div>
  );
}

export default SettingsPanel;
