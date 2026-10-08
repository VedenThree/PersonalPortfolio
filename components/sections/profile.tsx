import Reveal from "@/components/animations/reveal";
import CountUp from "@/components/ui/count-up";
import ScrambleText from "@/components/ui/scramble-text";
import ApproachBox from "@/components/ui/approach-box";
import ProfileBox from "@/components/ui/profile-box";
import SkillBar from "@/components/ui/skill-bar";
import { SKILL_ICONS, SKILL_TONE_CLASS } from "@/lib/skill-icons";
import { cn } from "@/lib/utils";
import type { Dict } from "@/lib/i18n";

// Un livello non è un numero arbitrario: se `SKILL_BARS` aggiungeva un 2 qui
// sotto, `LEVELS[2]` era `undefined` e la barra mostrava una cella vuota con
// un aria-label rotto, senza errori di tipo. L'unione lo impedisce. Le
// etichette leggibili vivono nel dizionario (`dict.levels`).
type SkillLevel = 3 | 4 | 5;

const SKILL_BARS: { name: string; level: SkillLevel }[] = [
  { name: "Next.js", level: 5 },
  { name: "MySQL", level: 5 },
  { name: "Wordpress", level: 5 },
  { name: "React.js", level: 4 },
  { name: "TypeScript", level: 4 },
  { name: "JavaScript", level: 4 },
  { name: "HTML & CSS", level: 4 },
  { name: "Tailwind CSS", level: 3 },
  { name: "Figma", level: 3 },
  { name: "Git & GitHub", level: 3 },
  { name: "PHP", level: 3 },
];

// Icona Devicon della skill nella tinta di categoria via currentColor.
// Senza voce in mappa: niente, mai un buco rotto.
function SkillIcon({ name, className }: { name: string; className?: string }) {
  const icon = SKILL_ICONS[name];
  if (!icon) return null;
  return (
    <svg
      viewBox="0 0 128 128"
      fill="currentColor"
      aria-hidden
      className={cn(
        "shrink-0",
        SKILL_TONE_CLASS[icon.tone],
        icon.boost && "scale-110",
        className,
      )}
    >
      {icon.circles?.map((c, j) => (
        <circle key={`c${j}`} cx={c.cx} cy={c.cy} r={c.r} />
      ))}
      {icon.paths.map((p, j) => (
        <path
          key={j}
          d={p.d}
          fillRule={p.evenodd ? "evenodd" : undefined}
          clipRule={p.evenodd ? "evenodd" : undefined}
          className={p.light ? "fill-paper-bright" : undefined}
        />
      ))}
    </svg>
  );
}

export default function Profile({ dict }: { dict: Dict["profile"] }) {
  const levels = dict.levels;
  return (
    <Reveal delay={100}>
      <section id="profilo" className="py-16 sm:py-24 border-t border-line">
        <div className="mb-12 md:mb-16">
          <div className="flex items-center justify-between mb-3">
            <p className="font-mono text-[10px] tracking-[0.3em] text-ice-dim uppercase">
              {dict.kicker}
            </p>
            <span
              aria-hidden
              className="font-mono text-[10px] tracking-[0.2em] text-ice-dim/80"
            >
              REC // <CountUp to={dict.facts.length} />
            </span>
          </div>
          <h2 className="font-display text-[clamp(28px,3.5vw,48px)] font-bold text-paper leading-[1.04]">
            {dict.title}
          </h2>
        </div>

        <div className="flex flex-col gap-6 md:gap-10">
          {/* Dati essenziali in una striscia leggibile: stesso reveal del box Approccio */}
          <ProfileBox className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 border border-line rounded divide-y divide-line/60 sm:divide-y-0 sm:divide-x sm:divide-line/60 bg-surface/40">
            {dict.facts.map((f, fi) => (
              <div
                key={f.label}
                data-ap
                style={{ "--d": `${fi * 60}ms` } as React.CSSProperties}
                className="approach-line px-4 py-4"
              >
                <p className="font-mono text-[9px] tracking-[0.2em] text-ice-dim uppercase pb-1.5">
                  {f.label}
                </p>
                <ScrambleText
                  text={f.value}
                  index={fi}
                  className="text-[14px] font-medium text-paper leading-snug"
                />
                {f.sub && (
                  <p className="font-mono text-[9px] text-ice-dim/70 mt-1 tracking-[0.06em]">
                    {f.sub}
                  </p>
                )}
              </div>
            ))}
          </ProfileBox>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-start">
            {/* Approccio: scansione design-to-code all'ingresso */}
            <ApproachBox dict={dict} />

            {/* Stack con livelli leggibili: stesso reveal del box Approccio */}
            <ProfileBox className="border border-line rounded bg-surface/60">
              <div
                data-ap
                style={{ "--d": "0ms" } as React.CSSProperties}
                className="approach-line px-5 py-3 border-b border-line bg-bg-deep/60 flex items-center justify-between"
              >
                <p className="font-mono text-[10px] tracking-[0.25em] text-ice uppercase">
                  {dict.stackTitle}
                </p>
                <p className="font-mono text-[8px] tracking-widest text-ice-dim/70 uppercase">
                  3 {levels[3]} · 4 {levels[4]} · 5 {levels[5]}
                </p>
              </div>
              <div className="px-5 py-2">
                {SKILL_BARS.map((s, idx) => (
                  <div
                    key={s.name}
                    data-ap
                    style={{ "--d": `${Math.min(120 + idx * 35, 450)}ms` } as React.CSSProperties}
                    // Sotto sm la colonna nome è un filo più larga (1.15fr) per
                    // far posto all'icona ingrandita senza troncare i nomi.
                    className="approach-line grid grid-cols-[1.15fr_1fr] gap-3 items-center py-2.5 border-b border-line/60 last:border-b-0 sm:grid-cols-[110px_1fr_52px]"
                  >
                    <span className="flex min-w-0 items-center gap-1.5 sm:gap-2 font-sans text-[12px] sm:text-[13px] text-paper">
                      <SkillIcon name={s.name} className="size-3.5 sm:size-5" />
                      <span className="truncate">{s.name}</span>
                    </span>
                    <SkillBar
                      level={s.level}
                      index={idx}
                      label={`${s.name}: ${dict.levelWord} ${s.level} ${dict.ofWord} 5 (${levels[s.level]})`}
                    />
                    <span className="hidden font-mono text-[9px] text-ice-dim uppercase text-right tabular-nums sm:block">
                      {levels[s.level]}
                    </span>
                  </div>
                ))}
              </div>
            </ProfileBox>
          </div>

          <div className="mt-2 md:mt-6 border-t border-line pt-6">
              <p className="font-mono text-[10px] text-ice-dim leading-relaxed">
                <span className="text-orange">▸</span> {dict.footnote}{" "}
                <span aria-hidden className="text-orange animate-pulse-glow">
                  ▊
                </span>
              </p>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
