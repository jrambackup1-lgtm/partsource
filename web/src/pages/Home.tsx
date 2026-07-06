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
import { fuse, parseCustomPart, Part, suppliers, db, hashCode } from '../lib/decoder';
import { useBOM } from '../hooks/useBOM';
import { useCurrency } from '../contexts/CurrencyContext';
import { BrokerageModal } from '../components/BrokerageModal';
import { OrderCard } from '../components/OrderCard';

// ----------------------------------------------------
// Cost Savings Chart component (Inline SVG)
// ----------------------------------------------------
function CostSavingsChart({ data, referenceCost }: { data: { name: string, totalCost: number, shipDays: number }[], referenceCost: number }) {
  const { formatPrice } = useCurrency();
  if (!data || data.length === 0) return null;

  const maxCost = Math.max(...data.map(d => d.totalCost));
  const bestSupplier = data[0]; // Sorted lowest cost first
  const savings = referenceCost - bestSupplier.totalCost;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col h-full justify-between">
      <div>
        <h3 className="m-0 text-xs font-bold text-slate-400 uppercase tracking-wider">
          Consolidated Cost Simulation
        </h3>
        <p className="text-[11px] text-slate-500 mt-1">BOM values simulated across approved vendors.</p>
        
        {savings > 0 && (
          <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-center gap-2.5 mt-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[11px] font-bold text-emerald-800 leading-normal">
              Best value: {bestSupplier.name} (save {formatPrice(savings)})
            </span>
          </div>
        )}
      </div>

      <div className="w-full h-[150px] relative mt-6">
        <svg viewBox="0 0 1000 150" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          {/* Grid lines */}
          {[0, 0.5, 1].map((tick, i) => {
            const y = 120 - (tick * 120);
            const val = maxCost * tick;
            return (
              <g key={i}>
                <line x1="60" y1={y} x2="1000" y2={y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <text x="50" y={y + 3} textAnchor="end" className="text-[10px] fill-slate-400 font-mono font-bold">
                  ${val.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((d, i) => {
            const barWidth = 60;
            const spacing = (940 - (data.length * barWidth)) / (data.length + 1);
            const x = 60 + spacing + i * (barWidth + spacing);
            const height = Math.max(5, (d.totalCost / maxCost) * 120);
            const y = 120 - height;
            const isBest = i === 0;
            const isRef = d.name === 'McMaster-Carr';
            
            return (
              <g key={d.name} className="group/bar cursor-pointer">
                <rect 
                  x={x} 
                  y={y} 
                  width={barWidth} 
                  height={height} 
                  rx="6"
                  className={`${isBest ? 'fill-slate-900' : isRef ? 'fill-slate-200' : 'fill-slate-400'} transition-all duration-300 hover:brightness-95`}
                />
                <text 
                  x={x + barWidth / 2} 
                  y="140" 
                  textAnchor="middle" 
                  className={`text-[10px] font-bold ${isBest ? 'fill-slate-900' : 'fill-slate-400'}`}
                >
                  {d.name.substring(0, 8)}
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
// Hardware Card component (Pillio style)
// ----------------------------------------------------
function HardwareCard({ part }: { part: Part; key?: string }) {
  const navigate = useNavigate();
  const hash = hashCode(part.partNumber);
  const discountPct = Math.round((1 - 0.70) * 100);

  return (
    <div 
      onClick={() => navigate(`/parts/${encodeURIComponent(part.partNumber)}`)}
      className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
    >
      <div className="flex gap-4 items-start">
        {/* Left image icon */}
        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden">
          <img 
            src={
              part.type.toLowerCase().includes('screw') || part.type.toLowerCase().includes('bolt') 
                ? 'https://images.unsplash.com/photo-1588610502120-77a87e5b2203?auto=format&fit=crop&q=80&w=100'
                : 'https://images.unsplash.com/photo-1544413660-299165566b1d?auto=format&fit=crop&q=80&w=100'
            } 
            alt={part.partNumber}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Middle text specifications */}
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-slate-900 text-sm mono truncate">{part.partNumber}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_6px_rgba(16,185,129,0.5)]"></span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 truncate">{part.type}</span>
          <span className="text-xs font-bold text-slate-700 mt-1 mono">{part.thread} {part.length !== 'N/A' ? `x ${part.length}` : ''}</span>
        </div>
      </div>

      {/* Progress Metric details */}
      <div className="mt-4 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className="text-slate-400">Distributors</span>
          <span className="text-slate-700">5 Approved</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-slate-900 rounded-full" style={{ width: '85%' }}></div>
        </div>
        <div className="flex items-center justify-between text-[10px] font-medium text-slate-400 mt-0.5">
          <span>McMaster price: ${part.mcmasterPrice.toFixed(2)}</span>
          <span className="text-emerald-600 font-semibold">Save up to {discountPct}%</span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400">
        <span className="truncate max-w-[150px] font-semibold">{part.standard}</span>
        <div className="flex items-center gap-1 text-slate-900 font-bold group-hover:translate-x-1 transition-transform">
          <span>Details</span>
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

  const [isBrokerageModalOpen, setIsBrokerageModalOpen] = useState(false);
  const navigate = useNavigate();
  const { bomList, orders, updateBomQty, deleteBomItem, exportBOM, exportPDF, importCSV, placeOrder } = useBOM();

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
        <div className="flex flex-col gap-8 w-full max-w-[1200px] mx-auto">
          {/* Heading */}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 m-0">Sourcing Dashboard</h1>
            <p className="text-slate-500 m-0 mt-1 font-semibold text-sm">Real-time consolidated analytics for your bills of materials.</p>
          </div>

          {/* Stats Grid (Pillio style) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: BOM Cost */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-900"></div>
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total BOM Cost</span>
                <DollarSign className="w-4 h-4 text-slate-300" />
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black tracking-tight text-slate-900 mono">{formatPrice(totalBomCost)}</span>
                <span className="block text-[10px] font-semibold text-slate-400 mt-1">Simulated across 5 approved vendors</span>
              </div>
            </div>

            {/* Card 2: Items count */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-900"></div>
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">BOM Items</span>
                <Layers className="w-4 h-4 text-slate-300" />
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black tracking-tight text-slate-900 mono">{totalItems}</span>
                <span className="block text-[10px] font-semibold text-slate-400 mt-1">{totalQty} total units in active list</span>
              </div>
            </div>

            {/* Card 3: Est Savings */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
              <div className="flex justify-between items-center text-emerald-600">
                <span className="text-xs font-bold uppercase tracking-wider">Estimated Savings</span>
                <Percent className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black tracking-tight text-emerald-600 mono">{formatPrice(estSavings)}</span>
                <span className="block text-[10px] font-bold text-emerald-500 mt-1">Compared to McMaster list price</span>
              </div>
            </div>

            {/* Card 4: Orders */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-900"></div>
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Brokerage Orders</span>
                <Package className="w-4 h-4 text-slate-300" />
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black tracking-tight text-slate-900 mono">{orders.length}</span>
                <span className="block text-[10px] font-semibold text-slate-400 mt-1">Consolidation consignments in system</span>
              </div>
            </div>
          </div>

          {/* Bento grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left section: Active BOM panel */}
            <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="m-0 text-base font-bold text-slate-950">Active Bill of Materials</h3>
                <p className="text-xs text-slate-400 m-0 mt-0.5">Quick overview of items currently queued for sourcing.</p>
              </div>

              {bomList.length > 0 ? (
                <div className="flex-1 flex flex-col gap-4 mt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="pb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Part</th>
                          <th className="pb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Qty</th>
                          <th className="pb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bomList.slice(0, 3).map((item, i) => (
                          <tr key={i} className="border-b border-slate-50 last:border-none hover:bg-slate-50 transition-colors">
                            <td className="py-3 text-xs font-bold text-slate-900 mono">{item.partNumber}</td>
                            <td className="py-3 text-xs text-slate-500 text-right font-semibold mono">{item.qty}</td>
                            <td className="py-3 text-xs text-slate-900 text-right font-bold mono">{formatPrice(item.qty * item.unitCost)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {bomList.length > 3 && (
                    <div className="text-xs text-slate-400 text-center font-medium mt-1">
                      And {bomList.length - 3} more items...
                    </div>
                  )}

                  <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                    <Link to="/?tab=bom" className="no-underline flex-1">
                      <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all">
                        Open BOM Manager
                      </button>
                    </Link>
                    <button 
                      onClick={() => setIsBrokerageModalOpen(true)}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white border-none py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm"
                    >
                      Fulfill Consolidated BOM
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 mt-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h4 className="m-0 text-sm font-bold text-slate-800">Your BOM list is empty</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-[280px] leading-relaxed">Add components to your list from the catalog to run vendor price comparisons.</p>
                  <Link to="/?tab=finder" className="no-underline mt-4">
                    <button className="bg-slate-900 hover:bg-slate-800 text-white border-none py-2 px-5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm">
                      Go to Part Finder
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Right section: SVG chart */}
            <div className="lg:col-span-2 shadow-sm rounded-2xl overflow-hidden bg-white border border-slate-200">
              {bomList.length > 0 ? (
                <CostSavingsChart data={supplierCosts} referenceCost={mcmasterCost} />
              ) : (
                <div className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[220px]">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-3">
                    <Percent className="w-5 h-5" />
                  </div>
                  <h4 className="m-0 text-xs font-bold text-slate-800 uppercase tracking-wider">No Simulation Data</h4>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">Simulations require at least 1 item in your BOM list.</p>
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
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 m-0">Part Finder</h1>
              <p className="text-slate-500 m-0 mt-1 font-semibold text-sm">Select an approved standard fastener below to configure vendor equivalents.</p>
            </div>
            
            <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 self-start md:self-auto shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Global Search Active: Press ⌘ K to search anything</span>
            </div>
          </div>

          {/* Majestic Immersive Center Search Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center w-full relative overflow-visible shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight m-0 mb-2">Search Industrial Hardware</h2>
            <p className="text-xs text-slate-400 font-semibold m-0 mb-6 max-w-md">Search standard fasteners, nuts, bolts, washers, or type specifications to parse them dynamically.</p>
            
            <div className="relative w-full max-w-xl">
              <div className="flex items-center bg-slate-50 rounded-xl p-1 px-3 border border-slate-200 focus-within:bg-white focus-within:shadow-[0_0_0_2px_#0f172a] focus-within:border-transparent transition-all">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input 
                  type="text" 
                  className="flex-1 border-none py-2 px-3 text-sm bg-transparent outline-none text-slate-900 font-sans"
                  placeholder="Search by McMaster part number, specs..." 
                  autoComplete="off" 
                  spellCheck="false"
                  value={query}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => { if(query) setShowDropdown(true) }}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                />
                <button 
                  className="bg-slate-900 hover:bg-slate-800 text-white border-none py-2 px-6 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm"
                  onClick={() => performSearch(query)}
                >
                  Find
                </button>
              </div>

              {/* Search Results Dropdown inside the Card */}
              {showDropdown && (
                <div ref={dropdownRef} className="absolute top-[calc(100%+0.5rem)] left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg z-20 max-h-[250px] overflow-y-auto text-left py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  {dropdownResults.length > 0 ? (
                    dropdownResults.map((res, i) => (
                      <div 
                        key={i}
                        className={`px-4 py-3.5 cursor-pointer border-b border-slate-50 text-xs text-slate-500 last:border-b-0 flex items-center justify-between transition-colors ${activeDropdownIndex === i ? 'bg-slate-50 text-slate-900' : 'hover:bg-slate-50 hover:text-slate-900'}`}
                        onMouseDown={() => performSearch(res.item.partNumber)}
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-slate-950 text-sm mono">{res.item.partNumber}</span>
                          <span className="text-[11px] font-medium text-slate-400">{res.item.type} &middot; {res.item.thread} x {res.item.length !== 'N/A' ? res.item.length : 'N/A'}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))
                  ) : query ? (
                    <div 
                      className="px-4 py-3.5 text-xs text-slate-400 italic hover:bg-slate-50 hover:text-slate-900 cursor-pointer flex items-center justify-between"
                      onMouseDown={() => performSearch(query)}
                    >
                      <span>No exact match. Click to parse "{query}" dynamically...</span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Quick searches shortcuts */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-2">Common Searches:</span>
              {['91251A242', '91290A115', '91247A142', '92210A110', '90596A005', '91166A005'].map(pn => (
                <button 
                  key={pn} 
                  onClick={() => triggerSearch(pn)} 
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors mono shadow-sm"
                >
                  {pn}
                </button>
              ))}
            </div>
          </div>

          <div className="border-b border-slate-200/60 my-2"></div>

          {/* Grid of hardware cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {db.map((part) => (
              <HardwareCard key={part.partNumber} part={part} />
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 3: BOM MANAGER TABLE
          ---------------------------------------------------- */}
      {activeTab === 'bom' && (
        <div className="flex flex-col gap-8 w-full max-w-[1200px] mx-auto">
          {/* Fulfill Hero */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-md">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
            <div className="z-10 text-left">
              <h3 className="m-0 text-white text-lg font-bold">Consolidated Brokerage Fulfillment</h3>
              <p className="m-0 text-xs text-slate-400 mt-1 max-w-[500px] leading-relaxed">
                Submit your active BOM to have us consolidate your orders, audit compliance certificates, and ship everything in a single box.
              </p>
            </div>
            <button 
              className="bg-white hover:bg-slate-100 text-slate-900 border-none py-2.5 px-6 rounded-xl text-xs font-extrabold cursor-pointer transition-all whitespace-nowrap z-10 shadow-sm"
              onClick={() => setIsBrokerageModalOpen(true)}
            >
              Fulfill Consolidated BOM
            </button>
          </div>

          {/* Table Header controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="m-0 text-xl font-extrabold text-slate-900">Active BOM List</h2>
            <div className="flex gap-2">
              <input type="file" id="csvFileInput" accept=".csv,.txt" className="hidden" onChange={handleFileChange} />
              <button 
                className="bg-white border border-slate-200 py-2 px-4 rounded-xl text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1.5"
                onClick={() => document.getElementById('csvFileInput')?.click()}
              >
                <FileSpreadsheet className="w-4 h-4 text-slate-400" /> Import CSV
              </button>
              <button 
                className="bg-white border border-slate-200 py-2 px-4 rounded-xl text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1.5"
                onClick={exportBOM}
              >
                <Download className="w-4 h-4 text-slate-400" /> Export CSV
              </button>
              <button 
                className="bg-slate-900 text-white border-none py-2 px-4 rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-1.5"
                onClick={exportPDF}
              >
                <Download className="w-4 h-4 text-white" /> Download PDF
              </button>
            </div>
          </div>

          {/* The Main BOM list table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left m-0 min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="p-4 pl-6">Part Number</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Supplier</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4 text-right">Unit Price</th>
                    <th className="p-4 text-right">Total Price</th>
                    <th className="p-4 pr-6 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {bomList.length > 0 ? (
                    bomList.map((item, i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 pl-6 text-xs font-bold text-slate-900 mono whitespace-nowrap">{item.partNumber}</td>
                        <td className="p-4 text-xs text-slate-500 truncate max-w-[250px]" title={item.description}>{item.description}</td>
                        <td className="p-4 text-xs text-slate-500">
                          <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">{item.supplier}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 w-fit shadow-sm">
                            <button 
                              className="bg-transparent border-none text-slate-400 hover:text-slate-950 p-1 rounded cursor-pointer hover:bg-slate-50 transition-colors"
                              onClick={() => updateBomQty(i, Math.max(1, item.qty - 1))}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <input 
                              type="number" 
                              className="w-10 text-center border-none bg-transparent font-mono text-xs font-bold outline-none" 
                              value={item.qty} 
                              min="1" 
                              onChange={(e) => updateBomQty(i, parseInt(e.target.value) || 1)} 
                            />
                            <button 
                              className="bg-transparent border-none text-slate-400 hover:text-slate-950 p-1 rounded cursor-pointer hover:bg-slate-50 transition-colors"
                              onClick={() => updateBomQty(i, item.qty + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-xs mono text-right text-slate-500 font-semibold">{formatPrice(item.unitCost)}</td>
                        <td className="p-4 text-xs mono font-bold text-slate-900 text-right">{formatPrice(item.qty * item.unitCost)}</td>
                        <td className="p-4 pr-6 text-right">
                          <button 
                            className="text-slate-300 bg-transparent border-none p-1.5 cursor-pointer hover:text-red-600 hover:bg-red-50 transition-all rounded-lg" 
                            onClick={() => deleteBomItem(i)} 
                            title="Delete item"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center p-12">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4 shadow-inner">
                          <Layers className="w-6 h-6" />
                        </div>
                        <h4 className="m-0 text-slate-800 font-bold text-sm">No items in active BOM</h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-[280px] mx-auto leading-relaxed">Search components above using the catalog and add them to compare prices.</p>
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
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Unique Items</span>
                <span className="text-xl font-black text-slate-900 mt-1.5 mono">{totalItems}</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Quantity</span>
                <span className="text-xl font-black text-slate-900 mt-1.5 mono">{totalQty}</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Est. Savings</span>
                <span className="text-xl font-black text-emerald-600 mt-1.5 mono">${estSavings.toFixed(2)}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-md">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total BOM Cost</span>
                <span className="text-xl font-black text-white mt-1.5 mono">${totalBomCost.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 4: ACTIVE SOURCING ORDERS
          ---------------------------------------------------- */}
      {activeTab === 'orders' && (
        <div className="flex flex-col gap-8 w-full max-w-[800px] mx-auto text-left">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 m-0">Brokerage Order History</h1>
            <p className="text-slate-500 m-0 mt-1 font-semibold text-sm">Track shipments, quotes, and consolidation status here.</p>
          </div>
          
          {orders.length > 0 ? (
            <div className="flex flex-col gap-6 pb-20">
              {orders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-white border border-slate-200 rounded-2xl shadow-sm mt-4">
              <Package className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <h3 className="text-base font-bold text-slate-800 m-0 mb-2">No Sourcing Orders Found</h3>
              <p className="text-xs text-slate-400 m-0 leading-relaxed max-w-[320px] mx-auto">You have no active or completed brokerage consignments. Compile a BOM and click "Fulfill" to launch a consolidated order.</p>
            </div>
          )}
        </div>
      )}

      {/* Brokerage modal fulfillment drawer */}
      <BrokerageModal 
        isOpen={isBrokerageModalOpen} 
        onClose={() => setIsBrokerageModalOpen(false)}
        bomList={bomList}
        onPlaceOrder={placeOrder}
        onSuccessNavigate={() => navigate('/?tab=orders')}
      />
    </div>
  );
}
export default Home;
