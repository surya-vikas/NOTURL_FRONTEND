import { FiActivity, FiBarChart2, FiCheckCircle, FiLink2 } from "react-icons/fi";

const statItems = [
  { key: "totalLinks", label: "Total Links Created", icon: FiLink2 },
  { key: "totalClicks", label: "Total Clicks", icon: FiActivity },
  { key: "activeLinks", label: "Active Links", icon: FiCheckCircle },
  { key: "ctr", label: "Click Rate (CTR)", icon: FiBarChart2 },
];

function DashboardStats({ totalLinks, totalClicks, activeLinks, ctr }) {
  const values = {
    totalLinks: totalLinks.toLocaleString(),
    totalClicks: totalClicks.toLocaleString(),
    activeLinks: activeLinks.toLocaleString(),
    ctr,
  };

  return (
    <section className="mt-10">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statItems.map((stat) => {
          const Icon = stat.icon;
          return (
            <article
              key={stat.key}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
                <span className="inline-flex rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-slate-800 dark:text-blue-300">
                  <Icon className="text-sm" />
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {values[stat.key]}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default DashboardStats;
