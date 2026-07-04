"use client";

import { Play } from "lucide-react";

export default function VideoSection() {
return ( <section className="py-40 px-6"> <div className="max-w-7xl mx-auto">

```
    <div
      className="
        relative
        h-[600px]
        rounded-[40px]
        overflow-hidden
        bg-zinc-900
      "
    >
      <div className="absolute inset-0 bg-black/60" />

      <div
        className="
          absolute
          inset-0
          flex
          flex-col
          items-center
          justify-center
        "
      >
        <h2 className="text-6xl md:text-8xl font-black text-center">
          Relive
          <br />
          The Showdown
        </h2>

        <button
          className="
            mt-10
            w-24
            h-24
            rounded-full
            bg-white/10
            backdrop-blur-xl
            flex
            items-center
            justify-center
          "
        >
          <Play size={40} />
        </button>
      </div>

    </div>

  </div>
</section>
);
}
