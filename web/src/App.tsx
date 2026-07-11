/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { PartDetail } from './pages/PartDetail';
import { WidgetEmbed } from './pages/WidgetEmbed';
import { ReferenceIndex, ReferenceArticle } from './pages/Reference';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { findRefPage } from './lib/reference';

const PRODUCTION_URL = 'https://jrambackup1-lgtm.github.io/partsource';

function getRoutePath(pathname: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base && pathname.startsWith(base) ? pathname.slice(base.length) || '/' : pathname;
}

function isKnownRoute(pathname: string) {
  if (pathname === '/' || pathname === '/reference') return true;
  if (/^\/(parts|embed)\/[^/]+$/.test(pathname)) return true;
  const reference = pathname.match(/^\/reference\/([^/]+)$/);
  return Boolean(reference && findRefPage(decodeURIComponent(reference[1])));
}

function RouteMetadata() {
  const location = useLocation();

  useEffect(() => {
    const pathname = getRoutePath(location.pathname);
    const canonical = document.querySelector('link[rel="canonical"]') ?? document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', pathname === '/' ? `${PRODUCTION_URL}/` : `${PRODUCTION_URL}${pathname}`);
    if (!canonical.parentNode) document.head.appendChild(canonical);

    const mustNoIndex = /^\/(parts|embed)\//.test(pathname) || !isKnownRoute(pathname);
    const robots = document.querySelector('meta[name="robots"]') ?? document.createElement('meta');
    if (mustNoIndex) {
      robots.setAttribute('name', 'robots');
      robots.setAttribute('content', 'noindex,follow');
      if (!robots.parentNode) document.head.appendChild(robots);
    } else {
      robots.remove();
    }
  }, [location.pathname]);

  return null;
}

function NotFound() {
  return (
    <div className="flex flex-col flex-grow items-center justify-center p-8 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Not Found</h1>
      <p className="mt-2 text-sm text-slate-500">This page does not exist.</p>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isEmbed = getRoutePath(location.pathname).startsWith('/embed/');

  if (isEmbed) {
    return (
      <>
        <RouteMetadata />
        <Routes>
          <Route path="/embed/:partNumber" element={<WidgetEmbed />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </>
    );
  }

  return (
    <div className="flex flex-row h-screen w-full bg-[#f8fafc] text-slate-900 font-sans overflow-hidden">
      <RouteMetadata />
      {/* Left Sidebar Navigation */}
      <Sidebar />

      {/* Right Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Global Search & Profile Header */}
        <Header />

        {/* Scrollable Content Pane */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/parts/:partNumber" element={<PartDetail />} />
              <Route path="/reference" element={<ReferenceIndex />} />
              <Route path="/reference/:slug" element={<ReferenceArticle />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          
          {/* Minimal footer aligned with the content */}
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <CurrencyProvider>
      <Router basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <AppContent />
      </Router>
    </CurrencyProvider>
  );
}
