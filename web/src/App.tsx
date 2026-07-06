/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        <div className="flex flex-col h-screen w-full bg-[var(--bg-page)] text-[var(--text-primary)] font-sans overflow-hidden">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/parts/:partNumber" element={<PartDetail />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </CurrencyProvider>
  );
}
