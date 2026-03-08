# 6. API 엔드포인트 명세

> [← 디자인 시스템](./design-system.md) | [데이터베이스 →](./database.md)

---

## 엔드포인트 목록

| Method | Path | 설명 | 인증 |
|--------|------|------|------|
| POST | `/api/session` | 세션 생성 | 없음 |
| GET | `/api/session/[slug]` | 세션 조회 | 없음 |
| POST | `/api/chat` | 5-Why 스트리밍 응답 | 없음 |
| POST | `/api/analyze` | AI 종합 분석 | 없음 |
| POST | `/api/unlock` | 잠금 해제 | 없음 |
| GET | `/api/og/[slug]` | OG 이미지 생성 | 없음 |

---

## POST /api/session

세션 생성 — 이름 입력 후 호출

### Request
```typescript
{
  name: string;          // "홍길동"
  boothId?: string;      // "2026-march-gangnam" (부스 경유 시)
  mode: 'full' | 'debug-only';  // 풀코스 or 5-Why만
}
```

### Response
```typescript
{
  sessionId: string;     // UUID
  slug: string;          // "홍길동-20260308"
}
```

### 로직
1. 이름 + 오늘 날짜로 slug 생성
2. Supabase `sessions` 테이블에 INSERT
3. 중복 slug 시 -2, -3 부여

---

## GET /api/session/[slug]

대시보드 페이지에서 세션 데이터 조회

### Response
```typescript
{
  session: {
    id: string;
    slug: string;
    name: string;
    mode: string;
    createdAt: string;
    scanResult: ScanResult | null;
    valuesResult: ValuesResult | null;
    strengthResult: StrengthResult | null;
    debugResult: DebugResult | null;
    analysisResult: AnalysisResult | null;
    unlocked: boolean;
  }
}
```

---

## POST /api/chat

5-Why 스트리밍 응답 (모듈 D)

### Request
```typescript
{
  sessionId: string;
  messages: Message[];      // 지금까지의 대화
  turnCount: number;        // 현재 턴 (1~5)
  context: {                // 모듈 A/B/C 결과 (있으면)
    scan?: ScanResult;
    values?: ValuesResult;
    strength?: StrengthResult;
  };
}
```

### Response
- `Content-Type: text/event-stream` (SSE 스트리밍)
- Claude API 스트리밍 → 클라이언트에 chunk 전달

```typescript
// 스트리밍 데이터
data: {"type":"text","text":"그"}
data: {"type":"text","text":"렇"}
data: {"type":"text","text":"군요"}
data: {"type":"done","shouldEnd":false}
// shouldEnd: true면 AI가 근본 원인 도달했다고 판단 → 클라이언트가 요약 요청
```

### AI 엔진 선택 로직
```typescript
try {
  // 1차: Claude 3.5 Sonnet (품질 우선)
  response = await callClaude(prompt);
} catch (error) {
  // 2차: Gemini Flash (폴백)
  response = await callGemini(prompt);
}
```

---

## POST /api/analyze

모든 모듈 데이터를 종합하여 AI 분석 → 대시보드 데이터 생성

### Request
```typescript
{
  sessionId: string;
  name: string;
  modules: {
    scan?: ScanResult;
    values?: ValuesResult;
    strength?: StrengthResult;
    debug?: {
      conversation: Message[];
      summary: DebugSummary;
    };
  };
  mode: 'full' | 'scan-only' | 'debug-only';
}
```

### Response
```typescript
{
  analysis: {
    archetype: {
      name: string;        // "잠든 전략가"
      nameEn: string;      // "The Dormant Strategist"
      emoji: string;       // "🔥"
      description: string; // 3~4줄 설명
    };

    careerPosition: {
      actionScore: number;     // 0~100 (X축: 실행력)
      clarityScore: number;    // 0~100 (Y축: 방향성)
      targetAction: number;    // 목표 X
      targetClarity: number;   // 목표 Y
    };

    valuesDNA: {
      meaning: number;    // 0~100
      growth: number;
      autonomy: number;
      stability: number;
      recognition: number;
      money: number;
    };

    strengths: {
      top3: string[];           // ["결단력", "학습력", "실행력"]
      archetype: string;        // "전략적 실행가"
      description: string;      // 1~2줄 강점 설명
    };

    navigation: {
      currentState: string;     // "현재 직장 유지"
      milestones: [
        { period: '3개월', goal: string, action: string },
        { period: '6개월', goal: string, action: string },
        { period: '1년', goal: string, action: string },
      ];
    };

    weeklyAction: {
      title: string;    // "이번 주 첫 번째 액션"
      description: string;
    };

    bugReport?: {       // 5-Why 완료 시만
      surfaceBug: string;
      rootCause: string;
      severity: 'critical' | 'major' | 'minor';
      patch: string;
    };

    insight: string;    // AI 종합 인사이트 (2~3줄)

    seminarRecommendation: {
      message: string;
      matchedWorkshop: string;
    };
  };
  slug: string;
}
```

### 내부 로직
1. 모든 모듈 데이터를 하나의 프롬프트에 담아 Claude에 전달
2. 구조화된 JSON 응답 요청 (프롬프트 → [ai-prompts.md](./ai-prompts.md))
3. 응답 파싱 + 검증
4. Supabase에 저장
5. 클라이언트에 반환

---

## POST /api/unlock

세미나 코드 입력 → 잠금 해제

### Request
```typescript
{
  slug: string;
  code: string;     // "ALGO-2026-MARCH"
}
```

### Response
```typescript
// 성공
{ success: true, unlockedAt: string }

// 실패
{ success: false, error: "코드가 올바르지 않습니다" }
```

### 로직
```typescript
// 1. booth 테이블에서 unlock_code 조회
// 2. 입력 코드와 비교
// 3. 일치하면 session.unlocked = true 업데이트
```

---

## GET /api/og/[slug]

OG 이미지 동적 생성 (SNS 공유 시 미리보기)

### Response
- `Content-Type: image/png`
- 1200x630px

### 내용
```
┌─────────────────────────────────────┐
│                                     │
│   Algrowithm Career Navigator       │
│                                     │
│   🔥 잠든 전략가                     │
│   The Dormant Strategist            │
│                                     │
│   홍길동님의 커리어 내비게이션         │
│                                     │
│   algrowithm.org/홍길동-20260308     │
│                                     │
└─────────────────────────────────────┘
```

### 구현
```typescript
// next/og (ImageResponse) 사용
import { ImageResponse } from 'next/og';

export async function GET(req, { params }) {
  const session = await getSession(params.slug);
  return new ImageResponse(/* JSX */);
}
```
