"use client";

import { motion } from "framer-motion";

const images = Array.from({ length: 8 });

export default function GallerySection() {
  return (
    <section className="py-40 overflow-hidden">

      <h2 className="text-center text-5xl font-black mb-20">
        In The Trenches
      </h2>

      <motion.div
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 30,
          ease: "linear",
        }}
        className="flex gap-6 w-max"
      >
        {[...images, ...images].map((_, i) => (
          <div
            key={i}
            className="
              w-[350px]
              h-[250px]
              rounded-3xl
              bg-zinc-800
              flex-shrink-0
            "
          />
        ))}
      </motion.div>

    </section>
  );
}