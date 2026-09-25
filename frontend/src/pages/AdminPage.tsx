import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { CheckCircle2, Shield, UserRound } from "lucide-react";
import { Topbar } from "../components/Topbar";
import {
  getApiErrorMessage,
  getAuthenticatedUser,
} from "../services/authServices";
import {
  getAdminUsers,
  getBugReports,
  resolveBugReport,
  setUserBlocked,
} from "../services/adminServices";
import type { BugReport } from "../services/adminServices";
import type { User } from "../types/auth";

export function AdminPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<BugReport[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void Promise.all([getAuthenticatedUser(), getAdminUsers(), getBugReports()])
      .then(([user, loadedUsers, loadedReports]) => {
        setCurrentUser(user);
        setUsers(loadedUsers);
        setReports(loadedReports);
      })
      .catch((requestError) =>
        setError(
          getApiErrorMessage(
            requestError,
            "Unable to load administration data.",
          ),
        ),
      );
  }, []);

  if (currentUser && !currentUser.is_admin) return <Navigate to="/" replace />;

  async function toggleUser(user: User) {
    try {
      const updated = await setUserBlocked(user.id, !user.is_blocked);
      setUsers((items) =>
        items.map((item) => (item.id === user.id ? updated : item)),
      );
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, "Unable to update user access."),
      );
    }
  }

  async function resolve(report: BugReport) {
    try {
      await resolveBugReport(report.id);
      setReports((items) =>
        items.map((item) =>
          item.id === report.id
            ? { ...item, resolved_at: new Date().toISOString() }
            : item,
        ),
      );
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to resolve report."));
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#eefafa_0%,var(--plumarks-background)_52%,#f1f8f8_100%)] px-4 py-5 font-sans text-text sm:px-8 sm:py-8">
      <div className="mx-auto max-w-[1120px]">
        <Topbar />
        <section className="mb-8">
          <p className="mb-2 flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-primary">
            <Shield size={14} /> Administration
          </p>
          <h1 className="m-0 font-serif text-[clamp(2.5rem,5vw,4.4rem)] leading-[.95]">
            Admin console
          </h1>
        </section>
        {error && (
          <p className="mb-5 rounded-[12px] border border-danger/20 bg-danger/5 p-4 text-sm text-danger">
            {error}
          </p>
        )}
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-[20px] border border-border bg-surface p-5 sm:p-6">
            <h2 className="m-0 mb-4 font-serif text-2xl">Users</h2>
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 rounded-[12px] border border-border p-3"
                >
                  <UserRound size={18} className="text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="m-0 font-bold">
                      {user.firstname} {user.lastname}
                    </p>
                    <p className="m-0 truncate text-xs text-text-muted">
                      {user.email}
                      {user.is_admin ? " · Admin" : ""}
                    </p>
                  </div>
                  {!user.is_admin && (
                    <button
                      type="button"
                      onClick={() => void toggleUser(user)}
                      className={`rounded-[8px] px-3 py-2 text-xs font-bold ${user.is_blocked ? "bg-primary-light text-primary-dark" : "bg-[#feeceb] text-danger"}`}
                    >
                      {user.is_blocked ? "Unblock" : "Block"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-[20px] border border-border bg-surface p-5 sm:p-6">
            <h2 className="m-0 mb-4 font-serif text-2xl">Bug reports</h2>
            <div className="space-y-3">
              {reports.map((report) => (
                <article
                  key={report.id}
                  className="rounded-[12px] border border-border p-3"
                >
                  <div className="flex justify-between gap-3">
                    <p className="m-0 font-bold">{report.page}</p>
                    {report.resolved_at ? (
                      <span className="text-xs font-bold text-success">
                        Resolved
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void resolve(report)}
                        className="text-xs font-bold text-primary-dark"
                      >
                        Mark resolved
                      </button>
                    )}
                  </div>
                  <p className="m-2 ml-0 text-sm text-text-secondary">
                    {report.description}
                  </p>
                  <p className="m-0 text-xs text-text-muted">{report.email}</p>
                </article>
              ))}
              {reports.length === 0 && (
                <p className="text-sm text-text-muted">No bug reports yet.</p>
              )}
            </div>
          </section>
        </div>
        <p className="mt-6 flex items-center gap-2 text-sm text-success">
          <CheckCircle2 size={16} /> Admin actions are protected by server-side
          authorization.
        </p>
      </div>
    </main>
  );
}
