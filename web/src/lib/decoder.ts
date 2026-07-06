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

export const db: Part[] = [
  {"partNumber": "91251A051", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M1.6", "pitch": "0.35 mm", "length": "3 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.25, "appNote": "Micro-sized fastener for electronics and precision instruments."},
  {"partNumber": "91251A242", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M4", "pitch": "0.7 mm", "length": "12 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.28, "appNote": "High-tensile fastener for precision machinery and rigid structural clamping."},
  {"partNumber": "91251A244", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M4", "pitch": "0.7 mm", "length": "16 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.30, "appNote": "High-tensile fastener for precision machinery and rigid structural clamping."},
  {"partNumber": "91251A245", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M4", "pitch": "0.7 mm", "length": "20 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.32, "appNote": "High-tensile fastener for precision machinery and rigid structural clamping."},
  {"partNumber": "91251A342", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M5", "pitch": "0.8 mm", "length": "12 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.34, "appNote": "Common metric size for 3D printers, enclosures, and robotic joints."},
  {"partNumber": "91290A115", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "M3", "pitch": "0.5 mm", "length": "10 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 912 / ISO 4762", "mcmasterPrice": 0.22, "appNote": "Standard sub-miniature socket cap screw for electronics and sensors."},
  {"partNumber": "91251A192", "category": "Screws & Bolts", "type": "Socket Head Cap Screw", "thread": "#10-24", "pitch": "24 TPI", "length": "1/2\"", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "ASME B18.3", "mcmasterPrice": 0.25, "appNote": "Fractional structural bolt popular in US mechanical assemblies."},
  {"partNumber": "91247A142", "category": "Screws & Bolts", "type": "Hex Head Screw", "thread": "M4", "pitch": "0.7 mm", "length": "12 mm", "material": "18-8 Stainless Steel", "finish": "Plain", "drive": "Hex Outer", "standard": "DIN 933 / ISO 4017", "mcmasterPrice": 0.40, "appNote": "Corrosion-resistant general-purpose hex cap bolt."},
  {"partNumber": "92210A110", "category": "Screws & Bolts", "type": "Flat Head Socket Cap Screw", "thread": "M3", "pitch": "0.5 mm", "length": "10 mm", "material": "Alloy Steel", "finish": "Black-Oxide", "drive": "Hex", "standard": "DIN 7991 / ISO 10642", "mcmasterPrice": 0.20, "appNote": "Countersunk screw designed to sit flush with mating surfaces."},
  {"partNumber": "90596A005", "category": "Nuts", "type": "Hex Nut", "thread": "M4", "pitch": "0.7 mm", "length": "N/A", "material": "18-8 Stainless Steel", "finish": "Plain", "drive": "Hex Outer", "standard": "DIN 934 / ISO 4032", "mcmasterPrice": 0.10, "appNote": "Standard metric hex nut matching M4 thread sizes."},
  {"partNumber": "91166A005", "category": "Washers", "type": "Flat Washer", "thread": "M4", "pitch": "N/A", "length": "N/A", "material": "18-8 Stainless Steel", "finish": "Plain", "drive": "N/A", "standard": "DIN 125A / ISO 7089", "mcmasterPrice": 0.06, "appNote": "Spreads load and prevents wear on soft mating materials."}
];

export const fuse = new Fuse(db, { 
  keys: ['partNumber', 'type', 'thread', 'length'],
  threshold: 0.3,
  ignoreLocation: true
});

export const suppliers = [
  { name: "Zoro", discount: 0.85, urlTemplate: "https://www.zoro.com/search?q=", isDfars: true, isIso: true, isUsa: true, shipDays: 2 },
  { name: "Bolt Depot", discount: 0.70, urlTemplate: "https://www.boltdepot.com/Product-Search.aspx?txt=", isDfars: false, isIso: false, isUsa: false, shipDays: 3 },
  { name: "MSC Industrial", discount: 0.95, urlTemplate: "https://www.mscdirect.com/browse/tn?searchterm=", isDfars: true, isIso: true, isUsa: true, shipDays: 1 },
  { name: "Fastenal", discount: 1.00, urlTemplate: "https://www.fastenal.com/products/search?term=", isDfars: true, isIso: true, isUsa: true, shipDays: 1 },
  { name: "Misumi", discount: 0.90, urlTemplate: "https://us.misumi-ec.com/vona2/result/?Keyword=", isDfars: false, isIso: true, isUsa: false, shipDays: 5 }
];

export function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function parseCustomPart(query: string): Part {
  let type = "Custom Fastener";
  let category = "Fasteners";
  let drive = "Unknown";
  let finish = "Unknown";
  let material = "Unknown";

  const queryLower = query.toLowerCase();

  if(query.includes('91251') || queryLower.includes('cap screw')) {
    type = "Socket Head Cap Screw"; drive = "Hex"; category = "Screws & Bolts";
  } else if(query.includes('91247') || queryLower.includes('hex bolt')) {
    type = "Hex Head Screw"; drive = "Hex Outer"; category = "Screws & Bolts";
  } else if(query.includes('92210') || queryLower.includes('flat head')) {
    type = "Flat Head Socket Cap Screw"; drive = "Hex"; category = "Screws & Bolts";
  } else if(query.includes('90596') || queryLower.includes('nut')) {
    type = "Hex Nut"; drive = "Hex Outer"; category = "Nuts";
  }

  let threadMatch = query.match(/(M\d+|#\d+-\d+|\d+\/\d+-\d+)/i);
  let thread = threadMatch ? threadMatch[1].toUpperCase() : "Unknown";

  let lengthMatch = query.match(/x\s*(\d+(?:\.\d+)?\s*(?:mm|")?)/i);
  let length = lengthMatch ? lengthMatch[1].toLowerCase() : "Unknown";
  
  if (length === "unknown" && !queryLower.includes('nut') && !queryLower.includes('washer')) {
    let altLengthMatch = query.match(/(?:\s|-)(\d+(?:\.\d+)?\s*(?:mm|"))/i);
    if (altLengthMatch) length = altLengthMatch[1].toLowerCase();
  } else if (queryLower.includes('nut') || queryLower.includes('washer')) {
    length = "N/A";
  }

  if (queryLower.includes('stainless')) material = "Stainless Steel";
  if (queryLower.includes('black')) finish = "Black-Oxide";

  return {
    partNumber: query.toUpperCase().trim(),
    category: category,
    type: type,
    thread: thread,
    pitch: "N/A",
    length: length,
    material: material !== "Unknown" ? material : "Alloy Steel (Assumed)",
    finish: finish !== "Unknown" ? finish : "Plain (Assumed)",
    drive: drive,
    standard: "Unknown",
    mcmasterPrice: 0.50,
    appNote: "Dynamically parsed via heuristic engine based on input."
  };
}
