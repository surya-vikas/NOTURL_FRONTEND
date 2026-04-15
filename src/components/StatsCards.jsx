import { FiActivity, FiBarChart2, FiLink2 } from "react-icons/fi";

const statsConfig = [
  {
    key: "totalLinks",
    label: "Total Links",
    icon: FiLink2,
  },
  {
    key: "totalClicks",
    label: "Total Clicks",
    icon: FiActivity,
  },
  {
    key: "ctr",
    label: "CTR %",
    icon: FiBarChart2,
  },
];

function StatsCards({ totalLinks, totalClicks, ctr }) {
  const values = {
    totalLinks: totalLinks.toLocaleString(),
    totalClicks: totalClicks.toLocaleString(),
    ctr,
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {statsConfig.map((stat) => {
        const Icon = stat.icon;
        return (
          <article
            key={stat.key}
            className="rounded-xl bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-slate-800 dark:shadow-black/20"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.label}</p>
              <span className="inline-flex rounded-full bg-blue-50 p-2 text-blue-600 dark:bg-slate-700 dark:text-blue-300">
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
  );
}

export default StatsCards;
