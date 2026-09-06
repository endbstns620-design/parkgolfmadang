// 도로명/지번 주소 검색 (카카오 우편번호 서비스)
// 무료이고 별도 가입·키 발급이 필요 없습니다. index.html에서 스크립트를 미리 불러오고,
// 혹시 불러오지 못한 경우(네트워크 차단 등)에는 직접 입력으로 넘어가도록 만들었습니다.

declare global {
  interface Window {
    daum?: any;
  }
}

export interface FoundAddress {
  postcode: string;
  address: string; // 도로명 주소 (없으면 지번 주소)
  jibunAddress: string;
  extraInfo: string; // 건물명·동 등 참고정보
}

const SCRIPT_SRC = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

let loading: Promise<boolean> | null = null;

/** 우편번호 스크립트를 한 번만 불러옵니다. 실패하면 false를 돌려줍니다. */
export function loadPostcodeScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.daum?.Postcode) return Promise.resolve(true);
  if (loading) return loading;

  loading = new Promise<boolean>(resolve => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    const script = existing || document.createElement('script');
    const done = () => resolve(Boolean(window.daum?.Postcode));
    script.addEventListener('load', done);
    script.addEventListener('error', () => resolve(false));
    if (!existing) {
      script.src = SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
    // 10초 안에 응답이 없으면 직접 입력으로 넘어갑니다.
    window.setTimeout(done, 10000);
  });
  return loading;
}

export function isPostcodeReady(): boolean {
  return typeof window !== 'undefined' && Boolean(window.daum?.Postcode);
}

/**
 * 주소 검색창을 띄웁니다. 어르신들이 쓰시기 편하도록 화면 한가운데 큼직하게 엽니다.
 * 스크립트를 못 불러온 경우 false를 돌려주고, 화면에서는 직접 입력을 안내합니다.
 */
export async function openAddressSearch(onSelect: (found: FoundAddress) => void): Promise<boolean> {
  const ok = await loadPostcodeScript();
  if (!ok || !window.daum?.Postcode) return false;

  new window.daum.Postcode({
    oncomplete: (data: any) => {
      const extras: string[] = [];
      if (data.bname && /[동|로|가]$/.test(data.bname)) extras.push(data.bname);
      if (data.buildingName && data.apartment === 'Y') extras.push(data.buildingName);
      onSelect({
        postcode: data.zonecode || '',
        address: data.roadAddress || data.jibunAddress || '',
        jibunAddress: data.jibunAddress || '',
        extraInfo: extras.length ? `(${extras.join(', ')})` : ''
      });
    },
    width: '100%',
    height: '100%'
  }).open();

  return true;
}
