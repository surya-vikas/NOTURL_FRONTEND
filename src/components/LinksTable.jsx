import {
  FiCopy,
  FiExternalLink,
  FiLink2,
  FiPauseCircle,
  FiPlayCircle,
  FiTrash2,
} from "react-icons/fi";

const formatDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Unknown";
  }

  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function LinksTable({
  urlHistory,
  pendingDeleteIds,
  pendingStatusIds = new Set(),
  onCopyShortUrl,
  onDeleteUrl,
  onToggleStatus,
}) {
  if (!Array.isArray(urlHistory) || urlHistory.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-sm transition-colors duration-300 dark:bg-slate-800 dark:shadow-black/20">
        <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-slate-700 dark:text-blue-300">
          <FiLink2 className="text-2xl" />
        </div>
        <p className="mt-4 text-base font-semibold text-slate-800 dark:text-slate-100">
          No links yet. Start by creating one.
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Your recent links and performance data will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm transition-colors duration-300 dark:bg-slate-800 dark:shadow-black/20">
      <table className="table-auto w-full min-w-[860px]">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <th className="px-5 py-4">Original URL</th>
            <th className="px-5 py-4">Short URL</th>
            <th className="px-5 py-4">Clicks</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Date</th>
            <th className="px-5 py-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {urlHistory.map((urlItem) => (
            <tr
              key={urlItem.id}
              className={`border-t border-slate-100 text-sm text-slate-700 transition hover:bg-gray-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700/50 ${
                urlItem.isActive === false ? "bg-slate-50/70 dark:bg-slate-800/60" : ""
              }`}
            >
              <td className="px-5 py-4">
                <a
                  href={urlItem.originalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="line-clamp-2 max-w-[300px] break-all font-medium text-slate-700 transition hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-300"
                >
                  {urlItem.originalUrl}
                </a>
              </td>
              <td className="px-5 py-4">
                <a
                  href={urlItem.shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-blue-700 underline underline-offset-4 dark:text-blue-300"
                >
                  {urlItem.shortUrl}
                </a>
              </td>
              <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100">{urlItem.clicks}</td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    urlItem.isActive === false
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                  }`}
                >
                  {urlItem.isActive === false ? "Inactive" : "Active"}
                </span>
              </td>
              <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{formatDate(urlItem.createdAt)}</td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                    onClick={() => onCopyShortUrl(urlItem.shortUrl)}
                  >
                    <FiCopy />
                    Copy
                  </button>
                  <a
                    href={urlItem.shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      urlItem.isActive === false
                        ? "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500"
                        : "bg-blue-50 text-blue-700 hover:-translate-y-0.5 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                    }`}
                    onClick={(event) => {
                      if (urlItem.isActive === false) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <FiExternalLink />
                    Visit
                  </a>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:-translate-y-0.5 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50"
                    onClick={() => onToggleStatus(urlItem)}
                    disabled={pendingStatusIds.has(urlItem.id)}
                  >
                    {urlItem.isActive === false ? <FiPlayCircle /> : <FiPauseCircle />}
                    {pendingStatusIds.has(urlItem.id)
                      ? "Updating..."
                      : urlItem.isActive === false
                      ? "Activate"
                      : "Suspend"}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/50"
                    onClick={() => onDeleteUrl(urlItem.id)}
                    disabled={pendingDeleteIds.has(urlItem.id)}
                  >
                    <FiTrash2 />
                    {pendingDeleteIds.has(urlItem.id) ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LinksTable;
