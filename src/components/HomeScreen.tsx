import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wallet,
  Coins,
  PlusCircle,
  QrCode,
  ArrowRight,
  Smartphone,
  Tv,
  Fingerprint,
  Zap,
  Send,
  Building2,
  ExternalLink,
  Bot,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ChevronRight,
  CreditCard,
  Building,
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    walletBalance,
    commissionBalance,
    topUpWallet,
    setActiveTab,
    transactions,
    setSelectedReceipt,
    extraLinks,
    setIsSupportModalOpen,
    userProfile,
    language,
    systemSettings,
    merchantSettlementBalance,
  } = useApp();

  const handleServiceClick = (tab: any, isServiceLive: boolean, serviceName: string) => {
    if (systemSettings.globalMaintenance) {
      alert(`⚠️ सिस्टम मेंटेनेंस: ${systemSettings.maintenanceNotice}`);
      return;
    }
    if (!isServiceLive) {
      alert(`⚠️ ${serviceName} सेवा वर्तमान में एडमिन द्वारा मेंटेनेंस मोड में है। कृपया कुछ समय बाद प्रयास करें।`);
      return;
    }
    setActiveTab(tab);
  };

  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('2000');

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(topUpAmount);
    if (!amt || amt <= 0) return;
    topUpWallet(amt);
    setIsTopUpOpen(false);
  };

  const activeLinks = extraLinks.filter((l) => l.isActive).slice(0, 4);

  return (
    <div className="space-y-4 pb-14 animate-in fade-in duration-150">
      {/* Top Shop Profile Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
              {userProfile.shopName}
            </h1>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <ShieldCheck className="w-3 h-3" />
              BC Active
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Agent: {userProfile.retailerName} • ID: {userProfile.agentCode}
          </p>
        </div>

        <button
          onClick={() => setIsSupportModalOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
        >
          <Bot className="w-4 h-4 text-blue-600 animate-pulse" />
          <span>Sahayak AI</span>
        </button>
      </div>

      {/* Main Wallet & Commission Double Card */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Main Wallet */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-3.5 rounded-2xl shadow-md border border-blue-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-blue-300 text-xs">
              <span className="flex items-center gap-1 font-semibold">
                <Wallet className="w-3.5 h-3.5" />
                मेन वॉलेट
              </span>
              <span className="text-[10px] bg-blue-500/30 text-blue-200 px-1.5 py-0.5 rounded">
                Active
              </span>
            </div>
            <div className="text-xl font-extrabold text-white mt-1.5">
              ₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <button
            onClick={() => setIsTopUpOpen(true)}
            className="mt-3 w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-colors shadow-xs"
          >
            <PlusCircle className="w-3 h-3" />
            Add Money
          </button>
        </div>

        {/* Commission Wallet */}
        <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 text-white p-3.5 rounded-2xl shadow-md border border-emerald-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-emerald-300 text-xs">
              <span className="flex items-center gap-1 font-semibold">
                <Coins className="w-3.5 h-3.5" />
                कमीशन वॉलेट
              </span>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.5 rounded font-bold">
                Lifetime
              </span>
            </div>
            <div className="text-xl font-extrabold text-emerald-400 mt-1.5">
              ₹{commissionBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <button
            onClick={() => setActiveTab('history')}
            className="mt-3 w-full py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-colors shadow-xs"
          >
            <TrendingUp className="w-3 h-3" />
            Earning Report
          </button>
        </div>
      </div>

      {/* Merchant Payment Gateway & Soundbox Quick Banner */}
      <div
        onClick={() => setActiveTab('merchant_pg')}
        className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-3.5 rounded-2xl shadow-md border border-purple-800/80 cursor-pointer hover:border-purple-600 transition-all flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs text-white">
                PhonePe & Paytm Merchant QR
              </span>
              <span className="text-[9px] bg-purple-500/30 text-purple-200 border border-purple-400/40 px-1.5 py-0.2 rounded font-bold">
                0% MDR
              </span>
            </div>
            <p className="text-[11px] text-purple-200 flex items-center gap-1.5 mt-0.5">
              <span>Smart Soundbox Active</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">₹{merchantSettlementBalance.toLocaleString('en-IN')} Unsettled</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs font-bold text-purple-300 group-hover:text-white transition-colors">
            Show QR
          </span>
          <ChevronRight className="w-4 h-4 text-purple-300 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* Services Grid (Super App Icons) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {language === 'hi' ? 'बैंकिंग एवं वित्तीय सेवाएं' : 'Banking & Financial Services'}
          </h3>
          <span className="text-[11px] text-blue-600 font-semibold">All 24x7 Live</span>
        </div>

        <div className="grid grid-cols-4 gap-2.5 text-center">
          {/* Mobile Recharge */}
          <button
            onClick={() => handleServiceClick('recharge', systemSettings.services.recharge, 'Mobile Recharge')}
            className="p-2 rounded-2xl hover:bg-blue-50/60 transition-colors flex flex-col items-center group relative"
          >
            {!systemSettings.services.recharge && (
              <span className="absolute -top-1 text-[8px] bg-rose-600 text-white font-bold px-1 rounded-full">
                Paused
              </span>
            )}
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform mb-1.5 ${!systemSettings.services.recharge ? 'opacity-50 grayscale' : ''}`}>
              <Smartphone className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-800 leading-tight">Recharge</span>
            <span className="text-[10px] text-emerald-600 font-bold">3% Margin</span>
          </button>

          {/* AEPS Cash Withdrawal */}
          <button
            onClick={() => handleServiceClick('aeps', systemSettings.services.aeps, 'AEPS ATM')}
            className="p-2 rounded-2xl hover:bg-emerald-50/60 transition-colors flex flex-col items-center group relative"
          >
            {!systemSettings.services.aeps ? (
              <span className="absolute -top-1 text-[8px] bg-rose-600 text-white font-bold px-1 rounded-full">
                Maintenance
              </span>
            ) : (
              <span className="absolute -top-1 right-1 text-[9px] bg-red-600 text-white font-black px-1.5 py-0.2 rounded-full animate-pulse">
                HOT
              </span>
            )}
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform mb-1.5 ${!systemSettings.services.aeps ? 'opacity-50 grayscale' : ''}`}>
              <Fingerprint className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-800 leading-tight">AEPS ATM</span>
            <span className="text-[10px] text-emerald-600 font-bold">₹10/Txn</span>
          </button>

          {/* BBPS Bill Payment */}
          <button
            onClick={() => handleServiceClick('bbps', systemSettings.services.bbps, 'BBPS Bill Pay')}
            className="p-2 rounded-2xl hover:bg-amber-50/60 transition-colors flex flex-col items-center group relative"
          >
            {!systemSettings.services.bbps && (
              <span className="absolute -top-1 text-[8px] bg-rose-600 text-white font-bold px-1 rounded-full">
                Paused
              </span>
            )}
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform mb-1.5 ${!systemSettings.services.bbps ? 'opacity-50 grayscale' : ''}`}>
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-800 leading-tight">Bill Pay</span>
            <span className="text-[10px] text-slate-500">BBPS Certified</span>
          </button>

          {/* DMT Money Transfer */}
          <button
            onClick={() => handleServiceClick('dmt', systemSettings.services.dmt, 'Money Transfer (DMT)')}
            className="p-2 rounded-2xl hover:bg-indigo-50/60 transition-colors flex flex-col items-center group relative"
          >
            {!systemSettings.services.dmt && (
              <span className="absolute -top-1 text-[8px] bg-rose-600 text-white font-bold px-1 rounded-full">
                Paused
              </span>
            )}
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform mb-1.5 ${!systemSettings.services.dmt ? 'opacity-50 grayscale' : ''}`}>
              <Send className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-800 leading-tight">Money Xfer</span>
            <span className="text-[10px] text-slate-500">Instant IMPS</span>
          </button>

          {/* Financial Products (Loans) */}
          <button
            onClick={() => handleServiceClick('financial', systemSettings.services.financial, 'Financial Products')}
            className="p-2 rounded-2xl hover:bg-purple-50/60 transition-colors flex flex-col items-center group relative"
          >
            {!systemSettings.services.financial && (
              <span className="absolute -top-1 text-[8px] bg-rose-600 text-white font-bold px-1 rounded-full">
                Paused
              </span>
            )}
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform mb-1.5 ${!systemSettings.services.financial ? 'opacity-50 grayscale' : ''}`}>
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-800 leading-tight">Loans/Cards</span>
            <span className="text-[10px] text-emerald-600 font-bold">Up to ₹12k</span>
          </button>

          {/* Extra Links & Portals */}
          <button
            onClick={() => setActiveTab('links')}
            className="p-2 rounded-2xl hover:bg-sky-50/60 transition-colors flex flex-col items-center group relative"
          >
            <span className="absolute -top-1 right-1 text-[9px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded-full">
              Admin
            </span>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform mb-1.5">
              <ExternalLink className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-800 leading-tight">Extra Links</span>
            <span className="text-[10px] text-blue-600 font-semibold">{extraLinks.length} Portals</span>
          </button>

          {/* Passbook History */}
          <button
            onClick={() => setActiveTab('history')}
            className="p-2 rounded-2xl hover:bg-slate-100 transition-colors flex flex-col items-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform mb-1.5">
              <Coins className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-800 leading-tight">Passbook</span>
            <span className="text-[10px] text-slate-500">Receipts</span>
          </button>

          {/* Merchant PG & Soundbox */}
          <button
            onClick={() => setActiveTab('merchant_pg')}
            className="p-2 rounded-2xl hover:bg-purple-50/60 transition-colors flex flex-col items-center group relative"
          >
            <span className="absolute -top-1 right-1 text-[8px] bg-purple-600 text-white font-black px-1.5 py-0.2 rounded-full">
              Soundbox
            </span>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform mb-1.5">
              <QrCode className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-800 leading-tight">Merchant PG</span>
            <span className="text-[10px] text-purple-600 font-bold">PhonePe/Ptm</span>
          </button>

          {/* AI Customer Care */}
          <button
            onClick={() => setIsSupportModalOpen(true)}
            className="p-2 rounded-2xl hover:bg-rose-50/60 transition-colors flex flex-col items-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform mb-1.5">
              <Bot className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-800 leading-tight">Sahayak AI</span>
            <span className="text-[10px] text-rose-600 font-bold">24x7 Help</span>
          </button>
        </div>
      </div>

      {/* Admin Highlight: Extra Links Shortcut Section */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold text-slate-800">
              {language === 'hi' ? 'महत्वपूर्ण एडमिन लिंक्स (Quick Portals)' : 'Admin Extra Links & Services'}
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('links')}
            className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-0.5"
          >
            View All ({extraLinks.length})
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {activeLinks.map((link) => (
            <div
              key={link.id}
              onClick={() => {
                window.open(link.url, '_blank', 'noopener,noreferrer');
              }}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/60 hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded">
                  {link.badge || link.category}
                </span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
              </div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-1 truncate">
                {language === 'hi' && link.titleHi ? link.titleHi : link.title}
              </p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{link.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 rounded-2xl shadow-md flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Festival Offer
          </span>
          <h4 className="font-extrabold text-sm">
            लोन अप्रूवल पर पाएं सीधा ₹2,500 कमीशन!
          </h4>
          <p className="text-xs text-blue-100">
            Dukandar MSME व पर्सनल लोन लीड दर्ज करें और तुरंत नकद कमाएं।
          </p>
        </div>
        <button
          onClick={() => setActiveTab('financial')}
          className="px-3.5 py-2 rounded-xl bg-white text-blue-900 font-bold text-xs shadow-sm hover:bg-blue-50 shrink-0 transition-colors"
        >
          Apply Now
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800">हालिया लेनदेन (Recent Transactions)</h3>
          <button
            onClick={() => setActiveTab('history')}
            className="text-xs text-blue-600 font-bold hover:underline"
          >
            See All
          </button>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {transactions.slice(0, 4).map((tx) => (
            <div
              key={tx.id}
              onClick={() => setSelectedReceipt(tx)}
              className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-1 rounded-xl transition-colors cursor-pointer"
            >
              <div>
                <p className="font-bold text-slate-800">{tx.title}</p>
                <p className="text-[10px] text-slate-400">
                  {tx.date} • {tx.time} • Ref: {tx.refNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="font-extrabold text-slate-900">
                  ₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                {tx.commission > 0 && (
                  <span className="text-[10px] text-emerald-600 font-bold">
                    +₹{tx.commission.toFixed(2)} comm.
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Up Wallet Modal */}
      {isTopUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-blue-600" />
                Add Money to Wallet (UPI QR)
              </h3>
              <button
                onClick={() => setIsTopUpOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Close
              </button>
            </div>

            {/* Simulated UPI QR Code */}
            <div className="flex flex-col items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="w-32 h-32 bg-white p-2 rounded-lg border border-slate-300 flex items-center justify-center shadow-xs">
                <QrCode className="w-24 h-24 text-slate-800" />
              </div>
              <p className="text-[11px] text-slate-500 mt-2 font-mono">UPI ID: paymitra.retail@hdfcbank</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Instant Auto Credit via UPI / NetBanking</p>
            </div>

            <form onSubmit={handleTopUp} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Enter Top-Up Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min={100}
                    required
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="w-full pl-7 p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {[500, 1000, 2000, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt.toString())}
                    className="flex-1 py-1 text-xs rounded-lg border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Simulate Instant Payment (₹{topUpAmount})
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
