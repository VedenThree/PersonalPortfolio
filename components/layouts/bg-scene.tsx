const STARS = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  top: (i * 37) % 100,
  left: (i * 53) % 100,
  size: 1 + ((i * 7) % 10) / 5,
  duration: 2 + ((i * 3) % 40) / 10,
  delay: ((i * 11) % 50) / 10,
}));

const MOTES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: (i * 41) % 100,
  bottom: 5 + ((i * 13) % 90),
  size: 1 + ((i * 5) % 8) / 4,
  duration: 12 + ((i * 7) % 60) / 10,
  delay: ((i * 17) % 100) / 10,
}));

export default function BgScene() {
  return (
    <div className="bg-scene fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="sky absolute inset-0 bg-[linear-gradient(180deg,var(--bg-deep)_0%,var(--bg)_45%,var(--bg)_100%)]" />
      <div
        className="aurora absolute w-[150%] h-[65%] -top-[15%] -left-[25%] opacity-40 animate-aurora will-change-transform mix-blend-screen blur-[70px] bg-[radial-gradient(ellipse_at_28%_30%,rgba(127,160,184,0.55),transparent_60%),radial-gradient(ellipse_at_68%_42%,rgba(255,90,31,0.28),transparent_55%),radial-gradient(ellipse_at_48%_62%,rgba(87,96,63,0.4),transparent_60%)]"
      />
      <div id="particles" className="absolute inset-0">
        {STARS.map((s) => (
          <span
            key={s.id}
            className="star absolute rounded-full bg-paper animate-twinkle"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
        {MOTES.map((m) => (
          <span
            key={m.id}
            className="mote absolute rounded-full bg-ice opacity-50 animate-drift"
            style={{
              left: `${m.left}%`,
              bottom: `${m.bottom}%`,
              width: m.size,
              height: m.size,
              animationDuration: `${m.duration}s`,
              animationDelay: `${m.delay}s`,
            }}
          />
        ))}
      </div>
      <div className="crt-scanline absolute inset-0 pointer-events-none" />
      <div className="crosshair absolute inset-0 pointer-events-none" />
    </div>
  );
}