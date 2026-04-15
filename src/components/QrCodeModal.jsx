import { useEffect, useState } from "react";
import { FiDownload, FiImage, FiX } from "react-icons/fi";
import QRCode from "qrcode";

function QrCodeModal({ open, linkItem, onClose, addToast }) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!open || !linkItem?.shortUrl) {
      setQrDataUrl("");
      return;
    }

    const generateQr = async () => {
      setIsGenerating(true);
      try {
        const dataUrl = await QRCode.toDataURL(linkItem.shortUrl, {
          width: 360,
          margin: 1,
          color: {
            dark: "#0f172a",
            light: "#ffffff",
          },
        });
        setQrDataUrl(dataUrl);
      } catch (error) {
        addToast?.({ type: "error", message: "Unable to generate QR code." });
        setQrDataUrl("");
      } finally {
        setIsGenerating(false);
      }
    };

    generateQr();
  }, [open, linkItem, addToast]);

  if (!open || !linkItem) {
    return null;
  }

  const handleDownload = () => {
    if (!qrDataUrl) {
      return;
    }
    const anchor = document.createElement("a");
    anchor.href = qrDataUrl;
    anchor.download = `noturl-${linkItem.shortId || "link"}-qr.png`;
    anchor.click();
  };

  return (
    <div className="fixed inset-0 z-[72] flex items-center justify-center bg-slate-950/60 px-4">
      <article className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              QR Code
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {linkItem.shortUrl?.replace(/^https?:\/\//, "")}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            aria-label="Close QR modal"
          >
            <FiX />
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">
          {isGenerating ? (
            <div className="flex h-64 items-center justify-center text-sm font-medium text-slate-500 dark:text-slate-400">
              Generating QR...
            </div>
          ) : qrDataUrl ? (
            <div className="flex flex-col items-center">
              <img src={qrDataUrl} alt="QR code preview" className="h-64 w-64 rounded-lg bg-white p-2" />
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
              No QR generated.
            </div>
          )}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!qrDataUrl}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-blue-500 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {qrDataUrl ? <FiDownload /> : <FiImage />}
            Download PNG
          </button>
        </div>
      </article>
    </div>
  );
}

export default QrCodeModal;
