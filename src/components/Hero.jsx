import { motion } from "framer-motion";
import { FiActivity, FiArrowUpRight, FiBarChart2, FiCheckCircle, FiTrendingUp } from "react-icons/fi";

const riseIn = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const barValues = [78, 46, 62, 88, 58, 71, 95];

function Hero({
  originalUrl,
  onOriginalUrlChange,
  onSubmit,
  isSubmitting,
  shortUrl,
  onCopy,
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-white">
      <div className="pointer-events-none absolute -left-20 top-8 h-72 w-72 rounded-full bg-blue-300/40 blur-[110px]" />
      <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-indigo-300/35 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-6 pb-16 pt-14 sm:px-8 lg:pb-24 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <motion.div variants={riseIn} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }}>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-blue-700 shadow-md shadow-blue-100/70">
              <span role="img" aria-label="Rocket">
                {"\u{1F680}"}
              </span>
              Smart URL Platform
            </div>

            <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-[1.04] tracking-tight text-[#0f172a] sm:text-5xl lg:text-6xl">
              Shorten Links.
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Track Performance.
              </span>
              <br />
              Grow Faster.
            </h1>

            <p className="mt-5 max-w-2xl text-base text-slate-600 sm:text-lg">
              Create branded short links, monitor analytics, and manage your URLs from one
              powerful dashboard.
            </p>

            <form onSubmit={onSubmit} className="mt-10 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
              <label htmlFor="hero-url-input" className="sr-only">
                Enter long URL
              </label>
              <input
                id="hero-url-input"
                type="url"
                value={originalUrl}
                onChange={(event) => onOriginalUrlChange(event.target.value)}
                required
                placeholder="Enter long URL"
                className="h-14 w-full rounded-2xl border border-slate-200/70 bg-white px-4 text-sm text-slate-800 shadow-lg shadow-slate-200/60 outline-none transition duration-300 placeholder:text-slate-400 focus:border-blue-300 focus:shadow-blue-200/60 focus:ring-4 focus:ring-blue-100"
              />
              <motion.button
                type="submit"
                whileHover={{ y: -1, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className="inline-flex h-14 min-w-[180px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-700/30 transition duration-300 hover:shadow-xl hover:shadow-blue-700/40 disabled:cursor-not-allowed disabled:opacity-70 max-sm:w-full"
              >
                {isSubmitting ? "Shortening..." : "Shorten Now"}
                <FiArrowUpRight className="text-base" />
              </motion.button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-600">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                No signup required
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Free & secure
              </span>
            </div>

            {shortUrl && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 max-w-xl rounded-2xl bg-emerald-50 px-4 py-3 shadow-md shadow-emerald-100/70"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Short URL Ready
                </p>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-sm font-semibold text-emerald-700 underline decoration-emerald-400 decoration-2 underline-offset-4"
                  >
                    {shortUrl}
                  </a>
                  <button
                    type="button"
                    onClick={() => onCopy(shortUrl)}
                    className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-emerald-700 shadow-sm transition duration-300 hover:shadow-md"
                  >
                    Copy Link
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            variants={riseIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="relative mx-auto h-[410px] w-full max-w-[560px]"
          >
            <div className="pointer-events-none absolute left-10 top-20 h-52 w-52 rounded-full bg-blue-500/20 blur-[110px]" />
            <div className="pointer-events-none absolute right-8 top-8 h-44 w-44 rounded-full bg-indigo-500/20 blur-[110px]" />

            <motion.div
              initial={{ opacity: 0, y: 24, rotate: -3 }}
              whileInView={{ opacity: 1, y: 0, rotate: -2 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="absolute inset-x-2 top-10 rounded-3xl bg-white/55 p-5 shadow-2xl shadow-slate-300/50 backdrop-blur-xl"
            >
              <div className="rounded-2xl bg-[#0f172a] p-5 text-slate-100 shadow-xl shadow-[#0f172a]/40">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Live Analytics</p>
                  <span className="rounded-full bg-emerald-400/20 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                    +24%
                  </span>
                </div>
                <p className="mt-2 text-3xl font-bold">12,849 clicks</p>

                <div className="mt-5 grid h-28 grid-cols-7 items-end gap-2">
                  {barValues.map((value, index) => (
                    <span
                      key={`${value}-${index}`}
                      className="rounded-full bg-blue-400/80"
                      style={{ height: `${value}%` }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20, y: 12 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.55 }}
              className="absolute right-2 top-0 w-56 rounded-2xl bg-white/80 p-4 shadow-xl backdrop-blur"
            >
              <div className="flex items-center gap-2 text-blue-600">
                <FiActivity />
                <p className="text-xs font-semibold uppercase tracking-wide">Active Campaign</p>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-900">Spring Product Launch</p>
              <p className="mt-1 text-xs text-slate-500">+18.3% CTR from last week</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20, y: 14 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.22, duration: 0.55 }}
              className="absolute bottom-0 left-0 w-60 rounded-2xl bg-white/85 p-4 shadow-xl backdrop-blur"
            >
              <div className="flex items-center gap-2 text-blue-600">
                <FiTrendingUp />
                <p className="text-xs font-semibold uppercase tracking-wide">Performance</p>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-900">Top link: noturl.io/devdocs</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <FiCheckCircle className="text-emerald-500" />
                Uptime stable at 99.9%
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 18, y: 16 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.28, duration: 0.55 }}
              className="absolute bottom-7 right-6 rounded-xl bg-blue-600/95 px-4 py-3 text-white shadow-lg shadow-blue-700/45"
            >
              <div className="flex items-center gap-2 text-sm font-semibold">
                <FiBarChart2 />
                Real-time trend tracking
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
