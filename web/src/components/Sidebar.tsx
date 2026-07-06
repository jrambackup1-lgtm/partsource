import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  Layers, 
  Package, 
  Settings, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'dashboard';
  const path = location.pathname;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/?tab=dashboard' },
    { id: 'finder', label: 'Part Finder', icon: Search, path: '/?tab=finder' },
    { id: 'bom', label: 'BOM Manager', icon: Layers, path: '/?tab=bom' },
    { id: 'orders', label: 'Sourcing Orders', icon: Package, path: '/?tab=orders' },
  ];

  const handleLogout = () => {
    alert('Signing out...');
  };

  const handleSupport = () => {
    alert('Support system will be integrated in Phase 4.');
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-full select-none">
      <div className="flex flex-col">
        {/* Logo / Branding */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <Link to="/" className="no-underline flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 bg-slate-900 text-white font-bold text-sm rounded-lg shadow-sm">
              PS
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              partsource.io
            </span>
          </Link>
        </div>

        {/* Primary Navigation */}
        <nav className="p-4 flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isHome = path === '/';
            const isActive = isHome && activeTab === item.id;
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 no-underline ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation */}
      <div className="p-4 border-t border-slate-100 flex flex-col gap-1">
        <Link
          to="/admin"
          className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 no-underline ${
            path === '/admin'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Settings className={`w-5 h-5 ${path === '/admin' ? 'text-white' : 'text-slate-400'}`} />
          Admin Portal
        </Link>
        
        <button
          onClick={handleSupport}
          className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-none bg-transparent text-left cursor-pointer w-full"
        >
          <HelpCircle className="w-5 h-5 text-slate-400" />
          Support
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 border-none bg-transparent text-left cursor-pointer w-full mt-2"
        >
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
          Log out
        </button>
      </div>
    </aside>
  );
}
