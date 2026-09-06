import React, { useState, useEffect } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { X, ShieldCheck, FileText, BookOpen, ExternalLink, CheckCircle2, AlertTriangle, Scale, Volume2 } from 'lucide-react';

export const PolicyRulesModal: React.FC = () => {
  const { activeModal, closeModal, speakText } = useParkGolf();
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'kpgaRules'>('terms');

  useEffect(() => {
    if (activeModal?.type === 'policy' && activeModal.data?.tab) {
      setActiveTab(activeModal.data.tab);
    }
  }, [activeModal]);

  if (activeModal?.type !== 'policy') return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="policy-modal-title"
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-green-200 animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-green-900 via-emerald-800 to-green-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 id="policy-modal-title" className="text-xl sm:text-2xl font-black text-white">
                포털 이용안내 & 공인 규정집
              </h2>
              <p className="text-xs sm:text-sm text-green-200 mt-0.5 font-medium">
                파크골프마당 약관, 개인정보 보호 및 대한파크골프협회 공식 경기 수칙
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-hidden"
            aria-label="창 닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 gap-2 sm:gap-4 shrink-0 overflow-x-auto no-scrollbar pt-3">
          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm md:text-base font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'terms'
                ? 'border-green-700 text-green-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>이용약관</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm md:text-base font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'border-green-700 text-green-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>개인정보처리방침</span>
          </button>

          <button
            onClick={() => setActiveTab('kpgaRules')}
            className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm md:text-base font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'kpgaRules'
                ? 'border-green-700 text-green-800 bg-green-50/60 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span className="text-green-950 font-extrabold">대한파크골프협회 규정 안내</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
          {/* TAB 1: 이용약관 */}
          {activeTab === 'terms' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-green-50 p-4 rounded-2xl border border-green-200 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-green-950 text-base">파크골프마당 서비스 이용약관</div>
                  <div className="text-xs text-green-800">시행일자: 2026년 1월 1일 | 버전 1.2</div>
                </div>
                <button
                  onClick={() => speakText('파크골프마당 서비스 이용약관 주요 내용을 음성으로 안내합니다.')}
                  className="px-3 py-1.5 rounded-xl bg-green-700 text-white text-xs font-bold flex items-center gap-1 hover:bg-green-800 transition-colors shrink-0"
                >
                  <Volume2 className="w-3.5 h-3.5" /> 음성 안내
                </button>
              </div>

              <section className="space-y-2">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-600" /> 제 1 조 (목적)
                </h3>
                <p className="text-slate-600 text-sm sm:text-base pl-4">
                  본 약관은 ‘파크골프마당’(이하 “회사” 또는 “서비스”)이 제공하는 전국 파크골프장 정보 검색, 전국 대회 일정 안내, 동반자 라운딩 매칭 및 리뷰 등록 등 제반 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-600" /> 제 2 조 (서비스의 제공 및 변경)
                </h3>
                <div className="text-slate-600 text-sm sm:text-base pl-4 space-y-1.5">
                  <p>1. 회사는 이용자에게 아래와 같은 서비스를 무료로 제공합니다:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li>전국 지자체 직영 및 공공 파크골프장 위치, 홀수, 예약방식, 이용료 안내</li>
                    <li>대한파크골프협회 및 전국 시·도 협회 공인 대회 일정 및 접수처 안내</li>
                    <li>파크골프 생생 구장 이용 후기 및 별점 평가 커뮤니티</li>
                    <li>지역별·요일별 라운딩 동반자(조편성) 자율 모집 및 댓글 매칭 서비스</li>
                    <li>파크골프 최신 뉴스, 기초 레슨, 공인 용품 제휴 정보 제공</li>
                  </ul>
                  <p className="text-xs text-amber-800 font-bold bg-amber-50 p-2.5 rounded-xl border border-amber-200 mt-2">
                    ※ 구장 예약 및 대회 참가 접수는 각 지자체 관리부서 및 주최 협회 공식 사이트에서 직접 진행됩니다.
                  </p>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-600" /> 제 3 조 (이용자의 의무 및 게시물 관리)
                </h3>
                <div className="text-slate-600 text-sm sm:text-base pl-4 space-y-1">
                  <p>1. 이용자는 동반자 모집 및 리뷰 작성 시 타인의 명예를 훼손하거나 거짓 정보를 게시하여서는 안 됩니다.</p>
                  <p>2. 타인의 전화번호를 무단 도용하거나 상업적 스팸 광고성 글을 등록할 경우 사전 통보 없이 삭제 조치될 수 있습니다.</p>
                  <p>3. 안전한 라운딩을 위해 약속된 매너와 에티켓을 준수하여야 합니다.</p>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-600" /> 제 4 조 (면책 조항)
                </h3>
                <div className="text-slate-600 text-sm sm:text-base pl-4 space-y-1">
                  <p>1. 회사는 천재지변, 지자체 공사, 우천 연기 등으로 인한 구장 휴장 또는 대회 일정 변동에 대해 고의 또는 중과실이 없는 한 책임을 지지 않습니다.</p>
                  <p>2. 동반자 매칭을 통해 이루어지는 개인 간 라운딩 약속 및 현장 발생 사고는 당사자 간의 신의성실 원칙에 따라 해결합니다.</p>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-600" /> 제 5 조 (회원가입 및 자격)
                </h3>
                <div className="text-slate-600 text-sm sm:text-base pl-4 space-y-1.5">
                  <p>1. 구장 리뷰·동반자 모집·맛집 등록 등 게시물 작성은 회원가입 후 이용할 수 있으며, 비회원도 모든 게시물 열람은 자유롭게 가능합니다.</p>
                  <p>2. 회원가입 시 이름·휴대폰번호는 분쟁 발생 시 본인확인 용도로만 사용되며, 사이트에는 회원이 직접 정한 닉네임만 공개됩니다.</p>
                  <p>3. 타인의 명의를 도용하거나 허위 정보로 가입한 사실이 확인될 경우, 회사는 사전 통지 없이 이용을 제한할 수 있습니다.</p>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-600" /> 제 6 조 (마당P 및 마당P 장터 운영)
                </h3>
                <div className="text-slate-600 text-sm sm:text-base pl-4 space-y-1.5">
                  <p>1. "마당P"는 회원가입 및 게시물 작성 등 서비스 내 활동에 대해 회사가 지급하는 활동 포인트로, 현금으로 환급되지 않으며 타인에게 양도·판매할 수 없습니다.</p>
                  <p>2. 마당P 장터의 상품은 실제 결제·자동발송이 아니라, 회원의 교환 신청을 회사가 확인한 뒤 순차적으로 발송하는 방식으로 운영되며, 상품 재고 상황에 따라 교환 가능 상품 구성이나 필요 포인트는 사전 고지 후 변경될 수 있습니다.</p>
                  <p>3. 부정한 방법(중복 가입, 허위 게시물 반복 등)으로 적립된 마당P는 사전 통지 후 회수될 수 있습니다.</p>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: 개인정보처리방침 */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-emerald-950 text-base">개인정보처리방침 (개인정보 보호법 준수)</div>
                  <div className="text-xs text-emerald-800">시행일자: 2026년 1월 1일 | 정보보호 문의: pjm0620@naver.com</div>
                </div>
                <button
                  onClick={() => speakText('파크골프마당 개인정보처리방침입니다. 고객님의 소중한 개인정보를 안전하게 보호하고 있습니다.')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 hover:bg-emerald-800 transition-colors shrink-0"
                >
                  <Volume2 className="w-3.5 h-3.5" /> 음성 안내
                </button>
              </div>

              <section className="space-y-2">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" /> 1. 수집하는 개인정보 항목 및 수집 방법
                </h3>
                <div className="text-slate-600 text-sm sm:text-base pl-4 space-y-2">
                  <p>파크골프마당은 주민등록번호와 같은 민감정보는 일절 수집하지 않으며, 회원가입 및 서비스 제공에 필요한 최소한의 정보만 수집합니다.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">✅ 회원가입 시 필수 항목</div>
                      <div className="text-xs text-slate-600 mt-1">
                        이름, 휴대폰번호(본인확인용, 비공개), 닉네임(공개), 비밀번호(암호화 저장)
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">📝 회원가입 시 선택 항목</div>
                      <div className="text-xs text-slate-600 mt-1">주요 이용 지역, 평균 타수</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">🎁 마당P 상품 교환 신청 시</div>
                      <div className="text-xs text-slate-600 mt-1">신청 회원의 닉네임·휴대폰번호(발송 연락용, 자동 처리되지 않고 운영팀이 직접 확인 후 연락)</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">⭐ 게시물 작성 시(회원)</div>
                      <div className="text-xs text-slate-600 mt-1">작성자 닉네임, 별점·후기 내용, 동반자 모집 시 회신 연락처(선택 기재)</div>
                    </div>
                  </div>
                  <p className="text-xs text-emerald-800 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 mt-2">
                    ※ 이름·휴대폰번호는 분쟁 발생 시 본인확인 용도로만 내부적으로 사용되며, 다른 이용자에게는 절대 공개되지 않고 닉네임만 표시됩니다.
                  </p>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" /> 2. 개인정보의 이용 목적 및 파기
                </h3>
                <div className="text-slate-600 text-sm sm:text-base pl-4 space-y-1">
                  <p>• <strong>이용 목적</strong>: 회원 식별 및 본인확인, 부정이용 방지, 마당P 적립·차감 관리, 실물 상품 교환 시 발송 연락, 파크골프 동호인 간 자율 라운딩 매칭 및 구장 후기 커뮤니티 운영</p>
                  <p>• <strong>보유 기간</strong>: 회원 탈퇴 시 지체없이 파기합니다. 다만 동반자 모집글은 모집 마감(또는 만남 날짜 경과) 후 24시간 뒤, 관련 법령에서 별도로 보관을 요구하는 경우가 아니라면 자동으로 삭제됩니다.</p>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" /> 3. 개인정보 제3자 제공 및 안전성 확보조치
                </h3>
                <div className="text-slate-600 text-sm sm:text-base pl-4 space-y-1">
                  <p>파크골프마당은 이용자의 사전 동의 없이 개인정보를 제3자 또는 외부 마케팅 업체에 절대 제공하거나 판매하지 않습니다. 비밀번호는 복호화가 불가능한 방식(암호화)으로 저장되며, 이름·휴대폰번호는 본인과 사이트 운영팀 외에는 열람할 수 없습니다.</p>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" /> 4. 이용자의 권리
                </h3>
                <p className="text-slate-600 text-sm sm:text-base pl-4">
                  회원은 언제든지 자신의 개인정보를 열람·정정하거나 회원 탈퇴(동의 철회)를 요청할 수 있으며, 아래 문의처를 통해 접수하시면 지체 없이 처리해드립니다.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" /> 5. 개인정보 보호책임자 및 고충 상담
                </h3>
                <div className="p-4 bg-slate-100 rounded-2xl text-xs sm:text-sm text-slate-700 space-y-1 border border-slate-200">
                  <div>• <strong>개인정보보호 책임자</strong>: 파크골프마당 운영지원팀</div>
                  <div>• <strong>이메일 문의</strong>: <a href="mailto:pjm0620@naver.com" className="font-bold text-green-800 underline">pjm0620@naver.com</a> (접수 후 순차적으로 답변드립니다)</div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 3: 대한파크골프협회 규정 안내 */}
          {activeTab === 'kpgaRules' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Highlight Header */}
              <div className="bg-gradient-to-r from-amber-50 via-green-50 to-emerald-50 p-4 sm:p-5 rounded-2xl border border-green-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-green-700 text-white text-xs font-bold">공식 협회 규정</span>
                    <h3 className="font-extrabold text-green-950 text-base sm:text-lg">
                      (사)대한파크골프협회 (KPGA) 공인 경기 규칙 및 용품 규격
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    전국 공인 대회 및 정규 파크골프장에서 적용되는 표준 경기 룰과 에티켓 가이드
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="https://koreaparkgolf.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-green-800 hover:bg-green-900 text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
                  >
                    <span>협회 홈페이지</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* 1. 공인 클럽 및 볼 규격 */}
              <div className="space-y-3">
                <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-green-700" />
                  <span>1. 공인 파크골프 용품(클럽 · 볼) 표준 규격</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-sm sm:text-base">🏌️ 공인 클럽 (채) 규격</span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-800">1자루만 사용</span>
                    </div>
                    <ul className="text-xs sm:text-sm text-slate-600 space-y-1 list-disc pl-4">
                      <li><strong>길이</strong>: 총길이 86cm 이하 (헤드 바닥부터 그립 끝까지)</li>
                      <li><strong>중량</strong>: 총중량 600g 이하</li>
                      <li><strong>로프트 각도</strong>: 0도 (페이스면이 직각이어야 함)</li>
                      <li><strong>재질</strong>: 헤드는 목재(감나무, 단풍나무 등), 페이스는 카본/황동/합성수지 허용</li>
                      <li><strong>인증마크</strong>: 대한파크골프협회 공인 스티커 부착 필수</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-sm sm:text-base">⚪ 공인 파크골프 볼 규격</span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">플라스틱 1~4피스</span>
                    </div>
                    <ul className="text-xs sm:text-sm text-slate-600 space-y-1 list-disc pl-4">
                      <li><strong>직경(크기)</strong>: 6cm (±0.5mm)</li>
                      <li><strong>무게</strong>: 80g ~ 95g 이내</li>
                      <li><strong>재질</strong>: 합성수지(플라스틱 성형), 내구성과 탄성력 보유</li>
                      <li><strong>타격 시 안전</strong>: 일반 골프공 대비 안전하며 잔디 손상이 적음</li>
                      <li><strong>인증</strong>: 협회 공인구 검정 필 필수</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2. 코스 규격 및 타수 기준 */}
              <div className="space-y-3">
                <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-700" />
                  <span>2. 코스 제원 및 정규 타수 (Par)</span>
                </h4>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm text-slate-700">
                  <p>• <strong>1개 코스</strong>: 9개 홀 (A, B, C, D 코스로 통상 구성, 18홀~36홀 운영)</p>
                  <p>• <strong>기준 타수 (Par 33 기준 / 9홀)</strong>:</p>
                  <div className="grid grid-cols-3 gap-2 text-center pt-1 font-bold">
                    <div className="p-2 bg-white rounded-xl border border-slate-200">
                      <div className="text-green-800">Par 3 (숏홀)</div>
                      <div className="text-xs text-slate-500 font-normal">거리 40m~60m (4개 홀)</div>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-slate-200">
                      <div className="text-amber-800">Par 4 (미들홀)</div>
                      <div className="text-xs text-slate-500 font-normal">거리 60m~100m (4개 홀)</div>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-slate-200">
                      <div className="text-red-800">Par 5 (롱홀)</div>
                      <div className="text-xs text-slate-500 font-normal">거리 100m~150m (1개 홀)</div>
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs mt-2">* 9홀 기준 500m~700m 내외, 18홀 기준 Par 66 (약 1,200m)</p>
                </div>
              </div>

              {/* 3. 주요 경기 규칙 및 벌타 요약 */}
              <div className="space-y-3">
                <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>3. 주요 경기 룰 및 벌타 규정 정리</span>
                </h4>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="p-3 bg-red-50/80 rounded-xl border border-red-200 flex items-start gap-2.5">
                    <span className="font-extrabold text-red-700 shrink-0 min-w-[65px]">[OB 2벌타]</span>
                    <span className="text-slate-700">
                      볼이 백색 말뚝(OB라인) 밖으로 나간 경우 <strong>2벌타</strong> 부여 후, 나간 지점에서 깃대와 가깝지 않게 2클럽 이내에 플레이스하고 다음 샷 진행.
                    </span>
                  </div>

                  <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 flex items-start gap-2.5">
                    <span className="font-extrabold text-amber-800 shrink-0 min-w-[65px]">[헛스윙 0타]</span>
                    <span className="text-slate-700">
                      공을 치려는 의도로 스윙했으나 공에 닿지 않은 <strong>헛스윙은 타수에 가산하지 않음</strong> (단, 공이 미세하게라도 흔들리거나 닿으면 1타 처리).
                    </span>
                  </div>

                  <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 flex items-start gap-2.5">
                    <span className="font-extrabold text-blue-800 shrink-0 min-w-[65px]">[마크 규정]</span>
                    <span className="text-slate-700">
                      동반자의 퍼팅 선상에 있거나 홀컵 주변 20m 이내에서 동반자 요청 시 <strong>볼 뒤쪽에 마커를 놓고 공을 집어올림</strong> (미이행 시 2벌타).
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                    <span className="font-extrabold text-slate-800 shrink-0 min-w-[65px]">[안전 에티켓]</span>
                    <span className="text-slate-700">
                      앞 조가 홀컵을 완전히 비우기 전에 티샷 금지, 경기자 스윙 반경 3m 이내 접근 금지, 벙커 탈출 후 발자국 고르기 필수.
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  자세한 정식 규정집 전문 다운로드 및 대회 심판 요강은 협회 공지사항을 참조하세요.
                </div>
                <a
                  href="https://koreaparkgolf.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
                >
                  <span>대한파크골프협회 공식 포털 바로가기</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 hidden sm:inline">
            안내 내용에 대한 추가 문의는 고객지원 이메일(pjm0620@naver.com)로 연락 바랍니다.
          </span>
          <button
            onClick={closeModal}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm transition-colors shadow-sm ml-auto"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
