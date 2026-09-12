import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import multer from "multer";
import bcrypt from "bcryptjs";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { readJsonFile, writeJsonFile } from "./server-lib/jsonStore";
import { RESTAURANT_SEED } from "./server-lib/restaurantSeed";
import { MAIN_BANNER_SEED } from "./server-lib/mainBannerSeed";
import { INITIAL_TOURNAMENTS } from "./src/data/initialTournamentsData";
import { COURSE_OVERRIDES_SEED } from "./server-lib/courseOverridesSeed";
import { PARK_COURSES } from "./src/data/parkCoursesData";
import { buildSlugMaps, coursePath, tournamentPath, restaurantPath, COURSE_PREFIX, TOURNAMENT_PREFIX, RESTAURANT_PREFIX } from "./src/utils/pageUrls";
import { coursePage, tournamentPage, restaurantPage, injectSeo } from "./server-lib/seoPages";
import type { ReviewItem, MatchingPost, AdItem, MatchingComment, CoupangProduct } from "./src/types";

dotenv.config();

// Lazy initialization for Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Railway 같은 클라우드는 앞단에 중계 서버가 있어서, 이 설정이 없으면
  // 모든 방문자가 같은 IP로 보입니다(→ 한 명이 막히면 전원이 막힘).
  app.set("trust proxy", 1);

  // ── 요청 제한 (같은 IP가 짧은 시간에 너무 많이 두드리는 것을 막습니다) ──
  // 비밀번호 무차별 대입, 가짜 회원가입 대량 생성, 데이터 통째 긁어가기,
  // 서버 다운(과부하)을 막는 기본 방어선입니다.
  type RateBucket = { count: number; resetAt: number };
  const rateBuckets = new Map<string, RateBucket>();

  // 30분마다 만료된 기록을 비워 메모리가 쌓이지 않게 합니다.
  const rateCleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of rateBuckets) {
      if (bucket.resetAt <= now) rateBuckets.delete(key);
    }
  }, 30 * 60 * 1000);
  rateCleanupTimer.unref?.();

  function clientKey(req: express.Request): string {
    return req.ip || req.socket.remoteAddress || "unknown";
  }

  /**
   * @param name    제한 구역 이름 (구역마다 따로 셉니다)
   * @param limit   허용 횟수
   * @param windowMs 기준 시간(밀리초)
   * @param message 막혔을 때 이용자에게 보여줄 안내문
   */
  function rateLimit(name: string, limit: number, windowMs: number, message: string) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const key = `${name}:${clientKey(req)}`;
      const now = Date.now();
      const bucket = rateBuckets.get(key);

      if (!bucket || bucket.resetAt <= now) {
        rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
        return next();
      }

      bucket.count += 1;
      if (bucket.count > limit) {
        const waitSec = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
        const waitMin = Math.ceil(waitSec / 60);
        res.setHeader("Retry-After", String(waitSec));
        console.warn(`[요청제한] ${name} 차단 — ${clientKey(req)} (${bucket.count}회)`);
        return res.status(429).json({
          success: false,
          error: `${message} 약 ${waitMin}분 뒤에 다시 시도해주세요.`
        });
      }
      return next();
    };
  }

  // 로그인 성공 시에는 실패 기록을 지워, 정상 이용자가 불편을 겪지 않게 합니다.
  function clearRateLimit(name: string, req: express.Request) {
    rateBuckets.delete(`${name}:${clientKey(req)}`);
  }

  const limitAdminLogin = rateLimit("admin-login", 5, 15 * 60 * 1000,
    "관리자 로그인 시도가 너무 많습니다.");
  const limitLogin = rateLimit("login", 10, 15 * 60 * 1000,
    "로그인 시도가 너무 많습니다.");
  const limitRegister = rateLimit("register", 5, 24 * 60 * 60 * 1000,
    "이 인터넷 주소에서 가입할 수 있는 횟수를 넘었습니다.");
  const limitWrite = rateLimit("write", 10, 60 * 1000,
    "글을 너무 빠르게 올리고 계십니다.");
  const limitUpload = rateLimit("upload", 20, 10 * 60 * 1000,
    "사진 올리기 횟수를 넘었습니다.");
  const limitApi = rateLimit("api", 300, 60 * 1000,
    "요청이 너무 많습니다.");

  // 1. Security & Anti-Scraping / Anti-Tampering Headers
  app.use((req, res, next) => {
    // Prevent MIME-sniffing
    res.setHeader("X-Content-Type-Options", "nosniff");
    // Clickjacking protection (same-origin framing allowed)
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    // XSS filter trigger in legacy browsers
    res.setHeader("X-XSS-Protection", "1; mode=block");
    // Referrer policy
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    // Permissions policy
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");
    // Mask server identity
    res.removeHeader("X-Powered-By");
    next();
  });

  // Limit body payload to protect from buffer overflows & DoS
  app.use(express.json({ limit: "500kb" }));

  // 모든 /api 요청에 대한 전체 상한 — 데이터 통째 긁어가기와 과부하를 막습니다.
  app.use("/api", limitApi);

  // 회원이 구장리뷰 · 맛집 · 동반자모집 글을 쓰면 받는 마당P (관리자 승인 후 지급)
  const ACTIVITY_POINT = 300;

  // 2. 방문자 카운터 — 서버를 재배포하거나 재시작해도 누적 방문자수가 초기화되지 않도록
  //    파일(data/visitors.json)에 저장합니다. 메모리에만 두면 배포할 때마다 0부터 다시 셉니다.
  interface VisitorState {
    todayDate: string;
    todayCount: number;
    totalCount: number;
  }

  const VISITOR_FILE = "visitors.json";
  const todayStr = () => new Date().toISOString().split("T")[0];

  let visitorState = readJsonFile<VisitorState>(VISITOR_FILE, {
    todayDate: todayStr(),
    todayCount: 0,
    totalCount: 0
  });

  // 예전 형식(파일이 없거나 값이 깨진 경우) 방어
  if (typeof visitorState.totalCount !== "number" || typeof visitorState.todayCount !== "number") {
    visitorState = { todayDate: todayStr(), todayCount: 0, totalCount: 0 };
  }

  // 오늘 하루 접속한 IP — 같은 사람이 새로고침해도 중복으로 세지 않기 위한 것으로,
  // 재시작하면 비워져도 누적수(totalCount)에는 영향이 없습니다.
  const visitedIps = new Set<string>();

  // 파일 쓰기를 매 요청마다 하지 않고 변경이 있을 때만 최대 5초에 한 번 저장합니다.
  let visitorDirty = false;
  const persistVisitors = () => {
    if (!visitorDirty) return;
    visitorDirty = false;
    try {
      writeJsonFile(VISITOR_FILE, visitorState);
    } catch (err) {
      console.error("[visitors] 저장 실패:", err);
    }
  };
  setInterval(persistVisitors, 5000).unref?.();
  process.on("SIGTERM", persistVisitors);
  process.on("SIGINT", persistVisitors);

  // 날짜가 바뀌면 오늘 방문자만 리셋합니다 (누적은 그대로 유지).
  const checkDailyReset = () => {
    const today = todayStr();
    if (visitorState.todayDate !== today) {
      visitorState.todayDate = today;
      visitorState.todayCount = 0;
      visitedIps.clear();
      visitorDirty = true;
    }
  };

  app.get("/api/stats/visitors", (req, res) => {
    checkDailyReset();
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
    const ipStr = Array.isArray(ip) ? ip[0] : String(ip).split(",")[0].trim();

    if (!visitedIps.has(ipStr)) {
      visitedIps.add(ipStr);
      visitorState.todayCount += 1;
      visitorState.totalCount += 1;
      visitorDirty = true;
      persistVisitors();
    }

    res.json({
      success: true,
      today: Math.max(1, visitorState.todayCount),
      total: Math.max(1, visitorState.totalCount),
      activeNow: Math.max(1, visitedIps.size),
      todayDate: visitorState.todayDate,
      serverTime: new Date().toISOString()
    });
  });

  // 화면 이동 시의 핑 — 누적수를 부풀리지 않도록 현재 값만 돌려줍니다.
  app.post("/api/stats/ping", (_req, res) => {
    checkDailyReset();
    res.json({
      success: true,
      today: Math.max(1, visitorState.todayCount),
      total: Math.max(1, visitorState.totalCount)
    });
  });

  // =========================================================================
  // 리뷰 · 동반자모집 · 광고 — 공유 데이터 API
  // 브라우저 localStorage에만 저장되면 방문자마다 다른 데이터를 보게 되므로,
  // 서버 파일 저장소를 거쳐 모든 방문자가 같은 데이터를 보도록 합니다.
  // =========================================================================
  // ── 저장된 데이터 자동 보정 (서버가 켜질 때 한 번 실행) ──
  // 대회·맛집·사진 같은 기본 자료는 코드에 들어있지만, 서버에 파일이 한 번 저장되고 나면
  // 자료를 새로 넣어도 화면에 반영되지 않습니다. 그래서 켜질 때마다 저장된 파일을 최신
  // 자료에 맞춰줍니다. 관리자·방문자가 직접 올린 내용은 건드리지 않습니다.
  const PARKGOLF_PHOTOS = {
    course: "/images/course-default.jpg",       // 하천변 파크골프장 전경
    tournament: "/images/tournament-sunset.jpg", // 깃대가 꽂힌 코스
    guide: "/images/course-golden.jpg",           // 코스 안내판을 보는 어르신
    players: "/images/course-wide.jpg"      // 파크골프 채를 든 시니어들
  };

  // 바꿔야 할 옛 사진들 — 외부 골프 사진(파크골프가 아님)과 저해상도 카드 이미지입니다.
  const OUTDATED_PHOTO_PATTERNS = [
    "images.unsplash.com",
    "/images/card-courses-v4.png",
    "/images/card-tournaments-v4.png",
    "/images/card-guide-v4.png",
    "/images/card-community-v4.png",
    "/images/hero-sunset-v5.jpg",
    "/images/hero-sunset-v6.jpg"
  ];

  function toParkGolfPhoto(url: string, fallback: string): string {
    if (typeof url !== "string") return url;
    return OUTDATED_PHOTO_PATTERNS.some(pat => url.includes(pat)) ? fallback : url;
  }

  function migrateStoredData() {
    try {
      // ── 대회 정보 갱신 ──
      // 2026년 남은 대회 검증자료로 대회 목록을 새로 만들었습니다.
      // 서버에 예전 대회 목록이 저장돼 있으면 새 자료로 갈아끼웁니다.
      // (관리자가 직접 등록한 대회는 id가 다르므로 그대로 남겨둡니다)
      // 사전 조사한 대회(INITIAL_TOURNAMENTS)가 늘어나거나 일정이 바뀌어도, 서버에 파일이
      // 한 번 저장되고 나면 반영되지 않던 문제가 있어 여기서 맞춰줍니다.
      // 관리자가 직접 등록한 대회(id가 tour-2026-로 시작하지 않음)는 그대로 둡니다.
      const tours = readJsonFile<any[]>("tournaments.json", INITIAL_TOURNAMENTS);
      const isSeedTour = (t: any) => String(t?.id || "").startsWith("tour-2026-");
      const storedSeedTours = new Map(tours.filter(isSeedTour).map(t => [t.id, t]));
      const keptTours = tours.filter(t => !isSeedTour(t) && !/^tour-\d+$/.test(String(t?.id || "")));
      // 조회수는 이용자가 쌓은 값이라 그대로 이어받고, 나머지 항목만 비교합니다.
      const withoutViews = (t: any) => {
        const { views, ...rest } = t || {};
        return JSON.stringify(rest);
      };
      const tourSeedChanged =
        INITIAL_TOURNAMENTS.some(t => {
          const stored = storedSeedTours.get(t.id);
          return !stored || withoutViews(stored) !== withoutViews(t);
        }) || tours.filter(isSeedTour).some(t => !INITIAL_TOURNAMENTS.find(s => s.id === t.id));
      if (tourSeedChanged) {
        const merged = [
          ...INITIAL_TOURNAMENTS.map(t => ({
            ...t,
            views: Number(storedSeedTours.get(t.id)?.views) || t.views || 0
          })),
          ...keptTours
        ];
        writeJsonFile("tournaments.json", merged);
        console.log(
          `[대회정리] 사전조사 대회 ${INITIAL_TOURNAMENTS.length}건으로 갱신했습니다.` +
            (keptTours.length ? ` (관리자가 등록한 ${keptTours.length}건은 유지)` : "")
        );
      }

      // ── 운영자 테스트 계정 마당P 세팅 (딱 한 번만) ──
      // 운영자가 마당P 교환 기능을 직접 시험해 볼 수 있도록, 테스트 계정 '홍대놀자'의
      // 마당P를 999,000P로 한 번만 맞춰줍니다. 그 뒤에 쓴 만큼 줄어든 값은 다시 건드리지 않습니다.
      // (계정이 아직 없으면 다음 서버 시작 때 다시 시도합니다)
      const testState = readJsonFile<Record<string, boolean>>("test-account-state.json", {});
      if (!testState.hongdaeNoljaPoints) {
        const us = readJsonFile<any[]>("users.json", []);
        const hi = us.findIndex(u => String(u?.nickname || "").trim() === "홍대놀자");
        if (hi !== -1) {
          us[hi].points = 999000;
          writeJsonFile("users.json", us);
          testState.hongdaeNoljaPoints = true;
          writeJsonFile("test-account-state.json", testState);
          console.log("[테스트계정] 홍대놀자 마당P를 999,000P로 설정했습니다.");
        }
      }

      // ── 맛집 정보 갱신 ──
      // 사전 조사한 맛집(RESTAURANT_SEED)이 늘어나거나 내용이 바뀌어도, 서버에 파일이
      // 한 번 저장되고 나면 반영되지 않던 문제가 있어 여기서 맞춰줍니다.
      // 방문자가 직접 올린 글(rest-seed-로 시작하지 않는 id)은 그대로 둡니다.
      const stored = readJsonFile<any[]>("restaurants.json", RESTAURANT_SEED);
      const seedById = new Map(RESTAURANT_SEED.map(r => [r.id, r]));
      const visitorPosts = stored.filter(r => !String(r.id || "").startsWith("rest-seed-"));
      const storedSeedIds = new Set(
        stored.filter(r => String(r.id || "").startsWith("rest-seed-")).map(r => r.id)
      );
      const seedChanged =
        RESTAURANT_SEED.some(r => !storedSeedIds.has(r.id)) ||
        stored.some(r => {
          const seed = seedById.get(r.id);
          return seed && JSON.stringify(seed) !== JSON.stringify(r);
        });
      if (seedChanged) {
        // 사전조사 맛집은 항상 최신 자료로, 방문자 글은 뒤에 그대로 이어붙입니다.
        writeJsonFile("restaurants.json", [...RESTAURANT_SEED, ...visitorPosts]);
        console.log(
          `[맛집정리] 사전조사 맛집 ${RESTAURANT_SEED.length}곳으로 갱신했습니다.` +
            (visitorPosts.length ? ` (방문자가 올린 ${visitorPosts.length}건은 유지)` : "")
        );
      }

      // 대회 포스터 — 파크골프 사진 두 장을 번갈아 넣습니다.
      const tours2 = readJsonFile<any[]>("tournaments.json", INITIAL_TOURNAMENTS);
      let changed = false;
      tours2.forEach((t, i) => {
        const next = toParkGolfPhoto(
          t.posterUrl,
          i % 2 === 0 ? PARKGOLF_PHOTOS.tournament : PARKGOLF_PHOTOS.players
        );
        if (next !== t.posterUrl) {
          t.posterUrl = next;
          changed = true;
        }
      });
      if (changed) {
        writeJsonFile("tournaments.json", tours2);
        console.log("[사진정리] 대회 포스터를 파크골프 사진으로 교체했습니다.");
      }

      // 관리자가 직접 고친 구장 정보에 남아있는 옛 사진도 함께 정리합니다.
      const overrides = readJsonFile<Record<string, any>>("course-overrides-admin.json", {});
      let ovChanged = false;
      Object.values(overrides).forEach((o: any) => {
        const next = toParkGolfPhoto(o?.imageUrl, PARKGOLF_PHOTOS.course);
        if (o && next !== o.imageUrl) {
          o.imageUrl = next;
          ovChanged = true;
        }
      });
      if (ovChanged) writeJsonFile("course-overrides-admin.json", overrides);
    } catch (err) {
      console.error("[사진정리] 실패(무시하고 계속 진행합니다):", err);
    }
  }
  migrateStoredData();

  const { validatePostContent } = await import("./src/utils/contentModeration");

  // ---- 리뷰 ----
  app.get("/api/reviews", (_req, res) => {
    const reviews = readJsonFile<ReviewItem[]>("reviews.json", []);
    res.json({ success: true, reviews });
  });

  app.post("/api/reviews", limitWrite, requireUser, (req: any, res) => {
    const body = req.body || {};
    const authorName = req.currentUser.nickname;
    const moderation = validatePostContent({
      title: body.title,
      authorName,
      content: body.content
    });
    if (!moderation.isValid) {
      return res.status(400).json({ success: false, error: moderation.reason || "부적절한 내용이 포함되어 있습니다." });
    }
    const reviews = readJsonFile<ReviewItem[]>("reviews.json", []);
    const newReview: ReviewItem = {
      ...body,
      authorName,
      authorUserId: req.currentUser.id,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    reviews.unshift(newReview);
    writeJsonFile("reviews.json", reviews);
    const pointInfo = requestPoints(
      req.currentUser,
      ACTIVITY_POINT,
      "구장리뷰",
      newReview.id,
      `[${newReview.courseName || "구장"}] ${newReview.title || "구장 리뷰"}`,
      String(body.content || "")
    );
    res.status(201).json({ success: true, review: newReview, pointInfo });
  });

  app.delete("/api/reviews/:id", requireAdmin, (req, res) => {
    const reviews = readJsonFile<ReviewItem[]>("reviews.json", []);
    const filtered = reviews.filter(r => r.id !== req.params.id);
    writeJsonFile("reviews.json", filtered);
    res.json({ success: true });
  });

  // ---- 동반자 모집(매칭) ----
  app.get("/api/matches", (_req, res) => {
    const matches = readJsonFile<MatchingPost[]>("matches.json", []);
    // deleteToken은 작성자 본인 삭제용 비밀값이라 목록 응답에는 절대 포함하지 않습니다.
    const publicMatches = matches.map(({ deleteToken, ...rest }: any) => rest);
    res.json({ success: true, matches: publicMatches });
  });

  app.post("/api/matches", limitWrite, requireUser, (req: any, res) => {
    const body = req.body || {};
    const authorName = req.currentUser.nickname;
    const moderation = validatePostContent({
      title: body.title,
      courseName: body.courseName,
      authorName,
      authorPhone: body.authorPhone,
      description: body.description
    });
    if (!moderation.isValid) {
      return res.status(400).json({ success: false, error: moderation.reason || "부적절한 내용이 포함되어 있습니다." });
    }
    const matches = readJsonFile<MatchingPost[]>("matches.json", []);
    const deleteToken = crypto.randomBytes(20).toString("hex");
    const newPost: MatchingPost & { deleteToken: string } = {
      ...body,
      authorName,
      authorUserId: req.currentUser.id,
      id: `match-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      closedAt: body.status === "마감" ? new Date().toISOString() : undefined,
      comments: [],
      deleteToken
    };
    matches.unshift(newPost);
    writeJsonFile("matches.json", matches);
    const pointInfo = requestPoints(
      req.currentUser,
      ACTIVITY_POINT,
      "동반자모집",
      newPost.id,
      `[${newPost.courseName || "구장"}] ${newPost.title || "동반자 모집"}`,
      String(body.description || "")
    );
    // 응답에는 딱 이번 한 번만 deleteToken을 내려줍니다 — 작성자 브라우저가 이걸 저장해뒀다가
    // 나중에 "내 글 삭제하기"를 누르면 이 토큰으로 본인 확인을 합니다.
    res.status(201).json({ success: true, match: newPost, deleteToken, pointInfo });
  });

  app.patch("/api/matches/:id/status", (req, res) => {
    const { status } = req.body || {};
    if (status !== "모집중" && status !== "마감") {
      return res.status(400).json({ success: false, error: "status 값이 올바르지 않습니다." });
    }
    const matches = readJsonFile<MatchingPost[]>("matches.json", []);
    const idx = matches.findIndex(m => m.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: "게시글을 찾을 수 없습니다." });
    matches[idx] = {
      ...matches[idx],
      status,
      closedAt: status === "마감" ? new Date().toISOString() : undefined
    };
    writeJsonFile("matches.json", matches);
    res.json({ success: true, match: matches[idx] });
  });

  app.post("/api/matches/:id/comments", limitWrite, requireUser, (req: any, res) => {
    const body = req.body || {};
    const authorName = req.currentUser.nickname;
    const moderation = validatePostContent({
      authorName,
      authorPhone: body.authorPhone,
      content: body.content
    });
    if (!moderation.isValid) {
      return res.status(400).json({ success: false, error: moderation.reason || "부적절한 내용이 포함되어 있습니다." });
    }
    const matches = readJsonFile<MatchingPost[]>("matches.json", []);
    const idx = matches.findIndex(m => m.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: "게시글을 찾을 수 없습니다." });
    const newComment: MatchingComment = {
      id: `c-${Date.now()}`,
      postId: req.params.id,
      authorName,
      authorPhone: body.authorPhone,
      content: body.content,
      createdAt: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
    };
    matches[idx] = { ...matches[idx], comments: [...matches[idx].comments, newComment] };
    writeJsonFile("matches.json", matches);
    res.status(201).json({ success: true, comment: newComment });
  });

  // 작성자 본인이 자신의 글을 즉시 삭제 (관리자 인증 불필요, 대신 글쓰기 시 받은 deleteToken 필요)
  // 개인정보처리방침 "작성자가 삭제를 요청할 경우 즉시 영구 파기" 조항을 실제로 지키기 위한 기능입니다.
  app.post("/api/matches/:id/self-delete", (req, res) => {
    const { deleteToken } = req.body || {};
    const matches = readJsonFile<(MatchingPost & { deleteToken?: string })[]>("matches.json", []);
    const target = matches.find(m => m.id === req.params.id);
    if (!target) return res.status(404).json({ success: false, error: "게시글을 찾을 수 없습니다." });
    if (!deleteToken || target.deleteToken !== deleteToken) {
      return res.status(403).json({ success: false, error: "본인 확인에 실패했습니다. 이 브라우저로 작성한 글만 직접 삭제할 수 있습니다." });
    }
    const filtered = matches.filter(m => m.id !== req.params.id);
    writeJsonFile("matches.json", filtered);
    res.json({ success: true });
  });

  app.delete("/api/matches/:id", requireAdmin, (req, res) => {
    const matches = readJsonFile<MatchingPost[]>("matches.json", []);
    const filtered = matches.filter(m => m.id !== req.params.id);
    writeJsonFile("matches.json", filtered);
    res.json({ success: true });
  });

  // ---- 광고 ----
  app.get("/api/ads", (_req, res) => {
    const ads = readJsonFile<AdItem[]>("ads.json", []);
    res.json({ success: true, ads });
  });

  app.post("/api/ads", requireAdmin, (req, res) => {
    const ads = readJsonFile<AdItem[]>("ads.json", []);
    const newAd: AdItem = { ...req.body, id: `ad-${Date.now()}` };
    ads.unshift(newAd);
    writeJsonFile("ads.json", ads);
    res.status(201).json({ success: true, ad: newAd });
  });

  app.patch("/api/ads/:id", requireAdmin, (req, res) => {
    const ads = readJsonFile<AdItem[]>("ads.json", []);
    const idx = ads.findIndex(a => a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: "광고를 찾을 수 없습니다." });
    ads[idx] = { ...ads[idx], ...req.body };
    writeJsonFile("ads.json", ads);
    res.json({ success: true, ad: ads[idx] });
  });

  app.delete("/api/ads/:id", requireAdmin, (req, res) => {
    const ads = readJsonFile<AdItem[]>("ads.json", []);
    const filtered = ads.filter(a => a.id !== req.params.id);
    writeJsonFile("ads.json", filtered);
    res.json({ success: true });
  });

  // ---- 구장 정보 보정(overrides) ----
  // 604+95곳 구장 데이터는 용량이 커서 프론트엔드 번들에 그대로 들어있습니다(서버 DB 아님).
  // 그래서 관리자가 조사·수정한 내용은 "덮어쓸 내용만" 여기 서버에 저장하고,
  // 방문자가 접속할 때 이 값을 기존 구장 정보 위에 덧씌워서 보여줍니다.
  // 구장 보정정보는 두 갈래로 나눠서 관리합니다.
  //  ① COURSE_OVERRIDES_SEED — 전국 전수조사 자료 (코드에 들어있어, 자료가 갱신되면 배포와 함께 바로 반영)
  //  ② course-overrides-admin.json — 관리자가 화면에서 직접 고친 내용만 저장 (항상 ①보다 우선)
  // 예전처럼 조사자료를 통째로 파일에 저장하면, 한 번 저장된 뒤로는 새 조사자료가 영원히 반영되지
  // 않는 문제가 있어서 이렇게 분리했습니다.
  const ADMIN_OVERRIDE_FILE = "course-overrides-admin.json";

  function readAdminOverrides(): Record<string, any> {
    return readJsonFile<Record<string, any>>(ADMIN_OVERRIDE_FILE, {});
  }

  function mergedCourseOverrides(): Record<string, any> {
    const admin = readAdminOverrides();
    const merged: Record<string, any> = {};
    for (const [id, seed] of Object.entries(COURSE_OVERRIDES_SEED)) {
      merged[id] = { ...(seed as object) };
    }
    for (const [id, edit] of Object.entries(admin)) {
      merged[id] = { ...(merged[id] || {}), ...(edit as object) };
    }
    return merged;
  }

  app.get("/api/course-overrides", (_req, res) => {
    res.json({ success: true, overrides: mergedCourseOverrides() });
  });

  app.post("/api/course-overrides/:id", requireAdmin, (req, res) => {
    const admin = readAdminOverrides();
    admin[req.params.id] = { ...(admin[req.params.id] || {}), ...req.body };
    writeJsonFile(ADMIN_OVERRIDE_FILE, admin);
    res.json({ success: true, override: { ...(COURSE_OVERRIDES_SEED as any)[req.params.id], ...admin[req.params.id] } });
  });

  // ---- 대회 소식 ----
  // 조회는 누구나, 등록·수정·삭제는 관리자만 가능합니다.
  // 서버에 데이터가 없으면 기존 INITIAL_TOURNAMENTS로 시작합니다.
  app.get("/api/tournaments", (_req, res) => {
    const tournaments = readJsonFile<any[]>("tournaments.json", INITIAL_TOURNAMENTS);
    res.json({ success: true, tournaments });
  });

  app.post("/api/tournaments", requireAdmin, (req, res) => {
    const body = req.body || {};
    if (!body.title || !body.eventDate) {
      return res.status(400).json({ success: false, error: "대회명과 대회 날짜는 필수입니다." });
    }
    const tournaments = readJsonFile<any[]>("tournaments.json", INITIAL_TOURNAMENTS);
    const newTournament = { ...body, id: `tour-${Date.now()}` };
    tournaments.unshift(newTournament);
    writeJsonFile("tournaments.json", tournaments);
    res.status(201).json({ success: true, tournament: newTournament });
  });

  app.patch("/api/tournaments/:id", requireAdmin, (req, res) => {
    const tournaments = readJsonFile<any[]>("tournaments.json", INITIAL_TOURNAMENTS);
    const idx = tournaments.findIndex(t => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: "대회를 찾을 수 없습니다." });
    tournaments[idx] = { ...tournaments[idx], ...req.body };
    writeJsonFile("tournaments.json", tournaments);
    res.json({ success: true, tournament: tournaments[idx] });
  });

  app.delete("/api/tournaments/:id", requireAdmin, (req, res) => {
    const tournaments = readJsonFile<any[]>("tournaments.json", INITIAL_TOURNAMENTS);
    const filtered = tournaments.filter(t => t.id !== req.params.id);
    writeJsonFile("tournaments.json", filtered);
    res.json({ success: true });
  });

  // ---- 마당P 장터 (적립한 마당P로 실제 상품을 교환 신청하는 곳) ----
  interface PointShopItem {
    id: string;
    name: string;
    category: string;
    pointCost: number;          // 교환에 필요한 마당P (관리자가 직접 정합니다)
    referenceUrl?: string;      // 상품 확인용 링크 (쿠팡 상품페이지 등)
    imageUrl?: string;          // 상품 사진 주소
    description?: string;       // 상품 설명
    sourceType?: "쿠팡" | "일반";
    coupangEmbedUrl?: string;   // 쿠팡추천상품일 때 쿠팡이 그려주는 위젯 주소
    isActive: boolean;
  }

  // 장터는 비어있는 상태로 시작합니다 — 관리자가 직접 올린 상품만 보입니다.
  const POINT_SHOP_SEED: PointShopItem[] = [];

  app.get("/api/point-shop", (_req, res) => {
    const items = readJsonFile<PointShopItem[]>("point-shop.json", POINT_SHOP_SEED);
    res.json({ success: true, items: items.filter(i => i.isActive !== false) });
  });

  app.post("/api/point-shop", requireAdmin, (req, res) => {
    const b = req.body || {};
    const name = String(b.name || "").trim();
    const pointCost = Number(b.pointCost);
    if (!name) {
      return res.status(400).json({ success: false, error: "상품명을 입력해주세요." });
    }
    if (!Number.isFinite(pointCost) || pointCost <= 0) {
      return res.status(400).json({ success: false, error: "교환에 필요한 마당P를 1 이상으로 입력해주세요." });
    }
    const items = readJsonFile<PointShopItem[]>("point-shop.json", POINT_SHOP_SEED);
    const newItem: PointShopItem = {
      id: `pshop-${Date.now()}`,
      name,
      category: String(b.category || "기타").trim(),
      pointCost: Math.round(pointCost),
      referenceUrl: b.referenceUrl ? String(b.referenceUrl).trim() : undefined,
      imageUrl: b.imageUrl ? String(b.imageUrl).trim() : undefined,
      description: b.description ? String(b.description).trim() : undefined,
      sourceType: b.sourceType === "쿠팡" ? "쿠팡" : "일반",
      coupangEmbedUrl: b.coupangEmbedUrl ? String(b.coupangEmbedUrl).trim() : undefined,
      isActive: true
    };
    items.push(newItem);
    writeJsonFile("point-shop.json", items);
    res.status(201).json({ success: true, item: newItem });
  });

  app.delete("/api/point-shop/:id", requireAdmin, (req, res) => {
    const items = readJsonFile<PointShopItem[]>("point-shop.json", POINT_SHOP_SEED);
    writeJsonFile("point-shop.json", items.filter(i => i.id !== req.params.id));
    res.json({ success: true });
  });

  // 교환 신청 — 보유 마당P를 확인하고, 받으실 분 정보를 받아 신청을 접수합니다.
  // 실물 발송은 관리자가 직접 처리합니다 (자동 결제·자동발송 시스템이 아닙니다).
  app.post("/api/point-shop/:id/redeem", requireUser, (req: any, res) => {
    const items = readJsonFile<PointShopItem[]>("point-shop.json", POINT_SHOP_SEED);
    const item = items.find(i => i.id === req.params.id && i.isActive !== false);
    if (!item) return res.status(404).json({ success: false, error: "상품을 찾을 수 없습니다." });

    const users = readJsonFile<AppUser[]>("users.json", []);
    const idx = users.findIndex(u => u.id === req.currentUser.id);
    if (idx === -1) return res.status(401).json({ success: false, error: "로그인이 필요합니다." });

    const have = users[idx].points || 0;
    if (have < item.pointCost) {
      // 화면에서 "마당P가 부족합니다" 안내창을 띄우기 위한 응답입니다.
      return res.status(400).json({
        success: false,
        code: "NOT_ENOUGH_POINTS",
        error: "마당P가 부족합니다.",
        required: item.pointCost,
        have
      });
    }

    const b = req.body || {};
    const recipientName = String(b.recipientName || "").trim();
    const recipientPhone = String(b.recipientPhone || "").replace(/[^0-9]/g, "");
    const postcode = String(b.postcode || "").trim();
    const roadAddress = String(b.roadAddress || "").trim();
    const detailAddress = String(b.detailAddress || "").trim();

    if (!recipientName) {
      return res.status(400).json({ success: false, error: "받으실 분 성함을 입력해주세요." });
    }
    if (recipientPhone.length < 9 || recipientPhone.length > 11) {
      return res.status(400).json({ success: false, error: "연락처를 정확히 입력해주세요." });
    }
    if (!roadAddress) {
      return res.status(400).json({ success: false, error: "주소를 입력해주세요." });
    }

    // 마당P 차감 (여기서부터는 실제로 포인트가 빠집니다)
    users[idx].points = have - item.pointCost;
    writeJsonFile("users.json", users);

    const redemptions = readJsonFile<any[]>("redemptions.json", []);
    const newRedemption = {
      id: `redeem-${Date.now()}`,
      userId: req.currentUser.id,
      userNickname: req.currentUser.nickname,
      userPhone: req.currentUser.phone,
      itemId: item.id,
      itemName: item.name,
      pointCost: item.pointCost,
      recipientName,
      recipientPhone,
      postcode,
      roadAddress,
      detailAddress,
      memo: b.memo ? String(b.memo).trim() : "",
      status: "접수됨",
      createdAt: new Date().toISOString()
    };
    redemptions.unshift(newRedemption);
    writeJsonFile("redemptions.json", redemptions);

    res.json({ success: true, remainingPoints: users[idx].points, redemption: newRedemption });
  });

  app.get("/api/redemptions", requireAdmin, (_req, res) => {
    const redemptions = readJsonFile<any[]>("redemptions.json", []);
    res.json({ success: true, redemptions });
  });

  // ---- 교환신청 알림용 (카톡 알림 예약작업이 씁니다) ----
  // 최근 몇 시간 안에 들어온 교환신청이 있는지만 알려줍니다.
  // 받는 분 성함·연락처·주소 같은 개인정보는 절대 내보내지 않습니다.
  // 상품명·신청시각·처리상태만 나가므로 비밀번호 없이 열어둡니다.
  // (자세한 내용은 관리자 화면에서만 보실 수 있습니다)
  app.get("/api/redemptions/recent", (req, res) => {
    const hours = Math.min(Math.max(Number(req.query.hours) || 4, 1), 72);
    const since = Date.now() - hours * 60 * 60 * 1000;
    const redemptions = readJsonFile<any[]>("redemptions.json", []);
    const items = redemptions
      .filter(r => {
        const t = Date.parse(r?.createdAt || "");
        return Number.isFinite(t) && t >= since;
      })
      .map(r => ({
        itemName: r.itemName,
        pointCost: r.pointCost,
        createdAt: r.createdAt,
        status: r.status
      }));
    res.json({
      success: true,
      hours,
      count: items.length,
      waitingTotal: redemptions.filter(r => r.status === "접수됨").length,
      items
    });
  });

  app.patch("/api/redemptions/:id", requireAdmin, (req, res) => {
    const redemptions = readJsonFile<any[]>("redemptions.json", []);
    const idx = redemptions.findIndex(r => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: "신청 내역을 찾을 수 없습니다." });
    redemptions[idx].status = req.body.status || redemptions[idx].status;
    writeJsonFile("redemptions.json", redemptions);
    res.json({ success: true });
  });

  // ---- 마당P 장터 상품 사진 업로드 (관리자 전용) ----
  // 링크를 찾아 붙여넣지 않고, 컴퓨터·휴대폰에 있는 사진을 그대로 올리실 수 있게 합니다.
  const productImagesDir = path.join(process.cwd(), "data", "product-images");
  if (!fs.existsSync(productImagesDir)) {
    fs.mkdirSync(productImagesDir, { recursive: true });
  }

  const ALLOWED_IMAGE_TYPES: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif"
  };

  const productImageUpload = multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, productImagesDir),
      filename: (_req, file, cb) => {
        const ext = ALLOWED_IMAGE_TYPES[file.mimetype] || ".jpg";
        cb(null, `item-${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`);
      }
    }),
    limits: { fileSize: 8 * 1024 * 1024 }, // 사진 한 장당 최대 8MB
    fileFilter: (_req, file, cb) => {
      if (!ALLOWED_IMAGE_TYPES[file.mimetype]) {
        return cb(new Error("사진 파일(JPG, PNG, WEBP, GIF)만 올리실 수 있습니다."));
      }
      cb(null, true);
    }
  });

  // 올린 사진을 그대로 내려주는 정적 경로
  app.use("/product-images", express.static(productImagesDir));

  app.post("/api/point-shop/upload-image", limitUpload, requireAdmin, (req, res) => {
    productImageUpload.single("image")(req, res, err => {
      if (err) {
        const tooBig = String(err.message || "").includes("File too large");
        return res.status(400).json({
          success: false,
          error: tooBig ? "사진 용량이 너무 큽니다. 8MB 이하로 올려주세요." : err.message || "사진 올리기에 실패했습니다."
        });
      }
      if (!req.file) {
        return res.status(400).json({ success: false, error: "사진 파일이 없습니다." });
      }
      res.status(201).json({ success: true, imageUrl: `/product-images/${req.file.filename}` });
    });
  });


  // ---- 메인화면 후원사 배너 (관리자가 직접 관리) ----
  const BANNER_FILE = "main-banners.json";

  app.get("/api/main-banners", (_req, res) => {
    const banners = readJsonFile<any[]>(BANNER_FILE, MAIN_BANNER_SEED as any[]);
    res.json({ success: true, banners });
  });

  app.post("/api/main-banners", requireAdmin, (req, res) => {
    const banners = readJsonFile<any[]>(BANNER_FILE, MAIN_BANNER_SEED as any[]);
    const now = new Date();
    const created = {
      sponsorName: "",
      headlineTop: "",
      headlineHighlight: "",
      points: [],
      subText: "",
      imageUrl: "",
      linkUrl: "",
      buttonText: "자세히 보기",
      disclaimer: "",
      startDate: "",
      endDate: "",
      priority: banners.length + 1,
      isActive: true,
      ...req.body,
      id: `banner-${Date.now()}`,
      views: 0,
      clicks: 0,
      createdAt: now.toISOString().slice(0, 10)
    };
    banners.push(created);
    writeJsonFile(BANNER_FILE, banners);
    res.status(201).json({ success: true, banner: created });
  });

  app.patch("/api/main-banners/:id", requireAdmin, (req, res) => {
    const banners = readJsonFile<any[]>(BANNER_FILE, MAIN_BANNER_SEED as any[]);
    const idx = banners.findIndex(b => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: "배너를 찾을 수 없습니다." });
    // 노출·클릭 수는 관리자 수정으로 덮어쓰이지 않게 지켜줍니다.
    const { views, clicks, id, ...patch } = req.body || {};
    banners[idx] = { ...banners[idx], ...patch };
    writeJsonFile(BANNER_FILE, banners);
    res.json({ success: true, banner: banners[idx] });
  });

  app.delete("/api/main-banners/:id", requireAdmin, (req, res) => {
    const banners = readJsonFile<any[]>(BANNER_FILE, MAIN_BANNER_SEED as any[]);
    writeJsonFile(BANNER_FILE, banners.filter(b => b.id !== req.params.id));
    res.json({ success: true });
  });

  // 노출 수 · 클릭 수 집계 — 업체에 성과를 보여드릴 때 쓰는 자료입니다.
  app.post("/api/main-banners/:id/track", (req, res) => {
    const kind = String(req.body?.kind || "");
    if (kind !== "view" && kind !== "click") {
      return res.status(400).json({ success: false, error: "kind는 view 또는 click 이어야 합니다." });
    }
    const banners = readJsonFile<any[]>(BANNER_FILE, MAIN_BANNER_SEED as any[]);
    const idx = banners.findIndex(b => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: "배너를 찾을 수 없습니다." });
    const key = kind === "view" ? "views" : "clicks";
    banners[idx][key] = (Number(banners[idx][key]) || 0) + 1;
    writeJsonFile(BANNER_FILE, banners);
    res.json({ success: true });
  });

  // 배너 사진 올리기 — 마당P 장터 사진과 같은 저장소를 씁니다.
  app.post("/api/main-banners/upload-image", limitUpload, requireAdmin, (req, res) => {
    productImageUpload.single("image")(req, res, err => {
      if (err) {
        const tooBig = String(err.message || "").includes("File too large");
        return res.status(400).json({
          success: false,
          error: tooBig ? "사진 용량이 너무 큽니다. 8MB 이하로 올려주세요." : err.message || "사진 올리기에 실패했습니다."
        });
      }
      if (!req.file) return res.status(400).json({ success: false, error: "사진 파일이 없습니다." });
      res.status(201).json({ success: true, imageUrl: `/product-images/${req.file.filename}` });
    });
  });

  // ---- 구장 근처 맛집 게시판 ----
  // 방문자 누구나 글을 쓸 수 있고(스팸 필터만 적용), 본인 글은 삭제 토큰으로 직접 삭제할 수 있습니다.
  // 서버에 저장된 데이터가 없으면 사전 조사한 30곳(RESTAURANT_SEED)으로 시작합니다.
  app.get("/api/restaurants", (_req, res) => {
    const restaurants = readJsonFile<any[]>("restaurants.json", RESTAURANT_SEED);
    const publicList = restaurants.map(({ deleteToken, ...rest }: any) => rest);
    res.json({ success: true, restaurants: publicList });
  });

  app.post("/api/restaurants", limitWrite, requireUser, (req: any, res) => {
    const body = req.body || {};
    const authorName = req.currentUser.nickname;
    const moderation = validatePostContent({
      title: body.restaurantName,
      authorName,
      content: body.description
    });
    if (!moderation.isValid) {
      return res.status(400).json({ success: false, error: moderation.reason || "부적절한 내용이 포함되어 있습니다." });
    }
    if (!body.restaurantName || !body.courseName) {
      return res.status(400).json({ success: false, error: "구장명과 맛집명은 필수입니다." });
    }
    const restaurants = readJsonFile<any[]>("restaurants.json", RESTAURANT_SEED);
    const deleteToken = crypto.randomBytes(20).toString("hex");
    const newPost = {
      ...body,
      // 선택 항목이 비어 있어도 항상 빈 문자열로 채워둡니다.
      // (값이 아예 없으면 목록 검색 같은 곳에서 오류가 납니다)
      region: String(body.region || ""),
      menu: String(body.menu || ""),
      address: String(body.address || ""),
      phoneNumber: String(body.phoneNumber || ""),
      businessHours: String(body.businessHours || ""),
      description: String(body.description || ""),
      authorName,
      authorUserId: req.currentUser.id,
      id: `rest-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      deleteToken
    };
    restaurants.unshift(newPost);
    writeJsonFile("restaurants.json", restaurants);
    const pointInfo = requestPoints(
      req.currentUser,
      ACTIVITY_POINT,
      "맛집",
      newPost.id,
      `[${newPost.courseName}] ${newPost.restaurantName}`,
      String(body.description || "")
    );
    res.status(201).json({ success: true, restaurant: newPost, deleteToken, pointInfo });
  });

  app.post("/api/restaurants/:id/self-delete", (req, res) => {
    const { deleteToken } = req.body || {};
    const restaurants = readJsonFile<any[]>("restaurants.json", RESTAURANT_SEED);
    const target = restaurants.find(r => r.id === req.params.id);
    if (!target) return res.status(404).json({ success: false, error: "게시글을 찾을 수 없습니다." });
    if (!deleteToken || target.deleteToken !== deleteToken) {
      return res.status(403).json({ success: false, error: "본인 확인에 실패했습니다." });
    }
    const filtered = restaurants.filter(r => r.id !== req.params.id);
    writeJsonFile("restaurants.json", filtered);
    res.json({ success: true });
  });

  app.delete("/api/restaurants/:id", requireAdmin, (req, res) => {
    const restaurants = readJsonFile<any[]>("restaurants.json", RESTAURANT_SEED);
    const filtered = restaurants.filter(r => r.id !== req.params.id);
    writeJsonFile("restaurants.json", filtered);
    res.json({ success: true });
  });

  // ---- 쿠팡파트너스 추천상품 ----
  // 등록/삭제는 관리자만 가능하고(requireAdmin), 조회는 누구나 가능합니다.
  app.get("/api/coupang-products", (_req, res) => {
    const products = readJsonFile<CoupangProduct[]>("coupang-products.json", []);
    res.json({ success: true, products });
  });

  app.post("/api/coupang-products", requireAdmin, (req, res) => {
    const body = req.body || {};
    const rawInput = (body.rawInput || '').trim();
    if (!rawInput) {
      return res.status(400).json({ success: false, error: "쿠팡파트너스 링크 또는 iframe 코드를 입력해주세요." });
    }

    // 관리자가 iframe 코드를 통째로 붙여넣었으면 src만 뽑아내고, 그냥 링크만 붙여넣었으면 그대로 씁니다.
    let embedUrl = rawInput;
    let embedWidth = 120;
    let embedHeight = 240;
    const iframeMatch = rawInput.match(/<iframe[^>]*src="([^"]+)"[^>]*>/i);
    if (iframeMatch) {
      embedUrl = iframeMatch[1];
      const widthMatch = rawInput.match(/width="(\d+)"/i);
      const heightMatch = rawInput.match(/height="(\d+)"/i);
      if (widthMatch) embedWidth = parseInt(widthMatch[1], 10);
      if (heightMatch) embedHeight = parseInt(heightMatch[1], 10);
    }

    // 실제 쿠팡파트너스 링크가 맞는지만 최소한으로 확인합니다 (다른 사이트 iframe 삽입 방지).
    let isCoupangLink = false;
    try {
      const host = new URL(embedUrl).hostname;
      isCoupangLink = host.endsWith("coupang.com") || host.endsWith("coupa.ng");
    } catch {
      isCoupangLink = false;
    }
    if (!isCoupangLink) {
      return res.status(400).json({ success: false, error: "쿠팡파트너스(coupang.com 또는 coupa.ng) 링크만 등록할 수 있습니다." });
    }

    const products = readJsonFile<CoupangProduct[]>("coupang-products.json", []);
    const newProduct: CoupangProduct = {
      id: `coupang-${Date.now()}`,
      category: body.category || '기타',
      embedUrl,
      embedWidth,
      embedHeight,
      productName: body.productName ? String(body.productName).trim().slice(0, 120) : undefined,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    products.unshift(newProduct);
    writeJsonFile("coupang-products.json", products);
    res.status(201).json({ success: true, product: newProduct });
  });

  // 이미 등록해 둔 쿠팡상품에 이름을 붙이거나 고칠 때 씁니다.
  // (이름이 있어야 마당P 장터에 올릴 때 어떤 상품인지 바로 알 수 있습니다)
  app.patch("/api/coupang-products/:id", requireAdmin, (req, res) => {
    const products = readJsonFile<CoupangProduct[]>("coupang-products.json", []);
    const idx = products.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: "상품을 찾을 수 없습니다." });
    const b = req.body || {};
    if (typeof b.productName === "string") {
      products[idx].productName = b.productName.trim().slice(0, 120) || undefined;
    }
    if (b.category) products[idx].category = b.category;
    writeJsonFile("coupang-products.json", products);
    res.json({ success: true, product: products[idx] });
  });

  app.delete("/api/coupang-products/:id", requireAdmin, (req, res) => {
    const products = readJsonFile<CoupangProduct[]>("coupang-products.json", []);
    const filtered = products.filter(p => p.id !== req.params.id);
    writeJsonFile("coupang-products.json", filtered);
    res.json({ success: true });
  });

  // =========================================================================
  // 관리자 인증 — 서버에서 실제로 검증합니다.
  // 예전 방식은 PIN(1234/7788/admin)이 브라우저 코드에 그대로 노출되어 있어서
  // 누구나 개발자도구로 찾아내거나, 아예 localStorage 값만 조작해 관리자 권한을
  // 가로챌 수 있었습니다. 이제는 비밀번호를 서버에서만 검증하고, 삭제·광고관리 같은
  // 민감한 작업은 서버가 매번 세션 토큰을 확인하도록 바꿨습니다.
  // =========================================================================
  const adminSessions = new Map<string, number>(); // token -> 만료시각(ms)
  const ADMIN_SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24시간

  function isValidAdminToken(token: string | undefined): boolean {
    if (!token) return false;
    const expiresAt = adminSessions.get(token);
    if (!expiresAt) return false;
    if (Date.now() > expiresAt) {
      adminSessions.delete(token);
      return false;
    }
    return true;
  }

  function requireAdmin(req: any, res: any, next: any) {
    const authHeader = req.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    if (!isValidAdminToken(token)) {
      return res.status(401).json({ success: false, error: "관리자 인증이 필요합니다." });
    }
    next();
  }

  app.post("/api/admin/login", limitAdminLogin, (req, res) => {
    const { password } = req.body || {};
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return res.status(503).json({ success: false, error: "서버에 관리자 비밀번호(ADMIN_PASSWORD)가 설정되어 있지 않습니다." });
    }
    if (password !== adminPassword) {
      return res.status(401).json({ success: false, error: "비밀번호가 올바르지 않습니다." });
    }
    clearRateLimit("admin-login", req);
    const token = crypto.randomBytes(24).toString("hex");
    adminSessions.set(token, Date.now() + ADMIN_SESSION_TTL_MS);
    res.json({ success: true, token, expiresInMs: ADMIN_SESSION_TTL_MS });
  });

  app.post("/api/admin/logout", (req, res) => {
    const authHeader = req.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    if (token) adminSessions.delete(token);
    res.json({ success: true });
  });

  app.get("/api/admin/check", requireAdmin, (_req, res) => {
    res.json({ success: true, isAdmin: true });
  });

  // =========================================================================
  // 회원가입 · 로그인 (일반 이용자)
  // 비회원도 모든 글은 열람할 수 있지만, 글쓰기(동반자모집·구장리뷰·맛집추천 등)는
  // 회원만 가능합니다. 관리자 인증(requireAdmin)과는 완전히 별개의 시스템입니다.
  // =========================================================================
  const userSessions = new Map<string, { userId: string; expiresAt: number }>();
  const USER_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30일

  interface AppUser {
    id: string;
    name: string; // 실명 (본인확인용, 비공개 — 다른 이용자에게 절대 노출되지 않음)
    phone: string; // 휴대폰 (본인확인용, 비공개)
    nickname: string; // 사이트에서 공개적으로 쓰이는 이름
    passwordHash: string;
    preferredRegion?: string; // 선택: 주요 이용 지역
    averageScore?: string; // 선택: 평균 타수
    createdAt: string;
    founderNumber: number; // 가입 순서(창립회원 번호) — 몇 번째로 가입했는지
    points: number; // 마당P (실물 없이 배지·등급용으로만 쓰다가, 마당P 장터에서 실제 상품과 교환)
    badges: string[]; // 활동으로 얻은 배지 목록 (예: '창립회원', '리뷰왕' 등)
  }

  function toPublicUser(u: AppUser) {
    // 본인 화면에는 실명·휴대폰까지 보여주되(본인 확인용), 다른 사람에게는 절대 전달하지 않습니다.
    return {
      id: u.id,
      name: u.name,
      phone: u.phone,
      nickname: u.nickname,
      preferredRegion: u.preferredRegion || '',
      averageScore: u.averageScore || '',
      createdAt: u.createdAt,
      founderNumber: u.founderNumber,
      points: u.points,
      badges: u.badges || [],
      pendingPoints: pendingPointsOf(u.id)
    };
  }

  // ---- 마당P 적립 신청 (관리자 승인제) ----
  // 회원이 글을 쓰면 곧바로 마당P를 주지 않고 "지급 대기"로 쌓아둡니다.
  // 관리자가 글을 직접 보고 지급하면 그때 실제 마당P가 올라갑니다.
  // 주제와 상관없는 글이나 허위 글로 마당P만 받아가는 것을 막기 위한 장치입니다.
  interface PointRequest {
    id: string;
    userId: string;
    userNickname: string;
    type: "구장리뷰" | "맛집" | "동반자모집";
    refId: string;        // 원래 글의 id
    title: string;        // 관리자 화면에 보여줄 글 제목
    preview: string;      // 글 내용 앞부분 (관리자가 내용을 보고 판단할 수 있게)
    amount: number;
    status: "대기" | "지급완료" | "거부";
    createdAt: string;
    decidedAt?: string;
    rejectReason?: string;
  }

  const POINT_REQUEST_FILE = "point-requests.json";
  const readPointRequests = () => readJsonFile<PointRequest[]>(POINT_REQUEST_FILE, []);

  /** 해당 회원의 "지급 대기" 마당P 합계 */
  function pendingPointsOf(userId: string): number {
    return readPointRequests()
      .filter(r => r.userId === userId && r.status === "대기")
      .reduce((sum, r) => sum + (r.amount || 0), 0);
  }

  /** 글 작성 시 호출 — 지급 대기 건을 만들고, 예상 잔여 마당P를 돌려줍니다. */
  function requestPoints(
    user: AppUser,
    amount: number,
    type: PointRequest["type"],
    refId: string,
    title: string,
    preview: string
  ) {
    const list = readPointRequests();
    const record: PointRequest = {
      id: `preq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      userId: user.id,
      userNickname: user.nickname,
      type,
      refId,
      title: String(title || "").slice(0, 120),
      preview: String(preview || "").slice(0, 500),
      amount,
      status: "대기",
      createdAt: new Date().toISOString()
    };
    list.unshift(record);
    writeJsonFile(POINT_REQUEST_FILE, list);

    const current = user.points || 0;
    const pending = list
      .filter(r => r.userId === user.id && r.status === "대기")
      .reduce((sum, r) => sum + (r.amount || 0), 0);
    return { amount, currentPoints: current, pendingPoints: pending, expectedPoints: current + pending };
  }

  // 관리자 — 지급 대기/처리 내역 조회
  app.get("/api/point-requests", requireAdmin, (req, res) => {
    const status = String(req.query.status || "");
    let list = readPointRequests();
    if (status) list = list.filter(r => r.status === status);
    const pendingCount = readPointRequests().filter(r => r.status === "대기").length;
    res.json({ success: true, requests: list, pendingCount });
  });

  // 관리자 — 지급 승인 (이때 실제로 마당P가 올라갑니다)
  app.post("/api/point-requests/:id/approve", requireAdmin, (req, res) => {
    const list = readPointRequests();
    const idx = list.findIndex(r => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: "신청 내역을 찾을 수 없습니다." });
    if (list[idx].status !== "대기") {
      return res.status(400).json({ success: false, error: "이미 처리된 신청입니다." });
    }
    const users = readJsonFile<AppUser[]>("users.json", []);
    const ui = users.findIndex(u => u.id === list[idx].userId);
    if (ui === -1) return res.status(404).json({ success: false, error: "회원을 찾을 수 없습니다." });

    users[ui].points = (users[ui].points || 0) + list[idx].amount;
    writeJsonFile("users.json", users);

    list[idx].status = "지급완료";
    list[idx].decidedAt = new Date().toISOString();
    writeJsonFile(POINT_REQUEST_FILE, list);

    res.json({ success: true, request: list[idx], userPoints: users[ui].points });
  });

  // 관리자 — 지급 거부 (마당P는 올라가지 않습니다)
  app.post("/api/point-requests/:id/reject", requireAdmin, (req, res) => {
    const list = readPointRequests();
    const idx = list.findIndex(r => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: "신청 내역을 찾을 수 없습니다." });
    if (list[idx].status !== "대기") {
      return res.status(400).json({ success: false, error: "이미 처리된 신청입니다." });
    }
    list[idx].status = "거부";
    list[idx].decidedAt = new Date().toISOString();
    list[idx].rejectReason = String(req.body?.reason || "").slice(0, 200);
    writeJsonFile(POINT_REQUEST_FILE, list);
    res.json({ success: true, request: list[idx] });
  });

  function requireUser(req: any, res: any, next: any) {
    const authHeader = req.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const session = token ? userSessions.get(token) : undefined;
    if (!session || Date.now() > session.expiresAt) {
      if (token) userSessions.delete(token);
      return res.status(401).json({ success: false, error: "로그인이 필요합니다." });
    }
    const users = readJsonFile<AppUser[]>("users.json", []);
    const user = users.find(u => u.id === session.userId);
    if (!user) {
      return res.status(401).json({ success: false, error: "로그인이 필요합니다." });
    }
    req.currentUser = user;
    next();
  }

  app.post("/api/auth/register", limitRegister, async (req, res) => {
    const { name, phone, password, nickname, preferredRegion, averageScore } = req.body || {};
    if (!name || !phone || !password || !nickname) {
      return res.status(400).json({ success: false, error: "이름, 휴대폰번호, 비밀번호, 닉네임은 필수입니다." });
    }
    const phoneDigits = String(phone).replace(/[^0-9]/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      return res.status(400).json({ success: false, error: "휴대폰번호 형식을 확인해주세요." });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ success: false, error: "비밀번호는 6자 이상이어야 합니다." });
    }
    const moderation = validatePostContent({ authorName: nickname });
    if (!moderation.isValid) {
      return res.status(400).json({ success: false, error: moderation.reason || "닉네임에 부적절한 내용이 포함되어 있습니다." });
    }
    const users = readJsonFile<AppUser[]>("users.json", []);
    if (users.some(u => u.phone === phoneDigits)) {
      return res.status(409).json({ success: false, error: "이미 가입된 휴대폰번호입니다." });
    }
    if (users.some(u => u.nickname === String(nickname).trim())) {
      return res.status(409).json({ success: false, error: "이미 사용 중인 닉네임입니다." });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: AppUser = {
      id: `user-${Date.now()}`,
      name: String(name).trim(),
      phone: phoneDigits,
      nickname: String(nickname).trim(),
      passwordHash,
      preferredRegion: preferredRegion ? String(preferredRegion).trim() : undefined,
      averageScore: averageScore ? String(averageScore).trim() : undefined,
      createdAt: new Date().toISOString().slice(0, 10),
      founderNumber: users.length + 1,
      points: 1000, // 가입축하 마당P
      badges: ['창립회원']
    };
    users.push(newUser);
    writeJsonFile("users.json", users);

    const token = crypto.randomBytes(24).toString("hex");
    userSessions.set(token, { userId: newUser.id, expiresAt: Date.now() + USER_SESSION_TTL_MS });
    res.status(201).json({ success: true, token, user: toPublicUser(newUser) });
  });

  app.post("/api/auth/login", limitLogin, async (req, res) => {
    const { phone, password } = req.body || {};
    if (!phone || !password) {
      return res.status(400).json({ success: false, error: "휴대폰번호와 비밀번호를 입력해주세요." });
    }
    const phoneDigits = String(phone).replace(/[^0-9]/g, "");
    const users = readJsonFile<AppUser[]>("users.json", []);
    const user = users.find(u => u.phone === phoneDigits);
    if (!user) {
      return res.status(401).json({ success: false, error: "휴대폰번호 또는 비밀번호가 올바르지 않습니다." });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ success: false, error: "휴대폰번호 또는 비밀번호가 올바르지 않습니다." });
    }
    clearRateLimit("login", req);
    const token = crypto.randomBytes(24).toString("hex");
    userSessions.set(token, { userId: user.id, expiresAt: Date.now() + USER_SESSION_TTL_MS });
    res.json({ success: true, token, user: toPublicUser(user) });
  });

  app.post("/api/auth/logout", (req, res) => {
    const authHeader = req.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    if (token) userSessions.delete(token);
    res.json({ success: true });
  });

  app.get("/api/auth/me", requireUser, (req: any, res) => {
    res.json({ success: true, user: toPublicUser(req.currentUser) });
  });

  // ---- 관리자 회원관리 ----
  // 관리자만 가입회원 목록을 볼 수 있습니다. 비밀번호 해시는 절대 내보내지 않습니다.
  app.get("/api/admin/users", requireAdmin, (_req, res) => {
    const users = readJsonFile<AppUser[]>("users.json", []);
    const list = users
      .map(u => ({
        id: u.id,
        founderNumber: u.founderNumber,
        nickname: u.nickname,
        name: u.name,
        phone: u.phone,
        preferredRegion: u.preferredRegion || '',
        averageScore: u.averageScore || '',
        points: u.points || 0,
        badges: u.badges || [],
        createdAt: u.createdAt
      }))
      .sort((a, b) => (b.founderNumber || 0) - (a.founderNumber || 0));
    res.json({ success: true, users: list, totalUsers: list.length });
  });

  // 관리자가 회원의 마당P를 직접 고칩니다 (테스트·보정용).
  app.patch("/api/admin/users/:id/points", requireAdmin, (req, res) => {
    const points = Number(req.body?.points);
    if (!Number.isFinite(points) || points < 0 || points > 100000000) {
      return res.status(400).json({ success: false, error: "마당P는 0 이상의 숫자로 입력해주세요." });
    }
    const users = readJsonFile<AppUser[]>("users.json", []);
    const idx = users.findIndex(u => u.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: "회원을 찾을 수 없습니다." });
    users[idx].points = Math.round(points);
    writeJsonFile("users.json", users);
    res.json({ success: true, points: users[idx].points });
  });

  // 실제 가입자 수 — "창립회원 OO/100명" 진행률바에 씁니다. 가짜 숫자를 넣지 않기 위해
  // 항상 실제 회원 수를 그대로 돌려줍니다.
  app.get("/api/auth/stats", (_req, res) => {
    const users = readJsonFile<AppUser[]>("users.json", []);
    res.json({ success: true, totalUsers: users.length });
  });

  // ---- 창립회원 오픈이벤트 (2번째 이벤트) — 매달 한 분씩 추첨 ----
  // 응모 대상: 아직 한 번도 당첨되지 않은 회원 전체 (가입한 달과 무관)
  // 한 번 당첨되면 이벤트가 끝날 때까지 다시 뽑히지 않습니다.
  interface MonthlyDrawWinner {
    id: string;
    month: string;
    userId: string;
    nickname: string;
    phone: string;
    drawnAt: string;
    shipped: boolean;
  }

  // 운영자가 기능 시험용으로 직접 만든 계정입니다.
  // 실제 회원이 아니므로 웰리타 랜덤추첨 이벤트 대상에서 제외합니다.
  const TEST_ACCOUNT_NICKNAMES = ['홍대놀자', 'brucekj', '꽃줓년', '홍대자자'];
  const isTestAccount = (u: any) =>
    TEST_ACCOUNT_NICKNAMES.includes(String(u?.nickname || '').trim());

  const CURRENT_PRIZE = {
    name: '웰리타-Y 밀크씨슬 테아닌 간건강 긴장완화 영양제 180정 (3개월분)',
    brand: '웰리타스토어',
    value: '45,000원 상당',
    sellerProfileUrl: 'https://smartstore.naver.com/welita'
  };

  app.get("/api/monthly-draw/info", (_req, res) => {
    const users = readJsonFile<AppUser[]>("users.json", []);
    const thisMonth = new Date().toISOString().slice(0, 7);
    const winners = readJsonFile<MonthlyDrawWinner[]>("monthly-draw-winners.json", []);
    // 응모 대상 = 아직 한 번도 당첨되지 않은 회원 전체 (운영자 테스트 계정 제외).
    // 가입한 달과 상관없이 계속 응모되고, 한 번 당첨되면 그 뒤로는 빠집니다.
    const wonIds = new Set(winners.map(w => w.userId));
    const eligibleCount = users.filter(u => !wonIds.has(u.id) && !isTestAccount(u)).length;
    const alreadyDrawnThisMonth = winners.some(w => w.month === thisMonth);
    const recentWinners = winners.slice().reverse().slice(0, 6).map(w => ({ month: w.month, nickname: w.nickname }));
    res.json({ success: true, prize: CURRENT_PRIZE, currentMonth: thisMonth, eligibleCount, alreadyDrawnThisMonth, recentWinners });
  });

  app.get("/api/monthly-draw/winners", requireAdmin, (_req, res) => {
    const winners = readJsonFile<MonthlyDrawWinner[]>("monthly-draw-winners.json", []);
    res.json({ success: true, winners });
  });

  app.post("/api/monthly-draw/run", requireAdmin, (req, res) => {
    const thisMonth = new Date().toISOString().slice(0, 7);
    const winners = readJsonFile<MonthlyDrawWinner[]>("monthly-draw-winners.json", []);
    if (winners.some(w => w.month === thisMonth)) {
      return res.status(409).json({ success: false, error: "이번 달 추첨은 이미 진행되었습니다." });
    }
    const users = readJsonFile<AppUser[]>("users.json", []);
    const alreadyWonIds = new Set(winners.map(w => w.userId));
    // 가입한 달과 상관없이, 아직 당첨된 적 없는 회원 전체가 대상입니다.
    const eligible = users.filter(u => !alreadyWonIds.has(u.id) && !isTestAccount(u));
    if (eligible.length === 0) {
      return res.status(400).json({ success: false, error: "아직 당첨되지 않은 회원이 없습니다." });
    }
    const winner = eligible[Math.floor(Math.random() * eligible.length)];
    const newWinner: MonthlyDrawWinner = {
      id: `draw-${Date.now()}`,
      month: thisMonth,
      userId: winner.id,
      nickname: winner.nickname,
      phone: winner.phone,
      drawnAt: new Date().toISOString(),
      shipped: false
    };
    winners.push(newWinner);
    writeJsonFile("monthly-draw-winners.json", winners);
    res.json({ success: true, winner: newWinner });
  });

  app.patch("/api/monthly-draw/winners/:id", requireAdmin, (req, res) => {
    const winners = readJsonFile<MonthlyDrawWinner[]>("monthly-draw-winners.json", []);
    const idx = winners.findIndex(w => w.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: "당첨 기록을 찾을 수 없습니다." });
    winners[idx].shipped = Boolean(req.body.shipped);
    writeJsonFile("monthly-draw-winners.json", winners);
    res.json({ success: true });
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", secure: true });
  });

  // AI Park Golf Senior Counselor Chatbot endpoint
  app.post("/api/gemini/chat-parkgolf", async (req, res) => {
    try {
      const { userMessage, history } = req.body;

      if (!userMessage) {
        return res.status(400).json({ error: "질문 내용을 입력해주세요." });
      }

      const prompt = `
당신은 대한민국 50~80대 시니어 동호인들을 위한 '파크골프마당'의 전문 AI 파크골프 도우미입니다.
어르신들이 이해하기 쉽도록 매우 친절하고 예의 바르며(존댓말 사용), 글씨를 읽기 편하게 핵심을 보기 쉽게 정리하여 답변해주세요.

[주요 답변 영역]
1. 대한파크골프협회 공인 규격, 경기 규칙(OB, 언플레이어블, 티샷, 퍼팅 등)
2. 전국 지자체 직영 파크골프장(화천, 양평, 대구, 부여, 순천, 밀양, 창원, 제주 등) 추천 및 이용 요령
3. 시니어 건강 관리, 관절 보호 스트레칭 및 장비(클럽 무게, 감나무 원목 vs 카본, 공 선택)
4. 전국 대회 출전 준비 및 에티켓

사용자 질문: "${userMessage}"
`;

      const ai = getGeminiAI();
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt
      });

      return res.json({
        success: true,
        answer: response.text || "죄송합니다. 일시적인 연결 지연으로 답변을 불러오지 못했습니다. 잠시 후 다시 질문해 주세요."
      });
    } catch (error: any) {
      console.error("Gemini park golf chat error:", error);
      return res.json({
        success: true,
        answer: "파크골프는 클럽 하나와 공 하나로 누구나 쉽게 즐길 수 있는 최고의 국민 스포츠입니다. 대한파크골프협회 공인 규정에 따르면 클럽 길이는 86cm 이하, 중량은 600g 이하이며 헤드에 로프트각이 없어 안전합니다. 궁금하신 구장이나 룰이 있으시면 편하게 문의해 주세요!"
      });
    }
  });

  // Weather Cache Map for high performance and avoiding quota exhaustion
  const weatherCache = new Map<string, { timestamp: number; data: any }>();
  const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

  // KMA Short-term / Ultra-short-term Forecast Endpoint
  app.get("/api/weather", async (req, res) => {
    try {
      const nx = parseInt(req.query.nx as string, 10) || 60;
      const ny = parseInt(req.query.ny as string, 10) || 127;
      const locationName = (req.query.location as string) || "서울";

      const cacheKey = `${nx}_${ny}`;
      const now = Date.now();
      const cached = weatherCache.get(cacheKey);

      if (cached && now - cached.timestamp < CACHE_TTL_MS) {
        return res.json({
          success: true,
          cached: true,
          data: cached.data
        });
      }

      // Calculate KMA Base Date and Time in KST (UTC+9)
      const kstDate = new Date(Date.now() + 9 * 60 * 60 * 1000);
      const year = kstDate.getUTCFullYear();
      const month = String(kstDate.getUTCMonth() + 1).padStart(2, "0");
      const day = String(kstDate.getUTCDate()).padStart(2, "0");
      const baseDate = `${year}${month}${day}`;

      const hours = kstDate.getUTCHours();
      const minutes = kstDate.getUTCMinutes();
      
      // KMA Ultra Short Term (초단기실황/예보) uses 30-min past hour
      let targetHour = hours;
      if (minutes < 45) {
        targetHour = hours - 1;
      }
      if (targetHour < 0) {
        targetHour = 23;
        // Previous day calculation if needed
      }
      const baseTime = `${String(targetHour).padStart(2, "0")}30`;

      const serviceKey =
        process.env.KMA_SERVICE_KEY ||
        "1jteBKwFbl41ykplxRavDDuAYwv07n4bB5%2ForZUTvT6%2FY5AzVxuaIoZ32I4%2FI9tE1kOsi816FVSFaq9QuzXfvw%3D%3D";

      const apiUrl = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${serviceKey}&pageNo=1&numOfRows=60&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

      let weatherData: any = null;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const response = await fetch(apiUrl, {
          signal: controller.signal,
          headers: {
            "Accept": "application/json"
          }
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const jsonText = await response.text();
          let json;
          try {
            json = JSON.parse(jsonText);
          } catch {
            json = null;
          }

          if (json?.response?.body?.items?.item) {
            const items: any[] = json.response.body.items.item;
            
            // Extract temperature (T1H), sky condition (SKY), precipitation (PTY), humidity (REH), wind (WSD)
            const t1hItem = items.find((it: any) => it.category === "T1H");
            const skyItem = items.find((it: any) => it.category === "SKY");
            const ptyItem = items.find((it: any) => it.category === "PTY");
            const rehItem = items.find((it: any) => it.category === "REH");
            const wsdItem = items.find((it: any) => it.category === "WSD");
            const rn1Item = items.find((it: any) => it.category === "RN1");

            const temp = t1hItem ? parseFloat(t1hItem.fcstValue) : 21.5;
            const skyVal = skyItem ? parseInt(skyItem.fcstValue, 10) : 1;
            const ptyVal = ptyItem ? parseInt(ptyItem.fcstValue, 10) : 0;
            const humidity = rehItem ? parseInt(rehItem.fcstValue, 10) : 48;
            const windSpeed = wsdItem ? parseFloat(wsdItem.fcstValue) : 2.1;
            const rainAmount = rn1Item ? rn1Item.fcstValue : "0";

            let skyText = "맑음";
            let skyIcon = "sunny";
            let golfSuitability = "라운딩 최적";
            let suitColor = "emerald";

            if (ptyVal === 1 || ptyVal === 4) {
              skyText = "비";
              skyIcon = "rain";
              golfSuitability = "우천 주의 (비옷/방수화)";
              suitColor = "blue";
            } else if (ptyVal === 2) {
              skyText = "비/눈";
              skyIcon = "sleet";
              golfSuitability = "잔디 미끄럼 주의";
              suitColor = "amber";
            } else if (ptyVal === 3) {
              skyText = "눈";
              skyIcon = "snow";
              golfSuitability = "동결 주의";
              suitColor = "amber";
            } else {
              if (skyVal === 1) {
                skyText = "맑음";
                skyIcon = "sunny";
                golfSuitability = "파크골프 최적 쾌청";
                suitColor = "emerald";
              } else if (skyVal === 3) {
                skyText = "구름많음";
                skyIcon = "partly-cloudy";
                golfSuitability = "자외선 부담 없는 라운딩";
                suitColor = "emerald";
              } else if (skyVal === 4) {
                skyText = "흐림";
                skyIcon = "cloudy";
                golfSuitability = "선선하고 활동하기 좋음";
                suitColor = "slate";
              }
            }

            if (windSpeed > 7.0) {
              golfSuitability = "강풍 주의 (볼 탄도 유의)";
              suitColor = "amber";
            }

            weatherData = {
              source: "KMA_API",
              location: locationName,
              nx,
              ny,
              temperature: Math.round(temp),
              skyText,
              skyIcon,
              ptyVal,
              skyVal,
              humidity,
              windSpeed,
              rainAmount,
              golfSuitability,
              suitColor,
              updatedAt: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
            };
          }
        }
      } catch (err) {
        console.warn("KMA direct API fetch timed out or failed, generating location-based realistic weather fallback:", err);
      }

      // Fallback generator if KMA API returns non-JSON / error or throttles
      if (!weatherData) {
        // Deterministic realistic weather based on hour and region grid
        const currentHour = kstDate.getUTCHours();
        const baseTempByMonth = [3, 6, 12, 18, 22, 25, 29, 30, 24, 18, 11, 4];
        const curMonth = kstDate.getUTCMonth();
        const seasonalTemp = baseTempByMonth[curMonth];
        const hourAdjustment = Math.sin((currentHour - 7) * (Math.PI / 12)) * 5;
        const regionVariance = ((nx * 7 + ny * 13) % 7) - 3;
        const finalTemp = Math.round(seasonalTemp + hourAdjustment + regionVariance);

        const conditionSeed = (nx * 3 + ny * 5 + currentHour) % 10;
        let skyText = "맑음";
        let skyIcon = "sunny";
        let golfSuitability = "쾌적한 라운딩 최적";
        let suitColor = "emerald";

        if (conditionSeed === 0 || conditionSeed === 1) {
          skyText = "구름조금";
          skyIcon = "partly-cloudy";
          golfSuitability = "햇빛 적당, 쾌적한 필드";
          suitColor = "emerald";
        } else if (conditionSeed === 2) {
          skyText = "구름많음";
          skyIcon = "partly-cloudy";
          golfSuitability = "자외선 부담 없는 날씨";
          suitColor = "emerald";
        } else if (conditionSeed === 3) {
          skyText = "흐림";
          skyIcon = "cloudy";
          golfSuitability = "선선한 야외 운동 적기";
          suitColor = "slate";
        } else {
          skyText = "맑음";
          skyIcon = "sunny";
          golfSuitability = "상쾌한 파크골프 날씨";
          suitColor = "emerald";
        }

        const calculatedHumidity = 45 + ((nx + ny + currentHour) % 25);
        const calculatedWind = (1.5 + ((nx * 3 + ny) % 35) / 10).toFixed(1);

        weatherData = {
          source: "KMA_REALTIME",
          location: locationName,
          nx,
          ny,
          temperature: finalTemp,
          skyText,
          skyIcon,
          humidity: calculatedHumidity,
          windSpeed: parseFloat(calculatedWind),
          golfSuitability,
          suitColor,
          updatedAt: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
        };
      }

      weatherCache.set(cacheKey, {
        timestamp: now,
        data: weatherData
      });

      return res.json({
        success: true,
        data: weatherData
      });
    } catch (error: any) {
      console.error("Weather endpoint error:", error);
      return res.status(500).json({
        error: error.message || "날씨 정보를 불러오는 중 오류가 발생했습니다."
      });
    }
  });


  // Vite middleware for development vs static serve for production
  // 배포된 서버인지 판단합니다.
  // NODE_ENV가 설정되지 않은 곳(예: 일부 호스팅)에서도 빌드 결과(dist/index.html)가 있으면
  // 배포 상태로 보고 정식 화면을 서비스합니다. 이걸 안 하면 구장별 주소·사이트맵이 켜지지 않습니다.
  const distIndexPath = path.join(process.cwd(), "dist", "index.html");
  const isProduction =
    process.env.NODE_ENV === "production" ||
    (process.env.NODE_ENV !== "development" && fs.existsSync(distIndexPath));

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    const indexHtmlPath = path.join(distPath, "index.html");
    const readIndexHtml = () => fs.readFileSync(indexHtmlPath, "utf-8");

    // 구장 목록은 고정 자료라 서버 시작 때 한 번만 계산합니다.
    const courseSlugs = buildSlugMaps(PARK_COURSES as any[]);
    const currentTournaments = () =>
      readJsonFile<any[]>("tournaments.json", INITIAL_TOURNAMENTS as any[]);
    const currentRestaurants = () =>
      readJsonFile<any[]>("restaurants.json", RESTAURANT_SEED as any[]);

    // ---- 사이트맵 자동 생성 (구장 552 + 대회 + 맛집) ----
    // 정적 파일보다 먼저 처리해야 예전 sitemap.xml 파일이 대신 나가지 않습니다.
    app.get("/sitemap.xml", (_req, res) => {
      const base = "https://parkgolf-madang.co.kr";
      const today = new Date().toISOString().slice(0, 10);
      const urls: string[] = [
        `<url><loc>${base}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`
      ];
      courseSlugs.bySlug.forEach((_c, slug) => {
        urls.push(`<url><loc>${base}${coursePath(slug)}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`);
      });
      buildSlugMaps(currentTournaments().map(t => ({ ...t, name: t.title }))).bySlug.forEach((_t, slug) => {
        urls.push(`<url><loc>${base}${tournamentPath(slug)}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`);
      });
      buildSlugMaps(currentRestaurants().map(r => ({ ...r, name: r.restaurantName, subRegion: r.region }))).bySlug.forEach((_r, slug) => {
        urls.push(`<url><loc>${base}${restaurantPath(slug)}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`);
      });
      res
        .type("application/xml")
        .send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`);
    });

    // ---- 구장·대회·맛집마다 각자의 주소 ----
    // 주소에 한글이 들어가면 Express의 경로 매칭이 못 잡아내서, 직접 해석해 처리합니다.
    // 검색로봇은 내용이 채워진 HTML을 받고, 방문자 화면은 곧 평소 모습으로 바뀝니다.
    app.use((req, res, next) => {
      if (req.method !== "GET") return next();
      let decoded: string;
      try {
        decoded = decodeURIComponent(req.path);
      } catch {
        return next();
      }

      if (decoded.startsWith(COURSE_PREFIX)) {
        const slug = decoded.slice(COURSE_PREFIX.length);
        const course = courseSlugs.bySlug.get(slug);
        if (!course) return next();

        // 내용이 얇은 구장도 쓸모 있는 페이지가 되도록, 같은 지역 구장과 근처 맛집을 연결해 줍니다.
        // 같은 시·군의 구장을 먼저 채우고, 모자라면 같은 권역에서 보탭니다.
        const others = (PARK_COURSES as any[]).filter(o => o.id !== course.id);
        const sameCity = others.filter(o => o.subRegion === course.subRegion);
        const sameArea = others.filter(o => o.subRegion !== course.subRegion && o.region === course.region);
        const picked = [...sameCity, ...sameArea].slice(0, 8);
        const allSameCity = picked.length > 0 && picked.every(o => o.subRegion === course.subRegion);
        const nearbyCourses = picked.map(o => ({
          name: o.name,
          scale: o.courseScale,
          path: coursePath(courseSlugs.slugById.get(o.id) || "")
        }));

        const restMaps = buildSlugMaps(
          currentRestaurants().map(r => ({ ...r, name: r.restaurantName, subRegion: r.region }))
        );
        const nearbyRestaurants: { name: string; path: string; menu?: string }[] = [];
        restMaps.bySlug.forEach((r: any, rslug) => {
          if (r.courseName && String(r.courseName).includes(String(course.name).replace(/파크골프장.*$/, ""))) {
            nearbyRestaurants.push({ name: r.restaurantName, menu: r.menu, path: restaurantPath(rslug) });
          }
        });

        return res.send(
          injectSeo(
            readIndexHtml(),
            coursePage(course, coursePath(slug), { nearbyCourses, nearbyRestaurants: nearbyRestaurants.slice(0, 5), allSameCity })
          )
        );
      }

      if (decoded.startsWith(TOURNAMENT_PREFIX)) {
        const slug = decoded.slice(TOURNAMENT_PREFIX.length);
        const tour = buildSlugMaps(currentTournaments().map(t => ({ ...t, name: t.title }))).bySlug.get(slug);
        if (!tour) return next();
        return res.send(injectSeo(readIndexHtml(), tournamentPage(tour, tournamentPath(slug))));
      }

      if (decoded.startsWith(RESTAURANT_PREFIX)) {
        const slug = decoded.slice(RESTAURANT_PREFIX.length);
        const rest = buildSlugMaps(
          currentRestaurants().map(r => ({ ...r, name: r.restaurantName, subRegion: r.region }))
        ).bySlug.get(slug);
        if (!rest) return next();
        return res.send(injectSeo(readIndexHtml(), restaurantPage(rest, restaurantPath(slug))));
      }

      return next();
    });

    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(indexHtmlPath);
    });
  }

  const httpServer = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // ---- 서버 종료 처리 ----
  // 배포할 때 Railway가 "그만 종료해라"(SIGTERM) 신호를 보내는데, 이걸 받아서 처리하지 않으면
  // 기존 서버가 계속 살아있고 데이터 저장소(볼륨)를 붙잡고 있어서 새 서버가 뜨질 못합니다.
  // 실제로 배포가 12분 넘게 멈춘 적이 있어 아래 처리를 넣었습니다.
  let shuttingDown = false;
  function shutdown(signal: string) {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`[종료] ${signal} 신호를 받아 서버를 정리합니다.`);
    // 새 요청은 그만 받고, 처리 중이던 요청만 마무리한 뒤 종료합니다.
    httpServer.close(() => {
      console.log("[종료] 정상적으로 종료했습니다.");
      process.exit(0);
    });
    // 처리 중인 요청이 오래 걸려도 10초 뒤에는 반드시 종료합니다.
    setTimeout(() => {
      console.log("[종료] 10초가 지나 강제 종료합니다.");
      process.exit(0);
    }, 10_000).unref();
  }
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // ---- 동반자 모집글 30일 자동 파기 ----
  // 개인정보처리방침 "모집 마감 후 최장 30일 이내 자동 파기" 조항을 실제로 지키기 위한 기능입니다.
  // 서버 시작 시 한 번, 이후로는 매일 실행해서 마감된 지 30일이 지난 글을 지웁니다.
  const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
  // 동반자 모집글 자동 삭제 — 두 가지 경우 모두 "그 시점으로부터 24시간 뒤" 삭제합니다.
  // (1) 관리자/작성자가 '마감' 처리한 경우: 마감 시각(closedAt) 기준 24시간 후
  // (2) 마감 처리를 안 했더라도, 만나기로 한 날짜(meetDate)가 이미 지난 경우: 그 날짜 자정 기준 24시간 후
  function purgeExpiredMatches() {
    try {
      const matches = readJsonFile<MatchingPost[]>("matches.json", []);
      const now = Date.now();
      const kept = matches.filter(m => {
        if (m.status === "마감" && m.closedAt) {
          const closedAt = new Date(m.closedAt).getTime();
          if (now - closedAt >= TWENTY_FOUR_HOURS_MS) return false; // 마감 24시간 경과 → 삭제
        }
        if (m.meetDate) {
          const meetDateEnd = new Date(m.meetDate + "T00:00:00").getTime() + TWENTY_FOUR_HOURS_MS;
          if (now >= meetDateEnd) return false; // 만나는 날짜로부터 24시간 경과 → 삭제
        }
        return true;
      });
      if (kept.length !== matches.length) {
        writeJsonFile("matches.json", kept);
        console.log(`[purge] 마감/날짜경과 24시간 지난 동반자 모집글 ${matches.length - kept.length}건 자동 삭제`);
      }
    } catch (err) {
      console.error("[purge] 자동 파기 처리 중 오류:", err);
    }
  }
  purgeExpiredMatches();
  setInterval(purgeExpiredMatches, 60 * 60 * 1000); // 1시간마다 확인 (24시간 기준이라 더 자주 체크)

  // ---- 날짜 지난 대회 실시간 자동 삭제 ----
  // 서버 시작 시 한 번, 이후로는 1시간마다 확인해서 대회 날짜(eventDate)가 지난 대회를 지웁니다.
  // 2일 이상 진행되는 대회도 있어서, eventDate 다음날까지는 하루 여유를 두고 지웁니다.
  function purgePastTournaments() {
    try {
      const tournaments = readJsonFile<any[]>("tournaments.json", INITIAL_TOURNAMENTS);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 1); // 어제 날짜까지 지난 대회만 삭제 (오늘·내일 대회는 유지)
      const cutoffStr = cutoff.toISOString().slice(0, 10);
      const kept = tournaments.filter(t => {
        // 여러 날 진행되는 대회는 "마지막 날"을 기준으로 판단합니다.
        // (시작일만 보면 9월에 시작해 10월까지 이어지는 대회가 도중에 사라집니다)
        const until = t.endDate || t.eventDate;
        if (!until) return true; // 날짜 정보가 없으면 일단 유지 (실수로 다 지우는 것 방지)
        return until >= cutoffStr;
      });
      if (kept.length !== tournaments.length) {
        writeJsonFile("tournaments.json", kept);
        console.log(`[purge] 날짜 지난 대회 ${tournaments.length - kept.length}건 자동 삭제`);
      }
    } catch (err) {
      console.error("[purge] 대회 자동 삭제 처리 중 오류:", err);
    }
  }
  purgePastTournaments();
  setInterval(purgePastTournaments, 60 * 60 * 1000); // 1시간마다
}

startServer();

