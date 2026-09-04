import fs from "fs";
import path from "path";

// 리뷰 · 동반자모집 · 광고 데이터를 저장하는 간단한 파일 기반 저장소입니다.
// 방문자마다 다른 브라우저(localStorage)에 흩어져 있던 데이터를 서버 한 곳에 모아서,
// 모든 방문자가 같은 데이터를 보게 하기 위한 최소 구현입니다.
//
// ⚠ 트래픽이 늘어나면 동시쓰기 충돌 위험이 있으니, 그때는 실제 데이터베이스(Supabase 등)로
// 옮기는 것을 권장합니다. 또한 이 방식은 "영구 저장 디스크가 있는" Node 서버(Railway, Render 등)에
// 배포했을 때만 데이터가 유지됩니다 — Vercel/Netlify 같은 서버리스·정적 환경에서는 재배포마다
// 파일이 초기화되거나 아예 쓰기가 안 될 수 있습니다.

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readJsonFile<T>(fileName: string, fallback: T): T {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), "utf-8");
    return fallback;
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`[store] ${fileName} 읽기 실패, 기본값으로 대체:`, err);
    return fallback;
  }
}

export function writeJsonFile<T>(fileName: string, data: T): void {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}
