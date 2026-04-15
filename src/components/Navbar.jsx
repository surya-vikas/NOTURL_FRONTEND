import { useEffect, useState } from "react";
import { FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import { clearSession, getDisplayName, isAuthenticated } from "../utils/token";

const marketingLinks = [
  { label: "Features", hash: "#features" },
  { label: "Pricing", hash: "#pricing" },
  { label: "Docs", hash: "#docs" },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  const authenticated = isAuthenticated();
  const displayName = getDisplayName();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const initialTheme = savedTheme === "dark" ? "dark" : "light";
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  const marketingHref = (hash) => {
    return isHomePage ? hash : `/${hash}`;
  };

  const isGlassTop = isHomePage && !isScrolled && !mobileOpen;

  const toggleTheme = () => {
    setTheme((previousTheme) => {
      const nextTheme = previousTheme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", nextTheme);
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      return nextTheme;
    });
  };

  if (isAuthPage) {
    return (
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900/85">
        <div className="mx-auto flex h-[78px] w-full max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
          <Link
            to="/"
            className="font-['Space_Grotesk'] text-[1.7rem] font-bold tracking-tight text-slate-900 transition-colors duration-300 dark:text-slate-100"
          >
            NotURL
          </Link>
          <Link
            to="/"
            className="rounded-xl px-4 py-2 text-sm font-semibold text-blue-600 transition duration-300 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-300 dark:hover:bg-slate-800 dark:hover:text-blue-200"
          >
            Back to Home
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isGlassTop
          ? "border-transparent bg-transparent dark:bg-transparent"
          : "border-slate-200/80 bg-white/85 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/85 dark:shadow-black/30"
      }`}
    >
      <div className="mx-auto flex h-[78px] w-full max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
        <Link
          to="/"
          className="font-['Space_Grotesk'] text-[1.7rem] font-bold tracking-tight text-slate-900 transition-colors duration-300 dark:text-slate-100"
        >
          NotURL
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          {authenticated ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-800 dark:text-slate-200"
                aria-label={
                  theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {theme === "dark" ? <FiSun /> : <FiMoon />}
              </button>
              <ProfileDropdown displayName={displayName} onLogout={handleLogout} />
            </div>
          ) : (
            <>
              {marketingLinks.map((item) => (
                <a
                  key={item.label}
                  href={marketingHref(item.hash)}
                  className="text-sm font-semibold text-slate-700 transition hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-300"
                >
                  {item.label}
                </a>
              ))}
              <NavLink
                to="/login"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-700/30 transition duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-blue-700/40"
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-700/30 transition duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-blue-700/40"
              >
                Register
              </NavLink>
            </>
          )}
        </div>

        {authenticated ? (
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-slate-700 shadow-sm transition duration-300 hover:shadow-md dark:bg-slate-800 dark:text-slate-200"
              aria-label={
                theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {theme === "dark" ? <FiSun /> : <FiMoon />}
            </button>
            <ProfileDropdown displayName={displayName} onLogout={handleLogout} />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300/80 bg-white/80 p-2 text-slate-700 backdrop-blur transition-colors duration-300 md:hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        )}
      </div>

      {!authenticated && mobileOpen && (
        <div className="border-t border-slate-200 bg-white/95 px-6 pb-5 pt-4 transition-colors duration-300 md:hidden dark:border-slate-700 dark:bg-slate-900/95">
          <div className="flex flex-col gap-2">
            {!authenticated &&
              marketingLinks.map((item) => (
                <a
                  key={item.label}
                  href={marketingHref(item.hash)}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-blue-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-300"
                >
                  {item.label}
                </a>
              ))}
            <NavLink
              to="/login"
              className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-md shadow-blue-700/25 transition duration-300 hover:scale-[1.02]"
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-md shadow-blue-700/25 transition duration-300 hover:scale-[1.02]"
            >
              Register
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
