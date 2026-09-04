import React, { useState, useEffect } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import {
  BookOpen,
  Scale,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Send,
  ExternalLink,
  MessageSquare,
  Sparkles,
  CheckCircle,
  HelpCircle,
  PhoneCall,
  Mail,
  Building,
  Layers,
  Award
} from 'lucide-react';

export const AssociationRulesGuideSection: React.FC = () => {
  const { speakText, courses, tournaments, reviews, matches, news } = useParkGolf();
  const [activeSubTab, setActiveSubTab] = useState<'kpgaRules' | 'terms' | 'privacy' | 'dataForm'>('kpgaRules');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  // Listen to custom events to switch subtabs directly from other sections
  useEffect(() => {
    const handleSwitchSubTab = (e: CustomEvent<string>) => {
      if (e.detail && ['kpgaRules', 'terms', 'privacy', 'dataForm'].includes(e.detail)) {
        setActiveSubTab(e.detail as 'kpgaRules' | 'terms' | 'privacy' | 'dataForm');
      }
    };

    window.addEventListener('open-rules-subtab' as any, handleSwitchSubTab);
    return () => {
      window.removeEventListener('open-rules-subtab' as any, handleSwitchSubTab);
    };
  }, []);

  // One-click site snapshot transmission to Formspree
  const handleSendSiteSnapshot = async () => {
    setSyncStatus('syncing');
    try {
      const response = await fetch('https://formspree.io/f/mdeozjog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `[파크골프마당] 사이트 전체 완성 데이터 수집 백업 (${new Date().toLocaleDateString('ko-KR')})`,
          dataType: '완성 사이트 종합 데이터 수집',
          timestamp: new Date().toISOString(),
          formattedDate: new Date().toLocaleString('ko-KR'),
          siteStats: {
            totalCourses: courses.length,
            totalTournaments: tournaments.length,
            totalNewsAndGuides: news.length,
            totalReviews: reviews.length,
            totalActiveMatches: matches.filter(m => m.status === '모집중').length,
            systemVersion: '2026.09 Final Production'
          },
          summary: `전국 ${courses.length}개 파크골프장 제원, ${tournaments.length}개 대회 일정 및 협회 공식 규정 데이터가 정상 구축 및 업데이트되었습니다.`,
          source: '파크골프마당 자동 데이터 수집기 (https://formspree.io/f/mdeozjog)'
        })
      });

      if (response.ok) {
        setSyncStatus('synced');
        setTimeout(() => setSyncStatus('idle'), 6000);
      } else {
        setSyncStatus('error');
        setTimeout(() => setSyncStatus('idle'), 5000);
      }
    } catch (e) {
      console.error('Site sync error:', e);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 5000);
    }
  };

  // Formspree State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: '신규 구장 정보 제보/수정',
    title: '',
    message: '',
    region: '전국',
    agreeConsent: true,
  });

  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitFormspree = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.message.trim()) {
      alert('성함(닉네임)과 상세 내용을 입력해 주세요.');
      return;
    }

    if (!formData.agreeConsent) {
      alert('개인정보 수집 및 이용에 동의해 주셔야 접수가 가능합니다.');
      return;
    }

    setFormStatus('submitting');
    setErrorMessage('');

    try {
      const subjectText = formData.title.trim()
        ? `[파크골프마당 ${formData.category}] ${formData.title}`
        : `[파크골프마당] ${formData.category} (${formData.region}) - ${formData.name}님 접수건`;

      const response = await fetch('https://formspree.io/f/mdeozjog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: subjectText,
          _replyto: formData.email || undefined,
          name: formData.name,
          phone: formData.phone || '미입력',
          email: formData.email || '미입력',
          category: formData.category,
          region: formData.region,
          title: formData.title || `[${formData.category}] 파크골프마당 접수건`,
          message: formData.message,
          submittedAt: new Date().toLocaleString('ko-KR'),
          source: '파크골프마당 웹사이트 데이터 수집 센터 (https://formspree.io/f/mdeozjog)'
        })
      });

      if (response.ok) {
        setFormStatus('success');
        setFormData({
          name: '',
          phone: '',
          email: '',
          category: '신규 구장 정보 제보/수정',
          title: '',
          message: '',
          region: '전국',
          agreeConsent: true,
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setFormStatus('error');
        setErrorMessage(errorData?.error || '데이터 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } catch (err) {
      console.error('Formspree submit error:', err);
      setFormStatus('error');
      setErrorMessage('네트워크 연결 문제로 전송에 실패했습니다. 인터넷 상태를 확인해 주세요.');
    }
  };

  return (
    <section id="section-rules" className="py-14 px-3 sm:px-6 max-w-7xl mx-auto w-full">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-green-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs sm:text-sm font-extrabold mb-2">
            <BookOpen className="w-4 h-4 text-emerald-800" />
            <span>협회 규정 및 웹사이트 데이터 수집·문의 센터</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            협회 규정 · 이용안내 및 데이터 제보
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 mt-1 font-medium leading-relaxed">
            대한파크골프협회 공인 규칙, 이용약관, 개인정보처리방침 열람 및 신규 구장·대회 데이터 실시간 제보 접수처
          </p>
        </div>

        {/* Quick Help Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://koreaparkgolf.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-green-800 hover:bg-green-900 text-white text-xs sm:text-sm font-bold shadow-md transition-all"
          >
            <Building className="w-4 h-4 text-amber-300" />
            <span>대한파크골프협회 본회 바로가기</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Sub-Category Navigation Tabs */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-3 mb-6">
        <button
          onClick={() => setActiveSubTab('kpgaRules')}
          className={`px-4 sm:px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm md:text-base flex items-center gap-2 whitespace-nowrap transition-all shadow-xs ${
            activeSubTab === 'kpgaRules'
              ? 'bg-green-800 text-white shadow-md ring-2 ring-green-600'
              : 'bg-white text-slate-700 hover:bg-green-50 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-300" />
          <span>대한파크골프협회 공식 규정</span>
        </button>

        <button
          onClick={() => setActiveSubTab('dataForm')}
          className={`px-4 sm:px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm md:text-base flex items-center gap-2 whitespace-nowrap transition-all shadow-xs ${
            activeSubTab === 'dataForm'
              ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-500'
              : 'bg-amber-50 text-amber-950 hover:bg-amber-100 border border-amber-300 font-extrabold'
          }`}
        >
          <Send className="w-4 h-4 text-amber-300" />
          <span>데이터 수집 · 제보 접수처</span>
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-800 text-amber-100">실시간 연동</span>
        </button>

        <button
          onClick={() => setActiveSubTab('terms')}
          className={`px-4 sm:px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm md:text-base flex items-center gap-2 whitespace-nowrap transition-all shadow-xs ${
            activeSubTab === 'terms'
              ? 'bg-green-800 text-white shadow-md ring-2 ring-green-600'
              : 'bg-white text-slate-700 hover:bg-green-50 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>이용약관</span>
        </button>

        <button
          onClick={() => setActiveSubTab('privacy')}
          className={`px-4 sm:px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm md:text-base flex items-center gap-2 whitespace-nowrap transition-all shadow-xs ${
            activeSubTab === 'privacy'
              ? 'bg-green-800 text-white shadow-md ring-2 ring-green-600'
              : 'bg-white text-slate-700 hover:bg-green-50 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>개인정보처리방침</span>
        </button>
      </div>

      {/* Main Content Box */}
      <div className="bg-white rounded-3xl border-2 border-green-200 shadow-xl overflow-hidden">
        {/* SUBTAB 1: 대한파크골프협회 공식 규정 */}
        {activeSubTab === 'kpgaRules' && (
          <div className="p-5 sm:p-8 space-y-8 animate-fadeIn">
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-green-900 via-emerald-800 to-green-950 text-white p-5 sm:p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-900 text-xs font-black">
                    공인 표준 규칙
                  </span>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black">
                    (사)대한파크골프협회 공인 경기 규칙 및 용품 제원
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-green-100">
                  전국 파크골프장 이용 및 공인 대회 출전 시 준수해야 하는 경기 규칙과 에티켓입니다.
                </p>
              </div>
              <button
                onClick={() => speakText('대한파크골프협회 공인 경기 규칙 및 용품 제원 안내입니다.')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 border border-white/30 transition-all shrink-0"
              >
                <span>🔊 음성으로 듣기</span>
              </button>
            </div>

            {/* 1. 용품 규격 Grid */}
            <div className="space-y-4">
              <h4 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-green-700" />
                <span>1. 공인 클럽(채) 및 공인 볼 규격 기준</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                    <span className="font-extrabold text-slate-900 text-base">🏌️ 파크골프 공인 클럽 (1개만 사용)</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-green-100 text-green-800">KPGA 공인마크</span>
                  </div>
                  <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5 list-disc pl-4 leading-relaxed">
                    <li><strong>길이</strong>: 총길이 86cm 이하 (헤드 바닥부터 샤프트/그립 끝단까지)</li>
                    <li><strong>중량</strong>: 총중량 600g 이하 (여성용 510~530g, 남성용 530~550g 권장)</li>
                    <li><strong>로프트 각도</strong>: 0도 (공을 띄우지 않고 굴리는 직각 페이스 구조)</li>
                    <li><strong>헤드 재질</strong>: 감나무(Persimmon), 단풍나무, 물푸레나무 등 천연 목재</li>
                    <li><strong>페이스 재질</strong>: 카본 섬유, 황동(Brass), 고경도 합성수지 허용</li>
                  </ul>
                </div>

                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                    <span className="font-extrabold text-slate-900 text-base">⚪ 파크골프 공인 볼 (Ball)</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-amber-100 text-amber-800">1~4피스 구조</span>
                  </div>
                  <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5 list-disc pl-4 leading-relaxed">
                    <li><strong>직경(크기)</strong>: 6cm (±0.5mm) - 일반 골프공(4.27cm)보다 큼</li>
                    <li><strong>무게</strong>: 80g ~ 95g 이내</li>
                    <li><strong>재질</strong>: 특수 합성수지 플라스틱 성형 (초보자 1~2피스, 상급자 3~4피스)</li>
                    <li><strong>특징</strong>: 탄성이 뛰어나며 타구음이 경쾌하고 잔디 및 주변 파손 위험이 적음</li>
                    <li><strong>공인 인증</strong>: 대한파크골프협회 검정 각인 필수</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 2. 코스 제원 및 정규 타수 */}
            <div className="space-y-4">
              <h4 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-700" />
                <span>2. 코스 제원 및 정규 타수 (Par 33 / Par 66)</span>
              </h4>
              <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
                <p className="text-xs sm:text-sm text-slate-700 font-medium">
                  파크골프장은 통상 9홀(A코스, B코스 등) 단위로 구성되며, 9홀 기준 기준타수는 <strong>Par 33</strong>입니다 (18홀 기준 Par 66, 약 1,200m).
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 bg-white rounded-xl border border-emerald-200 text-center shadow-xs">
                    <div className="font-black text-green-800 text-sm sm:text-base">Par 3 (숏홀)</div>
                    <div className="text-xs text-slate-500 mt-1">거리 40m ~ 60m</div>
                    <div className="text-[11px] font-bold text-green-700 mt-1">9홀 중 4개 홀 배치</div>
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-amber-200 text-center shadow-xs">
                    <div className="font-black text-amber-800 text-sm sm:text-base">Par 4 (미들홀)</div>
                    <div className="text-xs text-slate-500 mt-1">거리 60m ~ 100m</div>
                    <div className="text-[11px] font-bold text-amber-700 mt-1">9홀 중 4개 홀 배치</div>
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-red-200 text-center shadow-xs">
                    <div className="font-black text-red-800 text-sm sm:text-base">Par 5 (롱홀)</div>
                    <div className="text-xs text-slate-500 mt-1">거리 100m ~ 150m</div>
                    <div className="text-[11px] font-bold text-red-700 mt-1">9홀 중 1개 홀 배치</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 주요 경기 규칙 및 벌타 */}
            <div className="space-y-4">
              <h4 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>3. 핵심 경기 규칙 및 벌타 판정 기준</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 bg-red-50 rounded-2xl border border-red-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-red-800 text-sm sm:text-base">🚨 OB (Out of Bounds)</span>
                    <span className="text-xs font-black text-red-600 bg-red-100 px-2 py-0.5 rounded">2벌타</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    백색 말뚝(OB선) 밖으로 나간 경우 2벌타 가산 후, 나간 지점에서 깃대에 가깝지 않게 2클럽 이내에 드롭/플레이스하고 다음 샷 진행.
                  </p>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-amber-900 text-sm sm:text-base">💨 헛스윙 (Miss Shot)</span>
                    <span className="text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded">0타 (타수 무효)</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    공을 치려 했으나 닿지 않은 헛스윙은 타수에 가산하지 않습니다. (단, 공이 미세하게라도 움직이면 1타로 인정).
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-blue-900 text-sm sm:text-base">📍 볼 마크 (Ball Mark)</span>
                    <span className="text-xs font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded">에티켓 준수</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    동반자의 퍼팅 경로를 방해하거나 깃대 20m 이내일 때 요청 시 마커를 공 뒤쪽에 두고 볼을 집어올려야 합니다.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-emerald-900 text-sm sm:text-base">👟 안전 및 복장 수칙</span>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">필수 준수</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    앞 조가 홀아웃하기 전 티샷 절대 금지, 모자 및 운동화/골프화 착용, 벙커 탈출 후 발자국 정리 필수.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: 웹사이트 데이터 수집 및 제보·문의 (Formspree 실시간 연동) */}
        {activeSubTab === 'dataForm' && (
          <div className="p-5 sm:p-8 space-y-8 animate-fadeIn">
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white p-5 sm:p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-amber-950 text-amber-200 text-xs font-black">
                    실시간 데이터 수집
                  </span>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black">
                    파크골프마당 웹사이트 데이터 수집 & 제보 센터
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-amber-100">
                  전국 신규 파크골프장 개장 제보, 지자체 대회 일정 등록 요청, 제휴 및 개선 의견을 실시간 접수합니다.
                </p>
              </div>
              <div className="text-xs bg-black/20 p-2.5 rounded-xl border border-white/20 shrink-0 font-medium">
                <div>📬 접수처: Formspree 실시간 전송</div>
                <div className="text-amber-200 font-bold">운영팀 24시간 내 확인</div>
              </div>
            </div>

            {/* Submission Status Message */}
            {formStatus === 'success' && (
              <div className="p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-400 text-center space-y-3 animate-fadeIn">
                <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-emerald-950">
                  데이터가 성공적으로 안전하게 전송되었습니다!
                </h4>
                <p className="text-sm text-slate-700 max-w-lg mx-auto leading-relaxed">
                  보내주신 소중한 정보는 파크골프마당 운영팀에 실시간(Formspree)으로 안전하게 전달되었습니다. 검토 후 사이트 데이터에 신속하게 반영하도록 하겠습니다. 감사합니다.
                </p>
                <button
                  onClick={() => setFormStatus('idle')}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-all shadow-xs"
                >
                  추가 데이터 제보하기
                </button>
              </div>
            )}

            {formStatus === 'error' && (
              <div className="p-4 bg-red-50 rounded-2xl border border-red-300 flex items-start gap-3 text-red-800 text-sm">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">데이터 전송 중 문제가 발생하였습니다.</div>
                  <div className="text-xs text-red-700 mt-0.5">{errorMessage}</div>
                </div>
              </div>
            )}

            {/* One-Click Site Snapshot Transmission Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-green-950 text-white shadow-lg border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-xs font-black">
                    ⚡ 사이트 완성 데이터 종합 수집
                  </span>
                  <span className="text-xs text-emerald-300 font-bold">
                    Formspree 실시간 동기화
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-black tracking-tight text-white">
                  현재까지 완성된 사이트 전체 데이터 요약 수집 & 전송
                </h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  전국 {courses.length}개 구장 제원, {tournaments.length}개 대회 일정, 협회 규정 데이터를 https://formspree.io/f/mdeozjog 로 즉시 백업 전송합니다.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSendSiteSnapshot}
                disabled={syncStatus === 'syncing'}
                className="w-full md:w-auto px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-60"
              >
                {syncStatus === 'syncing' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>데이터 수집 전송 중...</span>
                  </>
                ) : syncStatus === 'synced' ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-800" />
                    <span>수집 전송 완료! (Formspree)</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-slate-950" />
                    <span>현재 사이트 데이터 수집 전송하기</span>
                  </>
                )}
              </button>
            </div>

            {/* Interactive Data Collection Form */}
            {formStatus !== 'success' && (
              <form onSubmit={handleSubmitFormspree} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Category Selection */}
                  <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                    <label className="block text-xs sm:text-sm font-extrabold text-slate-900">
                      1. 제보 및 데이터 수집 분류 <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-stone-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:bg-white focus:border-green-600 focus:outline-hidden"
                    >
                      <option value="신규 구장 정보 제보/수정">📍 신규 구장 개장 정보 제보 / 기존 정보 수정</option>
                      <option value="전국 대회 일정 등록 요청">🏆 전국 대회 일정 및 요강 등록 요청</option>
                      <option value="지자체/협회 데이터 연동 문의">🏛️ 지자체 · 지역 협회 공공데이터 연동 제휴</option>
                      <option value="동호회/용품점 제휴 문의">⛳ 파크골프 동호회 / 용품점 입점 광고 제휴</option>
                      <option value="웹사이트 기능 개선 제안">💡 웹사이트 개선 제안 및 아이디어</option>
                      <option value="기타 일반 문의">💬 기타 일반 문의</option>
                    </select>
                  </div>

                  {/* Region Selection */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-extrabold text-slate-900">
                      2. 관련 지역
                    </label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-stone-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-green-600 focus:outline-hidden"
                    >
                      <option value="전국">전국 (공통)</option>
                      <option value="서울">서울특별시</option>
                      <option value="경기">경기도</option>
                      <option value="인천">인천광역시</option>
                      <option value="강원">강원특별자치도</option>
                      <option value="충북">충청북도</option>
                      <option value="충남/대전/세종">충남 / 대전 / 세종</option>
                      <option value="전북">전북특별자치도</option>
                      <option value="전남/광주">전남 / 광주광역시</option>
                      <option value="경북/대구">경북 / 대구광역시</option>
                      <option value="경남/부산/울산">경남 / 부산 / 울산</option>
                      <option value="제주">제주특별자치도</option>
                    </select>
                  </div>

                  {/* Sender Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-extrabold text-slate-900">
                      3. 제보자 성함 또는 닉네임 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="예: 홍길동 (또는 서울파크동호회)"
                      required
                      className="w-full p-3 bg-stone-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-green-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-extrabold text-slate-900">
                      4. 연락처 (전화번호)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="예: 010-1234-5678"
                      className="w-full p-3 bg-stone-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-green-600 focus:outline-hidden"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-extrabold text-slate-900">
                      5. 이메일 주소 (답변 수신용)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="예: parkgolf@example.com"
                      className="w-full p-3 bg-stone-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-green-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-extrabold text-slate-900">
                    6. 제보 / 문의 제목
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="예: [신규 구장 제보] 춘천시 삼천동 파크골프장 18홀 신설 개장 안내"
                    className="w-full p-3 bg-stone-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-green-600 focus:outline-hidden"
                  />
                </div>

                {/* Message Body */}
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-extrabold text-slate-900">
                    7. 제보할 상세 내용 및 링크/주소 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="구장명, 위치 주소, 홀 수(18홀/36홀), 이용료(무료/유료), 예약 방법 또는 대회 일정, 참가 자격 요강 등을 상세히 적어주시면 신속하게 사이트에 검토 후 반영됩니다."
                    className="w-full p-3.5 bg-stone-50 border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-green-600 focus:outline-hidden leading-relaxed"
                  />
                </div>

                {/* Privacy Checkbox */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="agreeConsent"
                    name="agreeConsent"
                    checked={formData.agreeConsent}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 rounded text-green-700 focus:ring-green-600"
                  />
                  <label htmlFor="agreeConsent" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
                    <strong className="text-slate-900 font-bold">[필수] 개인정보 수집 및 이용 동의 : </strong>
                    기재해주신 성함, 연락처 및 제보 내용은 파크골프마당 웹사이트의 구장/대회 데이터 검증 및 답변 목적으로만 안전하게 처리되며 제3자에게 제공되지 않습니다.
                  </label>
                </div>

                {/* Submit Action Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-green-700 shrink-0" />
                    <span>전송 엔드포인트: Formspree 암호화 보안 전송 (https://formspree.io/f/mdeozjog)</span>
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
                  >
                    {formStatus === 'submitting' ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>데이터 전송 중...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-amber-200" />
                        <span>데이터 전송하기 (실시간 접수)</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* SUBTAB 3: 서비스 이용약관 */}
        {activeSubTab === 'terms' && (
          <div className="p-5 sm:p-8 space-y-6 animate-fadeIn text-slate-700 text-xs sm:text-sm leading-relaxed">
            <div className="bg-green-50 p-4 rounded-2xl border border-green-200 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-green-950 text-base">파크골프마당 서비스 이용약관</h3>
                <p className="text-xs text-green-800">최종 개정일: 2026년 1월 1일</p>
              </div>
            </div>

            <div className="space-y-4">
              <section className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">제 1 조 (목적)</h4>
                <p className="text-slate-600 pl-3">
                  본 약관은 ‘파크골프마당’(이하 “회사”)이 제공하는 전국 파크골프장 위치 및 제원 정보, 전국 대회 일정 안내, 동호인 라운딩 매칭 및 리뷰 커뮤니티 등 서비스의 이용 조건 및 절차에 관한 기본 사항을 정함을 목적으로 합니다.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">제 2 조 (서비스의 범위 및 정보의 성격)</h4>
                <p className="text-slate-600 pl-3">
                  1. 회사는 공공데이터 및 협회 공고를 기반으로 전국 파크골프장과 대회 정보를 무료로 제공합니다.<br />
                  2. 구장 예약 및 대회 참가 접수는 각 지자체 관리기관 및 대회 주최측의 공식 전산망을 통해 이루어집니다.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">제 3 조 (동반자 매칭 및 게시물 에티켓)</h4>
                <p className="text-slate-600 pl-3">
                  1. 이용자는 타인을 비방하거나 허위 사실, 상업적 스팸 홍보물을 게시하여서는 안 됩니다.<br />
                  2. 라운딩 매칭을 통해 이루어지는 모임은 동호인 간의 자율적 신뢰를 원칙으로 하며, 안전 수칙을 철저히 준수하여야 합니다.
                </p>
              </section>
            </div>
          </div>
        )}

        {/* SUBTAB 4: 개인정보처리방침 */}
        {activeSubTab === 'privacy' && (
          <div className="p-5 sm:p-8 space-y-6 animate-fadeIn text-slate-700 text-xs sm:text-sm leading-relaxed">
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-emerald-950 text-base">개인정보처리방침 (개인정보 보호법 준수)</h3>
                <p className="text-xs text-emerald-800">책임관: 1588-7282 | 담당부서: 운영지원팀</p>
              </div>
            </div>

            <div className="space-y-4">
              <section className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">1. 수집하는 개인정보의 최소화</h4>
                <p className="text-slate-600 pl-3">
                  파크골프마당은 주민등록번호 등 민감 정보를 일절 수집하지 않으며, 동반자 모집 등록 및 데이터 제보 양식 접수 시 기재되는 성함/닉네임, 연락처(선택), 이메일에 한해 수집합니다.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">2. 개인정보의 보유 및 파기</h4>
                <p className="text-slate-600 pl-3">
                  동반자 모집 마감 시 즉시 파기하거나, 작성자의 삭제 요청 시 지체 없이 영구 삭제 처리합니다. Formspree를 통해 접수된 제보 데이터는 검토 완료 후 안전하게 보관 및 관리됩니다.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">3. 개인정보 제3자 제공 금지</h4>
                <p className="text-slate-600 pl-3">
                  회사는 이용자의 동의 없이 개인정보를 외부에 유출하거나 마케팅 목적으로 제3자에게 판매/제공하지 않습니다.
                </p>
              </section>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
