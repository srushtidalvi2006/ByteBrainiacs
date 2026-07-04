"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import TeamCard, { Team } from "@/components/admin/TeamCard";
import CreateTeamModal from "@/components/admin/CreateTeamModal";

type FilterStatus = "all" | "pending" | "approved" | "rejected";

const TABS: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("pending");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const loadTeams = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/teams?status=all", { cache: "no-store" });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not load teams.");
        return;
      }
      setTeams(data.teams);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const counts = useMemo(() => {
    return {
      all: teams.length,
      pending: teams.filter((t) => t.status === "pending").length,
      approved: teams.filter((t) => t.status === "approved").length,
      rejected: teams.filter((t) => t.status === "rejected").length,
    };
  }, [teams]);

  const visibleTeams = useMemo(() => {
    if (filter === "all") return teams;
    return teams.filter((t) => t.status === filter);
  }, [teams, filter]);

  const updateStatus = async (id: string, status: Team["status"]) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/teams/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not update team.");
        return;
      }
      setTeams((prev) => prev.map((t) => (t.id === id ? data.team : t)));
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusyId(null);
    }
  };

  const deleteTeam = async (id: string) => {
    if (!confirm("Delete this team and all its members? This cannot be undone.")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/teams/${id}`, { method: "DELETE" });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not delete team.");
        return;
      }
      setTeams((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusyId(null);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <section className="relative px-6 py-28 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
          <div>
            <p className="uppercase tracking-[0.4em] text-violet-400 text-xs mb-3">Admin Dashboard</p>
            <h1 className="text-4xl md:text-5xl font-black">
              Manage <span className="text-cyan-400">Teams</span>
            </h1>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCreateOpen(true)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-500 via-cyan-500 to-pink-500 text-black font-bold text-sm"
            >
              + Create Team
            </motion.button>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="px-5 py-3 rounded-xl border border-white/15 text-zinc-300 hover:bg-white/5 transition-colors text-sm disabled:opacity-50"
            >
              {loggingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {TABS.map((tab) => (
            <div key={tab.value} className="bg-slate-900/40 border border-white/10 rounded-2xl p-5">
              <p className="text-zinc-500 text-xs uppercase tracking-wide">{tab.label}</p>
              <p className="text-3xl font-black mt-2">{counts[tab.value]}</p>
            </div>
          ))}
        </div>

        {/* FILTER TABS */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                filter === tab.value
                  ? "border-cyan-400 bg-cyan-500/10 text-cyan-400"
                  : "border-white/10 text-zinc-400 hover:border-white/20"
              }`}
            >
              {tab.label} ({counts[tab.value]})
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 px-5 py-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* TEAM LIST */}
        {loading ? (
          <p className="text-zinc-500 text-center py-20">Loading teams...</p>
        ) : visibleTeams.length === 0 ? (
          <p className="text-zinc-500 text-center py-20">No teams in this category yet.</p>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {visibleTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  busy={busyId === team.id}
                  onApprove={(id) => updateStatus(id, "approved")}
                  onReject={(id) => updateStatus(id, "rejected")}
                  onReset={(id) => updateStatus(id, "pending")}
                  onDelete={deleteTeam}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <CreateTeamModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={loadTeams} />
    </section>
  );
}
