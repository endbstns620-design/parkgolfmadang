# 파크골프마당 (ParkGolfMadang)

전국 파크골프장 정보 · 대회 일정 · 초보 가이드 · 동반자 매칭 · 마당P 장터를 제공하는
50~80대 시니어 대상 파크골프 정보 포털입니다.

- 서비스 주소: https://parkgolf-madang.co.kr
- 문의: pjm0620@naver.com

## 실행 방법

```bash
npm install        # 처음 한 번만
npm run dev        # 개발용 (http://localhost:3000)
npm run build      # 배포용 빌드
npm start          # 빌드한 것 실행
```

## 환경변수

`.env.example`을 복사해 `.env`로 만들고 값을 채워주세요.

| 이름 | 설명 |
|---|---|
| `ADMIN_PASSWORD` | 관리자 모드 비밀번호 (필수) |
| `GEMINI_API_KEY` | 방문자용 파크골프 문의 챗봇에 사용 |
| `KMA_API_KEY` | 구장 날씨 표시에 사용 |

## 폴더 구조

```
src/components/   화면 (구장·대회·가이드·장터·관리자 등)
src/data/         구장 552곳 / 대회 18건 기본 데이터
src/context/      전역 상태 관리
server-lib/       서버가 쓰는 초기 데이터·파일 저장소
server.ts         Express 서버 (API + 정적 파일)
tools/            엑셀 조사자료 → 데이터 파일 변환 스크립트 (참고용)
data/             운영 중 쌓이는 실제 데이터 — 깃허브에 올라가지 않습니다
```

## 주의

`data/` 폴더에는 회원 정보·리뷰·교환신청 같은 실제 운영 데이터가 쌓입니다.
`.gitignore`에 등록되어 있으니 **절대 깃허브에 올리지 마세요.**
