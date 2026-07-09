import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Search, ExternalLink } from 'lucide-react';
import { findCatalogPart, parseCustomPart, Part, suppliers, buildSupplierQuery, getSupplierSearchUrl } from '../lib/decoder';

export function WidgetEmbed() {
  const { partNumber } = useParams();
  const [searchParams] = useSearchParams();
  const [item, setItem] = useState<Part | null>(null);

  // Retrieve widget customization options from URL search parameters
  const theme = searchParams.get('theme') || 'dark'; // 'light' | 'dark' | 'slate'
  const accent = searchParams.get('accent') || '#10b981'; // accent color hex
  const showGrid = searchParams.get('grid') !== 'false'; // 'true' | 'false'

  useEffect(() => {
    if (partNumber) {
      const decoded = decodeURIComponent(partNumber);
      const foundItem: Part = findCatalogPart(decoded) ?? parseCustomPart(decoded);
      setItem(foundItem);
    }
  }, [partNumber]);

  if (!item) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-950 text-slate-400 text-xs font-semibold font-sans">
        Loading widget specifications...
      </div>
    );
  }

  // Theme-specific styles
  const isLight = theme === 'light';
  const isSlate = theme === 'slate';

  const bgColor = isLight ? '#ffffff' : isSlate ? '#1e293b' : '#0a0f1d';
  const borderColor = isLight ? '#cbd5e1' : '#334155';
  const subBorderColor = isLight ? '#e2e8f0' : '#1e293b';
  const textPrimary = isLight ? '#0f172a' : '#f8fafc';
  const textSecondary = isLight ? '#475569' : '#94a3b8';
  const headerBg = isLight ? '#f8fafc' : isSlate ? '#0f172a' : '#0d1527';
  const rowHoverBg = isLight ? '#f8fafc' : isSlate ? '#152238' : '#0d1527';

  const handleCTAClick = () => {
    window.open(`/parts/${encodeURIComponent(item.partNumber)}`, '_blank');
  };

  return (
    <div 
      className="w-full min-h-screen flex flex-col font-sans select-none overflow-x-hidden"
      style={{ backgroundColor: bgColor, color: textPrimary }}
    >
      {/* Widget Header */}
      <div 
        className="p-4 border-b flex items-center justify-between"
        style={{ borderColor: subBorderColor, backgroundColor: headerBg }}
      >
        <div className="text-left">
          <div 
            className="text-[9px] font-bold uppercase tracking-widest opacity-60 mb-1" 
            style={{ color: textSecondary }}
          >
            Component Spec
          </div>
          <div 
            className="text-sm font-bold tracking-wider font-mono" 
            style={{ color: textPrimary }}
          >
            {item.partNumber}
          </div>
        </div>
        <div 
          className="px-2 py-0.5 text-[10px] font-semibold border rounded-md"
          style={{ backgroundColor: `${accent}15`, color: accent, borderColor: `${accent}30` }}
        >
          Verified Match
        </div>
      </div>

      {/* Widget Body */}
      <div className="p-4 flex-1 flex flex-col gap-4 text-left">
        {/* Core Specs Grid */}
        <div className="grid grid-cols-2 gap-3 text-[11px]">
          <div className="space-y-0.5">
            <div className="font-semibold uppercase opacity-55 text-[9px]" style={{ color: textSecondary }}>
              Category
            </div>
            <div className="font-bold truncate" style={{ color: textPrimary }}>
              {item.category}
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="font-semibold uppercase opacity-55 text-[9px]" style={{ color: textSecondary }}>
              Type
            </div>
            <div className="font-bold truncate" style={{ color: textPrimary }}>
              {item.type}
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="font-semibold uppercase opacity-55 text-[9px]" style={{ color: textSecondary }}>
              Material
            </div>
            <div className="font-bold truncate" style={{ color: textPrimary }}>
              {item.material}
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="font-semibold uppercase opacity-55 text-[9px]" style={{ color: textSecondary }}>
              Thread / Pitch
            </div>
            <div className="font-bold truncate" style={{ color: textPrimary }}>
              {item.thread} {item.pitch !== 'N/A' ? `(${item.pitch})` : ''}
            </div>
          </div>
        </div>

        {/* Dynamic Pricing & Sourcing Grid */}
        {showGrid && (
          <div 
            className="border rounded-lg overflow-hidden text-xs flex flex-col shadow-xs" 
            style={{ borderColor: borderColor }}
          >
            <div 
              className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider border-b" 
              style={{ 
                backgroundColor: headerBg, 
                color: textSecondary, 
                borderColor: borderColor 
              }}
            >
              Equivalents Pricing Grid
            </div>
            
            <div className="flex flex-col division-y" style={{ color: textPrimary }}>
              {(item.mcmaster
                ? [{ name: 'McMaster-Carr', discount: 1.0, urlTemplate: 'https://www.mcmaster.com/' }, ...suppliers]
                : suppliers
              ).slice(0, 3).map((sup) => {
                const price = item.mcmasterPrice * sup.discount;
                const isMcMaster = sup.name === 'McMaster-Carr';
                const href = isMcMaster
                  ? `https://www.mcmaster.com/${item.mcmaster}`
                  : getSupplierSearchUrl(sup.urlTemplate, item);

                return (
                  <div 
                    key={sup.name} 
                    className="p-2.5 flex items-center justify-between border-b last:border-b-0 hover:bg-opacity-50 transition-colors"
                    style={{ 
                      borderColor: subBorderColor,
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = rowHoverBg;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-[11px]" style={{ color: textPrimary }}>
                        {sup.name}
                      </span>
                      <span className="text-[9px] font-mono opacity-50" style={{ color: textSecondary }}>
                        {isMcMaster ? `PN: ${item.mcmaster}` : `q: ${buildSupplierQuery(item)}`}
                      </span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        <span className="text-[8.5px] font-medium opacity-75" style={{ color: textSecondary }}>
                          Est. price · check site for stock
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-[11px]" style={{ color: textPrimary }}>
                        ${price.toFixed(2)}
                      </span>
                      <a 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1 rounded hover:bg-slate-200/20 transition-colors"
                        style={{ color: accent }}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA Sourcing Action Button */}
        <div className="mt-auto pt-2">
          <button 
            onClick={handleCTAClick}
            className="w-full py-2.5 rounded-lg font-bold text-white text-[11px] uppercase tracking-wider transition-all hover:brightness-105 active:scale-[0.98] cursor-pointer border-none flex items-center justify-center gap-1.5 shadow-sm"
            style={{ backgroundColor: accent }}
          >
            <Search className="w-3.5 h-3.5" />
            Consolidate Sourcing Channel
          </button>
        </div>
      </div>
    </div>
  );
}
