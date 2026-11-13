import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BBPS_BILLERS } from '../data/mockData';
import confetti from 'canvas-confetti';
import {
  Zap,
  Car,
  Flame,
  Droplet,
  Wifi,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  User,
  ArrowRight,
  FileText,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export const BBPSScreen: React.FC = () => {
  const { walletBalance, deductWallet, creditCommission, addTransaction, setSelectedReceipt, language } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('Electricity');
  const [selectedBiller, setSelectedBiller] = useState(BBPS_BILLERS[0].billers[0]);
  const [consumerNumber, setConsumerNumber] = useState('');
  const [isFetchingBill, setIsFetchingBill] = useState(false);
  const [fetchedBill, setFetchedBill] = useState<{
    consumerName: string;
    billNumber: string;
    dueDate: string;
    amount: number;
    billPeriod: string;
  } | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  const currentCategoryData = BBPS_BILLERS.find((c) => c.category === activeCategory) || BBPS_BILLERS[0];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Electricity': return Zap;
      case 'FASTag': return Car;
      case 'Piped Gas & LPG': return Flame;
      case 'Water Bill': return Droplet;
      case 'Broadband / Landline': return Wifi;
      default: return Zap;
    }
  };

  const handleFetchBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumerNumber.trim()) {
      alert('कृपया उपभोक्ता संख्या दर्ज करें (Please enter consumer number)');
      return;
    }

    setIsFetchingBill(true);
    setFetchedBill(null);

    setTimeout(() => {
      setIsFetchingBill(false);
      const names = ['Sunita Devi', 'Ramesh Kumar Verma', 'Mohammad Tariq', 'Harpreet Singh', 'Pooja Agarwal'];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomAmount = Math.floor(650 + Math.random() * 2200);

      setFetchedBill({
        consumerName: randomName,
        billNumber: 'BILL-BBPS-' + Math.floor(100000 + Math.random() * 900000),
        dueDate: '25 Nov 2026',
        amount: randomAmount,
        billPeriod: '01 Oct 2026 - 31 Oct 2026',
      });
    }, 900);
  };

  const handlePayBill = () => {
    if (!fetchedBill) return;

    if (walletBalance < fetchedBill.amount) {
      alert(`अपर्याप्त वॉलेट बैलेंस! आपके वॉलेट में ₹${walletBalance} है, बिल भुगतान हेतु ₹${fetchedBill.amount} चाहिए।`);
      return;
    }

    setIsPaying(true);

    setTimeout(() => {
      setIsPaying(false);
      const commission = 5.0; // Flat ₹5 BBPS commission

      deductWallet(fetchedBill.amount);
      creditCommission(commission);

      const bbpsRef = 'BBPS-' + Math.floor(100000000000 + Math.random() * 900000000000);

      const newTx = addTransaction({
        type: 'BBPS_BILL',
        title: `${selectedBiller.name} (${activeCategory})`,
        amount: fetchedBill.amount,
        commission: commission,
        status: 'SUCCESS',
        refNumber: bbpsRef,
        details: {
          billerName: selectedBiller.name,
          mobileOrAcc: `${selectedBiller.paramName}: ${consumerNumber}`,
          customerName: fetchedBill.consumerName,
        },
      });

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });

      setSelectedReceipt(newTx);
      setFetchedBill(null);
      setConsumerNumber('');
    }, 1000);
  };

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-150">
      {/* BBPS Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-4 rounded-2xl shadow-lg border border-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-blue-300 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              NPCI Bharat BillPay (BBPS)
            </div>
            <h2 className="text-lg font-bold mt-0.5">भारत बिलपे सेवा (Bill Payment)</h2>
            <p className="text-xs text-blue-200 mt-0.5">Pay electricity, water, gas, FASTag & earn flat ₹5 commission</p>
          </div>
          <div className="w-12 h-12 bg-white rounded-xl p-1 shadow flex items-center justify-center font-black text-slate-900 text-xs tracking-tighter">
            <span className="text-blue-700">BHARAT</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none mt-3 pt-3 border-t border-blue-800/80">
          {BBPS_BILLERS.map((cat) => {
            const Icon = getCategoryIcon(cat.category);
            const isSel = activeCategory === cat.category;
            return (
              <button
                key={cat.category}
                onClick={() => {
                  setActiveCategory(cat.category);
                  setSelectedBiller(cat.billers[0]);
                  setFetchedBill(null);
                }}
                className={`py-2 px-3 rounded-xl flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold transition-all ${
                  isSel
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white/10 text-blue-200 hover:bg-white/20'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.category}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Select Biller & Enter Consumer Number */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">
            बोर्ड / सेवा प्रदाता चुनें (Select Biller)
          </label>
          <select
            value={selectedBiller.id}
            onChange={(e) => {
              const b = currentCategoryData.billers.find((item) => item.id === e.target.value);
              if (b) {
                setSelectedBiller(b);
                setFetchedBill(null);
              }
            }}
            className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {currentCategoryData.billers.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.state})
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleFetchBill} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              {selectedBiller.paramName}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder={`Enter ${selectedBiller.paramName}...`}
                value={consumerNumber}
                onChange={(e) => setConsumerNumber(e.target.value)}
                className="flex-1 p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="submit"
                disabled={isFetchingBill || !consumerNumber.trim()}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
              >
                {isFetchingBill ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  <>Fetch Bill</>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Sample test IDs: 100293849, 9811223344, CA882910
            </p>
          </div>
        </form>
      </div>

      {/* Bill Fetch Result Card */}
      {fetchedBill && (
        <div className="bg-white border-2 border-blue-500/80 p-5 rounded-2xl shadow-md space-y-4 animate-in zoom-in-95">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] text-slate-400 block font-semibold uppercase">Customer Name</span>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-600" />
                {fetchedBill.consumerName}
              </h4>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-semibold uppercase">Due Date</span>
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1 justify-end">
                <Calendar className="w-3.5 h-3.5" />
                {fetchedBill.dueDate}
              </span>
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500">Total Payable Bill</span>
              <div className="text-2xl font-extrabold text-blue-950">
                ₹{fetchedBill.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-300">
              Retailer Margin: +₹5.00
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Bill No: {fetchedBill.billNumber}</span>
            <span>Billing Cycle: {fetchedBill.billPeriod}</span>
          </div>

          <button
            onClick={handlePayBill}
            disabled={isPaying}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            {isPaying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Paying Bill via BBPS...
              </>
            ) : (
              <>
                Confirm & Pay ₹{fetchedBill.amount}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
