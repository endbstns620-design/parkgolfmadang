import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ParkGolfProvider, useParkGolf } from './context/ParkGolfContext';
import { SeniorAccessibilityBar } from './components/SeniorAccessibilityBar';
import { HeaderNavbar } from './components/HeaderNavbar';
import { MainHomeSection } from './components/MainHomeSection';
import { ParkCoursesSection } from './components/ParkCoursesSection';
import { TournamentSection } from './components/TournamentSection';
import { BeginnerVideoGuideSection } from './components/BeginnerVideoGuideSection';
import { ReviewsSection } from './components/ReviewsSection';
import { ClubMatchingSection } from './components/ClubMatchingSection';
import { AdsSection } from './components/AdsSection';
import { AssociationsSection } from './components/AssociationsSection';
import { AssociationRulesGuideSection } from './components/AssociationRulesGuideSection';
import { NearbyRestaurantsSection } from './components/NearbyRestaurantsSection';
import { CoupangShopSection } from './components/CoupangShopSection';
import { Footer } from './components/Footer';
import { SeniorFloatingNav } from './components/SeniorFloatingNav';
import { MobileBottomNav } from './components/MobileBottomNav';
import { initClientSecurityGuards } from './utils/security';

// Modals
import { ParkDetailModal } from './components/ParkDetailModal';
import { TournamentDetailModal } from './components/TournamentDetailModal';
import { NewsDetailModal } from './components/NewsDetailModal';
import { MatchingPostModal } from './components/MatchingPostModal';
import { ReviewWriteModal } from './components/ReviewWriteModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { PolicyRulesModal } from './components/PolicyRulesModal';
import { AuthModal } from './components/AuthModal';
import { MyPageModal } from './components/MyPageModal';

const ParkGolfApp: React.FC = () => {
  const { activeTab } = useParkGolf();

  useEffect(() => {
    const cleanupSecurity = initClientSecurityGuards();
    return () => {
      if (cleanupSecurity) cleanupSecurity();
    };
  }, []);

  // Render the specific active page based on category navigation
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <MainHomeSection />;

      case 'courses':
        return <ParkCoursesSection />;

      case 'tournaments':
        return <TournamentSection />;

      case 'news':
        return <BeginnerVideoGuideSection />;

      case 'matching':
        return <ClubMatchingSection />;

      case 'reviews':
        return <ReviewsSection />;

      case 'ads':
        return <AdsSection />;

      case 'restaurants':
        return <NearbyRestaurantsSection />;

      case 'shop':
        return <CoupangShopSection />;

      case 'associations':
        return (
          <div className="space-y-6">
            <AssociationsSection />
            <AssociationRulesGuideSection />
          </div>
        );

      case 'rules':
      case 'guide':
        return <AssociationRulesGuideSection />;

      default:
        return <MainHomeSection />;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-stone-50 text-slate-900 selection:bg-amber-300 selection:text-green-950 font-sans antialiased pb-20 md:pb-0">
      {/* Sticky Combined Header: Senior Accessibility & Navigation */}
      <div className="sticky top-0 z-50 w-full shadow-md">
        {/* 1. Senior Accessibility & Font Scale Bar */}
        <SeniorAccessibilityBar />

        {/* 2. Top Navigation Bar (Single-Row Categories) */}
        <HeaderNavbar />
      </div>

      {/* 3. Main Screen Page Content (Switches cleanly by category) */}
      <main className="flex-1 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="w-full"
          >
            {renderActiveScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. Footer */}
      <Footer />

      {/* 5. Floating Top button */}
      <SeniorFloatingNav />

      {/* 6. Mobile App Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* 7. Modals Layer */}
      <ParkDetailModal />
      <TournamentDetailModal />
      <NewsDetailModal />
      <MatchingPostModal />
      <ReviewWriteModal />
      <AdminDashboardModal />
      <PolicyRulesModal />
      <AuthModal />
      <MyPageModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ParkGolfProvider>
      <ParkGolfApp />
    </ParkGolfProvider>
  );
};

export default App;
