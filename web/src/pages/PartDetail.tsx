import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Search } from 'lucide-react';
import { fuse, parseCustomPart, Part, suppliers, hashCode, db } from '../lib/decoder';
import { useBOM } from '../hooks/useBOM';
import { useCurrency, rates } from '../contexts/CurrencyContext';

export function PartDetail() {
  const { partNumber } = useParams();
  const navigate = useNavigate();
  const { addToBOM } = useBOM();
  const { currency } = useCurrency();
  const [item, setItem] = useState<Part | null>(null);

  // Compliance Filters
  const [filterDfars, setFilterDfars] = useState(false);
  const [filterIso, setFilterIso] = useState(false);
  const [filterUsa, setFilterUsa] = useState(false);

  useEffect(() => {
    if (partNumber) {
      const decoded = decodeURIComponent(partNumber);
      const searchRes = fuse.search(decoded);
      let foundItem: Part;
      if (searchRes.length > 0 && searchRes[0].score! < 0.5) {
        foundItem = searchRes[0].item;
      } else {
        foundItem = parseCustomPart(decoded);
      }
      setItem(foundItem);

      // SEO Logic
      const title = `${foundItem.thread !== 'Unknown' ? foundItem.thread + ' ' : ''}${foundItem.type} Equivalents & Sourcing | PartSource.io`;
      document.title = title;

      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', `Compare pricing and inventory for ${foundItem.partNumber} / ${foundItem.type}. ${foundItem.appNote}`);

      let metaRobots = document.querySelector('meta[name="robots"]');
      if (foundItem.standard === 'Unknown' || foundItem.thread === 'Unknown') {
        if (!metaRobots) {
          metaRobots = document.createElement('meta');
          metaRobots.setAttribute('name', 'robots');
          document.head.appendChild(metaRobots);
        }
        metaRobots.setAttribute('content', 'noindex');
      } else {
        if (metaRobots) {
          metaRobots.remove();
        }
      }

      // JSON-LD Structured Data
      const curRate = rates[currency];
      const allPrices = suppliers.map(s => foundItem.mcmasterPrice * s.discount * curRate);
      const lowPriceStr = Math.min(...allPrices).toFixed(2);
      const highPriceStr = (foundItem.mcmasterPrice * curRate).toFixed(2);
      
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": `${foundItem.partNumber} Equivalent Sourcing & Specifications`,
        "description": `Compare prices and sourcing options for ${foundItem.type}, ${foundItem.length !== 'N/A' ? foundItem.length + ' length, ' : ''}${foundItem.material}.`,
        "brand": "PartSource",
        "additionalProperty": [
          { "@type": "PropertyValue", "name": "Thread", "value": foundItem.thread },
          { "@type": "PropertyValue", "name": "Pitch", "value": foundItem.pitch },
          { "@type": "PropertyValue", "name": "Length", "value": foundItem.length },
          { "@type": "PropertyValue", "name": "Material", "value": foundItem.material },
          { "@type": "PropertyValue", "name": "Finish", "value": foundItem.finish },
          { "@type": "PropertyValue", "name": "Standard", "value": foundItem.standard }
        ],
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": currency,
          "lowPrice": lowPriceStr,
          "highPrice": highPriceStr,
          "offerCount": suppliers.length
        }
      };

      let script = document.querySelector('#json-ld-product') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = 'json-ld-product';
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.innerHTML = JSON.stringify(jsonLd);

      // Console Validator (Helper)
      console.group('JSON-LD Schema Validation');
      let hasError = false;
      const validateNode = (obj: any, path: string) => {
         Object.keys(obj).forEach(key => {
            const val = obj[key];
            if (val === null || val === undefined || val === '') {
               console.warn(`[Schema Warning] Empty or invalid value at ${path}.${key}:`, val);
               hasError = true;
            } else if (typeof val === 'object') {
               validateNode(val, `${path}.${key}`);
            }
         });
      };
      validateNode(jsonLd, 'Product');
      if (!hasError) {
         console.log('✅ JSON-LD Validated Successfully');
      }
      console.log('Generated Schema:', jsonLd);
      console.groupEnd();

    }
  }, [partNumber, currency]);

  if (!item) return <div className="p-8">Loading...</div>;

  const specs = [
    ['Part Number', item.partNumber],
    ['Category', item.category],
    ['Type', item.type],
    ['Thread', item.thread],
    ['Pitch', item.pitch],
    ['Length', item.length],
    ['Material', item.material],
    ['Finish', item.finish],
    ['Drive', item.drive],
    ['Standard', item.standard]
  ];

  const hash = hashCode(item.partNumber);

  return (
    <div className="flex flex-col flex-grow w-full max-w-[1200px] mx-auto p-6 overflow-y-auto">
      <button 
        className="flex items-center gap-2 text-sm text-[var(--text-secondary)] bg-transparent border-none cursor-pointer hover:text-[var(--text-primary)] w-fit mb-6 transition-colors"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Search
      </button>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Image and Specs */}
        <div className="flex flex-col gap-6 xl:col-span-1">
          <div className="bento-card flex flex-col relative group aspect-square">
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)] py-1 px-2 border border-[var(--border)] rounded z-10">
              {item.category}
            </div>
            <img 
              src={
                item.type.toLowerCase().includes('screw') || item.type.toLowerCase().includes('bolt') 
                  ? 'https://images.unsplash.com/photo-1588610502120-77a87e5b2203?auto=format&fit=crop&q=80&w=600'
                  : item.type.toLowerCase().includes('nut') 
                    ? 'https://images.unsplash.com/photo-1544413660-299165566b1d?auto=format&fit=crop&q=80&w=600'
                    : `https://placehold.co/600x600/f8fafc/94a3b8?text=${encodeURIComponent(item.partNumber)}`
              } 
              alt={item.partNumber}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <div className="bento-card flex flex-col">
            <h2 className="m-0 py-3 px-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)] border-b border-[var(--border)] bg-[var(--bg-subtle)]">
              Part Specifications
            </h2>
            <table className="w-full border-collapse text-left m-0">
              <tbody>
                {specs.map((s, i) => (
                  <tr key={i} className="table-row-hover">
                    <td className="py-3 px-4 border-b border-[var(--border-light)] text-[12px] text-[var(--text-secondary)] w-[35%] font-medium">{s[0]}</td>
                    <td className="py-3 px-4 border-b border-[var(--border-light)] text-[12px] text-[var(--text-primary)] mono">{s[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bento-card flex flex-col p-5 gap-4">
            <h2 className="m-0 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)]">
              Compliance & Auditing Filters
            </h2>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-[13px] text-[var(--text-primary)] cursor-pointer group">
                <input type="checkbox" checked={filterDfars} onChange={(e) => setFilterDfars(e.target.checked)} className="cursor-pointer accent-[var(--focus-ring)] w-4 h-4" />
                <span className="font-medium group-hover:text-[var(--focus-ring)] transition-colors">DFARS Compliant</span>
              </label>
              <label className="flex items-center gap-2 text-[13px] text-[var(--text-primary)] cursor-pointer group">
                <input type="checkbox" checked={filterIso} onChange={(e) => setFilterIso(e.target.checked)} className="cursor-pointer accent-[var(--focus-ring)] w-4 h-4" />
                <span className="font-medium group-hover:text-[var(--focus-ring)] transition-colors">ISO 9001 / AS9100 Certified</span>
              </label>
              <label className="flex items-center gap-2 text-[13px] text-[var(--text-primary)] cursor-pointer group">
                <input type="checkbox" checked={filterUsa} onChange={(e) => setFilterUsa(e.target.checked)} className="cursor-pointer accent-[var(--focus-ring)] w-4 h-4" />
                <span className="font-medium group-hover:text-[var(--focus-ring)] transition-colors">Made in USA / Domestic Origin Only</span>
              </label>
            </div>
            {(filterDfars || filterIso || filterUsa) && (
               <div className="bg-amber-50 text-amber-800 border border-amber-200 text-xs p-3 rounded mt-1 leading-relaxed">
                 <strong>Compliance Audit Active:</strong> Non-compliant suppliers will be locked or flagged based on your selection.
               </div>
            )}
          </div>
        </div>

        {/* Right Column: Details and Pricing */}
        <div className="flex flex-col gap-6 xl:col-span-2">
          <div className="bento-card flex flex-col p-6 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#0284c7]"></div>
            <h1 className="text-3xl font-bold mono text-[var(--text-primary)] m-0 mb-2">{item.partNumber}</h1>
            <h2 className="text-lg text-[var(--text-secondary)] mt-0 mb-5 font-medium">
              {item.type} &middot; {item.thread} {item.length !== 'N/A' ? `x ${item.length}` : ''}
            </h2>
            <div className="text-sm text-[var(--text-secondary)] bg-[var(--bg-subtle)] border border-[var(--border)] p-4 rounded-lg text-justify leading-relaxed">
              <strong>Application Note:</strong> {item.appNote}
            </div>
          </div>

          <div className="bento-card flex flex-col overflow-x-auto">
            <h2 className="m-0 py-3 px-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)] border-b border-[var(--border)] bg-[var(--bg-subtle)]">
              Supplier Inventory & Pricing
            </h2>
            <table className="w-full border-collapse text-left m-0 min-w-[700px]">
              <thead>
                <tr>
                  <th className="bg-[var(--bg-subtle)] text-[var(--text-secondary)] font-bold uppercase text-[10px] tracking-[0.05em] border-b border-[var(--border)] p-3 px-4 pl-6">Supplier</th>
                  <th className="bg-[var(--bg-subtle)] text-[var(--text-secondary)] font-bold uppercase text-[10px] tracking-[0.05em] border-b border-[var(--border)] p-3 px-4 text-right">Est. Price</th>
                  <th className="bg-[var(--bg-subtle)] text-[var(--text-secondary)] font-bold uppercase text-[10px] tracking-[0.05em] border-b border-[var(--border)] p-3 px-4">Est. Stock</th>
                  <th className="bg-[var(--bg-subtle)] text-[var(--text-secondary)] font-bold uppercase text-[10px] tracking-[0.05em] border-b border-[var(--border)] p-3 px-4 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((sup, index) => {
                  const price = item.mcmasterPrice * sup.discount;
                  const stock = (hash % (1000 * (index + 1))) + 50;
                  const href = sup.urlTemplate + encodeURIComponent(item.partNumber);
                  
                  // Discount pill logic
                  const discountPct = Math.round((1 - sup.discount) * 100);
                  const isMcMaster = sup.name === 'McMaster-Carr';
                  
                  // Stock color logic
                  const isHighStock = stock > 500;
                  const stockColor = isHighStock ? '#166534' : '#92400e';
                  const stockLabel = isHighStock ? 'In stock' : '2-3 days';
                  
                  // Compliance logic
                  const failsDfars = filterDfars && !sup.isDfars;
                  const failsIso = filterIso && !sup.isIso;
                  const failsUsa = filterUsa && !sup.isUsa;
                  const isLocked = failsDfars || failsIso || failsUsa;
                  
                  return (
                    <tr key={sup.name} className={`table-row-hover transition-colors ${isLocked ? 'opacity-60 bg-[var(--bg-subtle)]' : ''}`}>
                      <td className="py-4 px-4 pl-6 border-b border-[var(--border-light)] text-[13px] font-bold text-[var(--text-primary)]">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            {sup.name}
                            {isLocked && <span className="bg-red-100 text-red-800 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Locked</span>}
                          </div>
                          {filterUsa && sup.isUsa && !isLocked && (
                            <span className="text-[10px] text-blue-600 font-medium">🇺🇸 US Origin</span>
                          )}
                          {isLocked && (
                            <span className="text-[10px] text-red-600 font-medium">
                              {failsDfars ? 'Non-DFARS' : failsIso ? 'No ISO Cert' : 'Foreign Origin'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 border-b border-[var(--border-light)] text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isMcMaster && discountPct > 0 && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded mono">-{discountPct}%</span>
                          )}
                          <span className="text-[13px] font-bold text-[var(--text-primary)] mono">${price.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 border-b border-[var(--border-light)]">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stockColor }}></div>
                          <div className="flex flex-col">
                            <span className="text-[11px] font-medium" style={{ color: stockColor }}>{stockLabel}</span>
                            <span className="text-[10px] text-[var(--text-secondary)] mono">{stock.toLocaleString()} units</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 pr-6 border-b border-[var(--border-light)] text-right">
                        <div className="flex items-center justify-end gap-3">
                          <div className="flex items-center bg-[var(--bg-surface)] border border-[var(--border)] rounded px-1 w-[60px]">
                            <input type="number" id={`qty-${index}`} className="w-full py-1.5 text-center border-none bg-transparent font-mono text-[12px] outline-none" defaultValue="1" min="1" disabled={isLocked} />
                          </div>
                          <button 
                            className="bg-[var(--bg-subtle)] border border-[var(--border)] hover:bg-white hover:border-slate-400 py-1.5 px-3 rounded text-[12px] font-semibold text-[var(--text-primary)] cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLocked}
                            onClick={() => {
                              const qtyInput = document.getElementById(`qty-${index}`) as HTMLInputElement;
                              const qty = parseInt(qtyInput.value) || 1;
                              addToBOM({
                                partNumber: item.partNumber,
                                description: `${item.type} ${item.thread} x ${item.length !== 'N/A' ? item.length : ''}`,
                                material: item.material,
                                supplier: sup.name,
                                qty: qty,
                                unitCost: price
                              });
                            }}
                          >
                            Add
                          </button>
                          <a href={href} target="_blank" className="bg-[var(--text-primary)] text-white hover:bg-[#334155] py-1.5 px-3 rounded no-underline font-semibold text-[12px] flex items-center gap-1 transition-colors whitespace-nowrap btn-primary" rel="noreferrer">
                            <Search className="w-3.5 h-3.5" /> {sup.name} <ExternalLink className="w-3.5 h-3.5 ml-1" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bento-card flex flex-col">
            <h2 className="m-0 py-3 px-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)] border-b border-[var(--border)] bg-[var(--bg-subtle)]">
              Related Parts & Alternatives
            </h2>
            <div className="flex flex-col">
              {db.filter(p => p.partNumber !== item.partNumber && (p.thread === item.thread || p.type === item.type)).slice(0, 5).map((related, idx) => (
                <Link 
                  key={idx} 
                  to={`/parts/${encodeURIComponent(related.partNumber)}`}
                  className="flex items-center justify-between py-3 px-4 border-b border-[var(--border-light)] hover:bg-[var(--bg-subtle)] transition-colors no-underline text-[var(--text-primary)] last:border-b-0 group"
                >
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold text-[var(--text-primary)] mono mb-1">{related.partNumber}</span>
                    <span className="text-[11px] text-[var(--text-secondary)]">{related.type} &middot; {related.thread} x {related.length !== 'N/A' ? related.length : ''}</span>
                  </div>
                  <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider bg-[var(--bg-surface)] py-1 px-2 rounded border border-[var(--border)] group-hover:border-slate-300 transition-colors flex items-center gap-1">
                    View <ArrowLeft className="w-3 h-3 rotate-180" />
                  </div>
                </Link>
              ))}
              {db.filter(p => p.partNumber !== item.partNumber && (p.thread === item.thread || p.type === item.type)).length === 0 && (
                <div className="py-4 px-4 text-[12px] text-[var(--text-secondary)] italic">
                  No related parts found in catalog.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
