"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Incorrect password.");
        return;
      }

      const destination = searchParams.get("from") || "/admin";
      router.push(destination);
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative px-6 py-32 min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-slate-900/40 border border-white/10 rounded-[32px] p-10 backdrop-blur-xl"
      >
        <p className="uppercase tracking-[0.4em] text-violet-400 text-xs mb-3 text-center">
          Restricted Access
        </p>
        <h1 className="text-3xl font-black text-center mb-8">
          Admin <span className="text-cyan-400">Login</span>
        </h1>

        <form onSubmit={handleSubmit}>
          <label className="block text-xs text-zinc-500 mb-1.5 ml-1">Admin Password</label>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            placeholder="Enter admin password"
            className={`w-full p-4 rounded-xl bg-black/30 border ${error ? "border-red-500" : "border-white/10"} focus:border-cyan-400 focus:outline-none transition-colors`}
          />

          {error && (
            <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
              <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={submitting || !password}
            whileHover={!submitting && password ? { scale: 1.02, boxShadow: "0 0 30px rgba(34,211,238,0.25)" } : {}}
            whileTap={!submitting && password ? { scale: 0.98 } : {}}
            className="mt-8 w-full py-4 rounded-2xl bg-gradient-to-r from-violet-500 via-cyan-500 to-pink-500 text-black font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Verifying..." : "Sign In"}
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
