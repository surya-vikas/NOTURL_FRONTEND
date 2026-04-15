import { FiGithub, FiGlobe, FiLinkedin } from "react-icons/fi";

const footerColumns = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "API", href: "#docs" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "mailto:info.noturl@gmail.com" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Docs", href: "#docs" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
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
                    <a
                      href={link.href}
                      className="text-sm text-slate-400 transition duration-300 hover:text-blue-300"
                    >
                      {link.label}
                    </a>
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
                href="#"
                aria-label="NotURL on GitHub"
                className="rounded-lg bg-slate-900/80 p-2 text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:text-white"
              >
                <FiGithub />
              </a>
              <a
                href="#"
                aria-label="NotURL on LinkedIn"
                className="rounded-lg bg-slate-900/80 p-2 text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:text-white"
              >
                <FiLinkedin />
              </a>
              <a
                href="#"
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