# Algrowithm 프로젝트 가이드

## 프로젝트 개요
- **algrowithm.org** — AI 커리어 브랜딩 워크숍 웹사이트
- 정적 HTML + Tailwind CDN + Vercel Serverless Functions
- 대표: 조수훈 (ESTJ / AI Architect)

## Career Navigator SaaS (개발 중)
- **위치:** `C:\career-navigator` (별도 Next.js 16 프로젝트)
- **기획/개발 문서:** `docs/career-navigator/README.md` 부터 읽을 것 (9개 문서 링크됨)
- **핵심:** 오프라인 부스에서 2030대가 AI 커리어 진단 → 개인 대시보드 → 세미나 전환
- **디자인:** 토스(toss.im) 베이스 미니멀
- **기술:** Next.js 16, Tailwind v4, Framer Motion, Zustand, Claude API
- **현재 상태:** Sprint 1 완료 (모듈 A/B/C + 대시보드 UI). Sprint 2 대기 (5-Why + Supabase)

## 중요한 파일들
- `docs/career-navigator/README.md` — SaaS 전체 문서 인덱스
- `docs/career-navigator/dev-roadmap.md` — 개발 진행 상황
- `docs/career-navigator/architecture.md` — 기술 스택, 프로젝트 구조
- `docs/career-navigator/modules.md` — 4개 입력 모듈 상세 설계
- `docs/career-navigator/ai-prompts.md` — AI 프롬프트 설계

## 기존 사이트 구조
- `index.html` — 메인 랜딩
- `workbooks/` — 워크북 4종 + AQ/브랜딩/STAR
- `tools/` — AI 도구 (이미지생성, 전자책, 웹사이트스튜디오, life-debugger)
- `admin/` — 관리자 (EPTI, 홍보포스터)
- `api/` — Vercel Serverless (Gemini, Imagen 4, GitHub OAuth 등)
- `js/header.js` — 공통 헤더 컴포넌트

## 관련 프로젝트
- `C:\life-debugger` — 5-Why 디버거 Next.js 앱 (career-navigator에 마이그레이션 예정)
