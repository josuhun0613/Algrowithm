# Algrowithm Career Navigator — SaaS 개발 문서

> **프로젝트:** AI 기반 커리어 내비게이션 SaaS
> **도메인:** algrowithm.org/[이름]-[날짜] (개인 대시보드 퍼머링크)
> **최종 수정:** 2026-03-08

---

## 한 줄 정의

오프라인 부스에서 2030대가 **5분 만에** AI 커리어 진단을 받고,
**인스타에 공유하고 싶은** 개인 대시보드를 생성하며,
**세미나/워크숍으로 전환**되는 풀퍼널 SaaS.

---

## 문서 목차

| # | 문서 | 내용 |
|---|------|------|
| 1 | **[architecture.md](./architecture.md)** | 시스템 아키텍처, 기술 스택, 프로젝트 구조 |
| 2 | **[user-flow.md](./user-flow.md)** | 사용자 플로우 (진입 → 모듈 A/B/C/D → 대시보드) |
| 3 | **[modules.md](./modules.md)** | 4개 입력 모듈 상세 설계 (질문, 데이터, AI 분석) |
| 4 | **[dashboard.md](./dashboard.md)** | 대시보드 구성 요소, 잠금 로직, 공유 기능 |
| 5 | **[design-system.md](./design-system.md)** | 토스 기반 디자인 시스템 (색상, 타이포, 컴포넌트) |
| 6 | **[api-spec.md](./api-spec.md)** | API 엔드포인트 명세 (Route Handlers) |
| 7 | **[database.md](./database.md)** | Supabase 스키마, RLS 정책, 데이터 흐름 |
| 8 | **[ai-prompts.md](./ai-prompts.md)** | AI 프롬프트 설계 (모듈별 + 종합 분석) |
| 9 | **[dev-roadmap.md](./dev-roadmap.md)** | 개발 로드맵, 스프린트 계획, 체크리스트 |

---

## 핵심 원칙

1. **모바일 퍼스트** — 부스에서 QR 스캔 = 모바일. 노트북은 확장.
2. **입력은 전부 선택형** — 텍스트 입력은 5-Why 대화에서만.
3. **토스 디자인** — 한 화면에 하나, 거대한 여백, 절제된 색상.
4. **5분 완결** — 모듈 A+B+C = 3.5분, D(5-Why) = 선택적 2분.
5. **상담사 제어** — 모듈 스킵/조합 가능, 바로 원하는 단계로 진입.

---

## 기존 자산 활용

| 자산 | 출처 | 활용 방법 |
|------|------|-----------|
| 5-Why 채팅 엔진 | `C:\life-debugger` (Next.js) | useChat 훅, 컴포넌트 마이그레이션 |
| 5-Why 프롬프트 | `life-debugger/lib/constants.ts` | 프롬프트 개선 후 재사용 |
| EPTI 에니어그램 | `api/enneagram-report.js` | 성격 레이어 참조 로직 |
| AI 이미지 생성 | `api/generate-image.js` | 캐릭터 아바타 (Phase 2) |
| 텔레그램 알림 | `api/notify-telegram.js` | 운영 알림 재사용 |
| Vercel 배포 | `vercel.json` | 배포 인프라 공유 |

---

## Quick Start (개발자용)

```bash
cd c:\career-navigator
npm install
npm run dev        # http://localhost:3000
```

환경변수 (`.env.local`):
```
ANTHROPIC_API_KEY=       # Claude 3.5 Sonnet
GEMINI_API_KEY=          # Gemini Flash (폴백)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
