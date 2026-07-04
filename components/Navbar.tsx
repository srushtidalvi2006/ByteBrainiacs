"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  const navItems = [
    {
      name: "Home",
      href: "#home",
      hover: "hover:text-cyan-400",
    },
    {
      name: "About",
      href: "#about",
      hover: "hover:text-pink-400",
    },
    {
      name: "Hall of Fame",
      href: "#past-years",
      hover: "hover:text-violet-400",
    },
    {
      name: "Groups",
      href: "#groups",
      hover: "hover:text-cyan-400",
    },
    {
      name: "Leaderboard",
      href: "#leaderboard",
      hover: "hover:text-pink-400",
    },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <nav
        className="
          w-full
          h-20
          border-b
          border-white/5
          bg-black/20
          backdrop-blur-xl
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            h-full
            px-8
            flex
            items-center
            justify-between
          "
        >
          {/* LOGO */}

          <Link href="#home">
            <h1
              className="
                text-white
                text-sm
                font-semibold
                tracking-[0.28em]
                hover:text-violet-300
                transition-colors
                duration-300
              "
            >
              BYTE BRAINIACS
            </h1>
          </Link>

          {/* NAVIGATION */}

          <div className="hidden md:flex items-center gap-12">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={item.href}
                  className={`
                    text-zinc-400
                    text-sm
                    font-normal
                    tracking-wide
                    transition-all
                    duration-300
                    ${item.hover}
                  `}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* REGISTER BUTTON */}

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/register"
              className="
                px-6
                py-3
                rounded-full
                bg-[#A78BFA]
                text-black
                text-sm
                font-semibold
                transition-all
                duration-300
                hover:bg-[#B794F6]
              "
            >
              Register
            </Link>
          </motion.div>
        </div>
      </nav>
    </div>
  );
}