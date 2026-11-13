import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExtraLink } from '../types';
import {
  ExternalLink,
  Search,
  Building2,
  CreditCard,
  ShieldCheck,
  Fingerprint,
  Receipt,
  TrendingUp,
  Activity,
  Train,
  Globe,
  Sparkles,
  MousePointerClick,
  Filter,
} from 'lucide-react';

export const ExtraLinksScreen: React.FC = () => {
  const { extraLinks, incrementLinkClicks, language } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Govt', 'Banking', 'KYC/Verify', 'Drivers', 'Partner'];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return Building2;
      case 'CreditCard': return CreditCard;
      case 'ShieldCheck': return ShieldCheck;
      case 'Fingerprint': return Fingerprint;
      case 'Receipt': return Receipt;
      case 'TrendingUp': return TrendingUp;
      case 'Activity': return Activity;
      case 'Train': return Train;
      default: return Globe;
    }
  };

  const filteredLinks = extraLinks
    .filter((l) => l.isActive)
    .filter((l) => selectedCategory === 'All' || l.category === selectedCategory)
    .filter(
      (l) =>
        searchQuery === '' ||
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (l.titleHi && l.titleHi.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => a.order - b.order);

  const handleOpenLink = (link: ExtraLink) => {
    incrementLinkClicks(link.id);
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-150">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-4 rounded-2xl shadow-lg border border-indigo-900">
        <div className="flex items-center gap-1.5 text-blue-300 text-xs font-semibold uppercase">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Admin Curated Quick Portals & Tools
        </div>
        <h2 className="text-lg font-bold mt-0.5">
          {language === 'hi' ? 'महत्वपूर्ण लिंक्स व सरकारी सेवाएं' : 'Extra Portals & Govt Services'}
        </h2>
        <p className="text-xs text-slate-300 mt-0.5">
          Direct 1-click access to Aadhaar UIDAI, PAN UTI/NSDL, DBT Bharat, RD Drivers & CIBIL
        </p>
      </div>

      {/* Search & Filter */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={
              language === 'hi'
                ? 'पोर्टल या सेवा खोजें (उदा. PAN, Aadhaar, DBT, GST)...'
                : 'Search extra links & official portals...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Links List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {filteredLinks.map((link) => {
          const Icon = getIcon(link.icon);
          return (
            <div
              key={link.id}
              onClick={() => handleOpenLink(link)}
              className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white border border-blue-200 transition-colors flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {link.category}
                    </span>
                    {link.badge && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {link.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors mt-0.5 truncate">
                    {language === 'hi' && link.titleHi ? link.titleHi : link.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{link.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <MousePointerClick className="w-3.5 h-3.5 text-blue-500" />
                  {link.clickCount.toLocaleString()} Visits
                </span>
                <span className="text-blue-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Open Portal
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
