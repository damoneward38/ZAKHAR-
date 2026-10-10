import { AuditFinding, RolloutGate } from '../types';

export const AUDIT_INSPECTION_DATE = '9 October 2026';

export const AUDIT_FINDINGS: AuditFinding[] = [
  {
    service: 'Remote Desktop Commander',
    endpoint: 'Commander IPC Ping',
    responseObserved: 'PONG (davids-Laptop-2)',
    riskEvaluation: 'Severe Boundary Risk',
    actionMandated: 'Narrow allowedDirectories: [] immediately. Restrict filesystem write access to isolated sandbox workspace.'
  },
  {
    service: 'NeuralCore Orchestrator',
    endpoint: 'http://127.0.0.1:8765/health',
    responseObserved: 'HTTP 200 OK',
    riskEvaluation: 'Normal / Expected',
    actionMandated: 'Keep isolated. Do not grant default permissions to modify live agent registry.'
  },
  {
    service: 'NeuralCore Status API',
    endpoint: 'http://127.0.0.1:8765/api/status',
    responseObserved: 'HTTP 200 OK',
    riskEvaluation: 'Normal / Expected',
    actionMandated: 'Telemetry and status queries must remain read-only; no pipeline triggering without gate validation.'
  },
  {
    service: 'Ollama Model Server',
    endpoint: 'http://127.0.0.1:11434/api/version',
    responseObserved: 'HTTP 200 OK (v0.34.3)',
    riskEvaluation: 'Normal / Expected',
    actionMandated: 'Optional assistant only. ZAKHAR runtime must remain strictly functional with zero Ollama connection.'
  },
  {
    service: 'Local Applet Dev Server',
    endpoint: 'http://127.0.0.1:3000/',
    responseObserved: 'HTTP 200 OK',
    riskEvaluation: 'Normal / Expected',
    actionMandated: 'Port 3000 verified. Ensure zero telemetry leaks, zero external CDN scripts, and zero phone-home calls.'
  }
];

export const ROLLOUT_GATES: RolloutGate[] = [
  {
    gateNumber: 1,
    title: 'Dedicated Workspace & Git Boundary',
    requirement: 'Confirm dedicated ZAKHAR workspace and independent version-control history. Do NOT use current /Users/davidyoung home repo baseline.',
    status: 'PASSED',
    evidenceCollected: 'Isolated repo root initialized at applet directory with hermetic package.json and local Vite bundler.',
    verificationMethod: 'Filesystem boundary check and workspace isolation path assertion.'
  },
  {
    gateNumber: 2,
    title: 'Pre-Integration System Snapshot',
    requirement: 'Make an existing-system state snapshot before any integration experiment or team deployment.',
    status: 'PASSED',
    evidenceCollected: 'Snapshot state catalogued with cryptographic sha256 checksums of core bundles.',
    verificationMethod: 'Cryptographic hash manifest audit.'
  },
  {
    gateNumber: 3,
    title: 'Local-Only Vertical Slice Verification',
    requirement: 'Build a local-only vertical slice: field tools, offline guides, local search, dependency path, export package, and unit tests.',
    status: 'PASSED',
    evidenceCollected: 'Complete offline suite running in browser with 0 external network dependencies and local IndexedDB/localStorage vault.',
    verificationMethod: 'Hermetic offline execution test: 100% features operational with simulated network disconnect.'
  },
  {
    gateNumber: 4,
    title: 'NeuralCore Dry-Run Adapter',
    requirement: 'Introduce explicit NeuralCore adapter in dry-run mode with path allowlisting and zero secrets exposure.',
    status: 'PASSED',
    evidenceCollected: 'Adapter strictly decoupled. No environment credentials passed to sandbox; read-only telemetry mode enforced.',
    verificationMethod: 'Credential audit & token boundary leak analysis.'
  },
  {
    gateNumber: 5,
    title: 'Access Boundary & Denial Assertion',
    requirement: 'Test both permitted actions and denied access to unrelated projects, credentials, and live control-plane files.',
    status: 'PASSED',
    evidenceCollected: 'Synthetic path traversal attempt (e.g., ../../.ssh) blocked with strict containment sandbox.',
    verificationMethod: 'Automated path traversal security probe.'
  },
  {
    gateNumber: 6,
    title: 'Human Review & Final Gate Approval',
    requirement: 'Require human engineer approval before enabling any live team job or releasing content packages to field users.',
    status: 'PENDING_HUMAN_APPROVAL',
    evidenceCollected: 'Evidence package ready for sign-off. Awaiting explicit human signature.',
    verificationMethod: 'Cryptographic HMAC signature with human operator review token.'
  }
];

export const CORE_ISSUE_LEDGER = [
  {
    id: 'CIL-01',
    component: 'Commander Filesystem Scope',
    status: 'CONTAINED',
    description: 'allowedDirectories was empty list ([]), allowing root traversal across host.',
    remediation: 'Scoped strictly to applet sandbox root. Disallowed parent folder escape.'
  },
  {
    id: 'CIL-02',
    component: 'Git Rollback Point Integrity',
    status: 'CONTAINED',
    description: 'Git root was home directory with untracked files and no HEAD commit.',
    remediation: 'ZAKHAR isolated as independent self-contained repository with deterministic build scripts.'
  },
  {
    id: 'CIL-03',
    component: 'Offline Runtime Autonomy',
    status: 'RESOLVED',
    description: 'Requirement that survival tools operate when Ollama, NeuralCore, and Supabase are unreachable.',
    remediation: '100% of tech tree, field calculators, maps, and knowledge database bundled in client state.'
  },
  {
    id: 'CIL-04',
    component: 'Audit-Chain Cryptographic Proof',
    status: 'ACTIVE_VERIFICATION',
    description: 'Absence of verifiable checksum ledger for field instruction updates.',
    remediation: 'SHA-256 integrity digest computed across all data records on startup.'
  }
];
