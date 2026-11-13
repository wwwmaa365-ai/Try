export type DeviceView = 'android' | 'ios' | 'web';
export type AppRole = 'retailer' | 'admin';
export type ServiceTab = 'home' | 'recharge' | 'aeps' | 'bbps' | 'dmt' | 'financial' | 'history' | 'support' | 'links' | 'merchant_pg';

export interface ExtraLink {
  id: string;
  title: string;
  titleHi?: string;
  description: string;
  url: string;
  category: 'Govt' | 'Banking' | 'KYC/Verify' | 'Drivers' | 'Utility' | 'Partner';
  badge?: string;
  icon: string;
  isActive: boolean;
  order: number;
  clickCount: number;
}

export interface RechargePlan {
  id: string;
  price: number;
  validity: string;
  data: string;
  calls: string;
  description: string;
  category: 'Popular' | 'Truly Unlimited' | 'Data Booster' | 'Entertainment' | 'Annual';
  commission: number; // in Rupees or %
}

export interface Operator {
  id: string;
  name: string;
  circle: string;
  logo: string;
  type: 'prepaid' | 'postpaid' | 'dth' | 'fastag';
  color: string;
}

export interface Bank {
  id: string;
  name: string;
  shortCode: string;
  iin: string; // Issuer Identification Number
  logo: string;
  isPopular?: boolean;
}

export interface Transaction {
  id: string;
  type: 'RECHARGE' | 'AEPS_CASH' | 'AEPS_BALANCE' | 'AEPS_STATEMENT' | 'BBPS_BILL' | 'DMT_TRANSFER' | 'LOAN_LEAD' | 'WALLET_TOPUP';
  title: string;
  amount: number;
  commission: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  date: string;
  time: string;
  refNumber: string; // RRN / BBPS ID
  details: {
    mobileOrAcc?: string;
    operatorOrBank?: string;
    billerName?: string;
    aadhaarMasked?: string;
    customerName?: string;
    utrNumber?: string;
    productName?: string;
  };
}

export interface SupportTicket {
  id: string;
  category: 'AEPS' | 'Recharge' | 'BBPS' | 'Commission' | 'Account' | 'Other';
  subject: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  priority: 'High' | 'Medium' | 'Low';
  createdAt: string;
  lastUpdated: string;
  transactionRef?: string;
  messages: Array<{
    sender: 'user' | 'agent' | 'system';
    text: string;
    timestamp: string;
  }>;
}

export interface FinancialProduct {
  id: string;
  title: string;
  category: 'Personal Loan' | 'Business Loan' | 'Credit Card' | 'Micro Insurance' | 'Digital Gold';
  provider: string;
  maxAmount: string;
  interestRate: string;
  tenure: string;
  agentCommission: string;
  features: string[];
  badge?: string;
  icon: string;
}

export interface CommissionSlab {
  id: string;
  service: string;
  minAmount: number;
  maxAmount: number;
  retailerCommission: number;
  commissionType: 'flat' | 'percentage';
  isActive: boolean;
}

export interface SystemSettings {
  globalMaintenance: boolean;
  maintenanceNotice: string;
  readOnlyMode: boolean;
  aiSupportEnabled: boolean;
  aiSupportModel: 'gemini-3.8-flash' | 'gemini-4-argon' | 'gemini-3.1-flash-lite';
  services: {
    aeps: boolean;
    recharge: boolean;
    dth: boolean;
    bbps: boolean;
    dmt: boolean;
    financial: boolean;
    walletTopup: boolean;
  };
  gateways: {
    aepsNodalBank: 'ICICI Bank Nodal' | 'Fino Payments Bank' | 'Yes Bank Gateway';
    rechargeSwitch: 'Primary Route (API-Alpha)' | 'Failover Route (Cyrus 2.0)' | 'Direct Telco Switch';
    bbpsSwitch: 'Setu BBPS Gateway' | 'BillDesk Aggregator' | 'NPCI Direct Central Unit';
  };
  limits: {
    maxAepsPerTxn: number;
    maxDailyAepsPerRetailer: number;
    minWalletBalance: number;
    maxDmtPerTxn: number;
    maxLoanLeadAmount: number;
  };
  securityRules: {
    fraudVelocityBlock: boolean;
    ipLockRetailers: boolean;
    twoFactorAuthForAeps: boolean;
    highValueAlertThreshold: number;
  };
}

export interface BroadcastNotification {
  id: string;
  message: string;
  messageHi?: string;
  type: 'INFO' | 'WARNING' | 'ALERT' | 'OFFER';
  isActive: boolean;
  createdAt: string;
}

export type UserTier = 'ADMIN' | 'MASTER_DISTRIBUTOR' | 'DISTRIBUTOR' | 'RETAILER';

export interface MasterDistributor {
  id: string;
  name: string;
  companyName: string;
  mobile: string;
  email: string;
  code: string; // e.g. PM-MD-101
  state: string;
  walletBalance: number;
  totalDistributors: number;
  totalRetailers: number;
  monthlyGmv: number;
  overrideCommissionEarned: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'KYC_PENDING';
  distributorIdQuota: number;
  retailerIdQuota: number;
  microAtmsAssigned: number;
  joinedDate: string;
}

export interface Distributor {
  id: string;
  name: string;
  agencyName: string;
  mobile: string;
  email: string;
  code: string; // e.g. PM-DIS-201
  masterDistributorId: string;
  masterDistributorName: string;
  state: string;
  district: string;
  walletBalance: number;
  totalRetailers: number;
  monthlyGmv: number;
  commissionEarned: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'KYC_PENDING';
  retailerIdQuota: number;
  microAtmsInStock: number;
  joinedDate: string;
}

export interface RetailerUser {
  id: string;
  name: string;
  shopName: string;
  mobile: string;
  email: string;
  agentCode: string;
  kycStatus: 'VERIFIED' | 'PENDING' | 'REJECTED' | 'SUSPENDED';
  walletBalance: number;
  commissionEarned: number;
  city: string;
  state: string;
  joinedDate: string;
  isWalletLocked: boolean;
  distributorId?: string;
  distributorName?: string;
  masterDistributorId?: string;
  masterDistributorName?: string;
}

export interface TierCommissionSplit {
  id: string;
  service: string;
  slabRange: string;
  retailerShare: string;
  distributorShare: string;
  masterDistributorShare: string;
  adminPlatformMargin: string;
}


export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SECURITY';
  module: 'AEPS' | 'RECHARGE' | 'BBPS' | 'AUTH' | 'WALLET' | 'GATEWAY' | 'AI_BOT' | 'MERCHANT_PG';
  message: string;
}

export type IndianLanguageCode =
  | 'auto'
  | 'hi'
  | 'en'
  | 'bn'
  | 'te'
  | 'mr'
  | 'ta'
  | 'gu'
  | 'kn'
  | 'ml'
  | 'pa'
  | 'or'
  | 'as'
  | 'ur'
  | 'bho';

export interface IndianLanguageOption {
  code: IndianLanguageCode;
  name: string;
  nativeName: string;
  greeting: string;
  speechCode: string;
  flag?: string;
}

export type MerchantGatewayBrand = 'PHONEPE' | 'PAYTM' | 'GPAY' | 'BHARATPE' | 'RAZORPAY';

export interface MerchantInwardPayment {
  id: string;
  payerName: string;
  payerVpa: string;
  amount: number;
  gateway: MerchantGatewayBrand;
  status: 'SUCCESS' | 'PENDING' | 'REFUNDED';
  utr: string;
  timestamp: string;
  note?: string;
  soundPlayed?: boolean;
}

export interface MerchantSettings {
  primaryGateway: MerchantGatewayBrand;
  merchantVpa: string;
  storeName: string;
  soundboxEnabled: boolean;
  soundboxLanguage: IndianLanguageCode;
  soundboxVoiceGender: 'female' | 'male';
  autoSettlement: boolean;
  settlementAccount: {
    bankName: string;
    accountNumber: string;
    ifsc: string;
    holderName: string;
  };
}

export interface SoundboxDevice {
  id: string;
  serialNumber: string;
  brand: MerchantGatewayBrand;
  status: 'ONLINE' | 'OFFLINE';
  batteryLevel: number;
  assignedMerchantId: string;
  assignedMerchantName: string;
  simCarrier: 'Jio 4G' | 'Airtel 4G' | 'Vi 4G';
  lastPing: string;
}


