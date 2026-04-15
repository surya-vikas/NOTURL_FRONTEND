import { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronDown, FiLink2, FiLogOut, FiUser } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

const getInitials = (name) => {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "U";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

function ProfileDropdown({ displayName, onLogout }) {
  const location = useLocation();
  const rootRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const initials = useMemo(() => getInitials(displayName), [displayName]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex items-center gap-2 rounded-xl bg-white/90 px-2 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-800 dark:text-slate-200"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-xs font-bold text-white">
          {initials}
        </span>
        <span className="hidden max-w-[132px] truncate text-left text-xs text-slate-600 dark:text-slate-400 sm:block">
          {displayName}
        </span>
        <FiChevronDown
          className={`text-slate-500 transition-transform duration-200 dark:text-slate-400 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl bg-white p-2 shadow-lg shadow-slate-200 transition-all duration-200 dark:bg-slate-800 dark:shadow-black/30 ${
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        }`}
        role="menu"
      >
        <Link
          to="/profile"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-slate-700"
          role="menuitem"
        >
          <FiUser className="text-slate-500 dark:text-slate-400" />
          Profile
        </Link>
        <Link
          to="/dashboard#recent-links"
          className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-slate-700"
          role="menuitem"
        >
          <FiLink2 className="text-slate-500 dark:text-slate-400" />
          My Links
        </Link>
        <button
          type="button"
          className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-slate-700"
          onClick={onLogout}
          role="menuitem"
        >
          <FiLogOut className="text-slate-500 dark:text-slate-400" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default ProfileDropdown;
