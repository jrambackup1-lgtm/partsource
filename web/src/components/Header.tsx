import React, { useState, useRef, ChangeEvent } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Search, ArrowRight, Bell, HelpCircle } from 'lucide-react';
import { fuse, parseCustomPart, Part } from '../lib/decoder';
import { useCurrency } from '../contexts/CurrencyContext';

export function Header() {
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [dropdownResults, setDropdownResults] = useState<{ item: Part; score?: number }[]>([]);
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
    setQuery('');
    
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
      ) : (
        <div className="flex-1"></div>
      )}

      {/* User Controls and Profile Mockup */}
      <div className="flex items-center gap-6">
        {/* Currency Picker */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700">
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value as any)}
            className="bg-transparent border-none text-xs font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="USD">🇺🇸 USD ($)</option>
            <option value="EUR">🇪🇺 EUR (€)</option>
            <option value="GBP">🇬🇧 GBP (£)</option>
            <option value="CAD">🇨🇦 CAD (C$)</option>
          </select>
        </div>

        {/* Notifications Icon */}
        <button className="bg-transparent border-none cursor-pointer text-slate-400 hover:text-slate-700 relative p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-slate-900 border border-white"></span>
        </button>

        {/* Divider */}
        <div className="w-[1px] h-6 bg-slate-200"></div>

        {/* User Card */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold border border-slate-100 shadow-sm select-none">
            JS
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 leading-tight">Jay Sourcing</span>
            <span className="text-[10px] font-semibold text-slate-400">@jay_sourcing</span>
          </div>
        </div>
      </div>
    </header>
  );
}
