import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExtraLink, RetailerUser, SystemLog, BroadcastNotification } from '../types';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  BarChart3,
  Link2,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Users,
  CreditCard,
  Building,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Search,
  Filter,
  Ticket,
  Save,
  RotateCcw,
  Sparkles,
  Globe,
  Settings,
  Sliders,
  BellRing,
  Lock,
  Unlock,
  Radio,
  Cpu,
  Server,
  Zap,
  Bot,
  Database,
  ArrowDownLeft,
  AlertOctagon,
  RefreshCw,
  Wallet,
  PhoneCall,
  Terminal,
  Network,
  QrCode,
  Volume2,
} from 'lucide-react';
import { HierarchyChannelController } from './HierarchyChannelController';

export const AdminPortal: React.FC = () => {
  const {
    systemSettings,
    updateSystemSettings,
    toggleService,
    setGatewayRoute,
    broadcasts,
    addBroadcast,
    toggleBroadcast,
    deleteBroadcast,
    retailers,
    updateRetailerStatus,
    toggleRetailerWalletLock,
    adjustRetailerWallet,
    addRetailer,
    systemLogs,
    clearSystemLogs,
    purgeCache,
    extraLinks,
    addExtraLink,
    updateExtraLink,
    deleteExtraLink,
    toggleExtraLink,
    commissionSlabs,
    updateCommissionSlab,
    transactions,
    tickets,
    updateTicketStatus,
    setAppRole,
    masterDistributors,
    distributors,
    merchantSettings,
    updateMerchantSettings,
    merchantPayments,
    soundboxDevices,
    toggleSoundboxDevice,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'switchboard' | 'security' | 'merchant_pg' | 'broadcasts' | 'hierarchy' | 'retailers' | 'links' | 'slabs' | 'transactions' | 'logs'
  >('switchboard');

  // Modals
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ExtraLink | null>(null);
  const [isAddBroadcastOpen, setIsAddBroadcastOpen] = useState(false);
  const [isWalletAdjustOpen, setIsWalletAdjustOpen] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState<RetailerUser | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('1000');
  const [adjustType, setAdjustType] = useState<'credit' | 'debit'>('credit');
  const [adjustReason, setAdjustReason] = useState('Promotional Bonus Credit');
  const [isAddRetailerOpen, setIsAddRetailerOpen] = useState(false);

  // New Link form state
  const [linkTitle, setLinkTitle] = useState('');
  const [linkTitleHi, setLinkTitleHi] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkCategory, setLinkCategory] = useState<ExtraLink['category']>('Govt');
  const [linkBadge, setLinkBadge] = useState('Govt Official');
  const [linkDescription, setLinkDescription] = useState('');
  const [linkIcon, setLinkIcon] = useState('Building2');
  const [linkOrder, setLinkOrder] = useState(1);

  // Broadcast form state
  const [bcMessage, setBcMessage] = useState('');
  const [bcMessageHi, setBcMessageHi] = useState('');
  const [bcType, setBcType] = useState<BroadcastNotification['type']>('INFO');

  // New Retailer form state
  const [newRetName, setNewRetName] = useState('');
  const [newRetShop, setNewRetShop] = useState('');
  const [newRetMobile, setNewRetMobile] = useState('');
  const [newRetEmail, setNewRetEmail] = useState('');
  const [newRetCity, setNewRetCity] = useState('');
  const [newRetState, setNewRetState] = useState('');

  // Search & filter
  const [retailerSearch, setRetailerSearch] = useState('');
  const [logModuleFilter, setLogModuleFilter] = useState('ALL');

  const handleOpenAddLinkModal = (linkToEdit?: ExtraLink) => {
    if (linkToEdit) {
      setEditingLink(linkToEdit);
      setLinkTitle(linkToEdit.title);
      setLinkTitleHi(linkToEdit.titleHi || '');
      setLinkUrl(linkToEdit.url);
      setLinkCategory(linkToEdit.category);
      setLinkBadge(linkToEdit.badge || '');
      setLinkDescription(linkToEdit.description);
      setLinkIcon(linkToEdit.icon);
      setLinkOrder(linkToEdit.order);
    } else {
      setEditingLink(null);
      setLinkTitle('');
      setLinkTitleHi('');
      setLinkUrl('');
      setLinkCategory('Govt');
      setLinkBadge('Popular');
      setLinkDescription('');
      setLinkIcon('Globe');
      setLinkOrder(extraLinks.length + 1);
    }
    setIsAddLinkModalOpen(true);
  };

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkTitle || !linkUrl) return;

    if (editingLink) {
      updateExtraLink(editingLink.id, {
        title: linkTitle,
        titleHi: linkTitleHi || undefined,
        url: linkUrl,
        category: linkCategory,
        badge: linkBadge || undefined,
        description: linkDescription,
        icon: linkIcon,
        order: linkOrder,
      });
    } else {
      addExtraLink({
        title: linkTitle,
        titleHi: linkTitleHi || undefined,
        url: linkUrl,
        category: linkCategory,
        badge: linkBadge || undefined,
        description: linkDescription,
        icon: linkIcon,
        order: linkOrder,
        isActive: true,
      });
    }

    setIsAddLinkModalOpen(false);
  };

  const handleCreateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bcMessage) return;
    addBroadcast({
      message: bcMessage,
      messageHi: bcMessageHi || undefined,
      type: bcType,
      isActive: true,
    });
    setBcMessage('');
    setBcMessageHi('');
    setIsAddBroadcastOpen(false);
  };

  const handleApplyWalletAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRetailer) return;
    const amt = parseFloat(adjustAmount);
    if (!amt || amt <= 0) return;
    adjustRetailerWallet(selectedRetailer.id, amt, adjustType, adjustReason);
    setIsWalletAdjustOpen(false);
  };

  const handleEnrollRetailer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRetName || !newRetMobile) return;
    addRetailer({
      name: newRetName,
      shopName: newRetShop || `${newRetName} Digital Point`,
      mobile: newRetMobile,
      email: newRetEmail || `${newRetMobile}@paymitra.agent`,
      city: newRetCity || 'Delhi',
      state: newRetState || 'Delhi',
      kycStatus: 'VERIFIED',
    });
    setNewRetName('');
    setNewRetShop('');
    setNewRetMobile('');
    setNewRetEmail('');
    setNewRetCity('');
    setNewRetState('');
    setIsAddRetailerOpen(false);
  };

  const totalGMV = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalCommission = transactions.reduce((sum, tx) => sum + tx.commission, 0);
  const filteredRetailers = retailers.filter(
    (r) =>
      retailerSearch === '' ||
      r.name.toLowerCase().includes(retailerSearch.toLowerCase()) ||
      r.shopName.toLowerCase().includes(retailerSearch.toLowerCase()) ||
      r.mobile.includes(retailerSearch) ||
      r.agentCode.toLowerCase().includes(retailerSearch.toLowerCase())
  );

  const filteredLogs = systemLogs.filter(
    (l) => logModuleFilter === 'ALL' || l.module === logModuleFilter
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* Top Controller HUD */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-blue-500/30">
            PM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
                PayMitra <span className="text-blue-400">Master System Controller</span>
              </h1>
              <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                Root Admin
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live Gateway Switches, Routing Rails, Risk Rules & Agent Management
            </p>
          </div>
        </div>

        {/* Global System Master Controls */}
        <div className="flex items-center gap-3">
          {/* Emergency Kill Switch */}
          <button
            onClick={() =>
              updateSystemSettings({ globalMaintenance: !systemSettings.globalMaintenance })
            }
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
              systemSettings.globalMaintenance
                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title="Toggle Global Platform Maintenance Mode"
          >
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            <span>
              {systemSettings.globalMaintenance ? 'MAINTENANCE ON (HALT)' : 'Platform: LIVE'}
            </span>
          </button>

          {/* Purge Cache Button */}
          <button
            onClick={purgeCache}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
            title="Purge in-memory routing tables and Redis cache"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
            <span>Purge Cache</span>
          </button>

          {/* Switch to Mobile View */}
          <button
            onClick={() => setAppRole('retailer')}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
          >
            <span>App Preview</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Global Alert Notification Banner if Maintenance is Active */}
      {systemSettings.globalMaintenance && (
        <div className="bg-rose-900/90 border-b border-rose-700 text-rose-100 px-6 py-2.5 text-xs font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-300 animate-bounce" />
            GLOBAL MAINTENANCE ACTIVE: Retailer transactions are paused. Displayed Notice: "
            {systemSettings.maintenanceNotice}"
          </span>
          <button
            onClick={() => updateSystemSettings({ globalMaintenance: false })}
            className="underline hover:text-white"
          >
            Resume Normal Operations
          </button>
        </div>
      )}

      {/* Tab Navigation Ribbon */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-6 flex gap-2 overflow-x-auto scrollbar-none py-2 text-xs sticky top-[57px] z-20 backdrop-blur-md">
        {[
          { id: 'switchboard', label: 'Gateway & Service Switchboard', icon: Sliders },
          { id: 'security', label: 'Risk & Limits Controller', icon: ShieldAlert },
          { id: 'merchant_pg', label: 'PhonePe & Merchant PG Fleet', icon: QrCode, badge: `${soundboxDevices.length} Boxes` },
          { id: 'broadcasts', label: 'Broadcast & News Dispatcher', icon: BellRing, badge: `${broadcasts.length}` },
          { id: 'hierarchy', label: 'MD, Distributor & Retailer Channel', icon: Network, badge: `${masterDistributors.length} MD / ${distributors.length} D` },
          { id: 'retailers', label: 'Retailer KYC & Wallet Controller', icon: Users, badge: `${retailers.length}` },
          { id: 'links', label: 'Admin Extra Links Manager', icon: Link2, badge: `${extraLinks.length}` },
          { id: 'slabs', label: 'Commission Margins & Slabs', icon: DollarSign },
          { id: 'transactions', label: 'Live Audit Feed', icon: Activity, badge: `${transactions.length}` },
          { id: 'logs', label: 'System Diagnostics & Logs', icon: Terminal, badge: `${systemLogs.length}` },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSel = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                isSel
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSel ? 'bg-blue-900 text-blue-200' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Body Content */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* ================= 1. GATEWAY & SERVICE SWITCHBOARD ================= */}
        {activeTab === 'switchboard' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Top Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
                <span className="text-xs text-slate-400 font-semibold uppercase block">
                  Total Platform GMV
                </span>
                <div className="text-2xl font-extrabold text-white mt-1">
                  ₹{(totalGMV + 14820000).toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +18.4% weekly velocity
                </span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
                <span className="text-xs text-slate-400 font-semibold uppercase block">
                  Nodal Escrow Pool Liquidity
                </span>
                <div className="text-2xl font-extrabold text-emerald-400 mt-1">
                  ₹4,82,50,000.00
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  ICICI Escrow + HDFC Settlements
                </span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
                <span className="text-xs text-slate-400 font-semibold uppercase block">
                  Active BC Retailers
                </span>
                <div className="text-2xl font-extrabold text-blue-400 mt-1">
                  {retailers.length} Verified
                </div>
                <span className="text-[11px] text-emerald-400 font-bold mt-1 block">
                  100% Biometric Compliant
                </span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
                <span className="text-xs text-slate-400 font-semibold uppercase block">
                  Central Switch Latency
                </span>
                <div className="text-2xl font-extrabold text-cyan-400 mt-1">340 ms</div>
                <span className="text-[11px] text-emerald-400 font-bold mt-1 block">
                  99.98% NPCI Uptime SLA
                </span>
              </div>
            </div>

            {/* Granular Service Kill-Switches */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-blue-400" />
                    Granular Service Controller (Individual On/Off Switches)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Toggle services into maintenance mode instantaneously without taking down the full app.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: 'aeps', title: 'AEPS 2.0 Engine', sub: 'Cash, Balance & Statement' },
                  { key: 'recharge', title: 'Prepaid Recharge Rail', sub: 'Jio, Airtel, Vi, BSNL' },
                  { key: 'dth', title: 'DTH Satellite Switch', sub: 'Tata Play, Dish, Sun Direct' },
                  { key: 'bbps', title: 'Bharat BillPay (BBPS)', sub: 'Electricity, Water, Fastag' },
                  { key: 'dmt', title: 'DMT Money Transfer', sub: 'IMPS/NEFT 24x7 Switch' },
                  { key: 'financial', title: 'Financial Products API', sub: 'Loans, Cards, Insurance' },
                  { key: 'walletTopup', title: 'Wallet Top-up Gateway', sub: 'Instant UPI & QR Code' },
                ].map((s) => {
                  const isLive = (systemSettings.services as any)[s.key];
                  return (
                    <div
                      key={s.key}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                        isLive
                          ? 'bg-slate-950/70 border-slate-800'
                          : 'bg-rose-950/20 border-rose-900/60'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-white block">{s.title}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{s.sub}</span>
                      </div>
                      <button
                        onClick={() => toggleService(s.key as any)}
                        className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                          isLive
                            ? 'bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800'
                            : 'bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-800'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isLive ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'
                          }`}
                        ></span>
                        {isLive ? 'ONLINE (ACTIVE)' : 'PAUSED (MAINT.)'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gateway Routing Matrix */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                Live API Gateway & Partner Routing Controller
              </h3>
              <p className="text-xs text-slate-400">
                Switch routing vendors or failover partners with zero downtime.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* AEPS Nodal Bank */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">
                    AEPS Primary Nodal Bank
                  </label>
                  <select
                    value={systemSettings.gateways.aepsNodalBank}
                    onChange={(e: any) => setGatewayRoute('aepsNodalBank', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ICICI Bank Nodal">ICICI Bank Nodal (Primary Pool)</option>
                    <option value="Fino Payments Bank">Fino Payments Bank (Fast Settlement)</option>
                    <option value="Yes Bank Gateway">Yes Bank Gateway (Backup)</option>
                  </select>
                  <p className="text-[10px] text-slate-500">
                    Currently handles UIDAI PID Block & NPCI biometric reconciliation.
                  </p>
                </div>

                {/* Recharge Gateway Switch */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">
                    Telecom Multi-Recharge Gateway
                  </label>
                  <select
                    value={systemSettings.gateways.rechargeSwitch}
                    onChange={(e: any) => setGatewayRoute('rechargeSwitch', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Primary Route (API-Alpha)">Primary Route (API-Alpha)</option>
                    <option value="Failover Route (Cyrus 2.0)">Failover Route (Cyrus 2.0)</option>
                    <option value="Direct Telco Switch">Direct Telco Switch (Jio/Airtel)</option>
                  </select>
                  <p className="text-[10px] text-slate-500">
                    Auto-reroutes on operator timeouts or circle degradation.
                  </p>
                </div>

                {/* BBPS Central Switch */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">
                    Bharat BillPay (BBPS) Aggregator Rail
                  </label>
                  <select
                    value={systemSettings.gateways.bbpsSwitch}
                    onChange={(e: any) => setGatewayRoute('bbpsSwitch', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="NPCI Direct Central Unit">NPCI Direct Central Unit (Biller Direct)</option>
                    <option value="Setu BBPS Gateway">Setu BBPS Gateway (High Concurrency)</option>
                    <option value="BillDesk Aggregator">BillDesk Aggregator</option>
                  </select>
                  <p className="text-[10px] text-slate-500">
                    Manages electricity, water, gas & FASTag consumer bill fetch.
                  </p>
                </div>
              </div>
            </div>

            {/* AI Customer Care Engine Controller */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">
                    Sahayak AI Support Engine Controller (Google Gemini)
                  </h3>
                  <span className="text-[10px] font-bold bg-indigo-900/60 text-indigo-300 border border-indigo-700 px-2 py-0.5 rounded-full">
                    24x7 Active
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Controls the AI support assistant available to retailers and customers for AEPS issues, recharges & dispute tickets.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={systemSettings.aiSupportModel}
                  onChange={(e: any) =>
                    updateSystemSettings({ aiSupportModel: e.target.value })
                  }
                  className="p-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white outline-none"
                >
                  <option value="gemini-3.8-flash">Model: gemini-3.8-flash (Recommended)</option>
                  <option value="gemini-4-argon">Model: gemini-4-argon (Complex STEM)</option>
                  <option value="gemini-3.1-flash-lite">Model: gemini-3.1-flash-lite (Fast)</option>
                </select>

                <button
                  onClick={() =>
                    updateSystemSettings({ aiSupportEnabled: !systemSettings.aiSupportEnabled })
                  }
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    systemSettings.aiSupportEnabled
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  {systemSettings.aiSupportEnabled ? 'AI Active' : 'AI Disabled'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. RISK & LIMITS CONTROLLER ================= */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                Risk, Fraud Detection & Velocity Rules Controller
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure security guardrails, transaction caps, velocity limits, and auto-freeze rules for the network.
              </p>
            </div>

            {/* Security Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Biometric Velocity Fraud Shield</h4>
                    <p className="text-[11px] text-slate-400">
                      Auto-block terminal if &gt;3 consecutive fingerprint failures occur in 10 minutes.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      updateSystemSettings({
                        securityRules: {
                          ...systemSettings.securityRules,
                          fraudVelocityBlock: !systemSettings.securityRules.fraudVelocityBlock,
                        },
                      })
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      systemSettings.securityRules.fraudVelocityBlock
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {systemSettings.securityRules.fraudVelocityBlock ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Retailer Geofence / IP Binding</h4>
                    <p className="text-[11px] text-slate-400">
                      Restrict AEPS transactions strictly to agent's verified shop latitude/longitude.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      updateSystemSettings({
                        securityRules: {
                          ...systemSettings.securityRules,
                          ipLockRetailers: !systemSettings.securityRules.ipLockRetailers,
                        },
                      })
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      systemSettings.securityRules.ipLockRetailers
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {systemSettings.securityRules.ipLockRetailers ? 'ACTIVE' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>

            {/* Threshold & Transaction Caps Form */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                System Transaction Caps & Thresholds
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    Max AEPS Per Txn (₹)
                  </label>
                  <input
                    type="number"
                    value={systemSettings.limits.maxAepsPerTxn}
                    onChange={(e) =>
                      updateSystemSettings({
                        limits: {
                          ...systemSettings.limits,
                          maxAepsPerTxn: parseInt(e.target.value) || 10000,
                        },
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    Max Daily AEPS Per Retailer (₹)
                  </label>
                  <input
                    type="number"
                    value={systemSettings.limits.maxDailyAepsPerRetailer}
                    onChange={(e) =>
                      updateSystemSettings({
                        limits: {
                          ...systemSettings.limits,
                          maxDailyAepsPerRetailer: parseInt(e.target.value) || 250000,
                        },
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    Minimum Retailer Wallet Balance (₹)
                  </label>
                  <input
                    type="number"
                    value={systemSettings.limits.minWalletBalance}
                    onChange={(e) =>
                      updateSystemSettings({
                        limits: {
                          ...systemSettings.limits,
                          minWalletBalance: parseInt(e.target.value) || 500,
                        },
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    High-Value Alert Threshold (₹)
                  </label>
                  <input
                    type="number"
                    value={systemSettings.securityRules.highValueAlertThreshold}
                    onChange={(e) =>
                      updateSystemSettings({
                        securityRules: {
                          ...systemSettings.securityRules,
                          highValueAlertThreshold: parseInt(e.target.value) || 25000,
                        },
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-xs outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. IN-APP BROADCASTS & NOTIFICATIONS ================= */}
        {activeTab === 'broadcasts' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BellRing className="w-5 h-5 text-amber-400" />
                  Live In-App Flash Broadcasts & News Ticker
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Publish emergency alerts, festival bonus announcements, or bank server maintenance notices displayed across all Android & iOS user apps.
                </p>
              </div>

              <button
                onClick={() => setIsAddBroadcastOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                Dispatch New Broadcast
              </button>
            </div>

            <div className="space-y-3">
              {broadcasts.map((b) => (
                <div
                  key={b.id}
                  className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          b.type === 'OFFER'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : b.type === 'ALERT'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}
                      >
                        {b.type}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{b.createdAt}</span>
                    </div>
                    <p className="text-xs font-bold text-white">{b.message}</p>
                    {b.messageHi && (
                      <p className="text-xs text-blue-300 font-medium">{b.messageHi}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleBroadcast(b.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        b.isActive
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {b.isActive ? 'Active on App' : 'Hidden'}
                    </button>
                    <button
                      onClick={() => deleteBroadcast(b.id)}
                      className="p-1.5 rounded-lg bg-rose-950 text-rose-400 hover:bg-rose-900 transition-colors"
                      title="Delete Broadcast"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 4. RETAILER KYC & WALLET CONTROLLER ================= */}
        {activeTab === 'retailers' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Retailer Directory, KYC Approval & Wallet Controller
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage agent KYC compliance, freeze/unfreeze wallets, or execute manual balance adjustments.
                </p>
              </div>

              <button
                onClick={() => setIsAddRetailerOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                Enroll New Retailer
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by agent name, shop name, mobile or PM-Agent Code..."
                value={retailerSearch}
                onChange={(e) => setRetailerSearch(e.target.value)}
                className="w-full pl-9 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Retailer Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Agent Code</th>
                      <th className="py-3 px-4">Retailer & Shop</th>
                      <th className="py-3 px-4">City / State</th>
                      <th className="py-3 px-4">Wallet Balance</th>
                      <th className="py-3 px-4 text-center">KYC Status</th>
                      <th className="py-3 px-4 text-center">Wallet Lock</th>
                      <th className="py-3 px-4 text-right">Controller Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredRetailers.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-blue-400">{r.agentCode}</td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-white">{r.name}</p>
                          <p className="text-[11px] text-slate-400">{r.shopName}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{r.mobile}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {r.city}, {r.state}
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-400 font-mono">
                          ₹{r.walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <select
                            value={r.kycStatus}
                            onChange={(e: any) => updateRetailerStatus(r.id, e.target.value)}
                            className={`p-1 rounded-lg text-[10px] font-bold outline-none ${
                              r.kycStatus === 'VERIFIED'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : r.kycStatus === 'PENDING'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-rose-950 text-rose-300 border border-rose-800'
                            }`}
                          >
                            <option value="VERIFIED">VERIFIED</option>
                            <option value="PENDING">PENDING</option>
                            <option value="REJECTED">REJECTED</option>
                            <option value="SUSPENDED">SUSPENDED</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => toggleRetailerWalletLock(r.id)}
                            className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 mx-auto ${
                              r.isWalletLocked
                                ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                            title={r.isWalletLocked ? 'Wallet Locked' : 'Wallet Unlocked'}
                          >
                            {r.isWalletLocked ? (
                              <>
                                <Lock className="w-3.5 h-3.5" />
                                Locked
                              </>
                            ) : (
                              <>
                                <Unlock className="w-3.5 h-3.5" />
                                Active
                              </>
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedRetailer(r);
                              setIsWalletAdjustOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-[11px] font-bold transition-colors"
                          >
                            Adjust Balance
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. EXTRA LINKS & PORTALS MANAGER ================= */}
        {activeTab === 'links' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-blue-400" />
                  Admin Extra Links & Partner Services Management
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Add, edit, reorder or toggle custom external partner portals, government links (Aadhaar, PAN, DBT), biometric driver downloads, and utility websites. Changes reflect immediately in the Android/iOS app!
                </p>
              </div>

              <button
                onClick={() => handleOpenAddLinkModal()}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add New Extra Link
              </button>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Order</th>
                      <th className="py-3 px-4">Portal Title & Category</th>
                      <th className="py-3 px-4">URL / Endpoint</th>
                      <th className="py-3 px-4 text-center">Badge</th>
                      <th className="py-3 px-4 text-center">Clicks</th>
                      <th className="py-3 px-4 text-center">Visibility</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {extraLinks
                      .sort((a, b) => a.order - b.order)
                      .map((link) => (
                        <tr key={link.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-slate-400">
                            #{link.order}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-950/70 border border-blue-800 text-blue-400 flex items-center justify-center shrink-0">
                                <Globe className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-bold text-white">{link.title}</p>
                                {link.titleHi && (
                                  <p className="text-[11px] text-blue-300">{link.titleHi}</p>
                                )}
                                <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                                  {link.category}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-blue-400 max-w-xs truncate">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline flex items-center gap-1"
                            >
                              <span className="truncate">{link.url}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {link.badge ? (
                              <span className="text-[10px] font-bold bg-blue-900/50 text-blue-300 border border-blue-700/50 px-2 py-0.5 rounded-full">
                                {link.badge}
                              </span>
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-semibold text-slate-300">
                            {link.clickCount.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => toggleExtraLink(link.id)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 mx-auto transition-colors ${
                                link.isActive
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : 'bg-rose-950 text-rose-400 border border-rose-800'
                              }`}
                            >
                              {link.isActive ? (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                  Active (Visible)
                                </>
                              ) : (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                                  Hidden
                                </>
                              )}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenAddLinkModal(link)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                title="Edit Link"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete "${link.title}"?`)) {
                                    deleteExtraLink(link.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 hover:text-white transition-colors"
                                title="Delete Link"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 6. COMMISSION SLABS ================= */}
        {activeTab === 'slabs' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                Commission Slabs & Agent Margins Configuration
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure direct margins paid to shopkeepers and BC agents for AEPS withdrawals, recharge %, and BBPS bill payments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {commissionSlabs.map((slab) => (
                <div
                  key={slab.id}
                  className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs">{slab.service}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Range: ₹{slab.minAmount} - ₹{slab.maxAmount}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full uppercase">
                      {slab.commissionType}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                    <div className="flex-1">
                      <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                        Retailer Margin {slab.commissionType === 'flat' ? '(₹ Flat)' : '(%)'}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={slab.retailerCommission}
                        onChange={(e) =>
                          updateCommissionSlab(slab.id, {
                            retailerCommission: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="text-right self-end pb-1">
                      <span className="text-xs text-emerald-400 font-bold bg-emerald-950 px-2 py-1 rounded border border-emerald-800">
                        {slab.commissionType === 'flat'
                          ? `+₹${slab.retailerCommission.toFixed(2)}`
                          : `+${slab.retailerCommission}%`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 7. LIVE AUDIT FEED ================= */}
        {activeTab === 'transactions' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Live Transactions Audit Trail
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Real-time monitor of AEPS withdrawals, mobile recharges, and bill payments across the network.
              </p>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Txn ID</th>
                      <th className="py-3 px-4">Type & Details</th>
                      <th className="py-3 px-4">Ref Number / RRN</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Commission</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-blue-400">{tx.id}</td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-white">{tx.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {tx.details.operatorOrBank ||
                              tx.details.billerName ||
                              tx.details.productName}
                          </p>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                          {tx.refNumber}
                        </td>
                        <td className="py-3 px-4 font-extrabold text-white">
                          ₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4 text-emerald-400 font-bold">
                          +₹{tx.commission.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-slate-400 font-mono">
                          {tx.date} • {tx.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 8. SYSTEM DIAGNOSTICS & LOGS ================= */}
        {activeTab === 'logs' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-400" />
                  Live System Diagnostics & Gateway Event Stream
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Real-time events from AEPS central switch, Webhook callbacks, and Sahayak AI routing.
                </p>
              </div>

              <button
                onClick={clearSystemLogs}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                Clear Stream
              </button>
            </div>

            {/* Module Filter */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none text-xs">
              {['ALL', 'AEPS', 'WALLET', 'GATEWAY', 'AUTH', 'AI_BOT'].map((m) => (
                <button
                  key={m}
                  onClick={() => setLogModuleFilter(m)}
                  className={`px-3 py-1 rounded-full font-bold transition-all ${
                    logModuleFilter === m
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Terminal Window */}
            <div className="bg-black p-4 rounded-2xl border border-slate-800 font-mono text-xs space-y-2 max-h-[500px] overflow-y-auto shadow-2xl">
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2.5 leading-relaxed">
                  <span className="text-slate-500 shrink-0">{log.timestamp}</span>
                  <span
                    className={`px-1.5 rounded text-[10px] font-bold shrink-0 ${
                      log.level === 'SECURITY'
                        ? 'bg-rose-950 text-rose-300'
                        : log.level === 'WARN'
                        ? 'bg-amber-950 text-amber-300'
                        : 'bg-emerald-950 text-emerald-300'
                    }`}
                  >
                    [{log.level}]
                  </span>
                  <span className="text-blue-400 font-bold shrink-0">[{log.module}]</span>
                  <span className="text-slate-200">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 10. PHONEPE & MERCHANT PAYMENT GATEWAY CONTROLLER ================= */}
        {activeTab === 'merchant_pg' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Top PG Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
                <span className="text-xs text-slate-400 font-semibold uppercase block">
                  Today's Inward QR Volume
                </span>
                <div className="text-2xl font-extrabold text-white mt-1">₹48,92,400</div>
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +24.6% PhonePe & Paytm Volume
                </span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
                <span className="text-xs text-slate-400 font-semibold uppercase block">
                  Active Store QR Standees
                </span>
                <div className="text-2xl font-extrabold text-blue-400 mt-1">1,280 Merchants</div>
                <span className="text-[11px] text-slate-400 font-medium block mt-1">
                  Delhi, UP, Bihar, WB, MH clusters
                </span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
                <span className="text-xs text-slate-400 font-semibold uppercase block">
                  4G Soundbox Fleet
                </span>
                <div className="text-2xl font-extrabold text-purple-400 mt-1">
                  {soundboxDevices.length} Deployed
                </div>
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  All 4G SIMs Live & Speaking
                </span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
                <span className="text-xs text-slate-400 font-semibold uppercase block">
                  T+0 Settlements Cleared
                </span>
                <div className="text-2xl font-extrabold text-emerald-400 mt-1">₹39,18,500</div>
                <span className="text-[11px] text-blue-300 font-medium block mt-1">
                  10-sec IMPS Bank Sweep
                </span>
              </div>
            </div>

            {/* Merchant Gateway Rails & Primary Router */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-purple-400" />
                    Payment Gateway Merchant Rails Switchboard
                  </h3>
                  <p className="text-xs text-slate-400">
                    Control active acquirer rails and primary merchant QR branding for the retailer network
                  </p>
                </div>
                <span className="text-xs font-bold bg-purple-900/60 text-purple-200 border border-purple-700/60 px-3 py-1 rounded-full">
                  Primary Rail: {merchantSettings.primaryGateway}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    id: 'PHONEPE',
                    name: 'PhonePe for Business',
                    desc: 'Primary UPI QR & SmartSpeaker Rail',
                    color: 'border-purple-600/40 bg-purple-950/20 text-purple-400',
                    share: '54% Share',
                  },
                  {
                    id: 'PAYTM',
                    name: 'Paytm Business Gateway',
                    desc: 'All-in-One QR & Soundbox 4G',
                    color: 'border-sky-600/40 bg-sky-950/20 text-sky-400',
                    share: '28% Share',
                  },
                  {
                    id: 'GPAY',
                    name: 'Google Pay for Business',
                    desc: 'GPay Business UPI Engine',
                    color: 'border-emerald-600/40 bg-emerald-950/20 text-emerald-400',
                    share: '14% Share',
                  },
                  {
                    id: 'BHARATPE',
                    name: 'BharatPe Club Rail',
                    desc: 'Zero MDR Smart QR Terminal',
                    color: 'border-teal-600/40 bg-teal-950/20 text-teal-400',
                    share: '4% Share',
                  },
                ].map((rail) => {
                  const isPrimary = merchantSettings.primaryGateway === rail.id;
                  return (
                    <div
                      key={rail.id}
                      className={`p-3.5 rounded-xl border ${rail.color} space-y-2 flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white">{rail.name}</span>
                          <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-1.5 py-0.2 rounded">
                            {rail.share}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{rail.desc}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Live 99.9%
                        </span>
                        <button
                          onClick={() => updateMerchantSettings({ primaryGateway: rail.id as any })}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                            isPrimary
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          {isPrimary ? 'Default Standee' : 'Set as Default'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Deployed Soundbox Fleet Controller */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-purple-400" />
                    Deployed Soundbox Fleet Management
                  </h3>
                  <p className="text-xs text-slate-400">
                    Manage 4G SIM voice boxes dispatched to merchants and audio language routing
                  </p>
                </div>
                <button
                  onClick={() => alert('New Soundbox dispatch order submitted to logistics desk.')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Dispatch New Soundbox</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Device Serial</th>
                      <th className="p-3">Brand Rail</th>
                      <th className="p-3">Assigned Merchant</th>
                      <th className="p-3">SIM & Network</th>
                      <th className="p-3">Battery</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {soundboxDevices.map((box) => (
                      <tr key={box.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-mono font-bold text-white">{box.serialNumber}</td>
                        <td className="p-3 font-semibold text-purple-300">{box.brand}</td>
                        <td className="p-3 text-slate-200 font-medium">{box.assignedMerchantName}</td>
                        <td className="p-3">
                          <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-blue-300 font-semibold">
                            {box.simCarrier}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5 font-bold">
                            <span className={box.batteryLevel > 20 ? 'text-emerald-400' : 'text-rose-400'}>
                              {box.batteryLevel}%
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              box.status === 'ONLINE'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-rose-950 text-rose-300 border border-rose-800'
                            }`}
                          >
                            {box.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => toggleSoundboxDevice(box.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
                          >
                            {box.status === 'ONLINE' ? 'Simulate Offline' : 'Mark Online'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 9. MASTER DISTRIBUTOR, DISTRIBUTOR & RETAILER CONTROLLER ================= */}
        {activeTab === 'hierarchy' && <HierarchyChannelController />}
      </main>

      {/* Add / Edit Extra Link Modal */}
      {isAddLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-950 rounded-2xl shadow-2xl p-6 border border-slate-800 space-y-4 text-xs text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Link2 className="w-4 h-4 text-blue-400" />
                {editingLink ? 'Edit Extra Link' : 'Add New Extra Portal / Link'}
              </h3>
              <button
                onClick={() => setIsAddLinkModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLink} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Title (English)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Govt DBT Portal"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Title (Hindi - Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. सरकारी डीबीटी पोर्टल"
                    value={linkTitleHi}
                    onChange={(e) => setLinkTitleHi(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Target URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-blue-400 font-mono font-semibold focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <select
                    value={linkCategory}
                    onChange={(e: any) => setLinkCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold outline-none"
                  >
                    <option value="Govt">Govt</option>
                    <option value="Banking">Banking</option>
                    <option value="KYC/Verify">KYC/Verify</option>
                    <option value="Drivers">Drivers</option>
                    <option value="Utility">Utility</option>
                    <option value="Partner">Partner</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Popular, Govt"
                    value={linkBadge}
                    onChange={(e) => setLinkBadge(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Display Order</label>
                  <input
                    type="number"
                    value={linkOrder}
                    onChange={(e) => setLinkOrder(parseInt(e.target.value) || 1)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief description for agents..."
                  value={linkDescription}
                  onChange={(e) => setLinkDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddLinkModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-md"
                >
                  {editingLink ? 'Update Link' : 'Save & Publish to App'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dispatch Broadcast Modal */}
      {isAddBroadcastOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-950 rounded-2xl shadow-2xl p-6 border border-slate-800 space-y-4 text-xs text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <BellRing className="w-4 h-4 text-amber-400" />
                Dispatch In-App Flash Broadcast
              </h3>
              <button
                onClick={() => setIsAddBroadcastOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBroadcast} className="space-y-3.5">
              <div>
                <label className="font-semibold block mb-1">Severity / Notification Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['INFO', 'OFFER', 'ALERT', 'WARNING'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setBcType(t)}
                      className={`py-1.5 rounded-lg font-bold text-center text-xs border ${
                        bcType === t
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Message (English)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Festival Offer: Extra ₹2 commission on all AEPS withdrawals!"
                  value={bcMessage}
                  onChange={(e) => setBcMessage(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Message (Hindi - Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. त्योहार ऑफर: सभी AEPS निकासी पर पाएं ₹2 अतिरिक्त कमीशन!"
                  value={bcMessageHi}
                  onChange={(e) => setBcMessageHi(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddBroadcastOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-colors shadow-md"
                >
                  Dispatch to All Retailers
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Retailer Wallet Adjust Modal */}
      {isWalletAdjustOpen && selectedRetailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm bg-slate-950 rounded-2xl shadow-2xl p-6 border border-slate-800 space-y-4 text-xs text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-white">Manual Balance Adjustment</h3>
                <p className="text-[11px] text-slate-400">
                  Agent: {selectedRetailer.name} ({selectedRetailer.agentCode})
                </p>
              </div>
              <button
                onClick={() => setIsWalletAdjustOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyWalletAdjustment} className="space-y-3.5">
              <div>
                <label className="font-semibold block mb-1">Adjustment Action</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('credit')}
                    className={`py-2 rounded-xl font-bold text-xs border ${
                      adjustType === 'credit'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    + Credit Amount
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('debit')}
                    className={`py-2 rounded-xl font-bold text-xs border ${
                      adjustType === 'debit'
                        ? 'bg-rose-600 text-white border-rose-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    - Debit / Penalty
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-base outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Reason / Audit Remark</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsWalletAdjustOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-md"
                >
                  Confirm & Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enroll New Retailer Modal */}
      {isAddRetailerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-950 rounded-2xl shadow-2xl p-6 border border-slate-800 space-y-4 text-xs text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                Enroll New BC Retailer / Merchant
              </h3>
              <button
                onClick={() => setIsAddRetailerOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEnrollRetailer} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Retailer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Verma"
                    value={newRetName}
                    onChange={(e) => setNewRetName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Shop / Outlet Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Verma Digital Point"
                    value={newRetShop}
                    onChange={(e) => setNewRetShop(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile"
                    value={newRetMobile}
                    onChange={(e) => setNewRetMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="agent@email.com"
                    value={newRetEmail}
                    onChange={(e) => setNewRetEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Varanasi"
                    value={newRetCity}
                    onChange={(e) => setNewRetCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">State</label>
                  <input
                    type="text"
                    placeholder="e.g. Uttar Pradesh"
                    value={newRetState}
                    onChange={(e) => setNewRetState(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddRetailerOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-md"
                >
                  Enroll Retailer & Issue BC Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
