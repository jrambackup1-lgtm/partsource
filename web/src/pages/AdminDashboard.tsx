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
  const [widgetTheme, setWidgetTheme] = useState('light');
  const [widgetAccent, setWidgetAccent] = useState('#2563eb');
  const [widgetShowGrid, setWidgetShowGrid] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleEditClick = (order: Order) => {
    // Clone order to avoid mutating state directly
    setSelectedOrder(JSON.parse(JSON.stringify(order)));
  };

  const handleClose = () => {
    setSelectedOrder(null);
  };

  const handleSave = () => {
    if (selectedOrder) {
      // Recalculate totals
      const newSubtotal = selectedOrder.items.reduce((sum, item) => sum + (item.qty * item.unitCost), 0);
      selectedOrder.subtotal = newSubtotal;
      selectedOrder.total = newSubtotal + selectedOrder.shippingFee + selectedOrder.brokerageFee;
      
      updateOrder(selectedOrder);
      setSelectedOrder(null);
      // We might need to reload or it will update on next remount, actually let's force reload
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

  const handleCopyCode = () => {
    const code = `<iframe src="https://partsource.io/embed/${widgetPartNumber}?theme=${widgetTheme}&accent=${encodeURIComponent(widgetAccent)}&grid=${widgetShowGrid}" width="100%" height="400" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(code);
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
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white p-6 pb-20">
        <h1 className="text-3xl font-bold m-0 mb-2">Sourcing Broker Admin</h1>
        <p className="text-slate-400 m-0">Manage and fulfill consolidated BOM requests from clients.</p>
        
        <div className="flex gap-4 mt-8">
          <button 
            className={`px-4 py-2 rounded-t-lg font-semibold transition-colors ${activeTab === 'orders' ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            onClick={() => setActiveTab('orders')}
          >
            Manage Orders
          </button>
          <button 
            className={`px-4 py-2 rounded-t-lg font-semibold transition-colors flex items-center gap-2 ${activeTab === 'widget' ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            onClick={() => setActiveTab('widget')}
          >
            <Code className="w-4 h-4" /> Embeddable Widget
          </button>
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto -mt-6 px-6 pb-12">
        {activeTab === 'orders' && (
          <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 text-sm">
                <tr>
                  <th className="p-4 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold text-right">Items</th>
                  <th className="p-4 font-semibold text-right">Total</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No orders found in the system.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4 font-mono font-bold text-slate-800">#{order.id}</td>
                      <td className="p-4 text-sm text-slate-600">
                        {new Date(order.date).toLocaleDateString()}<br/>
                        <span className="text-xs text-slate-400">{new Date(order.date).toLocaleTimeString()}</span>
                      </td>
                      <td className="p-4 text-sm">
                        <div className="font-semibold text-slate-800">{order.customer?.name || 'Unknown'}</div>
                        <div className="text-slate-500 text-xs">{order.customer?.company || 'No Company'}</div>
                        <div className="text-slate-500 text-xs">{order.customer?.email || 'N/A'}</div>
                      </td>
                      <td className="p-4 text-right font-mono text-sm">{order.items.length}</td>
                      <td className="p-4 text-right font-mono font-bold text-slate-800">{formatPrice(order.total)}</td>
                      <td className="p-4">
                        <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded text-xs font-semibold">
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => handleEditClick(order)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-transparent border-none cursor-pointer text-sm font-semibold"
                        >
                          <Edit3 className="w-4 h-4" /> Manage
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
          <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm border border-slate-200 p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Widget Configuration</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Default Part Number</label>
                  <input 
                    type="text" 
                    value={widgetPartNumber}
                    onChange={(e) => setWidgetPartNumber(e.target.value)}
                    className="w-full border border-slate-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g. 91251A542"
                  />
                  <p className="text-xs text-slate-500 mt-1">The McMaster part number that will preload when the widget initializes.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Theme Style</label>
                  <select 
                    value={widgetTheme}
                    onChange={(e) => setWidgetTheme(e.target.value)}
                    className="w-full border border-slate-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="light">Light (Clean & Minimal)</option>
                    <option value="dark">Dark (Terminal / Engineering)</option>
                    <option value="slate">High-Contrast Slate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Accent Color</label>
                  <div className="flex gap-3">
                    <input 
                      type="color" 
                      value={widgetAccent}
                      onChange={(e) => setWidgetAccent(e.target.value)}
                      className="h-10 w-16 p-1 border border-slate-300 rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={widgetAccent}
                      onChange={(e) => setWidgetAccent(e.target.value)}
                      className="flex-1 border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm uppercase"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-md">
                  <input 
                    type="checkbox" 
                    id="showGrid"
                    checked={widgetShowGrid}
                    onChange={(e) => setWidgetShowGrid(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <label htmlFor="showGrid" className="text-sm font-medium text-slate-700 cursor-pointer">
                    Show Supplier Grid & Pricing Matrix
                  </label>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Embed Code</h3>
                <div className="relative">
                  <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed border border-slate-700 shadow-inner">
                    {`<iframe src="https://partsource.io/embed/${widgetPartNumber}?theme=${widgetTheme}&accent=${encodeURIComponent(widgetAccent)}&grid=${widgetShowGrid}" width="100%" height="400" frameborder="0"></iframe>`}
                  </pre>
                  <button 
                    onClick={handleCopyCode}
                    className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 text-white p-2 rounded transition-colors flex items-center gap-2 text-xs font-semibold backdrop-blur-sm"
                  >
                    {copied ? <><Check className="w-4 h-4 text-green-400" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Snippet</>}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 rounded-xl p-6 border border-slate-200 flex flex-col">
              <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Preview
              </h3>
              
              <div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col relative"
                   style={{ 
                     backgroundColor: widgetTheme === 'dark' ? '#0f172a' : widgetTheme === 'slate' ? '#1e293b' : '#ffffff',
                     borderColor: widgetTheme === 'light' ? '#e2e8f0' : '#334155'
                   }}>
                {/* Mock Widget Header */}
                <div className="p-4 border-b flex items-center justify-between"
                     style={{ borderColor: widgetTheme === 'light' ? '#f1f5f9' : '#334155' }}>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1" style={{ color: widgetTheme === 'light' ? '#64748b' : '#94a3b8' }}>Part Details</div>
                    <div className="font-mono text-lg font-bold" style={{ color: widgetTheme === 'light' ? '#0f172a' : '#f8fafc' }}>
                      {widgetPartNumber}
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded text-xs font-bold uppercase"
                       style={{ backgroundColor: `${widgetAccent}20`, color: widgetAccent }}>
                    In Stock
                  </div>
                </div>
                
                {/* Mock Widget Body */}
                <div className="p-5 flex-1 flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-xs font-medium" style={{ color: widgetTheme === 'light' ? '#64748b' : '#94a3b8' }}>Material</div>
                      <div className="text-sm font-semibold" style={{ color: widgetTheme === 'light' ? '#334155' : '#e2e8f0' }}>18-8 Stainless Steel</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-medium" style={{ color: widgetTheme === 'light' ? '#64748b' : '#94a3b8' }}>Thread Size</div>
                      <div className="text-sm font-semibold" style={{ color: widgetTheme === 'light' ? '#334155' : '#e2e8f0' }}>1/4"-20</div>
                    </div>
                  </div>

                  {widgetShowGrid && (
                    <div className="mt-4 border rounded-md overflow-hidden" style={{ borderColor: widgetTheme === 'light' ? '#e2e8f0' : '#334155' }}>
                      <div className="px-3 py-2 text-xs font-bold uppercase" style={{ backgroundColor: widgetTheme === 'light' ? '#f8fafc' : '#0f172a', color: widgetTheme === 'light' ? '#475569' : '#94a3b8', borderBottom: `1px solid ${widgetTheme === 'light' ? '#e2e8f0' : '#334155'}` }}>
                        Supplier Matrix
                      </div>
                      <div className="p-3 text-sm flex items-center justify-between">
                        <span style={{ color: widgetTheme === 'light' ? '#334155' : '#e2e8f0' }}>Supplier A</span>
                        <span className="font-mono font-bold" style={{ color: widgetTheme === 'light' ? '#0f172a' : '#f8fafc' }}>$0.24</span>
                      </div>
                      <div className="p-3 text-sm flex items-center justify-between" style={{ borderTop: `1px solid ${widgetTheme === 'light' ? '#f1f5f9' : '#1e293b'}` }}>
                        <span style={{ color: widgetTheme === 'light' ? '#334155' : '#e2e8f0' }}>Supplier B</span>
                        <span className="font-mono font-bold" style={{ color: widgetTheme === 'light' ? '#0f172a' : '#f8fafc' }}>$0.29</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-4">
                    <button 
                      className="w-full py-2.5 rounded font-bold text-white transition-opacity hover:opacity-90 shadow-sm"
                      style={{ backgroundColor: widgetAccent }}
                    >
                      Source Part
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex justify-end">
          <div className="w-full max-w-3xl bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right-full duration-300">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-900 m-0">Manage Order #{selectedOrder.id}</h2>
                <p className="text-sm text-slate-500 m-0 mt-1">Review items, set final supplier routes, and update status.</p>
              </div>
              <button 
                className="bg-transparent border-none text-slate-400 hover:text-slate-700 cursor-pointer p-2 rounded-full hover:bg-slate-200 transition-colors"
                onClick={handleClose}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
              
              {/* Order Status & Tracking */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                <h3 className="text-base font-bold text-slate-800 m-0 mb-4 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-slate-500" /> Fulfillment Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Sourcing Status</label>
                    <select 
                      className="border border-slate-300 rounded p-2 text-sm focus:border-blue-500 outline-none"
                      value={selectedOrder.status}
                      onChange={(e) => setSelectedOrder({...selectedOrder, status: e.target.value as any})}
                    >
                      {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Tracking Number</label>
                    <input 
                      type="text" 
                      className="border border-slate-300 rounded p-2 text-sm focus:border-blue-500 outline-none"
                      value={selectedOrder.trackingNumber || ''}
                      onChange={(e) => setSelectedOrder({...selectedOrder, trackingNumber: e.target.value})}
                      placeholder="e.g. 1Z9..."
                    />
                  </div>
                </div>
              </div>

              {/* Line Items Override */}
              <div>
                <h3 className="text-base font-bold text-slate-800 m-0 mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-slate-500" /> Custom Quote & Vendor Override
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-100 border-b border-slate-200">
                      <tr>
                        <th className="p-3 font-semibold text-slate-600">Part</th>
                        <th className="p-3 font-semibold text-slate-600">Supplier/Route</th>
                        <th className="p-3 font-semibold text-slate-600 text-right">Qty</th>
                        <th className="p-3 font-semibold text-slate-600 text-right">Unit Cost ($)</th>
                        <th className="p-3 font-semibold text-slate-600 text-right">Ext ($)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-100">
                          <td className="p-3">
                            <div className="font-mono font-bold text-slate-800">{item.partNumber}</div>
                            <div className="text-xs text-slate-500 max-w-[150px] truncate">{item.description}</div>
                          </td>
                          <td className="p-3">
                            <input 
                              type="text" 
                              value={item.supplier}
                              onChange={(e) => handleItemChange(idx, 'supplier', e.target.value)}
                              className="border border-slate-300 rounded p-1.5 text-xs w-full min-w-[120px] focus:border-blue-500 outline-none"
                            />
                            <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 cursor-pointer hover:text-blue-600" onClick={() => handleItemChange(idx, 'supplier', 'Custom Sourced')}>
                              Mark as "Custom Sourced"
                            </div>
                          </td>
                          <td className="p-3 text-right mono">{item.qty}</td>
                          <td className="p-3 text-right">
                            <input 
                              type="number" 
                              step="0.01"
                              value={item.unitCost}
                              onChange={(e) => handleItemChange(idx, 'unitCost', e.target.value)}
                              className="border border-slate-300 rounded p-1.5 text-xs w-20 text-right focus:border-blue-500 outline-none"
                            />
                          </td>
                          <td className="p-3 text-right mono font-bold text-slate-800">
                            {formatPrice(item.qty * item.unitCost)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financials & Markup */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                <h3 className="text-base font-bold text-blue-900 m-0 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" /> Brokerage Financials
                </h3>
                
                <div className="flex flex-col gap-3 max-w-sm">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Hardware Subtotal</span>
                    <span className="font-mono font-semibold">{formatPrice(selectedOrder.items.reduce((s, i) => s + (i.qty * i.unitCost), 0))}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Consolidated Shipping</span>
                    <input 
                      type="number" 
                      step="0.01"
                      className="border border-slate-300 rounded p-1 text-xs w-20 text-right focus:border-blue-500 outline-none bg-white"
                      value={selectedOrder.shippingFee}
                      onChange={(e) => setSelectedOrder({...selectedOrder, shippingFee: Number(e.target.value)})}
                    />
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-semibold">Brokerage Markup Fee</span>
                    <input 
                      type="number" 
                      step="0.01"
                      className="border border-blue-300 rounded p-1 text-xs w-20 text-right focus:border-blue-500 outline-none bg-white font-bold text-blue-700"
                      value={selectedOrder.brokerageFee}
                      onChange={(e) => setSelectedOrder({...selectedOrder, brokerageFee: Number(e.target.value)})}
                    />
                  </div>
                  
                  <div className="border-t border-blue-200 pt-3 mt-1 flex justify-between items-center text-lg">
                    <span className="font-bold text-blue-900">Total Charged</span>
                    <span className="font-mono font-extrabold text-blue-700">
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
                className="px-6 py-2 rounded border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 rounded bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 cursor-pointer shadow-sm"
              >
                Save Order Updates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
