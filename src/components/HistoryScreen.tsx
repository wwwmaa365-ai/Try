import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Transaction } from '../types';
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Ticket,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const HistoryScreen: React.FC = () => {
  const { transactions, setSelectedReceipt, tickets, language } = useApp();
  const [activeView, setActiveView] = useState<'passbook' | 'tickets'>('passbook');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTx = transactions.filter((tx) => {
    const matchType = filterType === 'ALL' || tx.type === filterType;
    const matchSearch =
      searchQuery === '' ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.refNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.details.mobileOrAcc && tx.details.mobileOrAcc.includes(searchQuery));
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-150">
      {/* View Switcher: Passbook vs Tickets */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex gap-1">
        <button
          onClick={() => setActiveView('passbook')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeView === 'passbook'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          {language === 'hi' ? 'ट्रांजैक्शन पासबुक' : 'Passbook & History'}
        </button>
        <button
          onClick={() => setActiveView('tickets')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeView === 'tickets'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Ticket className="w-4 h-4" />
          {language === 'hi' ? 'शिकायत एवं टिकट्स' : 'Support Tickets'} ({tickets.length})
        </button>
      </div>

      {activeView === 'passbook' ? (
        <div className="space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Txn ID, RRN, mobile, bank..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
          </div>

          {/* Type Filters */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'AEPS_CASH', label: 'AEPS Cash' },
              { id: 'RECHARGE', label: 'Recharge' },
              { id: 'BBPS_BILL', label: 'BBPS Bill' },
              { id: 'DMT_TRANSFER', label: 'DMT Transfer' },
              { id: 'LOAN_LEAD', label: 'Loans & Cards' },
              { id: 'WALLET_TOPUP', label: 'Wallet Top-up' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                  filterType === f.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Transactions List */}
          <div className="space-y-2">
            {filteredTx.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
                No transactions found for current filter.
              </div>
            ) : (
              filteredTx.map((tx) => {
                const isCredit = tx.type === 'AEPS_CASH' || tx.type === 'WALLET_TOPUP' || tx.type === 'LOAN_LEAD';
                return (
                  <div
                    key={tx.id}
                    onClick={() => setSelectedReceipt(tx)}
                    className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isCredit
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {isCredit ? (
                          <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-blue-600" />
                        )}
                      </div>

                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                            {tx.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {tx.id}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                          {tx.date} • {tx.time} • Ref: {tx.refNumber}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-extrabold text-slate-900">
                        {isCredit ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                      {tx.commission > 0 && (
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                          Comm: +₹{tx.commission.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Tickets View */
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl text-xs text-blue-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              NPCI & Banking Priority Support SLA: 2 to 4 Hours
            </span>
          </div>

          <div className="space-y-2.5">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900">{t.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                      {t.category}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : t.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-800">{t.subject}</p>
                {t.transactionRef && (
                  <p className="text-[11px] text-slate-500 font-mono">Linked Txn: {t.transactionRef}</p>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Created: {t.createdAt}</span>
                  <span className="text-slate-600 font-medium">Updated: {t.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
