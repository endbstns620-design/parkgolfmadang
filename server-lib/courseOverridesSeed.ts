import { ParkCourse } from '../src/types';

// 구장 정보는 이제 src/data/parkCoursesData.ts(전국 553개 구장 전수조사 자료)가 원본이라
// 별도의 보정자료가 필요 없습니다. 관리자가 화면에서 직접 고친 내용만
// data/course-overrides-admin.json 에 저장되어 이 위에 덧씌워집니다.
export const COURSE_OVERRIDES_SEED: Record<string, Partial<ParkCourse>> = {};
