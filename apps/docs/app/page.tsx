import Link from 'next/link';
import { Footer, Header } from '@/components/Layout';

const SNIPPET_AGENT = `// Define an agent in ~20 lines
import { Agent, sealed0GInference } from '@sovereignclaw/core';
import { OG_Log, encrypted, deriveKekFromSigner } from '@sovereignclaw/memory';
import { reflectOnOutput } from '@sovereignclaw/reflection';

const kek = await deriveKekFromSigner(signer, 'research-claw-v1');
const research = new Agent({
  role: 'researcher',
  inference: sealed0GInference({
    model: 'qwen/qwen-2.5-7b-instruct',
    apiKey: process.env.COMPUTE_ROUTER_API_KEY!,
    verifiable: true,
  }),
  memory: encrypted(OG_Log({ namespace: 'research', ... }), { kek }),
  reflect: reflectOnOutput({ rounds: 1, rubric: 'accuracy' }),
});

await research.run('Summarize recent papers on retrieval-augmented agents.');`;

const SNIPPET_INFT = `// Mint an agent as an iNFT
import { mintAgentNFT } from '@sovereignclaw/inft';

const { tokenId, txHash, explorerUrl } = await mintAgentNFT({
  agent: research,
  owner: userWallet,
  royaltyBps: 500,           // 5% on every UsageRecorded event
  deployment,                // loaded once via loadDeployment()
});
console.log(\`token #\${tokenId} → \${explorerUrl}\`);`;

const SNIPPET_MESH = `// Wire a swarm with the unified MeshEvent surface
import { Mesh, sequentialPattern } from '@sovereignclaw/mesh';

const mesh = new Mesh({ meshId: 'income-team', provider: busProvider });
mesh.register(brain).register(strategist).register(opener).register(closer);

// One subscription, every signal — thinking tokens, tool chips, handoffs.
mesh.onEvent((e) => ui.handle(e));

await mesh.dispatch(
  'Find me a $10K AI consulting deal.',
  sequentialPattern({ agentNames: ['brain', 'strategist', 'opener', 'closer'] }),
);`;

const SNIPPET_REVOKE = `// Revoke memory in one call
import { revokeMemory } from '@sovereignclaw/inft';

await revokeMemory({ tokenId, owner: userWallet, oracle });
// On-chain wrappedDEK is zeroed irrevocably,
// MemoryRevocation registry is updated,
// the oracle refuses any future re-encryption for this token.
// Verifiable on chainscan-galileo.0g.ai. Phase 9 measured 1.5s end-to-end.`;

const SNIPPETS = [
  { id: 'agent', label: 'Define an agent', code: SNIPPET_AGENT },
  { id: 'inft', label: 'Mint as iNFT', code: SNIPPET_INFT },
  { id: 'mesh', label: 'Wire a swarm', code: SNIPPET_MESH },
  { id: 'revoke', label: 'Revoke memory', code: SNIPPET_REVOKE },
];

const WINS: Array<{ title: string; body: string }> = [
  {
    title: 'Sovereign by default',
    body: 'Encrypted memory wrapped under wallet-derived KEKs (AES-256-GCM + HKDF-SHA-256). Revocation is irreversible and on-chain — chainscan-verifiable.',
  },
  {
    title: 'TEE-verifiable inference',
    body: 'Streaming SSE over 0G Compute Router with verify_tee=true. Every InferenceResult carries the TEE attestation envelope and per-call billing.',
  },
  {
    title: 'iNFT lifecycle in one call',
    body: 'mintAgentNFT / transferAgentNFT / revokeMemory / recordUsage. ERC-7857 oracle wraps the DEK on transfer; the chain enforces revocation.',
  },
  {
    title: 'Swarms with one event subscription',
    body: 'mesh.onEvent(e => …) emits agent.thinking.token, agent.action.start, agent.handoff, task.complete. The streaming UI you want, free.',
  },
  {
    title: 'Visual builder ships in the box',
    body: 'ZeroForge drag-and-drop graph → sovereignclaw code → one-click iNFT deploy. The same code path the example uses.',
  },
];

export default function Home(): JSX.Element {
  return (
    <>
      <Header />
      <main>
        <section className="mx-auto max-w-6xl px-6 pt-24 pb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs uppercase tracking-widest font-bold mb-6 bg-[rgba(139,92,246,0.10)] border border-[rgba(139,92,246,0.28)] text-accent">
            ✦ Track 1 — agent framework on 0G
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
            Sovereign-memory, multi-agent, iNFT-native
            <br />
            <span className="bg-gradient-to-br from-[#ff8a3d] via-[#ec4899] to-[#8b5cf6] bg-clip-text text-transparent">
              framework for 0G.
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted max-w-3xl leading-relaxed">
            Five composable npm packages. Encrypted memory revocable on-chain. Streaming
            TEE-verified inference. ERC-7857 iNFT lifecycle. Reflection loops. Visual builder.
            <span className="text-text font-semibold"> Working agent in under 10 minutes.</span>
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/quickstart"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-br from-[#ff8a3d] via-[#ec4899] to-[#8b5cf6] shadow-[0_12px_28px_rgba(236,72,153,0.32)] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(236,72,153,0.42)] transition-all duration-200"
            >
              Quickstart →
            </Link>
            <a
              href="https://github.com/irajgill/sclaw"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full bg-surface border border-border-2 px-6 py-3.5 text-sm font-semibold hover:-translate-y-0.5 hover:border-accent hover:text-accent transition-all duration-200 shadow-[0_4px_14px_rgba(124,92,255,0.08)]"
            >
              GitHub
            </a>
            <a
              href="https://oracle-production-5db4.up.railway.app/healthz"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full bg-surface border border-border-2 px-6 py-3.5 text-sm font-semibold hover:-translate-y-0.5 hover:border-accent hover:text-accent transition-all duration-200 shadow-[0_4px_14px_rgba(124,92,255,0.08)]"
            >
              Live oracle
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="rounded-2xl border border-border bg-surface/80 overflow-hidden shadow-[0_12px_40px_rgba(124,92,255,0.10)]">
            <div className="flex flex-wrap border-b border-border bg-surface-2/60">
              {SNIPPETS.map((s, i) => (
                <a
                  key={s.id}
                  href={`#snippet-${s.id}`}
                  className={`px-5 py-3.5 text-sm font-semibold border-r border-border transition-colors ${
                    i === 0 ? 'text-accent bg-surface' : 'text-muted hover:text-accent hover:bg-surface'
                  }`}
                >
                  {s.label}
                </a>
              ))}
            </div>
            <div className="grid md:grid-cols-1 gap-0">
              {SNIPPETS.map((s) => (
                <div
                  key={s.id}
                  id={`snippet-${s.id}`}
                  className="p-6 border-b border-border last:border-0"
                >
                  <div className="text-xs uppercase tracking-widest text-accent font-bold mb-3">
                    {s.label}
                  </div>
                  <pre>
                    <code>{s.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20">
          <h2 className="text-3xl font-extrabold mb-8 bg-gradient-to-br from-[#ff8a3d] via-[#ec4899] to-[#8b5cf6] bg-clip-text text-transparent inline-block">
            Why ZeroForge
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {WINS.map((w, i) => {
              const tones = [
                'from-[#ff8a3d]/12 to-[#ec4899]/12 border-[rgba(255,138,61,0.25)]',
                'from-[#ec4899]/12 to-[#8b5cf6]/12 border-[rgba(236,72,153,0.25)]',
                'from-[#8b5cf6]/12 to-[#0ab7e6]/12 border-[rgba(139,92,246,0.25)]',
                'from-[#0ab7e6]/12 to-[#1fbf7a]/12 border-[rgba(10,183,230,0.25)]',
                'from-[#1fbf7a]/12 to-[#f5b942]/12 border-[rgba(31,191,122,0.25)]',
              ];
              const tone = tones[i % tones.length];
              return (
                <div
                  key={w.title}
                  className={`rounded-2xl border bg-gradient-to-br ${tone} bg-surface p-6 shadow-[0_6px_20px_rgba(124,92,255,0.06)] hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(124,92,255,0.14)] transition-all duration-200`}
                >
                  <div className="text-text font-bold text-base mb-2">{w.title}</div>
                  <div className="text-muted text-sm leading-relaxed">{w.body}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <h2 className="text-3xl font-extrabold mb-3 text-text">Live on 0G Galileo Testnet</h2>
          <p className="text-muted mb-6">
            Real contracts, real iNFT mints, real TEE-attested inference. Click through and verify
            on chainscan.
          </p>
          <div className="rounded-2xl border border-border bg-surface overflow-x-auto shadow-[0_8px_28px_rgba(124,92,255,0.08)]">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Network</td>
                  <td className="font-mono text-xs">0G Galileo Testnet (chainId 16602)</td>
                </tr>
                <tr>
                  <td>AgentNFT</td>
                  <td className="font-mono text-xs">
                    <a
                      href="https://chainscan-galileo.0g.ai/address/0xc3f997545da4AA8E70C82Aab82ECB48722740601"
                      className="underline text-accent-2"
                      target="_blank"
                      rel="noreferrer"
                    >
                      0xc3f997545da4AA8E70C82Aab82ECB48722740601
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>MemoryRevocation</td>
                  <td className="font-mono text-xs">
                    <a
                      href="https://chainscan-galileo.0g.ai/address/0x735084C861E64923576D04d678bA2f89f6fbb6AC"
                      className="underline text-accent-2"
                      target="_blank"
                      rel="noreferrer"
                    >
                      0x735084C861E64923576D04d678bA2f89f6fbb6AC
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Dev oracle</td>
                  <td className="font-mono text-xs">
                    <a
                      href="https://oracle-production-5db4.up.railway.app/healthz"
                      className="underline text-accent-2"
                      target="_blank"
                      rel="noreferrer"
                    >
                      oracle-production-5db4.up.railway.app
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>npm scope</td>
                  <td className="font-mono text-xs">
                    <a
                      href="https://www.npmjs.com/org/sovereignclaw"
                      className="underline text-accent-2"
                      target="_blank"
                      rel="noreferrer"
                    >
                      @sovereignclaw/{'{core,memory,mesh,inft,reflection}'}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
