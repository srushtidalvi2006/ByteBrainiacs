"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TeamType = "solo" | "duo" | "trio";

const blankMember = () => ({
  name: "", phone: "", email: "", college: "", course: "", year: "", github: "", linkedin: "",
});

const MEMBER_COLORS = ["cyan", "violet", "pink"] as const;
const ACCENT: Record<string, string> = {
  cyan: "focus:border-cyan-400",
  violet: "focus:border-violet-400",
  pink: "focus:border-pink-400",
};

interface CreateTeamModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateTeamModal({ open, onClose, onCreated }: CreateTeamModalProps) {
  const [teamType, setTeamType] = useState<TeamType>("solo");
  const [teamName, setTeamName] = useState("");
  const [category, setCategory] = useState("");
  const [members, setMembers] = useState([blankMember(), blankMember(), blankMember()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const memberCount = teamType === "solo" ? 1 : teamType === "duo" ? 2 : 3;

  const updateMember = (index: number, field: string, value: string) => {
    setMembers((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  };

  const reset = () => {
    setTeamType("solo");
    setTeamName("");
    setCategory("");
    setMembers([blankMember(), blankMember(), blankMember()]);
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    setError("");

    if (!teamName.trim()) {
      setError("Team name is required.");
      return;
    }

    const activeMembers = members.slice(0, memberCount);
    for (let i = 0; i < activeMembers.length; i++) {
      const m = activeMembers[i];
      if (!m.name.trim() || !m.email.trim() || !m.college.trim() || !m.course.trim() || !m.year.trim()) {
        setError(`Member ${i + 1}: name, email, college, course, and year are required.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName,
          type: teamType,
          category: category || undefined,
          members: activeMembers,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || (data.details && data.details.join(" ")) || "Could not create team.");
        return;
      }

      onCreated();
      handleClose();
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl my-8 bg-slate-900/95 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Create Team</h2>
              <button onClick={handleClose} className="text-zinc-500 hover:text-white transition-colors text-2xl leading-none">×</button>
            </div>
            <p className="text-zinc-500 text-sm mb-6">
              Add a team directly — for solo or dual members who registered outside the normal flow. The team is created already <span className="text-emerald-400">approved</span>.
            </p>

            {/* TEAM TYPE */}
            <div className="mb-6">
              <label className="block mb-3 text-zinc-400 text-sm">Team Type</label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { value: "solo", title: "Solo", count: "1 Member" },
                  { value: "duo", title: "Duo", count: "2 Members" },
                  { value: "trio", title: "Trio", count: "3 Members" },
                ] as const).map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setTeamType(item.value)}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                      teamType === item.value
                        ? "border-cyan-400 bg-cyan-500/10"
                        : "border-white/10 bg-black/20 hover:border-white/20"
                    }`}
                  >
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-zinc-500 text-xs mt-1">{item.count}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* TEAM NAME + CATEGORY */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5 ml-1">Team Name</label>
                <input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Team Name"
                  className="w-full p-3.5 rounded-xl bg-black/30 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5 ml-1">Category</label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Machine Learning"
                  className="w-full p-3.5 rounded-xl bg-black/30 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* MEMBERS */}
            {Array.from({ length: memberCount }).map((_, i) => {
              const accent = ACCENT[MEMBER_COLORS[i]];
              return (
                <div key={i} className="mb-6 pb-6 border-b border-white/5 last:border-b-0 last:pb-0 last:mb-0">
                  <p className="text-sm font-semibold mb-3 text-zinc-300">Member {i + 1}</p>
                  <div className="grid md:grid-cols-2 gap-3 mb-3">
                    <input
                      value={members[i].name}
                      onChange={(e) => updateMember(i, "name", e.target.value)}
                      placeholder="Full Name"
                      className={`p-3.5 rounded-xl bg-black/30 border border-white/10 ${accent} focus:outline-none transition-colors`}
                    />
                    <input
                      value={members[i].email}
                      onChange={(e) => updateMember(i, "email", e.target.value)}
                      placeholder="Email Address"
                      className={`p-3.5 rounded-xl bg-black/30 border border-white/10 ${accent} focus:outline-none transition-colors`}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 mb-3">
                    <input
                      value={members[i].college}
                      onChange={(e) => updateMember(i, "college", e.target.value)}
                      placeholder="College Name"
                      className={`p-3.5 rounded-xl bg-black/30 border border-white/10 ${accent} focus:outline-none transition-colors`}
                    />
                    <input
                      value={members[i].phone}
                      maxLength={10}
                      onChange={(e) => updateMember(i, "phone", e.target.value.replace(/\D/g, ""))}
                      placeholder="Phone (optional)"
                      className={`p-3.5 rounded-xl bg-black/30 border border-white/10 ${accent} focus:outline-none transition-colors`}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <input
                      value={members[i].course}
                      onChange={(e) => updateMember(i, "course", e.target.value)}
                      placeholder="Course (e.g. BTech)"
                      className={`p-3.5 rounded-xl bg-black/30 border border-white/10 ${accent} focus:outline-none transition-colors`}
                    />
                    <input
                      value={members[i].year}
                      onChange={(e) => updateMember(i, "year", e.target.value)}
                      placeholder="Year (e.g. TY)"
                      className={`p-3.5 rounded-xl bg-black/30 border border-white/10 ${accent} focus:outline-none transition-colors`}
                    />
                  </div>
                </div>
              );
            })}

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 mt-2">
              <button
                onClick={handleClose}
                className="flex-1 py-3.5 rounded-xl border border-white/15 text-zinc-300 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 via-cyan-500 to-pink-500 text-black font-bold disabled:opacity-60"
              >
                {submitting ? "Creating..." : "Create Team"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
