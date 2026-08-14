import React, { useState, useRef, ChangeEvent } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { type Part } from '../lib/decoder';
import { useCatalogSearch } from '../hooks/useCatalogSearch';
import { useCurrency } from '../contexts/CurrencyContext';

export function Header() {
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const { status: searchStatus, results: dropdownResults, message: searchMessage, runSearch, clear: clearSearch, resolveSearchTarget } = useCatalogSearch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'dashboard';
  const isHome = location.pathname === '/';
  const showHeaderSearch = !isHome || (activeTab !== 'dashboard' && activeTab !== 'finder');

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setActiveDropdownIndex(-1);

    if (!val.trim()) {
      setShowDropdown(false);
      clearSearch();
      return;
    }
    setShowDropdown(true);
    runSearch(val);
  };

  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setShowDropdown(false);
    setQuery('');
    
    navigate(`/parts/${encodeURIComponent(resolveSearchTarget(searchQuery))}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeDropdownIndex >= 0 && dropdownResults[activeDropdownIndex]) {
        performSearch(dropdownResults[activeDropdownIndex].partNumber);
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

  return (
    <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-8 shrink-0 relative z-30 select-none">
      {/* Global Search Bar (Pillio style) - Conditionally Visible */}
      {showHeaderSearch ? (
        <div className="flex-1 max-w-lg relative">
          <div className="flex items-center bg-slate-50 rounded-xl p-1 px-3 border border-slate-200 transition-all focus-within:bg-white focus-within:shadow-[0_0_0_2px_#0f172a] focus-within:border-transparent">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input 
              type="text" 
              className="flex-1 border-none py-2 px-3 text-sm bg-transparent outline-none text-slate-900 font-sans"
              placeholder="Search hardware, McMaster part numbers..." 
              autoComplete="off" 
              spellCheck="false"
              value={query}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => { if(query) setShowDropdown(true) }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            />
            <div className="bg-white border border-slate-200 text-slate-400 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5 font-mono select-none pointer-events-none">
              <span>⌘</span><span>K</span>
            </div>
          </div>

          {/* Global Search Results Dropdown */}
          {showDropdown && (
            <div ref={dropdownRef} className="absolute top-[calc(100%+0.5rem)] left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-[350px] overflow-y-auto text-left py-1 animate-in fade-in slide-in-from-top-1 duration-150">
              {dropdownResults.length > 0 ? (
                dropdownResults.map((res, i) => (
                  <div 
                    key={i}
                    className={`px-4 py-3.5 cursor-pointer border-b border-slate-50 text-xs text-slate-500 last:border-b-0 flex items-center justify-between transition-colors ${activeDropdownIndex === i ? 'bg-slate-50 text-slate-900' : 'hover:bg-slate-50 hover:text-slate-900'}`}
                    onMouseDown={() => performSearch(res.partNumber)}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-950 text-sm mono">{res.partNumber}</span>
                      <span className="text-[11px] font-medium text-slate-400">{res.type} &middot; {res.thread} x {res.length !== 'N/A' ? res.length : 'N/A'}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))
              ) : searchStatus === 'loading' ? (
                <div className="px-4 py-3.5 text-xs text-slate-400 font-medium">Searching private catalog…</div>
              ) : searchStatus === 'error' ? (
                <div className="px-4 py-3.5 text-xs text-red-650 font-medium">{searchMessage || 'Catalog search unavailable'}</div>
              ) : query ? (
                <div 
                  className="px-4 py-3.5 text-xs text-slate-400 italic hover:bg-slate-50 hover:text-slate-900 cursor-pointer flex items-center justify-between"
                  onMouseDown={() => performSearch(query)}
                >
                  <span>Input not supported yet. Open as configuration search.</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              ) : null}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1"></div>
      )}

      <div className="flex items-center">
        {/* Currency Picker */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700">
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value as any)}
            className="bg-transparent border-none text-xs font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="USD">🇺🇸 USD ($)</option>

          </select>
        </div>
      </div>
    </header>
  );
}
