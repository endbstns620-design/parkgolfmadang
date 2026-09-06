import React, { useState } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { X, UserPlus, LogIn } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { activeModal, closeModal, registerUser, loginUser, setActiveTab } = useParkGolf();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loginForm, setLoginForm] = useState({ phone: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
    preferredRegion: '',
    averageScore: ''
  });
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);

  if (!activeModal || activeModal.type !== 'auth') {
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await loginUser(loginForm.phone, loginForm.password);
    setIsSubmitting(false);
    if (success) closeModal();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!agreedTerms || !agreedPrivacy) {
      alert('이용약관과 개인정보 수집·이용에 동의해주셔야 가입하실 수 있습니다.');
      return;
    }
    setIsSubmitting(true);
    const success = await registerUser({
      name: registerForm.name,
      phone: registerForm.phone,
      password: registerForm.password,
      nickname: registerForm.nickname,
      preferredRegion: registerForm.preferredRegion || undefined,
      averageScore: registerForm.averageScore || undefined
    });
    setIsSubmitting(false);
    if (success) closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={closeModal}>
      <div
        className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-extrabold text-slate-900">
            {mode === 'login' ? '로그인' : '회원가입'}
          </h3>
          <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switch */}
        <div className="flex bg-slate-100 rounded-xl p-1 mb-5">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
              mode === 'login' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500'
            }`}
          >
            <LogIn className="w-4 h-4" /> 로그인
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
              mode === 'register' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500'
            }`}
          >
            <UserPlus className="w-4 h-4" /> 회원가입
          </button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block">휴대폰번호</label>
              <input
                type="tel"
                value={loginForm.phone}
                onChange={e => setLoginForm({ ...loginForm, phone: e.target.value })}
                placeholder="01012345678"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block">비밀번호</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow transition-all disabled:opacity-60 cursor-pointer mt-2"
            >
              {isSubmitting ? '확인 중...' : '로그인하기'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3">
            <p className="text-xs text-slate-500 bg-slate-50 rounded-xl p-3 -mt-1 mb-1">
              이름·휴대폰번호는 문제 발생 시 본인확인 용도로만 사용되며, 다른 이용자에게는 절대 공개되지 않습니다.
              사이트에서는 닉네임만 보여집니다.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">이름 *</label>
                <input
                  type="text"
                  value={registerForm.name}
                  onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">닉네임 *</label>
                <input
                  type="text"
                  value={registerForm.nickname}
                  onChange={e => setRegisterForm({ ...registerForm, nickname: e.target.value })}
                  placeholder="사이트에 공개될 이름"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block">휴대폰번호 *</label>
              <input
                type="tel"
                value={registerForm.phone}
                onChange={e => setRegisterForm({ ...registerForm, phone: e.target.value })}
                placeholder="01012345678 ('-' 없이)"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">비밀번호 *</label>
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                  placeholder="6자 이상"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">비밀번호 확인 *</label>
                <input
                  type="password"
                  value={registerForm.passwordConfirm}
                  onChange={e => setRegisterForm({ ...registerForm, passwordConfirm: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  required
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-500 mb-2">선택 입력 (더 잘 어울리는 동반자를 만나는 데 도움이 됩니다)</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">주요 이용 지역</label>
                  <input
                    type="text"
                    value={registerForm.preferredRegion}
                    onChange={e => setRegisterForm({ ...registerForm, preferredRegion: e.target.value })}
                    placeholder="예: 서울 강동구"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">평균 타수</label>
                  <input
                    type="text"
                    value={registerForm.averageScore}
                    onChange={e => setRegisterForm({ ...registerForm, averageScore: e.target.value })}
                    placeholder="예: 32타"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={e => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-emerald-700 cursor-pointer"
                />
                <span>
                  (필수){' '}
                  <button
                    type="button"
                    onClick={() => {
                      closeModal();
                      setActiveTab('associations');
                      window.dispatchEvent(new CustomEvent('open-rules-subtab', { detail: 'terms' }));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="underline font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    이용약관
                  </button>
                  에 동의합니다.
                </span>
              </label>
              <label className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedPrivacy}
                  onChange={e => setAgreedPrivacy(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-emerald-700 cursor-pointer"
                />
                <span>
                  (필수) 이름·휴대폰번호 등{' '}
                  <button
                    type="button"
                    onClick={() => {
                      closeModal();
                      setActiveTab('associations');
                      window.dispatchEvent(new CustomEvent('open-rules-subtab', { detail: 'privacy' }));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="underline font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    개인정보 수집 및 이용
                  </button>
                  에 동의합니다.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !agreedTerms || !agreedPrivacy}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow transition-all disabled:opacity-60 cursor-pointer mt-2"
            >
              {isSubmitting ? '가입 처리 중...' : '회원가입하기'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
