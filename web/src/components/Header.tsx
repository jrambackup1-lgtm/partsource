import { Menu, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../contexts/CurrencyContext';

export function Header() {
  const { currency, setCurrency } = useCurrency();

  return (
    <header className="bg-[var(--bg-surface)] border-b border-[var(--border)] h-16 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button 
          className="bg-transparent border-none cursor-pointer text-[var(--text-secondary)] flex items-center p-1 hover:text-[var(--text-primary)]"
          onClick={() => alert('Menu functionality will be implemented in a future phase.')}
        >
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/" className="no-underline">
          <h1 className="m-0 text-xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2 before:content-['PS'] before:flex before:items-center before:justify-center before:w-8 before:h-8 before:bg-[var(--accent)] before:text-white before:text-xs before:font-bold before:rounded-sm">
            partsource.io
          </h1>
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <Link to="/admin" className="text-slate-400 hover:text-slate-600 transition-colors">
          <Settings className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] cursor-pointer">
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value as any)}
            className="bg-transparent border-none text-sm font-medium text-[var(--text-primary)] outline-none cursor-pointer"
          >
            <option value="USD">🇺🇸 USD ($)</option>
            <option value="EUR">🇪🇺 EUR (€)</option>
            <option value="GBP">🇬🇧 GBP (£)</option>
            <option value="CAD">🇨🇦 CAD (C$)</option>
          </select>
        </div>
        <button className="bg-transparent border-none text-sm font-medium text-[var(--text-primary)] cursor-pointer">
          Sign In
        </button>
        <button className="bg-[#1967d2] hover:bg-[#1557b0] text-white border-none py-2 px-5 rounded text-sm font-semibold cursor-pointer transition-colors">
          Sign up
        </button>
      </div>
    </header>
  );
}
