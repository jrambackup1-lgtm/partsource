import Fuse from 'fuse.js';

export interface Part {
  partNumber: string;
  category: string;
  type: string;
  thread: string;
  pitch: string;
  length: string;
  material: string;
  finish: string;
  drive: string;
  standard: string;
  mcmasterPrice: number;
  appNote: string;
}

// ---------------------------------------------------------------------------
// Static catalog
// ---------------------------------------------------------------------------
// Dimensional data sourced from public ISO / ASME / DIN fastener standards
// (DIN 912, ISO 4762, ASME B18.3, DIN 933/ISO 4017, DIN 934/ISO 4032,
// DIN 125A/ISO 7089) plus supplier-published spec sheets. These are facts and
// are freely redistributable. See research/data-sourcing-decision.md.
export const db: Part[] = [
  // --- Socket Head Cap Screws, alloy steel, black-oxide (series 91251) ---
  {"partNumber": "91251A051", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M1.6", "pitch": "0.35 mm", "length": "3 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.25, "appNote": "Micro-sized fastener for electronics and precision instruments."},
  {"partNumber": "91251A108", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M2", "pitch": "0.4 mm", "length": "6 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.24, "appNote": "Small metric socket cap screw for fine instrumentation."},
  {"partNumber": "91251A110", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M2", "pitch": "0.4 mm", "length": "8 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.25, "appNote": "Small metric socket cap screw for fine instrumentation."},
  {"partNumber": "91251A313", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M2.5", "pitch": "0.45 mm", "length": "8 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.23, "appNote": "Common 3D-printer and electronics frame fastener."},
  {"partNumber": "91251A314", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M2.5", "pitch": "0.45 mm", "length": "10 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.24, "appNote": "Common 3D-printer and electronics frame fastener."},
  {"partNumber": "91290A115", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M3", "pitch": "0.5 mm", "length": "10 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.22, "appNote": "Standard sub-miniature socket cap screw for electronics and sensors."},
  {"partNumber": "91251A111", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M3", "pitch": "0.5 mm", "length": "8 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.21, "appNote": "Compact M3 socket cap screw for tight assemblies."},
  {"partNumber": "91251A113", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M3", "pitch": "0.5 mm", "length": "12 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.22, "appNote": "Versatile M3 length for jigs and prototyping."},
  {"partNumber": "91251A242", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M4", "pitch": "0.7 mm", "length": "12 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.28, "appNote": "High-tensile fastener for precision machinery and rigid structural clamping."},
  {"partNumber": "91251A244", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M4", "pitch": "0.7 mm", "length": "16 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.30, "appNote": "High-tensile fastener for precision machinery and rigid structural clamping."},
  {"partNumber": "91251A245", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M4", "pitch": "0.7 mm", "length": "20 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.32, "appNote": "High-tensile fastener for precision machinery and rigid structural clamping."},
  {"partNumber": "91251A247", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M4", "pitch": "0.7 mm", "length": "25 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.34, "appNote": "Longer M4 for through-bolting stacked plates."},
  {"partNumber": "91251A342", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M5", "pitch": "0.8 mm", "length": "12 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.34, "appNote": "Common metric size for 3D printers, enclosures, and robotic joints."},
  {"partNumber": "91251A343", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M5", "pitch": "0.8 mm", "length": "16 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.36, "appNote": "Common metric size for 3D printers, enclosures, and robotic joints."},
  {"partNumber": "91251A346", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M5", "pitch": "0.8 mm", "length": "25 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.40, "appNote": "Common metric size for 3D printers, enclosures, and robotic joints."},
  {"partNumber": "91251A444", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M6", "pitch": "1.0 mm", "length": "16 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.42, "appNote": "Structural M6 for jigs, fixtures, and load-bearing assemblies."},
  {"partNumber": "91251A446", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M6", "pitch": "1.0 mm", "length": "20 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.44, "appNote": "Structural M6 for jigs, fixtures, and load-bearing assemblies."},
  {"partNumber": "91251A449", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M6", "pitch": "1.0 mm", "length": "30 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.50, "appNote": "Structural M6 for jigs, fixtures, and load-bearing assemblies."},
  {"partNumber": "91251A553", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M8", "pitch": "1.25 mm", "length": "25 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.62, "appNote": "Heavy-duty M8 for machinery frames and structural members."},
  {"partNumber": "91251A557", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M8", "pitch": "1.25 mm", "length": "35 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.70, "appNote": "Heavy-duty M8 for machinery frames and structural members."},
  {"partNumber": "91251A630", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M10", "pitch": "1.5 mm", "length": "30 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.88, "appNote": "Large-structure M10 socket cap for high clamp load."},
  {"partNumber": "91251A192", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "#10-24", "pitch": "24 TPI", "length": "1/2\"", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "ASME B18.3", "mcmasterPrice": 0.25, "appNote": "Fractional structural bolt popular in US mechanical assemblies."},
  {"partNumber": "91251A196", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "#10-24", "pitch": "24 TPI", "length": "3/4\"", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "ASME B18.3", "mcmasterPrice": 0.28, "appNote": "Fractional structural bolt popular in US mechanical assemblies."},
  {"partNumber": "91251A545", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "1/4\"-20", "pitch": "20 TPI", "length": "1\"", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "ASME B18.3", "mcmasterPrice": 0.35, "appNote": "Workhorse imperial socket cap for US-built machinery."},

  // --- Socket Head Cap Screws, 18-8 stainless (series 91290) ---
  {"partNumber": "91290A019", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M3", "pitch": "0.5 mm", "length": "8 mm", "material": "18-8 Stainless Steel", "finish": "Plain", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.30, "appNote": "Corrosion-resistant M3 for food, lab, and outdoor hardware."},
  {"partNumber": "91290A110", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M3", "pitch": "0.5 mm", "length": "10 mm", "material": "18-8 Stainless Steel", "finish": "Plain", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.31, "appNote": "Corrosion-resistant M3 for food, lab, and outdoor hardware."},
  {"partNumber": "91290A196", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M4", "pitch": "0.7 mm", "length": "12 mm", "material": "18-8 Stainless Steel", "finish": "Plain", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.37, "appNote": "Corrosion-resistant M4 for wet-environment assemblies."},
  {"partNumber": "91290A197", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M4", "pitch": "0.7 mm", "length": "16 mm", "material": "18-8 Stainless Steel", "finish": "Plain", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.39, "appNote": "Corrosion-resistant M4 for wet-environment assemblies."},
  {"partNumber": "91290A289", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M5", "pitch": "0.8 mm", "length": "16 mm", "material": "18-8 Stainless Steel", "finish": "Plain", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.45, "appNote": "Stainless M5 socket cap for corrosion-critical builds."},
  {"partNumber": "91290A396", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M6", "pitch": "1.0 mm", "length": "20 mm", "material": "18-8 Stainless Steel", "finish": "Plain", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.54, "appNote": "Stainless M6 socket cap for corrosion-critical builds."},

  // --- Flat Head Socket Cap Screws (series 92210) ---
  {"partNumber": "92210A110", "category": "Screws & Bolts", "type": "Flat Head Socket Cap Screw", "thread": "M3", "pitch": "0.5 mm", "length": "10 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 7991 / ISO 10642", "mcmasterPrice": 0.20, "appNote": "Countersunk screw designed to sit flush with mating surfaces."},
  {"partNumber": "92210A139", "category": "Screws & Bolts", "type": "Flat Head Socket Cap Screw", "thread": "M4", "pitch": "0.7 mm", "length": "12 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 7991 / ISO 10642", "mcmasterPrice": 0.26, "appNote": "Countersunk M4 for flush-finish panels and housings."},
  {"partNumber": "92210A243", "category": "Screws & Bolts", "type": "Flat Head Socket Cap Screw", "thread": "M5", "pitch": "0.8 mm", "length": "16 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 7991 / ISO 10642", "mcmasterPrice": 0.32, "appNote": "Countersunk M5 for flush-finish panels and housings."},
  {"partNumber": "92210A412", "category": "Screws & Bolts", "type": "Flat Head Socket Cap Screw", "thread": "M6", "pitch": "1.0 mm", "length": "16 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 7991 / ISO 10642", "mcmasterPrice": 0.42, "appNote": "Countersunk M6 for flush-finish panels and housings."},

  // --- Button Head Socket Cap Screws (series 91302) ---
  {"partNumber": "91302A416", "category": "Screws & Bolts", "type": "Button Head Socket Cap Screw", "thread": "M3", "pitch": "0.5 mm", "length": "10 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "ISO 7380", "mcmasterPrice": 0.21, "appNote": "Low-profile domed head for a clean finish with Allen drive."},
  {"partNumber": "91302A428", "category": "Screws & Bolts", "type": "Button Head Socket Cap Screw", "thread": "M4", "pitch": "0.7 mm", "length": "12 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "ISO 7380", "mcmasterPrice": 0.27, "appNote": "Low-profile domed head for a clean finish with Allen drive."},
  {"partNumber": "91302A439", "category": "Screws & Bolts", "type": "Button Head Socket Cap Screw", "thread": "M5", "pitch": "0.8 mm", "length": "16 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "ISO 7380", "mcmasterPrice": 0.33, "appNote": "Low-profile domed head for a clean finish with Allen drive."},
  {"partNumber": "91302A450", "category": "Screws & Bolts", "type": "Button Head Socket Cap Screw", "thread": "M6", "pitch": "1.0 mm", "length": "16 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "ISO 7380", "mcmasterPrice": 0.43, "appNote": "Low-profile domed head for a clean finish with Allen drive."},

  // --- Hex Head Screws, stainless (series 91247) ---
  {"partNumber": "91247A142", "category": "Screws & Bolts", "type": "Hex Head Screw", "thread": "M4", "pitch": "0.7 mm", "length": "12 mm", "material": "18-8 Stainless Steel", "finish": "Plain", "drive": "Hex Outer", "standard": "DIN 933 / ISO 4017", "mcmasterPrice": 0.40, "appNote": "Corrosion-resistant general-purpose hex cap bolt."},
  {"partNumber": "91247A144", "category": "Screws & Bolts", "type": "Hex Head Screw", "thread": "M4", "pitch": "0.7 mm", "length": "16 mm", "material": "18-8 Stainless Steel", "finish": "Plain", "drive": "Hex Outer", "standard": "DIN 933 / ISO 4017", "mcmasterPrice": 0.42, "appNote": "Corrosion-resistant general-purpose hex cap bolt."},
  {"partNumber": "91247A242", "category": "Screws & Bolts", "type": "Hex Head Screw", "thread": "M5", "pitch": "0.8 mm", "length": "16 mm", "material": "18-8 Stainless Steel", "finish": "Plain", "drive": "Hex Outer", "standard": "DIN 933 / ISO 4017", "mcmasterPrice": 0.47, "appNote": "Wrench-driven stainless M5 for general mechanical assembly."},
  {"partNumber": "91247A346", "category": "Screws & Bolts", "type": "Hex Head Screw", "thread": "M6", "pitch": "1.0 mm", "length": "20 mm", "material": "18-8 Stainless Steel", "finish": "Plain", "drive": "Hex Outer", "standard": "DIN 933 / ISO 4017", "mcmasterPrice": 0.55, "appNote": "Wrench-driven stainless M6 for general mechanical assembly."},

  // --- Socket Shoulder Screws (series 92125) ---
  {"partNumber": "92125A230", "category": "Screws & Bolts", "type": "Socket Shoulder Screw", "thread": "M6", "pitch": "1.0 mm", "length": "10 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "ASME B18.3 / DIN 6880", "mcmasterPrice": 1.05, "appNote": "Precision shoulder screw for pivot pins and locating dowels."},
  {"partNumber": "92125A335", "category": "Screws & Bolts", "type": "Socket Shoulder Screw", "thread": "M8", "pitch": "1.25 mm", "length": "12 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "ASME B18.3 / DIN 6880", "mcmasterPrice": 1.45, "appNote": "Precision shoulder screw for pivot pins and locating dowels."},

  // --- Hex Nuts (series 90596 stainless / 98376 steel) ---
  {"partNumber": "90596A005", "category": "Nuts", "type": "Hex Nut", "thread": "M4", "pitch": "0.7 mm", "length": "N/A", "material": "18-8 Stainless Steel", "finish": "Plain", "drive": "Hex Outer", "standard": "DIN 934 / ISO 4032", "mcmasterPrice": 0.10, "appNote": "Standard metric hex nut matching M4 thread sizes."},
  {"partNumber": "90596A011", "category": "Nuts", "type": "Hex Nut", "thread": "M5", "pitch": "0.8 mm", "length": "N/A", "material": "18-8 Stainless Steel", "finish": "Plain", "drive": "Hex Outer", "standard": "DIN 934 / ISO 4032", "mcmasterPrice": 0.12, "appNote": "Standard metric hex nut matching M5 thread sizes."},
  {"partNumber": "90596A019", "category": "Nuts", "type": "Hex Nut", "thread": "M6", "pitch": "1.0 mm", "length": "N/A", "material": "18-8 Stainless Steel", "finish": "Plain", "drive": "Hex Outer", "standard": "DIN 934 / ISO 4032", "mcmasterPrice": 0.14, "appNote": "Standard metric hex nut matching M6 thread sizes."},
  {"partNumber": "90596A029", "category": "Nuts", "type": "Hex Nut", "thread": "M8", "pitch": "1.25 mm", "length": "N/A", "material": "18-8 Stainless Steel", "finish": "Plain", "drive": "Hex Outer", "standard": "DIN 934 / ISO 4032", "mcmasterPrice": 0.20, "appNote": "Standard metric hex nut matching M8 thread sizes."},
  {"partNumber": "98376A029", "category": "Nuts", "type": "Hex Nut", "thread": "M8", "pitch": "1.25 mm", "length": "N/A", "material": "Steel", "finish": "Zinc-Plated", "drive": "Hex Outer", "standard": "DIN 934 / ISO 4032", "mcmasterPrice": 0.12, "appNote": "Economical zinc-plated steel hex nut for general use."},
  {"partNumber": "91841A009", "category": "Nuts", "type": "Nylon-Insert Locknut", "thread": "M5", "pitch": "0.8 mm", "length": "N/A", "material": "18-8 Stainless Steel", "finish": "Plain", "drive": "Hex Outer", "standard": "DIN 985 / ISO 10511", "mcmasterPrice": 0.15, "appNote": "All-metal prevailing-torque locknut that resists vibration."},

  // --- Washers (series 91166 flat / 90114 lock) ---
  {"partNumber": "91166A005", "category": "Washers", "type": "Flat Washer", "thread": "M4", "pitch": "N/A", "length": "N/A", "material": "18-8 Stainless Steel", "finish": "Plain", "drive": "N/A", "standard": "DIN 125A / ISO 7089", "mcmasterPrice": 0.06, "appNote": "Spreads load and prevents wear on soft mating materials."},
  {"partNumber": "91166A011", "category": "Washers", "type": "Flat Washer", "thread": "M5", "pitch": "N/A", "length": "N/A", "material": "18-8 Stainless Steel", "finish": "Plain", "drive": "N/A", "standard": "DIN 125A / ISO 7089", "mcmasterPrice": 0.07, "appNote": "Spreads load and prevents wear on soft mating materials."},
  {"partNumber": "91166A019", "category": "Washers", "type": "Flat Washer", "thread": "M6", "pitch": "N/A", "length": "N/A", "material": "18-8 Stainless Steel", "finish": "Plain", "drive": "N/A", "standard": "DIN 125A / ISO 7089", "mcmasterPrice": 0.08, "appNote": "Spreads load and prevents wear on soft mating materials."},
  {"partNumber": "91166A029", "category": "Washers", "type": "Flat Washer", "thread": "M8", "pitch": "N/A", "length": "N/A", "material": "18-8 Stainless Steel", "finish": "Plain", "drive": "N/A", "standard": "DIN 125A / ISO 7089", "mcmasterPrice": 0.10, "appNote": "Spreads load and prevents wear on soft mating materials."},
  {"partNumber": "90114A011", "category": "Washers", "type": "Split Lock Washer", "thread": "M5", "pitch": "N/A", "length": "N/A", "material": "Spring Steel", "finish": "Zinc-Plated", "drive": "N/A", "standard": "DIN 127B", "mcmasterPrice": 0.05, "appNote": "Spring tension keeps the assembly tight under vibration."},
  {"partNumber": "90114A019", "category": "Washers", "type": "Split Lock Washer", "thread": "M6", "pitch": "N/A", "length": "N/A", "material": "Spring Steel", "finish": "Zinc-Plated", "drive": "N/A", "standard": "DIN 127B", "mcmasterPrice": 0.06, "appNote": "Spring tension keeps the assembly tight under vibration."}
];

export const fuse = new Fuse(db, {
  keys: ['partNumber', 'type', 'thread', 'length'],
  threshold: 0.3,
  ignoreLocation: true,
  includeScore: true
});

export const suppliers = [
  { name: "Zoro", discount: 0.85, urlTemplate: "https://www.zoro.com/search?q=", isDfars: true, isIso: true, isUsa: true, shipDays: 2 },
  { name: "Bolt Depot", discount: 0.70, urlTemplate: "https://www.boltdepot.com/Product-Search.aspx?txt=", isDfars: false, isIso: false, isUsa: false, shipDays: 3 },
  { name: "MSC Industrial", discount: 0.95, urlTemplate: "https://www.mscdirect.com/browse/tn?searchterm=", isDfars: true, isIso: true, isUsa: true, shipDays: 1 },
  { name: "Fastenal", discount: 1.00, urlTemplate: "https://www.fastenal.com/products/search?term=", isDfars: true, isIso: true, isUsa: true, shipDays: 1 },
  { name: "Misumi", discount: 0.90, urlTemplate: "https://us.misumi-ec.com/vona2/result/?Keyword=", isDfars: false, isIso: true, isUsa: false, shipDays: 5 }
];

// ---------------------------------------------------------------------------
// Supplier search-query generation
// ---------------------------------------------------------------------------
// The PRD (research/prd.md line 82) specifies search-query URLs derived from
// the part's SPECIFICATIONS, not fake SKUs. The previous implementation hashed
// the part number into pseudo-SKUs (e.g. "G4827193" for Zoro) that returned
// garbage on supplier search pages. This builds a real, human-readable query
// string from the decoded specs so supplier searches actually match product.

/** A normal material token stripped for use in a search query. */
function cleanMaterial(material: string): string {
  if (!material || material === 'Unknown' || material.includes('Assumed')) return '';
  return material;
}

/** Map our part `type` onto supplier-friendly phrasing (e.g. Bolt Depot). */
function describeType(type: string): string {
  if (!type) return '';
  const t = type.toLowerCase();
  if (t.includes('socket head cap')) return 'socket head cap screw';
  if (t.includes('flat head')) return 'flat head socket cap screw';
  if (t.includes('button head')) return 'button head socket cap screw';
  if (t.includes('hex head')) return 'hex head screw';
  if (t.includes('shoulder')) return 'socket shoulder screw';
  if (t.includes('nylon-insert') || t.includes('locknut')) return 'nylon insert locknut';
  if (t.includes('lock washer')) return 'split lock washer';
  if (t.includes('flat washer')) return 'flat washer';
  if (t.includes('hex nut')) return 'hex nut';
  return type.toLowerCase();
}

/**
 * Build a spec-derived search query for a supplier. Example output for
 * 91251A245 -> "M4 socket head cap screw 20mm black-oxide alloy steel".
 */
export function buildSupplierQuery(part: Part): string {
  const parts: string[] = [];
  if (part.thread && part.thread !== 'Unknown' && part.thread !== 'N/A') parts.push(part.thread);
  const t = describeType(part.type);
  if (t) parts.push(t);
  // Thread + length: render metric as "20mm", imperial as "1/2"".
  if (part.length && part.length !== 'Unknown' && part.length !== 'N/A') {
    parts.push(part.length.replace(/\s+/g, ''));
  }
  if (cleanMaterial(part.finish)) parts.push(cleanMaterial(part.finish).toLowerCase());
  if (cleanMaterial(part.material)) parts.push(cleanMaterial(part.material).toLowerCase());
  return parts.join(' ').trim() || part.partNumber;
}

/**
 * Build the full supplier search URL. `urlTemplate` already ends in the
 * supplier's query param (e.g. "...?q=").
 */
export function getSupplierSearchUrl(supplierUrlTemplate: string, part: Part): string {
  const query = buildSupplierQuery(part);
  return supplierUrlTemplate + encodeURIComponent(query);
}

// Kept for backward compatibility with any external callers. Prefer
// getSupplierSearchUrl — it returns a real query that works on supplier sites.
export function getEquivalentPartNumber(supplierName: string, partNumber: string): string {
  if (supplierName === 'McMaster-Carr') return partNumber;
  // Best-effort fallback for the rare caller that still passes a raw number:
  // treat it as the search query itself.
  return partNumber;
}

// ---------------------------------------------------------------------------
// Regex fallback decoder
// ---------------------------------------------------------------------------
// Coarse metric pitch (mm) lookup by nominal thread diameter, ISO 261 coarse.
const COARSE_PITCH_MM: Record<string, string> = {
  'M1.6': '0.35 mm', 'M2': '0.4 mm', 'M2.5': '0.45 mm',
  'M3': '0.5 mm', 'M4': '0.7 mm', 'M5': '0.8 mm',
  'M6': '1.0 mm', 'M8': '1.25 mm', 'M10': '1.5 mm', 'M12': '1.75 mm'
};

// Standard alignment by part "family" (first 5 digits of the McMaster number).
const STANDARD_BY_PREFIX: Record<string, string> = {
  '91251': 'DIN 912 / ISO 4762',
  '91290': 'DIN 912 / ISO 4762',
  '92210': 'DIN 7991 / ISO 10642',
  '91302': 'ISO 7380',
  '91247': 'DIN 933 / ISO 4017',
  '92125': 'ASME B18.3 / DIN 6880',
  '90596': 'DIN 934 / ISO 4032',
  '98376': 'DIN 934 / ISO 4032',
  '91841': 'DIN 985 / ISO 10511',
  '91166': 'DIN 125A / ISO 7089',
  '90114': 'DIN 127B'
};

function prefixFor(query: string): string {
  return (query.match(/^\d{5}/)?.[0] || '').toUpperCase();
}

/** Infer material from the McMaster series prefix. */
function inferMaterial(query: string): { material: string; finish: string } {
  const p = prefixFor(query);
  // 91290 = stainless socket cap; 90596 = stainless nut; 91166 = stainless washer;
  // 91247 = stainless hex head.
  if (['91290', '90596', '91166', '91247', '91841'].includes(p)) {
    return { material: '18-8 Stainless Steel', finish: 'Plain' };
  }
  if (p === '98376') return { material: 'Steel', finish: 'Zinc-Plated' };
  if (p === '90114') return { material: 'Spring Steel', finish: 'Zinc-Plated' };
  // Default for the 91251/92210/91302/92125 alloy-steel families.
  if (['91251', '92210', '91302', '92125'].includes(p)) {
    return { material: 'Alloy Steel', finish: 'Black-Oxide' };
  }
  return { material: '', finish: '' };
}

function inferType(query: string, queryLower: string): { type: string; drive: string; category: string } {
  const p = prefixFor(query);
  if (p === '91251' || p === '91290' || queryLower.includes('cap screw')) {
    return { type: 'Socket Head Cap Screw', drive: 'Hex', category: 'Screws & Bolts' };
  }
  if (p === '92210' || queryLower.includes('flat head')) {
    return { type: 'Flat Head Socket Cap Screw', drive: 'Hex', category: 'Screws & Bolts' };
  }
  if (p === '91302' || queryLower.includes('button head')) {
    return { type: 'Button Head Socket Cap Screw', drive: 'Hex', category: 'Screws & Bolts' };
  }
  if (p === '91247' || queryLower.includes('hex bolt') || queryLower.includes('hex head')) {
    return { type: 'Hex Head Screw', drive: 'Hex Outer', category: 'Screws & Bolts' };
  }
  if (p === '92125' || queryLower.includes('shoulder')) {
    return { type: 'Socket Shoulder Screw', drive: 'Hex', category: 'Screws & Bolts' };
  }
  if (p === '91841' || queryLower.includes('locknut')) {
    return { type: 'Nylon-Insert Locknut', drive: 'Hex Outer', category: 'Nuts' };
  }
  if (p === '90596' || p === '98376' || queryLower.includes('nut')) {
    return { type: 'Hex Nut', drive: 'Hex Outer', category: 'Nuts' };
  }
  if (p === '90114' || queryLower.includes('lock washer')) {
    return { type: 'Split Lock Washer', drive: 'N/A', category: 'Washers' };
  }
  if (p === '91166' || queryLower.includes('washer')) {
    return { type: 'Flat Washer', drive: 'N/A', category: 'Washers' };
  }
  return { type: 'Custom Fastener', drive: 'Unknown', category: 'Fasteners' };
}

export function parseCustomPart(query: string): Part {
  const q = query.trim();
  const qLower = q.toLowerCase();
  const prefix = prefixFor(q);

  const { type, drive, category } = inferType(q, qLower);
  const { material: mInf, finish: fInf } = inferMaterial(q);

  // Thread — accepts metric (M4, M2.5), unified (#10-24), and fractional
  // imperial with an optional " between the fraction and TPI (1/4"-20, 1/4-20).
  const threadMatch = q.match(/(M\d+(?:\.\d+)?|#\d+-\d+|\d+\/\d+"?-\d+)/i);
  const thread = threadMatch ? threadMatch[1].toUpperCase() : 'Unknown';

  // Pitch: from coarse-pitch table for metric; TPI already encoded for imperial.
  let pitch = 'N/A';
  if (thread.startsWith('M') && COARSE_PITCH_MM[thread]) {
    pitch = COARSE_PITCH_MM[thread];
  } else if (thread.match(/-\d+$/)) {
    const tpi = thread.split('-').pop();
    pitch = `${tpi} TPI`;
  }

  // Length: "x 20mm" / "-20mm" / " 1/2\"" / trailing "20mm".
  let length = 'Unknown';
  const isNutOrWasher = category === 'Nuts' || category === 'Washers';
  if (isNutOrWasher) {
    length = 'N/A';
  } else {
    const lenMatch = q.match(/(?:x|\s|-)\s*(\d+(?:\.\d+)?\s*(?:mm|cm)?|\d+\/\d+"\s*|\d+"\s*)/i);
    if (lenMatch) {
      length = lenMatch[1].trim().toLowerCase().replace(/\s+/g, ' ');
    }
  }

  // Material / finish: keyword overrides beat inferred defaults.
  let material = mInf;
  let finish = fInf;
  if (qLower.includes('stainless') || qLower.includes('18-8')) material = '18-8 Stainless Steel';
  if (qLower.includes('black')) finish = 'Black-Oxide';
  if (qLower.includes('zinc')) finish = 'Zinc-Plated';

  const standard = STANDARD_BY_PREFIX[prefix] || 'Unknown';

  return {
    partNumber: q.toUpperCase(),
    category,
    type,
    thread,
    pitch,
    length,
    material: material || 'Alloy Steel (Assumed)',
    finish: finish || 'Plain (Assumed)',
    drive,
    standard,
    mcmasterPrice: 0.50,
    appNote: 'Dynamically parsed via heuristic engine based on input.'
  };
}

// --- Small hash helper retained (legacy callers may still import it) -------
export function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return Math.abs(hash);
}
