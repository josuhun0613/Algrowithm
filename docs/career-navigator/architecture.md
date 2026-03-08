# 1. 시스템 아키텍처

> [← README](./README.md) | [사용자 플로우 →](./user-flow.md)

---

## 전체 구조도

```
사용자 접점
┌──────────┬──────────┬──────────────────┐
│ QR 부스   │ 웹 링크   │ 카카오톡 공유     │
└────┬─────┴────┬─────┴────────┬─────────┘
     └──────────┼──────────────┘
                ▼
     Next.js 15 App (App Router)
     ┌─────────────────────────────────┐
     │  /                  진입 화면    │
     │  /booth/[id]        부스별 랜딩  │
     │  /scan              모듈 A 스캔  │
     │  /values            모듈 B 가치관│
     │  /strength          모듈 C 강점  │
     │  /debug             모듈 D 5-Why │
     │  /result/[slug]     대시보드     │
     │  /admin             운영자 패널  │
     └───────────┬─────────────────────┘
                 │
     ┌───────────┼───────────────┐
     ▼           ▼               ▼
  Vercel      Supabase        AI APIs
  Serverless  (PostgreSQL     ┌──────────┐
  Functions    + Auth          │ Claude   │
              + Realtime)      │ Gemini   │
                               │ Imagen 4 │
                               └──────────┘
```

## 기술 스택

| 레이어 | 기술 | 버전 | 선택 이유 |
|--------|------|------|-----------|
| Framework | Next.js (App Router) | 15.x | life-debugger 호환 + RSC |
| Language | TypeScript | 5.x | 타입 안전성 |
| Styling | Tailwind CSS | 3.4+ | 토스 디자인 시스템 구현 |
| Animation | Framer Motion | 11.x | 페이지 전환 + 카드 애니메이션 |
| AI (핵심) | Claude 3.5 Sonnet | - | 5-Why 심층 분석, 종합 리포트 |
| AI (보조) | Gemini 2.0 Flash | - | 빠른 응답 필요 시 폴백 |
| AI (이미지) | Imagen 4 | - | 캐릭터 아바타 (Phase 2) |
| Database | Supabase | - | PostgreSQL + Auth + Realtime |
| 상태관리 | Zustand | 5.x | 모듈 간 데이터 공유 |
| 차트 | Recharts | 2.x | Career Metrics 시각화 |
| 이미지 캡처 | html2canvas | 1.4+ | 대시보드 → 이미지 저장 |
| 배포 | Vercel | - | 기존 인프라 |

## 프로젝트 디렉토리 구조

```
career-navigator/
├── app/
│   ├── layout.tsx                 # 루트 레이아웃 (폰트, 메타)
│   ├── page.tsx                   # 진입 화면 (모드 선택)
│   ├── globals.css                # Tailwind + 커스텀 스타일
│   │
│   ├── booth/[boothId]/
│   │   └── page.tsx               # 부스별 커스텀 랜딩
│   │
│   ├── scan/
│   │   └── page.tsx               # 모듈 A: 커리어 스캔
│   │
│   ├── values/
│   │   └── page.tsx               # 모듈 B: 가치관 프리즘
│   │
│   ├── strength/
│   │   └── page.tsx               # 모듈 C: 강점 디코더
│   │
│   ├── debug/
│   │   └── page.tsx               # 모듈 D: 5-Why 디버거
│   │
│   ├── analyzing/
│   │   └── page.tsx               # AI 분석 로딩 화면
│   │
│   ├── result/[slug]/
│   │   ├── page.tsx               # 개인 대시보드
│   │   └── share/
│   │       └── page.tsx           # 인스타 스토리용 렌더링
│   │
│   ├── unlock/
│   │   └── page.tsx               # 세미나 코드 → 잠금 해제
│   │
│   ├── admin/
│   │   └── page.tsx               # 운영자 대시보드 (Phase 2)
│   │
│   └── api/
│       ├── analyze/route.ts       # AI 종합 분석
│       ├── chat/route.ts          # 5-Why 스트리밍 응답
│       ├── session/route.ts       # 세션 생성/조회
│       ├── unlock/route.ts        # 잠금 해제 검증
│       └── og/[slug]/route.tsx    # OG 이미지 동적 생성
│
├── components/
│   ├── modules/
│   │   ├── ScanCard.tsx           # 모듈 A 선택 카드
│   │   ├── TradeoffCard.tsx       # 모듈 B 트레이드오프
│   │   ├── ScenarioCard.tsx       # 모듈 C 시나리오
│   │   ├── ChatMessage.tsx        # 모듈 D 채팅 메시지
│   │   ├── ChatInput.tsx          # 모듈 D 입력
│   │   └── ProgressBar.tsx        # 공통 진행 바
│   │
│   ├── dashboard/
│   │   ├── ArchetypeCard.tsx      # 아키타입 카드
│   │   ├── PositionMap.tsx        # 커리어 좌표 차트
│   │   ├── ValuesDNA.tsx          # 가치관 바 차트
│   │   ├── StrengthBadges.tsx     # 강점 태그
│   │   ├── NavigationRoute.tsx    # 내비게이션 타임라인
│   │   ├── ActionCard.tsx         # 이번 주 액션
│   │   ├── LockedSection.tsx      # 잠금 섹션
│   │   └── ShareBar.tsx           # 공유 버튼 바
│   │
│   └── ui/
│       ├── Button.tsx             # 토스 스타일 버튼
│       ├── Card.tsx               # 토스 스타일 카드
│       ├── PageTransition.tsx     # 페이지 전환 애니메이션
│       └── LoadingScreen.tsx      # 분석 로딩 화면
│
├── stores/
│   └── useSessionStore.ts         # Zustand — 전체 세션 상태
│
├── hooks/
│   ├── useChat.ts                 # 5-Why 채팅 로직
│   └── useAnalysis.ts            # AI 분석 요청/상태
│
├── lib/
│   ├── types.ts                   # 전체 타입 정의
│   ├── constants.ts               # 모듈 질문 데이터
│   ├── supabase/
│   │   ├── client.ts              # 브라우저 클라이언트
│   │   └── server.ts              # 서버 클라이언트
│   ├── ai/
│   │   ├── claude.ts              # Claude API 래퍼
│   │   ├── gemini.ts              # Gemini API 래퍼 (폴백)
│   │   └── prompts/
│   │       ├── five-why.ts        # 5-Why 프롬프트
│   │       ├── analysis.ts        # 종합 분석 프롬프트
│   │       └── archetype.ts       # 아키타입 생성 프롬프트
│   └── utils/
│       ├── slug.ts                # 이름-날짜 slug 생성
│       ├── share.ts               # SNS 공유 유틸
│       └── metrics.ts             # 지표 계산 유틸
│
├── public/
│   ├── og-default.png             # 기본 OG 이미지
│   └── fonts/                     # Pretendard 로컬 폰트
│
├── .env.local                     # 환경변수 (git 제외)
├── package.json
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── vercel.json
```

## 데이터 흐름

```
[사용자 입력]
     │
     ▼
모듈 A (6 selections) ──┐
모듈 B (5 tradeoffs)  ──┤
모듈 C (5 scenarios)  ──┤──→ Zustand Store (클라이언트 상태)
모듈 D (5-Why chat)   ──┘         │
                                  ▼
                         POST /api/analyze
                                  │
                                  ▼
                         Claude 3.5 Sonnet
                         (모든 모듈 데이터를 컨텍스트로 전달)
                                  │
                                  ▼
                         분석 결과 JSON
                                  │
                     ┌────────────┼────────────┐
                     ▼            ▼            ▼
               Supabase 저장   대시보드 렌더링  OG 이미지 생성
               (영속 저장)     (즉시 표시)     (공유용)
                     │
                     ▼
              퍼머링크 생성
              /홍길동-20260308
```

## 환경변수 목록

```env
# AI
ANTHROPIC_API_KEY=sk-ant-...           # Claude 3.5 Sonnet
GEMINI_API_KEY=AIza...                  # Gemini Flash (폴백)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# 운영
UNLOCK_CODE_SALT=random-salt-string     # 잠금 해제 코드 검증
TELEGRAM_BOT_TOKEN=                     # 운영 알림 (선택)
TELEGRAM_CHAT_ID=                       # 운영 알림 (선택)

# 공개
NEXT_PUBLIC_BASE_URL=https://algrowithm.org
```
