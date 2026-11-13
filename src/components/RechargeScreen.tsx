import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OPERATORS, SAMPLE_PLANS } from '../data/mockData';
import { Operator, RechargePlan } from '../types';
import confetti from 'canvas-confetti';
import {
  Smartphone,
  Tv,
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Wifi,
  Flame,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const RechargeScreen: React.FC = () => {
  const { walletBalance, deductWallet, creditCommission, addTransaction, setSelectedReceipt, language } = useApp();

  const [serviceType, setServiceType] = useState<'mobile' | 'dth'>('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedOperator, setSelectedOperator] = useState<Operator>(OPERATORS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Popular');
  const [customAmount, setCustomAmount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredOperators = OPERATORS.filter((op) =>
    serviceType === 'mobile' ? op.type === 'prepaid' : op.type === 'dth'
  );

  const plans = SAMPLE_PLANS[selectedOperator.id] || SAMPLE_PLANS['jio'] || [];

  const displayedPlans = plans.filter((p) => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch =
      searchQuery === '' ||
      p.price.toString().includes(searchQuery) ||
      p.data.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const categories = ['Popular', 'Truly Unlimited', 'Data Booster', 'Entertainment', 'Annual'];

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(val);

    // Auto-detect operator simulation based on prefix
    if (val.length >= 4) {
      const prefix = val.slice(0, 2);
      if (['98', '99', '88', '70'].includes(prefix) && selectedOperator.type === 'prepaid') {
        setSelectedOperator(OPERATORS.find((o) => o.id === 'airtel') || selectedOperator);
      } else if (['97', '96', '91', '89'].includes(prefix) && selectedOperator.type === 'prepaid') {
        setSelectedOperator(OPERATORS.find((o) => o.id === 'jio') || selectedOperator);
      }
    }
  };

  const handleExecuteRecharge = (plan?: RechargePlan) => {
    const rechargeAmt = plan ? plan.price : parseFloat(customAmount);
    if (!rechargeAmt || rechargeAmt <= 0) {
      alert('कृपया वैध रिचार्ज राशि दर्ज करें (Please select a valid recharge amount)');
      return;
    }

    if (serviceType === 'mobile' && mobileNumber.length !== 10) {
      alert('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें (Please enter 10-digit mobile number)');
      return;
    }
    if (serviceType === 'dth' && mobileNumber.length < 8) {
      alert('कृपया वैध DTH सब्सक्राइबर आईडी दर्ज करें (Please enter valid DTH ID)');
      return;
    }

    if (walletBalance < rechargeAmt) {
      alert(`अपर्याप्त वॉलेट बैलेंस! आपके वॉलेट में ₹${walletBalance} है, रिचार्ज हेतु ₹${rechargeAmt} चाहिए। कृपया पहले वॉलेट टॉप-अप करें।`);
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const commission = plan ? plan.commission : +(rechargeAmt * 0.03).toFixed(2);

      // Deduct from wallet & credit commission
      deductWallet(rechargeAmt);
      creditCommission(commission);

      const refNum = 'REC-' + selectedOperator.name.slice(0, 3).toUpperCase() + '-' + Math.floor(1000000 + Math.random() * 9000000);

      const newTx = addTransaction({
        type: 'RECHARGE',
        title: `${selectedOperator.name} ${serviceType === 'mobile' ? 'Mobile' : 'DTH'} Recharge`,
        amount: rechargeAmt,
        commission: commission,
        status: 'SUCCESS',
        refNumber: refNum,
        details: {
          mobileOrAcc: mobileNumber,
          operatorOrBank: selectedOperator.name,
          productName: plan ? `${plan.validity} - ${plan.data}` : `Custom Recharge ₹${rechargeAmt}`,
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
      {/* Type Toggle: Mobile vs DTH */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex gap-1">
        <button
          onClick={() => {
            setServiceType('mobile');
            setSelectedOperator(OPERATORS[0]);
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            serviceType === 'mobile'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          {language === 'hi' ? 'मोबाइल रिचार्ज (Prepaid)' : 'Mobile Recharge'}
        </button>
        <button
          onClick={() => {
            setServiceType('dth');
            setSelectedOperator(OPERATORS.find((o) => o.type === 'dth') || OPERATORS[4]);
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            serviceType === 'dth'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Tv className="w-4 h-4" />
          {language === 'hi' ? 'DTH रिचार्ज (Tata Play / Dish)' : 'DTH Recharge'}
        </button>
      </div>

      {/* Input Mobile Number / DTH ID */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">
            {serviceType === 'mobile' ? '10-अंक मोबाइल नंबर (Mobile Number)' : 'DTH सब्सक्राइबर आईडी (Subscriber ID)'}
          </label>
          <div className="relative">
            <input
              type={serviceType === 'mobile' ? 'tel' : 'text'}
              placeholder={serviceType === 'mobile' ? 'उदा. 9876543210' : '10-digit Subscriber / Smart Card ID'}
              value={mobileNumber}
              onChange={handleMobileChange}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold text-base focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            {serviceType === 'mobile' && mobileNumber.length === 10 && (
              <span className="absolute right-3 top-3 text-emerald-600 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Verified
              </span>
            )}
          </div>
        </div>

        {/* Operator Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1.5">
            ऑपरेटर चुनें (Select Operator)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {filteredOperators.map((op) => {
              const isSel = selectedOperator.id === op.id;
              return (
                <button
                  key={op.id}
                  onClick={() => setSelectedOperator(op)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                    isSel
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20 font-bold'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg bg-gradient-to-br ${op.color} text-white flex items-center justify-center font-bold text-[10px] shadow-xs`}
                  >
                    {op.logo.slice(0, 2)}
                  </div>
                  <div className="truncate text-xs">
                    <p className="font-semibold truncate">{op.name}</p>
                    <p className="text-[10px] text-slate-400 font-normal">{op.circle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Custom Amount input */}
        <div className="pt-2 border-t border-slate-100 flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₹</span>
            <input
              type="number"
              placeholder="Or enter custom amount..."
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full pl-7 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => handleExecuteRecharge()}
            disabled={!customAmount || isProcessing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
          >
            {isProcessing ? 'Processing...' : 'Quick Recharge'}
          </button>
        </div>
      </div>

      {/* Plan Categories & Plan Browser */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            {selectedOperator.name} बेहतरीन प्लान (Browse Plans)
          </h3>
          <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            3.0% Commission
          </span>
        </div>

        {/* Plan Category Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search plan inside */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search ₹299, 1.5GB, Disney+, Hotstar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 p-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Plans Grid */}
        <div className="space-y-2">
          {displayedPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-sm hover:border-blue-400 transition-all flex flex-col justify-between gap-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold text-slate-900">₹{plan.price}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                      {plan.validity}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                      {plan.data}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">{plan.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50/70 px-2 py-0.5 rounded">
                  Earn Commission: +₹{plan.commission.toFixed(2)}
                </span>
                <button
                  onClick={() => handleExecuteRecharge(plan)}
                  disabled={isProcessing}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-sm"
                >
                  Recharge Now
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
