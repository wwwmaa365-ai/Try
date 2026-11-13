import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DeviceFrame } from './components/DeviceFrame';
import { HomeScreen } from './components/HomeScreen';
import { RechargeScreen } from './components/RechargeScreen';
import { AEPSScreen } from './components/AEPSScreen';
import { BBPSScreen } from './components/BBPSScreen';
import { DMTScreen } from './components/DMTScreen';
import { FinancialScreen } from './components/FinancialScreen';
import { ExtraLinksScreen } from './components/ExtraLinksScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { MerchantPGScreen } from './components/MerchantPGScreen';
import { AdminPortal } from './components/AdminPortal';
import { ReceiptModal } from './components/ReceiptModal';
import { AISupportChat } from './components/AISupportChat';

const MainAppContent: React.FC = () => {
  const { appRole, activeTab, selectedReceipt, setSelectedReceipt, userProfile } = useApp();

  return (
    <DeviceFrame>
      {appRole === 'admin' ? (
        <AdminPortal />
      ) : (
        <>
          {activeTab === 'home' && <HomeScreen />}
          {activeTab === 'recharge' && <RechargeScreen />}
          {activeTab === 'aeps' && <AEPSScreen />}
          {activeTab === 'bbps' && <BBPSScreen />}
          {activeTab === 'dmt' && <DMTScreen />}
          {activeTab === 'financial' && <FinancialScreen />}
          {activeTab === 'links' && <ExtraLinksScreen />}
          {activeTab === 'history' && <HistoryScreen />}
          {activeTab === 'merchant_pg' && <MerchantPGScreen />}

          {/* Floating / Dialog 24/7 Sahayak AI */}
          <AISupportChat />

          {/* Authentic DigiSlip Receipt Modal */}
          {selectedReceipt && (
            <ReceiptModal
              transaction={selectedReceipt}
              onClose={() => setSelectedReceipt(null)}
              shopName={userProfile.shopName}
              retailerName={userProfile.retailerName}
              agentCode={userProfile.agentCode}
            />
          )}
        </>
      )}
    </DeviceFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
