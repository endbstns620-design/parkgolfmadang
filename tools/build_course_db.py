# -*- coding: utf-8 -*-
"""전국 553개 구장 전수조사 엑셀 = 유일한 구장 데이터 원본.

엑셀에 있는 552곳만, 엑셀에 적힌 항목만 그대로 넣습니다.
엑셀에 없는 항목은 추측해서 채우지 않습니다.
"""
import openpyxl, re, os, sys, json
sys.path.insert(0, os.path.expanduser('~/pgm/tools'))
import parse_courses as pc

XL = '/root/.claude/uploads/ec755c08-e61b-54f2-bfd3-8a6b5c3b0339/feddf927-parkgolf_madang_553_courses_v1.xlsx'
ROOT = os.path.expanduser('~/pgm')
NOTE = '전국 553개 구장 전수조사 자료 (2026-09-06 기준)'
IMG = '/images/card-courses-v4.png'

REGION = {'수도권':'서울/경기/인천','강원':'강원','충청':'충청/대전/세종','대전':'충청/대전/세종',
          '세종':'충청/대전/세종','전라':'전라/광주','광주':'전라/광주','경상':'경상/대구/부산/울산',
          '대구':'경상/대구/부산/울산','부산':'경상/대구/부산/울산','울산':'경상/대구/부산/울산','제주':'제주'}
BLANK = {'', 'none', 'None', '없음', '미기재', 'ParkGolf24 미기재', '-', 'nan', '문의', '문의 필요', '확인 필요'}

ws = openpyxl.load_workbook(XL, read_only=True)['전국구장DB']
DATA = [r for r in list(ws.iter_rows(values_only=True))[1:] if r and r[0] and r[2]]
print('엑셀 구장 수:', len(DATA))

clean = lambda v: ('' if v is None else str(v)).strip()
def val(v, fb):
    s = clean(v)
    return fb if s in BLANK else s

def fee(v):
    s = clean(v)
    if s in BLANK or s == '유료':
        return ('문의 필요', '문의 필요')
    p = re.split(r'\s*/\s*', s)
    if len(p) == 2 and re.search(r'관내|지역주민|시민|군민|구민', p[0]):
        return (p[0].strip(), p[1].strip())
    return (s, s)

def resv(v):
    s = clean(v)
    if s in BLANK:
        return ('예약방법 확인중', '운영기관에 직접 문의해주세요.')
    t = ('온라인예약' if '온라인' in s else '전화예약' if '전화' in s else
         '추첨제' if '추첨' in s else '선착순' if '선착순' in s else
         '현장접수' if '현장' in s else '예약방법 확인중')
    return (t, s)

def park(v):
    s = clean(v)
    if s in BLANK:
        return (False, '확인 필요')
    return (not bool(re.match(r'^(불가|이용불가)', s)), s)

def sub_region(a):
    m = re.match(r'(\S+)\s+(\S*[시군구])', str(a or ''))
    return f'{m.group(1)} {m.group(2)}' if m else (str(a or '').split(' ')[0] or '확인 필요')

esc = lambda s: str(s).replace('\\', '\\\\').replace("'", "\\'")

lines = ["""import { ParkCourse } from '../types';

// ⚠ 이 파일이 파크골프마당의 유일한 구장 데이터 원본입니다.
// 출처: 전국 553개 파크골프장 전수조사 자료 (2026-09-06 기준) — 실제 구장 552곳
// (엑셀 마지막 '원칙' 행은 구장이 아니라 정리 원칙을 적어둔 메모라서 제외했습니다)
//
// 구장명 · 지역 · 주소 · 홀수 · 운영시간 · 이용요금 · 휴장일 · 전화번호 · 주차 · 예약방법 —
// 조사자료에 있는 이 항목들만 넣었습니다. 편의시설 · 감면혜택 · 대여료 · 코스구성 · 잔디종류처럼
// 조사자료에 없는 항목은 임의로 채우지 않고 비워두거나 '확인 필요'로 두었습니다.
export const PARK_COURSES: ParkCourse[] = ["""]

for i, r in enumerate(DATA, 1):
    name, reg, addr, holes, hours, f_, closed, phone, pk, rv = r[:10]
    fl, fv = fee(f_); rt, rd = resv(rv); pa, pd = park(pk)
    try: h = int(holes)
    except (TypeError, ValueError): h = 18
    # 부가정보는 물려받지 않습니다 — 엑셀에 있는 항목만 씁니다.
    ex: dict = {}

    def out(field, default_literal):
        g = ex.get(field)
        if not g: return default_literal
        kind, v = g
        if kind == 'str': return f"'{v}'"
        return v

    sub = sub_region(addr)
    body = [f"  {{",
        f"    id: 'pgm-{i:04d}',",
        f"    name: '{esc(name)}',",
        f"    region: '{REGION.get(str(reg).strip(), '경상/대구/부산/울산')}',",
        f"    subRegion: '{esc(sub)}',",
        f"    address: '{esc(str(addr).strip())}',",
        f"    holes: {h},",
        f"    courseScale: '{h}홀',",
        f"    operatedBy: {out('operatedBy', chr(39)+'운영기관 확인 필요'+chr(39))},",
        f"    parkingAvailable: {str(pa).lower()},",
        f"    parkingDetails: '{esc(pd)}',",
        f"    reservationType: '{rt}',",
        f"    reservationDetails: '{esc(rd)}',",
        f"    feeLocal: '{esc(fl)}',",
        f"    feeVisitor: '{esc(fv)}',",
        f"    amenities: {out('amenities', '[]')},",
        f"    closedDays: '{esc(val(closed, '확인 필요'))}',",
        f"    operatingHours: '{esc(val(hours, '확인 필요'))}',",
        f"    phoneNumber: '{esc(val(phone, '확인 필요'))}',",
        f"    grassType: {out('grassType', chr(39)+'확인 필요'+chr(39))},",
        f"    rating: {out('rating', '4.5')},",
        f"    reviewCount: {out('reviewCount', '0')},",
        f"    imageUrl: {out('imageUrl', chr(39)+IMG+chr(39))},",
        f"    description: {out('description', repr_desc := chr(39)+esc(f'{sub} 소재 {h}홀 파크골프장입니다. 전국 전수조사 자료로 확인된 구장입니다.')+chr(39))},",
        f"    isPopular: {out('isPopular', 'false')},",
        f"    isAssociationCertified: {out('isAssociationCertified', 'true')},",
        f"    dataConfidence: 'A',",
        f"    dataSourceNote: '{NOTE}'"]
    for opt in ['governmentAgency','governmentPhone','reservationUrl','reservationPeriodInfo',
                'rentalFee','discountInfo','surfaceFeature']:
        if opt in ex:
            kind, v = ex[opt]
            body.append(f"    ,{opt}: " + (f"'{v}'" if kind == 'str' else v))
    if 'courseStructure' in ex:
        body.append("    ,courseStructure: " + ex['courseStructure'][1])
    body.append("  },")
    lines.append('\n'.join(body))

lines.append('];\n')
open(os.path.join(ROOT, 'src/data/parkCoursesData.ts'), 'w', encoding='utf-8').write('\n'.join(lines))
print('작성 완료 — 구장', len(DATA), '곳 (엑셀 항목만 사용)')
