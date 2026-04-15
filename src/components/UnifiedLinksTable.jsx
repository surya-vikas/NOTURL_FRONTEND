import { FiCopy, FiEdit3, FiExternalLink, FiImage, FiTrash2 } from "react-icons/fi";

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

function UnifiedLinksTable({
  links,
  pendingDeleteIds = new Set(),
  pendingEditIds = new Set(),
  onCopy,
  onDelete,
  onEdit,
  onOpenQr,
}) {
  if (!Array.isArray(links) || links.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        No links yet. Create your first short URL above.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
      <table className="min-w-[960px] table-auto w-full">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <th className="px-5 py-4">Original URL</th>
            <th className="px-5 py-4">Short URL</th>
            <th className="px-5 py-4">Clicks</th>
            <th className="px-5 py-4">Date Created</th>
            <th className="px-5 py-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr
              key={link.id}
              className="border-t border-slate-100 text-sm text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800/70"
            >
              <td className="px-5 py-4">
                <a
                  href={link.originalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="line-clamp-2 max-w-[320px] break-all font-medium text-slate-700 transition hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-300"
                >
                  {link.originalUrl}
                </a>
              </td>
              <td className="px-5 py-4">
                <a
                  href={link.shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-blue-700 underline underline-offset-4 dark:text-blue-300"
                >
                  {link.shortUrl}
                  <FiExternalLink className="text-xs" />
                </a>
              </td>
              <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100">
                {Number(link.clicks || 0).toLocaleString()}
              </td>
              <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{formatDate(link.createdAt)}</td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onCopy(link.shortUrl)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    <FiCopy />
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(link)}
                    disabled={pendingEditIds.has(link.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:-translate-y-0.5 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                  >
                    <FiEdit3 />
                    {pendingEditIds.has(link.id) ? "Saving..." : "Edit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenQr(link)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:-translate-y-0.5 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                  >
                    <FiImage />
                    QR
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(link.id)}
                    disabled={pendingDeleteIds.has(link.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/50"
                  >
                    <FiTrash2 />
                    {pendingDeleteIds.has(link.id) ? "Deleting..." : "Delete"}
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

export default UnifiedLinksTable;
