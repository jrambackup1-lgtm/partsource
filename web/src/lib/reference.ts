/**
 * Reference library — deep, evergreen engineering pages built from public
 * standards data (DIN/ISO dimensional tables, ISO 898-1 property classes).
 * These are facts, independently reproduced from the published standards and
 * manufacturer datasheets; see research/data-sourcing-decision.md.
 *
 * Every page is data-driven: dimension tables are generated from the arrays
 * below so the numbers have one source of truth.
 */

export interface RefTable {
  headers: string[];
  rows: (string | number)[][];
}

export interface RefSection {
  heading: string;
  body?: string[];
  table?: RefTable;
}

export interface RefPage {
  slug: string;
  title: string;
  description: string;
  intro: string[];
  sections: RefSection[];
  related: string[];
  /** Optional: link the article to matching catalog entries. */
  catalogStandard?: string;
}

// ---------------------------------------------------------------------------
// Dimensional data (mm) per the published standards
// ---------------------------------------------------------------------------

const SIZES = ['M2', 'M2.5', 'M3', 'M4', 'M5', 'M6', 'M8', 'M10', 'M12'] as const;

const COARSE_PITCH: Record<string, number> = {
  M2: 0.4, 'M2.5': 0.45, M3: 0.5, M4: 0.7, M5: 0.8, M6: 1.0, M8: 1.25, M10: 1.5, M12: 1.75,
};
const FINE_PITCH: Record<string, string> = {
  M8: '1.0', M10: '1.25 / 1.0', M12: '1.5 / 1.25',
};
// Tensile stress area As (mm²), ISO 898-1, coarse thread.
const STRESS_AREA: Record<string, number> = {
  M2: 2.07, 'M2.5': 3.39, M3: 5.03, M4: 8.78, M5: 14.2, M6: 20.1, M8: 36.6, M10: 58.0, M12: 84.3,
};

// DIN 912 / ISO 4762 socket head cap screw: head dia dk, head height k, socket s.
const DIN912_DIMS: Record<string, [number, number, number]> = {
  M2: [3.8, 2, 1.5], 'M2.5': [4.5, 2.5, 2], M3: [5.5, 3, 2.5], M4: [7, 4, 3], M5: [8.5, 5, 4],
  M6: [10, 6, 5], M8: [13, 8, 6], M10: [16, 10, 8], M12: [18, 12, 10],
};
// DIN 7991 / ISO 10642 countersunk socket: head dia dk, head height k, socket s.
const DIN7991_DIMS: Record<string, [number, number, number]> = {
  M3: [6, 1.7, 2], M4: [8, 2.3, 2.5], M5: [10, 2.8, 3], M6: [12, 3.3, 4],
  M8: [16, 4.4, 5], M10: [20, 5.5, 6], M12: [24, 6.5, 8],
};
// ISO 7380 button head: head dia dk, head height k, socket s.
const ISO7380_DIMS: Record<string, [number, number, number]> = {
  M3: [5.7, 1.65, 2], M4: [7.6, 2.2, 2.5], M5: [9.5, 2.75, 3], M6: [10.5, 3.3, 4],
  M8: [14, 4.4, 5], M10: [17.5, 5.5, 6], M12: [21, 6.6, 8],
};
// Hex bolt DIN 933: wrench DIN s / ISO 4017 s, head height k.
const HEX_BOLT_DIMS: Record<string, [string, number]> = {
  M4: ['7', 2.8], M5: ['8', 3.5], M6: ['10', 4.0],
  M8: ['13', 5.3], M10: ['17 (DIN) / 16 (ISO)', 6.4], M12: ['19 (DIN) / 18 (ISO)', 7.5],
};
// Hex nut DIN 934: wrench s (DIN vs ISO where they differ), height m.
const HEX_NUT_DIMS: Record<string, [string, number]> = {
  M2: ['4', 1.6], 'M2.5': ['5', 2.0], M3: ['5.5', 2.4], M4: ['7', 3.2], M5: ['8', 4.0],
  M6: ['10', 5.0], M8: ['13', 6.5], M10: ['17 (DIN) / 16 (ISO)', 8.0], M12: ['19 (DIN) / 18 (ISO)', 10.0],
};
// Flat washer DIN 125A: inner d1, outer d2, thickness h.
const DIN125_DIMS: Record<string, [number, number, number]> = {
  M2: [2.2, 5, 0.3], 'M2.5': [2.7, 6, 0.5], M3: [3.2, 7, 0.5], M4: [4.3, 9, 0.8], M5: [5.3, 10, 1],
  M6: [6.4, 12, 1.6], M8: [8.4, 16, 1.6], M10: [10.5, 20, 2], M12: [13, 24, 2.5],
};
// Split lock washer DIN 127B: inner d1, outer d2, section thickness (nominal).
const DIN127_DIMS: Record<string, [number, number, number]> = {
  M3: [3.1, 6.2, 0.8], M4: [4.1, 7.6, 0.9], M5: [5.1, 9.2, 1.2], M6: [6.1, 11.8, 1.6],
  M8: [8.1, 14.8, 2.0], M10: [10.2, 18.1, 2.2], M12: [12.2, 21.1, 2.5],
};

// ISO 898-1 proof stress (MPa) by property class; A2-70 per ISO 3506-1.
const PROOF_STRESS: Record<string, number> = { '8.8': 580, '10.9': 830, '12.9': 970, 'A2-70': 450 };

/** Tightening torque (Nm): T = K · F · d, preload F = 75% of proof load. */
function torqueNm(size: string, cls: string, k: number): number {
  const d = parseFloat(size.slice(1)) / 1000;             // m
  const preloadN = 0.75 * PROOF_STRESS[cls] * STRESS_AREA[size]; // MPa · mm² = N
  const t = k * preloadN * d;
  return t < 1 ? Math.round(t * 100) / 100 : t < 10 ? Math.round(t * 10) / 10 : Math.round(t);
}

// ---------------------------------------------------------------------------
// Table builders
// ---------------------------------------------------------------------------

function dimsTable(
  dims: Record<string, [number | string, number | string, number | string]>,
  cols: [string, string, string],
): RefTable {
  return {
    headers: ['Thread', 'Pitch (coarse)', ...cols],
    rows: Object.entries(dims).map(([size, [a, b, c]]) => [
      size, `${COARSE_PITCH[size]} mm`, a, b, c,
    ]),
  };
}

const TORQUE_CLASSES = ['8.8', '10.9', '12.9', 'A2-70'];
function torqueTable(k: number): RefTable {
  return {
    headers: ['Thread', ...TORQUE_CLASSES.map(c => `Class ${c} (Nm)`)],
    rows: SIZES.filter(s => s !== 'M2' && s !== 'M2.5')
      .map(size => [size, ...TORQUE_CLASSES.map(cls => torqueNm(size, cls, k))]),
  };
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

const DISCLAIMER =
  'Values are reproduced from the published standard for reference. Always confirm against the standard revision or the manufacturer datasheet for safety-critical work.';

export const REF_PAGES: RefPage[] = [
  {
    slug: 'din-912-socket-head-cap-screw-dimensions',
    title: 'DIN 912 / ISO 4762 Socket Head Cap Screw — Size Chart',
    description: 'Head diameter, head height, and hex socket size for metric socket head cap screws M2–M12, per DIN 912 / ISO 4762.',
    intro: [
      'Socket head cap screws (SHCS) are the default fastener for machine building: the cylindrical head fits in a counterbore, the deep hex socket takes high installation torque, and class 12.9 alloy versions carry the highest preload of any standard screw of the same size.',
      'The head diameter is nominally 1.5× the thread diameter and the head height equals the thread diameter — useful memory rules when sizing counterbores.',
    ],
    sections: [
      {
        heading: 'Dimensions (mm)',
        table: dimsTable(DIN912_DIMS, ['Head dia dk (max)', 'Head height k', 'Hex socket s']),
        body: [DISCLAIMER],
      },
      {
        heading: 'Counterbore guidance',
        body: [
          'A standard counterbore for an SHCS is head diameter + ~0.5–1 mm clearance, deep enough to sit the head flush or slightly below the surface. For M4 that means an 8 mm counterbore; for M6, an 11 mm counterbore.',
          'If the joint is disassembled often, add a hardened washer under the head to protect the counterbore seat — see the DIN 125 washer chart.',
        ],
      },
    ],
    related: ['socket-cap-screw-torque-chart', 'metric-thread-pitch-tap-drill-chart', 'din-125-flat-washer-dimensions'],
    catalogStandard: 'DIN 912 / ISO 4762',
  },
  {
    slug: 'din-7991-flat-head-socket-screw-dimensions',
    title: 'DIN 7991 / ISO 10642 Flat Head (Countersunk) Socket Screw — Size Chart',
    description: 'Head diameter, head height, and socket size for metric countersunk socket screws M3–M12, per DIN 7991 / ISO 10642.',
    intro: [
      'Countersunk socket screws sit flush with the surface, at the cost of head strength and torque capacity compared with a cylindrical-head SHCS. The 90° countersink centers the screw, so hole position tolerance matters more than with a clearance-hole cap screw.',
    ],
    sections: [
      {
        heading: 'Dimensions (mm)',
        table: dimsTable(DIN7991_DIMS, ['Head dia dk (max)', 'Head height k', 'Hex socket s']),
        body: [DISCLAIMER],
      },
      {
        heading: 'Design notes',
        body: [
          'The countersink angle for metric flat heads is 90° (imperial flat heads are 82° — mixing the two leaves the head proud or sunken and concentrates stress on one edge).',
          'Because the head doubles as the seat, do not use countersunk screws in soft materials without a countersunk washer or insert; the head will pull in and lose preload.',
        ],
      },
    ],
    related: ['din-912-socket-head-cap-screw-dimensions', 'metric-vs-imperial-fastener-identification'],
    catalogStandard: 'DIN 7991 / ISO 10642',
  },
  {
    slug: 'iso-7380-button-head-screw-dimensions',
    title: 'ISO 7380 Button Head Socket Screw — Size Chart',
    description: 'Head diameter, head height, and socket size for metric button head socket screws M3–M12, per ISO 7380.',
    intro: [
      'Button heads trade the tall cylindrical head of an SHCS for a low dome — a cleaner look and no counterbore needed. The shallower socket strips more easily, so they are a poor choice where full class-12.9 preload must actually be applied.',
    ],
    sections: [
      {
        heading: 'Dimensions (mm)',
        table: dimsTable(ISO7380_DIMS, ['Head dia dk (max)', 'Head height k', 'Hex socket s']),
        body: [DISCLAIMER],
      },
      {
        heading: 'When to choose a button head',
        body: [
          'Use button heads for covers, guards, and panels — places where the fastener is visible or brushed against, and clamping load is modest.',
          'For structural joints, prefer DIN 912 cap screws: their deeper socket transmits roughly twice the installation torque without cam-out.',
        ],
      },
    ],
    related: ['din-912-socket-head-cap-screw-dimensions', 'socket-cap-screw-torque-chart'],
    catalogStandard: 'ISO 7380',
  },
  {
    slug: 'din-933-hex-head-bolt-dimensions',
    title: 'DIN 933 / ISO 4017 Hex Head Bolt — Size & Wrench Chart',
    description: 'Wrench size and head height for metric full-thread hex bolts M4–M12, per DIN 933 / ISO 4017, including the DIN-vs-ISO wrench size difference.',
    intro: [
      'DIN 933 is the fully threaded hex bolt (ISO 4017 is its metric-ISO twin). Driven externally with a wrench or socket, hex bolts suit joints where a tool approaches from the side or high torque is applied with a long lever.',
      'Watch the M10 and M12 wrench sizes: old-stock DIN bolts use 17 mm and 19 mm flats, while current ISO-dimensioned bolts use 16 mm and 18 mm. A 17 mm socket on an ISO M10 head will round it off.',
    ],
    sections: [
      {
        heading: 'Dimensions (mm)',
        table: {
          headers: ['Thread', 'Pitch (coarse)', 'Wrench s', 'Head height k'],
          rows: Object.entries(HEX_BOLT_DIMS).map(([size, [s, k]]) => [size, `${COARSE_PITCH[size]} mm`, s, k]),
        },
        body: [DISCLAIMER],
      },
    ],
    related: ['din-934-hex-nut-dimensions', 'bolt-property-classes-explained'],
    catalogStandard: 'DIN 933 / ISO 4017',
  },
  {
    slug: 'din-934-hex-nut-dimensions',
    title: 'DIN 934 / ISO 4032 Hex Nut — Size & Wrench Chart',
    description: 'Wrench size and nut height for metric hex nuts M2–M12, per DIN 934 / ISO 4032, including where DIN and ISO wrench sizes differ.',
    intro: [
      'The plain hex nut is the reference nut for metric assembly. Height is roughly 0.8× the thread diameter, which yields full thread engagement strength for a class-8 nut on a class-8.8 bolt.',
      'As with hex bolts, M10 and M12 nuts differ between DIN (17/19 mm) and ISO (16/18 mm) wrench sizes.',
    ],
    sections: [
      {
        heading: 'Dimensions (mm)',
        table: {
          headers: ['Thread', 'Pitch (coarse)', 'Wrench s', 'Height m'],
          rows: Object.entries(HEX_NUT_DIMS).map(([size, [s, m]]) => [size, `${COARSE_PITCH[size]} mm`, s, m]),
        },
        body: [DISCLAIMER],
      },
      {
        heading: 'Nut grades',
        body: [
          'Match the nut class to the bolt class: class 8 nuts for 8.8 bolts, class 10 for 10.9, class 12 for 12.9. A weaker nut strips its threads before the bolt reaches proof load.',
          'Under vibration, a plain nut backs off; use a nylon-insert locknut (DIN 985), a prevailing-torque all-metal nut, or a threadlocker.',
        ],
      },
    ],
    related: ['din-933-hex-head-bolt-dimensions', 'din-125-flat-washer-dimensions'],
    catalogStandard: 'DIN 934 / ISO 4032',
  },
  {
    slug: 'din-125-flat-washer-dimensions',
    title: 'DIN 125A / ISO 7089 Flat Washer — Size Chart',
    description: 'Inner diameter, outer diameter, and thickness for metric flat washers M2–M12, per DIN 125 form A / ISO 7089.',
    intro: [
      'The form-A flat washer spreads bolt preload over soft or thin material and protects the surface from the turning head or nut. Outer diameter is roughly 2× the bolt size.',
    ],
    sections: [
      {
        heading: 'Dimensions (mm)',
        table: {
          headers: ['For thread', 'Inner dia d1', 'Outer dia d2', 'Thickness h'],
          rows: Object.entries(DIN125_DIMS).map(([size, [d1, d2, h]]) => [size, d1, d2, h]),
        },
        body: [DISCLAIMER],
      },
      {
        heading: 'Selection notes',
        body: [
          'For slotted holes or very soft materials (plastics, wood), step up to a DIN 9021 fender washer (~3× bolt diameter) instead.',
          'Hardened washers (300 HV) are required under class 10.9/12.9 heads — a soft washer embeds and the joint loses preload.',
        ],
      },
    ],
    related: ['din-127-split-lock-washer-dimensions', 'din-934-hex-nut-dimensions'],
    catalogStandard: 'DIN 125A / ISO 7089',
  },
  {
    slug: 'din-127-split-lock-washer-dimensions',
    title: 'DIN 127B Split Lock Washer — Size Chart & Honest Limitations',
    description: 'Dimensions for metric split (spring) lock washers M3–M12 per DIN 127B, and what the research says about their actual locking performance.',
    intro: [
      'The split lock washer is the most common — and most debated — locking element. Its spring section maintains some axial tension as the joint relaxes.',
      'Honest engineering note: vibration studies (including the well-known Junker-test literature) show split washers do little to prevent rotational self-loosening in properly preloaded high-strength joints, and NASA fastener guidance advises against relying on them. They remain adequate for lightly loaded, low-vibration assemblies.',
    ],
    sections: [
      {
        heading: 'Dimensions (mm, nominal)',
        table: {
          headers: ['For thread', 'Inner dia d1', 'Outer dia d2', 'Section thickness'],
          rows: Object.entries(DIN127_DIMS).map(([size, [d1, d2, h]]) => [size, d1, d2, h]),
        },
        body: [DISCLAIMER],
      },
      {
        heading: 'Better locking options',
        body: [
          'For vibration-critical joints prefer, in rough order of effectiveness: correct preload (the biggest factor), nylon-insert or all-metal prevailing-torque nuts (DIN 985/980), wedge-lock washers, or an anaerobic threadlocker.',
        ],
      },
    ],
    related: ['din-125-flat-washer-dimensions', 'socket-cap-screw-torque-chart'],
    catalogStandard: 'DIN 127B',
  },
  {
    slug: 'metric-thread-pitch-tap-drill-chart',
    title: 'Metric Thread Pitch & Tap Drill Chart (M2–M12)',
    description: 'ISO 261 coarse and fine pitches with tap drill sizes for metric threads M2–M12.',
    intro: [
      'The tap drill for a standard 75%-engagement metric thread is simply the nominal diameter minus the pitch: an M6×1.0 thread taps from a 5.0 mm hole.',
      'Coarse pitch is the default; fine pitch appears on hydraulic fittings, adjustment screws, and thin-wall parts where more thread engagement per millimetre matters.',
    ],
    sections: [
      {
        heading: 'Pitch and tap drill (mm)',
        table: {
          headers: ['Thread', 'Coarse pitch', 'Tap drill (coarse)', 'Common fine pitch'],
          rows: SIZES.map(size => [
            size,
            `${COARSE_PITCH[size]} mm`,
            `${(parseFloat(size.slice(1)) - COARSE_PITCH[size]).toFixed(1)} mm`,
            FINE_PITCH[size] ?? '—',
          ]),
        },
        body: [DISCLAIMER],
      },
      {
        heading: 'Identifying an unknown thread',
        body: [
          'Measure the outside diameter with calipers, then check the pitch with a thread gauge or by counting threads over 10 mm. An M6 measures ~5.9–6.0 mm OD with 1.0 mm between crests.',
          'If the OD reads ~6.3 mm with 20 threads per inch it is 1/4"-20 UNC, not M6 — see the metric vs imperial identification guide.',
        ],
      },
    ],
    related: ['metric-vs-imperial-fastener-identification', 'din-912-socket-head-cap-screw-dimensions'],
  },
  {
    slug: 'socket-cap-screw-torque-chart',
    title: 'Metric Screw Tightening Torque Chart (8.8 / 10.9 / 12.9 / A2)',
    description: 'Calculated tightening torques for metric fasteners M3–M12 in classes 8.8, 10.9, 12.9 and A2-70 stainless, dry and lubricated, with the formula and assumptions stated.',
    intro: [
      'These torques are calculated from T = K·F·d with preload F set to 75% of proof load (proof stress × stress area, per ISO 898-1) — the standard elastic-joint assumption. They are starting values for general machine joints, not a substitute for a joint-specific analysis on critical hardware.',
      'K is the "nut factor": 0.20 is typical for plain dry steel threads, 0.15 for oiled or zinc-plated-and-waxed threads. Lubrication cuts required torque by a quarter — torquing a lubricated bolt to the dry value over-tensions it.',
    ],
    sections: [
      {
        heading: 'Dry threads (K = 0.20)',
        table: torqueTable(0.20),
      },
      {
        heading: 'Lubricated threads (K = 0.15)',
        table: torqueTable(0.15),
        body: [
          'Assumptions: preload = 75% × proof stress × tensile stress area (ISO 898-1 coarse threads); proof stress 580 / 830 / 970 MPa for classes 8.8 / 10.9 / 12.9 and 450 MPa for A2-70 stainless. ' + DISCLAIMER,
        ],
      },
      {
        heading: 'Stainless caution',
        body: [
          'A2/A4 stainless galls: dry stainless-on-stainless threads can seize mid-tightening. Use a nickel or moly anti-seize (then use the lubricated column) and slow the driver down.',
        ],
      },
    ],
    related: ['bolt-property-classes-explained', 'din-912-socket-head-cap-screw-dimensions'],
  },
  {
    slug: 'bolt-property-classes-explained',
    title: 'Bolt Property Classes Explained: 8.8 vs 10.9 vs 12.9 vs A2 Stainless',
    description: 'What metric property class numbers mean, the actual strength values behind 8.8/10.9/12.9 and A2-70, and how to choose.',
    intro: [
      'A metric property class like "8.8" encodes two numbers: tensile strength (8 → 800 MPa) and the yield-to-tensile ratio (.8 → yield is 80% of tensile, i.e. 640 MPa). A 12.9 screw is therefore 1200 MPa tensile / 1080 MPa yield.',
      'Stainless classes read differently: A2-70 means austenitic 18-8 chemistry (A2) cold-worked to 700 MPa tensile — stronger than mild steel, but well below 10.9, and it work-hardens and galls.',
    ],
    sections: [
      {
        heading: 'Strength comparison',
        table: {
          headers: ['Class', 'Tensile (MPa)', 'Yield/Proof (MPa)', 'Typical use'],
          rows: [
            ['4.8', 420, 340, 'Low-load, zinc-plated hardware-store grade'],
            ['8.8', 800, 640, 'General machine joints — the metric workhorse'],
            ['10.9', 1040, 940, 'High-preload structural and automotive joints'],
            ['12.9', 1220, 1100, 'Tooling, dies, socket cap screws at max preload'],
            ['A2-70', 700, 450, 'Corrosion resistance: food, outdoor, marine-adjacent'],
          ],
        },
        body: [DISCLAIMER],
      },
      {
        heading: 'Choosing a class',
        body: [
          'Preload, not shear across the shank, is how a bolted joint works: pick the class that lets you clamp hard enough that friction carries the service load. 8.8 covers most machine work; step to 10.9/12.9 when space limits bolt count or diameter.',
          'Do not swap 12.9 in wet or corrosive service — high-strength steel is more sensitive to hydrogen embrittlement and corrosion pitting; use a coated 10.9 or change the joint design instead.',
          'Class markings are stamped on the head of bolts M5 and larger. An unmarked bolt is class 4.8 at best — treat it that way.',
        ],
      },
    ],
    related: ['socket-cap-screw-torque-chart', 'din-933-hex-head-bolt-dimensions'],
  },
  {
    slug: 'mcmaster-part-number-decoding',
    title: 'How McMaster-Carr Part Numbers Work (and What Can Be Decoded)',
    description: 'What a McMaster-Carr part number series prefix reliably tells you, why the size suffix cannot be decoded, and how to cross-reference safely.',
    intro: [
      'A McMaster-Carr number like 91290A115 has two parts: a 5-digit series prefix (91290) and a suffix (A115). The prefix identifies a product family — one specific type, material, and finish — and is stable across the catalog.',
      'The suffix is an index into that family, and its encoding is not public, not linear, and differs per family. Any tool that claims to compute size from the suffix alone is guessing — this one deliberately does not.',
    ],
    sections: [
      {
        heading: 'Series prefixes this tool recognizes',
        table: {
          headers: ['Series', 'Family', 'Material / finish', 'System'],
          rows: [
            ['91251', 'Socket head cap screw', 'Alloy steel, black-oxide', 'Imperial'],
            ['92196', 'Socket head cap screw', '18-8 stainless', 'Imperial'],
            ['91290', 'Socket head cap screw', 'Alloy steel, black-oxide', 'Metric'],
            ['91292', 'Socket head cap screw', '18-8 stainless', 'Metric'],
            ['92095', 'Button head socket screw', '18-8 stainless', 'Metric'],
            ['92125', 'Socket shoulder screw', 'Alloy steel', '—'],
            ['90592', 'Hex nut', 'Zinc-plated steel', 'Metric'],
            ['91831', 'Nylon-insert locknut', '18-8 stainless', 'Metric'],
            ['93475', 'Flat washer', '18-8 stainless', 'Metric'],
          ],
        },
        body: [
          'Series facts are family-level only, verifiable from public listings. When you search a part number here, the tool tells you the family honestly and — where a supplier publishes its own cross-reference — shows that supplier\'s live match for the exact size.',
        ],
      },
      {
        heading: 'Cross-referencing safely',
        body: [
          'The reliable path from an MPN to an equivalent is: identify the family from the prefix, get the exact size from your drawing/BOM or the part in your hand, then match against the governing standard (DIN 912, DIN 934, …) using the size charts in this reference section.',
          'Distributors like Zoro index McMaster numbers in their own search engines; this tool surfaces that live match when available, labeled as the supplier\'s cross-reference — verify the specs before ordering.',
        ],
      },
    ],
    related: ['din-912-socket-head-cap-screw-dimensions', 'metric-vs-imperial-fastener-identification'],
  },
  {
    slug: 'metric-vs-imperial-fastener-identification',
    title: 'Metric vs Imperial Fasteners: Identification Without Guessing',
    description: 'How to tell M6 from 1/4"-20, metric from unified threads, and 90° from 82° countersinks — the confusions that ruin assemblies.',
    intro: [
      'The most expensive fastener mistakes are near-misses: threads that start smoothly for two turns and then bind. This guide covers the classic metric/imperial confusions and how to measure your way out of them.',
    ],
    sections: [
      {
        heading: 'The classic near-miss pairs',
        table: {
          headers: ['Pair', 'Measured OD', 'Pitch / TPI', 'How it fails'],
          rows: [
            ['M6 vs 1/4"-20', '5.9 mm vs 6.35 mm', '1.0 mm vs 20 TPI (1.27 mm)', 'M6 bolt drops loosely into 1/4" nut, strips under load'],
            ['M8 vs 5/16"-18', '7.9 mm vs 7.94 mm', '1.25 mm vs 18 TPI (1.41 mm)', 'Starts 2–3 turns then binds — the worst one'],
            ['M10 vs 3/8"-16', '9.9 mm vs 9.53 mm', '1.5 mm vs 16 TPI (1.59 mm)', 'Cross-threads soft aluminium housings'],
            ['M4 vs #8-32', '3.9 mm vs 4.17 mm', '0.7 mm vs 32 TPI (0.79 mm)', 'Strips small tapped holes in sheet metal'],
          ],
        },
      },
      {
        heading: 'Measurement procedure',
        body: [
          '1) Caliper the outside diameter — metric sizes land just under whole millimetres (M6 ≈ 5.9), imperial lands on fractional-inch values (1/4" = 6.35 mm). 2) Check pitch with a gauge, or count crests over a measured 10 mm / 1". 3) For flat heads, check the countersink: metric is 90°, imperial is 82° — a metric screw in an imperial countersink touches only at the rim.',
          'When in doubt, run a known nut down the thread by hand. Any binding within three turns means wrong system or damaged thread — stop before you make it worse.',
        ],
      },
    ],
    related: ['metric-thread-pitch-tap-drill-chart', 'mcmaster-part-number-decoding'],
  },
];

export function findRefPage(slug: string): RefPage | null {
  return REF_PAGES.find(p => p.slug === slug) ?? null;
}
