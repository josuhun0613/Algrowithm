# Algrowithm Career Navigator — SaaS 풀 기획서 (v2.0)

> 기존 기획 + Algrowithm 플랫폼 자산 분석을 기반으로 확장한 종합 기획

---

## 0. Executive Summary

**한 줄 정의:** AI 기반 5-Why 커리어 디버깅 → 개인화 대시보드 → 워크숍 퍼널로 연결되는 B2B2C SaaS

**핵심 가치:**
- 참석자: 5분 만에 커리어 근본 원인 진단 + 인스타 공유 가능한 비주얼 리포트
- 운영자(코칭 선생님): 부스/세미나 리드 수집 + 후속 워크숍 전환 자동화
- 기업 고객: 임직원 커리어 진단 도구로 활용 (B2B 확장)

---

## 1. 현재 자산 분석 (AS-IS)

### 이미 있는 것들
| 자산 | 위치 | 상태 | 재활용 가치 |
|------|------|------|-------------|
| 5-Why 디버거 (Gemini) | `tools/life-debugger.html` | 완성 | ★★★★★ 핵심 엔진 |
| 5-Why 디버거 (Next.js) | `C:\life-debugger\` | 완성 | ★★★★★ 컴포넌트 구조 |
| EPTI 에니어그램 진단 | `admin/epti.html` + `api/enneagram-report.js` | 완성 | ★★★★☆ 성격 레이어 |
| 워크북 4종 | `workbooks/workbook_1~4.html` | 완성 | ★★★☆☆ 콘텐츠 참조 |
| AQ 진단 워크북 | `workbooks/workbook_aq.html` | 완성 | ★★★★☆ 적응지수 |
| AI 이미지 생성 | `api/generate-image.js` (Imagen 4) | 완성 | ★★★★☆ 아바타 생성 |
| AI 캐릭터 분석 | `api/analyze.js` (Gemini 다중 모드) | 완성 | ★★★★☆ |
| 웹사이트 생성/배포 | `api/generate-website.js` + `deploy-site.js` | 완성 | ★★★☆☆ |
| 텔레그램 알림 | `api/notify-telegram.js` | 완성 | ★★★☆☆ 운영 알림 |
| GitHub OAuth + 배포 | `api/github-auth.js` | 완성 | ★★☆☆☆ |

### 핵심 발견
- **life-debugger 프로젝트가 이미 Next.js + TypeScript로 구현되어 있음** → SaaS의 기반 프레임워크로 직접 확장 가능
- 기존 Algrowithm은 정적 HTML 사이트 → SaaS는 별도 Next.js 프로젝트로 분리하되, API는 공유

---

## 2. 시스템 아키텍처 (TO-BE)

```
┌─────────────────────────────────────────────────────────┐
│                    사용자 접점 (Entry Points)              │
├──────────┬──────────┬──────────┬────────────────────────┤
│ QR 부스   │ 웹 링크   │ 카카오톡  │ 기업 임베드 (iframe)    │
└────┬─────┴────┬─────┴────┬─────┴──────────┬─────────────┘
     │          │          │                │
     ▼          ▼          ▼                ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js App (App Router)                    │
│                                                         │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │
│  │ Onboard │→│ 5-Why    │→│ Analysis │→│ Dashboard  │  │
│  │ Screen  │ │ Chat     │ │ Engine   │ │ Generator  │  │
│  └─────────┘ └──────────┘ └──────────┘ └────────────┘  │
│       │                                      │          │
│       │    ┌──────────┐ ┌──────────┐         │          │
│       └───→│ EPTI     │ │ AQ 진단  │         │          │
│            │ 진단     │ │          │         │          │
│            └─────┬────┘ └────┬─────┘         │          │
│                  └─────┬─────┘               │          │
│                        ▼                     ▼          │
│              ┌──────────────────────────────┐           │
│              │    Unified Profile JSON      │           │
│              └──────────────────────────────┘           │
└──────────────────────────┬──────────────────────────────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
     ┌────────────┐ ┌───────────┐ ┌────────────┐
     │ Vercel     │ │ Supabase  │ │ Claude /   │
     │ Serverless │ │ (DB+Auth) │ │ Gemini API │
     └────────────┘ └───────────┘ └────────────┘
```

### Tech Stack (확장)

| 레이어 | 기술 | 이유 |
|--------|------|------|
| Framework | **Next.js 14 (App Router)** | life-debugger에서 이미 사용 중 |
| Styling | **Tailwind CSS + Framer Motion** | 기획서 명시 + 기존 코드 호환 |
| AI Engine | **Claude 3.5 Sonnet** (5-Why 핵심) + **Gemini Flash** (빠른 보조) | Claude가 심층 분석에 강함 |
| Image Gen | **Google Imagen 4** | 기존 API 재활용 |
| Database | **Supabase** (PostgreSQL + Auth + Realtime) | 무료 티어로 시작, 실시간 대시보드 |
| Deployment | **Vercel** | 기존 인프라 |
| Analytics | **Vercel Analytics** + 자체 이벤트 트래킹 | |
| Notification | **Telegram Bot** (운영) + **카카오 알림톡** (사용자) | |

---

## 3. 사용자 플로우 (상세)

### Phase 0: 진입 (30초)
```
QR 스캔 / 링크 클릭
    → 랜딩 (부스 브랜딩 커스텀 가능)
    → 이름 + 한 줄 고민 입력
    → "디버깅 시작" 버튼
```

### Phase 1: 5-Why 커리어 디버깅 (3~5분)
```
[Turn 1] 사용자 고민 입력
    → AI: 공감 + Why #1 질문
[Turn 2] 사용자 답변
    → AI: 핵심 키워드 포착 + Why #2
[Turn 3] 사용자 답변
    → AI: 감정 레이어 탐색 + Why #3
[Turn 4] 사용자 답변
    → AI: 가치관/두려움 탐색 + Why #4
[Turn 5] 사용자 답변
    → AI: 근본 원인 확인 질문 + Why #5
    → 분석 시작 (로딩 애니메이션)
```

### Phase 2: AI 종합 분석 (백그라운드 10초)
5-Why 결과를 기반으로 **7가지 요소**를 추출:

```json
{
  "userName": "수훈",
  "debugReport": {
    "currentBug": "현재 겪고 있는 본질적 커리어 정체 원인",
    "rootCause": "5-Why를 통해 도출된 심층 원인",
    "bugSeverity": "critical | major | minor",
    "coreStrength": "발견된 핵심 강점",
    "hiddenPattern": "반복되는 패턴 (본인이 모르는)",
    "futurePatch": "즉시 실행 가능한 1단계 해결책",
    "growthAlgorithm": "장기적 성장 알고리즘 제안"
  },
  "careerMetrics": {
    "selfAwareness": 78,
    "adaptability": 65,
    "directionClarity": 42,
    "actionReadiness": 85,
    "growthPotential": 91
  },
  "personalityLayer": {
    "eptiType": "3w4",
    "workStyle": "전략적 실행가",
    "blindSpot": "완벽주의로 인한 시작 지연"
  },
  "seminarRecommendation": {
    "message": "개인화된 세미나 추천 메시지",
    "urgency": "high | medium | low",
    "matchedWorkshop": "workbook_3"
  }
}
```

### Phase 3: Personal Dashboard 렌더링 (즉시)

대시보드 구성 — **"개발자 감성 Code Editor 룩앤필"**:

```
┌─────────────────────────────────────────────┐
│ 🔍 career_debugger.exe — {이름}의 분석 결과  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─ 🐛 Bug Report ────────────────────┐    │
│  │ Current Bug: {currentBug}           │    │
│  │ Severity: ●●●○○ {bugSeverity}      │    │
│  │ Root Cause: {rootCause}             │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─ 📊 Career Metrics ───────────────┐     │
│  │ ██████████░░  Self-Awareness  78%  │     │
│  │ ████████░░░░  Adaptability    65%  │     │
│  │ █████░░░░░░░  Direction       42%  │     │
│  │ ███████████░  Action Ready    85%  │     │
│  │ ████████████  Growth Pot.     91%  │     │
│  └────────────────────────────────────┘     │
│                                             │
│  ┌─ 💡 Core Strength ────────────────┐     │
│  │ "{coreStrength}"                   │     │
│  │                                    │     │
│  │ 숨겨진 패턴: {hiddenPattern}        │     │
│  └────────────────────────────────────┘     │
│                                             │
│  ┌─ 🔧 Future Patch (v1.0) ─────────┐     │
│  │ > {futurePatch}                    │     │
│  └────────────────────────────────────┘     │
│                                             │
│  ┌─ 🚀 Growth Algorithm ────────────┐     │
│  │ {growthAlgorithm}                  │     │
│  └────────────────────────────────────┘     │
│                                             │
│  ┌─ 🔒 LOCKED ──────────────────────┐     │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │     │
│  │ "세미나 참여 시 잠금 해제"          │     │
│  │ → 상세 로드맵 + AI 코칭 리포트     │     │
│  │ [세미나 신청하기]                   │     │
│  └────────────────────────────────────┘     │
│                                             │
│  ┌─ Share ───────────────────────────┐     │
│  │ [📸 이미지 저장] [📱 카카오 공유]   │     │
│  │ [🔗 링크 복사]  [📷 인스타 스토리]  │     │
│  └────────────────────────────────────┘     │
└─────────────────────────────────────────────┘
```

---

## 4. 기획서에 없었던 추가 기능 (확장 제안)

### 4-1. 🎭 성격 레이어 통합 (EPTI + AQ)

기존 EPTI 에니어그램 진단(`admin/epti.html`)과 AQ 적응지수(`workbooks/workbook_aq.html`)를 5-Why 결과와 **크로스 분석**:

```
5-Why 근본 원인 + EPTI 성격 유형 + AQ 적응지수
    → "당신은 3w4(성취자) 유형인데, 적응지수가 낮은 영역에서
       반복적으로 정체를 겪고 있습니다"
    → 더 정교한 맞춤 코칭 가능
```

**구현:** 5-Why 챗 완료 후, 선택적으로 "더 정밀한 분석 받기" → 미니 EPTI (10문항 축약) + AQ 퀵 진단

### 4-2. 🏢 부스 운영자 Admin 대시보드

```
/admin/booth-dashboard
├── 실시간 참석자 수 / 완료율 / 평균 소요시간
├── 참석자 리스트 (이름, 고민 요약, 결과 미리보기)
├── 세미나 전환율 (리드 → 신청)
├── 인기 고민 키워드 워드클라우드
├── CSV 다운로드 (참석자 데이터)
└── 텔레그램 실시간 알림 설정
```

**기존 자산 활용:** `api/notify-telegram.js` → 새 참석자/세미나 신청 시 즉시 알림

### 4-3. 📱 SNS 공유 최적화

인스타 스토리 사이즈(1080x1920)로 대시보드를 렌더링:

```
- html2canvas → 대시보드를 이미지로 캡처 (기존 life-debugger.html에서 이미 사용 중)
- 카카오톡 공유 (OG 메타 + 카카오 SDK)
- 공유 링크 → 본인 대시보드 퍼머링크 (algrowithm.org/result/{id})
```

### 4-4. 🎮 게이미피케이션 — "커리어 레벨 시스템"

기존 워크북1의 "캐릭터 스탯" 개념을 확장:

```
Level 1: Bug Reporter     — 5-Why 완료
Level 2: Code Reviewer    — EPTI 진단 완료
Level 3: Junior Developer — 워크숍 1회 참석
Level 4: Senior Developer — 워크숍 3회 완료
Level 5: Tech Lead        — 전체 코스 수료 + 멘토 활동
```

각 레벨마다 대시보드에 **뱃지**가 추가되어, 성장 과정이 시각화됨

### 4-5. 🔄 시간축 비교 — "Before & After"

같은 사람이 3개월 후 다시 진단하면:
```
[2026.03] Bug: 방향성 부재  →  [2026.06] Bug: 실행력 부족
Direction Clarity: 42%     →   Direction Clarity: 78% ↑
```
→ 코칭 효과를 데이터로 증명 (B2B 세일즈 자료로 활용 가능)

### 4-6. 🤖 AI 캐릭터 아바타 생성

기존 `api/generate-image.js` (Imagen 4) + `api/analyze.js` (캐릭터 모드) 활용:

```
5-Why 결과 기반 → 나만의 커리어 캐릭터 자동 생성
예: "전략적 실행가" → 갑옷 입은 전사 스타일 미니언 캐릭터
→ 대시보드에 프로필 아바타로 표시
→ 인스타 공유 시 캐릭터가 같이 노출
```

### 4-7. 🔐 Locked 섹션 상세 설계

| 섹션 | 무료 | 세미나 참석 후 해제 | 프리미엄 (유료) |
|------|------|---------------------|-----------------|
| Bug Report | ✅ | ✅ | ✅ |
| Career Metrics | ✅ 그래프만 | ✅ 수치+해석 | ✅ |
| Core Strength | ✅ 한 줄 | ✅ 상세 | ✅ |
| Future Patch | ✅ | ✅ | ✅ |
| 상세 로드맵 | 🔒 | ✅ 3개월 | ✅ 12개월 |
| AI 코칭 리포트 | 🔒 | ✅ 1회 | ✅ 월간 |
| EPTI 크로스 분석 | 🔒 | 🔒 | ✅ |
| Before/After 추적 | 🔒 | 🔒 | ✅ |
| AI 캐릭터 생성 | 🔒 | ✅ 1회 | ✅ 무제한 |

잠금 해제 방식:
```
// 세미나 코드 입력
const unlockCode = "ALGO-2026-MARCH";  // 운영자가 부스에서 배포
// 또는 QR 스캔으로 자동 해제
```

---

## 5. 데이터 모델 (Supabase)

```sql
-- 사용자 (인증 없이 세션 기반 + 선택적 회원가입)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5-Why 세션
CREATE TABLE debug_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  booth_id TEXT,                    -- 어떤 부스/이벤트에서 왔는지
  initial_concern TEXT NOT NULL,
  conversation JSONB NOT NULL,      -- 전체 대화 기록
  analysis_result JSONB NOT NULL,   -- AI 분석 결과 JSON
  career_metrics JSONB,             -- 5가지 지표 점수
  created_at TIMESTAMPTZ DEFAULT now()
);

-- EPTI 결과 (선택)
CREATE TABLE epti_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  scores JSONB NOT NULL,
  main_type INTEGER,
  report TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 세미나 리드
CREATE TABLE seminar_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id UUID REFERENCES debug_sessions(id),
  status TEXT DEFAULT 'interested',  -- interested → registered → attended → completed
  workshop_type TEXT,                -- workbook_1, workbook_2, etc.
  unlock_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 부스/이벤트 설정
CREATE TABLE booths (
  id TEXT PRIMARY KEY,               -- "2026-march-gangnam"
  name TEXT NOT NULL,
  organizer_id UUID,
  config JSONB,                      -- 테마 색상, 로고, CTA 문구 커스텀
  seminar_link TEXT,
  unlock_code TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 6. 프로젝트 구조 (Next.js)

```
career-navigator/
├── app/
│   ├── layout.tsx                    # 루트 레이아웃
│   ├── page.tsx                      # 랜딩 (부스 진입)
│   ├── globals.css
│   │
│   ├── booth/[boothId]/
│   │   └── page.tsx                  # 부스별 커스텀 랜딩
│   │
│   ├── debug/
│   │   └── page.tsx                  # 5-Why 챗 인터페이스
│   │
│   ├── result/[sessionId]/
│   │   └── page.tsx                  # 개인 대시보드 (퍼머링크)
│   │
│   ├── result/[sessionId]/share/
│   │   └── page.tsx                  # 인스타 스토리용 렌더링
│   │
│   ├── epti/
│   │   └── page.tsx                  # 미니 EPTI 진단 (선택)
│   │
│   ├── unlock/
│   │   └── page.tsx                  # 세미나 코드 입력 → 잠금 해제
│   │
│   ├── admin/
│   │   ├── page.tsx                  # 운영자 대시보드
│   │   ├── booth/[boothId]/
│   │   │   └── page.tsx              # 부스별 통계
│   │   └── leads/
│   │       └── page.tsx              # 리드 관리
│   │
│   └── api/
│       ├── analyze/route.ts          # 5-Why AI 분석
│       ├── epti/route.ts             # EPTI 진단 AI
│       ├── generate-avatar/route.ts  # AI 캐릭터 생성
│       ├── unlock/route.ts           # 잠금 해제 검증
│       ├── notify/route.ts           # 텔레그램 알림
│       └── export/route.ts           # CSV 내보내기
│
├── components/
│   ├── chat/
│   │   ├── ChatInput.tsx             # (life-debugger에서 이관)
│   │   ├── ChatMessage.tsx
│   │   ├── ProgressBar.tsx
│   │   └── TypingIndicator.tsx
│   │
│   ├── dashboard/
│   │   ├── BugReport.tsx             # 버그 리포트 카드
│   │   ├── CareerMetrics.tsx         # 레이더 차트 / 바 차트
│   │   ├── CoreStrength.tsx          # 강점 카드
│   │   ├── FuturePatch.tsx           # 해결책 카드
│   │   ├── GrowthRoadmap.tsx         # 성장 로드맵 (타임라인)
│   │   ├── LockedSection.tsx         # 잠금 섹션
│   │   └── ShareButtons.tsx          # 공유 버튼 모음
│   │
│   ├── admin/
│   │   ├── RealtimeStats.tsx         # 실시간 통계
│   │   ├── LeadTable.tsx             # 리드 테이블
│   │   └── WordCloud.tsx             # 키워드 클라우드
│   │
│   └── ui/
│       ├── CodeBlock.tsx             # 코드 에디터 스타일 컨테이너
│       ├── Terminal.tsx              # 터미널 느낌 UI
│       └── GlassCard.tsx             # 글래스모피즘 카드
│
├── hooks/
│   ├── useChat.ts                    # (life-debugger에서 이관)
│   ├── useAnalysis.ts               # AI 분석 상태 관리
│   └── useRealtime.ts               # Supabase 실시간 구독
│
├── lib/
│   ├── constants.ts                  # (life-debugger에서 이관 + 확장)
│   ├── types.ts                      # (확장)
│   ├── supabase.ts                   # Supabase 클라이언트
│   ├── prompts/
│   │   ├── five-why.ts               # 5-Why 시스템 프롬프트
│   │   ├── analysis.ts               # 종합 분석 프롬프트
│   │   └── epti-mini.ts              # 미니 EPTI 프롬프트
│   └── utils/
│       ├── share.ts                  # SNS 공유 유틸
│       └── export.ts                 # 데이터 내보내기
│
├── public/
│   └── assets/                       # 로고, OG 이미지 등
│
├── package.json
├── tailwind.config.ts
├── next.config.js
└── vercel.json
```

---

## 7. AI 프롬프트 설계 (핵심)

### 5-Why 시스템 프롬프트 (Claude 3.5 Sonnet용 — 기존 Gemini 버전 업그레이드)

```typescript
export const FIVE_WHY_SYSTEM = `
당신은 Algrowithm의 '커리어 디버거'입니다.
소프트웨어 버그를 찾듯, 사용자의 커리어 정체 원인을 5-Why로 추적합니다.

[페르소나]
- ESTJ 스타일: 냉철하면서도 신뢰감 있는 전문가
- 팩트 기반이지만, 따뜻한 격려를 잊지 않음
- 코드 리뷰하듯 정확하게, 하지만 사람을 대하듯 부드럽게

[5-Why 전략 — 기존 life-debugger 로직 통합]
1. 대처 가능한 원인 → "왜"로 직접 파고듦
2. 대처 불가능한 원인 (경제적, 물리적, 타인, 과거) → 상황을 인정하고 결과부 질문
3. 매 턴마다: 공감 1문장 + 질문 1문장 (2-3문장 이내)

[출력 톤]
- "음, 그렇군요. 그건 마치 production 서버에서 silent error가 나는 것과 비슷하네요."
- 개발자/IT 메타포를 자연스럽게 섞되, 비개발자도 이해할 수 있게

[금지]
- 5번째 답변 전까지 조언/해결책 금지
- 한 번에 질문 2개 이상 금지
- "왜 돈이 없어요?" 같은 무의미한 질문 금지
`;
```

### 종합 분석 프롬프트

```typescript
export const ANALYSIS_SYSTEM = `
5-Why 대화 기록을 분석하여 다음 JSON을 생성하세요:

{
  "debugReport": {
    "currentBug": "string — 표면적 문제를 개발 용어로 비유",
    "rootCause": "string — 근본 원인 (2-3문장)",
    "bugSeverity": "critical | major | minor",
    "coreStrength": "string — 대화에서 발견된 강점",
    "hiddenPattern": "string — 본인이 모르는 반복 패턴",
    "futurePatch": "string — 즉시 실행 가능한 액션 (구체적으로)",
    "growthAlgorithm": "string — 6개월 성장 방향"
  },
  "careerMetrics": {
    "selfAwareness": number (0-100),
    "adaptability": number (0-100),
    "directionClarity": number (0-100),
    "actionReadiness": number (0-100),
    "growthPotential": number (0-100)
  },
  "seminarRecommendation": {
    "message": "string — 개인화된 추천 (왜 이 사람에게 세미나가 필요한지)",
    "urgency": "high | medium | low",
    "matchedWorkshop": "workbook_1 | workbook_2 | workbook_3 | workbook_4"
  }
}

[분석 기준]
- selfAwareness: 자기 문제를 얼마나 정확히 인식하는가
- adaptability: 변화에 대한 유연성이 대화에서 드러나는가
- directionClarity: 원하는 방향이 명확한가
- actionReadiness: 실행 의지가 있는가
- growthPotential: 성장 잠재력 (강점 + 의지 종합)

[워크숍 매칭 기준]
- rootCause가 자기인식 부족 → workbook_1 (내 안의 빌런)
- rootCause가 정체성/이미지 → workbook_2 (이미지 아이덴티티)
- rootCause가 방향성/브랜딩 → workbook_3 (커리어 브랜딩)
- rootCause가 실행/삶의 설계 → workbook_4 (내가 원하는 삶)
`;
```

---

## 8. 디자인 시스템

### 테마: "Code Editor Meets Career Coaching"

```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        // 코드 에디터 다크 테마
        'editor': {
          bg: '#1e1e2e',        // VS Code 다크 배경
          surface: '#2a2a3e',   // 카드 배경
          border: '#3a3a5e',    // 테두리
          text: '#e0e0f0',      // 기본 텍스트
        },
        // 구문 강조 색상 (데이터 시각화에 활용)
        'syntax': {
          keyword: '#c678dd',   // 보라 — 핵심 키워드
          string: '#98c379',    // 초록 — 강점/긍정
          number: '#e5c07b',    // 노랑 — 수치/메트릭
          error: '#e06c75',     // 빨강 — 버그/문제
          function: '#61afef',  // 파랑 — 액션/해결
          comment: '#5c6370',   // 회색 — 보조 텍스트
        },
        // Algrowithm 브랜드 (기존 유지)
        'soft-gold': '#d4af37',
        'deep-navy': '#001F3F',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Pretendard', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    }
  }
}
```

### UI 컴포넌트 스타일 가이드

```
┌─ Terminal Window ─────────────────────────┐
│ ● ● ●  career_debug.exe                   │ ← 맥 창 느낌 타이틀바
├────────────────────────────────────────────┤
│ $ analyzing career_bug --depth=5           │ ← 터미널 명령어 스타일
│                                            │
│ > Bug detected: direction_null_pointer     │ ← 분석 결과
│ > Severity: ■■■□□ MAJOR                    │
│ > Root cause found at stack trace #3       │
│                                            │
│ $ suggest --patch                          │ ← 해결책
│ > Applying patch: "start_small_project"    │
│ > Estimated recovery: 3 months             │
└────────────────────────────────────────────┘
```

---

## 9. 수익 모델

### Phase 1: 부스 운영 (현재 → 3개월)
- **무료**: 5-Why 진단 + 기본 대시보드
- **수익원**: 세미나/워크숍 등록 전환 (오프라인 매출)

### Phase 2: B2C SaaS (3~6개월)
- **Free**: 월 1회 진단 + 기본 리포트
- **Pro (₩9,900/월)**: 무제한 진단 + 상세 리포트 + AI 캐릭터 + Before/After 추적
- **Premium (₩29,900/월)**: 위 + 월간 AI 코칭 리포트 + EPTI 크로스 분석

### Phase 3: B2B (6개월~)
- **Enterprise**: 기업 맞춤 부스 시스템 임대
  - 커스텀 브랜딩 (로고, 색상, CTA)
  - 관리자 대시보드 + 데이터 분석
  - 월 ₩300,000~ (참여자 수 기반)

---

## 10. 개발 로드맵

### Sprint 1 (1~2주): MVP — 부스 디버거
- [ ] life-debugger 코드를 career-navigator로 마이그레이션
- [ ] AI 엔진 Gemini → Claude 3.5 Sonnet 전환
- [ ] 분석 결과 JSON 7요소 확장
- [ ] Dashboard 컴포넌트 (BugReport + CareerMetrics + CoreStrength)
- [ ] 이미지 저장 (html2canvas)
- [ ] QR 코드 진입 플로우

### Sprint 2 (3~4주): 공유 + 잠금
- [ ] Supabase 연동 (세션 저장)
- [ ] 퍼머링크 생성 (`/result/[id]`)
- [ ] 카카오톡 공유 + 인스타 스토리 최적화
- [ ] Locked 섹션 + 세미나 코드 해제
- [ ] 텔레그램 운영 알림

### Sprint 3 (5~6주): Admin + 분석
- [ ] 운영자 대시보드 (실시간 통계)
- [ ] 리드 관리 (상태 추적)
- [ ] CSV 내보내기
- [ ] 미니 EPTI 통합

### Sprint 4 (7~8주): 프리미엄 기능
- [ ] AI 캐릭터 아바타 생성 (Imagen 4 연동)
- [ ] Before/After 시간축 비교
- [ ] 게이미피케이션 (레벨 + 뱃지)
- [ ] 결제 연동 (토스페이먼츠)

### Sprint 5 (9~10주): B2B 확장
- [ ] 멀티 부스 지원 (`/booth/[boothId]`)
- [ ] 부스별 커스텀 브랜딩
- [ ] 기업용 iframe 임베드
- [ ] API 키 발급 시스템

---

## 11. 기존 기획서와의 차이점 정리

| 항목 | 기존 기획 | 확장된 기획 |
|------|-----------|-------------|
| AI 엔진 | Claude 3.5 Sonnet | Claude (핵심) + Gemini Flash (보조) + Imagen 4 (이미지) |
| 분석 요소 | 5개 | 7개 + Career Metrics 5지표 |
| 성격 진단 | 없음 | EPTI + AQ 크로스 분석 |
| 데이터 저장 | 없음 (일회성) | Supabase 영속 저장 + 퍼머링크 |
| 잠금 해제 | 단순 텍스트 | 코드 입력 + QR + 결제 3단계 |
| 공유 | 없음 | 이미지 저장 + 카카오 + 인스타 + 링크 |
| 운영 도구 | 없음 | Admin 대시보드 + 텔레그램 알림 |
| 수익 모델 | 세미나 전환만 | B2C SaaS + B2B 기업 임대 |
| 시간축 | 일회성 | Before/After 추적 (반복 진단) |
| 게이미피케이션 | 없음 | 레벨 + 뱃지 시스템 |
| 캐릭터 | 없음 | AI 아바타 자동 생성 |
| 배포 | 로컬/Vercel | Vercel + 부스별 멀티테넌트 |

---

## 12. 핵심 기술 리스크 & 대응

| 리스크 | 영향 | 대응 |
|--------|------|------|
| Claude API 응답 지연 (부스 환경) | 사용자 이탈 | Gemini Flash 폴백 + 스트리밍 응답 |
| 동시 접속 폭주 (부스 오픈) | 서버 과부하 | Vercel Edge + 큐 시스템 |
| 5-Why 품질 편차 | 만족도 하락 | 프롬프트 A/B 테스트 + few-shot 예시 |
| 개인정보 이슈 | 법적 리스크 | 최소 수집 + 동의 UI + 30일 자동 삭제 |
| API 비용 증가 | 수익성 악화 | 무료 티어 일일 한도 + 캐싱 |

---

> **다음 단계:** 이 기획을 기반으로 Sprint 1 MVP 개발을 시작할 수 있습니다.
> `C:\life-debugger`의 기존 코드를 베이스로, career-navigator 프로젝트를 새로 생성하는 것을 추천합니다.
