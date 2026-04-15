import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiBarChart2,
  FiCheck,
  FiClipboard,
  FiLink2,
  FiSend,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Features from "../components/Features";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import ToastContainer from "../components/ToastContainer";
import useToasts from "../hooks/useToasts";
import { getApiErrorMessage } from "../services/api";
import { createShortUrl } from "../services/urlService";
import { copyToClipboard } from "../utils/clipboard";
import { isAuthenticated } from "../utils/token";

const trustStats = [
  { label: "Links Created", value: "10K+" },
  { label: "Clicks Tracked", value: "50K+" },
  { label: "Uptime", value: "99.9%" },
];

const workflowSteps = [
  {
    icon: FiLink2,
    title: "Paste URL",
    description: "Drop your long link in seconds.",
  },
  {
    icon: FiSend,
    title: "Generate Short Link",
    description: "Create a clean, share-ready URL.",
  },
  {
    icon: FiBarChart2,
    title: "Track Performance",
    description: "Monitor clicks and growth in real time.",
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

function Home() {
  const navigate = useNavigate();
  const [originalUrl, setOriginalUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState(null);
  const { toasts, addToast, removeToast } = useToasts();

  const handleCreateShortUrl = async (event) => {
    event.preventDefault();

    if (!isAuthenticated()) {
      addToast({ type: "error", message: "Please login to create short links." });
      navigate("/login", { replace: true });
      return;
    }

    const urlValue = originalUrl.trim();
    if (!urlValue) {
      addToast({ type: "error", message: "Please enter a URL first." });
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await createShortUrl(urlValue);
      setGeneratedUrl(data?.url || null);
      setOriginalUrl("");
      addToast({
        type: "success",
        message: data?.message || "Short URL created successfully.",
      });
    } catch (error) {
      addToast({
        type: "error",
        message: getApiErrorMessage(error, "Unable to create a short URL."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyShortUrl = async (value) => {
    const copied = await copyToClipboard(value);
    addToast({
      type: copied ? "success" : "error",
      message: copied ? "Copied to clipboard." : "Could not copy URL.",
    });
  };

  return (
    <main className="overflow-hidden bg-white text-[#0f172a]">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <Hero
        originalUrl={originalUrl}
        onOriginalUrlChange={setOriginalUrl}
        onSubmit={handleCreateShortUrl}
        isSubmitting={isSubmitting}
        shortUrl={generatedUrl?.shortUrl}
        onCopy={handleCopyShortUrl}
      />

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        variants={fadeIn}
        className="bg-white py-12"
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <p className="text-center text-sm font-semibold text-slate-500">
            Trusted by students, developers, and startups
          </p>

          <div className="mt-8 flex flex-wrap items-end justify-center gap-x-12 gap-y-6">
            {trustStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-extrabold tracking-tight text-[#0f172a]">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <Features />

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={fadeIn}
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Workflow
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">
              How It Works
            </h2>
          </div>

          <div className="relative mx-auto mt-12 max-w-5xl">
            <div className="absolute left-[16%] right-[16%] top-8 hidden h-px bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 md:block" />

            <div className="grid gap-8 md:grid-cols-3 md:gap-5">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div key={step.title} className="relative text-center">
                    <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-md shadow-blue-200/60">
                      <Icon className="text-xl" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{step.description}</p>

                    {index < workflowSteps.length - 1 && (
                      <motion.div
                        animate={{ x: [0, 6, 0] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -right-3 top-6 hidden text-blue-400 md:block"
                      >
                        <FiArrowRight className="text-xl" />
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={fadeIn}
        className="relative overflow-hidden bg-[#0f172a] py-24 text-white"
      >
        <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-16 bottom-6 h-72 w-72 rounded-full bg-indigo-500/20 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 sm:px-8 lg:grid-cols-2">
          <div className="relative">
            <div className="rounded-3xl bg-white/5 p-5 shadow-2xl shadow-black/35 backdrop-blur">
              <div className="rounded-2xl bg-slate-900/80 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-100">NotURL Dashboard</h3>
                  <span className="rounded-full bg-emerald-400/20 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                    Live
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-slate-800 p-3">
                    <p className="text-xs text-slate-400">Links</p>
                    <p className="text-lg font-bold text-white">2,431</p>
                  </div>
                  <div className="rounded-xl bg-slate-800 p-3">
                    <p className="text-xs text-slate-400">Clicks</p>
                    <p className="text-lg font-bold text-white">48,902</p>
                  </div>
                  <div className="rounded-xl bg-slate-800 p-3">
                    <p className="text-xs text-slate-400">CTR</p>
                    <p className="text-lg font-bold text-white">13.8%</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-white/5 p-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <span>Recent Links</span>
                  <span>Clicks</span>
                </div>
                <div className="mt-3 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">noturl.io/product-launch</span>
                    <span className="font-semibold text-white">2,430</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">noturl.io/spring-sale</span>
                    <span className="font-semibold text-white">1,286</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">noturl.io/api-docs</span>
                    <span className="font-semibold text-white">842</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 rounded-xl bg-blue-600 px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-blue-800/40">
              Real-time insights
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Dashboard
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Manage Everything in One Dashboard
            </h2>
            <p className="mt-4 max-w-lg text-slate-300">
              Centralize link creation, analytics, and campaign-level visibility in one fast,
              secure workflow.
            </p>
            <ul className="mt-8 space-y-4 text-slate-200">
              <li className="flex items-center gap-3">
                <FiCheck className="text-blue-300" />
                Track clicks
              </li>
              <li className="flex items-center gap-3">
                <FiCheck className="text-blue-300" />
                Manage links
              </li>
              <li className="flex items-center gap-3">
                <FiCheck className="text-blue-300" />
                View analytics
              </li>
              <li className="flex items-center gap-3">
                <FiCheck className="text-blue-300" />
                Secure access
              </li>
            </ul>
          </div>
        </div>
      </motion.section>

      <section id="pricing" className="scroll-mt-28 bg-[#f8fafc] py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Pricing</p>
          <h3 className="mt-3 text-2xl font-bold text-[#0f172a] sm:text-3xl">
            Start free, scale when you are ready
          </h3>
          <p className="mt-3 max-w-2xl text-slate-600">
            Launch with a generous free tier and move to higher volume plans as your traffic grows.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/90 p-6 shadow-sm shadow-slate-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-md">
              <p className="text-sm font-semibold text-slate-900">Starter</p>
              <p className="mt-2 text-sm text-slate-600">Ideal for students and solo makers.</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-b from-blue-50 to-white p-6 shadow-md shadow-blue-100/70 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <p className="text-sm font-semibold text-slate-900">Growth</p>
              <p className="mt-2 text-sm text-slate-600">Advanced analytics for growing teams.</p>
            </div>
            <div className="rounded-2xl bg-white/90 p-6 shadow-sm shadow-slate-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-md">
              <p className="text-sm font-semibold text-slate-900">Enterprise</p>
              <p className="mt-2 text-sm text-slate-600">Security and API scale for organizations.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="docs" className="scroll-mt-28 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Docs</p>
              <h3 className="mt-3 text-2xl font-bold text-[#0f172a] sm:text-3xl">
                Ship integrations faster with clear API docs
              </h3>
              <p className="mt-3 max-w-2xl text-slate-600">
                Find endpoint references, auth flow guides, and best practices to integrate NotURL
                across your stack.
              </p>
            </div>

            <div className="rounded-2xl bg-[#f8fafc] p-5 shadow-sm shadow-slate-200/70">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                  <FiClipboard className="text-lg" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Developer Quickstart</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Learn auth, shorten endpoints, and click analytics in under 10 minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeIn}
        className="relative overflow-hidden bg-[#020617] py-24"
      >
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-600/30 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6 text-center sm:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Start shortening smarter today
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300">
            Build branded links, optimize campaigns, and turn every click into measurable growth.
          </p>
          <motion.button
            type="button"
            onClick={() => navigate("/signup")}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/40 transition duration-300 max-sm:w-full max-sm:px-4"
          >
            Get Started Free
          </motion.button>
        </div>
      </motion.section>

      <Footer />
    </main>
  );
}

export default Home;