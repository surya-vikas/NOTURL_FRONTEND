import { useEffect, useMemo, useState } from "react";
import { FiDownload, FiImage, FiRefreshCw } from "react-icons/fi";
import QRCode from "qrcode";

const qrSettings = {
  width: 320,
  margin: 1,
  color: {
    dark: "#0f172a",
    light: "#ffffff",
  },
};

const isValidUrl = (value) => {
  try {
    const parsed = new URL(String(value || "").trim());
    return ["http:", "https:"].includes(parsed.protocol);
  } catch (error) {
    return false;
  }
};

function QrGenerator({ defaultShortUrl = "", urlHistory = [], onNotify }) {
  const [targetUrl, setTargetUrl] = useState(defaultShortUrl);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!targetUrl && defaultShortUrl) {
      setTargetUrl(defaultShortUrl);
    }
  }, [defaultShortUrl, targetUrl]);

  const activeShortUrls = useMemo(() => {
    if (!Array.isArray(urlHistory)) {
      return [];
    }

    return urlHistory
      .filter((urlItem) => urlItem?.shortUrl && urlItem?.isActive !== false)
      .map((urlItem) => urlItem.shortUrl);
  }, [urlHistory]);

  const handleGenerate = async (event) => {
    event.preventDefault();
    const normalizedUrl = String(targetUrl || "").trim();

    if (!normalizedUrl) {
      onNotify?.({ type: "error", message: "Enter a URL to generate QR code." });
      return;
    }

    if (!isValidUrl(normalizedUrl)) {
      onNotify?.({
        type: "error",
        message: "Enter a valid URL that starts with http:// or https://",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const dataUrl = await QRCode.toDataURL(normalizedUrl, qrSettings);
      setQrDataUrl(dataUrl);
      onNotify?.({ type: "success", message: "QR code generated successfully." });
    } catch (error) {
      onNotify?.({ type: "error", message: "Unable to generate QR code." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) {
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = qrDataUrl;
    anchor.download = "noturl-qr.png";
    anchor.click();
  };

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-6 transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800/50">
      <form className="grid gap-4 lg:grid-cols-[1fr_auto]" onSubmit={handleGenerate}>
        <div>
          <label
            htmlFor="dashboard-qr-url"
            className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            Short URL for QR
          </label>
          <input
            id="dashboard-qr-url"
            type="url"
            value={targetUrl}
            onChange={(event) => setTargetUrl(event.target.value)}
            placeholder="https://noturl.link/abc12345"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition duration-300 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
            required
          />

          {activeShortUrls.length > 0 ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Quick Select
              </p>
              {activeShortUrls.slice(0, 3).map((url) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setTargetUrl(url)}
                  className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                >
                  {url.replace(/^https?:\/\//, "")}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={isGenerating}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-700/25 transition duration-300 hover:scale-[1.01] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 lg:w-auto lg:min-w-[170px]"
          >
            {isGenerating ? (
              <>
                <FiRefreshCw className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FiImage />
                Generate QR
              </>
            )}
          </button>
        </div>
      </form>

      {qrDataUrl ? (
        <div className="mt-6 rounded-xl bg-white p-5 shadow-sm transition-colors duration-300 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">QR Preview</p>
          <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
              <img
                src={qrDataUrl}
                alt="URL shortener dashboard generated QR code"
                loading="lazy"
                className="h-44 w-44"
              />
            </div>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <FiDownload />
              Download PNG
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default QrGenerator;
