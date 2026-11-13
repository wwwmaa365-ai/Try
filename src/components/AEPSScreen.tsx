import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AEPS_BANKS } from '../data/mockData';
import { Bank } from '../types';
import confetti from 'canvas-confetti';
import {
  Fingerprint,
  ShieldCheck,
  Building2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Info,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';

export const AEPSScreen: React.FC = () => {
  const { addTransaction, setSelectedReceipt, creditCommission, topUpWallet, language, userProfile } = useApp();

  const [aepsMode, setAepsMode] = useState<'WITHDRAW' | 'BALANCE' | 'STATEMENT' | 'AADHAAR_PAY'>('WITHDRAW');
  const [selectedBank, setSelectedBank] = useState<Bank>(AEPS_BANKS[0]);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [amount, setAmount] = useState('3000');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanQuality, setScanQuality] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [miniStatementResult, setMiniStatementResult] = useState<any[] | null>(null);
  const [balanceResult, setBalanceResult] = useState<{ balance: number; rrn: string } | null>(null);

  const quickAmounts = [500, 1000, 2000, 3000, 5000, 10000];

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    setAadhaarNumber(raw);
  };

  const formatAadhaar = (val: string) => {
    if (!val) return '';
    const parts = [];
    for (let i = 0; i < val.length; i += 4) {
      parts.push(val.slice(i, i + 4));
    }
    return parts.join(' - ');
  };

  const getCommissionForAmount = (amt: number) => {
    if (amt >= 3000) return 10.0;
    if (amt >= 1500) return 6.0;
    if (amt >= 1000) return 4.0;
    if (amt >= 500) return 2.0;
    return 1.0;
  };

  const handleScanAndSubmit = () => {
    if (aadhaarNumber.length !== 12) {
      alert('कृपया 12 अंकों का वैध आधार नंबर दर्ज करें (Please enter 12-digit Aadhaar number)');
      return;
    }
    if (aepsMode === 'WITHDRAW' || aepsMode === 'AADHAAR_PAY') {
      const amtNum = parseFloat(amount);
      if (!amtNum || amtNum < 100 || amtNum > 10000) {
        alert('निकासी राशि ₹100 से ₹10,000 के बीच होनी चाहिए (Amount must be ₹100 - ₹10,000)');
        return;
      }
    }

    // Step 1: Simulate RD Service Biometric Scan with Laser Pulse
    setIsScanning(true);
    setScanProgress(10);
    setScanQuality(null);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScanQuality(97); // 97% biometric match score
          executeTransaction();
          return 100;
        }
        return prev + 30;
      });
    }, 300);
  };

  const executeTransaction = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const rrn = 'RRN-' + Math.floor(631600000000 + Math.random() * 999999999);
      const amtNum = parseFloat(amount) || 0;
      const commission = getCommissionForAmount(amtNum);
      const maskedAadhaar = `XXXX-XXXX-${aadhaarNumber.slice(-4)}`;

      if (aepsMode === 'WITHDRAW' || aepsMode === 'AADHAAR_PAY') {
        // Retailer pays cash from drawer to customer; AEPS credits amount + commission to retailer portal wallet!
        topUpWallet(amtNum);
        creditCommission(commission);

        const newTx = addTransaction({
          type: 'AEPS_CASH',
          title: `AEPS Cash Withdrawal (${selectedBank.shortCode})`,
          amount: amtNum,
          commission: commission,
          status: 'SUCCESS',
          refNumber: rrn,
          details: {
            operatorOrBank: selectedBank.name,
            aadhaarMasked: maskedAadhaar,
            mobileOrAcc: customerMobile || 'NA',
            customerName: 'Aadhaar Verified Customer',
          },
        });

        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });

        setSelectedReceipt(newTx);
      } else if (aepsMode === 'BALANCE') {
        const dummyBal = Math.floor(12450 + Math.random() * 45000);
        setBalanceResult({ balance: dummyBal, rrn });
      } else if (aepsMode === 'STATEMENT') {
        setMiniStatementResult([
          { date: '11/11', type: 'CR', desc: 'UPI/Direct Transfer', amt: '₹2,500.00' },
          { date: '09/11', type: 'DR', desc: 'ATM Cash WDL', amt: '₹5,000.00' },
          { date: '05/11', type: 'CR', desc: 'PM-KISAN DBT Govt', amt: '₹2,000.00' },
          { date: '02/11', type: 'DR', desc: 'POS Merchant Pay', amt: '₹480.00' },
          { date: '28/10', type: 'CR', desc: 'Salary / Neft Credit', amt: '₹18,400.00' },
        ]);
      }
    }, 1200);
  };

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white p-4 rounded-2xl shadow-lg border border-emerald-600/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              NPCI AePS 2.0 Certified Micro-ATM
            </div>
            <h2 className="text-lg font-bold mt-0.5">आधार एटीएम सेवा (AEPS Terminal)</h2>
            <p className="text-xs text-emerald-100/90 mt-0.5">
              Cash withdrawal, balance check & mini-statement via fingerprint
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2.5 py-1 rounded-full border border-emerald-400/40 font-semibold">
              Earn up to ₹10 / Txn
            </span>
          </div>
        </div>

        {/* AEPS Mode Tabs */}
        <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-emerald-600/40">
          {[
            { id: 'WITHDRAW', labelHi: 'नकद निकासी', labelEn: 'Cash Out', icon: ShieldCheck },
            { id: 'BALANCE', labelHi: 'बैलेंस जांच', labelEn: 'Balance', icon: Info },
            { id: 'STATEMENT', labelHi: 'मिनी स्टेटमेंट', labelEn: 'Statement', icon: FileSpreadsheet },
            { id: 'AADHAAR_PAY', labelHi: 'आधार पे', labelEn: 'Aadhaar Pay', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = aepsMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setAepsMode(tab.id as any);
                  setBalanceResult(null);
                  setMiniStatementResult(null);
                }}
                className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center text-center transition-all ${
                  isSel
                    ? 'bg-white text-emerald-950 font-bold shadow-md scale-[1.02]'
                    : 'bg-emerald-800/40 hover:bg-emerald-800/70 text-emerald-100 text-xs'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 mb-1 ${isSel ? 'text-emerald-700' : 'text-emerald-200'}`} />
                <span className="text-[11px] leading-tight font-medium">
                  {language === 'hi' ? tab.labelHi : tab.labelEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Select Bank */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-emerald-600" />
            ग्राहक का बैंक चुनें (Select Customer Bank)
          </span>
          <span className="text-[11px] text-slate-400 font-normal">Issuer IIN: {selectedBank.iin}</span>
        </label>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {AEPS_BANKS.map((b) => {
            const isSel = selectedBank.id === b.id;
            return (
              <button
                key={b.id}
                onClick={() => setSelectedBank(b)}
                className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                  isSel
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/30'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-[11px] text-slate-800 mb-1 border border-slate-200">
                  {b.shortCode}
                </span>
                <span className="text-[10px] truncate max-w-full leading-tight">{b.shortCode}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Aadhaar and Customer Details Form */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">
            ग्राहक का 12-अंक आधार नंबर (Aadhaar Number)
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="XXXX - XXXX - XXXX"
              value={formatAadhaar(aadhaarNumber)}
              onChange={handleAadhaarChange}
              maxLength={19}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-base font-mono tracking-widest focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
            <div className="absolute right-3 top-3 text-xs text-slate-400 font-sans">
              {aadhaarNumber.length}/12
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            UIDAI Enrolment / VID / Biometric token verification standard
          </p>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">
            ग्राहक का मोबाइल नंबर (Customer Mobile)
          </label>
          <input
            type="tel"
            placeholder="10-digit Mobile for instant SMS receipt"
            value={customerMobile}
            onChange={(e) => setCustomerMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
            className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        {(aepsMode === 'WITHDRAW' || aepsMode === 'AADHAAR_PAY') && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-800">
                निकासी राशि (Withdrawal Amount)
              </label>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                कमीशन: +₹{getCommissionForAmount(parseFloat(amount) || 0).toFixed(2)}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 font-bold text-slate-400 text-base">₹</span>
              <input
                type="number"
                placeholder="100 to 10000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-base font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt.toString())}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                    amount === amt.toString()
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Biometric RD Service Scanner Area */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-5 rounded-2xl text-white shadow-xl border border-slate-800 text-center space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2.5">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            RD Service Connected
          </span>
          <span className="font-mono text-[11px] text-slate-300">Mantra MFS100 / Morpho</span>
        </div>

        {/* Biometric Scan Trigger Button with Laser Pulse */}
        <div className="relative flex flex-col items-center justify-center py-2">
          <button
            onClick={handleScanAndSubmit}
            disabled={isScanning || isProcessing}
            className={`relative w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all ${
              isScanning
                ? 'bg-emerald-950 text-emerald-400 ring-8 ring-emerald-500/40 animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50 hover:scale-105 active:scale-95'
            }`}
          >
            {/* Laser scanning beam line */}
            {isScanning && (
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-[bounce_1.2s_infinite]"></div>
            )}
            <Fingerprint className={`w-12 h-12 ${isScanning ? 'animate-bounce text-cyan-400' : ''}`} />
            <span className="text-[10px] font-bold mt-1 tracking-wider uppercase">
              {isScanning ? `${scanProgress}%` : 'Capture Finger'}
            </span>
          </button>

          <p className="text-xs text-slate-300 mt-3 font-medium">
            {isScanning
              ? 'फिंगरप्रिंट स्कैन हो रहा है... कृपया अंगुली स्कैनर पर रखें'
              : isProcessing
              ? 'NPCI सर्वर से सत्यापन जारी है...'
              : 'अंगूठा या तर्जनी स्कैनर पर रखें और कैप्चर पर टैप करें'}
          </p>

          {scanQuality && (
            <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Biometric Score: {scanQuality}% (Excellent Match)
            </div>
          )}
        </div>
      </div>

      {/* Balance Enquiry Result Modal / Box */}
      {balanceResult && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl animate-in zoom-in-95 text-slate-800">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            बैंक बैलेंस विवरण (Balance Enquiry Result)
          </div>
          <div className="mt-3 p-3 bg-white rounded-xl border border-emerald-200">
            <p className="text-xs text-slate-500">{selectedBank.name}</p>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              ₹{balanceResult.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">Ref: {balanceResult.rrn}</p>
          </div>
        </div>
      )}

      {/* Mini Statement Result */}
      {miniStatementResult && (
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              बैंक मिनी स्टेटमेंट (Last 5 Transactions)
            </h3>
            <span className="text-[10px] text-slate-400">{selectedBank.shortCode}</span>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {miniStatementResult.map((st, i) => (
              <div key={i} className="py-2 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{st.desc}</p>
                  <p className="text-[10px] text-slate-400">{st.date}</p>
                </div>
                <div className={`font-mono font-bold ${st.type === 'CR' ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {st.type === 'CR' ? '+' : '-'} {st.amt}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
