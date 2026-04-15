import { Link } from "react-router-dom";
import Footer from "../components/Footer";

function InfoPageLayout({ eyebrow, title, description, children }) {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-100">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-[-12rem] top-[-10rem] h-96 w-96 rounded-full bg-blue-500/20 blur-[130px]" />
        <div className="pointer-events-none absolute right-[-10rem] top-24 h-96 w-96 rounded-full bg-cyan-400/10 blur-[150px]" />

        <div className="relative mx-auto max-w-5xl px-5 py-14 sm:px-8 lg:py-24">
          <Link
            to="/"
            className="text-sm font-semibold text-blue-300 underline decoration-blue-400/40 underline-offset-8 transition hover:text-white hover:decoration-blue-200"
          >
            Back to NotURL
          </Link>

          <p className="mt-12 text-xs font-semibold uppercase tracking-[0.32em] text-blue-300">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              {description}
            </p>
          ) : null}

          <div className="mt-12 max-w-4xl space-y-10 border-l border-slate-700/70 pl-5 text-base leading-8 text-slate-300 sm:pl-8">
            {children}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default InfoPageLayout;
