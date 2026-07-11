import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Search } from 'lucide-react';
import { resolvePartIdentity, Part, PartResolution, suppliers, db, getSupplierSearchUrl } from '../lib/decoder';
import { REF_PAGES } from '../lib/reference';

// ----------------------------------------------------
// CAD dynamic fastener schematic viewer
// ----------------------------------------------------
function FastenerSchematic({ item }: { item: Part }) {
  const isScrewOrBolt = item.type.toLowerCase().includes('screw') || item.type.toLowerCase().includes('bolt');
  const isNut = item.type.toLowerCase().includes('nut');
  
  return (
    <div className="w-full h-full bg-slate-50 border border-slate-200 p-6 flex flex-col items-center justify-center relative overflow-hidden select-none rounded-lg">
      <div className="absolute top-2.5 left-2.5 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
        CAD Schematic Viewer
      </div>
      <div className="absolute bottom-2.5 left-2.5 text-[10px] text-slate-400 uppercase font-medium">
        Scale 1:1 &middot; Orthographic
      </div>
      
      <svg viewBox="0 0 400 240" className="w-full h-full overflow-visible max-h-[220px]">
        {isScrewOrBolt ? (
          <g className="stroke-slate-800 fill-slate-200/10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Hex Head */}
            <path d="M 80,70 L 130,70 L 145,100 L 130,130 L 80,130 L 65,100 Z" className="fill-slate-100 stroke-slate-800 stroke-2" />
            <line x1="80" y1="70" x2="80" y2="130" strokeDasharray="3 3" stroke="#cbd5e1" />
            <line x1="130" y1="70" x2="130" y2="130" strokeDasharray="3 3" stroke="#cbd5e1" />
            
            {/* Shaft */}
            <rect x="145" y="85" width="160" height="30" className="fill-white stroke-slate-800" />
            
            {/* Threads (ridges) */}
            <g strokeWidth="1.2" stroke="#64748b">
              {[...Array(12)].map((_, i) => (
                <line key={i} x1={200 + i * 8} y1="85" x2={202 + i * 8} y2="115" />
              ))}
            </g>
            
            {/* Chamfer tip */}
            <path d="M 305,85 L 315,90 L 315,110 L 305,115 Z" className="fill-slate-100 stroke-slate-800" />
            
            {/* Dimensions lines */}
            <g stroke="#94a3b8" strokeWidth="1" fill="#94a3b8" className="text-[10px] font-sans font-medium">
              {/* Length Dimension */}
              <line x1="145" y1="165" x2="305" y2="165" />
              <polygon points="145,165 152,162 152,168" />
              <polygon points="305,165 298,162 298,168" />
              <text x="225" y="157" textAnchor="middle" className="fill-slate-500 font-semibold">L = {item.length !== 'N/A' ? item.length : 'SPEC'}</text>
              
              {/* Thread diameter Dimension */}
              <line x1="340" y1="85" x2="340" y2="115" />
              <polygon points="340,85 337,92 343,92" />
              <polygon points="340,115 337,108 343,108" />
              <text x="350" y="104" textAnchor="start" className="fill-slate-500 font-semibold">{item.thread}</text>
              
              {/* Head height Dimension */}
              <line x1="65" y1="50" x2="145" y2="50" />
              <polygon points="65,50 72,47 72,53" />
              <polygon points="145,50 138,47 138,53" />
              <text x="105" y="42" textAnchor="middle" className="fill-slate-500 font-semibold">W_HEAD</text>
            </g>
          </g>
        ) : isNut ? (
          <g className="stroke-slate-800 fill-slate-200/10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Nut Hexagon */}
            <path d="M 140,55 L 220,55 L 260,110 L 220,165 L 140,165 L 100,110 Z" className="fill-slate-100 stroke-slate-800 stroke-2" />
            
            {/* Inner thread hole */}
            <circle cx="180" cy="110" r="36" className="fill-white stroke-slate-800" />
            <circle cx="180" cy="110" r="32" className="stroke-slate-400" strokeDasharray="5 3" />
            
            {/* Dimensions */}
            <g stroke="#94a3b8" strokeWidth="1" fill="#94a3b8" className="text-[10px] font-sans font-medium">
              {/* Hex flat-to-flat */}
              <line x1="85" y1="110" x2="275" y2="110" strokeDasharray="3 3" stroke="#cbd5e1" />
              <line x1="140" y1="185" x2="220" y2="185" />
              <polygon points="140,185 147,182 147,188" />
              <polygon points="220,185 213,182 213,188" />
              <text x="180" y="200" textAnchor="middle" className="fill-slate-500 font-semibold">W_HEX = {item.thread}</text>
            </g>
          </g>
        ) : (
          <g className="stroke-slate-800 fill-slate-200/10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Washer concentric circles */}
            <circle cx="180" cy="100" r="60" className="fill-slate-100 stroke-slate-800 stroke-2" />
            <circle cx="180" cy="100" r="28" className="fill-white stroke-slate-800" />
            
            {/* Crosshairs center lines */}
            <line x1="80" y1="100" x2="280" y2="100" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="180" y1="20" x2="180" y2="180" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
            
            {/* Dimensions */}
            <g stroke="#94a3b8" strokeWidth="1" fill="#94a3b8" className="text-[10px] font-sans font-medium">
              {/* Outer dia */}
              <line x1="180" y1="100" x2="232" y2="130" />
              <polygon points="232,130 224,129 228,123" />
              <text x="212" y="118" textAnchor="middle" className="fill-slate-500 font-semibold">O.D.</text>
              
              {/* Inner dia */}
              <line x1="180" y1="100" x2="204" y2="82" />
              <polygon points="204,82 196,84 199,90" />
              <text x="194" y="90" textAnchor="middle" className="fill-slate-500 font-semibold">I.D. = {item.thread}</text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}

export function PartDetail() {
  const { partNumber } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<Part | null>(null);
  const [resolution, setResolution] = useState<PartResolution | null>(null);
  useEffect(() => {
    if (partNumber) {
      const decoded = decodeURIComponent(partNumber);
      const resolved = resolvePartIdentity(decoded);
      const foundItem = resolved.part;
      setResolution(resolved);
      setItem(foundItem);

      // SEO Logic
      const title = `${foundItem.thread !== 'Unknown' ? foundItem.thread + ' ' : ''}${foundItem.type} Specifications & Supplier Search | PartSource.io`;
      document.title = title;

      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', `Configuration specifications and supplier search for ${foundItem.partNumber} / ${foundItem.type}. ${foundItem.appNote}`);

      // JSON-LD Structured Data — only for indexed catalog parts.
      if (foundItem.unindexed) {
        document.querySelector('#json-ld-product')?.remove();
      } else {
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": `${foundItem.partNumber} Configuration Specifications`,
        "description": `Configuration specifications for ${foundItem.type}, ${foundItem.length !== 'N/A' ? foundItem.length + ' length, ' : ''}${foundItem.material}. Verify supplier results independently.`,
        "brand": "PartSource",
        "additionalProperty": [
          { "@type": "PropertyValue", "name": "Thread", "value": foundItem.thread },
          { "@type": "PropertyValue", "name": "Pitch", "value": foundItem.pitch },
          { "@type": "PropertyValue", "name": "Length", "value": foundItem.length },
          { "@type": "PropertyValue", "name": "Material", "value": foundItem.material },
          { "@type": "PropertyValue", "name": "Finish", "value": foundItem.finish },
          { "@type": "PropertyValue", "name": "Standard", "value": foundItem.standard }
        ]
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

    }
    return () => document.querySelector('#json-ld-product')?.remove();
  }, [partNumber]);  if (!item || !resolution) return <div className="p-8 text-xs font-medium text-slate-500">Loading specifications...</div>;

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

  const isUnindexed = !!item.unindexed;
  const refChart = REF_PAGES.find(r => r.catalogStandard === item.standard);

  return (
    <div className="flex flex-col flex-grow w-full max-w-[1200px] mx-auto p-6 overflow-y-auto font-sans text-left">
      <button 
        className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-transparent border-none cursor-pointer hover:text-slate-800 w-fit mb-6 transition-colors"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Search
      </button>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Drawing and Specs */}
        <div className="flex flex-col gap-6 xl:col-span-1">
          <div className="bg-white border border-slate-200 rounded-xl flex flex-col relative group aspect-square shadow-xs overflow-hidden">
            <div className="absolute top-3 left-3 z-10">
              <div className="bg-slate-900/90 text-white text-[10px] font-semibold py-1 px-2.5 rounded-md shadow-xs">
                {item.category}
              </div>
            </div>
            <FastenerSchematic item={item} />
          </div>

          <div className="bg-white border border-slate-200 rounded-xl flex flex-col shadow-xs overflow-hidden">
            <h2 className="m-0 py-3.5 px-4 text-xs font-semibold text-slate-800 border-b border-slate-150 bg-slate-50">
              Part Specifications
            </h2>
            <table className="w-full border-collapse text-left m-0">
              <tbody>
                {specs.map((s, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 border-b border-slate-100 last:border-none">
                    <td className="py-2.5 px-4 text-[11px] text-slate-500 font-semibold uppercase tracking-wider w-[40%]">{s[0]}</td>
                    <td className="py-2.5 px-4 text-xs text-slate-900 font-bold tracking-wider">{s[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {refChart && (
              <Link to={`/reference/${refChart.slug}`} className="py-2.5 px-4 text-[11px] font-semibold text-slate-600 no-underline hover:text-slate-900 hover:underline border-t border-slate-100 bg-slate-50/50">
                Full {item.standard} size chart →
              </Link>
            )}
          </div>

        </div>

        {/* Right Column: Details and Sourcing */}
        <div className="flex flex-col gap-6 xl:col-span-2">
          <div className="bg-white border border-slate-200 rounded-xl p-6 relative shadow-xs overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-450 uppercase tracking-wider">Part Identification</span>
              <div className="flex items-center gap-2">
                {isUnindexed ? (
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> Not Indexed
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Indexed Catalog
                  </span>
                )}
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 m-0 mb-1 mt-3">{item.partNumber}</h1>
            <h2 className="text-sm font-semibold text-slate-500 mt-1 mb-5">
              {item.type} &middot; {item.thread} {item.length !== 'N/A' ? `x ${item.length}` : ''}
            </h2>
            {resolution.state === 'suggested' && (
              <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 p-4 rounded-lg leading-relaxed mb-3">
                Showing a catalog configuration for <strong>{resolution.query}</strong>. Verify every specification before use.
              </div>
            )}
            {isUnindexed && (
              <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 p-4 rounded-lg leading-relaxed mb-3">
                <strong>This part number is not in our indexed catalog.</strong>{' '}
                The configuration shown may have been decoded from your input. Verify every specification before ordering, then use the supplier searches below.
                {' '}<a className="font-bold underline" href={`mailto:jayaram.h@afterconcept.com?subject=${encodeURIComponent('PartSource indexing request: ' + item.partNumber)}`}>Request this part</a>
              </div>
            )}
            <div className="text-xs text-slate-650 bg-slate-50 border border-slate-150 p-4 rounded-lg leading-relaxed">
              <strong className="text-slate-800">Application Note:</strong> {item.appNote}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl flex flex-col shadow-xs overflow-hidden">
            <h2 className="m-0 py-3.5 px-4 text-xs font-semibold text-slate-800 border-b border-slate-150 bg-slate-50">
              Search Suppliers
            </h2>
            <div className="p-5 flex flex-col gap-4">
              <p className="text-xs text-slate-500 m-0 leading-relaxed">
                These links run a supplier-site search for this configuration. Verify the returned specifications, availability, and commercial terms directly with the supplier.
              </p>
              <div className="flex flex-wrap gap-2">
                {suppliers.map(sup => (
                  <a
                    key={sup.name}
                    href={getSupplierSearchUrl(sup.urlTemplate, item)}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-slate-900 text-white hover:bg-slate-800 py-1.5 px-3.5 rounded-md no-underline font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-[0.98] shadow-xs"
                  >
                    <Search className="w-3.5 h-3.5" /> {sup.name} <ExternalLink className="w-3 h-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl flex flex-col shadow-xs overflow-hidden">
            <h2 className="m-0 py-3.5 px-4 text-xs font-semibold text-slate-800 border-b border-slate-150 bg-slate-50">
              Related Configurations
            </h2>
            <div className="flex flex-col">
              {db.filter(p => p.partNumber !== item.partNumber && (p.thread === item.thread || p.type === item.type)).slice(0, 5).map((related, idx) => (
                <Link 
                  key={idx} 
                  to={`/parts/${encodeURIComponent(related.partNumber)}`}
                  className="flex items-center justify-between py-3 px-4 border-b border-slate-100 hover:bg-slate-50/50 transition-colors no-underline text-slate-900 last:border-b-0 group"
                >
                  <div className="flex flex-col text-left font-sans">
                    <span className="text-xs font-mono font-bold text-slate-900 tracking-wider mb-0.5">{related.partNumber}</span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{related.type} &middot; {related.thread} x {related.length !== 'N/A' ? related.length : 'N/A'}</span>
                  </div>
                  <div className="text-[10px] font-semibold text-slate-600 bg-slate-50 py-1 px-2.5 rounded-md border border-slate-200 group-hover:border-slate-400 group-hover:bg-slate-100 transition-all flex items-center gap-1">
                    Inspect <ArrowLeft className="w-2.5 h-2.5 rotate-180" />
                  </div>
                </Link>
              ))}
              {db.filter(p => p.partNumber !== item.partNumber && (p.thread === item.thread || p.type === item.type)).length === 0 && (
                <div className="py-4 px-4 text-xs text-slate-400 italic text-center font-medium">
                  No related alternate items indexed in segment.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
