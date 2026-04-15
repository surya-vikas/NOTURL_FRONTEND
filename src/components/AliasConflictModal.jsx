function AliasConflictModal({
  open,
  alias,
  isGeneratingRandom,
  onReenterAlias,
  onGenerateRandom,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/60 px-4">
      <article className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-6 shadow-2xl dark:border-rose-900/30 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
          Alias Error
        </p>
        <h2 className="mt-2 text-2xl font-bold text-rose-700 dark:text-rose-300">
          Key already taken
        </h2>
        <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-rose-300">
          <span className="font-semibold">{alias || "This alias"}</span> is already in use.
        </p>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Choose what you want to do next.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={onReenterAlias}
            disabled={isGeneratingRandom}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Re-enter Alias
          </button>
          <button
            type="button"
            onClick={onGenerateRandom}
            disabled={isGeneratingRandom}
            className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isGeneratingRandom ? "Generating..." : "Generate Random One"}
          </button>
        </div>
      </article>
    </div>
  );
}

export default AliasConflictModal;
