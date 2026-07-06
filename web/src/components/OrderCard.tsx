import React from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { Order } from '../hooks/useBOM';
import { useCurrency } from '../contexts/CurrencyContext';

interface OrderCardProps { order: Order; }
export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const { formatPrice } = useCurrency();
  const steps = [
    { status: 'Order Submitted', icon: <Package className="w-4 h-4" /> },
    { status: 'Quoting & Consolidating', icon: <Clock className="w-4 h-4" /> },
    { status: 'Shipped from Consolidated Warehouse', icon: <Truck className="w-4 h-4" /> },
    { status: 'Delivered', icon: <CheckCircle className="w-4 h-4" /> }
  ];

  const currentStepIndex = steps.findIndex(s => s.status === order.status);

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[var(--border-light)] pb-4 mb-5">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="m-0 font-bold text-lg text-[var(--text-primary)]">Order #{order.id}</h3>
            <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
              {order.status}
            </span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] m-0">
            Placed on {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
          </p>
        </div>
        <div className="text-right">
          <div className="font-mono font-extrabold text-xl text-[var(--text-primary)]">
            {formatPrice(order.total)}
          </div>
          <p className="text-xs text-[var(--text-secondary)] m-0 mt-1">
            {order.items.length} items
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 relative mt-2">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full z-0"></div>
        
        {currentStepIndex >= 0 && (
          <div 
            className="absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2 rounded-full z-0 transition-all duration-500"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          ></div>
        )}

        <div className="flex justify-between relative z-10">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isActive = idx === currentStepIndex;
            return (
              <div key={idx} className="flex flex-col items-center gap-2 group w-1/4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isCompleted 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.3)]' 
                    : 'bg-white border-slate-200 text-slate-400'
                }`}>
                  {step.icon}
                </div>
                <div className={`text-[10px] sm:text-xs font-semibold text-center hidden sm:block ${
                  isActive ? 'text-blue-700' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                }`}>
                  {step.status}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {order.trackingNumber && order.status !== 'Order Submitted' && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-5 flex items-center gap-3">
          <Truck className="w-5 h-5 text-slate-500" />
          <div className="flex-1">
            <span className="text-xs font-semibold uppercase text-slate-500 block mb-0.5">Tracking Number</span>
            <a href={`https://www.google.com/search?q=${order.trackingNumber}`} target="_blank" rel="noreferrer" className="text-blue-600 font-mono font-bold hover:underline text-sm">
              {order.trackingNumber}
            </a>
          </div>
        </div>
      )}

      {/* Items list summary */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-3">Order Details</h4>
        <div className="border border-[var(--border-light)] rounded-lg overflow-hidden">
          {order.items.slice(0, 3).map((item, i) => (
            <div key={i} className="flex justify-between items-center p-3 border-b border-[var(--border-light)] last:border-0 bg-white text-sm">
              <div className="flex flex-col">
                <span className="font-mono font-bold text-slate-800">{item.partNumber}</span>
                <span className="text-xs text-slate-500 max-w-[150px] sm:max-w-[300px] truncate">{item.description}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 mr-4">Qty: {item.qty}</span>
                <span className="font-mono font-bold">{formatPrice(item.qty * item.unitCost)}</span>
              </div>
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="p-3 bg-slate-50 text-center text-xs font-medium text-slate-500 border-t border-[var(--border-light)] cursor-pointer hover:text-slate-800">
              + {order.items.length - 3} more items
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-5 flex justify-end">
        <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-2 px-4 rounded-md text-sm font-semibold cursor-pointer transition-colors shadow-sm">
          Re-order BOM
        </button>
      </div>
    </div>
  );
}
