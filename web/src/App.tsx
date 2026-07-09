/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { PartDetail } from './pages/PartDetail';
import { AdminDashboard } from './pages/AdminDashboard';
import { WidgetEmbed } from './pages/WidgetEmbed';
import { CurrencyProvider } from './contexts/CurrencyContext';

function AppContent() {
  const location = useLocation();
  const isEmbed = location.pathname.startsWith('/embed/');

  if (isEmbed) {
    return (
      <Routes>
        <Route path="/embed/:partNumber" element={<WidgetEmbed />} />
      </Routes>
    );
  }

  return (
    <div className="flex flex-row h-screen w-full bg-[#f8fafc] text-slate-900 font-sans overflow-hidden">
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
              <Route path="/admin" element={<AdminDashboard />} />
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

