import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MerchantGatewayBrand, IndianLanguageCode } from '../types';
import { ALL_INDIAN_LANGUAGES } from '../data/indianLanguages';
import {
  QrCode,
  Smartphone,
  Volume2,
  VolumeX,
  CreditCard,
  Building,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Share2,
  Download,
  Printer,
  Sparkles,
  Zap,
  ShieldCheck,
  RefreshCw,
  Sliders,
  DollarSign,
  Radio,
  Send,
  AlertCircle,
  Copy,
  Check,
  Wifi,
  Battery,
} from 'lucide-react';

export const MerchantPGScreen: React.FC = () => {
  const {
    merchantSettings,
    updateMerchantSettings,
    merchantPayments,
    soundboxDevices,
    merchantSettlementBalance,
    triggerMerchantSettlement,
    simulateIncomingMerchantPayment,
    playMerchantSoundboxAnnouncement,
    userProfile,
    language,
    setActiveTab,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'qr' | 'soundbox' | 'settlement' | 'pos' | 'links'>('qr');
  const [selectedBrand, setSelectedBrand] = useState<MerchantGatewayBrand>(merchantSettings.primaryGateway || 'PHONEPE');

  // Dynamic QR state
  const [customAmount, setCustomAmount] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [isDynamicQrGenerated, setIsDynamicQrGenerated] = useState(false);

  // Settlement state
  const [settleAmount, setSettleAmount] = useState(merchantSettlementBalance.toString());
  const [settlementSuccessMsg, setSettlementSuccessMsg] = useState<string | null>(null);

  // Soundbox test simulation state
  const [testPayerName, setTestPayerName] = useState('Rahul Verma');
  const [testAmount, setTestAmount] = useState('500');
  const [copiedVpa, setCopiedVpa] = useState(false);

  // Payment Link state
  const [linkMobile, setLinkMobile] = useState('');
  const [linkAmount, setLinkAmount] = useState('');
  const [generatedLinkUrl, setGeneratedLinkUrl] = useState<string | null>(null);

  // Brand config
  const brandThemes: Record<
    MerchantGatewayBrand,
    { name: string; color: string; bgGradient: string; badge: string; vpaHandle: string }
  > = {
    PHONEPE: {
      name: 'PhonePe for Business',
      color: 'text-purple-600',
      bgGradient: 'from-purple-900 via-indigo-950 to-slate-900',
      badge: 'PhonePe Smart QR',
      vpaHandle: '@ybl',
    },
    PAYTM: {
      name: 'Paytm for Business',
      color: 'text-sky-500',
      bgGradient: 'from-sky-900 via-blue-950 to-slate-900',
      badge: 'Paytm All-in-One QR',
      vpaHandle: '@paytm',
    },
    GPAY: {
      name: 'Google Pay for Business',
      color: 'text-emerald-500',
      bgGradient: 'from-emerald-950 via-slate-900 to-blue-950',
      badge: 'GPay Business Verified',
      vpaHandle: '@okbizaxis',
    },
    BHARATPE: {
      name: 'BharatPe Merchant QR',
      color: 'text-teal-500',
      bgGradient: 'from-teal-950 via-slate-900 to-emerald-950',
      badge: 'BharatPe Club QR',
      vpaHandle: '@bharatpe',
    },
    RAZORPAY: {
      name: 'Razorpay UPI PG',
      color: 'text-blue-500',
      bgGradient: 'from-blue-950 via-slate-900 to-indigo-950',
      badge: 'Razorpay Smart Routing',
      vpaHandle: '@razorpay',
    },
  };

  const currentTheme = brandThemes[selectedBrand];
  const activeSoundbox = soundboxDevices.find((d) => d.brand === selectedBrand) || soundboxDevices[0];

  const handleCopyVpa = () => {
    navigator.clipboard?.writeText(merchantSettings.merchantVpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleGenerateDynamicQr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAmount || parseFloat(customAmount) <= 0) return;
    setIsDynamicQrGenerated(true);
  };

  const handleTestPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(testAmount);
    if (!amt || amt <= 0) return;
    simulateIncomingMerchantPayment(testPayerName || 'Customer', amt, selectedBrand, 'Test Store Scan');
  };

  const handleSettlementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(settleAmount);
    if (!amt || amt <= 0) return;
    const res = triggerMerchantSettlement(amt);
    if (res.success) {
      setSettlementSuccessMsg(res.message);
      setSettleAmount('0');
      setTimeout(() => setSettlementSuccessMsg(null), 5000);
    } else {
      alert(res.message);
    }
  };

  const handleCreatePaymentLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkMobile || !linkAmount) return;
    const url = `https://paymitra.in/pay/${userProfile.agentCode.toLowerCase()}?amt=${linkAmount}&vpa=${merchantSettings.merchantVpa}`;
    setGeneratedLinkUrl(url);
  };

  return (
    <div className="space-y-4 pb-14 animate-in fade-in duration-150">
      {/* Top Merchant Brand Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-4 rounded-2xl shadow-lg border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                0% MDR • UPI Merchant
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-700/50 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Verified Merchant
              </span>
            </div>
            <h2 className="text-base font-extrabold text-white mt-1">
              {merchantSettings.storeName}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
              <span className="font-mono text-blue-300">{merchantSettings.merchantVpa}</span>
              <button
                onClick={handleCopyVpa}
                className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5 underline"
              >
                {copiedVpa ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedVpa ? 'Copied' : 'Copy VPA'}
              </button>
            </div>
          </div>

          {/* Settle to Bank Button */}
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Unsettled QR Balance
            </span>
            <div className="text-lg font-extrabold text-emerald-400">
              ₹{merchantSettlementBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <button
              onClick={() => setActiveSubTab('settlement')}
              className="mt-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-xl flex items-center gap-1 transition-colors shadow-sm ml-auto"
            >
              <Zap className="w-3 h-3" />
              Instant Settle (T+0)
            </button>
          </div>
        </div>

        {/* Gateway Brand Switcher Ribbon */}
        <div className="pt-2 border-t border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[11px] text-slate-400 font-semibold shrink-0">Gateway Rail:</span>
          {(['PHONEPE', 'PAYTM', 'GPAY', 'BHARATPE'] as MerchantGatewayBrand[]).map((brand) => {
            const isSel = selectedBrand === brand;
            return (
              <button
                key={brand}
                onClick={() => {
                  setSelectedBrand(brand);
                  updateMerchantSettings({ primaryGateway: brand });
                }}
                className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSel
                    ? 'bg-white text-slate-950 shadow-md font-extrabold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>{brandThemes[brand].name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Tabs: QR Standee | Soundbox Fleet | Bank Settlement | POS Swipe | Payment Link */}
      <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 overflow-x-auto scrollbar-none text-xs font-bold text-slate-600">
        {[
          { id: 'qr', label: 'Store All-in-One QR', icon: QrCode },
          { id: 'soundbox', label: '4G Audio Soundbox', icon: Volume2 },
          { id: 'settlement', label: 'T+0 Bank Settlement', icon: Building },
          { id: 'pos', label: 'Card Swipe & POS', icon: CreditCard },
          { id: 'links', label: 'WhatsApp Payment Link', icon: Send },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSel = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
                isSel
                  ? 'bg-white text-blue-700 shadow-sm font-extrabold'
                  : 'hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= 1. STORE ALL-IN-ONE QR CODE VIEW ================= */}
      {activeSubTab === 'qr' && (
        <div className="space-y-4">
          {/* Authentic Branded Counter Standee Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md flex flex-col items-center text-center space-y-3 relative overflow-hidden">
            {/* Top Brand Banner */}
            <div className={`w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r ${currentTheme.bgGradient} text-white flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-xs font-black">
                  ₹
                </span>
                <span className="font-black text-xs tracking-tight">{currentTheme.name}</span>
              </div>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                0% MDR
              </span>
            </div>

            {/* Merchant Details */}
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                {merchantSettings.storeName}
              </h3>
              <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                UPI ID: {merchantSettings.merchantVpa}
              </p>
            </div>

            {/* Visual Authentic QR Block */}
            <div className="p-4 bg-white rounded-2xl border-2 border-slate-900 shadow-inner inline-block relative">
              {/* Scalable Vector QR Visual */}
              <div className="w-44 h-44 bg-slate-900 rounded-xl p-3 flex flex-col justify-between relative shadow-sm">
                {/* 3 Alignment Squares */}
                <div className="flex justify-between">
                  <div className="w-9 h-9 border-4 border-white bg-white rounded-md p-1">
                    <div className="w-full h-full bg-slate-950 rounded-xs"></div>
                  </div>
                  <div className="w-9 h-9 border-4 border-white bg-white rounded-md p-1">
                    <div className="w-full h-full bg-slate-950 rounded-xs"></div>
                  </div>
                </div>

                {/* Center Brand Badge Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-lg border-2 border-blue-600 flex items-center justify-center font-extrabold text-xs text-blue-700">
                    {selectedBrand === 'PHONEPE' ? 'पे' : selectedBrand === 'PAYTM' ? 'Ptm' : 'UPI'}
                  </div>
                </div>

                {/* Bottom Alignment Square */}
                <div className="flex justify-between items-end">
                  <div className="w-9 h-9 border-4 border-white bg-white rounded-md p-1">
                    <div className="w-full h-full bg-slate-950 rounded-xs"></div>
                  </div>
                  {/* Decorative QR matrix pattern */}
                  <div className="w-12 h-6 flex flex-wrap gap-1 opacity-70">
                    <div className="w-2 h-2 bg-white"></div>
                    <div className="w-2 h-2 bg-white"></div>
                    <div className="w-2 h-2 bg-white"></div>
                    <div className="w-2 h-2 bg-white"></div>
                  </div>
                </div>
              </div>

              {isDynamicQrGenerated && (
                <div className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md animate-bounce">
                  ₹{customAmount} Locked
                </div>
              )}
            </div>

            {/* Supported Inward Apps Banner */}
            <div className="w-full pt-1 flex items-center justify-center gap-3 text-[10px] text-slate-500 font-bold border-t border-slate-100">
              <span className="text-purple-600">PhonePe</span>
              <span>•</span>
              <span className="text-sky-600">Paytm</span>
              <span>•</span>
              <span className="text-emerald-600">Google Pay</span>
              <span>•</span>
              <span className="text-teal-600">BharatPe</span>
              <span>•</span>
              <span className="text-orange-600">BHIM UPI</span>
            </div>

            {/* Quick Actions: Download, Print, Share */}
            <div className="grid grid-cols-3 gap-2 w-full pt-1 text-xs font-bold">
              <button
                onClick={() => alert(`Standee QR downloaded successfully for ${merchantSettings.storeName}!`)}
                className="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Save PNG</span>
              </button>
              <button
                onClick={() => alert('Printing standee laminated counter template...')}
                className="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Print Standee</span>
              </button>
              <button
                onClick={() => alert(`QR link copied to share on WhatsApp: https://paymitra.in/qr/${merchantSettings.merchantVpa}`)}
                className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share QR</span>
              </button>
            </div>
          </div>

          {/* Dynamic QR Generator Form */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Generate Custom Amount QR (ग्राहक से तय राशि लें)
              </h4>
              {isDynamicQrGenerated && (
                <button
                  onClick={() => {
                    setIsDynamicQrGenerated(false);
                    setCustomAmount('');
                    setCustomNote('');
                  }}
                  className="text-[11px] text-rose-600 font-bold hover:underline"
                >
                  Reset to Store Default
                </button>
              )}
            </div>

            <form onSubmit={handleGenerateDynamicQr} className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Enter Amount (₹)</label>
                <input
                  type="number"
                  required
                  min={1}
                  placeholder="e.g. 350"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Bill Note / Customer (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 5kg Basmati Rice"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-sm flex items-center justify-center gap-1"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Update QR Display</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= 2. 4G AUDIO SOUNDBOX SIMULATOR ================= */}
      {activeSubTab === 'soundbox' && (
        <div className="space-y-4">
          {/* Soundbox Device Status Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-4 rounded-3xl shadow-lg border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
                  <Volume2 className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-white">
                      {selectedBrand === 'PHONEPE' ? 'PhonePe SmartSpeaker' : selectedBrand === 'PAYTM' ? 'Paytm Soundbox 4G' : 'PayMitra VoiceBox'}
                    </h3>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      ONLINE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    S/N: {activeSoundbox.serialNumber} • 4G Jio SIM • Battery 94%
                  </p>
                </div>
              </div>

              {/* Soundbox Toggle Switch */}
              <button
                onClick={() => updateMerchantSettings({ soundboxEnabled: !merchantSettings.soundboxEnabled })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                  merchantSettings.soundboxEnabled
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {merchantSettings.soundboxEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{merchantSettings.soundboxEnabled ? 'Active (बोलता है)' : 'Muted'}</span>
              </button>
            </div>

            {/* Soundbox Voice Language & Gender Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                  Announcement Language (आवाज की भाषा):
                </label>
                <select
                  value={merchantSettings.soundboxLanguage}
                  onChange={(e) => updateMerchantSettings({ soundboxLanguage: e.target.value as IndianLanguageCode })}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold outline-none focus:border-blue-500"
                >
                  {ALL_INDIAN_LANGUAGES.filter((l) => l.code !== 'auto').map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.nativeName} ({l.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                  Voice Tone / Gender:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateMerchantSettings({ soundboxVoiceGender: 'female' })}
                    className={`py-2 rounded-xl font-bold transition-all ${
                      merchantSettings.soundboxVoiceGender === 'female'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Female (महिला स्वर)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateMerchantSettings({ soundboxVoiceGender: 'male' })}
                    className={`py-2 rounded-xl font-bold transition-all ${
                      merchantSettings.soundboxVoiceGender === 'male'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Male (पुरुष स्वर)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Test Soundbox Simulation Form */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              Simulate Incoming Customer QR Payment (साउंडबॉक्स चलाकर देखें)
            </h4>
            <p className="text-[11px] text-slate-500">
              Enter test amount and customer name to trigger real-time voice announcement through device speakers.
            </p>

            <form onSubmit={handleTestPayment} className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={testPayerName}
                  onChange={(e) => setTestPayerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Payment Amount (₹)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={testAmount}
                  onChange={(e) => setTestAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors shadow-md flex items-center justify-center gap-1.5"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Receive & Announce</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= 3. T+0 INSTANT BANK SETTLEMENT ================= */}
      {activeSubTab === 'settlement' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Instant T+0 Bank Account Settlement
                </h3>
                <p className="text-xs text-slate-500">
                  Transfer incoming UPI collections to registered Bank Account in 10 seconds
                </p>
              </div>
              <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                IMPS Instant Rail
              </span>
            </div>

            {/* Registered Bank Account Details */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  SBI
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">
                    {merchantSettings.settlementAccount.bankName}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    A/C: {merchantSettings.settlementAccount.accountNumber} • IFSC: {merchantSettings.settlementAccount.ifsc}
                  </p>
                  <span className="text-[10px] text-emerald-600 font-bold">
                    Primary Verified Beneficiary ({merchantSettings.settlementAccount.holderName})
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-600">Active</span>
            </div>

            {/* Settlement Balance Summary */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-[11px] text-emerald-700 font-semibold block">Available for Settlement</span>
                <span className="text-xl font-black text-emerald-800">
                  ₹{merchantSettlementBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-semibold block">Settlement Fee / MDR</span>
                <span className="text-xl font-black text-slate-800">0.00% (Free)</span>
              </div>
            </div>

            {/* Success Banner if settled */}
            {settlementSuccessMsg && (
              <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{settlementSuccessMsg}</span>
              </div>
            )}

            {/* Settlement Form */}
            <form onSubmit={handleSettlementSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Settlement Amount (₹)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    required
                    min={1}
                    max={merchantSettlementBalance}
                    value={settleAmount}
                    onChange={(e) => setSettleAmount(e.target.value)}
                    className="flex-1 p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold text-base outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setSettleAmount(merchantSettlementBalance.toString())}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                  >
                    Max All
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={merchantSettlementBalance <= 0}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <Building className="w-4 h-4" />
                  <span>Transfer Immediately to State Bank of India</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= 4. CARD SWIPE & POS TERMINAL ================= */}
      {activeSubTab === 'pos' && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Micro-ATM & POS Card Swipe Terminal
              </h3>
              <p className="text-xs text-slate-500">
                Accept Debit & Credit Card payments (RuPay, Visa, MasterCard) via Bluetooth Micro-ATM
              </p>
            </div>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              PAX D180 Connected
            </span>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl text-white flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">POS Terminal ID</span>
              <div className="font-mono font-bold text-sm text-blue-300">TID-99214-DEL</div>
              <p className="text-xs text-slate-300 mt-1">Ready for Contactless Tap / Chip Insert</p>
            </div>
            <CreditCard className="w-10 h-10 text-blue-400" />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-900 block">RuPay Debit</span>
              <span className="text-[10px] text-emerald-600 font-bold">0.00% MDR</span>
            </div>
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-900 block">Visa / Master</span>
              <span className="text-[10px] text-slate-500">0.90% MDR</span>
            </div>
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-900 block">Credit Cards</span>
              <span className="text-[10px] text-slate-500">1.25% MDR</span>
            </div>
          </div>

          <button
            onClick={() => {
              alert('Micro-ATM terminal triggered. Please ask customer to tap or insert card on the PAX Bluetooth device.');
            }}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <CreditCard className="w-4 h-4" />
            <span>Initiate Card Transaction on POS Device</span>
          </button>
        </div>
      )}

      {/* ================= 5. WHATSAPP & SMS PAYMENT LINKS ================= */}
      {activeSubTab === 'links' && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              Generate Payment Link (WhatsApp & SMS)
            </h3>
            <p className="text-xs text-slate-500">
              Send direct payment link to distant customers. They can pay using PhonePe, Paytm, GPay, or Netbanking.
            </p>
          </div>

          <form onSubmit={handleCreatePaymentLink} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold block mb-1">Customer Mobile</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit number"
                  value={linkMobile}
                  onChange={(e) => setLinkMobile(e.target.value.replace(/\D/g, ''))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  min={1}
                  placeholder="e.g. 1500"
                  value={linkAmount}
                  onChange={(e) => setLinkAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold font-mono outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Create Link & Open WhatsApp Share</span>
            </button>
          </form>

          {generatedLinkUrl && (
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <span className="text-[10px] font-bold text-emerald-800 uppercase">
                Payment Link Ready:
              </span>
              <p className="text-xs font-mono text-emerald-950 break-all bg-white p-2 rounded-lg border border-emerald-200">
                {generatedLinkUrl}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(generatedLinkUrl);
                    alert('Link copied to clipboard!');
                  }}
                  className="flex-1 py-1.5 bg-white border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl hover:bg-emerald-100 transition-colors"
                >
                  Copy Link
                </button>
                <button
                  onClick={() => {
                    const text = `Namaste! Please click to pay ₹${linkAmount} to ${merchantSettings.storeName}: ${generatedLinkUrl}`;
                    window.open(`https://wa.me/91${linkMobile}?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="flex-1 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-500 transition-colors shadow-xs"
                >
                  Send via WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= LIVE INWARD PAYMENT TRANSACTIONS FEED ================= */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-extrabold text-xs text-slate-900">
              Live Inward Store Payments (QR एवं ऑनलाइन पेमेंट्स)
            </h4>
            <p className="text-[10px] text-slate-500">
              Real-time feed from PhonePe, Paytm, Google Pay & BharatPe QR
            </p>
          </div>
          <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
            {merchantPayments.length} Payments Today
          </span>
        </div>

        <div className="space-y-2 max-h-[350px] overflow-y-auto">
          {merchantPayments.map((pay) => (
            <div
              key={pay.id}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-xs shadow-xs ${
                    pay.gateway === 'PHONEPE'
                      ? 'bg-purple-600'
                      : pay.gateway === 'PAYTM'
                      ? 'bg-sky-500'
                      : pay.gateway === 'GPAY'
                      ? 'bg-emerald-600'
                      : 'bg-teal-600'
                  }`}
                >
                  {pay.gateway === 'PHONEPE' ? 'पे' : pay.gateway === 'PAYTM' ? 'Ptm' : 'G'}
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    {pay.payerName}
                    <span className="text-[9px] bg-slate-200 text-slate-700 font-normal px-1 rounded font-mono">
                      {pay.gateway}
                    </span>
                  </h5>
                  <p className="text-[10px] text-slate-500 font-mono">
                    UTR: {pay.utr} • {pay.timestamp}
                  </p>
                  {pay.note && <p className="text-[10px] text-blue-600 font-medium">{pay.note}</p>}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-extrabold text-emerald-600">
                  +₹{pay.amount.toLocaleString('en-IN')}
                </div>
                <button
                  onClick={() => playMerchantSoundboxAnnouncement(pay.amount, pay.gateway)}
                  className="mt-0.5 text-[10px] text-purple-700 font-bold hover:underline flex items-center gap-0.5 ml-auto"
                  title="Replay Voice Announcement"
                >
                  <Volume2 className="w-3 h-3 text-purple-600" />
                  <span>Replay Voice</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
