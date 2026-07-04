"use client";

import { motion } from "framer-motion";

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  college: string;
  course: string;
  year: string;
  github: string | null;
  linkedin: string | null;
  member_order: number;
}

export interface Team {
  id: string;
  name: string;
  type: "solo" | "duo" | "trio";
  category: string | null;
  experience: string | null;
  status: "pending" | "approved" | "rejected";
  source: "registration" | "admin_created";
  review_note: string | null;
  created_at: string;
  members: Member[];
}

const TYPE_BADGE: Record<Team["type"], string> = {
  solo: "bg-cyan-500/20 border-cyan-400/40 text-cyan-400",
  duo: "bg-violet-500/20 border-violet-400/40 text-violet-400",
  trio: "bg-pink-500/20 border-pink-400/40 text-pink-400",
};

const STATUS_BADGE: Record<Team["status"], string> = {
  pending: "bg-amber-500/20 border-amber-400/40 text-amber-400",
  approved: "bg-emerald-500/20 border-emerald-400/40 text-emerald-400",
  rejected: "bg-red-500/20 border-red-400/40 text-red-400",
};

interface TeamCardProps {
  team: Team;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onReset: (id: string) => void;
  onDelete: (id: string) => void;
  busy?: boolean;
}

export default function TeamCard({ team, onApprove, onReject, onReset, onDelete, busy }: TeamCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="bg-slate-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xl font-bold">{team.name}</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wide ${TYPE_BADGE[team.type]}`}>
              {team.type}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wide ${STATUS_BADGE[team.status]}`}>
              {team.status}
            </span>
            {team.source === "admin_created" && (
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/15 text-zinc-400 uppercase tracking-wide">
                Admin Added
              </span>
            )}
          </div>
          {team.category && <p className="text-zinc-500 text-sm mt-1.5">{team.category}</p>}
        </div>

        <div className="flex gap-2 shrink-0">
          {team.status !== "approved" && (
            <button
              disabled={busy}
              onClick={() => onApprove(team.id)}
              className="text-xs font-semibold px-3 py-2 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 hover:bg-emerald-500/25 transition-colors disabled:opacity-50"
            >
              Approve
            </button>
          )}
          {team.status !== "rejected" && (
            <button
              disabled={busy}
              onClick={() => onReject(team.id)}
              className="text-xs font-semibold px-3 py-2 rounded-lg bg-red-500/15 border border-red-400/30 text-red-400 hover:bg-red-500/25 transition-colors disabled:opacity-50"
            >
              Reject
            </button>
          )}
          {team.status !== "pending" && (
            <button
              disabled={busy}
              onClick={() => onReset(team.id)}
              className="text-xs font-semibold px-3 py-2 rounded-lg bg-white/5 border border-white/15 text-zinc-300 hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Reset
            </button>
          )}
          <button
            disabled={busy}
            onClick={() => onDelete(team.id)}
            className="text-xs font-semibold px-3 py-2 rounded-lg bg-white/5 border border-white/15 text-zinc-500 hover:text-red-400 hover:border-red-400/30 transition-colors disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {team.members.map((member) => (
          <div key={member.id} className="bg-black/20 border border-white/5 rounded-xl p-4">
            <p className="font-semibold text-sm">{member.name}</p>
            <p className="text-zinc-500 text-xs mt-1 truncate">{member.email}</p>
            <p className="text-zinc-500 text-xs mt-1">{member.college} · {member.course} · {member.year}</p>
            {member.phone && <p className="text-zinc-500 text-xs mt-1">+91 {member.phone}</p>}
            <div className="flex gap-3 mt-2">
              {member.github && (
                <a href={`https://${member.github.replace(/^https?:\/\//, "")}`} target="_blank" rel="noreferrer"
                  className="text-cyan-400 text-xs hover:underline">GitHub</a>
              )}
              {member.linkedin && (
                <a href={`https://${member.linkedin.replace(/^https?:\/\//, "")}`} target="_blank" rel="noreferrer"
                  className="text-violet-400 text-xs hover:underline">LinkedIn</a>
              )}
            </div>
          </div>
        ))}
      </div>

      {team.experience && (
        <p className="text-zinc-500 text-xs mt-4 line-clamp-3">{team.experience}</p>
      )}
      {team.review_note && (
        <p className="text-zinc-600 text-xs mt-3 italic">Note: {team.review_note}</p>
      )}
    </motion.div>
  );
}
