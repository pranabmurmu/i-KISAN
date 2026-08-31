import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { LandingAuth } from './components/auth/LandingAuth';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { DiseaseDetection } from './components/disease/DiseaseDetection';
import { MarketplaceView } from './components/marketplace/MarketplaceView';
import { FarmingInsights } from './components/insights/FarmingInsights';
import { LoanDetailsView } from './components/loans/LoanDetailsView';
import { GoogleChatView } from './components/chat/GoogleChatView';
import { ProfileView } from './components/profile/ProfileView';
import { SettingsModal } from './components/modals/SettingsModal';
import { NotificationsModal } from './components/modals/NotificationsModal';
import { DistressSimulatorModal } from './components/distress/DistressSimulatorModal';
import { AiFarmerAssistant } from './components/chat/AiFarmerAssistant';

const MainAppContent: React.FC = () => {
  const { user, activeView } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // If user is not logged in, show the split Landing/Auth page
  if (!user) {
    return <LandingAuth />;
  }

  return (
    <div id="smart-krishi-app-root" className="min-h-screen bg-green-50 flex flex-col text-green-950 font-sans antialiased">
      {/* Top Navbar */}
      <Navbar
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex w-full max-w-[1600px] mx-auto">
        {/* Left Desktop Sidebar */}
        <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />

        {/* Dynamic Center View Container */}
        <main
          id="main-app-content-area"
          className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto min-w-0"
        >
          {activeView === 'home' && <HomeDashboard />}
          {activeView === 'disease' && <DiseaseDetection />}
          {activeView === 'marketplace' && <MarketplaceView />}
          {activeView === 'loans' && <LoanDetailsView />}
          {activeView === 'google-chat' && <GoogleChatView />}
          {activeView === 'insights' && <FarmingInsights />}
          {activeView === 'profile' && <ProfileView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Floating AI Farmer Assistant Chatbot */}
      <AiFarmerAssistant />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* SIH Farmer Distress Multi-Factor Simulator Modal */}
      <DistressSimulatorModal />

      {/* System Settings & Help Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
