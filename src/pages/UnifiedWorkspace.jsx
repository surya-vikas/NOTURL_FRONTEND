import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiArrowUpRight,
  FiCheckCircle,
  FiLock,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";
import AdminDashboardPanel from "../components/AdminDashboardPanel";
import AnalyticsSection from "../components/AnalyticsSection";
import AliasConflictModal from "../components/AliasConflictModal";
import DashboardStats from "../components/DashboardStats";
import EditLinkModal from "../components/EditLinkModal";
import Footer from "../components/Footer";
import LoginPromptModal from "../components/LoginPromptModal";
import ProfileEditModal from "../components/ProfileEditModal";
import QrCodeModal from "../components/QrCodeModal";
import SettingsPanel from "../components/SettingsPanel";
import ToastContainer from "../components/ToastContainer";
import UnifiedLinksTable from "../components/UnifiedLinksTable";
import UnifiedNavbar from "../components/UnifiedNavbar";
import { useAuth } from "../context/AuthContext";
import useToasts from "../hooks/useToasts";
import { getApiErrorMessage } from "../services/api";
import { getAdminUsersLinks, updateAdminUserSuspension } from "../services/adminService";
import { createShortUrl, deleteUserUrl, getUserUrls, updateUserUrl } from "../services/urlService";
import { copyToClipboard } from "../utils/clipboard";

const landingHighlights = [
  {
    icon: FiZap,
    title: "Beautiful branded links",
    description: "Create clean short URLs for campaigns, creators, and teams.",
  },
  {
    icon: FiTrendingUp,
    title: "Real-time performance",
    description: "Track click growth and understand what drives engagement.",
  },
  {
    icon: FiLock,
    title: "Secure by design",
    description: "Manage your links with protected access and account controls.",
  },
];

const heroVariant = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};
const aliasPattern = /^[A-Za-z0-9_-]{3,32}$/;

function UnifiedWorkspace() {
  const { user, isAuthenticated, login, logout, updateUser } = useAuth();
  const { toasts, addToast, removeToast } = useToasts();

  const [theme, setTheme] = useState("light");
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState(null);
  const [urlHistory, setUrlHistory] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminRows, setAdminRows] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [pendingAdminUserIds, setPendingAdminUserIds] = useState(new Set());
  const [isShortening, setIsShortening] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState(new Set());
  const [pendingEditIds, setPendingEditIds] = useState(new Set());
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState("login");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [aliasConflictModalOpen, setAliasConflictModalOpen] = useState(false);
  const [conflictedAlias, setConflictedAlias] = useState("");
  const [selectedLinkForEdit, setSelectedLinkForEdit] = useState(null);
  const [selectedLinkForQr, setSelectedLinkForQr] = useState(null);
  const aliasInputRef = useRef(null);
  const isAdmin = isAuthenticated && user?.role === "admin";

  const applyTheme = (nextTheme) => {
    const normalizedTheme = nextTheme === "dark" ? "dark" : "light";
    setTheme(normalizedTheme);
    localStorage.setItem("theme", normalizedTheme);
    document.documentElement.classList.toggle("dark", normalizedTheme === "dark");
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    applyTheme(savedTheme === "dark" ? "dark" : "light");
  }, []);

  useEffect(() => {
    if (!isAuthenticated || isAdmin) {
      setUrlHistory([]);
      setGeneratedUrl(null);
      setIsHistoryLoading(false);
      return;
    }

    let active = true;

    const loadUrls = async () => {
      setIsHistoryLoading(true);
      try {
        const data = await getUserUrls();
        if (!active) {
          return;
        }
        const urls = Array.isArray(data?.urls) ? data.urls : [];
        setUrlHistory(urls);
      } catch (error) {
        if (!active) {
          return;
        }
        addToast({
          type: "error",
          message: getApiErrorMessage(error, "Failed to fetch your links."),
        });
      } finally {
        if (active) {
          setIsHistoryLoading(false);
        }
      }
    };

    loadUrls();
    return () => {
      active = false;
    };
  }, [isAuthenticated, isAdmin, addToast]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      setAdminUsers([]);
      setAdminRows([]);
      setIsAdminLoading(false);
      return;
    }

    let active = true;

    const loadAdminData = async () => {
      setIsAdminLoading(true);
      try {
        const data = await getAdminUsersLinks();
        if (!active) {
          return;
        }

        setAdminUsers(Array.isArray(data?.users) ? data.users : []);
        setAdminRows(Array.isArray(data?.rows) ? data.rows : []);
      } catch (error) {
        if (!active) {
          return;
        }

        addToast({
          type: "error",
          message: getApiErrorMessage(error, "Failed to fetch admin records."),
        });
      } finally {
        if (active) {
          setIsAdminLoading(false);
        }
      }
    };

    loadAdminData();
    return () => {
      active = false;
    };
  }, [isAuthenticated, isAdmin, addToast]);

  const totalLinks = urlHistory.length;
  const totalClicks = useMemo(
    () => urlHistory.reduce((sum, item) => sum + Number(item.clicks || 0), 0),
    [urlHistory]
  );
  const activeLinks = useMemo(
    () => urlHistory.filter((item) => item.isActive !== false).length,
    [urlHistory]
  );
  const ctr = totalLinks > 0 ? `${((totalClicks / totalLinks) * 100).toFixed(1)}%` : "0.0%";

  const promptLoginForShortening = () => {
    setLoginModalMode("login");
    setLoginModalOpen(true);
    addToast({
      type: "error",
      message: "Login to save and track your links.",
    });
  };

  const handleShortenSuccess = (data) => {
    const createdUrl = data?.url;
    if (!createdUrl) {
      throw new Error("URL data missing from API response.");
    }

    setGeneratedUrl(createdUrl);
    setUrlHistory((currentUrls) => [createdUrl, ...currentUrls]);
    setOriginalUrl("");
    setCustomAlias("");
    setAliasConflictModalOpen(false);
    setConflictedAlias("");
    addToast({
      type: "success",
      message: data?.message || "Short URL created successfully.",
    });
  };

  const handleReenterAlias = () => {
    setAliasConflictModalOpen(false);
    setTimeout(() => {
      aliasInputRef.current?.focus();
    }, 0);
  };

  const handleGenerateRandomShortUrl = async () => {
    if (!isAuthenticated) {
      setAliasConflictModalOpen(false);
      promptLoginForShortening();
      return;
    }

    const normalizedUrl = originalUrl.trim();
    if (!normalizedUrl) {
      setAliasConflictModalOpen(false);
      addToast({ type: "error", message: "Please enter a URL first." });
      return;
    }

    setIsShortening(true);
    try {
      const data = await createShortUrl({ originalUrl: normalizedUrl });
      handleShortenSuccess(data);
    } catch (error) {
      addToast({
        type: "error",
        message: getApiErrorMessage(error, "Unable to generate random short URL."),
      });
    } finally {
      setIsShortening(false);
    }
  };

  const handleShorten = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      promptLoginForShortening();
      return;
    }

    const normalizedUrl = originalUrl.trim();
    if (!normalizedUrl) {
      addToast({ type: "error", message: "Please enter a URL first." });
      return;
    }
    const normalizedAlias = customAlias.trim();
    if (normalizedAlias && !aliasPattern.test(normalizedAlias)) {
      addToast({
        type: "error",
        message: 'Alias must be 3-32 characters using letters, numbers, "-" or "_".',
      });
      return;
    }

    setIsShortening(true);

    try {
      const data = await createShortUrl({
        originalUrl: normalizedUrl,
        customAlias: normalizedAlias || undefined,
      });
      handleShortenSuccess(data);
    } catch (error) {
      if (error?.response?.status === 409 && normalizedAlias) {
        setConflictedAlias(normalizedAlias);
        setAliasConflictModalOpen(true);
        return;
      }

      addToast({
        type: "error",
        message: getApiErrorMessage(error, "Unable to create short URL."),
      });
    } finally {
      setIsShortening(false);
    }
  };

  const handleAuthSuccess = (data) => {
    login(data?.token, data?.user);
    setLoginModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    addToast({ type: "success", message: "You have been logged out." });
  };

  const handleCopy = async (value) => {
    const copied = await copyToClipboard(value);
    addToast({
      type: copied ? "success" : "error",
      message: copied ? "Copied to clipboard." : "Could not copy link.",
    });
  };

  const handleDelete = async (id) => {
    const previousUrls = urlHistory;
    setUrlHistory((current) => current.filter((item) => item.id !== id));

    setPendingDeleteIds((current) => {
      const next = new Set(current);
      next.add(id);
      return next;
    });

    try {
      const data = await deleteUserUrl(id);
      addToast({
        type: "success",
        message: data?.message || "Link deleted successfully.",
      });
      if (generatedUrl?.id === id) {
        setGeneratedUrl(null);
      }
    } catch (error) {
      setUrlHistory(previousUrls);
      addToast({
        type: "error",
        message: getApiErrorMessage(error, "Unable to delete link."),
      });
    } finally {
      setPendingDeleteIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  };

  const handleSaveEditedLink = async (nextOriginalUrl) => {
    if (!selectedLinkForEdit?.id) {
      return;
    }

    const targetId = selectedLinkForEdit.id;
    setPendingEditIds((current) => {
      const next = new Set(current);
      next.add(targetId);
      return next;
    });

    try {
      const data = await updateUserUrl({
        id: targetId,
        originalUrl: nextOriginalUrl,
      });

      const updated = data?.url;
      if (!updated) {
        throw new Error("Updated URL data missing in response.");
      }

      setUrlHistory((currentUrls) =>
        currentUrls.map((item) => (item.id === targetId ? updated : item))
      );

      if (generatedUrl?.id === targetId) {
        setGeneratedUrl(updated);
      }

      addToast({
        type: "success",
        message: data?.message || "Link updated successfully.",
      });
      setSelectedLinkForEdit(null);
    } catch (error) {
      addToast({
        type: "error",
        message: getApiErrorMessage(error, "Unable to edit link."),
      });
    } finally {
      setPendingEditIds((current) => {
        const next = new Set(current);
        next.delete(targetId);
        return next;
      });
    }
  };

  const handleAdminSuspensionChange = async ({ id, isSuspended }) => {
    const confirmationMessage = isSuspended
      ? "Are you sure you want to suspend this account?"
      : "Are you sure you want to unsuspend this account?";

    const confirmed = window.confirm(confirmationMessage);
    if (!confirmed) {
      return;
    }

    setPendingAdminUserIds((current) => {
      const next = new Set(current);
      next.add(id);
      return next;
    });

    try {
      const data = await updateAdminUserSuspension({ id, isSuspended });

      setAdminUsers((currentUsers) =>
        currentUsers.map((item) =>
          item.id === id
            ? {
                ...item,
                isSuspended,
              }
            : item
        )
      );

      addToast({
        type: "success",
        message:
          data?.message ||
          (isSuspended ? "User suspended successfully." : "User unsuspended successfully."),
      });
    } catch (error) {
      addToast({
        type: "error",
        message: getApiErrorMessage(error, "Unable to update user status."),
      });
    } finally {
      setPendingAdminUserIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <UnifiedNavbar
        isAuthenticated={isAuthenticated}
        user={user}
        onOpenLogin={() => {
          setLoginModalMode("login");
          setLoginModalOpen(true);
        }}
        onOpenSignup={() => {
          setLoginModalMode("signup");
          setLoginModalOpen(true);
        }}
        onOpenProfile={() => setProfileModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onLogout={handleLogout}
      />

      {isAdmin ? (
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0b1324_0%,#172554_48%,#111827_100%)]">
          <div className="pointer-events-none absolute -left-20 top-8 h-72 w-72 rounded-full bg-cyan-400/15 blur-[120px]" />
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-amber-400/10 blur-[120px]" />
          <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 lg:px-8 lg:pb-14">
            <motion.div
              initial="hidden"
              animate="show"
              variants={heroVariant}
              className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)] lg:items-end"
            >
              <div className="max-w-4xl">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                  Admin Workspace
                </p>
                <h1 className="mt-3 font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  Full visibility into users, links, and contact records.
                </h1>
                <p className="mt-4 max-w-3xl text-base text-slate-300 sm:text-lg">
                  Review accounts, open user data instantly, and export reports without leaving the
                  admin board.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-3xl border border-white/10 bg-white/8 px-5 py-4 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                    Control
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">
                    Review users and jump straight into their full data.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/8 px-5 py-4 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                    Exports
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">
                    Download clean CSV reports for users or links anytime.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/8 px-5 py-4 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                    Overview
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">
                    Monitor link activity and user growth from one dashboard.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      ) : (
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
          <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-blue-300/35 blur-[120px]" />
          <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-indigo-300/25 blur-[120px]" />

          <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-14 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
            <motion.div
              initial="hidden"
              animate="show"
              variants={heroVariant}
              className="mx-auto max-w-4xl text-center"
            >
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-6xl">
                Shorten Links.
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Track Performance.
                </span>
                <br />
                Grow Faster.
              </h1>
              <p className="mx-auto mt-5 max-w-3xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
                Create branded short links, monitor analytics, and manage URLs from one powerful
                dashboard.
              </p>

              <form
                onSubmit={handleShorten}
                className="mx-auto mt-10 flex w-full max-w-3xl flex-col gap-3 sm:flex-row"
              >
                <label htmlFor="unified-hero-url" className="sr-only">
                  Enter long URL
                </label>
                <input
                  id="unified-hero-url"
                  type="url"
                  value={originalUrl}
                  onChange={(event) => setOriginalUrl(event.target.value)}
                  placeholder="Enter long URL"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-lg shadow-slate-200/60 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/30 dark:placeholder:text-slate-500"
                  required
                />
                <label htmlFor="unified-hero-alias" className="sr-only">
                  Custom alias (optional)
                </label>
                <input
                  id="unified-hero-alias"
                  type="text"
                  ref={aliasInputRef}
                  value={customAlias}
                  onChange={(event) => setCustomAlias(event.target.value)}
                  placeholder="Alias (optional)"
                  maxLength={32}
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-lg shadow-slate-200/60 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/30 dark:placeholder:text-slate-500 sm:max-w-[220px]"
                />
                <button
                  type={isAuthenticated ? "submit" : "button"}
                  onClick={isAuthenticated ? undefined : promptLoginForShortening}
                  disabled={isAuthenticated ? isShortening : false}
                  className="inline-flex h-14 min-w-[180px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-700/30 transition duration-300 hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isAuthenticated ? (isShortening ? "Shortening..." : "Shorten Now") : "Login to Shorten"}
                  <FiArrowUpRight className="text-base" />
                </button>
              </form>
              <p className="mx-auto mt-2 max-w-3xl text-xs text-slate-500 dark:text-slate-400">
                Optional alias supports letters, numbers, "-" and "_". If already taken, choose to re-enter alias or generate a random one.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Login required to shorten links
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Free & Secure
                </span>
              </div>

              {generatedUrl?.shortUrl ? (
                <div className="mx-auto mt-5 max-w-2xl rounded-2xl bg-emerald-50 px-4 py-3 shadow-md shadow-emerald-100 dark:bg-emerald-900/20 dark:shadow-none">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                    Short URL Ready
                  </p>
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
                      onClick={() => handleCopy(generatedUrl.shortUrl)}
                      className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-emerald-700 shadow-sm transition hover:shadow-md dark:bg-slate-900 dark:text-emerald-300"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {isAdmin ? (
            <motion.section
              key="admin-dashboard"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="mt-3 pb-4 sm:mt-4"
            >
              <AdminDashboardPanel
                users={adminUsers}
                rows={adminRows}
                isLoading={isAdminLoading}
                pendingUserIds={pendingAdminUserIds}
                onUpdateSuspension={handleAdminSuspensionChange}
              />
            </motion.section>
          ) : isAuthenticated ? (
            <motion.section
              key="dashboard"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              <DashboardStats
                totalLinks={totalLinks}
                totalClicks={totalClicks}
                activeLinks={activeLinks}
                ctr={ctr}
              />

              <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                      My Links
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                      Manage your URLs
                    </h3>
                  </div>
                  {isHistoryLoading ? (
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Loading links...
                    </span>
                  ) : null}
                </div>

                <div className="mt-5">
                  <UnifiedLinksTable
                    links={urlHistory}
                    pendingDeleteIds={pendingDeleteIds}
                    pendingEditIds={pendingEditIds}
                    onCopy={handleCopy}
                    onDelete={handleDelete}
                    onEdit={setSelectedLinkForEdit}
                    onOpenQr={setSelectedLinkForQr}
                  />
                </div>
              </section>

              <AnalyticsSection urlHistory={urlHistory} />
            </motion.section>
          ) : (
            <motion.section
              key="landing"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="mt-10"
            >
              <div className="grid gap-4 md:grid-cols-3">
                {landingHighlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article
                      key={item.title}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20"
                    >
                      <span className="inline-flex rounded-lg bg-blue-100 p-3 text-blue-600 dark:bg-slate-800 dark:text-blue-300">
                        <Icon />
                      </span>
                      <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        {item.description}
                      </p>
                    </article>
                  );
                })}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <Footer />

      <AliasConflictModal
        open={aliasConflictModalOpen}
        alias={conflictedAlias}
        isGeneratingRandom={isShortening}
        onReenterAlias={handleReenterAlias}
        onGenerateRandom={handleGenerateRandomShortUrl}
      />

      <LoginPromptModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        defaultMode={loginModalMode}
        onAuthSuccess={handleAuthSuccess}
        addToast={addToast}
      />

      <ProfileEditModal
        open={profileModalOpen}
        user={user}
        onClose={() => setProfileModalOpen(false)}
        onProfileUpdated={updateUser}
        addToast={addToast}
      />

      <SettingsPanel
        open={settingsModalOpen}
        theme={theme}
        onThemeChange={applyTheme}
        onClose={() => setSettingsModalOpen(false)}
      />

      <EditLinkModal
        open={Boolean(selectedLinkForEdit)}
        linkItem={selectedLinkForEdit}
        onClose={() => setSelectedLinkForEdit(null)}
        onSave={handleSaveEditedLink}
        isSubmitting={
          selectedLinkForEdit ? pendingEditIds.has(selectedLinkForEdit.id) : false
        }
      />

      <QrCodeModal
        open={Boolean(selectedLinkForQr)}
        linkItem={selectedLinkForQr}
        onClose={() => setSelectedLinkForQr(null)}
        addToast={addToast}
      />
    </main>
  );
}

export default UnifiedWorkspace;
