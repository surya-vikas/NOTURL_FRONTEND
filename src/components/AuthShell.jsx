function AuthShell({ title, subtitle, children, footer }) {
  return (
    <main className="relative min-h-[calc(100vh-var(--nav-height))] overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-teal-200/60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-160px] right-[-130px] h-80 w-80 rounded-full bg-sky-200/60 blur-3xl" />

      <section className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[1.05fr_1fr]">
        <aside className="hidden rounded-3xl border border-slate-700/60 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 p-8 text-slate-100 shadow-2xl shadow-slate-900/30 lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">NotURL</p>
          <h1 className="mt-3 font-['Space_Grotesk'] text-4xl font-bold leading-tight">
            Authentication
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
            Secure access flow with email/password, OTP-based signup, and Google sign-in.
          </p>

          <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-200">
              Trusted Access
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              Enterprise-ready sign-in experience with modern security defaults and a clean UX.
            </p>
          </div>
        </aside>

        <article className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-xl shadow-slate-200/70 backdrop-blur sm:p-8">
          <h2 className="font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          {subtitle ? <p className="mt-2 text-sm text-slate-600">{subtitle}</p> : null}
          <div className="mt-6">{children}</div>
          {footer ? <div className="mt-6 border-t border-slate-200 pt-4">{footer}</div> : null}
        </article>
      </section>
    </main>
  );
}

export default AuthShell;
