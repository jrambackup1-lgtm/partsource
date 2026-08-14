import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Search } from 'lucide-react';
import { SEARCH_UNAVAILABLE_COPY, UNSUPPORTED_INPUT_COPY, isMcMasterIdentifier, parseCustomPart, resolvePartIdentity, type LookupResultState, Part, db } from '../lib/decoder';
import { buildSupplierSearchDestinations, catalogResultToPart, CONFIGURATION_NOTICE, searchCatalog } from '../lib/catalogApi';
import { REF_PAGES } from '../lib/reference';
import { useBOM } from '../hooks/useBOM';
import { createBomItem, type BOMItem } from '../lib/bomStorage';

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
  const prototypeNotice = CONFIGURATION_NOTICE;
  const { partNumber } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<Part | null>(null);
  const [resolution, setResolution] = useState<{ state: LookupResultState; query: string; part: Part } | null>(null);
  const { bomStore, activeBom, addToBOM, addToNewNamedBOM, persistenceWarning } = useBOM();
  const [selectedBomId, setSelectedBomId] = useState('');
  const [newBomName, setNewBomName] = useState('');
  const [bomQuantity, setBomQuantity] = useState(1);
  const [bomNotes, setBomNotes] = useState('');
  const [bomUserUnitCost, setBomUserUnitCost] = useState('');
  const [bomSaveMessage, setBomSaveMessage] = useState<string | null>(null);
  const [bomSaveError, setBomSaveError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedBomId(current => {
      if (current === '__new') return current;
      if (current && bomStore.boms.some(bom => bom.id === current)) return current;
      return bomStore.activeBomId ?? bomStore.boms[0]?.id ?? '__new';
    });
  }, [bomStore.activeBomId, bomStore.boms]);

  useEffect(() => {
    let cancelled = false;
    if (partNumber) {
      const decoded = decodeURIComponent(partNumber);
      const applyFoundItem = (foundItem: Part, state: LookupResultState) => {
      if (cancelled) return;
      const resolved = { state, query: decoded, part: foundItem };
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

      };

      void searchCatalog(decoded).then(results => {
        const exact = results.find(result =>
          result.reference_number?.toUpperCase() === decoded.toUpperCase()
          || result.source_sku?.toUpperCase() === decoded.toUpperCase()
        );
        if (exact) {
          applyFoundItem(catalogResultToPart(exact), 'configuration-match');
          return;
        }
        const fallback = resolvePartIdentity(decoded);
        applyFoundItem(fallback.part, fallback.state);
      }).catch(() => {
        if (isMcMasterIdentifier(decoded)) {
          applyFoundItem({
            ...parseCustomPart(decoded),
            appNote: SEARCH_UNAVAILABLE_COPY,
            unindexed: true,
            offers: undefined,
          }, 'search-unavailable');
          return;
        }
        const fallback = resolvePartIdentity(decoded);
        applyFoundItem(fallback.part, fallback.state);
      });
    }
    return () => {
      cancelled = true;
      document.querySelector('#json-ld-product')?.remove();
    };
  }, [partNumber]);  if (!item || !resolution) return <div className="p-8 text-xs font-medium text-slate-500">Loading specifications...</div>;

  if (resolution.state === 'unsupported-input') {
    return (
      <div className="flex flex-col flex-grow w-full max-w-[760px] mx-auto p-6 overflow-y-auto font-sans text-left">
        <button
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-transparent border-none cursor-pointer hover:text-slate-800 w-fit mb-6 transition-colors"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Search
        </button>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-450 uppercase tracking-wider">Search clue only</span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 m-0 mt-3">{UNSUPPORTED_INPUT_COPY}</h1>
        </div>
      </div>
    );
  }

  if (resolution.state === 'search-unavailable') {
    return (
      <div className="flex flex-col flex-grow w-full max-w-[760px] mx-auto p-6 overflow-y-auto font-sans text-left">
        <button
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-transparent border-none cursor-pointer hover:text-slate-800 w-fit mb-6 transition-colors"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Search
        </button>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-450 uppercase tracking-wider">Exact McMaster lookup</span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 m-0 mt-3">No supported configuration yet</h1>
          <p className="text-xs text-slate-600 leading-relaxed mt-3 mb-0">{SEARCH_UNAVAILABLE_COPY}. No supplier search handoff shown.</p>
        </div>
      </div>
    );
  }

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
  const isPrototype = item.isPrototype === true;
  const refChart = REF_PAGES.find(r => r.catalogStandard === item.standard);
  const supplierDestinations = buildSupplierSearchDestinations(item);
  const sourceNotes = [
    `Configuration source: ${resolution.state}`,
    item.title ? `Catalog title: ${item.title}` : null,
    item.sourceSku ? `Source SKU: ${item.sourceSku}` : null,
    item.mcmaster ? `Input reference: ${item.mcmaster}` : null,
    item.isPrototype ? 'Prototype configuration packet. Not a supplier listing.' : null,
  ].filter((note): note is string => note !== null);
  const configurationFacts = specs.map(([label, value]) => ({ label, value: String(value ?? '') }));
  const duplicateCount = bomStore.boms
    .find(bom => bom.id === selectedBomId)
    ?.items.filter(line => line.selectionSnapshot.inputText === resolution.query && line.selectionSnapshot.alternativePartNumber === item.partNumber)
    .length ?? 0;

  const buildBomLine = (): Omit<BOMItem, 'id'> => {
    const userUnitCostUsd = Number.parseFloat(bomUserUnitCost);
    const line = createBomItem({
      quantity: bomQuantity,
      notes: bomNotes,
      userUnitCostUsd: Number.isFinite(userUnitCostUsd) && userUnitCostUsd >= 0 ? userUnitCostUsd : 0,
      origin: isUnindexed ? 'imported' : 'verified',
      verificationStatus: isUnindexed ? 'unverified-imported' : 'verified',
      selectionSnapshot: {
        inputText: resolution.query,
        originalMcmasterNumber: item.mcmaster ?? resolution.query,
        selectedCrossReferenceRecordId: null,
        alternativePartNumber: item.partNumber,
        supplier: 'Supplier search destinations only',
        description: `${item.type} ${item.thread} ${item.length !== 'N/A' ? `x ${item.length}` : ''}`.trim().replace(/\s+/g, ' '),
        material: item.material,
        verificationRevision: null,
        configurationFacts,
        supplierSearchDestinations: supplierDestinations.map(destination => ({
          name: destination.name,
          label: destination.label,
          url: destination.url,
          query: destination.query,
          requiresVerification: true,
        })),
        sourceNotes,
      },
    });
    const { id: _id, ...withoutId } = line;
    return withoutId;
  };

  const handleAddSnapshotToBom = () => {
    setBomSaveError(null);
    setBomSaveMessage(null);
    if (!Number.isInteger(bomQuantity) || bomQuantity < 1) {
      setBomSaveError('Quantity must be a whole number of at least 1.');
      return;
    }
    const line = buildBomLine();
    try {
      if (selectedBomId === '__new' || bomStore.boms.length === 0) {
        const created = addToNewNamedBOM(line, newBomName.trim() || undefined);
        if (!created) throw new Error('Unable to create BOM.');
        setSelectedBomId(created.bom.id);
        setBomSaveMessage(`Saved frozen snapshot to ${created.bom.name}. Duplicate adds append separate snapshots.`);
      } else {
        const saved = addToBOM(line, selectedBomId);
        if (!saved) throw new Error('Choose a valid BOM.');
        const targetName = bomStore.boms.find(bom => bom.id === selectedBomId)?.name ?? activeBom?.name ?? 'selected BOM';
        setBomSaveMessage(`Saved frozen snapshot to ${targetName}. Duplicate adds append separate snapshots.`);
      }
      setBomNotes('');
    } catch {
      setBomSaveError('Enter a unique BOM name and choose a valid BOM before saving.');
    }
  };

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
            <div className="text-xs text-slate-650 bg-slate-50 border border-slate-150 p-4 rounded-lg leading-relaxed mb-3">
              <strong className="text-slate-800">Input:</strong> {resolution.query}
            </div>
            {(resolution.state === 'configuration-match' || resolution.state === 'configuration-search') && !isUnindexed && (
              <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 p-4 rounded-lg leading-relaxed mb-3">
                Configuration result for <strong>{resolution.query}</strong>. Verify every specification before use.
              </div>
            )}
            {resolution.state === 'unsupported-input' && (
              <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 p-4 rounded-lg leading-relaxed mb-3">
                <strong>{UNSUPPORTED_INPUT_COPY}</strong>
              </div>
            )}
            {resolution.state === 'search-unavailable' && (
              <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 p-4 rounded-lg leading-relaxed mb-3">
                {SEARCH_UNAVAILABLE_COPY}. No guessed supplier claim shown.
              </div>
            )}
            {isUnindexed && resolution.state !== 'unsupported-input' && (
              <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 p-4 rounded-lg leading-relaxed mb-3">
                <strong>Configuration candidate.</strong>{' '}
                The configuration shown may have been decoded from your input. Verify every specification before ordering, then use the supplier searches below.
                {' '}<a className="font-bold underline" href={`mailto:jayaram.h@afterconcept.com?subject=${encodeURIComponent('PartSource indexing request: ' + item.partNumber)}`}>Request this part</a>
              </div>
            )}
            {isPrototype && (
              <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 p-4 rounded-lg leading-relaxed mb-3">
                <strong>{prototypeNotice}</strong>
              </div>
            )}
            <div className="text-xs text-slate-650 bg-slate-50 border border-slate-150 p-4 rounded-lg leading-relaxed">
              <strong className="text-slate-800">Application Note:</strong> {item.appNote}
            </div>
            {sourceNotes.length > 0 && (
              <div className="text-xs text-slate-650 bg-slate-50 border border-slate-150 p-4 rounded-lg leading-relaxed mt-3">
                <strong className="text-slate-800">Source notes:</strong>
                <ul className="m-0 mt-2 pl-4">
                  {sourceNotes.map(note => <li key={note}>{note}</li>)}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="m-0 text-xs font-semibold text-slate-800">Add frozen configuration to BOM</h2>
                <p className="text-xs text-slate-500 m-0 mt-2 leading-relaxed">
                  Saves a snapshot of input text, configuration facts, source notes, and supplier search destinations. Catalog refreshes will not rewrite saved lines.
                </p>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md whitespace-nowrap">
                User-entered cost only
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <label className="text-[11px] font-semibold text-slate-600 flex flex-col gap-1.5">
                BOM
                <select
                  className="border border-slate-200 rounded-md px-3 py-2 text-xs bg-white text-slate-800"
                  value={selectedBomId}
                  onChange={(event) => setSelectedBomId(event.target.value)}
                  aria-label="Choose BOM for saved configuration snapshot"
                >
                  {bomStore.boms.map(bom => <option key={bom.id} value={bom.id}>{bom.name}</option>)}
                  <option value="__new">Create a new BOM in this flow</option>
                </select>
              </label>
              <label className="text-[11px] font-semibold text-slate-600 flex flex-col gap-1.5">
                Quantity
                <input
                  className="border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-800"
                  type="number"
                  min="1"
                  step="1"
                  value={bomQuantity}
                  onChange={(event) => setBomQuantity(Math.max(1, Number.parseInt(event.target.value, 10) || 1))}
                />
              </label>
              <label className="text-[11px] font-semibold text-slate-600 flex flex-col gap-1.5">
                User-entered unit cost (optional)
                <input
                  className="border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-800"
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={bomUserUnitCost}
                  onChange={(event) => setBomUserUnitCost(event.target.value)}
                />
              </label>
            </div>

            {(selectedBomId === '__new' || bomStore.boms.length === 0) && (
              <label className="text-[11px] font-semibold text-slate-600 flex flex-col gap-1.5 mt-3">
                New BOM name
                <input
                  className="border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-800"
                  placeholder="BOM 1"
                  value={newBomName}
                  onChange={(event) => setNewBomName(event.target.value)}
                />
              </label>
            )}

            <label className="text-[11px] font-semibold text-slate-600 flex flex-col gap-1.5 mt-3">
              User notes for this saved line
              <textarea
                className="border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-800 min-h-[72px]"
                placeholder="Fit, project, source preference, or review notes"
                value={bomNotes}
                onChange={(event) => setBomNotes(event.target.value)}
              />
            </label>

            <div className="text-[11px] text-slate-500 bg-slate-50 border border-slate-150 rounded-md p-3 mt-3 leading-relaxed">
              Duplicate behavior: each click appends a separate frozen snapshot. {duplicateCount > 0 ? `${duplicateCount} matching snapshot${duplicateCount === 1 ? '' : 's'} already in the selected BOM.` : 'No matching snapshot currently in the selected BOM.'}
            </div>
            {persistenceWarning && <div role="alert" className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3 mt-3">{persistenceWarning}</div>}
            {bomSaveError && <div role="alert" className="text-[11px] text-red-700 bg-red-50 border border-red-200 rounded-md p-3 mt-3">{bomSaveError}</div>}
            {bomSaveMessage && <div role="status" className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md p-3 mt-3">{bomSaveMessage}</div>}
            <button
              className="mt-4 bg-slate-900 text-white border-none py-2.5 px-4 rounded-md text-xs font-semibold cursor-pointer hover:bg-slate-800 transition-all active:scale-[0.98]"
              onClick={handleAddSnapshotToBom}
            >
              Save configuration snapshot to BOM
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl flex flex-col shadow-xs overflow-hidden">
            <h2 className="m-0 py-3.5 px-4 text-xs font-semibold text-slate-800 border-b border-slate-150 bg-slate-50">
              Search Suppliers
            </h2>
            <div className="p-5 flex flex-col gap-4">
              <p className="text-xs text-slate-500 m-0 leading-relaxed">
                These links run supplier-site <strong>searches</strong>, not offers or listings. Verify identity, price, availability, and specifications directly on the supplier site.
              </p>
              <div className="flex flex-wrap gap-2">
                {supplierDestinations.map(destination => (
                  <a
                    key={destination.name}
                    href={destination.url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-slate-900 text-white hover:bg-slate-800 py-1.5 px-3.5 rounded-md no-underline font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-[0.98] shadow-xs"
                  >
                    <Search className="w-3.5 h-3.5" /> {destination.label} <ExternalLink className="w-3 h-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Divider — related configurations are de-emphasized below the supplier-search section */}
          <div className="flex items-center gap-3 pt-2">
            <div className="h-px bg-slate-200 flex-grow" />
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Related configurations</span>
            <div className="h-px bg-slate-200 flex-grow" />
          </div>

          <div className="bg-slate-50/50 border border-slate-150 rounded-xl flex flex-col overflow-hidden">
            <div className="flex flex-col">
              {db.filter(p => p.partNumber !== item.partNumber && (p.thread === item.thread || p.type === item.type)).slice(0, 5).map((related, idx) => (
                <Link
                  key={idx}
                  to={`/parts/${encodeURIComponent(related.partNumber)}`}
                  className="flex items-center justify-between py-3 px-4 border-b border-slate-100 hover:bg-white transition-colors no-underline text-slate-900 last:border-b-0 group"
                >
                  <div className="flex flex-col text-left font-sans">
                    <span className="text-xs font-mono font-bold text-slate-700 tracking-wider mb-0.5">{related.partNumber}</span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{related.type} &middot; {related.thread} x {related.length !== 'N/A' ? related.length : 'N/A'}</span>
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500 bg-white py-1 px-2.5 rounded-md border border-slate-200 group-hover:border-slate-400 transition-all flex items-center gap-1">
                    Inspect <ArrowLeft className="w-2.5 h-2.5 rotate-180" />
                  </div>
                </Link>
              ))}
              {db.filter(p => p.partNumber !== item.partNumber && (p.thread === item.thread || p.type === item.type)).length === 0 && (
                <div className="py-4 px-4 text-xs text-slate-400 italic text-center font-medium">
                  No related configurations indexed in segment.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
