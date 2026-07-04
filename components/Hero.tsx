"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Outfit } from "next/font/google";

const headingFont = Outfit({
  subsets: ["latin"],
});

export default function Hero() {
return ( 
<section className="relative min-h-screen flex items-center justify-center px-6 pt-30 overflow-hidden">
  {/* MOVING GLOWS */}
  {/* CONTENT */}

  <div className="relative z-10 max-w-5xl mx-auto text-center">

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="
        uppercase
        tracking-[0.5em]
        text-violet-400
        mb-6
      "
    >
      HACKATHON 2026
    </motion.p>

    <motion.h1
      initial={{ opacity: 0, y: 80 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: [1, 1.02, 1],
      }}
      transition={{
        y: { duration: 1 },
        opacity: { duration: 1 },
        scale: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      className={`
        ${headingFont.className}
        text-[clamp(4rem,10vw,8rem)]
        font-black
        leading-[0.85]
        tracking-[-0.08em]
      `}
      style={{
        textShadow:
          "0 0 50px rgba(139,92,246,0.35)",
      }}
    >
      BYTE
      <br />
      BRAINIACS
    </motion.h1>

    <motion.h2
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="
        mt-4
        text-3xl
        md:text-5xl
        font-semibold
        bg-gradient-to-r
        from-violet-400
        via-cyan-400
        to-pink-400
        bg-clip-text
        text-transparent
      "
    >
      The ML Showdown
    </motion.h2>

    <div className="mt-10 flex justify-center">
      <div
        className="
          h-[2px]
          w-48
          bg-gradient-to-r
          from-transparent
          via-violet-500
          to-transparent
        "
      />
    </div>

    {/* TERMINAL */}

    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="
        mt-8 
        mx-auto 
        max-w-2xl"
      
    >
      <div
        className="
          bg-slate-900/60
          border
          border-white/10
          rounded-3xl
          overflow-hidden
          backdrop-blur-xl
        "
      >
        <div className="flex gap-2 p-4 border-b border-white/10">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>

        <div className="p-6 text-left">
          <p className="font-mono text-cyan-400">
            &gt; initialize_hackathon()
          </p>

          <p className="font-mono text-zinc-400 mt-2">
            Loading participants...
          </p>

          <p className="font-mono text-zinc-400">
            Loading teams...
          </p>

          <motion.p
            animate={{
              opacity: [1, 0.4, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
            className="
              font-mono
              text-pink-400
              mt-3
            "
          >
            Ready █
          </motion.p>
        </div>
      </div>
    </motion.div>

    <div className="flex flex-col md:flex-row gap-5 justify-center mt-12">
      <Link
        href="/register"
        className="
          bg-violet-600
          hover:bg-violet-500
          px-8
          py-4
          rounded-full
          font-semibold
          flex
          items-center
          justify-center
          gap-2
          transition
        "
      >
        Register Now
        <ArrowRight size={18} />
      </Link>

      <Link
        href="/about"
        className="
          border
          border-white/10
          hover:border-cyan-400
          px-8
          py-4
          rounded-full
          transition
        "
      >
        Learn More
      </Link>
    </div>
  </div>
</section>

       
);
}
