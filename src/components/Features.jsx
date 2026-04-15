import { motion } from "framer-motion";
import {
  FiActivity,
  FiCode,
  FiEdit3,
  FiGrid,
  FiShield,
  FiZap,
} from "react-icons/fi";

const featureItems = [
  {
    icon: FiZap,
    title: "Fast URL Shortening",
    description:
      "Create short links instantly with reliable redirect speed for every campaign.",
  },
  {
    icon: FiActivity,
    title: "Real-time Analytics",
    description:
      "Track clicks and engagement as they happen with actionable performance insights.",
  },
  {
    icon: FiShield,
    title: "Secure Authentication (JWT + Google)",
    description:
      "Protect accounts with robust auth flows and trusted login integrations.",
  },
  {
    icon: FiEdit3,
    title: "Custom Aliases",
    description:
      "Create memorable branded links that improve trust and click-through rates.",
  },
  {
    icon: FiGrid,
    title: "Dashboard Management",
    description:
      "Organize, search, and manage all URLs with a clean, scalable workspace.",
  },
  {
    icon: FiCode,
    title: "API Access (future-ready)",
    description:
      "Integrate link workflows into your products with automation-friendly endpoints.",
  },
];

const sectionVariant = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

function Features() {
  return (
    <section id="features" className="scroll-mt-28 bg-[#f8fafc] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <motion.div
          variants={sectionVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Capabilities
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">
            Powerful Features for Modern Teams
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Everything you need to shorten, monitor, and scale links with confidence.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featureItems.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                whileHover={{ y: -5 }}
                className="rounded-2xl bg-white/80 p-6 shadow-sm shadow-slate-200/70 transition duration-300 hover:bg-white hover:shadow-lg hover:shadow-slate-300/60"
              >
                <div className="inline-flex rounded-xl bg-blue-100/70 p-3 text-blue-600">
                  <Icon className="text-xl" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;
