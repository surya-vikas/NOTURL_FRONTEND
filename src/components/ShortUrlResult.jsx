function ShortUrlResult({ shortUrl, onCopy }) {
  if (!shortUrl) {
    return null;
  }

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
        Short URL Ready
      </p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={shortUrl}
          target="_blank"
          rel="noreferrer"
          className="break-all text-sm font-semibold text-emerald-700 underline decoration-emerald-400 decoration-2 underline-offset-4"
        >
          {shortUrl}
        </a>
        <button
          type="button"
          onClick={() => onCopy(shortUrl)}
          className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
        >
          Copy
        </button>
      </div>
    </div>
  );
}

export default ShortUrlResult;
