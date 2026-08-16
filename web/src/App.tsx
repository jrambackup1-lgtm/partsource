import CatalogApp from './catalog/ui/CatalogApp';

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/' || path === '/partsource' || path === '/catalog') return <CatalogApp />;
  return <main className="route-error"><h1>Page not found</h1><a href="/partsource/">Return to the catalog</a></main>;
}
