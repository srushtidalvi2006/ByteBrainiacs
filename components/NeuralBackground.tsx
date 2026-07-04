"use client";

import { motion } from "framer-motion";

const nodes = [
  { x: 120, y: 144 }, { x: 350, y: 64  }, { x: 600, y: 176 },
  { x: 820, y: 96  }, { x: 220, y: 336 }, { x: 500, y: 400 },
  { x: 750, y: 304 }, { x: 900, y: 440 }, { x: 150, y: 544 },
  { x: 400, y: 576 }, { x: 650, y: 640 }, { x: 880, y: 624 },
  { x: 300, y: 720 }, { x: 580, y: 760 },
];

const edges = [
  [0,1],[1,2],[2,3],[0,4],[1,5],[2,6],[3,6],
  [4,5],[5,6],[6,7],[4,8],[5,9],[6,10],[7,11],
  [8,9],[9,10],[10,11],[8,12],[9,12],[9,13],[10,13],[12,13],
];

const colors = ["#8B5CF6","#EC4899"];

export default function NeuralBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>

      {/* One very faint violet wash — barely there */}
      <div style={{
        position: "absolute", top: "0%", left: "20%",
        height: 800, width: 800, borderRadius: "50%",
        background: "rgba(139,92,246,0.06)",
        filter: "blur(200px)",
      }} />

      {/* Neural network lines — ghosted */}
      <svg
        viewBox="0 0 1000 800"
        preserveAspectRatio="none"
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          opacity: 0.04,
          filter: "blur(1px)",
        }}
      >
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x} y1={nodes[a].y}
            x2={nodes[b].x} y2={nodes[b].y}
            stroke="#8B5CF6"
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* POPPING DOTS — each node gets a pulsing ring + solid core */}
      {nodes.map((n, i) => {
        const color = colors[i % colors.length];
        const delay = (i * 0.10) % 4;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${(n.x / 1000) * 100}%`,
              top: `${(n.y / 800) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Outer ring — expands and fades */}
            <motion.div
              animate={{
                scale: [1, 2],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeOut",
                delay,
                repeatDelay: 1.5,  // ← pause between pops so it feels like popping not spinning
              }}
              style={{
                position: "absolute",
                inset: 0,
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: color,
                transform: "translate(-50%, -50%)",
              }}
            />
            {/* Inner dot — solid, glows gently */}
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
              }}
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: color,
                boxShadow:`0 0 2px ${color}`,
                transform: "translate(-50%, -50%)",
                position: "absolute",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}