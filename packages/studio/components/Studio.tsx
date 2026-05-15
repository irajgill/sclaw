'use client';

import { useEffect, type ReactNode } from 'react';
import { Handle, Position, ReactFlowProvider, type NodeProps } from 'reactflow';
import type {
  AgentNodeData,
  InferenceNodeData,
  MemoryNodeData,
  MeshNodeData,
  NodeKind,
  ReflectionNodeData,
  StudioNodeData,
  ToolNodeData,
} from '../lib/types';
import { useStudioStore } from '../lib/store';
import { seedGraph } from '../lib/seed-graph';
import { NodePalette } from './NodePalette';
import { Canvas } from './Canvas';
import { Inspector } from './Inspector';
import { CodePreview } from './CodePreview';
import { DeployPanel } from './DeployPanel';
import { Header } from './Header';

/* ─── Per-kind visual config ─────────────────────────────────────────── */
const KIND_CONFIG: Record<
  NodeKind,
  {
    icon: string;
    label: string;
    badge: string;
    gradient: string;
  }
> = {
  memory: {
    icon: '🗄️',
    label: 'MEMORY',
    badge: '0G Log',
    gradient: 'linear-gradient(90deg, #b06fff, #6baeff)',
  },
  inference: {
    icon: '🧠',
    label: 'INFERENCE',
    badge: 'TEE',
    gradient: 'linear-gradient(90deg, #00d9ff, #00ff88)',
  },
  tool: {
    icon: '🔧',
    label: 'TOOL',
    badge: 'action',
    gradient: 'linear-gradient(90deg, #ff9544, #ffd166)',
  },
  reflection: {
    icon: '🔄',
    label: 'REFLECTION',
    badge: 'self-critique',
    gradient: 'linear-gradient(90deg, #00ff88, #00d9ff)',
  },
  agent: {
    icon: '🤖',
    label: 'AGENT',
    badge: 'iNFT',
    gradient: 'linear-gradient(90deg, #ff5c8a, #b06fff)',
  },
  mesh: {
    icon: '🕸️',
    label: 'MESH',
    badge: 'swarm',
    gradient: 'linear-gradient(90deg, #ffd166, #ff9544)',
  },
};

/* ─── Stat row helpers ───────────────────────────────────────────────── */
// Inline-style fallbacks mirror globals.css so layout holds even if a
// cached/older stylesheet is served — the dimensions must not collapse.
function NodeStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className="sc-node-stat-row"
      style={{
        display: 'grid',
        gridTemplateColumns: '92px 1fr',
        columnGap: 14,
        alignItems: 'baseline',
        padding: '12px 0 12px 16px',
        position: 'relative',
      }}
    >
      <span
        className="sc-node-stat-label"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--ink-3)',
          lineHeight: 1.2,
        }}
      >
        {label}
      </span>
      <span
        className={`sc-node-stat-value${accent ? ' accent' : ''}`}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          fontWeight: accent ? 700 : 600,
          color: accent ? 'var(--node-accent, var(--purple))' : 'var(--ink)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textAlign: 'right',
          minWidth: 0,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function NodeTag({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={`sc-node-tag${active ? ' active' : ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '7px 13px',
        borderRadius: 999,
        fontSize: 11.5,
        fontFamily: 'var(--font-mono)',
        fontWeight: active ? 700 : 600,
        lineHeight: 1,
      }}
    >
      {children}
    </span>
  );
}

/* ─── Node body builders per kind ────────────────────────────────────── */
function MemoryBody({ data }: { data: MemoryNodeData }) {
  return (
    <>
      <div
        className="sc-node-body"
        style={{
          padding: '18px 22px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        <NodeStat label="namespace" value={data.namespace} accent />
        <NodeStat label="storage" value="0G Log" />
      </div>
      <div
        className="sc-node-footer"
        style={{
          padding: '16px 22px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          borderTop: '1px solid var(--border)',
        }}
      >
        <NodeTag active={data.encrypted}>🔒 encrypted</NodeTag>
        <NodeTag>append-only</NodeTag>
        <NodeTag>sovereign</NodeTag>
      </div>
    </>
  );
}

function InferenceBody({ data }: { data: InferenceNodeData }) {
  const shortModel = data.model.split('/').pop() ?? data.model;
  return (
    <>
      <div
        className="sc-node-body"
        style={{
          padding: '18px 22px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        <NodeStat label="model" value={shortModel} accent />
        <NodeStat label="route" value="0G Router" />
        {data.providerAddress && (
          <NodeStat label="provider" value={`${data.providerAddress.slice(0, 8)}…`} />
        )}
      </div>
      <div
        className="sc-node-footer"
        style={{
          padding: '16px 22px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          borderTop: '1px solid var(--border)',
        }}
      >
        <NodeTag active={data.verifiable}>✓ TEE verified</NodeTag>
        <NodeTag>OpenAI compat</NodeTag>
      </div>
    </>
  );
}

function ToolBody({ data }: { data: ToolNodeData }) {
  const kindIcons: Record<string, string> = { http: '🌐', onchain: '⛓️', file: '📄' };
  return (
    <>
      <div
        className="sc-node-body"
        style={{
          padding: '18px 22px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        <NodeStat label="name" value={data.toolName} accent />
        <NodeStat label="kind" value={data.toolKind} />
      </div>
      <div
        className="sc-node-footer"
        style={{
          padding: '16px 22px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          borderTop: '1px solid var(--border)',
        }}
      >
        <NodeTag active>
          {kindIcons[data.toolKind] ?? '⚙'} {data.toolKind}
        </NodeTag>
        <NodeTag>v0 scaffold</NodeTag>
      </div>
    </>
  );
}

function ReflectionBody({ data }: { data: ReflectionNodeData }) {
  const rubricName = typeof data.rubric === 'string' ? data.rubric : data.rubric.name;
  return (
    <>
      <div
        className="sc-node-body"
        style={{
          padding: '18px 22px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        <NodeStat label="rubric" value={rubricName} accent />
        <NodeStat label="rounds" value={String(data.rounds)} />
        <NodeStat label="threshold" value={String(data.threshold)} />
      </div>
      <div
        className="sc-node-footer"
        style={{
          padding: '16px 22px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          borderTop: '1px solid var(--border)',
        }}
      >
        <NodeTag active={data.critic === 'self'}>👤 self-critique</NodeTag>
        <NodeTag active={data.persistLearnings}>💾 learnings</NodeTag>
      </div>
    </>
  );
}

function AgentBody({ data }: { data: AgentNodeData }) {
  const preview = data.systemPrompt.trim().slice(0, 58);
  return (
    <>
      <div
        className="sc-node-body"
        style={{
          padding: '18px 22px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        <NodeStat label="role" value={data.role} accent />
        {preview && (
          <div className="sc-node-description">
            {preview}
            {data.systemPrompt.length > 58 ? '…' : ''}
          </div>
        )}
      </div>
      <div
        className="sc-node-footer"
        style={{
          padding: '16px 22px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          borderTop: '1px solid var(--border)',
        }}
      >
        <NodeTag active>🪙 mints iNFT</NodeTag>
        <NodeTag>ERC-7857</NodeTag>
      </div>
    </>
  );
}

function MeshBody({ data }: { data: MeshNodeData }) {
  const taskPreview = data.task.slice(0, 55);
  return (
    <>
      <div
        className="sc-node-body"
        style={{
          padding: '18px 22px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        <NodeStat label="id" value={data.meshId} accent />
        <NodeStat label="pattern" value={data.pattern} />
        <NodeStat label="rounds" value={`≤${data.maxRounds}`} />
        {taskPreview && (
          <div className="sc-node-description">
            {taskPreview}
            {data.task.length > 55 ? '…' : ''}
          </div>
        )}
      </div>
      <div
        className="sc-node-footer"
        style={{
          padding: '16px 22px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          borderTop: '1px solid var(--border)',
        }}
      >
        <NodeTag active>⚡ orchestrator</NodeTag>
        <NodeTag>0G Log bus</NodeTag>
        <NodeTag>th {data.acceptThreshold}</NodeTag>
      </div>
    </>
  );
}

/* ─── Main node component ────────────────────────────────────────────── */
export function StudioFlowNode(props: NodeProps<StudioNodeData>): JSX.Element {
  const { data, selected } = props;
  const cfg = KIND_CONFIG[data.kind];

  const title = (() => {
    switch (data.kind) {
      case 'memory':
        return (data as MemoryNodeData).namespace;
      case 'inference':
        return (data as InferenceNodeData).model.split('/').pop() ?? 'model';
      case 'tool':
        return (data as ToolNodeData).toolName;
      case 'reflection': {
        const r = (data as ReflectionNodeData).rubric;
        return typeof r === 'string' ? r : r.name;
      }
      case 'agent':
        return (data as AgentNodeData).role;
      case 'mesh':
        return (data as MeshNodeData).meshId;
    }
  })();

  return (
    <div
      className={`sc-node sc-node--${data.kind}${selected ? ' selected' : ''}`}
      style={{
        width: 340,
        background: '#ffffff',
        borderRadius: 22,
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Animated top gradient line */}
      <div
        className="sc-node-glow-bar"
        style={{
          background: cfg.gradient,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          borderRadius: '22px 22px 0 0',
          zIndex: 2,
        }}
      />

      {/* Left target handle */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#ffffff',
          border: '2px solid rgba(139, 92, 246, 0.55)',
          width: 14,
          height: 14,
          left: -8,
        }}
      />

      {/* Header — explicit Grid: icon | meta | status dot */}
      <div
        className="sc-node-header"
        style={{
          display: 'grid',
          gridTemplateColumns: '64px 1fr 14px',
          columnGap: 16,
          alignItems: 'center',
          padding: '22px 22px 20px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          className="sc-node-icon-wrap"
          style={{
            width: 60,
            height: 60,
            borderRadius: 18,
            display: 'grid',
            placeItems: 'center',
            fontSize: 30,
            lineHeight: 1,
            background: cfg.gradient,
            boxShadow: '0 12px 26px rgba(124, 92, 255, 0.28), inset 0 1.5px 0 rgba(255,255,255,0.55), inset 0 -2px 0 rgba(34,28,61,0.08)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {cfg.icon}
        </div>
        <div
          className="sc-node-meta"
          style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}
        >
          <div className="sc-node-kind">{cfg.label}</div>
          <div
            className="sc-node-title"
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: 'var(--ink)',
              letterSpacing: '-0.015em',
              lineHeight: 1.25,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {title}
          </div>
        </div>
        <div className="sc-node-header-dot" aria-hidden />
      </div>

      {/* Per-kind body */}
      {data.kind === 'memory' && <MemoryBody data={data as MemoryNodeData} />}
      {data.kind === 'inference' && <InferenceBody data={data as InferenceNodeData} />}
      {data.kind === 'tool' && <ToolBody data={data as ToolNodeData} />}
      {data.kind === 'reflection' && <ReflectionBody data={data as ReflectionNodeData} />}
      {data.kind === 'agent' && <AgentBody data={data as AgentNodeData} />}
      {data.kind === 'mesh' && <MeshBody data={data as MeshNodeData} />}

      {/* Right source handle */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#ffffff',
          border: '2px solid rgba(236, 72, 153, 0.65)',
          width: 14,
          height: 14,
          right: -8,
        }}
      />
    </div>
  );
}

export const nodeTypes = {
  memory: StudioFlowNode,
  inference: StudioFlowNode,
  tool: StudioFlowNode,
  reflection: StudioFlowNode,
  agent: StudioFlowNode,
  mesh: StudioFlowNode,
};

/* ─── Top-level Studio shell ─────────────────────────────────────────── */
export function Studio(): JSX.Element {
  const { nodes, reset } = useStudioStore();

  useEffect(() => {
    if (nodes.length === 0) {
      reset(seedGraph());
    }
  }, [nodes.length, reset]);

  return (
    <div className="studio-shell">
      <Header />
      <div className="studio-main">
        <NodePalette />
        <ReactFlowProvider>
          <Canvas />
        </ReactFlowProvider>
        <div className="right-col">
          <Inspector />
          <CodePreview />
          <DeployPanel />
        </div>
      </div>
    </div>
  );
}
