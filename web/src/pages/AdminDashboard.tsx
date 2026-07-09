import React, { useState } from 'react';
import { useBOM, Order } from '../hooks/useBOM';
import { useCurrency } from '../contexts/CurrencyContext';
import { Package, Truck, Edit3, X, CheckCircle, Code, Copy, Check } from 'lucide-react';

export function AdminDashboard() {
  const { formatPrice } = useCurrency();
  const { orders, updateOrder } = useBOM();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'widget'>('orders');

  // Widget settings state
  const [widgetPartNumber, setWidgetPartNumber] = useState('91251A542');
  const [widgetTheme, setWidgetTheme] = useState('dark');
  const [widgetAccent, setWidgetAccent] = useState('#3b82f6');
  const [widgetShowGrid, setWidgetShowGrid] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleEditClick = (order: Order) => {
    setSelectedOrder(JSON.parse(JSON.stringify(order)));
  };

  const handleClose = () => {
    setSelectedOrder(null);
  };

  const handleSave = () => {
    if (selectedOrder) {
      const newSubtotal = selectedOrder.items.reduce((sum, item) => sum + (item.qty * item.unitCost), 0);
      selectedOrder.subtotal = newSubtotal;
      selectedOrder.total = newSubtotal + selectedOrder.shippingFee + selectedOrder.brokerageFee;
      
      updateOrder(selectedOrder);
      setSelectedOrder(null);
      window.location.reload();
    }
  };

  const handleItemChange = (index: number, field: 'unitCost' | 'supplier', value: string | number) => {
    if (!selectedOrder) return;
    const newOrder = { ...selectedOrder };
    if (field === 'unitCost') {
      newOrder.items[index].unitCost = Number(value) || 0;
    } else {
      newOrder.items[index].supplier = String(value);
    }
    setSelectedOrder(newOrder);
  };

  // Built from the current origin so the snippet works on localhost, GitHub
  // Pages (/partsource/ base), and the future partsource.io domain alike.
  const embedCode = `<iframe src="${window.location.origin}${import.meta.env.BASE_URL}embed/${widgetPartNumber}?theme=${widgetTheme}&accent=${encodeURIComponent(widgetAccent)}&grid=${widgetShowGrid}" width="100%" height="400" frameborder="0"></iframe>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusOptions = [
    'Order Submitted',
    'Quoting & Consolidating',
    'Shipped from Consolidated Warehouse',
    'Delivered'
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-left">
      {/* Banner */}
      <div className="bg-slate-900 text-white p-8 pb-20 relative overflow-hidden">
        <div className="flex items-center justify-between z-10 relative">
          <div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Broker Admin Console
            </h1>
            <p className="text-xs text-slate-350 mt-1.5 leading-normal">Management workspace for consolidated brokerage orders and vendor integrations.</p>
          </div>
          <span className="text-[10px] font-medium text-slate-350 bg-slate-800 px-2.5 py-0.5 rounded-md">V1.0</span>
        </div>
        
        <div className="flex gap-2 mt-8 z-10 relative">
          <button 
            className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer active:scale-[0.98] ${
              activeTab === 'orders' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'bg-slate-900/50 text-slate-300 hover:text-white'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            Consignment Orders
          </button>
          <button 
            className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer flex items-center gap-2 active:scale-[0.98] ${
              activeTab === 'widget' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'bg-slate-900/50 text-slate-300 hover:text-white'
            }`}
            onClick={() => setActiveTab('widget')}
          >
            <Code className="w-3.5 h-3.5" /> Widget Configurator
          </button>
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto -mt-6 px-6 pb-12 relative z-10">
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-450 text-[10px] font-semibold uppercase tracking-wider">
                  <th className="p-4 pl-6">Registry ID</th>
                  <th className="p-4">Submission Date</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4 text-right">Items</th>
                  <th className="p-4 text-right">Extended Total</th>
                  <th className="p-4">Sourcing Status</th>
                  <th className="p-4 pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-400 font-medium">
                      No active sourcing requests found in database registry.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/30 transition-colors">
                      <td className="p-4 pl-6 font-mono font-bold text-slate-900 tracking-wider">#{order.id}</td>
                      <td className="p-4 text-slate-500">
                        <span className="font-semibold">{new Date(order.date).toLocaleDateString()}</span><br/>
                        <span className="text-[10px] text-slate-400">{new Date(order.date).toLocaleTimeString()}</span>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-900">{order.customer?.name || 'Unknown'}</div>
                        <div className="text-slate-400 text-[10px] uppercase font-bold mt-0.5">{order.customer?.company || 'No Company'}</div>
                        <div className="text-slate-400 text-[10px]">{order.customer?.email || 'N/A'}</div>
                      </td>
                      <td className="p-4 text-right font-medium text-slate-700">{order.items.length}</td>
                      <td className="p-4 text-right font-bold text-slate-900 font-mono">{formatPrice(order.total)}</td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded text-[10px] font-semibold">
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6">
                        <button 
                          onClick={() => handleEditClick(order)}
                          className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 bg-white border border-slate-250 py-1.5 px-3 rounded-md cursor-pointer text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Manage
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'widget' && (
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 mb-6 flex items-center gap-2">
                Widget Configuration Parameters
              </h2>
              
              <div className="space-y-6 text-xs font-medium text-left">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Default Part Number</label>
                  <input 
                    type="text" 
                    value={widgetPartNumber}
                    onChange={(e) => setWidgetPartNumber(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:border-slate-950 outline-none transition-all text-xs font-semibold"
                    placeholder="e.g. 91251A542"
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5 font-medium">// Part loaded on widget initialization.</p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Visual Theme Style</label>
                  <select 
                    value={widgetTheme}
                    onChange={(e) => setWidgetTheme(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:border-slate-950 outline-none transition-all text-xs font-semibold"
                  >
                    <option value="light">LIGHT (CLEAN CONTRAST)</option>
                    <option value="dark">DARK (BLUEPRINT TERMINAL)</option>
                    <option value="slate">SLATE (TACTICAL GRAY)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Primary Accent Color</label>
                  <div className="flex gap-3">
                    <input 
                      type="color" 
                      value={widgetAccent}
                      onChange={(e) => setWidgetAccent(e.target.value)}
                      className="h-10 w-16 p-1 border border-slate-200 rounded-lg cursor-pointer bg-white"
                    />
                    <input 
                      type="text" 
                      value={widgetAccent}
                      onChange={(e) => setWidgetAccent(e.target.value)}
                      className="flex-1 border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:border-slate-950 outline-none text-xs font-mono font-bold uppercase"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <input 
                    type="checkbox" 
                    id="showGrid"
                    checked={widgetShowGrid}
                    onChange={(e) => setWidgetShowGrid(e.target.checked)}
                    className="w-4 h-4 accent-slate-900 rounded-md focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="showGrid" className="text-slate-700 font-semibold cursor-pointer">
                    Show Supplier Grid & Pricing Matrix
                  </label>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-200 text-left">
                <h3 className="text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-wider">Embed Integration Code</h3>
                <div className="relative">
                  <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-x-auto text-[11px] font-mono leading-relaxed border border-slate-850 shadow-inner w-full">
                    {embedCode}
                  </pre>
                  <button 
                    onClick={handleCopyCode}
                    className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 text-white p-2 rounded-md transition-all border border-slate-800 flex items-center gap-2 text-xs font-semibold backdrop-blur-xs cursor-pointer active:scale-[0.98]"
                  >
                    {copied ? <><Check className="w-3.5 h-3.5 text-green-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy Code</>}
                  </button>
                </div>
              </div>
            </div>

            {/* Widget Preview Screen */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col relative overflow-hidden shadow-xs">
              <h3 className="text-xs font-semibold text-slate-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Integration Live Preview
              </h3>
              
              <div className="flex-1 rounded-lg border overflow-hidden flex flex-col relative shadow-sm"
                   style={{ 
                     backgroundColor: widgetTheme === 'dark' ? '#0a0f1d' : widgetTheme === 'slate' ? '#1e293b' : '#ffffff',
                     borderColor: widgetTheme === 'light' ? '#cbd5e1' : '#334155'
                   }}>
                {/* Mock Widget Header */}
                <div className="p-4 border-b flex items-center justify-between"
                     style={{ borderColor: widgetTheme === 'light' ? '#e2e8f0' : '#334155' }}>
                  <div className="text-left font-sans">
                    <div className="text-[9px] font-bold uppercase tracking-widest opacity-50 mb-1" style={{ color: widgetTheme === 'light' ? '#64748b' : '#94a3b8' }}>Component Spec</div>
                    <div className="text-xs font-bold tracking-wider font-mono" style={{ color: widgetTheme === 'light' ? '#0f172a' : '#f8fafc' }}>
                      {widgetPartNumber}
                    </div>
                  </div>
                  <div className="px-2 py-0.5 text-[10px] font-semibold border rounded"
                       style={{ backgroundColor: `${widgetAccent}15`, color: widgetAccent, borderColor: `${widgetAccent}30` }}>
                    Verified Match
                  </div>
                </div>
                
                {/* Mock Widget Body */}
                <div className="p-4 flex-1 flex flex-col gap-4 text-left font-sans">
                  <div className="grid grid-cols-2 gap-4 text-[10px]">
                    <div className="space-y-1">
                      <div className="font-semibold uppercase opacity-55" style={{ color: widgetTheme === 'light' ? '#64748b' : '#94a3b8' }}>Material</div>
                      <div className="font-bold text-slate-800 uppercase" style={{ color: widgetTheme === 'light' ? '#334155' : '#e2e8f0' }}>Stainless Steel 18-8</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-semibold uppercase opacity-55" style={{ color: widgetTheme === 'light' ? '#64748b' : '#94a3b8' }}>Thread pitch</div>
                      <div className="font-bold text-slate-800" style={{ color: widgetTheme === 'light' ? '#334155' : '#e2e8f0' }}>1/4"-20</div>
                    </div>
                  </div>
 
                  {widgetShowGrid && (
                    <div className="mt-2 border rounded-lg overflow-hidden text-xs" style={{ borderColor: widgetTheme === 'light' ? '#e2e8f0' : '#334155' }}>
                      <div className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider" style={{ backgroundColor: widgetTheme === 'light' ? '#f8fafc' : '#0a0f1d', color: widgetTheme === 'light' ? '#475569' : '#94a3b8', borderBottom: `1px solid ${widgetTheme === 'light' ? '#e2e8f0' : '#334155'}` }}>
                        Equivalents pricing grid
                      </div>
                      <div className="p-2.5 flex items-center justify-between">
                        <span className="font-medium" style={{ color: widgetTheme === 'light' ? '#64748b' : '#94a3b8' }}>Vendor A (Consolidated)</span>
                        <span className="font-bold font-mono" style={{ color: widgetTheme === 'light' ? '#0f172a' : '#f8fafc' }}>$0.24</span>
                      </div>
                      <div className="p-2.5 flex items-center justify-between" style={{ borderTop: `1px solid ${widgetTheme === 'light' ? '#f1f5f9' : '#1e293b'}` }}>
                        <span className="font-medium" style={{ color: widgetTheme === 'light' ? '#64748b' : '#94a3b8' }}>Vendor B (Consolidated)</span>
                        <span className="font-bold font-mono" style={{ color: widgetTheme === 'light' ? '#0f172a' : '#f8fafc' }}>$0.29</span>
                      </div>
                    </div>
                  )}
 
                  <div className="mt-auto pt-4">
                    <button 
                      className="w-full py-2.5 rounded-lg font-semibold text-white text-xs transition-all hover:opacity-90 cursor-pointer border-none active:scale-[0.98]"
                      style={{ backgroundColor: widgetAccent }}
                    >
                      Consolidate Sourcing Channel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex justify-end font-sans">
          <div className="w-full max-w-2xl bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right-full duration-300 relative rounded-none">
            <div className="flex justify-between items-center p-6 border-b border-slate-250 bg-slate-50">
              <div className="text-left">
                <h2 className="text-base font-semibold text-slate-900 m-0">
                  Fulfillment Console: Order #{selectedOrder.id}
                </h2>
                <p className="text-xs text-slate-450 m-0 mt-1.5">Review, set suppliers routing path, update line items costs</p>
              </div>
              <button 
                className="bg-transparent border-none text-slate-400 hover:text-slate-900 cursor-pointer p-2 hover:bg-slate-200 transition-colors rounded-full"
                onClick={handleClose}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
              
              {/* Order Status & Tracking */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left">
                <h3 className="text-xs font-semibold text-slate-800 m-0 mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <Truck className="w-4 h-4 text-slate-500" /> Fulfillment Status & Routing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 uppercase tracking-wider">Sourcing Status</label>
                    <select 
                      className="border border-slate-200 bg-white rounded-lg p-2 focus:border-slate-900 outline-none text-xs font-medium"
                      value={selectedOrder.status}
                      onChange={(e) => setSelectedOrder({...selectedOrder, status: e.target.value as any})}
                    >
                      {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 uppercase tracking-wider">Consignment Tracking Reference</label>
                    <input 
                      type="text" 
                      className="border border-slate-200 bg-white rounded-lg p-2 focus:border-slate-900 outline-none text-xs font-medium"
                      value={selectedOrder.trackingNumber || ''}
                      onChange={(e) => setSelectedOrder({...selectedOrder, trackingNumber: e.target.value})}
                      placeholder="e.g. 1Z9..."
                    />
                  </div>
                </div>
              </div>

              {/* Line Items Override */}
              <div className="text-left">
                <h3 className="text-xs font-semibold text-slate-800 m-0 mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <Package className="w-4 h-4 text-slate-500" /> Line Items Custom Quotes
                </h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-450 text-[10px] font-semibold uppercase tracking-wider">
                          <th className="p-3">Part Details</th>
                          <th className="p-3">Supplier Routing</th>
                          <th className="p-3 text-right">Units</th>
                          <th className="p-3 text-right">Unit Price ($)</th>
                          <th className="p-3 text-right">Extended ($)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item, idx) => (
                          <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                            <td className="p-3">
                              <div className="font-mono font-bold text-slate-900 tracking-wider">{item.partNumber}</div>
                              <div className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]" title={item.description}>{item.description}</div>
                            </td>
                            <td className="p-3">
                              <input 
                                type="text" 
                                value={item.supplier}
                                onChange={(e) => handleItemChange(idx, 'supplier', e.target.value)}
                                className="border border-slate-200 rounded-lg p-1.5 text-xs w-full min-w-[120px] focus:border-slate-900 outline-none font-medium"
                              />
                              <div className="text-[10px] text-slate-400 font-medium cursor-pointer hover:text-slate-800 transition-colors mt-1" onClick={() => handleItemChange(idx, 'supplier', 'CUSTOM ROUTED')}>
                                Route to custom source
                              </div>
                            </td>
                            <td className="p-3 text-right font-medium text-slate-700">{item.qty}</td>
                            <td className="p-3 text-right">
                              <input 
                                type="number" 
                                step="0.01"
                                value={item.unitCost}
                                onChange={(e) => handleItemChange(idx, 'unitCost', e.target.value)}
                                className="border border-slate-200 rounded-lg p-1.5 text-xs w-20 text-right focus:border-slate-900 outline-none font-mono font-bold"
                              />
                            </td>
                            <td className="p-3 text-right font-bold text-slate-900 font-mono">
                              {formatPrice(item.qty * item.unitCost)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Financials & Markup */}
              <div className="bg-slate-900 text-white rounded-xl p-5 text-left relative overflow-hidden shadow-xs">
                <h3 className="text-xs font-semibold text-slate-300 m-0 mb-4 flex items-center gap-2 uppercase tracking-wider relative z-10">
                  <CheckCircle className="w-4 h-4 text-emerald-450" /> Financial Console Summary
                </h3>
                
                <div className="flex flex-col gap-3.5 max-w-sm relative z-10 text-xs font-medium">
                  <div className="flex justify-between items-center text-slate-350">
                    <span>Hardware Subtotal</span>
                    <span className="font-semibold font-mono">{formatPrice(selectedOrder.items.reduce((s, i) => s + (i.qty * i.unitCost), 0))}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-slate-350">
                    <span>Consolidated Shipping</span>
                    <input 
                      type="number" 
                      step="0.01"
                      className="border border-slate-800 bg-slate-950 text-white rounded-lg p-1 text-xs w-20 text-right focus:border-slate-700 outline-none font-mono font-bold"
                      value={selectedOrder.shippingFee}
                      onChange={(e) => setSelectedOrder({...selectedOrder, shippingFee: Number(e.target.value)})}
                    />
                  </div>

                  <div className="flex justify-between items-center text-slate-350">
                    <span>Markup Consolidation Fee</span>
                    <input 
                      type="number" 
                      step="0.01"
                      className="border border-slate-800 bg-slate-950 text-emerald-400 rounded-lg p-1 text-xs w-20 text-right focus:border-slate-700 outline-none font-mono font-bold"
                      value={selectedOrder.brokerageFee}
                      onChange={(e) => setSelectedOrder({...selectedOrder, brokerageFee: Number(e.target.value)})}
                    />
                  </div>
                  
                  <div className="border-t border-slate-800 pt-3.5 mt-1 flex justify-between items-center text-xs uppercase tracking-wider">
                    <span className="font-semibold text-white">Final Total Charged</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {formatPrice(
                        selectedOrder.items.reduce((s, i) => s + (i.qty * i.unitCost), 0) + 
                        selectedOrder.shippingFee + 
                        selectedOrder.brokerageFee
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-200 bg-white flex justify-end gap-3">
              <button 
                onClick={handleClose}
                className="px-6 py-2 rounded-md border border-slate-200 text-slate-700 font-semibold text-xs cursor-pointer hover:bg-slate-50 transition-all active:scale-[0.98]"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 rounded-md bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 border-none cursor-pointer shadow-sm transition-all active:scale-[0.98]"
              >
                Apply Updates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
