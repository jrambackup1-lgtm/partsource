export type PilotConfigurationRecord = {
  id: string;
  family: 'socket' | 'hex' | 'rounded';
  type: string;
  thread: string;
  pitch: string;
  length: string;
  head: string;
  drive: string;
  material: string;
  finish: string;
  strength: string;
  standard: string;
  mcmaster?: string;
  sourceSku: string;
  demo: true;
  synthetic: true;
  provenanceKind: 'internal-demo-seed';
  provenanceNote: string;
  verification: 'demo-only';
  offers?: never;
};

export const PILOT_CONFIGURATION_PACKET: PilotConfigurationRecord[] = [
  {
    id: 'PILOT-SHCS-M4X20-A2-ISO4762',
    family: 'socket',
    type: 'Socket Head Cap Screw',
    thread: 'M4',
    pitch: '0.7 mm',
    length: '20 mm',
    head: 'Socket',
    drive: 'Hex',
    material: '18-8 Stainless Steel',
    finish: 'Plain',
    strength: 'A2 stainless demo configuration',
    standard: 'DIN 912 / ISO 4762',
    sourceSku: 'pilot-shcs-m4x20-a2',
    demo: true,
    synthetic: true,
    provenanceKind: 'internal-demo-seed',
    provenanceNote: 'Reviewed pilot configuration seed based on public DIN 912 / ISO 4762 terminology. It is not a real product claim.',
    verification: 'demo-only',
  },
  {
    id: 'PILOT-SHCS-M4X16-129-ISO4762',
    family: 'socket',
    type: 'Socket Head Cap Screw',
    thread: 'M4',
    pitch: '0.7 mm',
    length: '16 mm',
    head: 'Socket',
    drive: 'Hex',
    material: 'Alloy Steel',
    finish: 'Black-Oxide',
    strength: 'Class 12.9 demo configuration',
    standard: 'DIN 912 / ISO 4762',
    sourceSku: 'pilot-shcs-m4x16-129',
    demo: true,
    synthetic: true,
    provenanceKind: 'internal-demo-seed',
    provenanceNote: 'Reviewed pilot configuration seed based on public DIN 912 / ISO 4762 terminology. It is not a real product claim.',
    verification: 'demo-only',
  },
  {
    id: 'PILOT-HEX-M4X20-88-ISO4017',
    family: 'hex',
    type: 'Hex Head Screw',
    thread: 'M4',
    pitch: '0.7 mm',
    length: '20 mm',
    head: 'Hex',
    drive: 'External Hex',
    material: 'Steel',
    finish: 'Zinc-Plated',
    strength: 'Class 8.8 demo configuration',
    standard: 'DIN 933 / ISO 4017',
    sourceSku: 'pilot-hex-m4x20-88',
    demo: true,
    synthetic: true,
    provenanceKind: 'internal-demo-seed',
    provenanceNote: 'Reviewed pilot configuration seed based on public DIN 933 / ISO 4017 terminology. It is not a real product claim.',
    verification: 'demo-only',
  },
];
