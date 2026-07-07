export default function SectionLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--color-ash)] ${className}`}
    >
      <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-[var(--color-red)]" />
      {children}
    </span>
  );
}
