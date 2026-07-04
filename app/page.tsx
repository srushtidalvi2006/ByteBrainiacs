import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import PastYears from "@/components/hall-of-fame";
import NeuralBackground from "@/components/NeuralBackground";

export default function Home() {
  return (
    <main className="bg-[#050816] text-white overflow-hidden">
      <NeuralBackground />
      <Navbar />

      {/* HERO */}
      <section
        id="home"
        className="scroll-mt-16"
      >
        <Hero />
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="scroll-mt-16"
      >
        <About />
      </section>

      {/* PAST YEARS */}
      <section
        id="past-years"
        className="scroll-mt-12"
      >
        <PastYears />
      </section>

      {/* GROUPS */}
      <section
        id="groups"
        className="
          scroll-mt-24
          py-40
          text-center
        "
      >
        <h2 className="text-6xl font-black">
          Groups
        </h2>

        <p className="text-zinc-400 mt-6">
          Coming Soon
        </p>
      </section>

      {/* LEADERBOARD */}
      <section
        id="leaderboard"
        className="
          scroll-mt-24
          py-40
          text-center
        "
      >
        <h2 className="text-6xl font-black">
          Leaderboard
        </h2>

        <p className="text-zinc-400 mt-6">
          Coming Soon
        </p>
      </section>

    </main>
  );
}