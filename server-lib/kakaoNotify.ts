import { readJsonFile, writeJsonFile } from "./jsonStore";

// ────────────────────────────────────────────────────────────────
// 카카오톡 "나에게 보내기" 알림
//
// 회원이 마당P 교환신청을 넣는 순간, 서버가 직접 사장님 카카오톡
// '나와의 채팅' 으로 알림을 보냅니다. 예약작업이나 컴퓨터가 켜져
// 있는지와 상관없이 24시간 작동합니다.
//
// 준비물 (Railway 환경변수)
//   KAKAO_REST_API_KEY  : 카카오 개발자 사이트에서 받은 REST API 키
//   KAKAO_CLIENT_SECRET : (선택) 보안 > Client Secret 을 켰다면 넣어주세요
//   KAKAO_REFRESH_TOKEN : (선택) 처음 연결할 때 자동으로 받아서 저장하므로
//                         보통은 비워두셔도 됩니다. 백업용입니다.
//
// 처음 한 번만: 브라우저에서 아래 주소를 열고 카카오 로그인 → 동의
//   https://parkgolf-madang.co.kr/api/kakao/connect?key=관리자비밀번호
// ────────────────────────────────────────────────────────────────

const TOKEN_FILE = "kakao-token.json";

const AUTH_HOST = "https://kauth.kakao.com";
const API_HOST = "https://kapi.kakao.com";

type TokenState = {
  refreshToken?: string;
  accessToken?: string;
  // 액세스 토큰이 만료되는 시각 (밀리초)
  accessTokenExpiresAt?: number;
  updatedAt?: string;
};

function restApiKey(): string {
  return String(process.env.KAKAO_REST_API_KEY || "").trim();
}

function clientSecret(): string {
  return String(process.env.KAKAO_CLIENT_SECRET || "").trim();
}

function loadState(): TokenState {
  const saved = readJsonFile<TokenState>(TOKEN_FILE, {});
  // 저장된 값이 없으면 환경변수에 넣어둔 백업 토큰을 씁니다.
  if (!saved.refreshToken) {
    const envToken = String(process.env.KAKAO_REFRESH_TOKEN || "").trim();
    if (envToken) return { ...saved, refreshToken: envToken };
  }
  return saved;
}

function saveState(next: TokenState) {
  writeJsonFile(TOKEN_FILE, { ...next, updatedAt: new Date().toISOString() });
}

/** 카카오 연결이 준비됐는지 알려줍니다. */
export function kakaoReady(): boolean {
  return Boolean(restApiKey() && loadState().refreshToken);
}

export function kakaoStatus() {
  const state = loadState();
  return {
    hasRestApiKey: Boolean(restApiKey()),
    hasRefreshToken: Boolean(state.refreshToken),
    updatedAt: state.updatedAt || null,
  };
}

/** 로그인 화면 주소를 만듭니다 (처음 한 번만 씁니다). */
export function kakaoAuthorizeUrl(redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: restApiKey(),
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "talk_message",
  });
  return `${AUTH_HOST}/oauth/authorize?${params.toString()}`;
}

/** 로그인 후 돌아온 코드를 토큰으로 바꿔서 저장합니다. */
export async function kakaoExchangeCode(code: string, redirectUri: string) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: restApiKey(),
    redirect_uri: redirectUri,
    code,
  });
  if (clientSecret()) body.set("client_secret", clientSecret());

  const res = await fetch(`${AUTH_HOST}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body,
  });
  const data: any = await res.json();
  if (!res.ok || !data.refresh_token) {
    throw new Error(`카카오 토큰 발급 실패: ${JSON.stringify(data)}`);
  }
  saveState({
    refreshToken: data.refresh_token,
    accessToken: data.access_token,
    accessTokenExpiresAt: Date.now() + Number(data.expires_in || 0) * 1000 - 60_000,
  });
  return data.refresh_token as string;
}

/** 필요하면 액세스 토큰을 새로 받아옵니다. */
async function getAccessToken(force = false): Promise<string> {
  const state = loadState();
  if (!restApiKey()) throw new Error("KAKAO_REST_API_KEY 가 없습니다.");
  if (!state.refreshToken) throw new Error("카카오 연결이 아직 안 되어 있습니다.");

  if (!force && state.accessToken && (state.accessTokenExpiresAt || 0) > Date.now()) {
    return state.accessToken;
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: restApiKey(),
    refresh_token: state.refreshToken,
  });
  if (clientSecret()) body.set("client_secret", clientSecret());

  const res = await fetch(`${AUTH_HOST}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body,
  });
  const data: any = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(`카카오 액세스 토큰 갱신 실패: ${JSON.stringify(data)}`);
  }

  saveState({
    // 만료가 가까워지면 카카오가 새 refresh_token 을 함께 내려줍니다.
    refreshToken: data.refresh_token || state.refreshToken,
    accessToken: data.access_token,
    accessTokenExpiresAt: Date.now() + Number(data.expires_in || 0) * 1000 - 60_000,
  });
  return data.access_token as string;
}

/** 카카오톡 '나와의 채팅' 으로 글을 보냅니다. */
export async function sendKakaoMemo(text: string): Promise<void> {
  const shortText = text.length > 190 ? `${text.slice(0, 187)}...` : text;
  const template = {
    object_type: "text",
    text: shortText,
    link: {
      web_url: "https://parkgolf-madang.co.kr",
      mobile_web_url: "https://parkgolf-madang.co.kr",
    },
    button_title: "관리자 화면 열기",
  };

  const send = async (token: string) => {
    const res = await fetch(`${API_HOST}/v2/api/talk/memo/default/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: new URLSearchParams({ template_object: JSON.stringify(template) }),
    });
    return res;
  };

  let res = await send(await getAccessToken());
  if (res.status === 401) {
    // 액세스 토큰이 만료됐으면 한 번만 새로 받아서 다시 시도합니다.
    res = await send(await getAccessToken(true));
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`카카오 전송 실패 (${res.status}): ${detail}`);
  }
}

function koreanTime(iso: string): string {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "";
  const kst = new Date(t + 9 * 60 * 60 * 1000);
  return `${kst.getUTCMonth() + 1}/${kst.getUTCDate()} ${String(kst.getUTCHours()).padStart(2, "0")}:${String(kst.getUTCMinutes()).padStart(2, "0")}`;
}

/**
 * 교환신청이 들어왔을 때 부르는 함수입니다.
 * 알림이 실패해도 회원의 교환신청은 그대로 접수되도록, 절대 오류를 밖으로 던지지 않습니다.
 */
export function notifyRedemption(redemption: any, waitingTotal: number): void {
  if (!kakaoReady()) return;

  const when = koreanTime(redemption?.createdAt || "");
  const point = Number(redemption?.pointCost || 0).toLocaleString("ko-KR");
  const lines = [
    "🎁 마당P 교환신청이 들어왔습니다",
    "",
    `${redemption?.userNickname || "회원"} 님`,
    `${redemption?.itemName || "상품"} (${point}P)`,
    when ? `신청 ${when}` : "",
    "",
    `처리 대기 ${waitingTotal}건입니다.`,
  ].filter(Boolean);

  sendKakaoMemo(lines.join("\n")).catch(err => {
    console.error("[카카오알림] 전송 실패:", err?.message || err);
  });
}

/**
 * 카카오 리프레시 토큰은 두 달간만 살아 있습니다.
 * 교환신청이 한동안 없어도 끊기지 않도록, 일주일에 한 번 조용히 갱신해 둡니다.
 */
export function startKakaoKeepAlive(): void {
  const tick = () => {
    if (!kakaoReady()) return;
    getAccessToken(true).catch(err => {
      console.error("[카카오알림] 토큰 갱신 실패:", err?.message || err);
    });
  };
  // 서버가 켜지고 1분 뒤 한 번, 그 뒤로는 7일마다
  setTimeout(tick, 60_000).unref?.();
  setInterval(tick, 7 * 24 * 60 * 60 * 1000).unref?.();
}
