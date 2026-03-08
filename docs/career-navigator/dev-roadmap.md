# 9. 개발 로드맵

> [← AI 프롬프트](./ai-prompts.md) | [README →](./README.md)

---

## 스프린트 계획

### Sprint 1: 프로젝트 셋업 + 모듈 A/B/C + 대시보드 ✅ DONE

- [x] 기획서 작성 (9개 문서)
- [x] Next.js 16 프로젝트 생성 (`C:\career-navigator`)
- [x] Tailwind v4 + 토스 디자인 시스템 설정 (`globals.css`)
- [x] 기본 레이아웃 (`app/layout.tsx`) — Pretendard 폰트, 메타데이터
- [x] 진입 화면 (`app/page.tsx`) — 이름 입력, 모드 선택, 이전 결과 조회
- [x] Zustand 스토어 (`stores/useSessionStore.ts`) — persist 포함
- [x] 타입 정의 (`lib/types.ts`) — 모든 모듈 + 분석 결과 타입
- [x] 모듈 상수 데이터 (`lib/constants.ts`) — A/B/C 전체 질문
- [x] UI 컴포넌트 — Button, Card, PageTransition, ProgressBar, LoadingScreen
- [x] 모듈 A: 커리어 스캔 (`app/scan/page.tsx`) — 6문항 카드 선택
- [x] 모듈 B: 가치관 프리즘 (`app/values/page.tsx`) — 5문항 트레이드오프
- [x] 모듈 C: 강점 디코더 (`app/strength/page.tsx`) — 5문항 시나리오
- [x] 강점 계산 로직 (점수 집계, 아키타입 결정)
- [x] 가치관 프로필 계산 로직
- [x] 모듈 간 전환 애니메이션 (Framer Motion)
- [x] 분석 로딩 화면 (`app/analyzing/page.tsx`)
- [x] AI 분석 API (`app/api/analyze/route.ts`) — Claude + Gemini 폴백 + 목업
- [x] AI 프롬프트 (`lib/ai/prompts/analysis.ts`)
- [x] slug 생성 유틸 (`lib/utils/slug.ts`)
- [x] 대시보드 (`app/result/[slug]/page.tsx`)
- [x] ArchetypeCard, PositionMap, ValuesDNA, StrengthBadges
- [x] NavigationRoute (타임라인), ActionCard, LockedSection
- [x] ShareBar (이미지 저장, 카카오, 링크 복사)
- [x] 빌드 성공 확인, dev 서버 200 OK

### Sprint 2: 5-Why + 공유 강화 (다음)

- [ ] 모듈 D: 5-Why 챗 (`app/debug/page.tsx`)
  - `C:\life-debugger`에서 useChat, ChatMessage, ChatInput 마이그레이션
  - Claude 스트리밍 응답 (`app/api/chat/route.ts`)
  - A/B/C 결과를 5-Why 컨텍스트로 전달
  - 3~5턴 동적 조절 (AI 판단)
  - 요약 → bugReport 생성
- [ ] "심층 분석만 하기" 모드 (진입 → 5-Why → 결과)
- [ ] 이미지 저장 최적화 (인스타 스토리 비율 옵션)
- [ ] 카카오톡 공유 SDK 연동
- [ ] OG 이미지 동적 생성 (`app/api/og/[slug]/route.tsx`)

### Sprint 3: Supabase + 퍼머링크

- [ ] Supabase 프로젝트 생성 + 환경변수 설정
- [ ] 테이블 마이그레이션 (sessions, booths)
- [ ] POST /api/session (세션 생성 + slug 중복 처리)
- [ ] GET /api/session/[slug] (퍼머링크 조회)
- [ ] 각 모듈 완료 시 Supabase 업데이트
- [ ] 잠금 해제 API (POST /api/unlock)
- [ ] 대시보드 퍼머링크 모드 (Supabase에서 데이터 로드)

### Sprint 4: 배포 + QA

- [ ] Vercel 배포 설정
- [ ] 환경변수 세팅 (Claude/Gemini/Supabase)
- [ ] 모바일 QA (iPhone, Android)
- [ ] 태블릿 QA
- [ ] 노트북 QA
- [ ] 부스 시뮬레이션 테스트 (5명 연속 진행)
- [ ] 성능 최적화 (LCP < 2s)
- [ ] SEO + OG 메타 검증

---

## Phase 2 (추후)

- [ ] Admin 대시보드 (운영자)
- [ ] 텔레그램 알림
- [ ] 부스별 커스텀 랜딩 (/booth/[id])
- [ ] AI 캐릭터 아바타 (Imagen 4)
- [ ] Before/After 시간축 비교
- [ ] 게이미피케이션 (레벨/뱃지)
- [ ] 결제 연동 (B2C SaaS)

---

## 현재 진행 상황

**Sprint 1 완료** — 핵심 UI 전체 구현, 빌드 성공
**다음:** Sprint 2 (5-Why 통합 + 공유)

## 프로젝트 위치

```
C:\career-navigator\        ← Next.js 16 프로젝트
C:\Algrowithm\docs\career-navigator\  ← 기획/개발 문서 (9개)
C:\life-debugger\            ← 5-Why 컴포넌트 소스 (마이그레이션 대상)
```
