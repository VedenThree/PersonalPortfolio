import Reveal from "@/components/animations/reveal";

export default function Hero() {
  return (
    <Reveal delay={0}>
      <section className="relative grid grid-cols-1 md:grid-cols-[1.25fr_0.9fr] items-start gap-14 py-24 pb-[100px]">
        <div>
          <div className="flex flex-wrap gap-7 mb-[38px] font-mono text-[12.5px] text-ice-dim">
            <span className="flex items-center gap-2 before:content-[''] before:w-[5px] before:h-[5px] before:rounded-full before:bg-ice-dim before:animate-pulse first:before:bg-orange">
              FRONTEND
            </span>
            <span className="flex items-center gap-2 before:content-[''] before:w-[5px] before:h-[5px] before:rounded-full before:bg-ice-dim before:animate-pulse first:before:bg-orange">
              BACKEND
            </span>
            <span className="flex items-center gap-2 before:content-[''] before:w-[5px] before:h-[5px] before:rounded-full before:bg-ice-dim before:animate-pulse first:before:bg-orange">
              FULLSTACK
            </span>
          </div>

          <h1 className="font-display font-bold text-[clamp(36px,4.6vw,66px)] leading-[1.04] tracking-[-0.01em] text-paper">
            <span className="hero-word" style={{ animation: "reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) both", animationDelay: "0.1s" }}>Sviluppo</span>{" "}
            <span className="hero-word" style={{ animation: "reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) both", animationDelay: "0.2s" }}>web</span>{" "}
            <span className="hero-word" style={{ animation: "reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) both", animationDelay: "0.3s" }}>, un</span>{" "}
            <span className="hero-word" style={{ animation: "reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) both", animationDelay: "0.35s" }}>
              <span className="text-orange">sistema</span>
            </span>{" "}
            <span className="hero-word" style={{ animation: "reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) both", animationDelay: "0.4s" }}>alla</span>{" "}
            <span className="hero-word" style={{ animation: "reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) both", animationDelay: "0.5s" }}>volta.</span>
          </h1>

          <p className="hero-sub mt-9">
            <span className="block max-w-[440px] text-base text-paper-dim" style={{ animation: "reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) both", animationDelay: "0.55s" }}>
              Da React a MongoDB, da Next.js a MySQL: costruisco sistemi
              digitali completi, dal primo byte all'ultima riga di codice.
            </span>
          </p>

          <div className="hero-cta mt-10 flex flex-wrap gap-4">
            <a
              href="#lavori"
              className="inline-flex items-center gap-2.5 relative border border-orange font-mono text-[13px] px-[26px] py-3.5 text-orange transition-all duration-200 hover:bg-orange hover:text-ink [clip-path:polygon(0_0,calc(100%_-_10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%_-_10px))]"
              style={{ animation: "reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) both", animationDelay: "0.6s" }}
            >
              Vedi i progetti ↓
            </a>
            <a
              href="#contatti"
              className="inline-flex items-center gap-2.5 relative border border-line font-mono text-[13px] px-[26px] py-3.5 text-paper-dim transition-all duration-200 hover:bg-transparent hover:border-ice hover:text-ice [clip-path:polygon(0_0,calc(100%_-_10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%_-_10px))]"
              style={{ animation: "reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) both", animationDelay: "0.65s" }}
            >
              Contatti
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3.5 border-l border-line pl-6 font-mono text-[12.5px] text-ice mt-7 max-w-[280px]">
          <p style={{ animation: "reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) both", animationDelay: "0.4s" }}>
            <span className="text-ice-dim">RUOLO /_</span> Full Stack Web Developer
          </p>
          <p style={{ animation: "reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) both", animationDelay: "0.5s" }}>
            <span className="text-ice-dim">BASE /_</span> Italia
          </p>
          <p style={{ animation: "reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) both", animationDelay: "0.6s" }}>
            <span className="text-ice-dim">STACK /_</span> React · Next · Node · SQL
          </p>
        </div>
      </section>
    </Reveal>
  );
}