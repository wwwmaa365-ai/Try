import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AEPS_BANKS } from '../data/mockData';
import confetti from 'canvas-confetti';
import {
  Send,
  Building,
  UserCheck,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';

export const DMTScreen: React.FC = () => {
  const { walletBalance, deductWallet, creditCommission, addTransaction, setSelectedReceipt, language } = useApp();

  const [senderMobile, setSenderMobile] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('SBIN0013378');
  const [amount, setAmount] = useState('5000');
  const [transferMode, setTransferMode] = useState<'IMPS' | 'NEFT'>('IMPS');
  const [isVerifyingName, setIsVerifyingName] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isNameVerified, setIsNameVerified] = useState(false);

  const handleVerifyPennyDrop = () => {
    if (!accountNumber || accountNumber.length < 9) {
      alert('कृपया वैध खाता संख्या दर्ज करें (Enter valid account number)');
      return;
    }
    setIsVerifyingName(true);
    setTimeout(() => {
      setIsVerifyingName(false);
      setIsNameVerified(true);
      setBeneficiaryName('ANIL KUMAR YADAV');
    }, 800);
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amtNum = parseFloat(amount);
    if (!amtNum || amtNum <= 0) {
      alert('कृपया वैध ट्रांसफर राशि दर्ज करें');
      return;
    }
    if (walletBalance < amtNum) {
      alert(`अपर्याप्त वॉलेट बैलेंस! आपके वॉलेट में ₹${walletBalance} है, ट्रांसफर हेतु ₹${amtNum} चाहिए।`);
      return;
    }

    setIsTransferring(true);

    setTimeout(() => {
      setIsTransferring(false);
      const commission = +(amtNum * 0.003).toFixed(2); // 0.3% commission payout
      deductWallet(amtNum);
      creditCommission(commission);

      const utr = Math.floor(631500000000 + Math.random() * 999999999).toString();
      const refNum = 'IMPS-' + utr.slice(-8);

      const newTx = addTransaction({
        type: 'DMT_TRANSFER',
        title: `Money Transfer (${transferMode}) - ${beneficiaryName || 'Beneficiary'}`,
        amount: amtNum,
        commission: commission,
        status: 'SUCCESS',
        refNumber: refNum,
        details: {
          mobileOrAcc: `A/C: ${accountNumber}`,
          operatorOrBank: `IFSC: ${ifsc}`,
          utrNumber: utr,
          customerName: beneficiaryName || 'Verified Beneficiary',
        },
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });

      setSelectedReceipt(newTx);
    }, 1000);
  };

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-150">
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 text-white p-4 rounded-2xl shadow-lg border border-blue-600/30">
        <div className="flex items-center gap-1.5 text-blue-200 text-xs font-semibold uppercase">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Domestic Money Transfer (DMT 2.0)
        </div>
        <h2 className="text-lg font-bold mt-0.5">घरेलू मनी ट्रांसफर (Send Money to Any Bank)</h2>
        <p className="text-xs text-blue-200 mt-0.5">
          Instant 24x7 IMPS bank transfer with instant NPCI UTR generation
        </p>
      </div>

      <form onSubmit={handleTransfer} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3.5 text-xs">
        <div>
          <label className="font-bold text-slate-800 block mb-1">भेजने वाले का मोबाइल (Sender Mobile)</label>
          <input
            type="tel"
            required
            placeholder="10-digit Sender Mobile"
            value={senderMobile}
            onChange={(e) => setSenderMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
            className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="font-bold text-slate-800 block mb-1">लाभार्थी खाता संख्या (Beneficiary Account Number)</label>
          <input
            type="text"
            required
            placeholder="Enter Bank Account Number"
            value={accountNumber}
            onChange={(e) => {
              setAccountNumber(e.target.value);
              setIsNameVerified(false);
            }}
            className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="font-bold text-slate-800 block mb-1">IFSC Code</label>
            <input
              type="text"
              required
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value.toUpperCase())}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="font-bold text-slate-800 block mb-1">Transfer Mode</label>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setTransferMode('IMPS')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  transferMode === 'IMPS' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                IMPS (Instant)
              </button>
              <button
                type="button"
                onClick={() => setTransferMode('NEFT')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  transferMode === 'NEFT' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                NEFT
              </button>
            </div>
          </div>
        </div>

        {/* Penny Drop Name Verification */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="font-bold text-slate-800">खाताधारक का नाम (Beneficiary Name)</label>
            <button
              type="button"
              onClick={handleVerifyPennyDrop}
              disabled={isVerifyingName || !accountNumber}
              className="text-blue-600 font-bold hover:underline flex items-center gap-1"
            >
              {isVerifyingName ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" /> Verifying...
                </>
              ) : (
                <>Verify Account (Penny Drop)</>
              )}
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="e.g. Anil Kumar Yadav"
              value={beneficiaryName}
              onChange={(e) => setBeneficiaryName(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {isNameVerified && (
              <span className="absolute right-3 top-2.5 text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Bank Matched
              </span>
            )}
          </div>
        </div>

        {/* Transfer Amount */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="font-bold text-slate-800">ट्रांसफर राशि (Amount)</label>
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              Your Earning: +₹{(parseFloat(amount || '0') * 0.003).toFixed(2)}
            </span>
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-2 font-bold text-slate-400 text-base">₹</span>
            <input
              type="number"
              required
              placeholder="Enter amount..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-base font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isTransferring}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
        >
          {isTransferring ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Transferring via IMPS...
            </>
          ) : (
            <>
              Send Money ₹{amount || 0}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
