import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MasterDistributor, Distributor, RetailerUser, TierCommissionSplit } from '../types';
import {
  Users,
  Network,
  Share2,
  DollarSign,
  Plus,
  Edit,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Building,
  Smartphone,
  ChevronRight,
  TrendingUp,
  Boxes,
  Layers,
  ArrowLeftRight,
  Search,
  Wallet,
  Building2,
} from 'lucide-react';

export const HierarchyChannelController: React.FC = () => {
  const {
    masterDistributors,
    addMasterDistributor,
    updateMasterDistributor,
    adjustMasterDistributorWallet,
    distributors,
    addDistributor,
    updateDistributor,
    adjustDistributorWallet,
    retailers,
    updateRetailerStatus,
    toggleRetailerWalletLock,
    adjustRetailerWallet,
    reassignRetailer,
    tierSplits,
    updateTierSplit,
  } = useApp();

  const [channelView, setChannelView] = useState<'md' | 'distributor' | 'retailer' | 'splits'>('md');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddMdOpen, setIsAddMdOpen] = useState(false);
  const [isAddDisOpen, setIsAddDisOpen] = useState(false);
  const [isReassignOpen, setIsReassignOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // Selected entities for actions
  const [selectedMd, setSelectedMd] = useState<MasterDistributor | null>(null);
  const [selectedDis, setSelectedDis] = useState<Distributor | null>(null);
  const [selectedRet, setSelectedRet] = useState<RetailerUser | null>(null);
  const [targetDistributorId, setTargetDistributorId] = useState('');

  // Wallet adjustment state
  const [walletTargetType, setWalletTargetType] = useState<'MD' | 'DIS' | 'RET'>('MD');
  const [walletAdjustAmt, setWalletAdjustAmt] = useState('10000');
  const [walletAdjustAction, setWalletAdjustAction] = useState<'credit' | 'debit'>('credit');
  const [walletAdjustReason, setWalletAdjustReason] = useState('Channel Working Capital Top-up');

  // Form states for New MD
  const [newMdName, setNewMdName] = useState('');
  const [newMdCompany, setNewMdCompany] = useState('');
  const [newMdMobile, setNewMdMobile] = useState('');
  const [newMdEmail, setNewMdEmail] = useState('');
  const [newMdState, setNewMdState] = useState('Rajasthan');
  const [newMdDisQuota, setNewMdDisQuota] = useState(20);
  const [newMdRetQuota, setNewMdRetQuota] = useState(500);

  // Form states for New Distributor
  const [newDisName, setNewDisName] = useState('');
  const [newDisAgency, setNewDisAgency] = useState('');
  const [newDisMobile, setNewDisMobile] = useState('');
  const [newDisEmail, setNewDisEmail] = useState('');
  const [newDisParentMdId, setNewDisParentMdId] = useState(masterDistributors[0]?.id || '');
  const [newDisDistrict, setNewDisDistrict] = useState('Jaipur');
  const [newDisState, setNewDisState] = useState('Rajasthan');
  const [newDisRetQuota, setNewDisRetQuota] = useState(50);

  // Filtered queries
  const filteredMds = masterDistributors.filter(
    (m) =>
      searchQuery === '' ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDistributors = distributors.filter(
    (d) =>
      searchQuery === '' ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.masterDistributorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRetailers = retailers.filter(
    (r) =>
      searchQuery === '' ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.agentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.distributorName && r.distributorName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEnrollMd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMdName || !newMdMobile) return;
    addMasterDistributor({
      name: newMdName,
      companyName: newMdCompany || `${newMdName} Multi-Services`,
      mobile: newMdMobile,
      email: newMdEmail || `${newMdMobile}@paymitra.md`,
      state: newMdState,
      status: 'ACTIVE',
      distributorIdQuota: newMdDisQuota,
      retailerIdQuota: newMdRetQuota,
      microAtmsAssigned: 20,
    });
    setNewMdName('');
    setNewMdCompany('');
    setNewMdMobile('');
    setNewMdEmail('');
    setIsAddMdOpen(false);
  };

  const handleEnrollDistributor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDisName || !newDisMobile) return;
    const parentMd = masterDistributors.find((m) => m.id === newDisParentMdId) || masterDistributors[0];
    addDistributor({
      name: newDisName,
      agencyName: newDisAgency || `${newDisName} Agency`,
      mobile: newDisMobile,
      email: newDisEmail || `${newDisMobile}@paymitra.dist`,
      masterDistributorId: parentMd.id,
      masterDistributorName: parentMd.companyName,
      state: newDisState,
      district: newDisDistrict,
      status: 'ACTIVE',
      retailerIdQuota: newDisRetQuota,
      microAtmsInStock: 5,
    });
    setNewDisName('');
    setNewDisAgency('');
    setNewDisMobile('');
    setNewDisEmail('');
    setIsAddDisOpen(false);
  };

  const handleApplyWalletAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(walletAdjustAmt);
    if (!amt || amt <= 0) return;

    if (walletTargetType === 'MD' && selectedMd) {
      adjustMasterDistributorWallet(selectedMd.id, amt, walletAdjustAction, walletAdjustReason);
    } else if (walletTargetType === 'DIS' && selectedDis) {
      adjustDistributorWallet(selectedDis.id, amt, walletAdjustAction, walletAdjustReason);
    } else if (walletTargetType === 'RET' && selectedRet) {
      adjustRetailerWallet(selectedRet.id, amt, walletAdjustAction, walletAdjustReason);
    }
    setIsWalletModalOpen(false);
  };

  const handleConfirmReassign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRet || !targetDistributorId) return;
    reassignRetailer(selectedRet.id, targetDistributorId);
    setIsReassignOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner Summary */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">
              Multi-Tier Channel Hierarchy & Commission Controller
            </h2>
            <span className="text-[10px] font-bold bg-blue-900/60 text-blue-300 border border-blue-700 px-2.5 py-0.5 rounded-full">
              MD → Distributor → Retailer
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Control the 3-tier distributor hierarchy across India. Manage ID quotas, override commission splits, downline fund settlements, and retailer-to-distributor mapping.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAddMdOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Enroll Master Distributor
          </button>
          <button
            onClick={() => setIsAddDisOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Enroll Distributor
          </button>
        </div>
      </div>

      {/* KPI Cards across the Hierarchy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Master Distributors (MD)</span>
            <div className="text-2xl font-extrabold text-purple-400 mt-1">
              {masterDistributors.length} State Heads
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Pool: ₹5,23,000 Liquidity</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Distributors (Dist)</span>
            <div className="text-2xl font-extrabold text-blue-400 mt-1">
              {distributors.length} District Agencies
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Stock: 29 Micro-ATMs</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-950/60 text-blue-400 border border-blue-800 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Retailers (Dukandar)</span>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">
              {retailers.length} Active BCs
            </div>
            <p className="text-[11px] text-emerald-400 mt-0.5">100% KYC Verified</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Channel Override Distributed</span>
            <div className="text-2xl font-extrabold text-amber-400 mt-1">
              ₹2,84,200.00
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Auto Multi-tier Split</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Sub Navigation Pills for Hierarchy Views */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-2 rounded-2xl border border-slate-800">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none text-xs">
          {[
            { id: 'md', label: '1. Master Distributors (MD)', count: masterDistributors.length },
            { id: 'distributor', label: '2. Distributors (D)', count: distributors.length },
            { id: 'retailer', label: '3. Retailers & Mapping', count: retailers.length },
            { id: 'splits', label: '4. Commission Split Engine', count: tierSplits.length },
          ].map((tab) => {
            const isSel = channelView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setChannelView(tab.id as any)}
                className={`py-2 px-3.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
                  isSel
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSel ? 'bg-blue-900 text-blue-200' : 'bg-slate-800 text-slate-400'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {channelView !== 'splits' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search code, name, state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 p-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* ================= SUB-TAB 1: MASTER DISTRIBUTORS ================= */}
      {channelView === 'md' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl animate-in fade-in">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-400" />
              Master Distributor Directory & ID Quota Allocation
            </h3>
            <span className="text-[11px] text-slate-400">
              State-level Super Partners managing Regional Networks
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">MD Code</th>
                  <th className="py-3 px-4">Entity & Contact</th>
                  <th className="py-3 px-4">Territory</th>
                  <th className="py-3 px-4">Wallet Balance</th>
                  <th className="py-3 px-4 text-center">Downline Network</th>
                  <th className="py-3 px-4 text-center">ID Quota Left</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Controller Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredMds.map((md) => (
                  <tr key={md.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-purple-400">{md.code}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{md.companyName}</p>
                      <p className="text-[11px] text-slate-400">{md.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{md.mobile}</p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-300">{md.state}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      ₹{md.walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-xs font-bold text-blue-400">{md.totalDistributors} Ds</span>
                      <span className="text-slate-500 mx-1">•</span>
                      <span className="text-xs font-bold text-emerald-400">{md.totalRetailers} Rs</span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className="text-blue-300 font-bold">{md.distributorIdQuota} D</span> /{' '}
                      <span className="text-emerald-300 font-bold">{md.retailerIdQuota} R</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          md.status === 'ACTIVE'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {md.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedMd(md);
                          setWalletTargetType('MD');
                          setIsWalletModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 text-[11px] font-bold transition-colors"
                      >
                        Fund Transfer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 2: DISTRIBUTORS ================= */}
      {channelView === 'distributor' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl animate-in fade-in">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <Share2 className="w-4 h-4 text-blue-400" />
              Distributor Management & Downline Monitoring
            </h3>
            <span className="text-[11px] text-slate-400">
              District Distributors responsible for Retailer Onboarding & Micro-ATM distribution
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Dist. Code</th>
                  <th className="py-3 px-4">Agency & Owner</th>
                  <th className="py-3 px-4">Parent Master Dist. (MD)</th>
                  <th className="py-3 px-4">District / State</th>
                  <th className="py-3 px-4">Wallet Balance</th>
                  <th className="py-3 px-4 text-center">Retailers</th>
                  <th className="py-3 px-4 text-center">Micro-ATMs</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredDistributors.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400">{d.code}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{d.agencyName}</p>
                      <p className="text-[11px] text-slate-400">{d.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{d.mobile}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-purple-300 text-xs">{d.masterDistributorName}</p>
                      <span className="text-[10px] text-slate-500 font-mono">{d.masterDistributorId}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-200 font-medium">{d.district}</span>,{' '}
                      <span className="text-slate-400">{d.state}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      ₹{d.walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-400">
                      {d.totalRetailers} BCs
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-300">
                      {d.microAtmsInStock} in Stock
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          d.status === 'ACTIVE'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedDis(d);
                          setWalletTargetType('DIS');
                          setIsWalletModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-[11px] font-bold transition-colors"
                      >
                        Fund Transfer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 3: RETAILERS & MAPPING ================= */}
      {channelView === 'retailer' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl animate-in fade-in">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              Retailer Mapping & Distributor Re-assignment Engine
            </h3>
            <span className="text-[11px] text-slate-400">
              Shift retailers between distributors with zero transaction loss
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Agent Code</th>
                  <th className="py-3 px-4">Retailer & Outlet</th>
                  <th className="py-3 px-4">Assigned Distributor (D)</th>
                  <th className="py-3 px-4">Parent Master Dist. (MD)</th>
                  <th className="py-3 px-4">Wallet Balance</th>
                  <th className="py-3 px-4 text-center">KYC / Lock</th>
                  <th className="py-3 px-4 text-right">Mapping Controller</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredRetailers.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400">{r.agentCode}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{r.name}</p>
                      <p className="text-[11px] text-slate-400">{r.shopName}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{r.city}, {r.state}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-blue-300">{r.distributorName || 'Direct Unassigned'}</p>
                      <span className="text-[10px] text-slate-500 font-mono">{r.distributorId}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-purple-300 text-xs">{r.masterDistributorName || 'Corporate Nodal'}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      ₹{r.walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {r.kycStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedRet(r);
                          setTargetDistributorId(r.distributorId || distributors[0]?.id || '');
                          setIsReassignOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-[11px] font-bold transition-colors flex items-center gap-1 ml-auto"
                      >
                        <ArrowLeftRight className="w-3 h-3" />
                        Reassign D
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 4: MULTI-TIER COMMISSION SPLITS ================= */}
      {channelView === 'splits' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Multi-Tier Commission Sharing Matrix (4-Way Split)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Every transaction automatically splits real-time margin between Retailer (R), Distributor (D), Master Distributor (MD), and Admin Platform.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-xl border border-emerald-800">
              100% Instant Split Engine
            </span>
          </div>

          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Fintech Service</th>
                    <th className="py-3 px-4">Volume / Slab Range</th>
                    <th className="py-3 px-4 text-emerald-400">Retailer Share (दुकानदार)</th>
                    <th className="py-3 px-4 text-blue-400">Distributor Share (डिस्ट्रीब्यूटर)</th>
                    <th className="py-3 px-4 text-purple-400">Master Dist. Share (MD)</th>
                    <th className="py-3 px-4 text-amber-400">Admin Platform Net</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {tierSplits.map((split) => (
                    <tr key={split.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">{split.service}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">{split.slabRange}</td>
                      <td className="py-3.5 px-4 font-extrabold text-emerald-400 bg-emerald-950/20">
                        {split.retailerShare}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-blue-400 bg-blue-950/20">
                        {split.distributorShare}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-purple-400 bg-purple-950/20">
                        {split.masterDistributorShare}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-amber-400 bg-amber-950/20">
                        {split.adminPlatformMargin}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 1: ENROLL MASTER DISTRIBUTOR ================= */}
      {isAddMdOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-950 rounded-2xl shadow-2xl p-6 border border-slate-800 space-y-4 text-xs text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-400" />
                Enroll New Master Distributor (State Head)
              </h3>
              <button onClick={() => setIsAddMdOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleEnrollMd} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Owner Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Agrawal"
                    value={newMdName}
                    onChange={(e) => setNewMdName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Company / Entity Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Agrawal Telecom"
                    value={newMdCompany}
                    onChange={(e) => setNewMdCompany(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Mobile</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile"
                    value={newMdMobile}
                    onChange={(e) => setNewMdMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">State Jurisdiction</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajasthan"
                    value={newMdState}
                    onChange={(e) => setNewMdState(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Distributor Quota (IDs)</label>
                  <input
                    type="number"
                    value={newMdDisQuota}
                    onChange={(e) => setNewMdDisQuota(parseInt(e.target.value) || 20)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Retailer Quota (IDs)</label>
                  <input
                    type="number"
                    value={newMdRetQuota}
                    onChange={(e) => setNewMdRetQuota(parseInt(e.target.value) || 500)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddMdOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors shadow-md"
                >
                  Enroll Master Distributor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: ENROLL DISTRIBUTOR ================= */}
      {isAddDisOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-950 rounded-2xl shadow-2xl p-6 border border-slate-800 space-y-4 text-xs text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-blue-400" />
                Enroll New Distributor (Agency Partner)
              </h3>
              <button onClick={() => setIsAddDisOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleEnrollDistributor} className="space-y-3">
              <div>
                <label className="font-semibold block mb-1">Parent Master Distributor (MD)</label>
                <select
                  value={newDisParentMdId}
                  onChange={(e) => setNewDisParentMdId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-purple-300 font-bold outline-none"
                >
                  {masterDistributors.map((md) => (
                    <option key={md.id} value={md.id}>
                      {md.companyName} ({md.code}) - {md.state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Distributor Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alok Pandey"
                    value={newDisName}
                    onChange={(e) => setNewDisName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Agency Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Pandey Agency"
                    value={newDisAgency}
                    onChange={(e) => setNewDisAgency(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Mobile</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile"
                    value={newDisMobile}
                    onChange={(e) => setNewDisMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">District</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lucknow"
                    value={newDisDistrict}
                    onChange={(e) => setNewDisDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Retailer Quota Limit</label>
                <input
                  type="number"
                  value={newDisRetQuota}
                  onChange={(e) => setNewDisRetQuota(parseInt(e.target.value) || 50)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddDisOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-md"
                >
                  Enroll Distributor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: REASSIGN RETAILER ================= */}
      {isReassignOpen && selectedRet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm bg-slate-950 rounded-2xl shadow-2xl p-6 border border-slate-800 space-y-4 text-xs text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-white">Reassign Retailer to Distributor</h3>
                <p className="text-[11px] text-slate-400">{selectedRet.name} ({selectedRet.agentCode})</p>
              </div>
              <button onClick={() => setIsReassignOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleConfirmReassign} className="space-y-3.5">
              <div>
                <label className="font-semibold block mb-1">Select New Target Distributor</label>
                <select
                  value={targetDistributorId}
                  onChange={(e) => setTargetDistributorId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-blue-300 font-bold outline-none"
                >
                  {distributors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.agencyName} ({d.code}) - {d.district}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p>Retailer's transactions and commissions will seamlessly route to the new Distributor and parent MD.</p>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReassignOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors shadow-md"
                >
                  Confirm Reassignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: HIERARCHY WALLET FUND TRANSFER ================= */}
      {isWalletModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm bg-slate-950 rounded-2xl shadow-2xl p-6 border border-slate-800 space-y-4 text-xs text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-white">
                  {walletTargetType === 'MD' ? 'Master Distributor Fund Top-up' : 'Distributor Fund Top-up'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {walletTargetType === 'MD'
                    ? selectedMd?.companyName
                    : selectedDis?.agencyName}
                </p>
              </div>
              <button onClick={() => setIsWalletModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleApplyWalletAdjustment} className="space-y-3.5">
              <div>
                <label className="font-semibold block mb-1">Fund Action</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWalletAdjustAction('credit')}
                    className={`py-2 rounded-xl font-bold text-xs border ${
                      walletAdjustAction === 'credit'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    + Credit Funds
                  </button>
                  <button
                    type="button"
                    onClick={() => setWalletAdjustAction('debit')}
                    className={`py-2 rounded-xl font-bold text-xs border ${
                      walletAdjustAction === 'debit'
                        ? 'bg-rose-600 text-white border-rose-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    - Debit / Settlement
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Transfer Amount (₹)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={walletAdjustAmt}
                  onChange={(e) => setWalletAdjustAmt(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold text-base outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Audit Remark</label>
                <input
                  type="text"
                  required
                  value={walletAdjustReason}
                  onChange={(e) => setWalletAdjustReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsWalletModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-md"
                >
                  Execute Fund Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
