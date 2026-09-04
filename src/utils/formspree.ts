/**
 * Formspree integration utility
 * Primary Endpoint: https://formspree.io/f/mqpkbzqj
 */

export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mqpkbzqj';

export interface FormspreeResponse {
  ok: boolean;
  error?: string;
}

export async function submitToFormspree(
  payload: Record<string, unknown>
): Promise<FormspreeResponse> {
  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        submittedAt: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
        sourceUrl: window.location.href,
        platform: '천안아산 부동산세탁소',
      }),
    });

    if (response.ok) {
      return { ok: true };
    } else {
      const data = await response.json().catch(() => ({}));
      return {
        ok: false,
        error: data.error || data.errors?.[0]?.message || '전송 중 오류가 발생했습니다.',
      };
    }
  } catch (err: unknown) {
    console.error('Formspree submit error:', err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : '네트워크 오류가 발생했습니다.',
    };
  }
}
