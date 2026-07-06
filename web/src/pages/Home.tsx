import React, { useState, useRef, useEffect, ChangeEvent, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Plus, Minus, ArrowRight, Package } from 'lucide-react';
import { fuse, parseCustomPart, Part, suppliers, db } from '../lib/decoder';
import { useBOM } from '../hooks/useBOM';
import { useCurrency } from '../contexts/CurrencyContext';
import { BrokerageModal } from '../components/BrokerageModal';
import { OrderCard } from '../components/OrderCard';

function CostSavingsChart({ data, referenceCost }: { data: { name: string, totalCost: number, shipDays: number }[], referenceCost: number }) {
  const { formatPrice } = useCurrency();
  if (!data || data.length === 0) return null;

  const maxCost = Math.max(...data.map(d => d.totalCost));
  const bestSupplier = data[0]; // Already sorted lowest first
  const savings = referenceCost - bestSupplier.totalCost;

  return (
    <div className="bento-card p-6 w-full flex flex-col mb-6 relative overflow-hidden group">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="m-0 text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">
            Cost Savings Analysis
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">BOM simulated across all approved suppliers.</p>
        </div>
        
        {savings > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <span className="text-sm font-bold text-emerald-800">
              Best Value: {bestSupplier.name} (Save {formatPrice(savings)})
            </span>
          </div>
        )}
      </div>

      {/* SVG Chart */}
      <div className="w-full h-[200px] relative">
        <svg viewBox={`0 0 1000 200`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
            const y = 160 - (tick * 160);
            const val = maxCost * tick;
            return (
              <g key={i}>
                <line x1="60" y1={y} x2="1000" y2={y} stroke="var(--border-light)" strokeWidth="1" strokeDasharray="4 4" />
                <text x="50" y={y + 4} textAnchor="end" className="text-[10px] fill-[var(--text-secondary)] font-mono">
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
            
            // min height 5px so it shows up
            const height = Math.max(5, (d.totalCost / maxCost) * 160);
            const y = 160 - height;
            
            const isBest = i === 0;
            const isRef = d.name === 'McMaster-Carr';
            
            return (
              <g key={d.name} className="group/bar cursor-pointer">
                {/* Bar */}
                <rect 
                  x={x} 
                  y={y} 
                  width={barWidth} 
                  height={height} 
                  rx="4"
                  className={`${isBest ? 'fill-emerald-500' : isRef ? 'fill-slate-300' : 'fill-[#0284c7]'} transition-all duration-300 group-hover/bar:brightness-110`}
                />
                
                {/* Label */}
                <text 
                  x={x + barWidth / 2} 
                  y="180" 
                  textAnchor="middle" 
                  className={`text-[11px] font-bold ${isBest ? 'fill-emerald-700' : isRef ? 'fill-slate-500' : 'fill-[var(--text-primary)]'}`}
                >
                  {d.name.substring(0, 10)}{d.name.length > 10 ? '...' : ''}
                </text>
                
                {/* Tooltip Target */}
                <rect x={x} y="0" width={barWidth} height="200" fill="transparent" />
                
                {/* Tooltip HTML overlay - rendered via a foreignObject for easier styling */}
                <foreignObject x={x - 40} y={y > 60 ? y - 60 : y + height + 10} width="140" height="50" className="opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-slate-900 text-white text-[10px] p-2 rounded shadow-xl border border-slate-700 flex flex-col items-center whitespace-nowrap">
                    <span className="font-bold mono">${d.totalCost.toFixed(2)}</span>
                    <span className="text-slate-400 mt-0.5">Est. {d.shipDays} days</span>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export function Home() {
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState<'finder' | 'bom' | 'orders'>('finder');
  const [query, setQuery] = useState('');
  const [dropdownResults, setDropdownResults] = useState<{ item: Part; score?: number }[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [isBrokerageModalOpen, setIsBrokerageModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const { bomList, orders, updateBomQty, deleteBomItem, exportBOM, exportPDF, importCSV, placeOrder } = useBOM();

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
        // We look up the original McMaster price for the part
        const searchRes = fuse.search(item.partNumber);
        let basePrice = 1.00; // fallback
        if (searchRes.length > 0 && searchRes[0].score! < 0.5) {
          basePrice = searchRes[0].item.mcmasterPrice;
        } else {
          basePrice = parseCustomPart(item.partNumber).mcmasterPrice;
        }
        total += (basePrice * sup.discount) * item.qty;
      });
      return { name: sup.name, totalCost: total, shipDays: sup.shipDays || 1 };
    }).sort((a, b) => a.totalCost - b.totalCost); // sort lowest cost first
  }, [bomList]);

  const mcmasterCost = supplierCosts.find(s => s.name === 'McMaster-Carr')?.totalCost || 0;
  // Calculate est savings compared to McMaster if our current BOM cost is lower
  const estSavings = mcmasterCost > totalBomCost ? mcmasterCost - totalBomCost : 0;

  return (
    <div className="flex flex-col flex-grow w-full max-w-[1200px] mx-auto overflow-hidden">
      <nav className="flex gap-6 border-b border-[var(--border)] px-6 bg-[var(--bg-surface)] shrink-0">
        <button 
          className={`bg-transparent border-none py-4 text-sm font-semibold cursor-pointer border-b-2 -mb-[1px] transition-all duration-200 ${activeTab === 'finder' ? 'text-[var(--text-primary)] border-[var(--text-primary)]' : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)]'}`}
          onClick={() => setActiveTab('finder')}
        >
          Part Finder
        </button>
        <button 
          className={`bg-transparent border-none py-4 text-sm font-semibold cursor-pointer border-b-2 -mb-[1px] transition-all duration-200 ${activeTab === 'bom' ? 'text-[var(--text-primary)] border-[var(--text-primary)]' : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)]'}`}
          onClick={() => setActiveTab('bom')}
        >
          BOM Manager
        </button>
        <button 
          className={`bg-transparent border-none py-4 text-sm font-semibold cursor-pointer border-b-2 -mb-[1px] transition-all duration-200 ${activeTab === 'orders' ? 'text-[var(--text-primary)] border-[var(--text-primary)]' : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)]'}`}
          onClick={() => setActiveTab('orders')}
        >
          Track Sourcing Orders
        </button>
      </nav>

      <main className="flex flex-col flex-grow p-6 overflow-y-auto relative">
        <div className={`absolute inset-0 p-6 transition-opacity duration-200 flex flex-col ${activeTab === 'finder' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <div className="grid grid-cols-1 gap-6 w-full max-w-[800px] mx-auto">
            
            <div className="bento-card p-8 flex flex-col items-center justify-center text-center w-full">
              <h2 className="text-3xl md:text-4xl font-bold m-0 mb-6 text-[var(--text-primary)] tracking-tight">
                Industrial Hardware Search
              </h2>
              
              <div className="relative w-full">
                <div className="flex items-center bg-[var(--bg-surface)] rounded-lg p-1.5 border border-[var(--border)] transition-shadow focus-within:shadow-[0_0_0_2px_var(--focus-ring)]">
                  <Search className="w-5 h-5 text-[var(--text-secondary)] ml-3 shrink-0" />
                  <input 
                    type="text" 
                    className="flex-1 border-none py-2 px-3 text-base bg-transparent outline-none text-[var(--text-primary)] font-sans"
                    placeholder="Search by McMaster part number, specs..." 
                    autoComplete="off" 
                    spellCheck="false"
                    value={query}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => { if(query) setShowDropdown(true) }}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  />
                  <button 
                    className="bg-[var(--text-primary)] hover:bg-[#334155] text-white border-none py-2 px-6 rounded-md text-sm font-semibold cursor-pointer transition-colors btn-primary"
                    onClick={() => performSearch(query)}
                  >
                    Find
                  </button>
                </div>

                {showDropdown && (
                  <div ref={dropdownRef} className="absolute top-[calc(100%+0.5rem)] left-0 right-0 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg shadow-lg z-20 max-h-[300px] overflow-y-auto text-left">
                    {dropdownResults.length > 0 ? (
                      dropdownResults.map((res, i) => (
                        <div 
                          key={i}
                          className={`px-4 py-3 cursor-pointer border-b border-[var(--border-light)] text-sm text-[var(--text-secondary)] last:border-b-0 flex items-center justify-between ${activeDropdownIndex === i ? 'bg-[var(--bg-subtle)] text-[var(--text-primary)]' : 'hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'}`}
                          onMouseDown={() => performSearch(res.item.partNumber)}
                        >
                          <div>
                            <span className="font-bold text-[var(--text-primary)] mr-2 text-sm mono">{res.item.partNumber}</span>
                            <span>{res.item.type} &middot; {res.item.thread} x {res.item.length !== 'N/A' ? res.item.length : ''}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 opacity-50" />
                        </div>
                      ))
                    ) : query ? (
                      <div className="px-4 py-3 text-sm text-[var(--text-secondary)] italic hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] cursor-pointer" onMouseDown={() => performSearch(query)}>
                        No exact match found. Press Enter to parse dynamically.
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {(!query) && (
              <div className="bento-card p-6 w-full">
                <h3 className="m-0 text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
                  Common McMaster Hardware
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['91251A242', '91290A115', '91247A142', '92210A110', '90596A005', '91166A005'].map(t => (
                    <button 
                      key={t}
                      className="bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg py-3 px-4 text-sm font-medium text-[var(--text-primary)] cursor-pointer transition-colors hover:border-[#94a3b8] hover:bg-white flex items-center justify-between group"
                      onClick={() => triggerSearch(t)}
                    >
                      <span className="mono font-bold text-[var(--text-primary)]">{t}</span>
                      <ArrowRight className="w-4 h-4 text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={`absolute inset-0 p-6 transition-opacity duration-200 flex flex-col ${activeTab === 'bom' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <div className="flex flex-col gap-6 max-w-[1200px] w-full mx-auto">
            <div className="bg-blue-900 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shrink-0 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
              <div className="z-10 relative">
                <h3 className="m-0 text-white text-lg font-bold">Ready to fulfill? Let us handle the sourcing.</h3>
                <p className="m-0 text-sm text-blue-200 mt-1">Submit your BOM for brokerage fulfillment. We consolidate distributors and handle logistics.</p>
              </div>
              <button 
                className="bg-white text-blue-900 hover:bg-blue-50 py-2.5 px-6 rounded-md text-sm font-bold cursor-pointer transition-all whitespace-nowrap z-10 shadow-sm"
                onClick={() => setIsBrokerageModalOpen(true)}
              >
                Submit BOM for Brokerage Fulfillment
              </button>
            </div>

            <div className="flex justify-between items-center mt-2">
              <h2 className="m-0 text-lg font-bold text-[var(--text-primary)]">BOM Items</h2>
              <div className="flex gap-2">
                <input type="file" id="csvFileInput" accept=".csv,.txt" className="hidden" onChange={handleFileChange} />
                <button 
                  className="bg-[var(--bg-surface)] border border-[var(--border)] py-1.5 px-4 rounded text-xs font-semibold text-[var(--text-primary)] cursor-pointer transition-all hover:bg-[var(--bg-subtle)]"
                  onClick={() => document.getElementById('csvFileInput')?.click()}
                >
                  Import CSV
                </button>
                <button 
                  className="bg-[var(--bg-surface)] border border-[var(--border)] py-1.5 px-4 rounded text-xs font-semibold text-[var(--text-primary)] cursor-pointer transition-all hover:bg-[var(--bg-subtle)]"
                  onClick={exportBOM}
                >
                  Export CSV
                </button>
                <button 
                  className="bg-[var(--text-primary)] text-white hover:bg-[#334155] py-1.5 px-4 rounded text-xs font-semibold cursor-pointer transition-colors btn-primary shadow-sm"
                  onClick={exportPDF}
                >
                  Download PDF
                </button>
              </div>
            </div>
            
            <div className="bento-card flex flex-col overflow-x-auto">
              <table className="w-full border-collapse text-left m-0 min-w-[700px]">
                <thead>
                  <tr>
                    <th className="bg-[var(--bg-subtle)] text-[var(--text-secondary)] font-bold uppercase text-[10px] tracking-[0.05em] border-b border-[var(--border)] p-3 pl-4">Part Number</th>
                    <th className="bg-[var(--bg-subtle)] text-[var(--text-secondary)] font-bold uppercase text-[10px] tracking-[0.05em] border-b border-[var(--border)] p-3">Description</th>
                    <th className="bg-[var(--bg-subtle)] text-[var(--text-secondary)] font-bold uppercase text-[10px] tracking-[0.05em] border-b border-[var(--border)] p-3">Supplier</th>
                    <th className="bg-[var(--bg-subtle)] text-[var(--text-secondary)] font-bold uppercase text-[10px] tracking-[0.05em] border-b border-[var(--border)] p-3">Qty</th>
                    <th className="bg-[var(--bg-subtle)] text-[var(--text-secondary)] font-bold uppercase text-[10px] tracking-[0.05em] border-b border-[var(--border)] p-3 text-right">Unit Cost</th>
                    <th className="bg-[var(--bg-subtle)] text-[var(--text-secondary)] font-bold uppercase text-[10px] tracking-[0.05em] border-b border-[var(--border)] p-3 text-right">Total</th>
                    <th className="bg-[var(--bg-subtle)] text-[var(--text-secondary)] font-bold uppercase text-[10px] tracking-[0.05em] border-b border-[var(--border)] p-3 pr-4 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {bomList.length > 0 ? (
                    bomList.map((item, i) => (
                      <tr key={i} className="table-row-hover border-b border-[var(--border-light)] last:border-0 transition-colors">
                        <td className="p-3 pl-4 text-[12px] font-bold text-[var(--text-primary)] mono whitespace-nowrap">{item.partNumber}</td>
                        <td className="p-3 text-[12px] text-[var(--text-secondary)] max-w-[200px] truncate" title={item.description}>{item.description}</td>
                        <td className="p-3 text-[12px] text-[var(--text-secondary)]">{item.supplier}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1 bg-[var(--bg-surface)] border border-[var(--border)] rounded w-fit p-0.5">
                            <button 
                              className="bg-transparent border-none text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] p-1 rounded cursor-pointer transition-colors"
                              onClick={() => updateBomQty(i, Math.max(1, item.qty - 1))}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <input 
                              type="number" 
                              className="w-10 text-center border-none bg-transparent font-mono text-[12px] outline-none" 
                              value={item.qty} 
                              min="1" 
                              onChange={(e) => updateBomQty(i, parseInt(e.target.value) || 1)} 
                            />
                            <button 
                              className="bg-transparent border-none text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] p-1 rounded cursor-pointer transition-colors"
                              onClick={() => updateBomQty(i, item.qty + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="p-3 text-[12px] mono text-right text-[var(--text-secondary)]">{formatPrice(item.unitCost)}</td>
                        <td className="p-3 text-[12px] mono font-bold text-[var(--text-primary)] text-right">{formatPrice(item.qty * item.unitCost)}</td>
                        <td className="p-3 pr-4 text-right">
                          <button className="text-slate-400 bg-transparent border-none p-1 cursor-pointer hover:text-red-600 transition-colors rounded" onClick={() => deleteBomItem(i)} title="Delete item">
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center p-8 text-sm text-[var(--text-secondary)]">Your BOM is empty. Search for parts to add them here.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bento-card p-4 flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Total Items</span>
                <span className="text-2xl font-bold text-[var(--text-primary)] mt-1 mono">{totalItems}</span>
              </div>
              <div className="bento-card p-4 flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Total Qty</span>
                <span className="text-2xl font-bold text-[var(--text-primary)] mt-1 mono">{totalQty}</span>
              </div>
              <div className="bento-card p-4 flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#166534]">Est. Savings</span>
                <span className="text-2xl font-bold text-[#166534] mt-1 mono">${estSavings.toFixed(2)}</span>
              </div>
              <div className="bento-card p-4 flex flex-col justify-between bg-slate-900 border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total BOM Cost</span>
                <span className="text-2xl font-bold text-white mt-1 mono">${totalBomCost.toFixed(2)}</span>
              </div>
            </div>

            {bomList.length > 0 && (
              <CostSavingsChart data={supplierCosts} referenceCost={mcmasterCost} />
            )}

          </div>
        </div>
        <div className={`absolute inset-0 p-6 transition-opacity duration-200 flex flex-col ${activeTab === 'orders' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <div className="flex flex-col gap-6 max-w-[800px] w-full mx-auto">
            <div>
              <h2 className="text-2xl font-bold m-0 text-[var(--text-primary)]">Active Sourcing Orders</h2>
              <p className="text-[var(--text-secondary)] m-0 mt-1 text-sm">Track the status of your consolidated brokerage fulfillments.</p>
            </div>
            
            {orders.length > 0 ? (
              <div className="flex flex-col gap-6 pb-20">
                {orders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="text-center p-12 bento-card text-[var(--text-secondary)] mt-8">
                <Package className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-700 m-0 mb-2">No Active Orders</h3>
                <p className="text-sm m-0">You have no active or past orders. Build a BOM and submit it for fulfillment to get started.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <BrokerageModal 
        isOpen={isBrokerageModalOpen} 
        onClose={() => setIsBrokerageModalOpen(false)}
        bomList={bomList}
        onPlaceOrder={placeOrder}
        onSuccessNavigate={() => setActiveTab('orders')}
      />
    </div>
  );
}

