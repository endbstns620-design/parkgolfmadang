import React from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import {
  Mail,
  Search,
  Smartphone,
  Type,
  ShieldCheck,
  Database,
  Cloud,
  LayoutDashboard,
  ArrowRight
} from 'lucide-react';

/**
 * 홈페이지 제작 문의 페이지입니다.
 *
 * 여기 적는 내용은 전부 이 사이트에서 방문자가 직접 눌러서 확인할 수 있는 것만 씁니다.
 * 경력·수상·거래처 같은 확인 불가능한 자랑은 넣지 않습니다 —
 * 그런 건 어차피 아무도 안 믿고, 한 줄이라도 걸리면 나머지까지 같이 의심받습니다.
 *
 * 대신 "지금 보고 계신 이 사이트가 결과물입니다"라는 한 가지만 밀고 갑니다.
 */

const CONTACT_EMAIL = 'pjm0620@naver.com';

// 전부 이 사이트에서 바로 확인 가능한 것들입니다.
const CAPABILITIES = [
  {
    icon: Database,
    title: '흩어진 자료를 쓸 수 있게 정리',
    body:
      '전국 552곳 구장 자료를 협회·연맹·지자체 공개자료에서 모아 한 곳에 정리했습니다. 출처가 엇갈리는 항목은 지어내지 않고 "확인 필요"로 남겨 표시합니다.'
  },
  {
    icon: Search,
    title: '검색에 걸리는 구조',
    body:
      '구장마다 각자 주소를 갖고, 서버가 검색엔진용 페이지를 미리 만들어 보냅니다. 현재 627개 페이지가 검색엔진에 등록돼 있습니다.'
  },
  {
    icon: Type,
    title: '시니어가 실제로 쓸 수 있는 화면',
    body:
      '글씨 크기 3단계, 큼직한 버튼, 한 손으로 닿는 아래 탭. 화면을 손가락으로 벌려 키우는 것도 막지 않았습니다.'
  },
  {
    icon: Smartphone,
    title: '휴대폰 홈 화면에 앱처럼 설치',
    body:
      '따로 앱을 만들지 않고도, 홈 화면에 추가하면 아이콘을 눌러 바로 들어올 수 있습니다.'
  },
  {
    icon: Cloud,
    title: '외부 서비스 연동',
    body:
      '기상청 날씨를 구장 화면에 붙이고, 새 글이 올라오면 카카오톡으로 알림이 가도록 연결했습니다.'
  },
  {
    icon: LayoutDashboard,
    title: '주인이 직접 고칠 수 있는 관리자 화면',
    body:
      '구장·대회·공지·상품을 개발자 없이 직접 추가하고 수정합니다. 만들어만 주고 끝나면 반년 뒤엔 낡은 사이트가 됩니다.'
  }
];

// 이 사이트에서 지금 바로 눌러서 확인할 수 있는 숫자들입니다.
const PROOF = [
  { value: '552곳', label: '정리된 구장 자료' },
  { value: '627개', label: '검색엔진에 등록된 페이지' },
  { value: '3단계', label: '글씨 크기 조절' }
];

export const StudioSection: React.FC = () => {
  const { setActiveTab } = useParkGolf();

  return (
    <div className="bg-white">
      {/* 머리말 */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <p className="text-base sm:text-lg font-bold text-emerald-300 mb-3">홈페이지 제작 문의</p>
          <h1 className="text-[28px] sm:text-4xl md:text-5xl font-black leading-[1.3] tracking-tight mb-5 break-keep">
            지금 보고 계신 이 사이트가
            <br />
            제가 만든 것입니다
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 font-medium leading-relaxed break-keep">
            포트폴리오를 따로 보여드리는 대신, 직접 눌러보시라고 말씀드립니다.
            구장을 검색해보시고, 글씨를 키워보시고, 휴대폰으로도 열어보십시오.
            같은 방식으로 만들어 드립니다.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
            {PROOF.map(p => (
              <div key={p.label} className="rounded-2xl bg-white/10 border border-white/15 px-3 py-4 text-center">
                <div className="text-xl sm:text-3xl font-black text-amber-300">{p.value}</div>
                <div className="text-xs sm:text-sm font-bold text-slate-300 mt-1 break-keep">{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 할 수 있는 일 */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">무엇을 해드릴 수 있는지</h2>
        <p className="text-base sm:text-lg text-slate-600 font-medium mb-8 break-keep">
          아래 여섯 가지 모두 이 사이트에 들어가 있습니다. 직접 확인해보실 수 있습니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {CAPABILITIES.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border-2 border-slate-200 bg-white p-5 sm:p-6 shadow-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6" strokeWidth={2.1} />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2 break-keep">{item.title}</h3>
                <p className="text-base text-slate-600 font-medium leading-relaxed break-keep">{item.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 일하는 방식 */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6">일하는 방식</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <ShieldCheck className="w-7 h-7 text-emerald-700 shrink-0 mt-0.5" strokeWidth={2.1} />
              <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed break-keep">
                <strong className="text-slate-900 font-black">확인된 것만 올립니다.</strong> 이 사이트의 구장
                정보에는 신뢰도 표시가 붙어 있습니다. 출처가 하나뿐이거나 엇갈리는 항목은 그렇게 적어둡니다.
                그럴듯하게 채우면 당장은 좋아 보이지만, 틀린 정보 하나가 나오는 순간 나머지까지 같이 믿을 수 없게 됩니다.
              </p>
            </div>
            <div className="flex gap-4">
              <Type className="w-7 h-7 text-emerald-700 shrink-0 mt-0.5" strokeWidth={2.1} />
              <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed break-keep">
                <strong className="text-slate-900 font-black">쓰실 분을 기준으로 만듭니다.</strong> 이 사이트는
                60·70대가 주로 보시기 때문에 글씨와 버튼을 크게 잡았습니다. 보시는 분이 다르면 화면도 달라져야 합니다.
              </p>
            </div>
            <div className="flex gap-4">
              <LayoutDashboard className="w-7 h-7 text-emerald-700 shrink-0 mt-0.5" strokeWidth={2.1} />
              <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed break-keep">
                <strong className="text-slate-900 font-black">넘겨드린 뒤에도 고치실 수 있게 합니다.</strong>{' '}
                글 하나 바꾸는 데 매번 연락해야 하는 사이트는 금방 방치됩니다. 직접 수정하실 수 있는 화면을 같이 드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 문의 */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">문의</h2>
        <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed mb-7 break-keep">
          어떤 사이트가 필요하신지, 누가 주로 보실지만 알려주시면 됩니다.
          만들 수 있는 일인지, 얼마나 걸릴지 먼저 솔직하게 말씀드리겠습니다.
        </p>

        <a
          href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('홈페이지 제작 문의')}`}
          className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-lg sm:text-xl shadow-lg transition-colors"
        >
          <Mail className="w-6 h-6" />
          {CONTACT_EMAIL}
        </a>

        <p className="text-sm sm:text-base text-slate-500 font-medium mt-4">
          메일 주소를 누르면 메일 쓰기 창이 열립니다
        </p>

        <button
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="mt-10 inline-flex items-center gap-1.5 text-base sm:text-lg font-black text-emerald-800 hover:text-emerald-900 cursor-pointer"
        >
          파크골프마당 둘러보기
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>
    </div>
  );
};
