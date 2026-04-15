import { useMemo } from "react";
import { FiActivity, FiBarChart2, FiTrendingUp } from "react-icons/fi";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const formatDateLabel = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

function AnalyticsSection({ urlHistory }) {
  const chartData = useMemo(() => {
    const grouped = new Map();
    (urlHistory || []).forEach((item) => {
      const dateKey = new Date(item.createdAt).toISOString().slice(0, 10);
      const current = grouped.get(dateKey) || { clicks: 0, links: 0 };
      grouped.set(dateKey, {
        clicks: current.clicks + Number(item.clicks || 0),
        links: current.links + 1,
      });
    });

    return [...grouped.entries()]
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([dateKey, values]) => ({
        date: formatDateLabel(dateKey),
        clicks: values.clicks,
        links: values.links,
      }));
  }, [urlHistory]);

  const liveClicks = useMemo(
    () => (urlHistory || []).reduce((sum, item) => sum + Number(item.clicks || 0), 0),
    [urlHistory]
  );

  const topLink = useMemo(() => {
    if (!urlHistory?.length) {
      return null;
    }
    return [...urlHistory].sort((a, b) => Number(b.clicks || 0) - Number(a.clicks || 0))[0];
  }, [urlHistory]);

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
            Analytics
          </p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            Clicks Over Time
          </h3>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <article className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <FiActivity />
            Live Clicks
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {liveClicks.toLocaleString()}
          </p>
        </article>

        <article className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <FiTrendingUp />
            Top Performing Link
          </p>
          <p className="mt-2 line-clamp-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
            {topLink ? topLink.shortUrl : "No links yet"}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {topLink ? `${topLink.clicks} clicks` : "Create links to unlock insights"}
          </p>
        </article>

        <article className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <FiBarChart2 />
            Data Points
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {chartData.length}
          </p>
        </article>
      </div>

      <div className="mt-5 h-[280px] rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#cbd5e1" />
              <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            No analytics data yet.
          </div>
        )}
      </div>
    </section>
  );
}

export default AnalyticsSection;
