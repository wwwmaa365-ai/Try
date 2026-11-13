import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FINANCIAL_PRODUCTS } from '../data/mockData';
import { FinancialProduct } from '../types';
import confetti from 'canvas-confetti';
import {
  Banknote,
  Store,
  CreditCard,
  Shield,
  Coins,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Calculator,
  UserCheck,
  TrendingUp,
  X,
  BadgeCheck,
} from 'lucide-react';

export const FinancialScreen: React.FC = () => {
  const { creditCommission, addTransaction, setSelectedReceipt, language } = useApp();

  const [selectedProduct, setSelectedProduct] = useState<FinancialProduct | null>(null);
  const [loanAmount, setLoanAmount] = useState(150000);
  const [tenureMonths, setTenureMonths] = useState(24);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Approximate EMI calculation
  const monthlyRate = 12 / 12 / 100;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );

  const getProductIcon = (category: string) => {
    switch (category) {
      case 'Personal Loan': return Banknote;
      case 'Business Loan': return Store;
      case 'Credit Card': return CreditCard;
      case 'Micro Insurance': return Shield;
      case 'Digital Gold': return Coins;
      default: return Banknote;
    }
  };

  const handleOpenLead = (prod: FinancialProduct) => {
    setSelectedProduct(prod);
    setIsLeadModalOpen(true);
    setSuccessMessage(null);
  };

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      // Give realistic commission
      let commission = 750;
      if (selectedProduct.category === 'Business Loan') commission = 2250;
      if (selectedProduct.category === 'Credit Card') commission = 1850;
      if (selectedProduct.category === 'Personal Loan') commission = 1250;

      creditCommission(commission);

      const refId = 'LEAD-' + Math.floor(100000 + Math.random() * 900000);

      const newTx = addTransaction({
        type: 'LOAN_LEAD',
        title: `${selectedProduct.title} (Lead Sanctioned)`,
        amount: loanAmount,
        commission: commission,
        status: 'SUCCESS',
        refNumber: refId,
        details: {
          productName: selectedProduct.title,
          customerName: customerName,
          mobileOrAcc: customerMobile,
          operatorOrBank: selectedProduct.provider,
        },
      });

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });

      setSuccessMessage(
        `बधाई हो! ${customerName} का आवेदन सफलतापूर्वक स्वीकृत हुआ। आपका कमीशन ₹${commission} तुरंत कमीशन वॉलेट में जोड़ दिया गया है!`
      );

      setTimeout(() => {
        setIsLeadModalOpen(false);
        setSelectedReceipt(newTx);
        setCustomerName('');
        setCustomerMobile('');
        setPanNumber('');
      }, 1500);
    }, 1200);
  };

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-150">
      {/* Financial Products Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-700 to-slate-900 text-white p-4 rounded-2xl shadow-lg border border-amber-500/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-amber-200 text-xs font-semibold uppercase">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Sell & Earn Marketplace
            </div>
            <h2 className="text-lg font-bold mt-0.5">फाइनेंशियल प्रोडक्ट्स (Loans & Cards)</h2>
            <p className="text-xs text-amber-100 mt-0.5">
              Help your customers get instant loans & cards. Earn up to ₹12,000 per lead!
            </p>
          </div>
          <span className="text-xs bg-amber-400 text-amber-950 font-black px-2.5 py-1 rounded-lg">
            MAX PAYOUT
          </span>
        </div>
      </div>

      {/* Loan EMI Calculator */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-blue-600" />
            त्वरित लोन ईएमआई कैलकुलेटर (Loan EMI Calculator)
          </h3>
          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
            EMI: ₹{emi.toLocaleString('en-IN')}/mo
          </span>
        </div>

        {/* Loan Amount Slider */}
        <div>
          <div className="flex justify-between text-xs text-slate-600 font-semibold mb-1">
            <span>Loan Amount:</span>
            <span className="font-bold text-slate-900">₹{loanAmount.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range"
            min={10000}
            max={500000}
            step={10000}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>₹10,000</span>
            <span>₹2,50,000</span>
            <span>₹5,00,000</span>
          </div>
        </div>

        {/* Tenure Slider */}
        <div>
          <div className="flex justify-between text-xs text-slate-600 font-semibold mb-1">
            <span>Tenure:</span>
            <span className="font-bold text-slate-900">{tenureMonths} Months</span>
          </div>
          <input
            type="range"
            min={6}
            max={60}
            step={6}
            value={tenureMonths}
            onChange={(e) => setTenureMonths(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>6 M</span>
            <span>24 M</span>
            <span>60 M</span>
          </div>
        </div>
      </div>

      {/* Product Cards List */}
      <div className="space-y-3">
        {FINANCIAL_PRODUCTS.map((prod) => {
          const Icon = getProductIcon(prod.category);
          return (
            <div
              key={prod.id}
              className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm hover:border-amber-400 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-full">
                        {prod.category}
                      </span>
                      {prod.badge && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {prod.badge}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 mt-0.5">{prod.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">Partner: {prod.provider}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Your Earning</span>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 inline-block">
                    {prod.agentCommission}
                  </span>
                </div>
              </div>

              {/* Key Features bullet points */}
              <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px]">Max Amount</span>
                  <span className="font-bold text-slate-800">{prod.maxAmount}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Interest Rate</span>
                  <span className="font-bold text-slate-800">{prod.interestRate}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <BadgeCheck className="w-4 h-4 text-emerald-600" />
                  100% Digital Approval
                </span>
                <button
                  onClick={() => handleOpenLead(prod)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                >
                  Apply for Customer
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Lead Application Modal */}
      {isLeadModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-semibold">{selectedProduct.category}</span>
                <h3 className="font-bold text-sm text-white">{selectedProduct.title}</h3>
              </div>
              <button
                onClick={() => setIsLeadModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successMessage ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="font-bold text-base text-slate-900">Lead Sanctioned!</h4>
                <p className="text-xs text-slate-600">{successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitLead} className="p-5 space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">ग्राहक का पूरा नाम (Customer Full Name)</label>
                  <input
                    type="text"
                    required
                    placeholder="As per Aadhaar/PAN"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">मोबाइल नंबर (Customer Mobile)</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={customerMobile}
                    onChange={(e) => setCustomerMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">पैन कार्ड नंबर (PAN Card)</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="ABCDE1234F"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Retailer Commission:</span>
                    <span className="text-emerald-700">{selectedProduct.agentCommission}</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    Instant paperless e-KYC. Commission is credited directly to your PayMitra wallet upon approval!
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-xl shadow-md transition-all text-xs"
                >
                  {isSubmitting ? 'Verifying CIBIL & Submitting Lead...' : 'Submit Customer Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
