import { useEffect, useMemo, useState } from "react";
import { FiBarChart2, FiLink2, FiLoader, FiShield, FiZap } from "react-icons/fi";
import { RiQrCodeLine } from "react-icons/ri";
import Footer from "../components/Footer";
import LinksTable from "../components/LinksTable";
import QrGenerator from "../components/QrGenerator";
import StatsCards from "../components/StatsCards";
import ToastContainer from "../components/ToastContainer";
import useToasts from "../hooks/useToasts";
import { getApiErrorMessage } from "../services/api";
import {
  createShortUrl,
  deleteUserUrl,
  getUserUrls,
  toggleUserUrlStatus,
} from "../services/urlService";
import { copyToClipboard } from "../utils/clipboard";
import { getDisplayName } from "../utils/token";

const toolTabs = [
  { id: "shorten", label: "Link", icon: FiLink2 },
  { id: "qr", label: "Generate QR", icon: RiQrCodeLine },
];

const productFeatures = [
  {
    icon: FiZap,
    title: "Fast shortening",
    description: "Generate reliable short links instantly for any campaign.",
  },
  {
    icon: FiBarChart2,
    title: "Analytics",
    description: "Track clicks and monitor engagement trends in your workspace.",
  },
  {
    icon: FiShield,
    title: "Secure links",
    description: "Use account-protected tools with status controls per link.",
  },
  {
    icon: RiQrCodeLine,
    title: "QR generation",
    description: "Create and download QR PNG assets from your short links.",
  },
];

function Dashboard() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [domain, setDomain] = useState("noturl.link");
  const [customAlias, setCustomAlias] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState(null);
  const [urlHistory, setUrlHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState(new Set());
  const [pendingStatusIds, setPendingStatusIds] = useState(new Set());
  const [activeToolTab, setActiveToolTab] = useState("shorten");

  const { toasts, addToast, removeToast } = useToasts();
  const displayName = getDisplayName();

  useEffect(() => {
    const loadUserUrlHistory = async () => {
      setIsHistoryLoading(true);
      try {
        const data = await getUserUrls();
        setUrlHistory(Array.isArray(data?.urls) ? data.urls : []);
      } catch (error) {
        addToast({
          type: "error",
          message: getApiErrorMessage(error, "Failed to fetch URL history."),
        });
      } finally {
        setIsHistoryLoading(false);
      }
    };

    loadUserUrlHistory();
  }, [addToast]);

  const totalLinks = urlHistory.length;
  const totalClicks = useMemo(
    () => urlHistory.reduce((sum, urlItem) => sum + Number(urlItem.clicks || 0), 0),
    [urlHistory]
  );
  const ctr = totalLinks > 0 ? `${((totalClicks / totalLinks) * 100).toFixed(1)}%` : "0.0%";

  const handleCreateShortUrl = async (event) => {
    event.preventDefault();
    const urlValue = originalUrl.trim();

    if (!urlValue) {
      addToast({ type: "error", message: "Please enter a URL first." });
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await createShortUrl({
        originalUrl: urlValue,
        domain,
        customAlias: customAlias.trim() || undefined,
      });
      const createdUrl = data?.url;
      if (!createdUrl) {
        throw new Error("URL data missing from API response");
      }

      setGeneratedUrl(createdUrl);
      setUrlHistory((currentUrls) => [createdUrl, ...currentUrls]);
      setOriginalUrl("");
      setCustomAlias("");

      addToast({
        type: "success",
        message: data?.message || "Short URL created successfully.",
      });
    } catch (error) {
      addToast({
        type: "error",
        message: getApiErrorMessage(error, "Unable to create short URL."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUrl = async (id) => {
    const previousUrls = urlHistory;
    const nextUrls = previousUrls.filter((urlItem) => urlItem.id !== id);
    setUrlHistory(nextUrls);

    setPendingDeleteIds((currentIds) => {
      const updatedIds = new Set(currentIds);
      updatedIds.add(id);
      return updatedIds;
    });

    try {
      const data = await deleteUserUrl(id);
      addToast({
        type: "success",
        message: data?.message || "URL deleted successfully.",
      });

      if (generatedUrl?.id === id) {
        setGeneratedUrl(null);
      }
    } catch (error) {
      setUrlHistory(previousUrls);
      addToast({
        type: "error",
        message: getApiErrorMessage(error, "Unable to delete URL."),
      });
    } finally {
      setPendingDeleteIds((currentIds) => {
        const updatedIds = new Set(currentIds);
        updatedIds.delete(id);
        return updatedIds;
      });
    }
  };

  const handleCopyShortUrl = async (value) => {
    const copied = await copyToClipboard(value);
    addToast({
      type: copied ? "success" : "error",
      message: copied ? "Copied to clipboard." : "Could not copy URL.",
    });
  };

  const handleToggleUrlStatus = async (urlItem) => {
    const nextIsActive = !Boolean(urlItem.isActive);
    const previousUrls = urlHistory;

    setUrlHistory((currentUrls) =>
      currentUrls.map((item) =>
        item.id === urlItem.id
          ? {
              ...item,
              isActive: nextIsActive,
            }
          : item
      )
    );

    setPendingStatusIds((currentIds) => {
      const updatedIds = new Set(currentIds);
      updatedIds.add(urlItem.id);
      return updatedIds;
    });

    try {
      const data = await toggleUserUrlStatus({
        id: urlItem.id,
        isActive: nextIsActive,
      });

      if (generatedUrl?.id === urlItem.id && data?.url) {
        setGeneratedUrl(data.url);
      }

      addToast({
        type: "success",
        message:
          data?.message ||
          (nextIsActive ? "URL activated successfully." : "URL suspended successfully."),
      });
    } catch (error) {
      setUrlHistory(previousUrls);
      addToast({
        type: "error",
        message: getApiErrorMessage(error, "Unable to update URL status."),
      });
    } finally {
      setPendingStatusIds((currentIds) => {
        const updatedIds = new Set(currentIds);
        updatedIds.delete(urlItem.id);
        return updatedIds;
      });
    }
  };

  return (
    <main className="min-h-[calc(100vh-var(--nav-height))] bg-[#f8fafc] text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section
          id="profile"
          className="rounded-2xl bg-white p-6 shadow-sm transition-colors duration-300 dark:bg-slate-900 dark:shadow-black/30"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 transition-colors duration-300 dark:text-slate-100">
            Welcome back, {displayName}
          </h1>
          <p className="mt-2 text-sm text-slate-600 transition-colors duration-300 dark:text-slate-400">
            Manage your links, monitor engagement, and ship smarter campaigns.
          </p>

          <div className="mt-8">
            <StatsCards totalLinks={totalLinks} totalClicks={totalClicks} ctr={ctr} />
          </div>
        </section>

        <section className="mt-10 rounded-2xl bg-white p-6 shadow-sm transition-colors duration-300 dark:bg-slate-900 dark:shadow-black/30">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 transition-colors duration-300 dark:text-slate-100">
                URL Shortener Tool
              </h2>
              <p className="mt-1 text-sm text-slate-500 transition-colors duration-300 dark:text-slate-400">
                Create short links, generate QR codes, and control active status.
              </p>
            </div>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 transition-colors duration-300 dark:bg-slate-800">
              {toolTabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeToolTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveToolTab(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition duration-300 ${
                      active
                        ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    <Icon className="text-sm" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {activeToolTab === "shorten" ? (
            <form className="mt-6 grid gap-4 md:grid-cols-12" onSubmit={handleCreateShortUrl}>
              <div className="md:col-span-12">
                <label htmlFor="dashboard-long-url" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Long URL
                </label>
                <input
                  id="dashboard-long-url"
                  type="url"
                  value={originalUrl}
                  onChange={(event) => setOriginalUrl(event.target.value)}
                  placeholder="https://example.com/very-long-url"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition duration-300 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
                  required
                />
              </div>

              <div className="md:col-span-4">
                <label htmlFor="dashboard-domain" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Domain
                </label>
                <select
                  id="dashboard-domain"
                  value={domain}
                  onChange={(event) => setDomain(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition duration-300 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="noturl.link">noturl.link</option>
                  <option value="noturl.pro">noturl.pro</option>
                </select>
              </div>

              <div className="md:col-span-5">
                <label htmlFor="dashboard-alias" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Custom Alias (optional)
                </label>
                <input
                  id="dashboard-alias"
                  type="text"
                  value={customAlias}
                  onChange={(event) => setCustomAlias(event.target.value)}
                  placeholder="launch-campaign"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition duration-300 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-end md:col-span-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-700/25 transition duration-300 hover:scale-[1.01] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Shortening..." : "Shorten Link"}
                </button>
              </div>
            </form>
          ) : (
            <QrGenerator
              defaultShortUrl={generatedUrl?.shortUrl || ""}
              urlHistory={urlHistory}
              onNotify={addToast}
            />
          )}

          {generatedUrl ? (
            <div className="mt-6 rounded-xl bg-emerald-50 p-4 shadow-sm transition-colors duration-300 dark:bg-emerald-900/20">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Short URL Ready</p>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <a
                  href={generatedUrl.shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all text-sm font-semibold text-emerald-700 underline underline-offset-4 dark:text-emerald-300"
                >
                  {generatedUrl.shortUrl}
                </a>
                <button
                  type="button"
                  onClick={() => handleCopyShortUrl(generatedUrl.shortUrl)}
                  className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-emerald-700 shadow-sm transition duration-300 hover:shadow-md dark:bg-slate-800 dark:text-emerald-300"
                >
                  Copy Link
                </button>
              </div>
            </div>
          ) : null}
        </section>

        <section id="recent-links" className="mt-6 rounded-2xl bg-white p-6 shadow-sm transition-colors duration-300 dark:bg-slate-900 dark:shadow-black/30">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Recent Links
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Suspend or activate links anytime.
              </p>
            </div>
            {isHistoryLoading ? (
              <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                <FiLoader className="animate-spin" />
                Loading...
              </span>
            ) : null}
          </div>

          {isHistoryLoading ? (
            <div className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500 transition-colors duration-300 dark:bg-slate-800 dark:text-slate-400">
              Fetching your URLs...
            </div>
          ) : (
            <LinksTable
              urlHistory={urlHistory}
              pendingDeleteIds={pendingDeleteIds}
              pendingStatusIds={pendingStatusIds}
              onCopyShortUrl={handleCopyShortUrl}
              onDeleteUrl={handleDeleteUrl}
              onToggleStatus={handleToggleUrlStatus}
            />
          )}
        </section>

        <section className="mt-10 rounded-2xl bg-white p-6 shadow-sm transition-colors duration-300 dark:bg-slate-900 dark:shadow-black/30">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Product
          </p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            What is NotURL?
          </h3>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
            NotURL is a secure URL management platform built for creators, teams, and campaigns.
            Shorten links quickly, track engagement, and ship share-ready QR assets from one
            dashboard.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {productFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800"
                >
                  <span className="inline-flex rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-slate-700 dark:text-blue-300">
                    <Icon />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {feature.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}

export default Dashboard;
