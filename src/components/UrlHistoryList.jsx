const formatDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Unknown date";
  }

  return parsed.toLocaleString();
};

function UrlHistoryList({
  urlHistory,
  pendingDeleteIds,
  onCopyShortUrl,
  onDeleteUrl,
}) {
  if (!Array.isArray(urlHistory) || urlHistory.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-medium text-slate-500">
        No URLs created yet
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {urlHistory.map((urlItem) => (
        <li
          key={urlItem.id}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Original URL</p>
          <a
            href={urlItem.originalUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-1 block break-all text-sm font-medium text-slate-700 hover:text-teal-600"
          >
            {urlItem.originalUrl}
          </a>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <a
              href={urlItem.shortUrl}
              target="_blank"
              rel="noreferrer"
              className="break-all text-sm font-semibold text-teal-700 underline underline-offset-4"
            >
              {urlItem.shortUrl}
            </a>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                onClick={() => onCopyShortUrl(urlItem.shortUrl)}
              >
                Copy
              </button>
              <button
                type="button"
                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70"
                onClick={() => onDeleteUrl(urlItem.id)}
                disabled={pendingDeleteIds.has(urlItem.id)}
              >
                {pendingDeleteIds.has(urlItem.id) ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
            <span>Clicks: {urlItem.clicks}</span>
            <span>Created: {formatDate(urlItem.createdAt)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default UrlHistoryList;
