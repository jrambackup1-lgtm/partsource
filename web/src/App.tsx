/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { PartDetail } from './pages/PartDetail';
import { AdminDashboard } from './pages/AdminDashboard';
import { CurrencyProvider } from './contexts/CurrencyContext';

export default function App() {
  return (
    <CurrencyProvider>
      <Router>
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
      </Router>
    </CurrencyProvider>
  );
}
