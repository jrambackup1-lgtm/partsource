import React, { useState, ChangeEvent, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Plus, 
  Minus, 
  ArrowRight, 
  Package, 
  Layers, 
  Percent, 
  DollarSign, 
  CheckCircle,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  X,
  Search
} from 'lucide-react';
import { fuse, parseCustomPart, Part, suppliers, db } from '../lib/decoder';
import { useBOM } from '../hooks/useBOM';
import { useCurrency } from '../contexts/CurrencyContext';

// ----------------------------------------------------
// Cost Savings Chart component (Precision Blueprint style)
// ----------------------------------------------------
// ----------------------------------------------------
// Cost Savings Chart component (Clean Modern style)
// ----------------------------------------------------
function CostSavingsChart({ data, referenceCost }: { data: { name: string, totalCost: number, shipDays: number }[], referenceCost: number }) {
  const { formatPrice } = useCurrency();
  if (!data || data.length === 0) return null;

  const maxCost = Math.max(...data.map(d => d.totalCost));
  const bestSupplier = data[0]; // Sorted lowest cost first
  const savings = referenceCost - bestSupplier.totalCost;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col h-full justify-between relative overflow-hidden shadow-xs">
      <div className="relative z-10 text-left">
        <div className="flex items-center justify-between">
          <h3 className="m-0 text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
            Consolidated Cost Simulation
          </h3>
          <span className="text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">V2.0</span>
        </div>
        <p className="text-xs text-slate-500 mt-1.5 leading-normal">Comparative analysis of active BOM across approved supplier channels</p>
        
        {savings > 0 && (
          <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg flex items-center gap-2.5 mt-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
            <span className="text-xs font-medium text-emerald-800">
              Optimal consolidator: <strong className="font-semibold">{bestSupplier.name}</strong> (saves {formatPrice(savings)})
            </span>
          </div>
        )}
      </div>

      <div className="w-full h-[150px] relative mt-6 z-10">
        <svg viewBox="0 0 1000 150" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          {/* Grid lines */}
          {[0, 0.5, 1].map((tick, i) => {
            const y = 120 - (tick * 120);
            const val = maxCost * tick;
            return (
              <g key={i}>
                <line x1="60" y1={y} x2="1000" y2={y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <text x="50" y={y + 3} textAnchor="end" className="text-[10px] fill-slate-400 font-sans font-medium">
                  ${val.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((d, i) => {
            const barWidth = 64;
            const spacing = (940 - (data.length * barWidth)) / (data.length + 1);
            const x = 60 + spacing + i * (barWidth + spacing);
            const height = Math.max(8, (d.totalCost / maxCost) * 120);
            const y = 120 - height;
            const isBest = i === 0;
            const isRef = d.name === 'McMaster-Carr';
            
            return (
              <g key={d.name} className="group/bar cursor-pointer">
                {/* Visual bar backdrop */}
                <rect 
                  x={x} 
                  y={0} 
                  width={barWidth} 
                  height={120} 
                  className="fill-transparent group-hover/bar:fill-slate-50 transition-colors"
                />
                
                {/* SVG Bar */}
                <rect 
                  x={x} 
                  y={y} 
                  width={barWidth} 
                  height={height} 
                  rx="4"
                  className={`transition-all duration-300 ${
                    isBest 
                      ? 'fill-emerald-500/20 stroke-emerald-500 stroke-2' 
                      : isRef 
                        ? 'fill-slate-100 stroke-slate-350 stroke-1' 
                        : 'fill-blue-500/10 stroke-blue-500 stroke-1.5'
                  }`}
                />
                
                {/* Supplier name labels */}
                <text 
                  x={x + barWidth / 2} 
                  y="138" 
                  textAnchor="middle" 
                  className={`text-[10px] font-sans font-semibold tracking-wide ${
                    isBest ? 'fill-emerald-700' : isRef ? 'fill-slate-400' : 'fill-slate-650'
                  }`}
                >
                  {d.name.substring(0, 9)}
                </text>

                {/* Price indicators on top of the bars on hover */}
                <text 
                  x={x + barWidth / 2} 
                  y={y - 8} 
                  textAnchor="middle" 
                  className={`text-[10px] font-sans font-bold ${
                    isBest ? 'fill-emerald-600' : 'fill-slate-500'
                  } opacity-0 group-hover/bar:opacity-100 transition-opacity`}
                >
                  ${d.totalCost.toFixed(0)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Category glyph — simple line-art per fastener family
// (replaces stock photos of the wrong hardware)
// ----------------------------------------------------
function FastenerGlyph({ type }: { type: string }) {
  const t = type.toLowerCase();
  const isScrew = t.includes('screw') || t.includes('bolt');
  const isNut = t.includes('nut');
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {isScrew ? (
        <g>
          <path d="M8 16 L15 16 L17 20 L15 24 L8 24 L6 20 Z" fill="#f1f5f9" />
          <rect x="17" y="17.5" width="23" height="5" fill="#fff" />
          {[22, 26, 30, 34, 38].map(x => <line key={x} x1={x} y1="17.5" x2={x - 1.5} y2="22.5" strokeWidth="1" />)}
        </g>
      ) : isNut ? (
        <g>
          <path d="M17 12 L31 12 L38 24 L31 36 L17 36 L10 24 Z" fill="#f1f5f9" />
          <circle cx="24" cy="24" r="6.5" fill="#fff" />
        </g>
      ) : (
        <g>
          <circle cx="24" cy="24" r="13" fill="#f1f5f9" />
          <circle cx="24" cy="24" r="5.5" fill="#fff" />
        </g>
      )}
    </svg>
  );
}

// ----------------------------------------------------
// Hardware Card component (Clean Spec style)
// ----------------------------------------------------
function HardwareCard({ part }: { part: Part; key?: string }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/parts/${encodeURIComponent(part.partNumber)}`)}
      className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:border-slate-400 hover:shadow-xs active:scale-[0.99] transition-all duration-200 cursor-pointer group relative text-left"
    >
      <div className="flex gap-4 items-start relative z-10">
        {/* Left image icon inside technical border */}
        <div className="w-14 h-14 rounded-md bg-slate-50 flex items-center justify-center shrink-0 border border-slate-150 p-1.5 overflow-hidden">
          <FastenerGlyph type={part.type} />
        </div>

        {/* Middle text specifications */}
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono font-bold text-slate-900 text-xs tracking-wider truncate">{part.partNumber}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
          </div>
          <span className="text-[10px] font-sans uppercase tracking-wider text-slate-400 font-bold truncate">{part.type}</span>
          <span className="text-xs font-sans font-semibold text-slate-700 mt-1">{part.thread} {part.length !== 'N/A' ? `x ${part.length}` : ''}</span>
        </div>
      </div>

      {/* Progress Metric details */}
      <div className="mt-5 flex flex-col gap-1.5 relative z-10">
        <div className="flex items-center justify-between text-[10px] font-sans font-bold uppercase tracking-wider">
          <span className="text-slate-450">Approved Suppliers</span>
          <span className="text-slate-750">5 Channels</span>
        </div>
        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-slate-900 rounded-full" style={{ width: '85%' }}></div>
        </div>
        <div className="flex items-center justify-between text-[10px] font-sans font-semibold mt-0.5">
          <span className="text-slate-450">Est. list ${part.mcmasterPrice.toFixed(2)}</span>
          {part.mcmaster && <span className="text-slate-500 font-bold" title="Verified McMaster-Carr cross-reference">MC cross ✓</span>}
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-sans uppercase tracking-wider text-slate-400 relative z-10 font-bold">
        <span className="truncate max-w-[150px]">{part.standard}</span>
        <div className="flex items-center gap-1 text-slate-900 font-bold group-hover:translate-x-1 transition-transform">
          <span>View Specs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Main Home/Dashboard Component
// ----------------------------------------------------
export function Home() {
  const { formatPrice } = useCurrency();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'finder';

  const navigate = useNavigate();
  const { bomList, updateBomQty, deleteBomItem, exportBOM, exportPDF, importCSV } = useBOM();

  // Search states for the page-level center search bar
  const [query, setQuery] = useState('');
  const [dropdownResults, setDropdownResults] = useState<{ item: Part; score?: number }[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(-1);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setActiveDropdownIndex(-1);

    if (!val.trim()) {
      setShowDropdown(false);
      setDropdownResults([]);
      return;
    }

    const results = fuse.search(val);
    if (results.length > 0) {
      setDropdownResults(results.slice(0, 5) as { item: Part; score?: number }[]);
    } else {
      setDropdownResults([]);
    }
    setShowDropdown(true);
  };

  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setShowDropdown(false);
    
    let results = fuse.search(searchQuery);
    let item: Part;
    if (results.length > 0 && results[0].score! < 0.5) {
      item = results[0].item;
    } else {
      item = parseCustomPart(searchQuery);
    }
    
    navigate(`/parts/${encodeURIComponent(item.partNumber)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeDropdownIndex >= 0 && dropdownResults[activeDropdownIndex]) {
        performSearch(dropdownResults[activeDropdownIndex].item.partNumber);
      } else {
        performSearch(query);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (dropdownResults.length > 0 || (query && dropdownResults.length === 0)) {
        setActiveDropdownIndex((prev) => 
          (prev + 1) % (dropdownResults.length > 0 ? dropdownResults.length : 1)
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (dropdownResults.length > 0 || (query && dropdownResults.length === 0)) {
        const len = dropdownResults.length > 0 ? dropdownResults.length : 1;
        setActiveDropdownIndex((prev) => (prev - 1 + len) % len);
      }
    }
  };

  const triggerSearch = (q: string) => {
    setQuery(q);
    performSearch(q);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importCSV(file);
      e.target.value = '';
    }
  };

  const totalBomCost = bomList.reduce((sum, item) => sum + (item.qty * item.unitCost), 0);
  const totalItems = bomList.length;
  const totalQty = bomList.reduce((acc, item) => acc + item.qty, 0);

  // "Quote my BOM" lead capture: zero-backend — prefilled mailto, with the
  // full BOM copied to the clipboard (mailto bodies get truncated by clients).
  const [quoteCopied, setQuoteCopied] = useState(false);
  const requestQuote = () => {
    const lines = bomList.map(i =>
      `${i.qty} × ${i.partNumber} — ${i.description} (${i.material}) — preferred supplier: ${i.supplier}`);
    const body = [
      'Hi Jay,', '', 'Please quote the following BOM:', '',
      ...lines, '',
      `Tool-estimated total: $${totalBomCost.toFixed(2)}`, '',
      'Name:', 'Company:', 'Ship-to (city/country):', 'Target date:', '',
    ].join('\n');
    navigator.clipboard?.writeText(body).catch(() => {});
    setQuoteCopied(true);
    setTimeout(() => setQuoteCopied(false), 3000);
    const mailBody = lines.length > 40
      ? body.split('\n').slice(0, 8).join('\n') + '\n… (full BOM is on your clipboard — paste it here)'
      : body;
    window.location.href = `mailto:jayaram.h@afterconcept.com?subject=${encodeURIComponent(`BOM quote request (${totalItems} lines)`)}&body=${encodeURIComponent(mailBody)}`;
  };

  // Compute simulated costs for all suppliers
  const supplierCosts = useMemo(() => {
    if (bomList.length === 0) return [];
    const allSuppliers = [{ name: 'McMaster-Carr', discount: 1.0, shipDays: 1 }, ...suppliers];
    
    return allSuppliers.map(sup => {
      let total = 0;
      bomList.forEach(item => {
        const searchRes = fuse.search(item.partNumber);
        let basePrice = 1.00;
        if (searchRes.length > 0 && searchRes[0].score! < 0.5) {
          basePrice = searchRes[0].item.mcmasterPrice;
        } else {
          basePrice = parseCustomPart(item.partNumber).mcmasterPrice;
        }
        total += (basePrice * sup.discount) * item.qty;
      });
      return { name: sup.name, totalCost: total, shipDays: sup.shipDays || 1 };
    }).sort((a, b) => a.totalCost - b.totalCost);
  }, [bomList]);

  const mcmasterCost = supplierCosts.find(s => s.name === 'McMaster-Carr')?.totalCost || 0;
  const estSavings = mcmasterCost > totalBomCost ? mcmasterCost - totalBomCost : 0;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] p-8 overflow-y-auto">
      {/* ----------------------------------------------------
          TAB 1: DASHBOARD / OVERVIEW
          ---------------------------------------------------- */}
      {activeTab === 'dashboard' && (
        <div className="flex flex-col gap-8 w-full max-w-[1200px] mx-auto text-left">
          {/* Heading */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 m-0">Sourcing Overview</h1>
            <p className="text-slate-500 m-0 mt-1 text-sm">Consolidated analytics and routing optimization for queued bills of materials.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: BOM Cost */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-slate-350 transition-colors relative overflow-hidden shadow-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-450">BOM Total Cost</span>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-semibold tracking-tight text-slate-900">{formatPrice(totalBomCost)}</span>
                <span className="block text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider">Across 5 vendor routes</span>
              </div>
            </div>

            {/* Card 2: Items count */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-slate-350 transition-colors relative overflow-hidden shadow-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-450">Unique Items</span>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-semibold tracking-tight text-slate-900">{totalItems}</span>
                <span className="block text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider">{totalQty} total fasteners queued</span>
              </div>
            </div>

            {/* Card 3: Est Savings */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-slate-350 transition-colors relative overflow-hidden shadow-xs">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-500"></div>
              <div className="flex justify-between items-center text-emerald-600">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Estimated Savings</span>
                <span className="text-[10px] font-semibold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">BOM-OPT</span>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-semibold tracking-tight text-emerald-600">{formatPrice(estSavings)}</span>
                <span className="block text-[10px] font-medium text-emerald-500 mt-1 uppercase tracking-wider">vs McMaster catalog list</span>
              </div>
            </div>

            {/* Card 4: Catalog */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-slate-350 transition-colors relative overflow-hidden shadow-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-450">Indexed Parts</span>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-semibold tracking-tight text-slate-900">{db.length.toLocaleString()}</span>
                <span className="block text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider">Searchable catalog entries</span>
              </div>
            </div>
          </div>

          {/* Bento grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left section: Active BOM panel */}
            <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between relative">
              <div>
                <h3 className="m-0 text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>
                  Active Bill of Materials
                </h3>
                <p className="text-xs text-slate-450 mt-1">Consolidated specifications pending fulfillment</p>
              </div>

              {bomList.length > 0 ? (
                <div className="flex-1 flex flex-col gap-4 mt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-450 text-[10px] font-semibold uppercase tracking-wider">
                          <th className="pb-3">Part Identification</th>
                          <th className="pb-3 text-right">Units</th>
                          <th className="pb-3 text-right">Est. Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bomList.slice(0, 3).map((item, i) => (
                          <tr key={i} className="border-b border-slate-100 last:border-none hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 text-xs font-mono font-bold text-slate-800 tracking-wider">{item.partNumber}</td>
                            <td className="py-3 text-xs text-slate-650 text-right font-medium">{item.qty}</td>
                            <td className="py-3 text-xs text-slate-900 text-right font-semibold">{formatPrice(item.qty * item.unitCost)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {bomList.length > 3 && (
                    <div className="text-[11px] text-slate-500 text-center font-medium mt-1 bg-slate-50 py-2 border border-slate-150 rounded">
                      And {bomList.length - 3} additional items configured in workspace
                    </div>
                  )}

                  <div className="flex gap-3 mt-4 pt-4 border-t border-slate-150">
                    <Link to="/?tab=bom" className="no-underline flex-1">
                      <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 py-2 px-4 rounded-md text-xs font-semibold cursor-pointer transition-all active:scale-[0.98]">
                        Manage BOM Specs
                      </button>
                    </Link>
                    <button
                      onClick={requestQuote}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white border-none py-2 px-4 rounded-md text-xs font-semibold cursor-pointer transition-all active:scale-[0.98] shadow-xs"
                    >
                      Request BOM Quote
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-8 mt-4 border border-dashed border-slate-200 rounded-lg">
                  <div className="w-10 h-10 bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-400 mb-4 rounded-lg">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h4 className="m-0 text-sm font-semibold text-slate-800">Workspace BOM is empty</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-[280px] leading-relaxed">Add components to run vendor-equivalent cost simulations</p>
                  <Link to="/?tab=finder" className="no-underline mt-5">
                    <button className="bg-slate-900 hover:bg-slate-800 text-white border-none py-2 px-5 rounded-md text-xs font-semibold cursor-pointer transition-all active:scale-[0.98] shadow-xs">
                      Browse catalog
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Right section: SVG chart */}
            <div className="lg:col-span-2 shadow-xs rounded-xl bg-white border border-slate-200 relative">
              {bomList.length > 0 ? (
                <CostSavingsChart data={supplierCosts} referenceCost={mcmasterCost} />
              ) : (
                <div className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[220px]">
                  <div className="w-10 h-10 bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-450 mb-3 rounded-lg">
                    <Percent className="w-5 h-5" />
                  </div>
                  <h4 className="m-0 text-sm font-semibold text-slate-800">No Simulation Data</h4>
                  <p className="text-xs text-slate-450 mt-1.5 max-w-[200px]">Simulations require at least 1 item in workspace</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 2: PART FINDER (Hardware Database Grid)
          ---------------------------------------------------- */}
      {activeTab === 'finder' && (
        <div className="flex flex-col gap-8 w-full max-w-[1200px] mx-auto">
          {/* Header instructions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 m-0">Part Finder</h1>
              <p className="text-slate-500 m-0 mt-1 text-sm">Configure approved standard fasteners and compare vendor equivalents.</p>
            </div>
            
            <div className="bg-slate-900 text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 self-start md:self-auto shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-pulse"></span>
              <span>Index Active (⌘K)</span>
            </div>
          </div>

          {/* Search Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center w-full relative overflow-visible shadow-xs">
            <h2 className="text-lg font-semibold text-slate-900 m-0 mb-1.5">Search Hardware Database</h2>
            <p className="text-xs text-slate-500 m-0 mb-6 max-w-md">Search standard fasteners, nuts, bolts, washers, or spec terms to identify parts instantly</p>
            
            <div className="relative w-full max-w-xl">
              <div className="flex items-center bg-slate-50 rounded-lg p-1 px-3 border border-slate-200 focus-within:bg-white focus-within:ring-1 focus-within:ring-slate-950 focus-within:border-slate-950 transition-all">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input 
                  type="text" 
                  className="flex-1 border-none py-2 px-3 text-xs bg-transparent outline-none text-slate-900"
                  placeholder="Enter McMaster part number or specifications..." 
                  autoComplete="off" 
                  spellCheck="false"
                  value={query}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => { if(query) setShowDropdown(true) }}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                />
                <button 
                  className="bg-slate-900 hover:bg-slate-800 text-white border-none py-2 px-6 rounded-md text-xs font-semibold cursor-pointer transition-all active:scale-[0.98] shadow-sm"
                  onClick={() => performSearch(query)}
                >
                  Search
                </button>
              </div>

              {/* Search Results Dropdown inside the Card */}
              {showDropdown && (
                <div ref={dropdownRef} className="absolute top-[calc(100%+0.25rem)] left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-md z-20 max-h-[250px] overflow-y-auto text-left py-1 animate-in fade-in duration-100">
                  {dropdownResults.length > 0 ? (
                    dropdownResults.map((res, i) => (
                      <div 
                        key={i}
                        className={`px-4 py-3 cursor-pointer border-b border-slate-100 text-xs text-slate-500 last:border-b-0 flex items-center justify-between transition-colors ${activeDropdownIndex === i ? 'bg-slate-50 text-slate-900' : 'hover:bg-slate-50 hover:text-slate-900'}`}
                        onMouseDown={() => performSearch(res.item.partNumber)}
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono font-bold text-slate-950 text-xs tracking-wider">{res.item.partNumber}</span>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{res.item.type} &middot; {res.item.thread} x {res.item.length !== 'N/A' ? res.item.length : 'N/A'}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))
                  ) : query ? (
                    <div 
                      className="px-4 py-3 text-xs text-slate-450 hover:bg-slate-50 hover:text-slate-900 cursor-pointer flex items-center justify-between font-medium"
                      onMouseDown={() => performSearch(query)}
                    >
                      <span>No exact match. Click to parse "{query}" dynamically...</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Quick searches shortcuts */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400 mr-2">Shortcuts:</span>
              {['91290A115', 'DIN912-M4X12', 'DIN934-M6', 'M5 socket head cap screw'].map(pn => (
                <button 
                  key={pn} 
                  onClick={() => triggerSearch(pn)} 
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs px-3 py-1 rounded-md cursor-pointer transition-all active:scale-[0.98] shadow-xs"
                >
                  {pn}
                </button>
              ))}
            </div>
          </div>

          <div className="border-b border-slate-200/60 my-2"></div>

          {/* Grid of hardware cards — verified McMaster crosses first, capped;
              the full catalog is reachable through search. */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {db.slice(0, 24).map((part) => (
              <HardwareCard key={part.partNumber} part={part} />
            ))}
          </div>
          <div className="text-center text-xs text-slate-400 font-medium pb-4">
            Showing 24 of {db.length.toLocaleString()} indexed parts — use search to find the rest.
          </div>
        </div>
      )}      {/* ----------------------------------------------------
          TAB 3: BOM MANAGER TABLE
          ---------------------------------------------------- */}
      {activeTab === 'bom' && (
        <div className="flex flex-col gap-8 w-full max-w-[1200px] mx-auto text-left">
          {/* Quote Hero */}
          <div className="bg-slate-900 text-white rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xs">
            <div className="z-10 text-left">
              <h3 className="m-0 text-white text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                BOM Quote & Export
              </h3>
              <p className="m-0 text-xs text-slate-300 mt-1.5 max-w-[500px] leading-relaxed">
                Send the active BOM for a manual sourcing quote, or export it for your own procurement workflow.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 z-10">
              <button
                className="bg-emerald-500 hover:bg-emerald-400 text-white border-none py-2.5 px-6 rounded-md text-xs font-semibold cursor-pointer transition-all active:scale-[0.98] whitespace-nowrap shadow-sm"
                onClick={requestQuote}
                title="Opens an email with your BOM prefilled (also copied to clipboard)"
              >
                {quoteCopied ? 'BOM copied — email opened' : 'Request Sourcing Quote'}
              </button>
            </div>
          </div>

          {/* Table Header controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="m-0 text-lg font-semibold text-slate-900">
              Active BOM Registry
            </h2>
            <div className="flex gap-2">
              <input type="file" id="csvFileInput" accept=".csv,.txt" className="hidden" onChange={handleFileChange} />
              <button 
                className="bg-white border border-slate-200 py-2 px-3.5 rounded-md text-xs font-medium text-slate-700 cursor-pointer hover:bg-slate-50 transition-all active:scale-[0.98] shadow-xs flex items-center gap-1.5"
                onClick={() => document.getElementById('csvFileInput')?.click()}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" /> Import CSV
              </button>
              <button 
                className="bg-white border border-slate-200 py-2 px-3.5 rounded-md text-xs font-medium text-slate-700 cursor-pointer hover:bg-slate-50 transition-all active:scale-[0.98] shadow-xs flex items-center gap-1.5"
                onClick={exportBOM}
              >
                <Download className="w-3.5 h-3.5 text-slate-400" /> Export CSV
              </button>
              <button 
                className="bg-slate-900 text-white border-none py-2 px-3.5 rounded-md text-xs font-semibold cursor-pointer hover:bg-slate-800 transition-all active:scale-[0.98] shadow-xs flex items-center gap-1.5"
                onClick={exportPDF}
              >
                <Download className="w-3.5 h-3.5 text-white" /> Save PDF
              </button>
            </div>
          </div>

          {/* The Main BOM list table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left m-0 min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-450 text-[10px] font-semibold uppercase tracking-wider">
                    <th className="p-4 pl-6">Part Identification</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Supplier Routing</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4 text-right">Unit Price</th>
                    <th className="p-4 text-right">Extended Price</th>
                    <th className="p-4 pr-6 w-12"></th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {bomList.length > 0 ? (
                    bomList.map((item, i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/30 transition-colors">
                        <td className="p-4 pl-6 font-mono font-bold text-slate-900 tracking-wider whitespace-nowrap">{item.partNumber}</td>
                        <td className="p-4 text-slate-500 font-medium truncate max-w-[250px]" title={item.description}>{item.description}</td>
                        <td className="p-4 text-slate-500">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold border border-slate-200">{item.supplier}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 w-fit shadow-xs">
                            <button 
                              className="bg-transparent border-none text-slate-400 hover:text-slate-950 p-1 cursor-pointer hover:bg-slate-50 transition-colors"
                              onClick={() => updateBomQty(i, Math.max(1, item.qty - 1))}
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <input 
                              type="number" 
                              className="w-10 text-center border-none bg-transparent font-mono text-xs font-bold outline-none" 
                              value={item.qty} 
                              min="1" 
                              onChange={(e) => updateBomQty(i, parseInt(e.target.value) || 1)} 
                            />
                            <button 
                              className="bg-transparent border-none text-slate-400 hover:text-slate-950 p-1 cursor-pointer hover:bg-slate-50 transition-colors"
                              onClick={() => updateBomQty(i, item.qty + 1)}
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-right text-slate-500 font-semibold tracking-wider font-mono">{formatPrice(item.unitCost)}</td>
                        <td className="p-4 font-bold text-slate-900 text-right tracking-wider font-mono">{formatPrice(item.qty * item.unitCost)}</td>
                        <td className="p-4 pr-6 text-right">
                          <button 
                            className="text-slate-350 bg-transparent border-none p-1.5 cursor-pointer hover:text-red-650 hover:bg-red-50 transition-colors rounded-md" 
                            onClick={() => deleteBomItem(i)} 
                            title="Delete item"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center p-12">
                        <div className="w-10 h-10 bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-400 mx-auto mb-4 rounded-lg">
                          <Layers className="w-5 h-5" />
                        </div>
                        <h4 className="m-0 text-slate-800 font-semibold text-xs">No active queued BOM items</h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-[280px] mx-auto leading-relaxed">Search components and add them to compare pricing equivalents.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* BOM Totals summary row */}
          {bomList.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-2">
              <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs relative">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-450">Unique Items</span>
                <span className="text-xl font-bold text-slate-900 mt-1.5">{totalItems}</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs relative">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-450">Total Quantity</span>
                <span className="text-xl font-bold text-slate-900 mt-1.5">{totalQty}</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs relative">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Simulated Savings</span>
                <span className="text-xl font-bold text-emerald-600 mt-1.5">${estSavings.toFixed(2)}</span>
              </div>
              <div className="bg-slate-900 border-none rounded-xl p-5 flex flex-col justify-between shadow-sm relative text-white">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Consolidated Cost</span>
                <span className="text-xl font-bold text-white mt-1.5">${totalBomCost.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
export default Home;
