import React from 'react';
import { useApp } from '../context/AppContext';
import { DeviceView } from '../types';
import {
  Smartphone,
  Tablet,
  Laptop,
  Shield,
  Languages,
  Wifi,
  Battery,
  Signal,
  Bell,
  Search,
  Wallet,
  Home,
  Tv,
  Fingerprint,
  Zap,
  ExternalLink,
  History,
  Bot,
  User,
  QrCode,
} from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const {
    deviceView,
    setDeviceView,
    appRole,
    setAppRole,
    activeTab,
    setActiveTab,
    language,
    setLanguage,
    walletBalance,
    setIsSupportModalOpen,
    userProfile,
  } = useApp();

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans select-none">
      {/* Top Persistent Global Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40 shadow-xl">
        {/* Brand & Role Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs shadow-md">
              PM
            </span>
            <span className="font-extrabold text-sm tracking-tight text-white hidden sm:inline">
              Pay<span className="text-blue-400">Mitra</span>
            </span>
          </div>

          {/* Mode Switcher: Mobile App vs Super Admin */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setAppRole('retailer')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                appRole === 'retailer'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Retailer App</span>
            </button>
            <button
              onClick={() => setAppRole('admin')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                appRole === 'admin'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>

        {/* Viewport Frame Switcher (Android vs iOS vs Web) */}
        {appRole === 'retailer' && (
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setDeviceView('android')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                deviceView === 'android'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Android (Pixel/Samsung) View"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Android</span>
            </button>
            <button
              onClick={() => setDeviceView('ios')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                deviceView === 'ios'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="iOS (iPhone 16) View"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden md:inline">iOS</span>
            </button>
            <button
              onClick={() => setDeviceView('web')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                deviceView === 'web'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Responsive Web View"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Web</span>
            </button>
          </div>
        )}

        {/* Language & Agent Badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            <Languages className="w-3.5 h-3.5 text-blue-400" />
            <span>{language === 'hi' ? 'हिंदी' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
        {appRole === 'admin' ? (
          <div className="w-full">{children}</div>
        ) : deviceView === 'web' ? (
          /* Desktop/Tablet Responsive Container */
          <div className="w-full max-w-4xl bg-slate-100 min-h-[85vh] rounded-2xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col my-auto">
            <AppHeader />
            <div className="flex-1 p-5 overflow-y-auto">{children}</div>
            <AppBottomNav />
          </div>
        ) : (
          /* Android or iOS Phone Frame */
          <div
            className={`relative w-full max-w-[420px] bg-slate-100 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden transition-all duration-300 ${
              deviceView === 'ios'
                ? 'h-[860px] rounded-[52px] border-[10px] border-slate-800 ring-2 ring-slate-700 shadow-slate-950/80'
                : 'h-[850px] rounded-[44px] border-[9px] border-slate-800 ring-2 ring-slate-700 shadow-slate-950/80'
            }`}
          >
            {/* Status Bar */}
            <div className="bg-slate-900 text-white px-6 pt-3 pb-2 flex items-center justify-between text-xs z-30 shrink-0">
              <span className="font-semibold text-[11px] font-mono tracking-tight">{currentTime}</span>

              {/* Dynamic Island / Notch Simulation */}
              {deviceView === 'ios' ? (
                <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center px-2">
                  <div className="w-2 h-2 rounded-full bg-slate-800 mr-2"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-900/40"></div>
                </div>
              ) : (
                /* Android Punch Hole Camera */
                <div className="w-3.5 h-3.5 rounded-full bg-black ring-1 ring-slate-800"></div>
              )}

              <div className="flex items-center gap-1.5 text-slate-300 text-[10px]">
                <span className="font-bold text-[9px]">5G</span>
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

            {/* App In-Screen Header */}
            <AppHeader />

            {/* Screen Content Body */}
            <div className="flex-1 overflow-y-auto px-4 py-3 bg-slate-100 scrollbar-none">
              {children}
            </div>

            {/* App Bottom Navigation */}
            <AppBottomNav />

            {/* Android / iOS Hardware Navigation Bars at very bottom */}
            {deviceView === 'ios' ? (
              /* iOS Home Indicator Bar */
              <div className="bg-white py-1.5 flex justify-center shrink-0">
                <div className="w-32 h-1 bg-slate-400 rounded-full"></div>
              </div>
            ) : (
              /* Android 3-Button or Gesture Pill */
              <div className="bg-white py-2 flex justify-center shrink-0">
                <div className="w-20 h-1 bg-slate-400 rounded-full"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const AppHeader: React.FC = () => {
  const { walletBalance, setActiveTab, userProfile, setIsSupportModalOpen, broadcasts, systemSettings, language } = useApp();

  const activeBroadcast = broadcasts.find((b) => b.isActive);

  return (
    <div className="shrink-0 z-20">
      {/* Global Maintenance Alert */}
      {systemSettings.globalMaintenance && (
        <div className="bg-rose-600 text-white px-3 py-1.5 text-[11px] font-bold text-center animate-pulse flex items-center justify-center gap-1.5">
          <span>⚠️ {systemSettings.maintenanceNotice}</span>
        </div>
      )}

      {/* In-App Flash Broadcast Ticker */}
      {activeBroadcast && !systemSettings.globalMaintenance && (
        <div className={`px-3 py-1 text-[11px] font-bold flex items-center justify-between gap-2 overflow-hidden ${
          activeBroadcast.type === 'OFFER'
            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
            : activeBroadcast.type === 'ALERT'
            ? 'bg-rose-500 text-white'
            : 'bg-blue-600 text-white'
        }`}>
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-black/20 font-black">
              {activeBroadcast.type}
            </span>
            <span className="truncate">
              {language === 'hi' && activeBroadcast.messageHi ? activeBroadcast.messageHi : activeBroadcast.message}
            </span>
          </div>
        </div>
      )}

      {/* Main Bar */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-2.5 flex items-center justify-between shadow-xs">
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs shadow-sm">
            PM
          </div>
          <div>
            <span className="font-black text-slate-900 text-sm tracking-tight">
              Pay<span className="text-blue-600">Mitra</span>
            </span>
            <span className="block text-[9px] text-emerald-600 font-bold leading-none">
              Verified NPCI Point
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Wallet Balance Quick Chip */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 cursor-pointer border border-slate-200 transition-colors"
          >
            <Wallet className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-black">
              ₹{walletBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
          </div>

          {/* Support Bot Quick Icon */}
          <button
            onClick={() => setIsSupportModalOpen(true)}
            className="p-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition-colors relative"
            title="Sahayak AI Support"
          >
            <Bot className="w-4 h-4 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

const AppBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, extraLinks, language } = useApp();

  const navItems = [
    { id: 'home', labelHi: 'होम', labelEn: 'Home', icon: Home },
    { id: 'merchant_pg', labelHi: 'मर्चेंट QR', labelEn: 'Merchant QR', icon: QrCode },
    { id: 'recharge', labelHi: 'रिचार्ज', labelEn: 'Recharge', icon: Smartphone },
    { id: 'aeps', labelHi: 'आधार ATM', labelEn: 'AEPS', icon: Fingerprint, isHot: true },
    { id: 'bbps', labelHi: 'बिल पे', labelEn: 'Bill Pay', icon: Zap },
    { id: 'links', labelHi: 'लिंक्स', labelEn: 'Extra Links', icon: ExternalLink, count: extraLinks.length },
    { id: 'history', labelHi: 'पासबुक', labelEn: 'Passbook', icon: History },
  ];

  return (
    <div className="bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shrink-0 shadow-lg z-20">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isSel = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`relative flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all ${
              isSel
                ? 'text-blue-600 font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {item.isHot && (
              <span className="absolute -top-1 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            )}
            <Icon className={`w-4 h-4 mb-0.5 ${isSel ? 'text-blue-600 stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] leading-tight font-medium">
              {language === 'hi' ? item.labelHi : item.labelEn}
            </span>
          </button>
        );
      })}
    </div>
  );
};
