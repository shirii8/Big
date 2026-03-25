import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] pt-16 pb-8 px-6 md:px-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16 mb-12">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="font-display text-[36px] tracking-[4px] text-acid no-underline cursor-none block mb-4 leading-none">
            TESSCH<span className="text-chrome">.</span>
          </Link>
          <p className="text-[13px] text-muted leading-relaxed max-w-[260px] mb-5">
            Modular sneakers. Community first, brand second. Built for the youth who want smarter, not just cheaper.
          </p>
          <div className="flex gap-3">
            {['𝕏', '▶', '📷', '🎵'].map((icon, i) => (
              <a key={i} href="https://instagram.com/tesschstore" target="_blank" rel="noreferrer"
                className="w-9 h-9 border border-white/[0.08] flex items-center justify-center text-muted text-sm no-underline cursor-none transition-all hover:border-acid hover:text-acid">
                {icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-mono text-[9px] tracking-[3px] uppercase text-acid mb-5">Shop</h4>
          <ul className="list-none flex flex-col gap-3">
            {[['All Drops','/products'],['Void Runner X1','/products'],['Acid Flux Low','/products'],['Chrome Ghost Mid','/products'],['Accessories','/products']].map(([label, href]) => (
              <li key={label}><Link href={href} className="text-[13px] text-muted no-underline cursor-none hover:text-chrome transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-[9px] tracking-[3px] uppercase text-acid mb-5">Culture</h4>
          <ul className="list-none flex flex-col gap-3">
            {[['Our Story','/about'],['How It Works','/how-it-works'],['AR View','/ar-view'],['Drop 001','/drop'],['Instagram','https://instagram.com/tesschstore']].map(([label, href]) => (
              <li key={label}><Link href={href} className="text-[13px] text-muted no-underline cursor-none hover:text-chrome transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-[9px] tracking-[3px] uppercase text-acid mb-5">Support</h4>
          <ul className="list-none flex flex-col gap-3">
            {['Size Guide','Track Order','Returns','FAQ','Contact'].map((label) => (
              <li key={label}><a href="#" className="text-[13px] text-muted no-underline cursor-none hover:text-chrome transition-colors">{label}</a></li>
            ))}
          </ul>
          <div className="mt-6 pt-5 border-t border-white/[0.05]">
            <p className="font-mono text-[9px] tracking-[2px] uppercase text-muted mb-1">Investor Enquiries</p>
            <a href="mailto:hello@tessch.in" className="text-[12px] text-acid no-underline cursor-none hover:text-white transition-colors">hello@tessch.in</a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.04] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-mono text-[9px] text-muted tracking-[1px]">© {new Date().getFullYear()} TESSCH — TESSCH.IN — ALL RIGHTS RESERVED</p>
        <p className="shriya-credit">Created by — Shriya</p>
        <div className="flex gap-4">
          {['Privacy','Terms','Cookies'].map((label) => (
            <a key={label} href="#" className="font-mono text-[9px] text-muted no-underline cursor-none hover:text-chrome transition-colors tracking-[1px]">{label}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}