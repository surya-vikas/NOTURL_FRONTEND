import { Link } from "react-router-dom";
import { FiGlobe, FiMail } from "react-icons/fi";

const footerColumns = [
  {
    heading: "Product",
    links: [
      { label: "Home", to: "/" },
      { label: "Help", to: "/help" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Help / FAQ", to: "/help" },
      { label: "Privacy Policy", to: "/privacy-policy" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy-policy" },
      { label: "Terms of Use", to: "/terms" },
    ],
  },
];

function Footer() {
  return (
    <footer className="bg-[#020617] text-slate-400">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.heading}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
                {column.heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-400 transition duration-300 hover:text-blue-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p>Email: info.noturl@gmail.com</p>
            <div className="flex items-center gap-3">
              <a
                href="mailto:info.noturl@gmail.com"
                aria-label="Email NotURL support"
                className="rounded-lg bg-slate-900/80 p-2 text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:text-white"
              >
                <FiMail />
              </a>
              <a
                href="https://noturl.in"
                aria-label="NotURL website"
                className="rounded-lg bg-slate-900/80 p-2 text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:text-white"
              >
                <FiGlobe />
              </a>
            </div>
          </div>
          <p className="mt-2 text-slate-500">{"\u00A9 2026 NotURL. All rights reserved."}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
