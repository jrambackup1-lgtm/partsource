import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { REF_PAGES, findRefPage, RefTable } from '../lib/reference';
import { db } from '../lib/decoder';

function setMeta(title: string, description: string) {
  document.title = title;
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'description');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', description);
}

function DataTable({ table }: { table: RefTable }) {
  return (
    <div className="overflow-x-auto border border-slate-200 rounded-lg">
      <table className="w-full border-collapse text-left m-0 text-xs">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
            {table.headers.map(h => <th key={h} className="py-2.5 px-3.5 whitespace-nowrap">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
              {row.map((cell, j) => (
                <td key={j} className={`py-2 px-3.5 whitespace-nowrap ${j === 0 ? 'font-mono font-bold text-slate-900' : 'text-slate-700'}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ReferenceIndex() {
  useEffect(() => {
    setMeta(
      'Fastener Engineering Reference | PartSource.io',
      'Size charts, torque tables, thread data, and identification guides for standard fasteners — DIN 912, DIN 934, ISO 7380 and more.'
    );
  }, []);

  return (
    <div className="flex flex-col flex-grow w-full max-w-[1000px] mx-auto p-6 font-sans text-left">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 m-0 flex items-center gap-2.5">
          <BookOpen className="w-6 h-6 text-slate-400" /> Engineering Reference
        </h1>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-[640px]">
          Size charts, torque tables, and identification guides reproduced from public
          DIN/ISO standards data. Every table links back to indexed catalog parts.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REF_PAGES.map(p => (
          <Link
            key={p.slug}
            to={`/reference/${p.slug}`}
            className="bg-white border border-slate-200 rounded-xl p-5 no-underline hover:border-slate-400 hover:shadow-xs transition-all group"
          >
            <h2 className="text-sm font-bold text-slate-900 m-0 leading-snug group-hover:underline">{p.title}</h2>
            <p className="text-xs text-slate-500 mt-2 m-0 leading-relaxed">{p.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ReferenceArticle() {
  const { slug } = useParams();
  const page = slug ? findRefPage(slug) : null;

  useEffect(() => {
    if (page) setMeta(`${page.title} | PartSource.io`, page.description);
  }, [page]);

  if (!page) {
    return (
      <div className="p-8 text-sm font-medium text-slate-500">
        <h1 className="text-2xl font-bold text-slate-900">Not Found</h1>
        <p className="mt-2">Reference page not found. <Link to="/reference" className="underline">Browse the reference library</Link>.</p>
      </div>
    );
  }

  const catalogParts = page.catalogStandard
    ? db.filter(p => p.standard === page.catalogStandard).slice(0, 6)
    : [];

  return (
    <div className="flex flex-col flex-grow w-full max-w-[860px] mx-auto p-6 font-sans text-left">
      <Link to="/reference" className="flex items-center gap-2 text-xs font-semibold text-slate-500 no-underline hover:text-slate-800 w-fit mb-6 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Reference Library
      </Link>

      <h1 className="text-2xl font-bold tracking-tight text-slate-900 m-0 mb-4 leading-tight">{page.title}</h1>
      {page.intro.map((para, i) => (
        <p key={i} className="text-sm text-slate-600 leading-relaxed m-0 mb-3">{para}</p>
      ))}

      {page.sections.map(section => (
        <section key={section.heading} className="mt-6">
          <h2 className="text-base font-bold text-slate-900 m-0 mb-3">{section.heading}</h2>
          {section.table && <DataTable table={section.table} />}
          {section.body?.map((para, i) => (
            <p key={i} className="text-xs text-slate-500 leading-relaxed mt-3 m-0">{para}</p>
          ))}
        </section>
      ))}

      {catalogParts.length > 0 && (
        <section className="mt-8 bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-xs font-semibold text-slate-800 m-0 mb-3 uppercase tracking-wider">Indexed catalog parts ({page.catalogStandard})</h2>
          <div className="flex flex-wrap gap-2">
            {catalogParts.map(p => (
              <Link key={p.partNumber} to={`/parts/${encodeURIComponent(p.partNumber)}`} className="text-[11px] font-mono font-bold text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md no-underline hover:border-slate-400">
                {p.partNumber}
              </Link>
            ))}
          </div>
        </section>
      )}

      {page.related.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xs font-semibold text-slate-400 m-0 mb-2 uppercase tracking-wider">Related reference</h2>
          <div className="flex flex-col gap-1.5">
            {page.related.map(slug => {
              const rel = findRefPage(slug);
              return rel ? (
                <Link key={slug} to={`/reference/${slug}`} className="text-xs font-semibold text-slate-600 no-underline hover:text-slate-900 hover:underline w-fit">
                  {rel.title}
                </Link>
              ) : null;
            })}
          </div>
        </section>
      )}
    </div>
  );
}
