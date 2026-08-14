import PocApp from './poc/PocApp';

export default function App() {
  const path = window.location.pathname;
  if (path === '/' || path === '/partsource/') return <PocApp />;
  return <main className="poc-shell"><section className="poc-card"><h1>Workspace route unavailable</h1><p>Use the catalog workspace route.</p></section></main>;
}
