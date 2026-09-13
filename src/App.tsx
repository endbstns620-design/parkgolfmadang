import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ParkGolfProvider, useParkGolf } from './context/ParkGolfContext';
import { SeniorAccessibilityBar } from './components/SeniorAccessibilityBar';
import { HeaderNavbar } from './components/HeaderNavbar';
import { MainHomeSection } from './components/MainHomeSection';
import { DeepLinkOpener } from './components/DeepLinkOpener';
import { ParkCoursesSection } from './components/ParkCoursesSection';
import { TournamentSection } from './components/TournamentSection';
import { ReviewsSection } from './components/ReviewsSection';
import { ClubMatchingSection } from './components/ClubMatchingSection';
import { AdsSection } from './components/AdsSection';
import { AssociationsSection } from './components/AssociationsSection';
import { AssociationRulesGuideSection } from './components/AssociationRulesGuideSection';
import { NearbyRestaurantsSection } from './components/NearbyRestaurantsSection';
import { CoupangShopSection } from './components/CoupangShopSection';
import { PointMarketSection } from './components/PointMarketSection';
import { NoticeSection } from './components/NoticeSection';
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
import { PointNoticeModal } from './components/PointNoticeModal';

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

      case 'pointmarket':
        return <PointMarketSection />;

      case 'notices':
        return <NoticeSection />;

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
    <div className="min-h-screen w-full flex flex-col bg-stone-50 text-slate-900 selection:bg-amber-300 selection:text-green-950 font-sans antialiased pb-16 md:pb-0">
      {/* 검색으로 구장·대회 주소를 통해 들어온 분을 해당 화면으로 안내합니다 */}
      <DeepLinkOpener />
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

      {/* 양옆에 고정으로 붙던 후원사 광고 띠는 뺐습니다.
          같은 광고가 한 화면에 세 번 나오던 문제를 없애고,
          광고는 구장 목록·구장 상세 안(InlineAdBanner)에서만 보여줍니다 —
          "채 하나 사야겠다" 하는 맥락에서 나오는 쪽이 훨씬 잘 눌립니다. */}

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
      <PointNoticeModal />
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
