"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Network, Trophy, Terminal, Cpu, GitBranch } from "lucide-react";
import { useState, useEffect } from "react";

function TypewriterText({ text, delay = 0 }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 35);
    return () => clearInterval(interval);
  }, [started, text]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-[2px] h-[1em] bg-cyan-400 ml-0.5 align-middle"
        />
      )}
    </span>
  );
}

const specRows = [
  { key: "EVENT",       value: "Byte Brainiacs Season 02" },
  { key: "TYPE",        value: "Machine Learning Hackathon" },
  { key: "FOUNDED",     value: "2025" },
  { key: "FORMAT",      value: "Solo / Duo / Trio" },
  { key: "STACK",       value: "Python · TensorFlow · PyTorch · Scikit-learn" },
  { key: "OBJECTIVE",   value: "Build · Train · Deploy · Compete" },
  { key: "STATUS",      value: "REGISTRATION OPEN" },
];

const pillars = [
  {
    icon: BrainCircuit,
    id: "01",
    label: "ML_CORE",
    title: "Machine Learning",
    desc: "Build intelligent solutions using modern AI and ML technologies. From regression to transformers.",
    color: "cyan",
    rgb: "34,211,238",
  },
  {
    icon: GitBranch,
    id: "02",
    label: "INNOVATION",
    title: "Innovation",
    desc: "Turn creative ideas into impactful real-world projects. Ship code that actually does something.",
    color: "violet",
    rgb: "167,139,250",
  },
  {
    icon: Trophy,
    id: "03",
    label: "COMPETE",
    title: "Competition",
    desc: "Compete, earn Byte Coins and climb the leaderboard. Only the sharpest models survive.",
    color: "pink",
    rgb: "236,72,153",
  },
];

export default function About() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">

      {/* scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* SECTION LABEL — terminal prompt style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 justify-center mb-12"
        >
          <span className="text-cyan-400 font-mono text-sm">~/byte-brainiacs</span>
          <span className="text-zinc-600 font-mono text-sm">$</span>
          <span className="font-mono text-sm text-zinc-300">cat about.md</span>
        </motion.div>

        {/* HEADING */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center text-5xl md:text-7xl font-black leading-[1.05] max-w-5xl mx-auto mb-6"
        >
          Where Ideas Become
          <br />
          <span className="text-cyan-400" style={{ textShadow: "0 0 30px rgba(34,211,238,0.3)" }}>
            Intelligent Solutions
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-zinc-400 text-lg text-center max-w-2xl mx-auto leading-relaxed mb-24"
        >
          A Machine Learning Hackathon that brings together curious minds,
          innovators and future AI builders to solve real-world challenges.
        </motion.p>

        {/* SPEC SHEET TABLE — the signature element */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto mb-28"
        >
          {/* table header */}
          <div className="flex items-center gap-3 mb-0 border border-white/10 rounded-t-2xl px-6 py-3 bg-white/[0.03]">
            <div className="w-3 h-3 rounded-full bg-pink-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-3 font-mono text-xs text-zinc-500 tracking-widest">system.config</span>
          </div>

          <div className="border-x border-b border-white/10 rounded-b-2xl overflow-hidden">
            {specRows.map((row, i) => (
              <motion.div
                key={row.key}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className={`flex items-start gap-0 border-b border-white/5 last:border-0 group hover:bg-white/[0.03] transition-colors`}
              >
                <div className="w-44 shrink-0 px-6 py-4 border-r border-white/5">
                  <span className="font-mono text-xs text-zinc-500 tracking-[0.15em] group-hover:text-cyan-400/70 transition-colors">
                    {row.key}
                  </span>
                </div>
                <div className="px-6 py-4 flex-1">
                  <span className={`font-mono text-sm ${row.key === "STATUS" ? "text-green-400" : "text-zinc-200"}`}>
                    {row.key === "STATUS" ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                          className="inline-block w-2 h-2 rounded-full bg-green-400"
                        />
                        {row.value}
                      </span>
                    ) : row.value}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* STORY + MISSION — two column, clean */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto mb-28"
        >
          <div className="grid lg:grid-cols-2 gap-0 border border-white/10 rounded-3xl overflow-hidden">

            {/* LEFT — Our Story */}
            <div className="p-10 border-r border-white/10">
              <div className="flex items-center gap-2 mb-8">
                <Terminal size={14} className="text-violet-400" />
                <span className="font-mono text-xs tracking-[0.3em] text-violet-400 uppercase">Our Story</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold leading-tight mb-8 text-white">
                From an Ambitious<br />Experiment to an<br />AI Battleground
              </h3>

              <p className="text-zinc-400 text-base leading-relaxed mb-5">
                Founded in <span className="text-white font-semibold">2025</span>, Byte Brainiacs began
                as a high-stakes arena designed to push the boundaries of Artificial Intelligence
                and Machine Learning.
              </p>

              <p className="text-zinc-400 text-base leading-relaxed">
                What started as an ambitious experiment quickly evolved into a vibrant hub of
                innovation — bringing together students, developers, data enthusiasts and future
                AI leaders to build, train and deploy real-world solutions from scratch.
              </p>
            </div>

            {/* RIGHT — The Mission */}
            <div className="p-10 bg-white/[0.015]">
              <div className="flex items-center gap-2 mb-8">
                <Cpu size={14} className="text-cyan-400" />
                <span className="font-mono text-xs tracking-[0.3em] text-cyan-400 uppercase">The Mission</span>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-cyan-400/40 to-transparent mb-8" />

              <p className="text-2xl md:text-3xl font-bold leading-snug text-white mb-8">
                Build the algorithms<br />that shape the future.
              </p>

              <p className="text-zinc-400 text-base leading-relaxed mb-8">
                Whether you're a seasoned ML engineer tuning neural networks or a curious
                programmer training your first model, Byte Brainiacs provides mentorship,
                resources and collaboration to transform ambitious ideas into intelligent solutions.
              </p>

              {/* terminal-style tagline */}
              <div className="border border-white/10 rounded-xl px-5 py-4 bg-black/30 font-mono text-sm">
                <span className="text-zinc-600">$ </span>
                <TypewriterText text="learn && build && train && deploy && compete" delay={600} />
              </div>
            </div>

          </div>
        </motion.div>

        {/* PILLAR CARDS */}
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative overflow-hidden bg-slate-900/40 border border-white/10 rounded-3xl p-8 backdrop-blur-xl"
              >
                {/* hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700"
                  style={{ background: `radial-gradient(ellipse at 30% 30%, rgba(${p.rgb},0.1), transparent 70%)` }}
                />

                {/* top-left id tag */}
                <div className="flex items-center justify-between mb-8">
                  <span className={`font-mono text-xs tracking-widest text-${p.color}-400/60`}>{p.label}</span>
                  <span className="font-mono text-xs text-zinc-700">{p.id}</span>
                </div>

                <Icon size={36} className={`text-${p.color}-400 mb-5 relative z-10`} />

                <h3 className="text-xl font-bold mb-3 relative z-10">{p.title}</h3>

                <p className="text-zinc-400 text-sm leading-relaxed relative z-10">{p.desc}</p>

                {/* bottom accent line */}
                <div
                  className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 bg-${p.color}-400`}
                />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
