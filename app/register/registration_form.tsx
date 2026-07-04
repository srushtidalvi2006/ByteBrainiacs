"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EMAIL_DOMAINS = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "protonmail.com"];

const ACCENT_COLORS = {
  cyan:   { border: "focus:border-cyan-400",   borderErr: "border-red-500", badge: "bg-cyan-500/20 border-cyan-400/40 text-cyan-400",   domain: "text-cyan-400"   },
  violet: { border: "focus:border-violet-400", borderErr: "border-red-500", badge: "bg-violet-500/20 border-violet-400/40 text-violet-400", domain: "text-violet-400" },
  pink:   { border: "focus:border-pink-400",   borderErr: "border-red-500", badge: "bg-pink-500/20 border-pink-400/40 text-pink-400",   domain: "text-pink-400"   },
};

// Indian mobile: 10 digits, starts with 6–9, optionally prefixed +91 or 0
const INDIA_PHONE_RE = /^(?:\+91|91|0)?[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type TeamType = "solo" | "duo" | "trio";

interface MemberData {
  name: string;
  phone: string;
  email: string;
  college: string;
  course: string;
  year: string;
  github: string;
  linkedin: string;
}

type MemberErrors = Partial<Record<keyof MemberData, string>>;
type AccentColor = keyof typeof ACCENT_COLORS;

function FieldError({ msg }: { msg?: string }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
        >
          <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function RequiredDot() {
  return <span className="text-red-400 ml-0.5">*</span>;
}

function EmailInput({ placeholder, value, onChange, accentColor = "cyan", error }: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  accentColor?: AccentColor;
  error?: string | boolean;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const colors = ACCENT_COLORS[accentColor];

  const atIndex = value.indexOf("@");
  const localPart = atIndex === -1 ? value : value.slice(0, atIndex);
  const afterAt = atIndex !== -1 ? value.slice(atIndex + 1) : "";

  const suggestions = (() => {
    if (!value) return [];
    if (atIndex === -1) return EMAIL_DOMAINS.map((d) => `${value}@${d}`);
    return EMAIL_DOMAINS.filter((d) => d.startsWith(afterAt) && d !== afterAt).map((d) => `${localPart}@${d}`);
  })();

  const shouldShow = focused && showSuggestions && suggestions.length > 0;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => { onChange(e.target.value); setShowSuggestions(true); }}
        onFocus={() => { setFocused(true); setShowSuggestions(true); }}
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full p-4 rounded-xl bg-black/30 border ${error ? "border-red-500" : "border-white/10"} ${colors.border} focus:outline-none transition-colors duration-200`}
      />
      <AnimatePresence>
        {shouldShow && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 bg-slate-950/98 border border-white/10 rounded-xl backdrop-blur-xl shadow-2xl z-50 overflow-hidden"
          >
            {suggestions.map((suggestion, i) => {
              const [local, domain] = suggestion.split("@");
              return (
                <motion.button
                  key={suggestion}
                  type="button"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => { onChange(suggestion); setShowSuggestions(false); setFocused(false); }}
                  className="flex items-center gap-0.5 w-full text-left px-4 py-3 hover:bg-white/5 transition-colors duration-150 group"
                >
                  <span className="text-zinc-400 group-hover:text-white transition-colors">{local}</span>
                  <span className={`font-semibold transition-colors ${colors.domain}`}>@{domain}</span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CustomSelect({ placeholder, value, onChange, options, accentColor = "cyan", error }: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  accentColor?: AccentColor;
  error?: string | boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const colors = ACCENT_COLORS[accentColor];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o === value);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`w-full p-4 rounded-xl bg-black/30 border text-left flex items-center justify-between transition-colors duration-200
          ${error ? "border-red-500" : open ? colors.border.replace("focus:", "") + " outline-none" : "border-white/10"}
        `}
      >
        <span className={value ? "text-white" : "text-zinc-500"}>{selected || placeholder}</span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4 text-zinc-400 shrink-0"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 bg-slate-950/98 border border-white/10 rounded-xl backdrop-blur-xl shadow-2xl z-50 overflow-hidden"
          >
            {options.map((opt, i) => (
              <motion.button
                key={opt}
                type="button"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-3 transition-colors duration-150
                  ${value === opt
                    ? `${colors.domain} bg-white/5 font-medium`
                    : "text-zinc-300 hover:bg-white/5 hover:text-white"}
                `}
              >
                {opt}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Validate a single member's fields, returns object of field->error string
function validateMember(data: MemberData): MemberErrors {
  const errs: MemberErrors = {};
  if (!data.name.trim()) errs.name = "Full name is required.";
  if (!data.email.trim()) {
    errs.email = "Email address is required.";
  } else if (!EMAIL_RE.test(data.email)) {
    errs.email = "Enter a valid email address.";
  }
  if (!data.college.trim()) errs.college = "College name is required.";
  if (!data.course) errs.course = "Please select a course.";
  if (!data.year) errs.year = "Please select a year.";
  if (data.phone.trim()) {
    // phone is optional but validated if filled
    if (!INDIA_PHONE_RE.test(data.phone.replace(/\s/g, ""))) {
      errs.phone = "Enter a valid 10-digit Indian mobile number.";
    }
  }
  return errs;
}

function MemberSection({ number, accentColor, data, onChange, animKey, errors = {}, submitted }: {
  number: number;
  accentColor: AccentColor;
  data: MemberData;
  onChange: (field: keyof MemberData, value: string) => void;
  animKey: string;
  errors?: MemberErrors;
  submitted: boolean;
}) {
  const colors = ACCENT_COLORS[accentColor];

  const inputClass = (field: keyof MemberData) =>
    `p-4 rounded-xl bg-black/30 border ${submitted && errors[field] ? "border-red-500" : "border-white/10"} ${colors.border} focus:outline-none transition-colors w-full`;

  const memberVariants = {
    hidden: { opacity: 0, y: -12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit:   { opacity: 0, y: -8, transition: { duration: 0.25, ease: "easeIn" } },
  };

  return (
    <motion.div
      key={animKey}
      variants={memberVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* header */}
      <div className="flex items-center gap-4 mb-8 mt-2">
        <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${colors.badge}`}>
          {number}
        </div>
        <span className="text-xl font-semibold">Member {number}</span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      {/* Row 1: Name + Phone */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5 ml-1">Full Name<RequiredDot /></label>
          <input
            placeholder="Full Name"
            value={data.name}
            onChange={(e) => onChange("name", e.target.value)}
            className={inputClass("name")}
          />
          {submitted && <FieldError msg={errors.name} />}
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5 ml-1">Phone Number</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-mono select-none">+91</span>
            <input
              placeholder="9876543210"
              value={data.phone}
              maxLength={10}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                onChange("phone", val);
              }}
              className={`${inputClass("phone")} pl-12`}
            />
          </div>
          {submitted && <FieldError msg={errors.phone} />}
        </div>
      </div>

      {/* Row 2: Email + College */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5 ml-1">Email Address<RequiredDot /></label>
          <EmailInput
            placeholder="Email Address"
            value={data.email}
            onChange={(v) => onChange("email", v)}
            accentColor={accentColor}
            error={submitted && errors.email}
          />
          {submitted && <FieldError msg={errors.email} />}
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5 ml-1">College Name<RequiredDot /></label>
          <input
            placeholder="College Name"
            value={data.college}
            onChange={(e) => onChange("college", e.target.value)}
            className={inputClass("college")}
          />
          {submitted && <FieldError msg={errors.college} />}
        </div>
      </div>

      {/* Row 3: Course + Year */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5 ml-1">Course<RequiredDot /></label>
          <CustomSelect
            placeholder="Select Course"
            value={data.course}
            onChange={(v) => onChange("course", v)}
            options={["BSc IT", "BSc Computer Science", "BSc AI & DS", "BCA", "BTech", "Other"]}
            accentColor={accentColor}
            error={submitted && errors.course}
          />
          {submitted && <FieldError msg={errors.course} />}
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5 ml-1">Year<RequiredDot /></label>
          <CustomSelect
            placeholder="Select Year"
            value={data.year}
            onChange={(v) => onChange("year", v)}
            options={["FY", "SY", "TY", "Final Year"]}
            accentColor={accentColor}
            error={submitted && errors.year}
          />
          {submitted && <FieldError msg={errors.year} />}
        </div>
      </div>

      {/* Row 4: GitHub + LinkedIn */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5 ml-1">GitHub Profile</label>
          <input
            placeholder="github.com/username"
            value={data.github}
            onChange={(e) => onChange("github", e.target.value)}
            className={inputClass("github")}
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5 ml-1">LinkedIn Profile</label>
          <input
            placeholder="linkedin.com/in/username"
            value={data.linkedin}
            onChange={(e) => onChange("linkedin", e.target.value)}
            className={inputClass("linkedin")}
          />
        </div>
      </div>
    </motion.div>
  );
}

const blankMember = (): MemberData => ({ name: "", phone: "", email: "", college: "", course: "", year: "", github: "", linkedin: "" });

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" } }),
};

export default function RegistrationForm() {
  const [teamType, setTeamType] = useState<TeamType>("trio");
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<MemberData[]>([blankMember(), blankMember(), blankMember()]);
  const [category, setCategory] = useState("");
  const [experience, setExperience] = useState("");
  const [teamNameError, setTeamNameError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [memberErrors, setMemberErrors] = useState<MemberErrors[]>([{}, {}, {}]);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const updateMember = (index: number, field: keyof MemberData, value: string) => {
    setMembers((prev) => prev.map((m, i) => i === index ? { ...m, [field]: value } : m));
    // clear error on change
    if (submitted) {
      setMemberErrors((prev) => {
        const next = [...prev];
        const errs = { ...next[index] };
        delete errs[field];
        next[index] = errs;
        return next;
      });
    }
  };

  const memberCount = teamType === "solo" ? 1 : teamType === "duo" ? 2 : 3;
  const memberColors: AccentColor[] = ["cyan", "violet", "pink"];

  const handleSubmit = async () => {
    setSubmitted(true);
    setServerError("");

    const nameMissing = !teamName.trim();
    setTeamNameError(nameMissing);

    const allErrors = members.map((m, i) => (i < memberCount ? validateMember(m) : {}));
    setMemberErrors(allErrors);

    const hasError = nameMissing || allErrors.slice(0, memberCount).some((e) => Object.keys(e).length > 0);
    if (hasError) {
      setTimeout(() => {
        const el = document.querySelector(".border-red-500");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName,
          type: teamType,
          category: category || undefined,
          experience: experience || undefined,
          members: members.slice(0, memberCount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
    } catch {
      setServerError("Could not reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative px-6 py-25">
      <div className="max-w-7xl mx-auto">

        {/* HERO */}
        <div className="text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
            className="uppercase tracking-[0.5em] text-violet-400 text-sm mb-6">
            Registration Portal
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-black leading-none">
            Join The<br /><span className="text-cyan-400">Showdown</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 text-zinc-400 text-lg max-w-3xl mx-auto">
            Register as a Solo Participant, Duo Team or Full Trio Team and compete in Byte Brainiacs Season 02.
          </motion.p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          {[
            { label: "Registration Status", value: "OPEN", color: "cyan",   rgb: "34,211,238",  shimmer: "via-cyan-400/10",   bar: "bg-cyan-400"   },
            { label: "Teams Registered",    value: "127",  color: "violet", rgb: "167,139,250", shimmer: "via-violet-400/10", bar: "bg-violet-400" },
            { label: "Slots Remaining",     value: "73",   color: "pink",   rgb: "236,72,153",  shimmer: "via-pink-400/10",   bar: "bg-pink-400"   },
          ].map((stat, i) => (
            <motion.div key={stat.label} custom={i} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="group relative overflow-hidden bg-slate-900/40 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
              <motion.div animate={{ x: ["-100%", "250%"] }} transition={{ duration: 4 + i, repeat: Infinity, ease: "linear" }}
                className={`absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent ${stat.shimmer} to-transparent skew-x-12`} />
              <div className={`absolute top-0 left-0 h-[2px] w-full ${stat.bar} opacity-0 group-hover:opacity-100 transition-all`} />
              <p className="text-zinc-500">{stat.label}</p>
              <motion.h3
                animate={{ textShadow: [`0 0 0px rgba(${stat.rgb},0)`, `0 0 18px rgba(${stat.rgb},0.45)`, `0 0 0px rgba(${stat.rgb},0)`] }}
                transition={{ duration: 3, repeat: Infinity }}
                className={`text-5xl font-black mt-4 text-${stat.color}-400`}>
                {stat.value}
              </motion.h3>
            </motion.div>
          ))}
        </div>

        {/* FORM */}
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-20 max-w-5xl mx-auto bg-slate-900/40 border border-white/10 rounded-[40px] p-10 backdrop-blur-xl">

          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold">Registration Form</h2>
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <span className="text-red-400">*</span> Required fields
            </span>
          </div>

          {/* TEAM TYPE */}
          <div className="mb-10">
            <label className="block mb-4 text-zinc-400">Registration Type</label>
            <div className="grid grid-cols-3 gap-4">
              {([
                { value: "solo", title: "Solo", count: "1 Member" },
                { value: "duo",  title: "Duo",  count: "2 Members" },
                { value: "trio", title: "Trio", count: "3 Members" },
              ] as const).map((item) => (
                <motion.button key={item.value} type="button"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }} whileTap={{ scale: 0.97 }}
                  onClick={() => { setTeamType(item.value); setSubmitted(false); }}
                  className={`p-6 rounded-2xl border text-left transition-all duration-200 ${
                    teamType === item.value
                      ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                      : "border-white/10 bg-black/20 hover:border-white/20"
                  }`}>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-zinc-500 mt-2">{item.count}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* TEAM NAME */}
          <div className="mb-10">
            <label className="block text-xs text-zinc-500 mb-1.5 ml-1">Team Name<RequiredDot /></label>
            <input placeholder="Team Name"
              value={teamName}
              onChange={(e) => { setTeamName(e.target.value); setTeamNameError(false); }}
              className={`w-full p-4 rounded-xl bg-black/30 border ${submitted && teamNameError ? "border-red-500" : "border-white/10"} focus:border-cyan-400 focus:outline-none transition-colors`} />
            {submitted && <FieldError msg={teamNameError ? "Team name is required." : ""} />}
          </div>

          {/* MEMBERS */}
          <AnimatePresence>
            {[0, 1, 2].map((i) =>
              i < memberCount ? (
                <MemberSection
                  key={i}
                  animKey={`member-${i}`}
                  number={i + 1}
                  accentColor={memberColors[i]}
                  data={members[i]}
                  onChange={(field, value) => updateMember(i, field, value)}
                  errors={memberErrors[i]}
                  submitted={submitted}
                />
              ) : null
            )}
          </AnimatePresence>

          {/* CATEGORY */}
          <div className="mb-6">
            <label className="block text-xs text-zinc-500 mb-1.5 ml-1">Team Category</label>
            <CustomSelect
              placeholder="Select Team Category"
              value={category}
              onChange={setCategory}
              options={["Machine Learning", "Data Science", "Backend Development", "Frontend Development", "UI/UX Design", "Open Category"]}
              accentColor="cyan"
            />
          </div>

          {/* EXPERIENCE */}
          <div className="mb-10">
            <label className="block text-xs text-zinc-500 mb-1.5 ml-1">Team Experience</label>
            <textarea rows={5}
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Tell us about your team, previous projects, interests or hackathon experience..."
              className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors" />
          </div>

          {/* VALIDATION SUMMARY */}
          <AnimatePresence>
            {submitted && memberErrors.slice(0, memberCount).some((e) => Object.keys(e).length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 px-5 py-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex items-center gap-3"
              >
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Please fill in all required fields before submitting.
              </motion.div>
            )}
          </AnimatePresence>

          {/* SERVER ERROR */}
          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 px-5 py-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex items-center gap-3"
              >
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {serverError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* SUCCESS */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 px-5 py-4 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 text-sm flex items-center gap-3"
              >
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Registration submitted! Your team is pending admin review — we'll be in touch soon.
              </motion.div>
            )}
          </AnimatePresence>

          {/* SUBMIT */}
          <motion.button
            whileHover={!submitting ? { scale: 1.02, boxShadow: "0 0 30px rgba(34,211,238,0.25)" } : {}}
            whileTap={!submitting ? { scale: 0.98 } : {}}
            transition={{ duration: 0.2 }}
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-violet-500 via-cyan-500 to-pink-500 text-black font-bold text-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "SUBMITTING..." : "ENTER THE ARENA"}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
