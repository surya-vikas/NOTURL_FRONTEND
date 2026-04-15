import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiChevronDown,
  FiLogOut,
  FiSettings,
  FiUser,
} from "react-icons/fi";

const getInitials = (nameOrEmail) => {
  const source = String(nameOrEmail || "").trim();
  if (!source) {
    return "NU";
  }

  if (source.includes("@")) {
    return source.slice(0, 2).toUpperCase();
  }

  const words = source.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

function UnifiedNavbar({
  isAuthenticated,
  user,
  onOpenLogin,
  onOpenProfile,
  onOpenSettings,
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const displayName = user?.name || user?.email || "User";
  const isAdmin = user?.role === "admin";
  const initials = useMemo(() => getInitials(displayName), [displayName]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          NotURL
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {!isAuthenticated ? (
            <button
              type="button"
              onClick={onOpenLogin}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-700/25 transition duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              Login
            </button>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((current) => !current)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-xs font-bold text-white">
                  {initials}
                </span>
                <span className="hidden max-w-[140px] truncate text-left text-xs text-slate-500 dark:text-slate-400 sm:block">
                  {displayName}
                </span>
                {isAdmin ? (
                  <span className="hidden rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 sm:inline-flex">
                    Admin
                  </span>
                ) : null}
                <FiChevronDown
                  className={`transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {menuOpen ? (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-300/40 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30"
                  role="menu"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenProfile();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    role="menuitem"
                  >
                    <FiUser />
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenSettings();
                    }}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    role="menuitem"
                  >
                    <FiSettings />
                    Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout();
                    }}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    role="menuitem"
                  >
                    <FiLogOut />
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default UnifiedNavbar;
