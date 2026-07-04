"use client";

import { motion } from "framer-motion";
import {ExternalLink } from "lucide-react";

export default function WinnersSection() {
return ( 
<section className="py-52 px-6"> <div className="max-w-7xl mx-auto">

```
    <motion.h2
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-center text-6xl md:text-8xl font-black mb-24"
    >
      Hall of Fame
    </motion.h2>

    <div
      className="
        bg-slate-900/40
        border border-white/10
        rounded-[40px]
        overflow-hidden
        backdrop-blur-xl
      "
    >
      <div className="h-[450px] bg-zinc-800" />

      <div className="p-12">

        <p className="text-yellow-400 text-4xl mb-4">
          🥇
        </p>

        <h3 className="text-5xl font-black">
          Project DeepVision
        </h3>

        <p className="text-zinc-400 mt-6 max-w-3xl">
          Built a lightweight computer vision model
          capable of identifying crop diseases in
          real-time using smartphone cameras.
        </p>

        <div className="flex gap-3 mt-8 flex-wrap">
          <span className="px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-400">
            Python
          </span>
          <span className="px-4 py-2 rounded-full bg-violet-500/10 text-violet-400">
            PyTorch
          </span>
          <span className="px-4 py-2 rounded-full bg-pink-500/10 text-pink-400">
            OpenCV
          </span>
        </div>

        <div className="flex gap-4 mt-8">
          <button className="flex items-center gap-2">
            <ExternalLink size={18} />
            Submission
          </button>
        </div>

      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-8 mt-10">

      <div className="bg-slate-900/40 rounded-3xl border border-white/10 p-8">
        <p className="text-3xl mb-4">🥈</p>
        <h3 className="text-3xl font-bold">
          InsightAI
        </h3>
      </div>

      <div className="bg-slate-900/40 rounded-3xl border border-white/10 p-8">
        <p className="text-3xl mb-4">🥉</p>
        <h3 className="text-3xl font-bold">
          NeuroFlow
        </h3>
      </div>

    </div>

  </div>
</section>


);
}
