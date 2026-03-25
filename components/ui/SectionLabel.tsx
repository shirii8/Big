export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[10px] tracking-[4px] uppercase text-acid mb-4">
      <span>— {children}</span>
      <span className="flex-1 h-px bg-acid/15" />
    </div>
  )
}