/**
 * Content Moderation & Anti-Spam Utility for ParkGolf Madang
 * Filters inappropriate content, sexual/adult words, gambling, illegal advertisements,
 * malicious injection, and irrelevant spam to ensure a safe, clean senior park golf community.
 */

export interface ModerationResult {
  isValid: boolean;
  reason?: string;
  detail?: string;
  category?: 'adult' | 'gambling' | 'spam' | 'profanity' | 'malicious' | 'irrelevant';
}

// 1. Adult, Sexual, Obscene Keywords
const ADULT_KEYWORDS = [
  '조건만남', '성인만남', '성매매', '출장안마', '출장만남', '룸싸롱', '오피스텔', '오피',
  '성인용품', '야동', '밤문화', '섹스', '섹파', '원나잇', '에로', '폰섹', '자위', '음란',
  '19금', '유흥', '키스방', '립카페', '스웨디시', '건마', '풀싸롱', '애인대행', '역스폰',
  '스폰서', '성인웹툰', '성인방송', '벗방', '여대생출장', '모텔출장', '미시출장', '가슴',
  '보지', '자지', '섹스파트너', '스와핑', '초대남', '섹트', '일탈녀', '조건녀'
];

// 2. Illegal Gambling, Toto, Betting, Illegal Loan Keywords
const GAMBLING_SPAM_KEYWORDS = [
  '사설토토', '토토', '바카라', '카지노', '꽁머니', '먹튀', '슬롯머신', '파워볼', '픽스터',
  '배팅', '홀덤펍불법', '안전놀이터', '메이저놀이터', '첫충', '매충', '고수익알바',
  '통장매매', '통장삽니다', '개인돈', '당일대출', '무직자대출', '신불자대출', '작업대출',
  '코인리딩', '해외선물리딩', '주식리딩방', '텔레그램리딩', '수익보장', 'fx마진',
  '대포통장', '대포폰', '문자알바', '댓글알바', '환전사기', '보이스피싱'
];

// 3. Commercial Irrelevant Spam & Solicitations (Real estate, used cars, insurance sales, multi-level marketing)
const IRRELEVANT_SPAM_KEYWORDS = [
  '분양홍보', '오피스텔분양', '상가분양', '신축빌라분양', '중고차전액할부', '다단계', '네트워크마케팅',
  '암웨이', '애터미', '뉴스킨', '부업문의', '재택알바', '하루100만원', '월천보장',
  '인터넷가입현금', '휴대폰개통사은품', '중고차매매사이트'
];

// 4. Heavy Profanity & Abuse
const PROFANITY_KEYWORDS = [
  '시발', '씨발', '개새끼', '지랄', '병신', '미친놈', '미친년', '느금마', '애미', '창녀',
  '닥쳐', '존나', '좆', '썅', '염병', '호로새끼', '개자식', '쌍놈', '쓰레기새끼'
];

// 5. Suspicious Spam Domains / Shorteners / Telegram handles
const SPAM_URL_PATTERNS = [
  /bit\.ly/i,
  /t\.me\//i,
  /telegram\.me/i,
  /cutt\.ly/i,
  /tinyurl\.com/i,
  /open\.kakao\.com\/o\/[a-zA-Z0-9]+/i, // open kakao links often used by spammers in companion post bodies
  /\.xyz\b/i,
  /\.top\b/i,
  /\.club\b/i,
  /\.vip\b/i,
  /casino/i,
  /toto/i,
  /baccarat/i
];

/**
 * Normalizes text by removing non-alphanumeric spacing tricks (e.g. "조 건 만 남", "섹.스", "바*카*라")
 */
function normalizeForInspection(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[\s_\-\.\,\*\~\!\@\#\$\%\^\&\(\)\+\=\[\]\{\}\;\:\'\"\\\|\/\<\>\?`]/g, '');
}

/**
 * Validates companion recruitment posts or comments against spam, adult content, gambling, and irrelevant junk.
 */
export function validatePostContent(fields: {
  title?: string;
  courseName?: string;
  authorName?: string;
  description?: string;
  authorPhone?: string;
  content?: string;
}): ModerationResult {
  const combinedRaw = [
    fields.title || '',
    fields.courseName || '',
    fields.authorName || '',
    fields.description || '',
    fields.content || '',
    fields.authorPhone || ''
  ].join(' ');

  // 1. Check for malicious code/scripts (XSS/SQL injection)
  const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|javascript:|onerror\s*=|onload\s*=/gi;
  if (scriptRegex.test(combinedRaw)) {
    return {
      isValid: false,
      category: 'malicious',
      reason: '보안 정책에 위배되는 비정상적인 스크립트나 태그가 포함되어 있습니다.',
      detail: '시스템 안전을 위해 HTML/스크립트 코드는 등록하실 수 없습니다.'
    };
  }

  // 2. Normalize text to catch spaced-out evasion tricks (e.g. "조 건 만 남")
  const normalized = normalizeForInspection(combinedRaw);

  // 3. Adult / Sexually explicit checks
  for (const keyword of ADULT_KEYWORDS) {
    const normalizedKeyword = normalizeForInspection(keyword);
    if (normalized.includes(normalizedKeyword) || combinedRaw.includes(keyword)) {
      return {
        isValid: false,
        category: 'adult',
        reason: '성적인 표현, 유흥 또는 부적절한 만남 관련 내용이 감지되었습니다.',
        detail: `파크골프마당은 건전한 체육 동호인 커뮤니티입니다. 부적절한 단어("${keyword}")는 등록이 엄격히 금지됩니다.`
      };
    }
  }

  // 4. Gambling / Illegal Toto / Illegal Loan checks
  for (const keyword of GAMBLING_SPAM_KEYWORDS) {
    const normalizedKeyword = normalizeForInspection(keyword);
    if (normalized.includes(normalizedKeyword) || combinedRaw.includes(keyword)) {
      return {
        isValid: false,
        category: 'gambling',
        reason: '불법 도박, 사설 토토, 불법 대출 또는 사기 관련 스팸 키워드가 감지되었습니다.',
        detail: `도박 및 금융 스팸 키워드("${keyword}")가 포함된 게시물은 즉시 차단됩니다.`
      };
    }
  }

  // 5. Irrelevant Commercial Ads (Real estate sales, MLM, used cars, etc.)
  for (const keyword of IRRELEVANT_SPAM_KEYWORDS) {
    const normalizedKeyword = normalizeForInspection(keyword);
    if (normalized.includes(normalizedKeyword) || combinedRaw.includes(keyword)) {
      return {
        isValid: false,
        category: 'irrelevant',
        reason: '파크골프와 무관한 상업적 광고/홍보 또는 다단계 관련 내용이 포함되어 있습니다.',
        detail: '동반자 모집 게시판은 순수 파크골프 라운딩 조편성을 위한 공간입니다. 상업적 광고는 전용 광고 배너 문의를 이용해 주세요.'
      };
    }
  }

  // 6. Heavy Profanity & Abuse
  for (const keyword of PROFANITY_KEYWORDS) {
    const normalizedKeyword = normalizeForInspection(keyword);
    if (normalized.includes(normalizedKeyword) || combinedRaw.includes(keyword)) {
      return {
        isValid: false,
        category: 'profanity',
        reason: '비방, 욕설 또는 타인에게 불쾌감을 주는 비매너 표현이 포함되어 있습니다.',
        detail: '서로 존중하고 배려하는 즐거운 파크골프 문화를 위해 고운 말을 사용해 주세요.'
      };
    }
  }

  // 7. Spam URL / Shorteners detection
  for (const pattern of SPAM_URL_PATTERNS) {
    if (pattern.test(combinedRaw)) {
      return {
        isValid: false,
        category: 'spam',
        reason: '불법 링크 또는 검증되지 않은 단축 URL/외부 홍보 링크가 포함되어 있습니다.',
        detail: '피싱 및 스팸 피해 방지를 위해 본문에 의심스러운 외부 링크 삽입을 제한합니다.'
      };
    }
  }

  // 8. Bot / Gibberish repetition check (e.g. "ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ" or "aaaaaaa" excessive characters)
  const excessiveRepetition = /(.)\1{9,}/;
  if (excessiveRepetition.test(combinedRaw)) {
    return {
      isValid: false,
      category: 'spam',
      reason: '동일한 문자나 기호가 무의미하게 과도하게 반복되었습니다.',
      detail: '정상적인 라운딩 동반자 모집 내용을 작성해 주시기 바랍니다.'
    };
  }

  // 9. Length and Meaningfulness check for Title
  if (fields.title && fields.title.trim().length < 4) {
    return {
      isValid: false,
      category: 'irrelevant',
      reason: '제목이 너무 짧습니다. (최소 4글자 이상)',
      detail: '어느 구장에서 언제 라운딩할지 다른 동호인들이 알 수 있도록 구체적인 제목을 작성해 주세요.'
    };
  }

  return { isValid: true };
}
