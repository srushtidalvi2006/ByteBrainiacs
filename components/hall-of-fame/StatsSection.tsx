"use client";

import { motion } from "framer-motion";

export default function StatsSection() {
  return (
    <section className="relative py-25 overflow-hidden">

      <div className="max-w-6xl mx-auto px-6 text-center">

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="
            uppercase
            tracking-[0.6em]
            text-violet-400
            text-sm
            mb-8
          "
        >
          Season 01
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="
            text-7xl
            md:text-[10rem]
            font-black
            leading-none
          "
        >
          2025
        </motion.h2>

        <p
          className="
            text-zinc-400
            text-xl
            max-w-2xl
            mx-auto
            mt-8
          "
        >
          The inaugural season of Byte Brainiacs.
          36 hours of innovation, machine learning
          and relentless problem solving.
        </p>

      </div>

      <div
        className="
          max-w-7xl
          mx-auto
          mt-32
          px-6
          grid
          md:grid-cols-4
          gap-12
        "
      >
        {[
          ["200+", "Participants"],
          ["40+", "Models Trained"],
          ["₹50K+", "Prize Pool"],
          ["36", "Hours"]
        ].map(([value, label], i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="text-center"
          >
            <h3
              className="
                text-6xl
                md:text-8xl
                font-black
                text-cyan-400
              "
            >
              {value}
            </h3>

            <p className="text-zinc-500 mt-4">
              {label}
            </p>
          </motion.div>
        ))}
      </div>

    </section>
  );
}