import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ParkCourse,
  Tournament,
  NewsItem,
  ReviewItem,
  MatchingPost,
  AdItem,
  CoupangProduct,
  FontSizeOption,
  RegionCategory
} from '../types';
import {
  INITIAL_COURSES,
  INITIAL_TOURNAMENTS,
  INITIAL_NEWS,
  INITIAL_REVIEWS,
  INITIAL_MATCHES,
  INITIAL_ADS
} from '../data/initialParkGolfData';
import { cleanExpiredMatches } from '../utils/matchAutoCleaner';
import { validatePostContent } from '../utils/contentModeration';

interface ModalState {
  type:
    | 'courseDetail'
    | 'tournamentDetail'
    | 'newsDetail'
    | 'matchDetail'
    | 'newMatch'
    | 'newReview'
    | 'admin'
    | 'aiBot'
    | 'policy'
    | 'appInstall';
  data?: any;
}

interface ParkGolfContextType {
  // Data State
  courses: ParkCourse[];
  tournaments: Tournament[];
  news: NewsItem[];
  reviews: ReviewItem[];
  matches: MatchingPost[];
  ads: AdItem[];

  // Navigation & UI state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  fontSize: FontSizeOption;
  setFontSize: (size: FontSizeOption) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedRegion: RegionCategory;
  setSelectedRegion: (region: RegionCategory) => void;
  filterHoles: number | 'all';
  setFilterHoles: (holes: number | 'all') => void;
  filterReservation: string | 'all';
  setFilterReservation: (type: string | 'all') => void;
  filterParkingOnly: boolean;
  setFilterParkingOnly: (val: boolean) => void;

  // Modals
  activeModal: ModalState | null;
  openModal: (type: ModalState['type'], data?: any) => void;
  closeModal: () => void;

  // TTS Voice
  isSpeaking: boolean;
  speakText: (text: string) => void;
  stopSpeaking: () => void;

  // Admin
  isAdmin: boolean;
  loginAdmin: (password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  resetToDefaultData: () => void;
  exportDataAsJson: () => void;
  importDataFromJson: (jsonStr: string) => boolean;

  // CRUD for Courses
  addCourse: (course: Omit<ParkCourse, 'id' | 'rating' | 'reviewCount'>) => void;
  updateCourse: (id: string, course: Partial<ParkCourse>) => void;
  deleteCourse: (id: string) => void;

  // CRUD for Tournaments
  addTournament: (tour: Omit<Tournament, 'id'>) => void;
  updateTournament: (id: string, tour: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;

  // CRUD for News
  addNews: (news: Omit<NewsItem, 'id' | 'views'>) => void;
  updateNews: (id: string, news: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;

  // CRUD for Reviews
  addReview: (review: Omit<ReviewItem, 'id' | 'createdAt'>) => void;
  deleteReview: (id: string) => void;

  // CRUD for Matches
  addMatch: (match: Omit<MatchingPost, 'id' | 'createdAt' | 'comments'>) => void;
  updateMatchStatus: (id: string, status: '모집중' | '마감') => void;
  deleteMatch: (id: string) => void;
  isMyMatch: (matchId: string) => boolean;
  addMatchComment: (postId: string, comment: { authorName: string; authorPhone?: string; content: string }) => void;

  // CRUD for Ads
  addAd: (ad: Omit<AdItem, 'id'>) => void;
  updateAd: (id: string, ad: Partial<AdItem>) => void;
  deleteAd: (id: string) => void;
  toggleAdStatus: (id: string) => void;
  coupangProducts: CoupangProduct[];
  addCoupangProduct: (productData: Omit<CoupangProduct, 'id'>) => Promise<boolean>;
  deleteCoupangProduct: (id: string) => void;
}

const ParkGolfContext = createContext<ParkGolfContextType | undefined>(undefined);

const STORAGE_KEYS = {
  COURSES: 'parkgolf_madang_courses_prod_v3',
  TOURNAMENTS: 'parkgolf_madang_tournaments_prod_v1',
  NEWS: 'parkgolf_madang_news_prod_v2',
  REVIEWS: 'parkgolf_madang_reviews_prod_v1',
  MATCHES: 'parkgolf_madang_matches_prod_v1',
  ADS: 'parkgolf_madang_ads_prod_v1',
  FONT_SIZE: 'parkgolf_madang_fontsize',
  ADMIN_AUTH: 'parkgolf_madang_isadmin',
  ADMIN_TOKEN: 'parkgolf_madang_admin_token',
  MY_MATCH_TOKENS: 'parkgolf_madang_my_match_tokens'
};

export const ParkGolfProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load data from localStorage or use initial data
  const [courses, setCourses] = useState<ParkCourse[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COURSES);
      return saved ? JSON.parse(saved) : INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  });

  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TOURNAMENTS);
      return saved ? JSON.parse(saved) : INITIAL_TOURNAMENTS;
    } catch {
      return INITIAL_TOURNAMENTS;
    }
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NEWS);
      return saved ? JSON.parse(saved) : INITIAL_NEWS;
    } catch {
      return INITIAL_NEWS;
    }
  });

  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [matches, setMatches] = useState<MatchingPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MATCHES);
      const rawPosts: MatchingPost[] = saved ? JSON.parse(saved) : INITIAL_MATCHES;
      const { activePosts } = cleanExpiredMatches(rawPosts);
      return activePosts;
    } catch {
      return INITIAL_MATCHES;
    }
  });

  const [ads, setAds] = useState<AdItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADS);
      return saved ? JSON.parse(saved) : INITIAL_ADS;
    } catch {
      return INITIAL_ADS;
    }
  });

  const [coupangProducts, setCoupangProducts] = useState<CoupangProduct[]>([]);

  // 서버에 저장된 리뷰 · 동반자모집 · 광고 · 쿠팡파트너스 상품을 불러옵니다.
  // 이렇게 해야 방문자 A가 남긴 글을 방문자 B도 볼 수 있습니다 (localStorage는 브라우저별로 분리되어 있어 공유되지 않습니다).
  useEffect(() => {
    (async () => {
      try {
        const [reviewsRes, matchesRes, adsRes, coupangRes] = await Promise.all([
          fetch('/api/reviews'),
          fetch('/api/matches'),
          fetch('/api/ads'),
          fetch('/api/coupang-products')
        ]);
        if (reviewsRes.ok) {
          const data = await reviewsRes.json();
          if (data.success) setReviews(data.reviews);
        }
        if (matchesRes.ok) {
          const data = await matchesRes.json();
          if (data.success) {
            const { activePosts } = cleanExpiredMatches(data.matches);
            setMatches(activePosts);
          }
        }
        if (adsRes.ok) {
          const data = await adsRes.json();
          if (data.success) setAds(data.ads);
        }
        if (coupangRes.ok) {
          const data = await coupangRes.json();
          if (data.success) setCoupangProducts(data.products);
        }
      } catch (err) {
        // 서버에서 못 가져오면 localStorage에 저장된 값(초기 state)을 그대로 사용합니다.
        console.warn('서버에서 공유 데이터를 불러오지 못했습니다. 로컬 데이터로 표시합니다.', err);
      }
    })();
  }, []);

  // UI state
  const [activeTab, setActiveTab] = useState<string>('courses');
  const [fontSize, setFontSizeState] = useState<FontSizeOption>(() => {
    return (localStorage.getItem(STORAGE_KEYS.FONT_SIZE) as FontSizeOption) || 'normal';
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<RegionCategory>('전체');
  const [filterHoles, setFilterHoles] = useState<number | 'all'>('all');
  const [filterReservation, setFilterReservation] = useState<string | 'all'>('all');
  const [filterParkingOnly, setFilterParkingOnly] = useState<boolean>(false);

  const [activeModal, setActiveModal] = useState<ModalState | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // 저장된 관리자 토큰이 아직 유효한지 서버에 물어봅니다 (탭을 새로고침해도 로그인 유지).
  // 예전에는 localStorage의 boolean 값 하나만 보고 관리자 여부를 판단했는데, 이건
  // 브라우저 콘솔에서 그 값만 true로 바꾸면 누구나 관리자 화면에 들어갈 수 있는 구조였습니다.
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
    if (!token) return;
    (async () => {
      try {
        const res = await fetch('/api/admin/check', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setIsAdmin(true);
        } else {
          localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
        }
      } catch {
        // 서버 확인 실패 시 관리자 상태를 유지하지 않습니다 (안전한 쪽으로).
      }
    })();
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOURNAMENTS, JSON.stringify(tournaments));
  }, [tournaments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
  }, [matches]);

  // Auto-delete expired matching posts (when meeting date has passed + 1 day, or marked '마감' for > 1 day)
  useEffect(() => {
    const runAutoCleanup = () => {
      setMatches(prev => {
        const { activePosts, removedCount } = cleanExpiredMatches(prev);
        if (removedCount > 0) {
          console.log(`[AutoCleaner] 만나는 날짜가 지났거나 마감 1일이 경과한 모집글 ${removedCount}개가 자동 삭제되었습니다.`);
          return activePosts;
        }
        return prev;
      });
    };

    // Run on initial mount
    runAutoCleanup();

    // Check periodically every 30 seconds
    const interval = setInterval(runAutoCleanup, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(ads));
  }, [ads]);

  // Apply Font Size to html tag
  const setFontSize = (size: FontSizeOption) => {
    setFontSizeState(size);
    localStorage.setItem(STORAGE_KEYS.FONT_SIZE, size);
    document.documentElement.classList.remove('font-normal', 'font-large', 'font-xlarge');
    document.documentElement.classList.add(`font-${size}`);
  };

  useEffect(() => {
    document.documentElement.classList.remove('font-normal', 'font-large', 'font-xlarge');
    document.documentElement.classList.add(`font-${fontSize}`);
  }, [fontSize]);

  // Modal helpers
  const openModal = (type: ModalState['type'], data?: any) => {
    setActiveModal({ type, data });
  };

  const closeModal = () => {
    stopSpeaking();
    setActiveModal(null);
  };

  // Web Speech API Voice reading for Seniors
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('사용하시는 브라우저에서 음성 안내를 지원하지 않습니다.');
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#\-_`]/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.92; // Slightly slower pace for seniors
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Admin Auth
  const loginAdmin = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, data.token);
        setIsAdmin(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logoutAdmin = () => {
    const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
    if (token) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }
    setIsAdmin(false);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
  };

  // 관리자 전용 API 호출에 인증 헤더를 붙여주는 헬퍼
  const adminAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // 이 브라우저가 해당 동반자 모집글의 작성자인지 (삭제 토큰을 갖고 있는지) 확인합니다.
  const isMyMatch = (matchId: string): boolean => {
    try {
      const myTokens = JSON.parse(localStorage.getItem(STORAGE_KEYS.MY_MATCH_TOKENS) || '{}');
      return Boolean(myTokens[matchId]);
    } catch {
      return false;
    }
  };

  // Reset & Backup
  const resetToDefaultData = () => {
    if (window.confirm('모든 데이터를 초기 기본 데이터로 복원하시겠습니까? (수정하신 내용이 초기화됩니다)')) {
      setCourses(INITIAL_COURSES);
      setTournaments(INITIAL_TOURNAMENTS);
      setNews(INITIAL_NEWS);
      setReviews(INITIAL_REVIEWS);
      setMatches(INITIAL_MATCHES);
      setAds(INITIAL_ADS);
      alert('기본 데이터로 성공적으로 복원되었습니다.');
    }
  };

  const exportDataAsJson = () => {
    const backupData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      courses,
      tournaments,
      news,
      reviews,
      matches,
      ads
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parkgolf_madang_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataFromJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.courses) setCourses(data.courses);
      if (data.tournaments) setTournaments(data.tournaments);
      if (data.news) setNews(data.news);
      if (data.reviews) setReviews(data.reviews);
      if (data.matches) setMatches(data.matches);
      if (data.ads) setAds(data.ads);
      return true;
    } catch (err) {
      console.error('Import error:', err);
      return false;
    }
  };

  // Course CRUD
  const addCourse = (courseData: Omit<ParkCourse, 'id' | 'rating' | 'reviewCount'>) => {
    const newCourse: ParkCourse = {
      ...courseData,
      id: `course-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0
    };
    setCourses(prev => [newCourse, ...prev]);
  };

  const updateCourse = (id: string, updated: Partial<ParkCourse>) => {
    setCourses(prev => prev.map(c => (c.id === id ? { ...c, ...updated } : c)));
  };

  const deleteCourse = (id: string) => {
    if (window.confirm('정말 이 구장 정보를 삭제하시겠습니까?')) {
      setCourses(prev => prev.filter(c => c.id !== id));
    }
  };

  // Tournament CRUD
  const addTournament = (tourData: Omit<Tournament, 'id'>) => {
    const newTour: Tournament = {
      ...tourData,
      id: `tour-${Date.now()}`
    };
    setTournaments(prev => [newTour, ...prev]);
  };

  const updateTournament = (id: string, updated: Partial<Tournament>) => {
    setTournaments(prev => prev.map(t => (t.id === id ? { ...t, ...updated } : t)));
  };

  const deleteTournament = (id: string) => {
    if (window.confirm('정말 이 대회 소식을 삭제하시겠습니까?')) {
      setTournaments(prev => prev.filter(t => t.id !== id));
    }
  };

  // News CRUD
  const addNews = (newsData: Omit<NewsItem, 'id' | 'views'>) => {
    const newArticle: NewsItem = {
      ...newsData,
      id: `news-${Date.now()}`,
      views: 1
    };
    setNews(prev => [newArticle, ...prev]);
  };

  const updateNews = (id: string, updated: Partial<NewsItem>) => {
    setNews(prev => prev.map(n => (n.id === id ? { ...n, ...updated } : n)));
  };

  const deleteNews = (id: string) => {
    if (window.confirm('정말 이 뉴스를 삭제하시겠습니까?')) {
      setNews(prev => prev.filter(n => n.id !== id));
    }
  };

  // Review CRUD
  const addReview = (reviewData: Omit<ReviewItem, 'id' | 'createdAt'>) => {
    // 낙관적 업데이트: 화면엔 즉시 반영하고, 서버에도 저장해 다른 방문자에게도 보이게 합니다.
    const optimisticId = `rev-${Date.now()}`;
    const optimisticRev: ReviewItem = {
      ...reviewData,
      id: optimisticId,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setReviews(prev => [optimisticRev, ...prev]);

    setCourses(prev =>
      prev.map(c => {
        if (c.id === reviewData.courseId) {
          const currentCount = c.reviewCount || 0;
          const currentRating = c.rating || 5;
          const newAvg = ((currentRating * currentCount) + reviewData.rating) / (currentCount + 1);
          return {
            ...c,
            reviewCount: currentCount + 1,
            rating: Number(newAvg.toFixed(1))
          };
        }
        return c;
      })
    );

    (async () => {
      try {
        const res = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reviewData)
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          alert(err.error || '리뷰 등록에 실패했습니다.');
          setReviews(prev => prev.filter(r => r.id !== optimisticId));
          return;
        }
        const data = await res.json();
        // 서버가 부여한 실제 id로 교체
        setReviews(prev => prev.map(r => (r.id === optimisticId ? data.review : r)));
      } catch (err) {
        console.error('리뷰 저장 실패:', err);
      }
    })();
  };

  const deleteReview = (id: string) => {
    if (window.confirm('리뷰를 삭제하시겠습니까?')) {
      setReviews(prev => prev.filter(r => r.id !== id));
      fetch(`/api/reviews/${id}`, { method: 'DELETE', headers: adminAuthHeaders() }).catch(err => console.error('리뷰 삭제 실패:', err));
    }
  };

  // Match CRUD
  const addMatch = (matchData: Omit<MatchingPost, 'id' | 'createdAt' | 'comments'>) => {
    const moderation = validatePostContent({
      title: matchData.title,
      courseName: matchData.courseName,
      authorName: matchData.authorName,
      authorPhone: matchData.authorPhone,
      description: matchData.description
    });

    if (!moderation.isValid) {
      console.warn('Blocked inappropriate post:', moderation.reason);
      alert(moderation.reason || '등록할 수 없는 내용이 포함되어 있습니다.');
      return;
    }

    const optimisticId = `match-${Date.now()}`;
    const optimisticPost: MatchingPost = {
      ...matchData,
      id: optimisticId,
      createdAt: new Date().toISOString().slice(0, 10),
      closedAt: matchData.status === '마감' ? new Date().toISOString() : undefined,
      comments: []
    };
    setMatches(prev => [optimisticPost, ...prev]);

    (async () => {
      try {
        const res = await fetch('/api/matches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(matchData)
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          alert(err.error || '등록에 실패했습니다.');
          setMatches(prev => prev.filter(m => m.id !== optimisticId));
          return;
        }
        const data = await res.json();
        setMatches(prev => prev.map(m => (m.id === optimisticId ? data.match : m)));
        // 내 글 삭제용 토큰을 이 브라우저에 저장해둡니다 (서버는 매칭 목록 응답에 이 토큰을 절대 포함하지 않습니다).
        if (data.deleteToken) {
          const myTokens = JSON.parse(localStorage.getItem(STORAGE_KEYS.MY_MATCH_TOKENS) || '{}');
          myTokens[data.match.id] = data.deleteToken;
          localStorage.setItem(STORAGE_KEYS.MY_MATCH_TOKENS, JSON.stringify(myTokens));
        }
      } catch (err) {
        console.error('동반자 모집글 저장 실패:', err);
      }
    })();
  };

  const updateMatchStatus = (id: string, status: '모집중' | '마감') => {
    setMatches(prev =>
      prev.map(m =>
        m.id === id
          ? {
              ...m,
              status,
              closedAt: status === '마감' ? new Date().toISOString() : undefined
            }
          : m
      )
    );
    fetch(`/api/matches/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch(err => console.error('상태 변경 실패:', err));
  };

  const deleteMatch = (id: string) => {
    if (!window.confirm('동호회 모집글을 삭제하시겠습니까?')) return;
    setMatches(prev => prev.filter(m => m.id !== id));

    const myTokens = JSON.parse(localStorage.getItem(STORAGE_KEYS.MY_MATCH_TOKENS) || '{}');
    const myToken = myTokens[id];

    if (myToken) {
      // 내가 쓴 글이면, 관리자 로그인 없이 본인 확인 토큰으로 즉시 삭제합니다.
      fetch(`/api/matches/${id}/self-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleteToken: myToken })
      })
        .then(() => {
          delete myTokens[id];
          localStorage.setItem(STORAGE_KEYS.MY_MATCH_TOKENS, JSON.stringify(myTokens));
        })
        .catch(err => console.error('삭제 실패:', err));
    } else {
      // 내 글이 아니면(=관리자가 다른 사람 글을 정리하는 경우) 관리자 인증이 필요합니다.
      fetch(`/api/matches/${id}`, { method: 'DELETE', headers: adminAuthHeaders() }).catch(err => console.error('삭제 실패:', err));
    }
  };

  const addMatchComment = (postId: string, comment: { authorName: string; authorPhone?: string; content: string }) => {
    const moderation = validatePostContent({
      authorName: comment.authorName,
      authorPhone: comment.authorPhone,
      content: comment.content
    });

    if (!moderation.isValid) {
      console.warn('Blocked inappropriate comment:', moderation.reason);
      alert(moderation.reason || '등록할 수 없는 내용이 포함되어 있습니다.');
      return;
    }

    const optimisticComment = {
      id: `c-${Date.now()}`,
      postId,
      authorName: comment.authorName,
      authorPhone: comment.authorPhone,
      content: comment.content,
      createdAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };
    setMatches(prev =>
      prev.map(m => (m.id === postId ? { ...m, comments: [...m.comments, optimisticComment] } : m))
    );

    fetch(`/api/matches/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment)
    }).catch(err => console.error('댓글 저장 실패:', err));
  };

  // Ad CRUD
  const addAd = (adData: Omit<AdItem, 'id'>) => {
    const optimisticId = `ad-${Date.now()}`;
    const optimisticAd: AdItem = { ...adData, id: optimisticId };
    setAds(prev => [optimisticAd, ...prev]);

    (async () => {
      try {
        const res = await fetch('/api/ads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...adminAuthHeaders() },
          body: JSON.stringify(adData)
        });
        if (!res.ok) {
          setAds(prev => prev.filter(a => a.id !== optimisticId));
          return;
        }
        const data = await res.json();
        setAds(prev => prev.map(a => (a.id === optimisticId ? data.ad : a)));
      } catch (err) {
        console.error('광고 저장 실패:', err);
      }
    })();
  };

  const updateAd = (id: string, updated: Partial<AdItem>) => {
    setAds(prev => prev.map(a => (a.id === id ? { ...a, ...updated } : a)));
    fetch(`/api/ads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...adminAuthHeaders() },
      body: JSON.stringify(updated)
    }).catch(err => console.error('광고 수정 실패:', err));
  };

  const deleteAd = (id: string) => {
    if (window.confirm('광고/업체 정보를 삭제하시겠습니까?')) {
      setAds(prev => prev.filter(a => a.id !== id));
      fetch(`/api/ads/${id}`, { method: 'DELETE', headers: adminAuthHeaders() }).catch(err => console.error('광고 삭제 실패:', err));
    }
  };

  const toggleAdStatus = (id: string) => {
    setAds(prev => {
      const target = prev.find(a => a.id === id);
      if (target) {
        fetch(`/api/ads/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', ...adminAuthHeaders() },
          body: JSON.stringify({ isActive: !target.isActive })
        }).catch(err => console.error('광고 상태 변경 실패:', err));
      }
      return prev.map(a => (a.id === id ? { ...a, isActive: !a.isActive } : a));
    });
  };

  // 쿠팡파트너스 상품 CRUD (등록·삭제는 관리자만 가능 — 서버에서도 requireAdmin으로 이중 검증)
  const addCoupangProduct = async (productData: Omit<CoupangProduct, 'id'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/coupang-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...adminAuthHeaders() },
        body: JSON.stringify(productData)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || '상품 등록에 실패했습니다.');
        return false;
      }
      const data = await res.json();
      setCoupangProducts(prev => [data.product, ...prev]);
      return true;
    } catch (err) {
      console.error('쿠팡 상품 등록 실패:', err);
      alert('상품 등록 중 오류가 발생했습니다.');
      return false;
    }
  };

  const deleteCoupangProduct = (id: string) => {
    if (!window.confirm('이 상품을 목록에서 삭제하시겠습니까?')) return;
    setCoupangProducts(prev => prev.filter(p => p.id !== id));
    fetch(`/api/coupang-products/${id}`, { method: 'DELETE', headers: adminAuthHeaders() }).catch(err =>
      console.error('상품 삭제 실패:', err)
    );
  };

  return (
    <ParkGolfContext.Provider
      value={{
        courses,
        tournaments,
        news,
        reviews,
        matches,
        ads,
        activeTab,
        setActiveTab,
        fontSize,
        setFontSize,
        searchQuery,
        setSearchQuery,
        selectedRegion,
        setSelectedRegion,
        filterHoles,
        setFilterHoles,
        filterReservation,
        setFilterReservation,
        filterParkingOnly,
        setFilterParkingOnly,
        activeModal,
        openModal,
        closeModal,
        isSpeaking,
        speakText,
        stopSpeaking,
        isAdmin,
        loginAdmin,
        logoutAdmin,
        resetToDefaultData,
        exportDataAsJson,
        importDataFromJson,
        addCourse,
        updateCourse,
        deleteCourse,
        addTournament,
        updateTournament,
        deleteTournament,
        addNews,
        updateNews,
        deleteNews,
        addReview,
        deleteReview,
        addMatch,
        updateMatchStatus,
        deleteMatch,
        isMyMatch,
        addMatchComment,
        addAd,
        updateAd,
        deleteAd,
        toggleAdStatus,
        coupangProducts,
        addCoupangProduct,
        deleteCoupangProduct
      }}
    >
      {children}
    </ParkGolfContext.Provider>
  );
};

export const useParkGolf = () => {
  const context = useContext(ParkGolfContext);
  if (!context) {
    throw new Error('useParkGolf must be used within a ParkGolfProvider');
  }
  return context;
};
