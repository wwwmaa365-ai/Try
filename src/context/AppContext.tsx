import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DeviceView,
  AppRole,
  ServiceTab,
  ExtraLink,
  Transaction,
  SupportTicket,
  CommissionSlab,
  SystemSettings,
  BroadcastNotification,
  RetailerUser,
  SystemLog,
  MasterDistributor,
  Distributor,
  TierCommissionSplit,
  IndianLanguageCode,
  MerchantInwardPayment,
  MerchantSettings,
  SoundboxDevice,
  MerchantGatewayBrand,
} from '../types';
import {
  INITIAL_EXTRA_LINKS,
  INITIAL_TRANSACTIONS,
  INITIAL_TICKETS,
  DEFAULT_COMMISSION_SLABS,
  INITIAL_SYSTEM_SETTINGS,
  INITIAL_BROADCASTS,
  INITIAL_RETAILERS,
  INITIAL_SYSTEM_LOGS,
  INITIAL_MASTER_DISTRIBUTORS,
  INITIAL_DISTRIBUTORS,
  INITIAL_TIER_COMMISSION_SPLITS,
  INITIAL_MERCHANT_SETTINGS,
  INITIAL_MERCHANT_PAYMENTS,
  INITIAL_SOUNDBOX_DEVICES,
} from '../data/mockData';

interface AppContextType {
  deviceView: DeviceView;
  setDeviceView: (v: DeviceView) => void;
  appRole: AppRole;
  setAppRole: (r: AppRole) => void;
  activeTab: ServiceTab;
  setActiveTab: (t: ServiceTab) => void;
  language: 'hi' | 'en';
  setLanguage: (l: 'hi' | 'en') => void;

  walletBalance: number;
  commissionBalance: number;
  topUpWallet: (amount: number) => void;
  deductWallet: (amount: number) => boolean;
  creditCommission: (amount: number) => void;

  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'date' | 'time'>) => Transaction;
  selectedReceipt: Transaction | null;
  setSelectedReceipt: (tx: Transaction | null) => void;

  extraLinks: ExtraLink[];
  addExtraLink: (link: Omit<ExtraLink, 'id' | 'clickCount'>) => void;
  updateExtraLink: (id: string, updated: Partial<ExtraLink>) => void;
  deleteExtraLink: (id: string) => void;
  toggleExtraLink: (id: string) => void;
  incrementLinkClicks: (id: string) => void;

  commissionSlabs: CommissionSlab[];
  updateCommissionSlab: (id: string, slab: Partial<CommissionSlab>) => void;

  tickets: SupportTicket[];
  addTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'lastUpdated'>) => string;
  updateTicketStatus: (id: string, status: SupportTicket['status']) => void;

  // SYSTEM CONTROLLER STATES & FUNCTIONS
  systemSettings: SystemSettings;
  updateSystemSettings: (partial: Partial<SystemSettings>) => void;
  toggleService: (serviceKey: keyof SystemSettings['services']) => void;
  setGatewayRoute: (gatewayKey: keyof SystemSettings['gateways'], value: any) => void;

  broadcasts: BroadcastNotification[];
  addBroadcast: (b: Omit<BroadcastNotification, 'id' | 'createdAt'>) => void;
  toggleBroadcast: (id: string) => void;
  deleteBroadcast: (id: string) => void;

  retailers: RetailerUser[];
  updateRetailerStatus: (id: string, status: RetailerUser['kycStatus']) => void;
  toggleRetailerWalletLock: (id: string) => void;
  adjustRetailerWallet: (id: string, amount: number, type: 'credit' | 'debit', reason: string) => void;
  addRetailer: (ret: Omit<RetailerUser, 'id' | 'agentCode' | 'walletBalance' | 'commissionEarned' | 'joinedDate' | 'isWalletLocked'>) => void;
  // MASTER DISTRIBUTOR & DISTRIBUTOR CONTROLLERS
  masterDistributors: MasterDistributor[];
  addMasterDistributor: (md: Omit<MasterDistributor, 'id' | 'code' | 'walletBalance' | 'totalDistributors' | 'totalRetailers' | 'monthlyGmv' | 'overrideCommissionEarned' | 'joinedDate'>) => void;
  updateMasterDistributor: (id: string, updated: Partial<MasterDistributor>) => void;
  adjustMasterDistributorWallet: (id: string, amount: number, type: 'credit' | 'debit', reason: string) => void;

  distributors: Distributor[];
  addDistributor: (d: Omit<Distributor, 'id' | 'code' | 'walletBalance' | 'totalRetailers' | 'monthlyGmv' | 'commissionEarned' | 'joinedDate'>) => void;
  updateDistributor: (id: string, updated: Partial<Distributor>) => void;
  adjustDistributorWallet: (id: string, amount: number, type: 'credit' | 'debit', reason: string) => void;

  tierSplits: TierCommissionSplit[];
  updateTierSplit: (id: string, updated: Partial<TierCommissionSplit>) => void;
  reassignRetailer: (retailerId: string, distributorId: string) => void;

  systemLogs: SystemLog[];
  addSystemLog: (log: Omit<SystemLog, 'id' | 'timestamp'>) => void;
  clearSystemLogs: () => void;
  purgeCache: () => void;

  isSupportModalOpen: boolean;
  setIsSupportModalOpen: (open: boolean) => void;

  // AI SUPPORT MULTI-LANGUAGE
  aiSupportLanguage: IndianLanguageCode;
  setAiSupportLanguage: (l: IndianLanguageCode) => void;

  // MERCHANT PAYMENT GATEWAY & SOUNDBOX
  merchantSettings: MerchantSettings;
  updateMerchantSettings: (s: Partial<MerchantSettings>) => void;
  merchantPayments: MerchantInwardPayment[];
  soundboxDevices: SoundboxDevice[];
  merchantSettlementBalance: number;
  triggerMerchantSettlement: (amount: number) => { success: boolean; message: string };
  simulateIncomingMerchantPayment: (payerName: string, amount: number, gateway: MerchantGatewayBrand, note?: string) => void;
  playMerchantSoundboxAnnouncement: (amount: number, gateway: MerchantGatewayBrand, lang?: IndianLanguageCode) => void;
  toggleSoundboxDevice: (id: string) => void;

  userProfile: {
    retailerName: string;
    shopName: string;
    mobile: string;
    agentCode: string;
    kycStatus: 'Verified' | 'Pending' | 'Rejected';
    location: string;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deviceView, setDeviceView] = useState<DeviceView>(() => {
    return (localStorage.getItem('paymitra_device_view') as DeviceView) || 'android';
  });

  const [appRole, setAppRole] = useState<AppRole>(() => {
    return (localStorage.getItem('paymitra_app_role') as AppRole) || 'retailer';
  });

  const [activeTab, setActiveTab] = useState<ServiceTab>('home');
  const [language, setLanguage] = useState<'hi' | 'en'>(() => {
    return (localStorage.getItem('paymitra_language') as 'hi' | 'en') || 'hi';
  });

  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem('paymitra_wallet_balance');
    return saved ? parseFloat(saved) : 28450.0;
  });

  const [commissionBalance, setCommissionBalance] = useState<number>(() => {
    const saved = localStorage.getItem('paymitra_commission_balance');
    return saved ? parseFloat(saved) : 3240.5;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('paymitra_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [extraLinks, setExtraLinks] = useState<ExtraLink[]>(() => {
    const saved = localStorage.getItem('paymitra_extra_links');
    return saved ? JSON.parse(saved) : INITIAL_EXTRA_LINKS;
  });

  const [commissionSlabs, setCommissionSlabs] = useState<CommissionSlab[]>(() => {
    const saved = localStorage.getItem('paymitra_slabs');
    return saved ? JSON.parse(saved) : DEFAULT_COMMISSION_SLABS;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('paymitra_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  // SYSTEM CONTROLLER PERSISTENCE
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('paymitra_sys_settings');
    return saved ? JSON.parse(saved) : INITIAL_SYSTEM_SETTINGS;
  });

  const [broadcasts, setBroadcasts] = useState<BroadcastNotification[]>(() => {
    const saved = localStorage.getItem('paymitra_broadcasts');
    return saved ? JSON.parse(saved) : INITIAL_BROADCASTS;
  });

  const [retailers, setRetailers] = useState<RetailerUser[]>(() => {
    const saved = localStorage.getItem('paymitra_retailers');
    return saved ? JSON.parse(saved) : INITIAL_RETAILERS;
  });

  const [masterDistributors, setMasterDistributors] = useState<MasterDistributor[]>(() => {
    const saved = localStorage.getItem('paymitra_master_distributors');
    return saved ? JSON.parse(saved) : INITIAL_MASTER_DISTRIBUTORS;
  });

  const [distributors, setDistributors] = useState<Distributor[]>(() => {
    const saved = localStorage.getItem('paymitra_distributors');
    return saved ? JSON.parse(saved) : INITIAL_DISTRIBUTORS;
  });

  const [tierSplits, setTierSplits] = useState<TierCommissionSplit[]>(() => {
    const saved = localStorage.getItem('paymitra_tier_splits');
    return saved ? JSON.parse(saved) : INITIAL_TIER_COMMISSION_SPLITS;
  });

  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(() => {
    const saved = localStorage.getItem('paymitra_sys_logs');
    return saved ? JSON.parse(saved) : INITIAL_SYSTEM_LOGS;
  });

  const [aiSupportLanguage, setAiSupportLanguage] = useState<IndianLanguageCode>(() => {
    return (localStorage.getItem('paymitra_ai_language') as IndianLanguageCode) || 'auto';
  });

  const [merchantSettings, setMerchantSettings] = useState<MerchantSettings>(() => {
    const saved = localStorage.getItem('paymitra_merchant_settings');
    return saved ? JSON.parse(saved) : INITIAL_MERCHANT_SETTINGS;
  });

  const [merchantPayments, setMerchantPayments] = useState<MerchantInwardPayment[]>(() => {
    const saved = localStorage.getItem('paymitra_merchant_payments');
    return saved ? JSON.parse(saved) : INITIAL_MERCHANT_PAYMENTS;
  });

  const [soundboxDevices, setSoundboxDevices] = useState<SoundboxDevice[]>(() => {
    const saved = localStorage.getItem('paymitra_soundbox_devices');
    return saved ? JSON.parse(saved) : INITIAL_SOUNDBOX_DEVICES;
  });

  const [merchantSettlementBalance, setMerchantSettlementBalance] = useState<number>(() => {
    const saved = localStorage.getItem('paymitra_merchant_settlement_bal');
    return saved ? parseFloat(saved) : 5300.0;
  });

  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const [userProfile] = useState({
    retailerName: 'Vikram Sharma',
    shopName: 'Sharma Digital Seva & Banking Point',
    mobile: '9876543210',
    agentCode: 'PM-928114',
    kycStatus: 'Verified' as const,
    location: 'Connaught Place, New Delhi',
  });

  useEffect(() => {
    localStorage.setItem('paymitra_device_view', deviceView);
  }, [deviceView]);

  useEffect(() => {
    localStorage.setItem('paymitra_app_role', appRole);
  }, [appRole]);

  useEffect(() => {
    localStorage.setItem('paymitra_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('paymitra_wallet_balance', walletBalance.toString());
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem('paymitra_commission_balance', commissionBalance.toString());
  }, [commissionBalance]);

  useEffect(() => {
    localStorage.setItem('paymitra_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('paymitra_extra_links', JSON.stringify(extraLinks));
  }, [extraLinks]);

  useEffect(() => {
    localStorage.setItem('paymitra_slabs', JSON.stringify(commissionSlabs));
  }, [commissionSlabs]);

  useEffect(() => {
    localStorage.setItem('paymitra_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('paymitra_sys_settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  useEffect(() => {
    localStorage.setItem('paymitra_broadcasts', JSON.stringify(broadcasts));
  }, [broadcasts]);

  useEffect(() => {
    localStorage.setItem('paymitra_retailers', JSON.stringify(retailers));
  }, [retailers]);

  useEffect(() => {
    localStorage.setItem('paymitra_master_distributors', JSON.stringify(masterDistributors));
  }, [masterDistributors]);

  useEffect(() => {
    localStorage.setItem('paymitra_distributors', JSON.stringify(distributors));
  }, [distributors]);

  useEffect(() => {
    localStorage.setItem('paymitra_tier_splits', JSON.stringify(tierSplits));
  }, [tierSplits]);

  useEffect(() => {
    localStorage.setItem('paymitra_sys_logs', JSON.stringify(systemLogs));
  }, [systemLogs]);

  useEffect(() => {
    localStorage.setItem('paymitra_ai_language', aiSupportLanguage);
  }, [aiSupportLanguage]);

  useEffect(() => {
    localStorage.setItem('paymitra_merchant_settings', JSON.stringify(merchantSettings));
  }, [merchantSettings]);

  useEffect(() => {
    localStorage.setItem('paymitra_merchant_payments', JSON.stringify(merchantPayments));
  }, [merchantPayments]);

  useEffect(() => {
    localStorage.setItem('paymitra_soundbox_devices', JSON.stringify(soundboxDevices));
  }, [soundboxDevices]);

  useEffect(() => {
    localStorage.setItem('paymitra_merchant_settlement_bal', merchantSettlementBalance.toString());
  }, [merchantSettlementBalance]);

  const topUpWallet = (amount: number) => {
    setWalletBalance((prev) => prev + amount);
    addTransaction({
      type: 'WALLET_TOPUP',
      title: 'Wallet Topup via UPI',
      amount: amount,
      commission: 0,
      status: 'SUCCESS',
      refNumber: 'UPI-' + Math.floor(100000000000 + Math.random() * 900000000000),
      details: {
        operatorOrBank: 'UPI Instant Top-up',
        utrNumber: 'UTR' + Date.now().toString().slice(-8),
      },
    });
    addSystemLog({
      level: 'INFO',
      module: 'WALLET',
      message: `Wallet credited with ₹${amount} via instant UPI QR for agent ${userProfile.agentCode}.`,
    });
  };

  const deductWallet = (amount: number): boolean => {
    if (walletBalance < amount) return false;
    setWalletBalance((prev) => prev - amount);
    return true;
  };

  const creditCommission = (amount: number) => {
    setCommissionBalance((prev) => +(prev + amount).toFixed(2));
  };

  const addTransaction = (tx: Omit<Transaction, 'id' | 'date' | 'time'>): Transaction => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const newTx: Transaction = {
      ...tx,
      id: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
      date: dateStr,
      time: timeStr,
    };

    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  };

  const addExtraLink = (link: Omit<ExtraLink, 'id' | 'clickCount'>) => {
    const newLink: ExtraLink = {
      ...link,
      id: 'link-' + Date.now(),
      clickCount: 0,
    };
    setExtraLinks((prev) => [...prev, newLink]);
    addSystemLog({
      level: 'INFO',
      module: 'GATEWAY',
      message: `Admin published new extra link: "${newLink.title}" (${newLink.category}).`,
    });
  };

  const updateExtraLink = (id: string, updated: Partial<ExtraLink>) => {
    setExtraLinks((prev) => prev.map((l) => (l.id === id ? { ...l, ...updated } : l)));
  };

  const deleteExtraLink = (id: string) => {
    setExtraLinks((prev) => prev.filter((l) => l.id !== id));
    addSystemLog({
      level: 'WARN',
      module: 'GATEWAY',
      message: `Admin deleted extra link ID: ${id}.`,
    });
  };

  const toggleExtraLink = (id: string) => {
    setExtraLinks((prev) => prev.map((l) => (l.id === id ? { ...l, isActive: !l.isActive } : l)));
  };

  const incrementLinkClicks = (id: string) => {
    setExtraLinks((prev) => prev.map((l) => (l.id === id ? { ...l, clickCount: l.clickCount + 1 } : l)));
  };

  const updateCommissionSlab = (id: string, slab: Partial<CommissionSlab>) => {
    setCommissionSlabs((prev) => prev.map((s) => (s.id === id ? { ...s, ...slab } : s)));
    addSystemLog({
      level: 'INFO',
      module: 'GATEWAY',
      message: `Commission slab updated for ID ${id}.`,
    });
  };

  const addTicket = (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'lastUpdated'>): string => {
    const now = new Date().toLocaleString();
    const id = 'TKT-' + ticket.category.toUpperCase().slice(0, 4) + '-' + Math.floor(1000 + Math.random() * 9000);
    const newTicket: SupportTicket = {
      ...ticket,
      id,
      createdAt: now,
      lastUpdated: now,
    };
    setTickets((prev) => [newTicket, ...prev]);
    addSystemLog({
      level: 'INFO',
      module: 'AI_BOT',
      message: `New support ticket filed: ${id} [${ticket.category}].`,
    });
    return id;
  };

  const updateTicketStatus = (id: string, status: SupportTicket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, lastUpdated: new Date().toLocaleString() } : t))
    );
  };

  // SYSTEM CONTROLLER IMPLEMENTATION
  const updateSystemSettings = (partial: Partial<SystemSettings>) => {
    setSystemSettings((prev) => ({ ...prev, ...partial }));
    addSystemLog({
      level: 'SECURITY',
      module: 'GATEWAY',
      message: `Master System Settings modified by Admin: ${Object.keys(partial).join(', ')}.`,
    });
  };

  const toggleService = (serviceKey: keyof SystemSettings['services']) => {
    setSystemSettings((prev) => {
      const nextStatus = !prev.services[serviceKey];
      return {
        ...prev,
        services: {
          ...prev.services,
          [serviceKey]: nextStatus,
        },
      };
    });
    addSystemLog({
      level: 'WARN',
      module: 'GATEWAY',
      message: `Service Switch: ${serviceKey.toUpperCase()} toggled to ${!systemSettings.services[serviceKey] ? 'ONLINE' : 'MAINTENANCE'}.`,
    });
  };

  const setGatewayRoute = (gatewayKey: keyof SystemSettings['gateways'], value: any) => {
    setSystemSettings((prev) => ({
      ...prev,
      gateways: {
        ...prev.gateways,
        [gatewayKey]: value,
      },
    }));
    addSystemLog({
      level: 'SECURITY',
      module: 'GATEWAY',
      message: `Active routing switch changed: ${gatewayKey} -> "${value}".`,
    });
  };

  const addBroadcast = (b: Omit<BroadcastNotification, 'id' | 'createdAt'>) => {
    const newB: BroadcastNotification = {
      ...b,
      id: 'bc-' + Date.now(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setBroadcasts((prev) => [newB, ...prev]);
    addSystemLog({
      level: 'INFO',
      module: 'AUTH',
      message: `Admin dispatched broadcast notification: "${b.message}".`,
    });
  };

  const toggleBroadcast = (id: string) => {
    setBroadcasts((prev) => prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b)));
  };

  const deleteBroadcast = (id: string) => {
    setBroadcasts((prev) => prev.filter((b) => b.id !== id));
  };

  const updateRetailerStatus = (id: string, status: RetailerUser['kycStatus']) => {
    setRetailers((prev) => prev.map((r) => (r.id === id ? { ...r, kycStatus: status } : r)));
    addSystemLog({
      level: 'SECURITY',
      module: 'AUTH',
      message: `Retailer ID ${id} KYC status updated to ${status}.`,
    });
  };

  const toggleRetailerWalletLock = (id: string) => {
    setRetailers((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isWalletLocked: !r.isWalletLocked } : r))
    );
  };

  const adjustRetailerWallet = (id: string, amount: number, type: 'credit' | 'debit', reason: string) => {
    setRetailers((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const newBal = type === 'credit' ? r.walletBalance + amount : Math.max(0, r.walletBalance - amount);
        return { ...r, walletBalance: newBal };
      })
    );
    addSystemLog({
      level: 'SECURITY',
      module: 'WALLET',
      message: `Manual Admin ${type.toUpperCase()}: ₹${amount} for Retailer ${id}. Reason: "${reason}".`,
    });
  };

  const addRetailer = (ret: Omit<RetailerUser, 'id' | 'agentCode' | 'walletBalance' | 'commissionEarned' | 'joinedDate' | 'isWalletLocked'>) => {
    const newCode = 'PM-' + Math.floor(928120 + Math.random() * 900);
    const newRet: RetailerUser = {
      ...ret,
      id: 'ret-' + Date.now(),
      agentCode: newCode,
      walletBalance: 1000.0,
      commissionEarned: 0,
      joinedDate: 'Today',
      isWalletLocked: false,
    };
    setRetailers((prev) => [newRet, ...prev]);
    addSystemLog({
      level: 'INFO',
      module: 'AUTH',
      message: `New Retailer enrolled: ${newRet.name} (${newCode}).`,
    });
  };

  const addMasterDistributor = (md: Omit<MasterDistributor, 'id' | 'code' | 'walletBalance' | 'totalDistributors' | 'totalRetailers' | 'monthlyGmv' | 'overrideCommissionEarned' | 'joinedDate'>) => {
    const newCode = 'PM-MD-' + Math.floor(104 + Math.random() * 90);
    const newMd: MasterDistributor = {
      ...md,
      id: 'md-' + Date.now(),
      code: newCode,
      walletBalance: 50000.0,
      totalDistributors: 0,
      totalRetailers: 0,
      monthlyGmv: 0,
      overrideCommissionEarned: 0,
      joinedDate: 'Today',
    };
    setMasterDistributors((prev) => [newMd, ...prev]);
    addSystemLog({
      level: 'INFO',
      module: 'AUTH',
      message: `New Master Distributor enrolled: ${newMd.name} (${newCode}) for ${newMd.state}.`,
    });
  };

  const updateMasterDistributor = (id: string, updated: Partial<MasterDistributor>) => {
    setMasterDistributors((prev) => prev.map((m) => (m.id === id ? { ...m, ...updated } : m)));
  };

  const adjustMasterDistributorWallet = (id: string, amount: number, type: 'credit' | 'debit', reason: string) => {
    setMasterDistributors((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const newBal = type === 'credit' ? m.walletBalance + amount : Math.max(0, m.walletBalance - amount);
        return { ...m, walletBalance: newBal };
      })
    );
    addSystemLog({
      level: 'SECURITY',
      module: 'WALLET',
      message: `MD Wallet ${type.toUpperCase()}: ₹${amount} for ${id}. Reason: "${reason}".`,
    });
  };

  const addDistributor = (d: Omit<Distributor, 'id' | 'code' | 'walletBalance' | 'totalRetailers' | 'monthlyGmv' | 'commissionEarned' | 'joinedDate'>) => {
    const newCode = 'PM-DIS-' + Math.floor(205 + Math.random() * 90);
    const newDis: Distributor = {
      ...d,
      id: 'dis-' + Date.now(),
      code: newCode,
      walletBalance: 20000.0,
      totalRetailers: 0,
      monthlyGmv: 0,
      commissionEarned: 0,
      joinedDate: 'Today',
    };
    setDistributors((prev) => [newDis, ...prev]);
    setMasterDistributors((prev) =>
      prev.map((m) =>
        m.id === d.masterDistributorId ? { ...m, totalDistributors: m.totalDistributors + 1 } : m
      )
    );
    addSystemLog({
      level: 'INFO',
      module: 'AUTH',
      message: `New Distributor enrolled: ${newDis.name} (${newCode}) under ${newDis.masterDistributorName}.`,
    });
  };

  const updateDistributor = (id: string, updated: Partial<Distributor>) => {
    setDistributors((prev) => prev.map((d) => (d.id === id ? { ...d, ...updated } : d)));
  };

  const adjustDistributorWallet = (id: string, amount: number, type: 'credit' | 'debit', reason: string) => {
    setDistributors((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const newBal = type === 'credit' ? d.walletBalance + amount : Math.max(0, d.walletBalance - amount);
        return { ...d, walletBalance: newBal };
      })
    );
    addSystemLog({
      level: 'SECURITY',
      module: 'WALLET',
      message: `Distributor Wallet ${type.toUpperCase()}: ₹${amount} for ${id}. Reason: "${reason}".`,
    });
  };

  const updateTierSplit = (id: string, updated: Partial<TierCommissionSplit>) => {
    setTierSplits((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
    addSystemLog({
      level: 'SECURITY',
      module: 'GATEWAY',
      message: `Multi-Tier Commission Split updated for ${id}.`,
    });
  };

  const reassignRetailer = (retailerId: string, distributorId: string) => {
    const targetDis = distributors.find((d) => d.id === distributorId);
    if (!targetDis) return;
    setRetailers((prev) =>
      prev.map((r) =>
        r.id === retailerId
          ? {
              ...r,
              distributorId: targetDis.id,
              distributorName: targetDis.agencyName,
              masterDistributorId: targetDis.masterDistributorId,
              masterDistributorName: targetDis.masterDistributorName,
            }
          : r
      )
    );
    addSystemLog({
      level: 'INFO',
      module: 'AUTH',
      message: `Retailer ${retailerId} reassigned to Distributor ${targetDis.name} (${targetDis.code}).`,
    });
  };

  const addSystemLog = (log: Omit<SystemLog, 'id' | 'timestamp'>) => {
    const newLog: SystemLog = {
      ...log,
      id: 'log-' + Date.now(),
      timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ' ' + new Date().toLocaleTimeString(),
    };
    setSystemLogs((prev) => [newLog, ...prev.slice(0, 99)]);
  };

  const clearSystemLogs = () => {
    setSystemLogs([]);
  };

  const purgeCache = () => {
    addSystemLog({
      level: 'WARN',
      module: 'GATEWAY',
      message: 'Global Redis Cache & in-memory session pools purged successfully.',
    });
    alert('System Cache, Routing Tables & Token Sessions purged successfully!');
  };

  const playMerchantSoundboxAnnouncement = (
    amount: number,
    gateway: MerchantGatewayBrand,
    langCode?: IndianLanguageCode
  ) => {
    const lang = langCode || merchantSettings.soundboxLanguage || 'hi';
    const brandName =
      gateway === 'PHONEPE'
        ? 'PhonePe'
        : gateway === 'PAYTM'
        ? 'Paytm'
        : gateway === 'GPAY'
        ? 'Google Pay'
        : gateway === 'BHARATPE'
        ? 'BharatPe'
        : 'PayMitra';

    let speechText = `${brandName} पर ₹${amount} प्राप्त हुए`;
    let speechLang = 'hi-IN';

    if (lang === 'en') {
      speechText = `Received ${amount} rupees on ${brandName}`;
      speechLang = 'en-IN';
    } else if (lang === 'bn') {
      speechText = `${brandName}-এ ${amount} টাকা পাওয়া গেছে`;
      speechLang = 'bn-IN';
    } else if (lang === 'te') {
      speechText = `${brandName} లో ${amount} రూపాయలు వచ్చాయి`;
      speechLang = 'te-IN';
    } else if (lang === 'ta') {
      speechText = `${brandName} இல் ${amount} ரூபாய் பெறப்பட்டது`;
      speechLang = 'ta-IN';
    } else if (lang === 'mr') {
      speechText = `${brandName} वर ${amount} रुपये मिळाले`;
      speechLang = 'mr-IN';
    } else if (lang === 'gu') {
      speechText = `${brandName} પર ${amount} રૂપિયા મળ્યા`;
      speechLang = 'gu-IN';
    } else if (lang === 'kn') {
      speechText = `${brandName} ನಲ್ಲಿ ${amount} ರೂಪಾಯಿಗಳು ಬಂದಿವೆ`;
      speechLang = 'kn-IN';
    } else if (lang === 'pa') {
      speechText = `${brandName} ਉੱਤੇ ${amount} ਰੁਪਏ ਪ੍ਰਾਪਤ ਹੋਏ`;
      speechLang = 'pa-IN';
    }

    try {
      if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.lang = speechLang;
        utterance.rate = 0.95;
        utterance.pitch = merchantSettings.soundboxVoiceGender === 'male' ? 0.9 : 1.1;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn('Soundbox audio speech warning:', e);
    }
  };

  const updateMerchantSettings = (updated: Partial<MerchantSettings>) => {
    setMerchantSettings((prev) => ({ ...prev, ...updated }));
    addSystemLog({
      level: 'INFO',
      module: 'MERCHANT_PG',
      message: `Merchant Settings updated: Gateway=${updated.primaryGateway || merchantSettings.primaryGateway}, Soundbox=${updated.soundboxEnabled ?? merchantSettings.soundboxEnabled}.`,
    });
  };

  const triggerMerchantSettlement = (amount: number): { success: boolean; message: string } => {
    if (amount <= 0 || amount > merchantSettlementBalance) {
      return { success: false, message: 'Invalid settlement amount or insufficient balance.' };
    }
    const netPayout = +(amount * 0.9985).toFixed(2);
    setMerchantSettlementBalance((prev) => Math.max(0, +(prev - amount).toFixed(2)));
    addTransaction({
      type: 'WALLET_TOPUP',
      title: 'Merchant QR Instant T+0 Settlement',
      amount: netPayout,
      commission: +(amount - netPayout).toFixed(2),
      status: 'SUCCESS',
      refNumber: 'STL-' + Math.floor(100000000000 + Math.random() * 900000000000),
      details: {
        operatorOrBank: `${merchantSettings.settlementAccount.bankName} (${merchantSettings.settlementAccount.accountNumber})`,
        utrNumber: 'CMS' + Date.now().toString().slice(-9),
      },
    });
    addSystemLog({
      level: 'SECURITY',
      module: 'MERCHANT_PG',
      message: `T+0 Instant Bank Settlement: ₹${netPayout} transferred to ${merchantSettings.settlementAccount.bankName} (${merchantSettings.settlementAccount.accountNumber}).`,
    });
    return {
      success: true,
      message: `₹${netPayout} successfully settled to ${merchantSettings.settlementAccount.bankName} A/C ${merchantSettings.settlementAccount.accountNumber}!`,
    };
  };

  const simulateIncomingMerchantPayment = (
    payerName: string,
    amount: number,
    gateway: MerchantGatewayBrand,
    note?: string
  ) => {
    const utr = '43' + Math.floor(1000000000 + Math.random() * 9000000000);
    const newPayment: MerchantInwardPayment = {
      id: 'pay-' + Date.now(),
      payerName: payerName || 'Customer Payment',
      payerVpa: payerName.toLowerCase().replace(/\s+/g, '.') + '@upi',
      amount: amount,
      gateway: gateway,
      status: 'SUCCESS',
      utr: utr,
      timestamp: 'Just now',
      note: note || 'Store QR Payment',
      soundPlayed: true,
    };

    setMerchantPayments((prev) => [newPayment, ...prev]);
    setMerchantSettlementBalance((prev) => +(prev + amount).toFixed(2));

    if (merchantSettings.soundboxEnabled) {
      playMerchantSoundboxAnnouncement(amount, gateway, merchantSettings.soundboxLanguage);
    }

    addSystemLog({
      level: 'INFO',
      module: 'MERCHANT_PG',
      message: `Inward QR Payment Received: ₹${amount} via ${gateway} from ${payerName}. UTR: ${utr}.`,
    });
  };

  const toggleSoundboxDevice = (id: string) => {
    setSoundboxDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: d.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE' } : d))
    );
  };

  return (
    <AppContext.Provider
      value={{
        deviceView,
        setDeviceView,
        appRole,
        setAppRole,
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        walletBalance,
        commissionBalance,
        topUpWallet,
        deductWallet,
        creditCommission,
        transactions,
        addTransaction,
        selectedReceipt,
        setSelectedReceipt,
        extraLinks,
        addExtraLink,
        updateExtraLink,
        deleteExtraLink,
        toggleExtraLink,
        incrementLinkClicks,
        commissionSlabs,
        updateCommissionSlab,
        tickets,
        addTicket,
        updateTicketStatus,
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
        masterDistributors,
        addMasterDistributor,
        updateMasterDistributor,
        adjustMasterDistributorWallet,
        distributors,
        addDistributor,
        updateDistributor,
        adjustDistributorWallet,
        tierSplits,
        updateTierSplit,
        reassignRetailer,
        systemLogs,
        addSystemLog,
        clearSystemLogs,
        purgeCache,
        isSupportModalOpen,
        setIsSupportModalOpen,
        aiSupportLanguage,
        setAiSupportLanguage,
        merchantSettings,
        updateMerchantSettings,
        merchantPayments,
        soundboxDevices,
        merchantSettlementBalance,
        triggerMerchantSettlement,
        simulateIncomingMerchantPayment,
        playMerchantSoundboxAnnouncement,
        toggleSoundboxDevice,
        userProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
