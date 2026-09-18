import { useEffect, useRef, useState } from "react";
import svgPaths from "../public/images/temp/svg-2l43a4fbvi";
import heroSvg from "../public/images/hero/svg-iv1icma5b9";
import imgOuterOrbit from "./imports/Hero/09193916699e1987f14487320cebd7dd0c84d4c9.png";

// ─── Hero Right: Orbital Visual (from new design) ────────────────────────────

function HeroOrbital() {
  return (
    <div className="bg-[#0b101d] relative rounded-[8px] shrink-0 w-[460px] h-[460px]">
      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[inherit] size-full">
        {/* Mesh grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between p-5 pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-px w-full bg-[#1b2438] opacity-30" />
          ))}
        </div>

        {/* Outer orbit image */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[360px]">
          <img alt="" className="absolute block inset-0 size-full" src={imgOuterOrbit.src} />
        </div>

        {/* Planetary radar sweep sector */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[290px]">
          <div className="absolute bottom-0 left-1/4 right-0 top-0">
            <svg className="block size-full" fill="none" viewBox="0 0 240 320">
              <path d={heroSvg.p282ef500} fill="#FF5C00" opacity="0.08" />
            </svg>
          </div>
        </div>

        {/* Inner orbit ring */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[220px]">
          <div className="absolute inset-[0_14.64%_0_0]">
            <svg className="block size-full" fill="none" viewBox="0 0 204.853 240">
              <mask fill="white" id="hro-mask">
                <path d={heroSvg.p2666b580} />
              </mask>
              <path d={heroSvg.p2666b580} mask="url(#hro-mask)" stroke="#FF5C00" strokeWidth="3" />
            </svg>
          </div>
        </div>

        {/* Core beacon */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#050811] border-2 border-[#ff5c00] rounded-full size-[110px] flex flex-col items-center justify-center">
          <p className="font-['Geist_Mono',_sans-serif] text-[9px] text-[#ff5c00]">SECTOR_CORE</p>
          <p className="font-['Geist_Mono',_sans-serif] font-black text-[15px] text-[#f1f5f9]">-273°C</p>
          <p className="font-['Geist_Mono',_sans-serif] text-[8px] text-[#10b981]">SYS_READY</p>
        </div>

        {/* Corner labels */}
        <p className="absolute font-['Geist_Mono',_sans-serif] text-[9px] text-[#64748b] left-6 top-6 whitespace-nowrap">SYS_MONITOR // V.24.1</p>
        <p className="absolute font-['Geist_Mono',_sans-serif] text-[9px] text-[#ff5c00] left-6 bottom-6 whitespace-nowrap">SYS_LOC: ORB_L_09</p>
        <p className="absolute font-['Geist_Mono',_sans-serif] text-[9px] text-[#10b981] right-6 top-6 whitespace-nowrap">SCANNER: ACT</p>
      </div>
      <div aria-hidden className="absolute border border-[#1b2438] inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

// ─── Hero Terminal (improved for new style) ───────────────────────────────────

function HeroTerminal() {
  const lines = [
    { cmd: "INIT_BOOT", res: "OK", color: "#10b981" },
    { cmd: "LOAD_MODULES [6/6]", res: "COMPLETE", color: "#10b981" },
    { cmd: "NET_STATUS", res: "ONLINE", color: "#10b981" },
    { cmd: "FIREWALL", res: "ACTIVE", color: "#ff5c00" },
    { cmd: "CLEARANCE_LVL", res: "VERIFIED", color: "#10b981" },
    { cmd: "ENGINE_STATUS", res: "READY // FULL-STACK", color: "#10b981" },
    { cmd: "SECTOR_ACTIVE", res: "SECTOR_WEB_01", color: "#38bdf8" },
    { cmd: "LATENCY", res: "14ms [OTTIMIZZATO]", color: "#ff5c00" },
  ];
  return (
    <div className="bg-[#0b101d] border border-[#1b2438] rounded-[2px] w-full">
      {/* Terminal header bar */}
      <div className="border-b border-[#1b2438] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="size-[8px] rounded-full bg-[#ff5c00] opacity-60" />
            <div className="size-[8px] rounded-full bg-[#64748b] opacity-40" />
            <div className="size-[8px] rounded-full bg-[#64748b] opacity-40" />
          </div>
          <p className="font-['Geist_Mono',_sans-serif] text-[9px] text-[#64748b] ml-2">TERMINAL_SYS // BOOT_SEQUENCE</p>
        </div>
        <p className="font-['Geist_Mono',_sans-serif] text-[9px] text-[#ff5c00]">V.24.1</p>
      </div>
      {/* Lines */}
      <div className="px-4 py-3 flex flex-col gap-1.5">
        {lines.map(({ cmd, res, color }) => (
          <div key={cmd} className="flex items-center gap-3">
            <span className="font-['Geist_Mono',_sans-serif] text-[10px] text-[#64748b] shrink-0">{">"}</span>
            <span className="font-['Geist_Mono',_sans-serif] text-[10px] text-[#64748b] flex-1">{cmd}</span>
            <span className="font-['Geist_Mono',_sans-serif] font-bold text-[10px] whitespace-nowrap" style={{ color }}>{res}</span>
          </div>
        ))}
        {/* Blinking cursor line */}
        <div className="flex items-center gap-3 mt-1">
          <span className="font-['Geist_Mono',_sans-serif] text-[10px] text-[#ff5c00]">{">"}</span>
          <span className="font-['Geist_Mono',_sans-serif] font-bold text-[10px] text-[#ff5c00]">READY_</span>
          <span className="inline-block w-[7px] h-[12px] bg-[#ff5c00] opacity-80 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ─── Section Label ────────────────────────────────────────────────────────────

function SectionLabel({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex gap-3 items-center w-full mb-14">
      <p className="font-['JetBrains_Mono',_sans-serif] text-[10.08px] text-[#e8580a] tracking-[2.22px] uppercase whitespace-nowrap shrink-0">
        {`// ${num} · ${label}`}
      </p>
      <div className="h-px flex-1 bg-gradient-to-r from-[rgba(232,88,10,0.4)] to-transparent" />
    </div>
  );
}

// ─── Skill Bar ────────────────────────────────────────────────────────────────

function SkillBar({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <p className="font-['JetBrains_Mono',_sans-serif] text-[9.6px] text-[rgba(168,196,212,0.55)] tracking-[0.96px]">{label}</p>
        <p className="font-['JetBrains_Mono',_sans-serif] text-[9.6px] text-[#e8580a] tracking-[0.77px]">{pct}%</p>
      </div>
      <div className="bg-[rgba(232,88,10,0.12)] h-[4px] w-full relative">
        <div
          className="absolute left-0 top-0 h-full"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #9c3a05 0%, #e8580a 100%)",
          }}
        />
      </div>
    </div>
  );
}

// ─── Timeline Item ────────────────────────────────────────────────────────────

interface TimelineItem {
  year: string;
  title: string;
  desc: string;
}

function TimelineEntry({ item, last }: { item: TimelineItem; last?: boolean }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="size-2 rounded-full bg-[#e8580a] shrink-0 mt-1" />
        {!last && <div className="w-px flex-1 bg-[rgba(232,88,10,0.2)] mt-1" />}
      </div>
      <div className="pb-8">
        <p className="font-['JetBrains_Mono',_sans-serif] text-[9.6px] text-[#e8580a] tracking-[0.96px] mb-1">{item.year}</p>
        <p className="font-['Barlow_Condensed',_sans-serif] font-bold text-[15px] text-[#d6eaf8] leading-none mb-1">{item.title}</p>
        <p className="font-['Outfit',_sans-serif] text-[13.12px] text-[rgba(168,196,212,0.55)] leading-[1.5]">{item.desc}</p>
      </div>
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────

interface Project {
  num: string;
  status: "DEPLOYED" | "ACTIVE";
  priority: "CRITICAL" | "HIGH";
  title: string;
  subtitle: string;
  desc: string;
  tags: string[];
  completion: number;
  missionId: string;
}

function ProjectCard({ p }: { p: Project }) {
  const statusColor = p.status === "DEPLOYED" ? "text-[#22c55e] border-[rgba(34,197,94,0.3)]" : "text-[#60a5fa] border-[rgba(96,165,250,0.3)]";
  const priorityColor = p.priority === "CRITICAL" ? "text-[#ef4444] border-[rgba(239,68,68,0.3)]" : "text-[#e8580a] border-[rgba(232,88,10,0.3)]";
  return (
    <div
      className="border border-[rgba(168,196,212,0.1)] flex flex-col p-6 relative"
      style={{ background: "linear-gradient(135deg, rgba(168,196,212,0.03) 0%, rgba(13,14,26,0.95) 100%)" }}
    >
      {/* Corner brackets */}
      <div className="absolute border-l-2 border-t-2 border-[rgba(232,88,10,0.4)] left-0 top-0 size-[12px]" />
      <div className="absolute border-b-2 border-r-2 border-[rgba(232,88,10,0.4)] right-0 bottom-0 size-[12px]" />

      {/* Faded number */}
      <p className="absolute right-5 top-4 font-['Barlow_Condensed',_sans-serif] font-extrabold text-[64px] leading-none text-[rgba(232,88,10,0.06)] select-none">{p.num}</p>

      {/* Badges */}
      <div className="flex gap-2 mb-3">
        <span className={`border font-['JetBrains_Mono',_sans-serif] text-[8px] tracking-[1.2px] px-2 py-0.5 ${statusColor}`}>{p.status}</span>
        <span className={`border font-['JetBrains_Mono',_sans-serif] text-[8px] tracking-[1.2px] px-2 py-0.5 ${priorityColor}`}>{p.priority}</span>
      </div>

      <h3 className="font-['Barlow_Condensed',_sans-serif] font-extrabold text-[22px] text-[#d6eaf8] uppercase leading-none mb-1">{p.title}</h3>
      <p className="font-['JetBrains_Mono',_sans-serif] text-[9px] text-[rgba(168,196,212,0.4)] tracking-[0.9px] mb-3">{p.subtitle}</p>
      <p className="font-['Outfit',_sans-serif] text-[13px] text-[rgba(168,196,212,0.65)] leading-[1.6] mb-4 flex-1">{p.desc}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {p.tags.map((t) => (
          <span key={t} className="border border-[rgba(168,196,212,0.15)] font-['JetBrains_Mono',_sans-serif] text-[8px] text-[rgba(168,196,212,0.5)] tracking-[0.8px] px-2 py-0.5">{t}</span>
        ))}
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex gap-0.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-[3px] flex-1"
              style={{ background: i < Math.round(p.completion / 10) ? "#e8580a" : "rgba(232,88,10,0.12)" }}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <p className="font-['JetBrains_Mono',_sans-serif] text-[8px] text-[rgba(168,196,212,0.25)] tracking-[0.8px]">{p.missionId}</p>
        <p className="font-['JetBrains_Mono',_sans-serif] text-[8.5px] text-[#e8580a] tracking-[0.8px] cursor-pointer hover:underline">DETTAGLI →</p>
      </div>
    </div>
  );
}

// ─── Skill Dot Rating ─────────────────────────────────────────────────────────

function SkillDot({ name, level }: { name: string; level: number }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[rgba(168,196,212,0.06)]">
      <p className="font-['Outfit',_sans-serif] text-[14.08px] text-[rgba(214,234,248,0.78)]">{name}</p>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="size-[7px] rounded-full"
            style={{ background: i < level ? "#e8580a" : "rgba(232,88,10,0.15)" }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const navItems = [
  { num: "01", label: "HOME", id: "home" },
  { num: "02", label: "ABOUT", id: "about" },
  { num: "03", label: "PROJECTS", id: "projects" },
  { num: "04", label: "SKILLS", id: "skills" },
  { num: "05", label: "CONTACT", id: "contact" },
];

function Sidebar({ active }: { active: string }) {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-[220px] flex flex-col z-50 bg-[rgba(6,6,11,0.97)] border-r border-[rgba(232,88,10,0.18)]">
      {/* Logo / Identity */}
      <div className="border-b border-[rgba(232,88,10,0.18)] px-5 pt-6 pb-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-[#e8580a] flex items-center justify-center size-9 shrink-0">
            <span className="font-['Barlow_Condensed',_sans-serif] font-extrabold text-[16px] text-white leading-none tracking-widest">AK</span>
          </div>
          <div>
            <p className="font-['JetBrains_Mono',_sans-serif] text-[8.5px] text-[rgba(168,196,212,0.5)] tracking-[1.2px]">ALEX.KOVACS</p>
            <p className="font-['JetBrains_Mono',_sans-serif] text-[7.5px] text-[rgba(168,196,212,0.3)] tracking-[0.9px]">FULL-STACK DEV</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-[3px] bg-[#e8580a]" style={{ height: `${6 + i * 2}px` }} />
            ))}
            <div className="w-[3px] h-[12px] bg-[rgba(168,196,212,0.15)]" />
          </div>
          <p className="font-['JetBrains_Mono',_sans-serif] text-[7.5px] text-[rgba(168,196,212,0.35)] tracking-[0.7px]">SIGNAL 3/4</p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col flex-1 pt-2">
        {navItems.map(({ num, label, id }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`flex items-center gap-3 h-[68px] px-5 border-b border-[rgba(168,196,212,0.05)] text-left relative overflow-hidden transition-colors cursor-pointer ${
                isActive ? "bg-[rgba(232,88,10,0.07)]" : "hover:bg-[rgba(168,196,212,0.03)]"
              }`}
            >
              {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#e8580a]" />}
              <div className="flex flex-col">
                <span className={`font-['JetBrains_Mono',_sans-serif] text-[8.8px] leading-none tracking-[1.23px] ${isActive ? "text-[rgba(232,88,10,0.6)]" : "text-[rgba(168,196,212,0.3)]"}`}>{num}</span>
                <span className={`font-['Barlow_Condensed',_sans-serif] font-bold text-[16px] tracking-[1.6px] leading-[1.6] ${isActive ? "text-[#e8580a]" : "text-[rgba(214,234,248,0.7)]"}`}>{label}</span>
              </div>
              {isActive && (
                <span className="ml-auto font-['Outfit',_sans-serif] text-[11.2px] text-[#e8580a]">▶</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Geolocation + status */}
      <div className="border-t border-[rgba(232,88,10,0.12)] px-5 py-4">
        <div className="font-['JetBrains_Mono',_sans-serif] text-[8.8px] text-[rgba(168,196,212,0.3)] tracking-[0.88px] leading-[1.8] mb-2">
          <p>LAT 45.46°N</p>
          <p>LON 09.18°E</p>
          <p>ALT 122m ASL</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-[6px] rounded-full bg-[#22c55e]" />
          <span className="font-['JetBrains_Mono',_sans-serif] text-[8.8px] text-[#22c55e] tracking-[0.88px]">ONLINE</span>
        </div>
      </div>
    </aside>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────

const timeline: TimelineItem[] = [
  { year: "2018", title: "PRIMI PASSI", desc: "Node.js, Express, primi database relazionali con PostgreSQL." },
  { year: "2019", title: "FRONTEND FOCUS", desc: "React, Vue.js. Primo lavoro freelance su commissione." },
  { year: "2020", title: "ARCHITETTURA API", desc: "REST e GraphQL. Docker, prime pipeline CI/CD." },
  { year: "2021", title: "SISTEMI DISTRIBUITI", desc: "Microservizi, Kubernetes, sicurezza applicativa." },
  { year: "2023", title: "TECH LEAD", desc: "Guidato team di 5 developer su piattaforme enterprise." },
  { year: "2026", title: "FULL-STACK SENIOR", desc: "Architetture scalabili, AI integration, mission-critical systems." },
];

const projects: Project[] = [
  {
    num: "01", status: "DEPLOYED", priority: "CRITICAL",
    title: "ORBITALSYNC",
    subtitle: "SAAS PLATFORM · DASHBOARD DI MONITORAGGIO · 2024",
    desc: "Piattaforma di monitoraggio energetico real-time per infrastrutture distribuite. Dashboard con WebSocket, alerting avanzato e reportistica automatizzata.",
    tags: ["React", "Node.js", "WebSocket", "PostgreSQL", "Docker"],
    completion: 100, missionId: "MSN-2024-0118",
  },
  {
    num: "02", status: "ACTIVE", priority: "HIGH",
    title: "ICEBREAKER API",
    subtitle: "API GATEWAY · FILE-SYSTEM DISTRIBUITO · 2024",
    desc: "Gateway API ad alta disponibilità con autenticazione JWT, rate limiting adattivo e routing intelligente verso microservizi eterogenei.",
    tags: ["FastAPI", "Python", "Redis", "Nginx", "K8s"],
    completion: 87, missionId: "MSN-2024-0291",
  },
  {
    num: "03", status: "DEPLOYED", priority: "HIGH",
    title: "TACTICALGRID",
    subtitle: "DASHBOARD OPERATIVO · ANALYTICS · 2023",
    desc: "Sistema di analytics operativo per monitoraggio KPI mission-critical. Visualizzazioni real-time, drill-down gerarchici, esportazione dati strutturati.",
    tags: ["Next.js", "TypeScript", "D3.js", "GraphQL", "AWS"],
    completion: 100, missionId: "MSN-2023-0044",
  },
  {
    num: "04", status: "DEPLOYED", priority: "CRITICAL",
    title: "FROSTVAULT",
    subtitle: "PIATTAFORMA E-COMMERCE · FULL-STACK · 2023",
    desc: "E-commerce B2B ad alta conversione con gestione inventario real-time, integrazione pagamenti multi-provider e sistema di raccomandazione ML.",
    tags: ["Vue.js", "Rust", "Stripe", "MongoDB", "GCP"],
    completion: 100, missionId: "MSN-2023-0177",
  },
];

const skillCategories = [
  {
    label: "FRONTEND",
    skills: [
      { name: "React / Next.js", level: 5 },
      { name: "TypeScript", level: 5 },
      { name: "Vue.js", level: 4 },
      { name: "Tailwind CSS", level: 4 },
    ],
  },
  {
    label: "BACKEND",
    skills: [
      { name: "Node.js", level: 5 },
      { name: "Python / FastAPI", level: 4 },
      { name: "Rust", level: 3 },
      { name: "Express", level: 5 },
    ],
  },
  {
    label: "DATABASE",
    skills: [
      { name: "PostgreSQL", level: 4 },
      { name: "MongoDB", level: 4 },
      { name: "Redis", level: 3 },
      { name: "GraphQL", level: 4 },
    ],
  },
  {
    label: "DEVOPS",
    skills: [
      { name: "Docker / K8s", level: 4 },
      { name: "AWS / GCP", level: 3 },
      { name: "CI/CD", level: 4 },
      { name: "Linux / Bash", level: 4 },
    ],
  },
];

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      sectionRefs.current[id] = el;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="min-h-screen bg-[#06060f]">
      <Sidebar active={activeSection} />

      <main className="ml-[220px]">
        {/* ── HERO ── */}
        <section id="home" className="bg-[#050811] border-b border-[#1b2438] px-[60px] py-[60px] flex gap-10 items-center">
          {/* Left column */}
          <div className="flex flex-col gap-8 flex-1 min-w-0">
            {/* Mission tag */}
            <div className="bg-[rgba(255,92,0,0.08)] border border-[#ff5c00] rounded-[2px] inline-flex items-center gap-2 px-2.5 py-1.5 self-start">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <g clipPath="url(#clip-r)">
                  <path d={heroSvg.p28d23200} stroke="#FF5C00" strokeLinecap="round" strokeWidth="2" />
                </g>
                <defs><clipPath id="clip-r"><rect fill="white" width="12" height="12" /></clipPath></defs>
              </svg>
              <p className="font-['Geist_Mono',_sans-serif] text-[11px] text-[#ff5c00] whitespace-nowrap">MISSIONE FULL-STACK // WEB DEVELOPER</p>
            </div>

            {/* Headline */}
            <div className="flex flex-col gap-4">
              <h1 className="font-['Geist_Mono',_sans-serif] font-extrabold text-[52px] leading-[1.05] text-[#f1f5f9]">
                COSTRUISCO APPLICAZIONI WEB RESISTENTI AL CARICO
              </h1>
              <p className="font-['Geist',_sans-serif] text-[17px] text-[#64748b] leading-[1.5] max-w-[560px]">
                Web Developer Full-Stack specializzato in applicazioni web robuste, scalabili e sicure. Progetto interfacce reattive con React.js, backend performanti con Next.js e architetture dati affidabili con MongoDB.
              </p>
            </div>

            {/* Terminal */}
            <HeroTerminal />

            {/* CTA buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-[#ff5c00] border border-[#ff5c00] rounded-[2px] flex items-center gap-2.5 px-5 py-3 hover:bg-[#e85200] transition-colors cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d={heroSvg.p2b607f80} stroke="#050811" strokeLinecap="round" strokeWidth="2" />
                </svg>
                <span className="font-['Geist_Mono',_sans-serif] font-bold text-[12px] text-[#050811] whitespace-nowrap">INIZIA MISSIONE (CONTATTAMI)</span>
              </button>
              <button
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-transparent border border-[#1b2438] rounded-[2px] flex items-center gap-2.5 px-5 py-3 hover:border-[rgba(255,92,0,0.4)] transition-colors cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <g clipPath="url(#clip-db)">
                    <path d={heroSvg.p30307540} stroke="#FF5C00" strokeLinecap="round" strokeWidth="2" />
                  </g>
                  <defs><clipPath id="clip-db"><rect fill="white" width="14" height="14" /></clipPath></defs>
                </svg>
                <span className="font-['Geist_Mono',_sans-serif] font-bold text-[12px] text-[#f1f5f9] whitespace-nowrap">ISPEZIONA PORTFOLIO (PROGETTI)</span>
              </button>
            </div>
          </div>

          {/* Right column: orbital visual */}
          <HeroOrbital />
        </section>

        {/* Divider */}
        <div className="h-px mx-8 bg-gradient-to-r from-transparent via-[#e8580a] to-transparent opacity-30" />

        {/* ── ABOUT ── */}
        <section id="about" className="px-8 py-24">
          <SectionLabel num="02" label="ABOUT" />
          <div className="grid grid-cols-2 gap-14">
            {/* Left */}
            <div>
              <h2 className="font-['Barlow_Condensed',_sans-serif] font-extrabold text-[54px] leading-[0.95] uppercase text-[#d6eaf8] mb-7">
                CODICE SCRITTO
                <br />
                <span className="text-[#e8580a]">CON PRECISIONE</span>
                <br />
                MILITARE
              </h2>
              <p className="font-['Outfit',_sans-serif] text-[16px] text-[rgba(168,196,212,0.72)] leading-[1.8] mb-4">
                Mi chiamo Alex Kovacs, sviluppatore full-stack con sede a Milano. Costruisco sistemi che devono funzionare sotto pressione — piattaforme ad alta disponibilità, API real-time e interfacce utente che non perdonano l'imprecisione.
              </p>
              <p className="font-['Outfit',_sans-serif] text-[16px] text-[rgba(168,196,212,0.72)] leading-[1.8] mb-8">
                Ogni progetto è una missione: analisi dei requisiti, architettura robusta, deployment sicuro. Lavoro con team distribuiti e parlo il linguaggio del codice pulito, del testing rigoroso e della documentazione chiara.
              </p>

              <p className="font-['JetBrains_Mono',_sans-serif] text-[10.08px] text-[#e8580a] tracking-[2.22px] uppercase mb-5">// CORE COMPETENCIES</p>
              <div className="flex flex-col gap-4">
                <SkillBar label="SYSTEM DESIGN" pct={92} />
                <SkillBar label="FRONTEND" pct={88} />
                <SkillBar label="BACKEND / API" pct={94} />
                <SkillBar label="DEVOPS" pct={76} />
                <SkillBar label="SECURITY" pct={70} />
              </div>
            </div>

            {/* Right: Timeline */}
            <div>
              <p className="font-['JetBrains_Mono',_sans-serif] text-[10.08px] text-[rgba(168,196,212,0.4)] tracking-[2px] uppercase mb-8">OPERATIONAL TIMELINE</p>
              <div className="flex flex-col">
                {timeline.map((item, i) => (
                  <TimelineEntry key={item.year} item={item} last={i === timeline.length - 1} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-px mx-8 bg-gradient-to-r from-transparent via-[#e8580a] to-transparent opacity-30" />

        {/* ── PROJECTS ── */}
        <section id="projects" className="px-8 py-24">
          <SectionLabel num="03" label="PROJECTS" />
          <h2 className="font-['Barlow_Condensed',_sans-serif] font-extrabold text-[48px] uppercase text-[#d6eaf8] leading-none mb-10">
            MISSIONI <span className="text-[#e8580a]">COMPLETATE</span>
          </h2>
          <div className="grid grid-cols-2 gap-5">
            {projects.map((p) => <ProjectCard key={p.num} p={p} />)}
          </div>
        </section>

        {/* Divider */}
        <div className="h-px mx-8 bg-gradient-to-r from-transparent via-[#e8580a] to-transparent opacity-30" />

        {/* ── SKILLS ── */}
        <section id="skills" className="px-8 py-24">
          <SectionLabel num="04" label="SKILLS" />
          <div className="grid grid-cols-4 gap-8">
            {skillCategories.map(({ label, skills }) => (
              <div key={label}>
                <p className="font-['JetBrains_Mono',_sans-serif] text-[9.6px] text-[#e8580a] tracking-[1.73px] uppercase mb-4">{label}</p>
                <div>
                  {skills.map(({ name, level }) => (
                    <SkillDot key={name} name={name} level={level} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="h-px mx-8 bg-gradient-to-r from-transparent via-[#e8580a] to-transparent opacity-30" />

        {/* ── CONTACT ── */}
        <section id="contact" className="px-8 py-24">
          <SectionLabel num="05" label="CONTACT" />
          <div className="grid grid-cols-2 gap-14">
            {/* Left */}
            <div>
              <h2 className="font-['Barlow_Condensed',_sans-serif] font-extrabold text-[50px] uppercase text-[#d6eaf8] leading-[0.95] mb-5">
                INIZIA LA<br /><span className="text-[#e8580a]">MISSIONE</span>
              </h2>
              <p className="font-['Outfit',_sans-serif] text-[16px] text-[rgba(168,196,212,0.68)] leading-[1.8] max-w-[440px] mb-8">
                Hai un progetto da sviluppare? Cerchi un developer affidabile per il tuo team? Invia un messaggio — rispondo entro 24 ore in orario CET.
              </p>

              {/* Encrypted channel badge */}
              <div
                className="border border-[rgba(168,196,212,0.12)] flex items-center gap-3 px-[18px] py-[14px] mb-7"
                style={{ background: "linear-gradient(172deg, rgba(168,196,212,0.04) 0%, rgba(13,14,26,0.96) 100%)" }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d={svgPaths.p6de1f80} stroke="#E8580A" strokeWidth="1.5" />
                  <path d={svgPaths.p3e58fd00} stroke="#E8580A" strokeLinecap="round" strokeWidth="1.5" />
                  <path d={svgPaths.p29100d00} fill="#E8580A" />
                </svg>
                <div>
                  <p className="font-['JetBrains_Mono',_sans-serif] text-[9.28px] text-[#e8580a] tracking-[1.3px] uppercase">ENCRYPTED CHANNEL</p>
                  <p className="font-['Outfit',_sans-serif] text-[12.48px] text-[rgba(168,196,212,0.5)]">Comunicazione end-to-end protetta · TLS 1.3</p>
                </div>
              </div>

              {/* Contact details */}
              <div className="flex flex-col gap-4">
                {[
                  { label: "EMAIL", value: "alex.kovacs@dev.io", sub: "Risposta < 24h" },
                  { label: "LINKEDIN", value: "/in/alexkovacs-dev", sub: "Profilo professionale" },
                  { label: "GITHUB", value: "github.com/alexkovacs", sub: "Repository pubblici" },
                ].map(({ label, value, sub }) => (
                  <div key={label} className="border-l-2 border-[#e8580a] pl-3">
                    <p className="font-['JetBrains_Mono',_sans-serif] text-[8.8px] text-[rgba(168,196,212,0.35)] tracking-[1.06px] uppercase">{label}</p>
                    <p className="font-['Outfit',_sans-serif] text-[14.72px] text-[#d6eaf8] mt-0.5">{value}</p>
                    <p className="font-['JetBrains_Mono',_sans-serif] text-[8.8px] text-[rgba(168,196,212,0.35)] tracking-[0.7px]">{sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div
              className="border border-[rgba(168,196,212,0.12)] p-8 relative"
              style={{ background: "linear-gradient(135deg, rgba(168,196,212,0.04) 0%, rgba(13,14,26,0.96) 100%)" }}
            >
              <div className="absolute border-l-2 border-t-2 border-[#e8580a] left-0 top-0 size-[14px]" />
              <div className="absolute border-b-2 border-r-2 border-[#e8580a] right-0 bottom-0 size-[14px]" />

              <p className="font-['JetBrains_Mono',_sans-serif] text-[10.08px] text-[#e8580a] tracking-[2.22px] uppercase mb-5">// INVIA MESSAGGIO</p>
              <div className="flex flex-col gap-5">
                {[
                  { label: "NOME OPERATIVO", placeholder: "Alex Rossi", type: "text" },
                  { label: "CANALE EMAIL", placeholder: "alex@example.com", type: "email" },
                ].map(({ label, placeholder, type }) => (
                  <div key={label}>
                    <p className="font-['JetBrains_Mono',_sans-serif] text-[9.6px] text-[#e8580a] tracking-[1.34px] uppercase mb-1.5">{label}</p>
                    <input
                      type={type}
                      placeholder={placeholder}
                      className="w-full bg-[rgba(6,6,15,0.85)] border border-[rgba(232,88,10,0.22)] px-3.5 py-2.5 font-['Outfit',_sans-serif] text-[14.4px] text-[rgba(214,234,248,0.5)] placeholder:text-[rgba(214,234,248,0.25)] outline-none focus:border-[rgba(232,88,10,0.5)] transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <p className="font-['JetBrains_Mono',_sans-serif] text-[9.6px] text-[#e8580a] tracking-[1.34px] uppercase mb-1.5">MESSAGGIO CIFRATO</p>
                  <textarea
                    placeholder="Descrivi il progetto o la collaborazione..."
                    rows={4}
                    className="w-full bg-[rgba(6,6,15,0.85)] border border-[rgba(232,88,10,0.22)] px-3.5 py-2.5 font-['Outfit',_sans-serif] text-[14.4px] text-[rgba(214,234,248,0.5)] placeholder:text-[rgba(214,234,248,0.25)] outline-none focus:border-[rgba(232,88,10,0.5)] transition-colors resize-none"
                  />
                </div>
                <button className="bg-[#e8580a] w-full py-3 font-['Barlow_Condensed',_sans-serif] font-bold text-[14.08px] text-white tracking-[1.97px] uppercase hover:bg-[#d14d09] transition-colors cursor-pointer">
                  INVIA TRASMISSIONE
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-[rgba(232,88,10,0.12)] bg-[rgba(6,6,15,0.85)] px-8 py-5">
          <div className="flex items-center justify-between">
            <p className="font-['JetBrains_Mono',_sans-serif] text-[9.6px] text-[rgba(168,196,212,0.28)] tracking-[0.96px]">© 2026 ALEX KOVACS — ALL SYSTEMS OPERATIONAL</p>
            <p className="font-['JetBrains_Mono',_sans-serif] text-[9.6px] text-[rgba(232,88,10,0.35)] tracking-[0.96px]">BUILT WITH PRECISION · REACT + VITE</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
