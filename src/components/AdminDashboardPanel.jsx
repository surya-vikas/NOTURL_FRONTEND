import { useEffect, useMemo, useState } from "react";
import {
  FiBarChart2,
  FiDownload,
  FiLink2,
  FiMail,
  FiPhone,
  FiSearch,
  FiShield,
  FiSlash,
  FiUsers,
} from "react-icons/fi";

function formatDate(value) {
  if (!value) {
    return "N/A";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "N/A";
  }

  return parsed.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function escapeCsvValue(value) {
  const normalized = value == null ? "" : String(value);
  return `"${normalized.replace(/"/g, '""')}"`;
}

function downloadCsv(filename, headers, records) {
  const csvContent = [
    headers.map(escapeCsvValue).join(","),
    ...records.map((record) => headers.map((header) => escapeCsvValue(record[header])).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(objectUrl);
}

function buildSearchValue(row) {
  return [
    row.name,
    row.email,
    row.phone,
    row.shortId,
    row.shortUrl,
    row.originalUrl,
    row.role,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className={`inline-flex rounded-2xl p-3 ${tone}`}>
        <Icon />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </article>
  );
}

function DetailCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
      <div className="flex items-center gap-3">
        <span className="inline-flex rounded-xl bg-white p-2 text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
          <Icon />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {value || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}

function AdminDashboardPanel({
  users,
  rows,
  isLoading,
  pendingUserIds,
  onUpdateSuspension,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [userView, setUserView] = useState("active");
  const normalizedQuery = searchTerm.trim().toLowerCase();

  const statusFilteredUsers = useMemo(() => {
    if (userView === "suspended") {
      return users.filter((user) => user.isSuspended);
    }

    return users.filter((user) => !user.isSuspended);
  }, [users, userView]);

  const filteredUsers = useMemo(() => {
    if (!normalizedQuery) {
      return statusFilteredUsers;
    }

    return statusFilteredUsers.filter((user) =>
      [user.name, user.email, user.phone, user.role]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [statusFilteredUsers, normalizedQuery]);

  const filteredRows = useMemo(() => {
    if (!normalizedQuery) {
      return rows;
    }

    return rows.filter((row) => buildSearchValue(row).includes(normalizedQuery));
  }, [rows, normalizedQuery]);

  useEffect(() => {
    if (!filteredUsers.length) {
      setSelectedUserId("");
      return;
    }

    const hasSelectedUser = filteredUsers.some((user) => user.id === selectedUserId);
    if (!hasSelectedUser) {
      setSelectedUserId(filteredUsers[0].id);
    }
  }, [filteredUsers, selectedUserId]);

  const rowsByUserId = useMemo(() => {
    return filteredRows.reduce((accumulator, row) => {
      if (!row.userId) {
        return accumulator;
      }

      if (!accumulator[row.userId]) {
        accumulator[row.userId] = [];
      }

      accumulator[row.userId].push(row);
      return accumulator;
    }, {});
  }, [filteredRows]);

  const selectedUser =
    filteredUsers.find((user) => user.id === selectedUserId) || filteredUsers[0] || null;
  const selectedUserRows = selectedUser ? rowsByUserId[selectedUser.id] || [] : [];

  const totalUsers = users.length;
  const totalLinks = rows.length;
  const totalClicks = rows.reduce((sum, row) => sum + Number(row.clicks || 0), 0);
  const adminUsers = users.filter((user) => user.role === "admin").length;
  const activeLinks = rows.filter((row) => row.isActive !== false).length;
  const totalActiveUsers = users.filter((user) => !user.isSuspended).length;
  const totalSuspendedUsers = users.filter((user) => user.isSuspended).length;

  const exportUsersCsv = () => {
    const records = filteredUsers.map((user) => ({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "user",
      linkCount: Number(user.linkCount || 0),
      createdAt: formatDate(user.createdAt),
    }));

    downloadCsv(
      "admin-users.csv",
      ["name", "email", "phone", "role", "linkCount", "createdAt"],
      records
    );
  };

  const exportLinksCsv = () => {
    const records = filteredRows.map((row) => ({
      name: row.name || "",
      email: row.email || "",
      phone: row.phone || "",
      role: row.role || "user",
      shortId: row.shortId || "",
      shortUrl: row.shortUrl || "",
      originalUrl: row.originalUrl || "",
      clicks: Number(row.clicks || 0),
      status: row.isActive !== false ? "Active" : "Inactive",
      createdAt: formatDate(row.createdAt),
    }));

    downloadCsv(
      "admin-links.csv",
      [
        "name",
        "email",
        "phone",
        "role",
        "shortId",
        "shortUrl",
        "originalUrl",
        "clicks",
        "status",
        "createdAt",
      ],
      records
    );
  };

  return (
    <section className="space-y-6">
      <article className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-xl shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
        <div className="relative overflow-hidden px-6 py-6 sm:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.10),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.12),_transparent_30%)]" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Admin Controls
              </div>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                Open a user, review their info, and export the records you need.
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                Search users, inspect contact details, and check all links belonging to the selected
                account.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
              <button
                type="button"
                onClick={exportUsersCsv}
                disabled={!filteredUsers.length}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              >
                <FiDownload />
                Export Users CSV
              </button>
              <button
                type="button"
                onClick={exportLinksCsv}
                disabled={!filteredRows.length}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiDownload />
                Export Links CSV
              </button>
            </div>
          </div>
        </div>
      </article>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          icon={FiUsers}
          label="Total users"
          value={totalUsers}
          tone="bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300"
        />
        <StatCard
          icon={FiLink2}
          label="Total links"
          value={totalLinks}
          tone="bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
        />
        <StatCard
          icon={FiBarChart2}
          label="Total clicks"
          value={totalClicks}
          tone="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
        />
        <StatCard
          icon={FiShield}
          label="Admin users"
          value={adminUsers}
          tone="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
        />
        <StatCard
          icon={FiLink2}
          label="Active links"
          value={activeLinks}
          tone="bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300"
        />
      </section>

      <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Search Records
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">
              Find a user and open their data
            </h2>
          </div>

          <label className="relative block w-full max-w-xl">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by user name, email, phone, short URL, original URL, or alias"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-amber-950/40"
            />
          </label>
        </div>
      </article>

      <section className="space-y-6">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
                User Directory
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                Registered users
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Open a user to view all their data and links.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              Showing {filteredUsers.length} of {statusFilteredUsers.length} users
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setUserView("active")}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  userView === "active"
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                }`}
              >
                Show all users ({totalActiveUsers})
              </button>
              <button
                type="button"
                onClick={() => setUserView("suspended")}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  userView === "suspended"
                    ? "bg-rose-600 text-white"
                    : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                }`}
              >
                Show suspended users ({totalSuspendedUsers})
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-10 text-center text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              Loading admin records...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              No users matched your search.
            </div>
          ) : (
            <div
              className={`mt-5 ${
                filteredUsers.length > 3
                  ? "flex gap-4 overflow-x-auto pb-2"
                  : "grid gap-4 md:grid-cols-2 xl:grid-cols-3"
              }`}
            >
              {filteredUsers.map((user) => {
                const isSelected = user.id === selectedUser?.id;

                return (
                  <div
                    key={user.id}
                    className={`rounded-2xl border p-4 transition ${
                      filteredUsers.length > 3 ? "min-w-[320px] flex-none" : ""
                    } ${
                      isSelected
                        ? "border-amber-300 bg-amber-50 shadow-sm dark:border-amber-700 dark:bg-amber-950/20"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950"
                    }`}
                  >
                    <div className="flex h-full flex-col gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                            {user.name || "N/A"}
                          </p>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              user.isSuspended
                                ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                                : user.role === "admin"
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                                  : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {user.isSuspended ? "suspended" : user.role || "user"}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-sm text-slate-600 dark:text-slate-400">
                          {user.email || "N/A"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          Phone: {user.phone || "N/A"} | Links: {Number(user.linkCount || 0)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedUserId(user.id)}
                        className={`mt-auto rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                          isSelected
                            ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                            : "border border-slate-300 bg-white text-slate-700 hover:-translate-y-0.5 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        }`}
                      >
                        View data
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-600">
                User Data
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                {selectedUser ? selectedUser.name || "Selected user" : "Select a user"}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Name, phone number, email, and all respective links appear here.
              </p>
            </div>
            {selectedUser ? (
              <div className="flex flex-wrap items-center gap-2">
                <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {selectedUserRows.length} links found
                </div>
                {selectedUser.role !== "admin" ? (
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateSuspension?.({
                        id: selectedUser.id,
                        isSuspended: !selectedUser.isSuspended,
                      })
                    }
                    disabled={pendingUserIds?.has(selectedUser.id)}
                    className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      selectedUser.isSuspended
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-rose-600 text-white hover:bg-rose-700"
                    }`}
                  >
                    <FiSlash />
                    {pendingUserIds?.has(selectedUser.id)
                      ? "Updating..."
                      : selectedUser.isSuspended
                        ? "Unsuspend account"
                        : "Suspend account"}
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>

          {isLoading ? (
            <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-10 text-center text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              Loading selected user data...
            </div>
          ) : !selectedUser ? (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              Choose a user from the left side to view their data.
            </div>
          ) : (
            <>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <DetailCard icon={FiUsers} label="Name" value={selectedUser.name} />
                <DetailCard icon={FiMail} label="Email" value={selectedUser.email} />
                <DetailCard icon={FiPhone} label="Phone" value={selectedUser.phone} />
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Account status
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {selectedUser.isSuspended ? "Suspended" : "Active"}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Suspended users cannot log in and will see a `User suspended` message.
                </p>
              </div>

              <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Respective links
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Every shortened link created by this user.
                    </p>
                  </div>
                </div>

                {selectedUserRows.length === 0 ? (
                  <div className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                    This user has not created any short links yet.
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <table className="min-w-full table-fixed text-left text-sm">
                      <colgroup>
                        <col className="w-[24%]" />
                        <col className="w-[40%]" />
                        <col className="w-[12%]" />
                        <col className="w-[12%]" />
                        <col className="w-[12%]" />
                      </colgroup>
                      <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        <tr>
                          <th className="px-4 py-3">Short URL</th>
                          <th className="px-4 py-3">Original URL</th>
                          <th className="px-4 py-3">Clicks</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedUserRows.map((row) => (
                          <tr
                            key={row.id}
                            className="border-t border-slate-100 text-slate-700 dark:border-slate-800 dark:text-slate-200"
                          >
                            <td className="px-4 py-3">
                              <a
                                href={row.shortUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="block truncate font-medium text-blue-700 underline underline-offset-4 dark:text-blue-300"
                                title={row.shortUrl}
                              >
                                {row.shortUrl}
                              </a>
                            </td>
                            <td className="px-4 py-3">
                              <a
                                href={row.originalUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="block max-w-sm truncate text-slate-700 underline underline-offset-4 dark:text-slate-200"
                                title={row.originalUrl}
                              >
                                {row.originalUrl}
                              </a>
                            </td>
                            <td className="px-4 py-3">{Number(row.clicks || 0)}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                  row.isActive !== false
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                    : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                                }`}
                              >
                                {row.isActive !== false ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-4 py-3">{formatDate(row.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </article>
      </section>
    </section>
  );
}

export default AdminDashboardPanel;
