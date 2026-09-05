import { ParkCourse } from '../src/types';

// 파크골프24와 대조·검증하여 실제로 업데이트가 필요했던 128곳의 정보입니다
// (2026-09-05 기준). 서버에 course-overrides.json이 없을 때 이 값으로 시작합니다.
export const COURSE_OVERRIDES_SEED: Record<string, Partial<ParkCourse>> = {
  "course-nat-PGM-0231": {
    "operatingHours": "하절기 09:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "공원 내 주차",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/af05c7a7-56a4-4182-9b8a-f32d782859ea)"
  },
  "course-nat-PGM-0192": {
    "operatingHours": "하절기 08:00~19:00 / 동절기 09:00~18:00",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/search?q=%EC%A0%84%EB%9D%BC+%ED%8C%8C%ED%81%AC%EA%B3%A8%ED%94%84%EC%9E%A5)"
  },
  "course-nat-PGM-0190": {
    "operatingHours": "운영시간 확인필요",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/search?q=%EC%A0%84%EB%9D%BC+%ED%8C%8C%ED%81%AC%EA%B3%A8%ED%94%84%EC%9E%A5)"
  },
  "course-nat-PGM-0191": {
    "operatingHours": "하절기 07:00~18:00 / 동절기 08:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "인근 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/app/grounds/32c21c8e-69cd-4258-b32e-9ed710a7ca81/)"
  },
  "course-nat-PGM-0194": {
    "operatingHours": "08:00~17:00",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/search?q=%EC%A0%84%EB%9D%BC+%ED%8C%8C%ED%81%AC%EA%B3%A8%ED%94%84%EC%9E%A5)"
  },
  "course-nat-PGM-0188": {
    "operatingHours": "09:00~18:00",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/search?q=%EC%A0%84%EB%9D%BC+%ED%8C%8C%ED%81%AC%EA%B3%A8%ED%94%84%EC%9E%A5)"
  },
  "course-nat-PGM-0316": {
    "phoneNumber": "063-620-5618",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0336": {
    "operatingHours": "하절기 08:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "매주 목요일, 1월1일, 설연휴, 추석연휴",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/7ad89295-1e72-4ae2-87df-29cbb280df1b)"
  },
  "course-nat-PGM-0495": {
    "operatingHours": "하절기 07:00~19:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "공원 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/b446d2ff-0fd9-4524-95ae-188a33063b45)"
  },
  "course-nat-PGM-0205": {
    "operatingHours": "하절기 09:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "없음",
    "parkingDetails": "둔치 주차",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/e30c97bd-7fbe-4f76-b918-43826651bc71)"
  },
  "course-nat-PGM-0566": {
    "operatingHours": "하절기 08:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "상시운영",
    "parkingDetails": "무료 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/df5bc05e-dfaa-425e-88f5-396296704913)"
  },
  "course-nat-PGM-0369": {
    "operatingHours": "하절기 07:00~19:00 / 동절기 08:00~18:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/dc56deb3-ea13-4764-b4a5-1ab29ee8bbbc)"
  },
  "course-nat-PGM-0565": {
    "phoneNumber": "043-835-3662",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0217": {
    "phoneNumber": "043-539-7695",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0544": {
    "operatingHours": "하절기 09:00~17:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "인근 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/ca37ca07-36d3-4594-a2cd-52b0ac49b116)"
  },
  "course-nat-PGM-0372": {
    "operatingHours": "하절기 08:00~17:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "무료 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://parkgolf24.co.kr/courses/17d77881-7731-4a93-be52-35eedf46a7d0)"
  },
  "course-nat-PGM-0319": {
    "phoneNumber": "063-290-2114",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0280": {
    "phoneNumber": "061-300-0000",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0282": {
    "phoneNumber": "061-782-3007",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0314": {
    "phoneNumber": "063-454-3292",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0298": {
    "phoneNumber": "061-850-5958",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0329": {
    "phoneNumber": "063-430-2374",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0288": {
    "phoneNumber": "061-284-2035",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0289": {
    "phoneNumber": "061-270-8379",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0301": {
    "phoneNumber": "061-350-5430",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0322": {
    "phoneNumber": "063-290-3813",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0290": {
    "phoneNumber": "061-270-8582",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0284": {
    "phoneNumber": "061-339-4528",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0305": {
    "phoneNumber": "061-470-2224",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0326": {
    "operatingHours": "하절기 06:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "문의",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "phoneNumber": "063-281-2923",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/6abd032c-a7a3-4c4d-89d7-99d25b234bcc)"
  },
  "course-nat-PGM-0519": {
    "phoneNumber": "010-8600-3499",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0309": {
    "phoneNumber": "061-862-6963",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0330": {
    "phoneNumber": "063-430-2374",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0521": {
    "phoneNumber": "061-375-8947",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0017": {
    "operatingHours": "하절기 09:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "인근 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/0361f7ec-d8fa-4cc0-be93-ecbac73af680)"
  },
  "course-nat-PGM-0022": {
    "operatingHours": "하절기 09:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "없음",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/a4f42fcc-93a2-4ad7-9996-4af57357781f)"
  },
  "course-nat-PGM-0031": {
    "operatingHours": "하절기 06:00~17:30 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "무료 주차 가능",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/6f9a8386-2393-11f1-8aa2-5664ee01c8f8)"
  },
  "course-nat-PGM-0009": {
    "operatingHours": "하절기 운영시간 확인필요 / 동절기 09:00~17:00",
    "closedDays": "없음",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/8ce68e7c-f14b-4c18-8b78-e8799e6cf9d7)"
  },
  "course-nat-PGM-0023": {
    "operatingHours": "하절기 운영시간 확인필요 / 동절기 09:00~17:00",
    "closedDays": "없음",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/9f467b58-e42d-4a38-a985-d8bd688b3571)"
  },
  "course-nat-PGM-0016": {
    "operatingHours": "하절기 09:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "인근 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/d5c29402-244b-11f1-8aa2-5664ee01c8f8)"
  },
  "course-nat-PGM-0385": {
    "operatingHours": "하절기 09:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/4a97b67d-e226-4926-9213-652dae95c54b)"
  },
  "course-nat-PGM-0386": {
    "operatingHours": "하절기 09:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "없음",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/3bc5cc4f-39b2-48ae-bba2-777d5d5030d1)"
  },
  "course-nat-PGM-0010": {
    "operatingHours": "하절기 09:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/78f35b7c-a868-483c-a2fe-3ec01eb08910)"
  },
  "course-nat-PGM-0012": {
    "operatingHours": "09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "인근 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/81d6131b-fde6-4242-92f7-ed633da08fa7)"
  },
  "course-nat-PGM-0013": {
    "operatingHours": "하절기 운영시간 확인필요 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "인근 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/bdd98197-45e5-4cd2-8b2f-bb4d74e9f9a4)"
  },
  "course-nat-PGM-0504": {
    "operatingHours": "하절기 07:00~21:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/4077894e-e41f-4488-976e-f2aa86b6ca34)"
  },
  "course-nat-PGM-0242": {
    "operatingHours": "하절기 09:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/5a0cb552-f8ec-4c0f-a4e3-0905b1e77bba)"
  },
  "course-nat-PGM-0049": {
    "operatingHours": "하절기 07:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "상시 운영",
    "parkingDetails": "나리공원 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/3b59daad-fd3c-44b4-afff-d1329a0ae482)"
  },
  "course-nat-PGM-0505": {
    "operatingHours": "하절기 08:00~19:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "공원 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/f89b4ff9-b2d2-411d-b9cc-a05a53dd1e52)"
  },
  "course-nat-PGM-0040": {
    "operatingHours": "하절기 06:00~20:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "인근 주차",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/d4aa2c02-771d-423e-988e-a2947508e008)"
  },
  "course-nat-PGM-0249": {
    "operatingHours": "하절기 09:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "탄력적 휴장",
    "parkingDetails": "주차장 없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/11eb7e27-cda2-4b87-a452-50089865084a)"
  },
  "course-nat-PGM-0251": {
    "operatingHours": "하절기 09:00~20:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "공원 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/3d8a8996-0fe8-41d6-9998-0a0a2e7ee909)"
  },
  "course-nat-PGM-0252": {
    "operatingHours": "하절기 08:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "문의",
    "parkingDetails": "망원한강공원 공영주차장(유료)",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/c37de4af-071c-4c39-a20b-a4cba55973a5)"
  },
  "course-nat-PGM-0069": {
    "operatingHours": "09:00~17:00",
    "closedDays": "상시운영",
    "parkingDetails": "인근 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/23de3ee3-291f-4abf-968f-9e5378820460)"
  },
  "course-nat-PGM-0277": {
    "operatingHours": "하절기 08:00~17:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "인근 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/066d0d3b-eb4e-4e5e-83ea-9d97b63ce7fd)"
  },
  "course-nat-PGM-0044": {
    "operatingHours": "하절기 07:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "매월 1,3주 월요일",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/81b98334-ce1d-4362-a6aa-9b9b54a59f42)"
  },
  "course-nat-PGM-0036": {
    "operatingHours": "09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/1edf127b-95f8-451b-b409-f9f3b0ef1eb0)"
  },
  "course-nat-PGM-0047": {
    "operatingHours": "하절기 09:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "시흥시청 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/a9f5bfcf-d0de-476d-80be-ead6674f9c45)"
  },
  "course-nat-PGM-0056": {
    "operatingHours": "하절기 09:00~20:00 / 동절기 09:00~17:00",
    "closedDays": "상시운영",
    "parkingDetails": "양지파인리조트 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/5c890403-be67-4a80-9e2b-5687459cd830)"
  },
  "course-nat-PGM-0039": {
    "operatingHours": "하절기 06:10~19:00 / 동절기 09:00~17:00",
    "closedDays": "매월 둘째 수요일",
    "parkingDetails": "인근 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/bcfb8c67-8029-4338-b22e-6508ec405608)"
  },
  "course-nat-PGM-0051": {
    "operatingHours": "하절기 09:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "문의",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/b9e9c72f-e057-41b6-8542-5c89aeb51393)"
  },
  "course-nat-PGM-0054": {
    "operatingHours": "하절기 08:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "전용 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/a96d9e32-7ca0-48a2-8a7f-d8c2ee047247)"
  },
  "course-nat-PGM-0066": {
    "operatingHours": "하절기 운영시간 확인필요 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "인근 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/53967446-d8ef-4a93-84c1-a478b86aafec)"
  },
  "course-nat-PGM-0258": {
    "operatingHours": "하절기 09:00~17:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "잠실한강공원 주차",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/cfe72592-ebd9-4811-b213-a5f93570d51e)"
  },
  "course-nat-PGM-0275": {
    "operatingHours": "하절기 운영시간 확인필요 / 동절기 09:00~17:00",
    "closedDays": "문의",
    "parkingDetails": "주차 가 (ParkGolf24 원문)",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/8da5f0db-13af-4770-bffa-7fa6845b0214)"
  },
  "course-nat-PGM-0060": {
    "operatingHours": "하절기 09:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "상시운영",
    "parkingDetails": "인근 주차",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/0a83c826-c037-4823-8e24-bca62f820ea5)"
  },
  "course-nat-PGM-0262": {
    "operatingHours": "하절기 06:00~20:50 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "사전등록 주차",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/731c290a-5c3f-4b2c-a6bb-3403b960d050)"
  },
  "course-nat-PGM-0256": {
    "operatingHours": "하절기 09:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/ea924736-e08c-4fe6-a790-6000199c8eb0)"
  },
  "course-nat-PGM-0035": {
    "operatingHours": "하절기 07:00~19:00 / 동절기 09:00~17:00",
    "closedDays": "상시운영",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/39c45399-0acd-457a-84f1-a3e0e97afeb3)"
  },
  "course-nat-PGM-0032": {
    "operatingHours": "하절기 운영시간 확인필요 / 동절기 09:00~17:00",
    "closedDays": "상시운영",
    "parkingDetails": "전용 주차",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/f589b4f3-e5d7-4334-b019-4815a27312c6)"
  },
  "course-nat-PGM-0064": {
    "operatingHours": "하절기 09:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "인근 주차",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/1f0d7b48-eab0-4c85-8316-15387cc97618)"
  },
  "course-nat-PGM-0067": {
    "operatingHours": "하절기 09:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "상시운영",
    "parkingDetails": "경정공원 주차장",
    "parkingAvailable": true,
    "phoneNumber": "031-790-8881",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/20cb27e0-32b6-4922-846c-5fc2e28ee1eb)"
  },
  "course-nat-PGM-0397": {
    "operatingHours": "하절기 09:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "매주 화요일, 일요일",
    "parkingDetails": "인근 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/c222d71e-fa60-4a83-9f9c-d44d9c5e8828)"
  },
  "course-nat-PGM-0604": {
    "operatingHours": "하절기 08:00~21:30 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/223f09a5-c837-4d4c-ab03-39abe4dae131)"
  },
  "course-nat-PGM-0072": {
    "operatingHours": "하절기 08:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "상시운영",
    "parkingDetails": "무료 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/5f1609f4-bfeb-4b84-85c5-7768c0c00b1a)"
  },
  "course-nat-PGM-0111": {
    "operatingHours": "하절기 08:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "가포체육공원 무료주차",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/d5c82c0d-5981-4724-b683-ff4324554a4d)"
  },
  "course-nat-PGM-0085": {
    "operatingHours": "하절기 운영시간 확인필요 / 동절기 09:00~17:00",
    "closedDays": "문의",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/d773d8c4-d6e2-4f82-9e2a-37e48f740d81)"
  },
  "course-nat-PGM-0168": {
    "operatingHours": "하절기 운영시간 확인필요 / 동절기 09:00~17:00",
    "closedDays": "없음",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/e1c0467c-3eb8-421e-bbcb-2cd4ad90cc68)"
  },
  "course-nat-PGM-0421": {
    "operatingHours": "하절기 09:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "매주 금요일",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/2b98802f-3d29-4213-a93f-68d405d2d0ef)"
  },
  "course-nat-PGM-0170": {
    "operatingHours": "하절기 운영시간 확인필요 / 동절기 09:00~17:00",
    "closedDays": "없음",
    "parkingDetails": "인근 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/6e7d8409-2a82-4183-bc30-ee970e66b321)"
  },
  "course-nat-PGM-0117": {
    "operatingHours": "하절기 09:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "매주 수요일",
    "parkingDetails": "공원주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/21fc3aea-1f19-4929-b04a-57b21c654bff)"
  },
  "course-nat-PGM-0173": {
    "operatingHours": "하절기 운영시간 확인필요 / 동절기 09:00~17:00",
    "closedDays": "문의",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/890390f3-069f-44c2-bc19-5b5da4a66ee5)"
  },
  "course-nat-PGM-0088": {
    "operatingHours": "하절기 10;00~16:00 (ParkGolf24 원문) / 동절기 09:00~17:00",
    "closedDays": "상시운영",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/9f3f8a75-1657-4c2b-b191-74bd8d466c21)"
  },
  "course-nat-PGM-0079": {
    "operatingHours": "하절기 07:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "가곡용두교 아래 주차장",
    "parkingAvailable": true,
    "phoneNumber": "055-359-4675",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/36061fa9-6f62-4f48-b9f5-8f410bade853)"
  },
  "course-nat-PGM-0175": {
    "operatingHours": "하절기 09시~18시 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/b566ddb3-c755-4255-934f-eb4fbdd53daf)"
  },
  "course-nat-PGM-0121": {
    "operatingHours": "하절기 08:00~14:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "피크닉광장 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/c169cd94-8ae4-44f7-9fbe-10f9f3d305d1)"
  },
  "course-nat-PGM-0157": {
    "operatingHours": "하절기 07:00~19:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "인근 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/22bb9212-914a-488d-bf66-16d4f94d09a2)"
  },
  "course-nat-PGM-0588": {
    "operatingHours": "하절기 운영시간 확인필요 / 동절기 09:00~17:00",
    "closedDays": "문의",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/fc883ea9-62e6-4c95-be61-af070b88d5b8)"
  },
  "course-nat-PGM-0169": {
    "operatingHours": "하절기 09:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "문의",
    "parkingDetails": "인근 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/5bff4c62-a5d8-4fb9-a12a-bbd6d247993a)"
  },
  "course-nat-PGM-0182": {
    "operatingHours": "하절기 09:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "덕산체육공원",
    "parkingAvailable": true,
    "phoneNumber": "054-975-5195",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/6fa22ceb-bc45-4af6-ae5e-a07f74ac33dc)"
  },
  "course-nat-PGM-0108": {
    "operatingHours": "하절기 운영시간 확인필요 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "인근 주차장",
    "parkingAvailable": true,
    "phoneNumber": "055-530-1234",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/f5e06c18-45fc-4555-8d7b-ba079e862638)"
  },
  "course-nat-PGM-0102": {
    "operatingHours": "하절기 09시~12시 오전만 운영 / 동절기 09:00~17:00",
    "closedDays": "매주 화요일",
    "parkingDetails": "인근 주차장",
    "parkingAvailable": true,
    "phoneNumber": "055-749-8656",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/8844b348-42a0-4c44-967d-3e77dc66f247)"
  },
  "course-nat-PGM-0112": {
    "operatingHours": "하절기 08:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "상시운영",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/5c27e431-c069-45ab-b2c1-753172542663)"
  },
  "course-nat-PGM-0176": {
    "operatingHours": "하절기 09:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "없음",
    "parkingDetails": "인근 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/a5c44a36-9193-4d1c-bcbd-ac1714c029a0)"
  },
  "course-nat-PGM-0149": {
    "phoneNumber": "054-679-6981",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0603": {
    "operatingHours": "하절기 06:00~!9:00 (ParkGolf24 원문) / 동절기 09:00~17:00",
    "closedDays": "매주 수요일",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "phoneNumber": "055-712-0103",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/39beafa0-2cc0-49fb-a290-f3d3c47f964e)"
  },
  "course-nat-PGM-0131": {
    "operatingHours": "하절기 운영시간 확인필요 / 동절기 09:00~17:00",
    "closedDays": "문의",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/e9cad866-fe0d-4ed8-b403-9932b273d546)"
  },
  "course-nat-PGM-0103": {
    "phoneNumber": "055-749-8656",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0451": {
    "phoneNumber": "054-930-8365",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0440": {
    "phoneNumber": "054-750-8590",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0115": {
    "phoneNumber": "070-8633-0630",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0132": {
    "phoneNumber": "070-4116-3637",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0109": {
    "phoneNumber": "055-530-1544",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0119": {
    "phoneNumber": "055-548-4501",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0075": {
    "phoneNumber": "055-312-0503",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0403": {
    "phoneNumber": "055-864-7331",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0425": {
    "phoneNumber": "055-749-8656",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0135": {
    "phoneNumber": "053-810-5416",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0140": {
    "operatingHours": "하절기 08:30~17:30 / 동절기 09:00~17:00",
    "closedDays": "상시운영",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/21dfd137-62f7-44c4-996a-e2e827c1eddb)"
  },
  "course-nat-PGM-0124": {
    "operatingHours": "하절기 08:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/b8326eeb-9808-4d74-ba9c-eb7d2bf64138)"
  },
  "course-nat-PGM-0142": {
    "operatingHours": "하절기 08:30~17:30 / 동절기 09:00~17:00",
    "closedDays": "상시운영",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/02ec4dc4-f0ed-4d2c-9920-ead68103d06b)"
  },
  "course-nat-PGM-0171": {
    "operatingHours": "하절기 07:00~17:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "인근 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/23fd3e66-5151-4ed3-8342-c2de7e01a10b)"
  },
  "course-nat-PGM-0081": {
    "operatingHours": "하절기 06:00~19:00 / 동절기 07:30~18:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "삼랑진 생태공원 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/1159c37d-efc7-4233-b67b-b713a6495309)"
  },
  "course-nat-PGM-0006": {
    "operatingHours": "09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "무료 주차장",
    "parkingAvailable": true,
    "phoneNumber": "033-481-9991",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/cceebf3e-3734-4b89-8c3c-b333da6bc597)"
  },
  "course-nat-PGM-0180": {
    "operatingHours": "하절기 08:00~!9:00 (ParkGolf24 원문) / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/d2792afe-3902-4956-b114-2d7818ced2ce)"
  },
  "course-nat-PGM-0116": {
    "operatingHours": "하절기 05:30~19:00 / 동절기 09:00~17:00",
    "closedDays": "매주 수요일",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "phoneNumber": "055-712-0231",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/522c3ccd-d8e7-4a40-9249-5c0ad1b92d42)"
  },
  "course-nat-PGM-0024": {
    "operatingHours": "하절기 09:00~22:00 / 동절기 09:00~17:00",
    "closedDays": "매주 일요일, 공휴일",
    "parkingDetails": "체육공원 주차장",
    "parkingAvailable": true,
    "phoneNumber": "033-330-2740",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/37e58a8d-0701-4c89-8081-c80ffd78e2e7)"
  },
  "course-nat-PGM-0381": {
    "operatingHours": "하절기 운영시간 확인필요 / 동절기 09:00~17:00",
    "closedDays": "없음",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "phoneNumber": "033-646-4177",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/1aee4f2e-f8d8-47b7-b2f7-5d69b58ba729)"
  },
  "course-nat-PGM-0014": {
    "operatingHours": "09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "공원 주차장",
    "parkingAvailable": true,
    "phoneNumber": "033-734-8151",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/3245d1dc-d6f3-4920-989d-d0864c8bc6b8)"
  },
  "course-nat-PGM-0148": {
    "phoneNumber": "054-550-6093",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0154": {
    "operatingHours": "하절기 07:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "없음",
    "parkingDetails": "인근 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/519d7cad-32e8-429f-98c5-7c2f4420383a)"
  },
  "course-nat-PGM-0071": {
    "operatingHours": "09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "거제스포츠파크 주차장",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/be24e903-959c-484f-8cb5-e5542b579ab3)"
  },
  "course-nat-PGM-0137": {
    "operatingHours": "하절기 06:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "매주 월요일",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "phoneNumber": "054-956-7570",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/3fb5d113-8e6a-453e-835f-69d9995420ef)"
  },
  "course-nat-PGM-0407": {
    "operatingHours": "하절기 07:30~19:30 / 동절기 09:00~17:00",
    "closedDays": "매주 수요일",
    "parkingDetails": "인근 주차장",
    "parkingAvailable": true,
    "phoneNumber": "055-835-9177",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/8287da4e-244c-11f1-8aa2-5664ee01c8f8)"
  },
  "course-nat-PGM-0125": {
    "phoneNumber": "010-5169-2309",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses)"
  },
  "course-nat-PGM-0141": {
    "operatingHours": "하절기 08:30~17:30 / 동절기 09:00~17:00",
    "closedDays": "없음",
    "parkingDetails": "무료주차",
    "parkingAvailable": true,
    "phoneNumber": "054-480-4924",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/3d43d16b-0a42-4a6f-b8d0-00a74a3bfb09)"
  },
  "course-nat-PGM-0118": {
    "operatingHours": "하절기 08:00~18:00 / 동절기 09:00~17:00",
    "closedDays": "상시운영",
    "parkingDetails": "인근 공영주차장",
    "parkingAvailable": true,
    "phoneNumber": "055-548-4671",
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/422d4db5-9695-4cd9-a728-0d1c042e75da)"
  },
  "course-nat-PGM-0404": {
    "operatingHours": "하절기 운영시간 문의 / 동절기 09:00~17:00",
    "closedDays": "매주 화요일",
    "parkingDetails": "없음",
    "parkingAvailable": true,
    "dataSourceNote": "파크골프24 교차확인 (2026-09-05 기준, 출처: https://www.parkgolf24.co.kr/courses/be22bfdb-d9f0-4093-8b0f-1de9ba9cd64d)"
  }
};
