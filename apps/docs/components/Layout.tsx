import Link from 'next/link';
import type { ReactNode } from 'react';

const NAV: Array<{ href: string; label: string }> = [
  { href: '/quickstart', label: 'Quickstart' },
  { href: '/architecture', label: 'Architecture' },
  { href: '/primitives/memory', label: 'Memory' },
  { href: '/primitives/mesh', label: 'Mesh' },
  { href: '/primitives/inft', label: 'iNFT' },
  { href: '/primitives/reflection', label: 'Reflection' },
  { href: '/primitives/streaming', label: 'Streaming' },
  { href: '/benchmarks', label: 'Benchmarks' },
  { href: '/security', label: 'Security' },
  { href: '/contracts', label: 'Contracts' },
];

export function Header(): JSX.Element {
  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-30 shadow-[0_4px_18px_rgba(124,92,255,0.06)]">
      <div className="mx-auto max-w-7xl flex items-center gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 tracking-tight text-lg group">
          <span className="grid place-items-center h-8 w-8 rounded-xl text-white text-sm font-bold shadow-[0_6px_14px_rgba(236,72,153,0.32)] bg-gradient-to-br from-[#ff8a3d] via-[#ec4899] to-[#8b5cf6] transition-transform group-hover:scale-105">
            ✦
          </span>
          <span className="font-extrabold bg-gradient-to-br from-[#ff8a3d] via-[#ec4899] to-[#8b5cf6] bg-clip-text text-transparent">
            ZeroForge
          </span>
          <span className="hidden sm:inline text-xs font-medium text-muted">
            your sovereignclaw
          </span>
        </Link>
        <nav className="hidden md:flex gap-5 text-sm text-muted">
          <Link href="/quickstart" className="hover:text-accent transition-colors">
            Docs
          </Link>
          <a
            href="https://github.com/irajgill/sclaw"
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/@sovereignclaw/core"
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent transition-colors"
          >
            npm
          </a>
        </nav>
        <span className="ml-auto inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-success bg-[rgba(31,191,122,0.12)] border border-[rgba(31,191,122,0.3)]">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          Live on 0G Galileo
        </span>
      </div>
    </header>
  );
}

export function Sidebar({ active }: { active?: string }): JSX.Element {
  return (
    <aside className="hidden md:block w-64 shrink-0 border-r border-border min-h-[calc(100vh-65px)] bg-surface/40">
      <nav className="flex flex-col p-6 text-sm gap-1.5">
        {NAV.map((item) => {
          const isActive = active === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                'rounded-lg px-3.5 py-2 transition-all duration-150 font-medium ' +
                (isActive
                  ? 'bg-gradient-to-r from-[rgba(236,72,153,0.10)] to-[rgba(139,92,246,0.10)] text-accent border border-[rgba(139,92,246,0.22)] shadow-[0_2px_8px_rgba(139,92,246,0.08)]'
                  : 'text-muted hover:bg-surface-2 hover:text-accent border border-transparent')
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function Footer(): JSX.Element {
  return (
    <footer className="mt-24 border-t border-border bg-surface/60">
      <div className="mx-auto max-w-7xl px-6 py-12 text-sm text-muted flex flex-wrap gap-8 justify-between">
        <div>
          <div className="font-extrabold text-lg mb-2 bg-gradient-to-br from-[#ff8a3d] via-[#ec4899] to-[#8b5cf6] bg-clip-text text-transparent">
            ZeroForge, your sovereignclaw
          </div>
          <div>Apache-2.0 licensed.</div>
          <div className="mt-1">
            Built on 0G — Storage Log, Compute Router, EVM chain, ERC-7857.
          </div>
        </div>
        <div className="flex gap-6 items-start">
          <a
            href="https://github.com/irajgill/sclaw"
            className="hover:text-accent transition-colors font-medium"
          >
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/org/sovereignclaw"
            className="hover:text-accent transition-colors font-medium"
          >
            npm
          </a>
          <a
            href="https://chainscan-galileo.0g.ai"
            className="hover:text-accent transition-colors font-medium"
          >
            Chainscan
          </a>
          <a
            href="https://faucet.0g.ai"
            className="hover:text-accent transition-colors font-medium"
          >
            Faucet
          </a>
        </div>
      </div>
    </footer>
  );
}

export function DocsLayout({
  children,
  active,
}: {
  children: ReactNode;
  active?: string;
}): JSX.Element {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl flex">
        <Sidebar active={active} />
        <main className="flex-1 px-6 py-12 md:px-12">
          <article className="prose">{children}</article>
        </main>
      </div>
      <Footer />
    </>
  );
}
