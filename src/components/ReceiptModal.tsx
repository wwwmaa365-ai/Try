import React from 'react';
import { Transaction } from '../types';
import { CheckCircle2, XCircle, Clock, Download, Printer, Share2, X, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  shopName: string;
  retailerName: string;
  agentCode: string;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  onClose,
  shopName,
  retailerName,
  agentCode,
}) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `PayMitra Receipt - ${transaction.id}`,
        text: `Transaction Receipt for ${transaction.title} of ₹${transaction.amount}. Ref: ${transaction.refNumber}`,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`PayMitra Receipt: ${transaction.title} of ₹${transaction.amount}. Ref: ${transaction.refNumber}`);
      alert('Receipt link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-tight text-blue-400">Pay<span className="text-white">Mitra</span></span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">DigiSlip</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Body - Thermal Paper Styling */}
        <div className="p-6 overflow-y-auto space-y-5 bg-gradient-to-b from-white to-slate-50 text-slate-800 text-sm">
          {/* Status Icon */}
          <div className="flex flex-col items-center text-center">
            {transaction.status === 'SUCCESS' && (
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2 ring-8 ring-emerald-50">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            )}
            {transaction.status === 'PENDING' && (
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-2 ring-8 ring-amber-50">
                <Clock className="w-8 h-8" />
              </div>
            )}
            {transaction.status === 'FAILED' && (
              <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-2 ring-8 ring-rose-50">
                <XCircle className="w-8 h-8" />
              </div>
            )}

            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {transaction.status === 'SUCCESS' ? 'Transaction Successful' : transaction.status}
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              ₹{transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">{transaction.title}</p>
          </div>

          {/* Shop & Agent Info */}
          <div className="p-3 rounded-xl bg-slate-100/80 border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-slate-900">{shopName}</p>
              <p className="text-slate-500">Agent: {retailerName} ({agentCode})</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified BC
            </div>
          </div>

          {/* Key Details Table */}
          <div className="border-t border-b border-dashed border-slate-300 py-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Transaction ID</span>
              <span className="font-mono font-bold text-slate-800">{transaction.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Reference / RRN</span>
              <span className="font-mono font-semibold text-slate-800">{transaction.refNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date & Time</span>
              <span className="text-slate-800">{transaction.date} • {transaction.time}</span>
            </div>
            {transaction.details.operatorOrBank && (
              <div className="flex justify-between">
                <span className="text-slate-500">Bank / Operator</span>
                <span className="font-medium text-slate-800">{transaction.details.operatorOrBank}</span>
              </div>
            )}
            {transaction.details.mobileOrAcc && (
              <div className="flex justify-between">
                <span className="text-slate-500">Account / Mobile</span>
                <span className="font-mono font-medium text-slate-800">{transaction.details.mobileOrAcc}</span>
              </div>
            )}
            {transaction.details.aadhaarMasked && (
              <div className="flex justify-between">
                <span className="text-slate-500">Aadhaar (Masked)</span>
                <span className="font-mono font-medium text-slate-800">{transaction.details.aadhaarMasked}</span>
              </div>
            )}
            {transaction.details.customerName && (
              <div className="flex justify-between">
                <span className="text-slate-500">Customer Name</span>
                <span className="font-medium text-slate-800">{transaction.details.customerName}</span>
              </div>
            )}
            {transaction.details.utrNumber && (
              <div className="flex justify-between">
                <span className="text-slate-500">Bank UTR</span>
                <span className="font-mono font-semibold text-slate-800">{transaction.details.utrNumber}</span>
              </div>
            )}
            {transaction.details.billerName && (
              <div className="flex justify-between">
                <span className="text-slate-500">Biller</span>
                <span className="font-medium text-slate-800">{transaction.details.billerName}</span>
              </div>
            )}
            {transaction.commission > 0 && (
              <div className="flex justify-between text-emerald-700 bg-emerald-50/70 p-1.5 rounded font-semibold">
                <span>Retailer Commission Earned</span>
                <span>+ ₹{transaction.commission.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* QR Code & Security Stamp */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="w-14 h-14 bg-slate-900 rounded-lg p-1.5 flex flex-col justify-between items-center text-[7px] text-white">
                <div className="grid grid-cols-3 gap-0.5 w-full h-8 bg-white p-0.5 rounded">
                  <div className="bg-black"></div><div className="bg-black"></div><div className="bg-white"></div>
                  <div className="bg-black"></div><div className="bg-white"></div><div className="bg-black"></div>
                  <div className="bg-black"></div><div className="bg-black"></div><div className="bg-black"></div>
                </div>
                <span className="tracking-tighter">VERIFIED NPCI</span>
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                <p className="font-semibold text-slate-700">Digital Tax Invoice</p>
                <p>NPCI / BBPS Compliant Slip</p>
                <p>100% Encrypted & Authenticated</p>
              </div>
            </div>
            <div className="text-right text-[10px] text-slate-400">
              <p>Helpline: 1800-891-2300</p>
              <p>support@paymitra.in</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </button>
          <button
            onClick={handleShare}
            className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};
