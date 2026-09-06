# -*- coding: utf-8 -*-
"""2026년 남은 파크골프대회 검증 엑셀 → 대회소식 페이지 데이터 생성.

엑셀에 적힌 내용만 그대로 옮깁니다. 주최기관·연락처처럼 조사자료에 없는 항목은
지어내지 않고 "공식 요강에서 확인"으로 남겨둡니다.
"""
import openpyxl, re, os

XL = '/root/.claude/uploads/ec755c08-e61b-54f2-bfd3-8a6b5c3b0339/12a8f650-2026_____________DB_v1.xlsx'
OUT = os.path.expanduser('~/pgm/src/data/initialTournamentsData.ts')

ws = openpyxl.load_workbook(XL, read_only=True)['2026_남은대회']
DATA = [r for r in list(ws.iter_rows(values_only=True))[1:] if r and r[0]]

REGION = [
    ('전북', '전라/광주'), ('전남', '전라/광주'), ('광주', '전라/광주'),
    ('경북', '경상/대구/부산/울산'), ('경남', '경상/대구/부산/울산'),
    ('대구', '경상/대구/부산/울산'), ('부산', '경상/대구/부산/울산'),
    ('울산', '경상/대구/부산/울산'),
    ('경기', '서울/경기/인천'), ('인천', '서울/경기/인천'), ('서울', '서울/경기/인천'),
    ('강원', '강원'), ('충북', '충청/대전/세종'), ('충남', '충청/대전/세종'),
    ('대전', '충청/대전/세종'), ('세종', '충청/대전/세종'), ('제주', '제주'),
]

def region_of(txt):
    t = str(txt or '')
    for k, v in REGION:
        if t.startswith(k):
            return v
    return '전체'

def status_of(txt):
    t = str(txt or '').strip()
    if t == '접수중': return '접수중'
    if t == '접수예정': return '접수예정'
    if t in ('접수마감', '접수종료'): return '접수마감'
    return '접수마감'   # '예선통과자 대상' 등

def category_of(title):
    t = str(title or '')
    if '협회장기' in t: return '시·도협회장기'
    if any(k in t for k in ('시장배', '시장기', '군수배', '도지사배', '구청장배')):
        return '지자체장기·시장기'
    return '전국 메이저'

def first_date(txt):
    d = re.findall(r'20\d{2}-\d{2}-\d{2}', str(txt or ''))
    return d[0] if d else '2026-12-31'

def last_date(txt):
    """여러 날에 걸친 대회는 마지막 날짜까지 목록에 남아 있어야 합니다."""
    d = re.findall(r'20\d{2}-\d{2}-\d{2}', str(txt or ''))
    return max(d) if d else '2026-12-31'

def clean(v):
    return re.sub(r'\s+', ' ', str(v or '').strip())

esc = lambda s: str(s).replace('\\', '\\\\').replace("'", "\\'")

POSTERS = ['/images/card-tournaments-v4.png', '/images/card-community-v4.png']

lines = ["""import { Tournament } from '../types';

// ⚠ 2026년 남은 파크골프대회 검증 자료 (기준일 2026-09-07) 를 그대로 옮긴 데이터입니다.
// 대회명 · 지역 · 일정 · 장소 · 접수기간 · 자격요건 · 접수방법 · 참가비 · 시상 · 유의사항 ·
// 접수상태 · 출처만 들어 있습니다. 주최기관 · 문의전화처럼 조사자료에 없는 항목은
// 지어내지 않고 "공식 요강에서 확인"으로 두었습니다.
export const INITIAL_TOURNAMENTS: Tournament[] = ["""]

for i, r in enumerate(DATA, 1):
    (title, region, period, place, reg_period, eligibility,
     reg_method, fee, prize, notice, status, src1, src2) = (list(r) + [None] * 13)[:13]

    srcs = [s for s in (clean(src1), clean(src2)) if s]
    src_lines = ', '.join(f"'{esc(s)}'" for s in srcs)

    lines.append(f"""  {{
    id: 'tour-2026-{i:02d}',
    title: '{esc(clean(title))}',
    organizer: '주최측 공식 요강에서 확인해주세요',
    region: '{region_of(region)}',
    category: '{category_of(title)}',
    dateRange: '{esc(clean(period))}',
    eventDate: '{first_date(period)}',
    endDate: '{last_date(period)}',
    registrationPeriod: '{esc(clean(reg_period)) or '공식 요강 확인'}',
    location: '{esc(clean(region))} · {esc(clean(place))}',
    eligibility: '{esc(clean(eligibility)) or '공식 요강 확인'}',
    registrationMethod: '{esc(clean(reg_method))}',
    prizePool: '{esc(clean(prize)) or '공식 요강 확인'}',
    participationFee: '{esc(clean(fee)) or '공식 요강 확인'}',
    rulesDetail: '{esc(clean(notice))}',
    contact: '아래 공식 출처 링크에서 확인해주세요',
    status: '{status_of(status)}',
    linkUrl: '{esc(srcs[0]) if srcs else ''}',
    sourceUrls: [{src_lines}],
    description: '{esc(clean(place))}에서 열리는 대회입니다. 일정·접수·시상 내용은 2026년 남은 대회 검증자료(기준일 2026-09-07)로 확인했습니다. 신청 전 아래 공식 출처에서 최종 일정을 다시 확인해주세요.',
    posterUrl: '{POSTERS[(i - 1) % 2]}',
    isFeatured: {str(status_of(status) == '접수중').lower()},
    isCertifiedHost: false,
    views: 0
  }},""")

lines.append('];\n')
open(OUT, 'w', encoding='utf-8').write('\n'.join(lines))
print('대회', len(DATA), '건 작성 완료')
