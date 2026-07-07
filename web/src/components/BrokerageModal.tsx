import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Package, ArrowRight, Upload, DollarSign, Truck, FileText, Globe } from 'lucide-react';
import { BOMItem, Order } from '../hooks/useBOM';
import { useCurrency } from '../contexts/CurrencyContext';

interface BrokerageModalProps {
  isOpen: boolean;
  onClose: () => void;
  bomList: BOMItem[];
  onPlaceOrder: (order: Omit<Order, 'id' | 'date'>) => void;
  onSuccessNavigate: () => void;
}

const destinationConfig = {
  'United States': { shipping: 18.50, dutyPct: 0, time: 'Standard (3-5 Days)' },
  'Canada': { shipping: 35.00, dutyPct: 0.05, time: 'International (+3 Days)' },
  'European Union': { shipping: 45.00, dutyPct: 0.12, time: 'International (+5 Days)' },
  'United Kingdom': { shipping: 42.00, dutyPct: 0.12, time: 'International (+5 Days)' },
};

type Destination = keyof typeof destinationConfig;

export function BrokerageModal({ isOpen, onClose, bomList, onPlaceOrder, onSuccessNavigate }: BrokerageModalProps) {
  const [step, setStep] = useState(1);
  const [isQuoting, setIsQuoting] = useState(false);
  const [quoteDone, setQuoteDone] = useState(false);
  const { formatPrice } = useCurrency();

  // Form State
  const [shippingAddress, setShippingAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [destination, setDestination] = useState<Destination>('United States');
  
  if (!isOpen) return null;

  const totalBomCost = bomList.reduce((sum, item) => sum + (item.qty * item.unitCost), 0);
  const config = destinationConfig[destination];
  const flatShippingFee = config.shipping;
  const duties = totalBomCost * config.dutyPct;
  const brokerageFee = totalBomCost * 0.15; // 15% take-rate for internal admin console reference
  const finalTotal = totalBomCost + flatShippingFee + duties;

  const handleNext = () => {
    if (step === 2) {
      setStep(3);
      setIsQuoting(true);
      setTimeout(() => {
        setIsQuoting(false);
        setQuoteDone(true);
      }, 3000); // 3 second mock API call
    } else {
      setStep(step + 1);
    }
  };

  const handlePlaceOrder = () => {
    onPlaceOrder({
      items: bomList,
      subtotal: totalBomCost,
      shippingFee: flatShippingFee,
      brokerageFee: brokerageFee,
      total: finalTotal,
      status: 'Order Submitted',
      trackingNumber: `1Z9${Math.random().toString().substring(2, 8)}`,
      customer: {
        name: customerName,
        email: customerEmail,
        company: customerCompany
      },
      shippingAddress
    });
    setStep(1);
    setQuoteDone(false);
    onClose();
    onSuccessNavigate();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[var(--bg-surface)] rounded-xl w-full max-w-[700px] overflow-hidden flex flex-col shadow-2xl border border-[var(--border)]">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-[var(--border)] bg-slate-50">
          <div>
            <h3 className="m-0 text-xl font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              BOM Consolidated Checkout
            </h3>
            <p className="m-0 text-xs text-slate-500 mt-1">Consolidate orders across multiple distributors into a single shipment.</p>
          </div>
          <button className="bg-transparent border-none text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded hover:bg-slate-200 transition-colors" onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Wizard Steps indicator */}
        <div className="flex px-6 py-4 bg-white border-b border-[var(--border-light)] justify-between">
          {[
            { num: 1, label: 'Review Parts' },
            { num: 2, label: 'Shipping' },
            { num: 3, label: 'Quote & Confirm' },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= s.num ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-sm font-semibold ${step >= s.num ? 'text-slate-800' : 'text-slate-400'}`}>{s.label}</span>
              {i < 2 && <div className="w-12 h-px bg-slate-200 mx-2 hidden sm:block"></div>}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 bg-white overflow-y-auto max-h-[60vh]">
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <h4 className="text-lg font-bold text-slate-900 m-0 mb-2">Step 1: Parts Review</h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-3 font-semibold text-slate-600">Part</th>
                      <th className="p-3 font-semibold text-slate-600">Supplier Route</th>
                      <th className="p-3 font-semibold text-slate-600 text-right">Qty</th>
                      <th className="p-3 font-semibold text-slate-600 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bomList.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-100 last:border-0">
                        <td className="p-3">
                          <div className="font-mono font-bold text-slate-800">{item.partNumber}</div>
                          <div className="text-xs text-slate-500 truncate max-w-[200px]" title={item.description}>{item.description}</div>
                        </td>
                        <td className="p-3 text-slate-700 font-medium">
                           {item.supplier}
                        </td>
                        <td className="p-3 text-right mono">{item.qty}</td>
                        <td className="p-3 text-right mono font-bold text-slate-800">{formatPrice(item.qty * item.unitCost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-6">
              <h4 className="text-lg font-bold text-slate-900 m-0">Step 2: Shipping & Compliance</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Full Name</label>
                  <input 
                    type="text" 
                    className="border border-slate-300 rounded-md p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="Jane Doe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Work Email</label>
                  <input 
                    type="email" 
                    className="border border-slate-300 rounded-md p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="jane@company.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">Company Name</label>
                  <input 
                    type="text" 
                    className="border border-slate-300 rounded-md p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="Acme Corp"
                    value={customerCompany}
                    onChange={(e) => setCustomerCompany(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Shipping Destination</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select
                    className="w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value as Destination)}
                  >
                    {Object.keys(destinationConfig).map(dest => (
                      <option key={dest} value={dest}>{dest}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Delivery Address</label>
                <textarea 
                  rows={3} 
                  className="border border-slate-300 rounded-md p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                  placeholder="123 Industrial Way&#10;Suite 400&#10;San Francisco, CA 94107"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                />
              </div>

              <div className="border border-slate-200 rounded-lg p-5 bg-slate-50">
                <h5 className="font-semibold text-slate-800 m-0 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  Compliance & Certifications
                </h5>
                <div className="flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-6 bg-white hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="text-center flex flex-col items-center">
                    <Upload className="w-6 h-6 text-slate-400 mb-2" />
                    <span className="text-sm font-semibold text-blue-600">Upload forms or certificates</span>
                    <span className="text-xs text-slate-500 mt-1">PDFs, tax exemption, ITAR docs</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              {isQuoting && (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                  <h4 className="text-xl font-bold text-slate-900 m-0 mb-2">Generating Consolidated Quote...</h4>
                  <p className="text-slate-500 text-sm max-w-[300px]">
                    Checking real-time distributor stock, mapping logistics routes, and optimizing fulfillment...
                  </p>
                </div>
              )}

              {quoteDone && (
                <div className="w-full flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500">
                  <div className="text-center">
                    <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 m-0">Quote Ready to Finalize</h4>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-3 text-sm">
                      <span className="text-slate-600">Hardware Subtotal ({bomList.length} unique parts)</span>
                      <span className="font-mono font-bold text-slate-800">{formatPrice(totalBomCost)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-3 text-sm">
                      <span className="text-slate-600 flex items-center gap-2">
                        <Truck className="w-4 h-4" /> Consolidated Shipping ({config.time})
                      </span>
                      <span className="font-mono font-bold text-slate-800">{formatPrice(flatShippingFee)}</span>
                    </div>
                    {duties > 0 && (
                      <div className="flex justify-between items-center mb-3 text-sm">
                        <span className="text-slate-600 flex items-center gap-2">
                          <Globe className="w-4 h-4" /> Duties & Tariffs (Estimated)
                        </span>
                        <span className="font-mono font-bold text-slate-800">{formatPrice(duties)}</span>
                      </div>
                    )}
                    <div className="border-t border-slate-200 pt-4 mt-1 flex justify-between items-center text-lg">
                      <span className="font-bold text-slate-900">Total Final Cost</span>
                      <span className="font-mono font-extrabold text-blue-700">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start gap-3">
                    <Package className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-900 m-0">
                      By proceeding, partsource.io will procure these parts from various distributors and re-ship them to you in a single, consolidated box.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[var(--border)] bg-slate-50 flex justify-between items-center">
          {step > 1 && !isQuoting ? (
            <button 
              className="text-slate-600 hover:text-slate-900 font-semibold text-sm px-4 py-2"
              onClick={() => setStep(step - 1)}
            >
              Back
            </button>
          ) : <div></div>}

          {step < 3 ? (
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white border-none py-2 px-6 rounded-md text-sm font-semibold cursor-pointer transition-colors flex items-center gap-2 shadow-sm"
              onClick={handleNext}
              disabled={step === 2 && !shippingAddress.trim()}
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : quoteDone ? (
            <button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white border-none py-2.5 px-8 rounded-md text-sm font-bold cursor-pointer transition-colors flex items-center gap-2 shadow-md w-full sm:w-auto justify-center"
              onClick={handlePlaceOrder}
            >
              Confirm & Place Order
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
