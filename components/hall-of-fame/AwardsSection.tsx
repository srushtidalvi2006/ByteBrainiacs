"use client";

import {
BrainCircuit,
BarChart3,
Cpu,
Sparkles,
} from "lucide-react";

const awards = [
{
icon: BrainCircuit,
title: "Best Use of GenAI",
},
{
icon: BarChart3,
title: "Best Data Visualization",
},
{
icon: Sparkles,
title: "Most Innovative Solution",
},
{
icon: Cpu,
title: "Edge AI Champion",
},
];

export default function AwardsSection() {
return ( <section className="py-40 px-6"> <div className="max-w-7xl mx-auto">

```
    <h2 className="text-center text-6xl font-black mb-20">
      Special Awards
    </h2>

    <div className="grid md:grid-cols-4 gap-8">

      {awards.map((award) => {
        const Icon = award.icon;

        return (
          <div
            key={award.title}
            className="
              group
              rounded-3xl
              border
              border-white/10
              bg-slate-900/40
              p-8
              backdrop-blur-xl
              hover:border-cyan-400/30
              transition-all
            "
          >
            <Icon
              size={40}
              className="text-cyan-400 mb-6"
            />

            <h3 className="text-xl font-semibold">
              {award.title}
            </h3>
          </div>
        );
      })}

    </div>

  </div>
</section>


);
}
