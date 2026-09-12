export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 bg-surface backdrop-blur-[8px] border-b border-line">
      <div className="flex items-center justify-between px-8 py-[18px] max-w-[1180px] mx-auto">
        <div className="flex items-center gap-2.5">
          <span className="w-2.25 h-2.25 rounded-[1px] bg-orange rotate-45 shrink-0 animate-pulse-glow mr-2" />
          <span className="text-[15px] tracking-[0.02em] text-paper font-medium font-mono">
            FD / 01
          </span>
        </div>
        <nav>
          <ul className="flex gap-[34px] list-none">
            <li>
              <a
                href="#lavori"
                className="text-ice no-underline text-[13.5px] font-mono tracking-[0.02em] transition-colors hover:text-orange"
              >
                Progetti
              </a>
            </li>
            <li>
              <a
                href="#profilo"
                className="text-ice no-underline text-[13.5px] font-mono tracking-[0.02em] transition-colors hover:text-orange"
              >
                Profilo
              </a>
            </li>
            <li>
              <a
                href="#contatti"
                className="text-ice no-underline text-[13.5px] font-mono tracking-[0.02em] transition-colors hover:text-orange"
              >
                Contatti
              </a>
            </li>
          </ul>
        </nav>
        <a
          href="#contatti"
          className="border border-orange text-orange rounded text-[12px] font-mono tracking-[0.02em] px-[18px] py-[9px] transition-colors hover:bg-orange hover:text-[#0a0e13]"
        >
          CV ↓
        </a>
      </div>
    </header>
  );
}