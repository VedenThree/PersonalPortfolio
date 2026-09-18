export default function SkillDot({ name, level }: { name: string; level: number }) {
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