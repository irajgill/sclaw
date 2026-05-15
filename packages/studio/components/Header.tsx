'use client';

import { useEffect, useState } from 'react';
import { useStudioStore } from '../lib/store';
import { seedGraph } from '../lib/seed-graph';
import { connect, isWalletAvailable } from '../lib/wallet';

export function Header(): JSX.Element {
  const { reset, asGraph, wallet, setWallet, nodes, edges } = useStudioStore();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Wallet availability is window-only; defer that branch until after hydration
  // so the server (no window.ethereum) and the initial client render agree.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const agentCount = nodes.filter((n) => n.data.kind === 'agent').length;
  const nodeCount = nodes.length;
  const edgeCount = edges.length;

  function loadSeed(): void {
    reset(seedGraph());
  }
  function clear(): void {
    reset({ version: 1, nodes: [], edges: [] });
  }

  function downloadJson(): void {
    const graph = asGraph();
    const blob = new Blob([JSON.stringify(graph, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `claw-graph-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleConnect(): Promise<void> {
    setError(null);
    setBusy(true);
    try {
      const w = await connect();
      setWallet({ address: w.address, chainId: w.chainId });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function disconnect(): void {
    setWallet(null);
  }

  const walletAvailable = mounted && isWalletAvailable();
  const shortAddr = wallet ? `${wallet.address.slice(0, 6)}…${wallet.address.slice(-4)}` : '';

  return (
    <header className="studio-header">
      {/* Logo */}
      <div className="studio-logo">
        <div className="studio-logo-mark">✦</div>
        <div className="studio-logo-text">
          <span className="studio-logo-name">ZeroForge</span>
          <span className="studio-logo-sub">your sovereignclaw · builder</span>
        </div>
      </div>

      <div className="header-divider" />

      {/* Live graph stats */}
      <div className="header-stats">
        <div className="header-stat">
          <span>🧩</span>
          <span className="hs-val">{nodeCount}</span>
          <span>nodes</span>
        </div>
        <div className="header-stat">
          <span>🔗</span>
          <span className="hs-val">{edgeCount}</span>
          <span>edges</span>
        </div>
        <div className="header-stat">
          <span>🤖</span>
          <span className="hs-val">{agentCount}</span>
          <span>agents</span>
        </div>
      </div>

      {/* Actions */}
      <div className="header-actions">
        <button className="btn" onClick={loadSeed} title="Load 3-agent research swarm">
          <span className="btn-icon">✨</span>
          Load seed
        </button>

        <button className="btn ghost" onClick={clear} title="Clear canvas">
          <span className="btn-icon">🧹</span>
          Clear
        </button>

        <button className="btn ghost" onClick={downloadJson} title="Download graph.json">
          <span className="btn-icon">⬇</span>
          Export
        </button>

        <div className="header-divider" />

        {!mounted ? (
          // Stable placeholder so SSR and the first client paint match.
          <span className="pill neutral" style={{ fontSize: 10 }}>
            wallet
          </span>
        ) : wallet ? (
          <button
            className="wallet-chip"
            onClick={disconnect}
            title={`${wallet.address}\nchain ${wallet.chainId} · click to disconnect`}
          >
            <span className="wc-dot" />
            <span className="wc-addr">{shortAddr}</span>
            <span className="wc-chain">· {wallet.chainId}</span>
          </button>
        ) : walletAvailable ? (
          <button className="btn" onClick={handleConnect} disabled={busy}>
            {busy ? (
              <>
                <span className="spin">◌</span> Connecting…
              </>
            ) : (
              <>
                <span className="btn-icon">⬡</span> Connect wallet
              </>
            )}
          </button>
        ) : (
          <span className="pill neutral" style={{ fontSize: 10 }}>
            no wallet
          </span>
        )}
      </div>

      {/* Error toast */}
      {error && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 12,
            marginTop: 8,
            zIndex: 200,
            padding: '7px 12px',
            background: 'var(--pink-dim)',
            border: '1px solid rgba(255,92,138,0.3)',
            borderRadius: 'var(--r)',
            color: 'var(--pink)',
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
          }}
        >
          ⚠ {error}
          <button
            className="btn-icon"
            onClick={() => setError(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--pink)',
              cursor: 'pointer',
              fontSize: 11,
            }}
          >
            ✕
          </button>
        </div>
      )}
    </header>
  );
}
