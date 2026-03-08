# 7. 데이터베이스 스키마

> [← API 명세](./api-spec.md) | [AI 프롬프트 →](./ai-prompts.md)

---

## Supabase 선택 이유

- PostgreSQL 기반 → 복잡한 쿼리 가능
- Row Level Security (RLS) → API 키 노출 걱정 없음
- Realtime → Admin 대시보드 실시간 업데이트 (Phase 2)
- 무료 티어 → 10,000 rows, 500MB (MVP 충분)

---

## ERD

```
sessions (핵심 테이블)
├── id: UUID (PK)
├── slug: TEXT (UNIQUE) ← "홍길동-20260308"
├── name: TEXT
├── booth_id: TEXT (FK → booths.id, nullable)
├── mode: TEXT ← 'full' | 'scan-only' | 'debug-only'
├── scan_result: JSONB (nullable)
├── values_result: JSONB (nullable)
├── strength_result: JSONB (nullable)
├── debug_conversation: JSONB (nullable)
├── debug_summary: JSONB (nullable)
├── analysis_result: JSONB (nullable) ← AI 종합 분석 결과
├── unlocked: BOOLEAN (default false)
├── unlocked_at: TIMESTAMPTZ (nullable)
├── created_at: TIMESTAMPTZ (default now())
└── updated_at: TIMESTAMPTZ (default now())

booths (부스/이벤트 설정)
├── id: TEXT (PK) ← "2026-march-gangnam"
├── name: TEXT
├── unlock_code: TEXT ← "ALGO-2026-MARCH"
├── seminar_link: TEXT (nullable)
├── config: JSONB (nullable) ← 커스텀 설정
├── active: BOOLEAN (default true)
└── created_at: TIMESTAMPTZ (default now())
```

---

## SQL 마이그레이션

```sql
-- sessions 테이블
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  booth_id TEXT REFERENCES booths(id) ON DELETE SET NULL,
  mode TEXT NOT NULL DEFAULT 'full',

  -- 모듈 결과 (각 모듈 완료 시 업데이트)
  scan_result JSONB,
  values_result JSONB,
  strength_result JSONB,
  debug_conversation JSONB,
  debug_summary JSONB,

  -- AI 종합 분석 결과
  analysis_result JSONB,

  -- 잠금 해제
  unlocked BOOLEAN NOT NULL DEFAULT false,
  unlocked_at TIMESTAMPTZ,

  -- 타임스탬프
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- slug 인덱스 (조회 성능)
CREATE INDEX idx_sessions_slug ON sessions(slug);
-- 부스별 조회
CREATE INDEX idx_sessions_booth ON sessions(booth_id);
-- 날짜별 조회
CREATE INDEX idx_sessions_created ON sessions(created_at DESC);

-- booths 테이블
CREATE TABLE booths (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  unlock_code TEXT NOT NULL,
  seminar_link TEXT,
  config JSONB DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

---

## RLS (Row Level Security) 정책

```sql
-- sessions: 누구나 자기 slug로 읽기 가능 (공유 링크)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read by slug"
  ON sessions FOR SELECT
  USING (true);

-- sessions: 서버에서만 쓰기 (service_role_key 사용)
CREATE POLICY "Service role can insert"
  ON sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update"
  ON sessions FOR UPDATE
  USING (true);

-- booths: 읽기만 허용
ALTER TABLE booths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active booths"
  ON booths FOR SELECT
  USING (active = true);
```

---

## JSONB 구조 예시

### scan_result
```json
{
  "emotion": "frustrated",
  "stage": "plateau",
  "biggestIssue": "direction",
  "workPattern": "doer",
  "futureVision": "founder",
  "desiredMessage": "direct"
}
```

### values_result
```json
{
  "selections": ["meaning", "growth", "autonomy", "future", "depth"],
  "profile": {
    "money": 20, "meaning": 92, "stability": 30,
    "growth": 78, "recognition": 32, "autonomy": 65,
    "riskTolerance": 70, "timeOrientation": 80
  }
}
```

### strength_result
```json
{
  "selections": ["lead", "study", "alternative", "improve", "analyze"],
  "strengthScores": {
    "leadership": 2, "decisiveness": 1, "learning": 2,
    "analysis": 2, "creativity": 1, "resilience": 1
  },
  "topStrengths": ["학습력", "분석력", "리더십"],
  "strengthArchetype": "전략가"
}
```

### analysis_result
```json
{
  "archetype": {
    "name": "잠든 전략가",
    "nameEn": "The Dormant Strategist",
    "emoji": "🔥",
    "description": "실행력 엔진은 풀가동인데..."
  },
  "careerPosition": {
    "actionScore": 78, "clarityScore": 35,
    "targetAction": 85, "targetClarity": 80
  },
  "valuesDNA": {
    "meaning": 92, "growth": 78, "autonomy": 65,
    "stability": 30, "recognition": 32, "money": 20
  },
  "strengths": {
    "top3": ["결단력", "학습력", "실행력"],
    "archetype": "전략적 실행가",
    "description": "결정이 필요한 순간에 빛나는 사람"
  },
  "navigation": {
    "currentState": "현재 직장 유지",
    "milestones": [
      { "period": "3개월", "goal": "사이드 프로젝트 1개", "action": "주 5시간 투자" },
      { "period": "6개월", "goal": "콘텐츠 브랜딩", "action": "블로그 정기 발행" },
      { "period": "1년", "goal": "독립 준비", "action": "퇴사 자금 계산" }
    ]
  },
  "weeklyAction": {
    "title": "이번 주 첫 번째 액션",
    "description": "관심 분야 3개를 적고, 가장 설레는 1개에 30분 투자"
  },
  "bugReport": null,
  "insight": "당신은 실행력이 상위 20%인데...",
  "seminarRecommendation": {
    "message": "방향 설정에 특화된 워크숍을 추천드려요",
    "matchedWorkshop": "workbook_3"
  }
}
```

---

## 데이터 라이프사이클

```
1. POST /api/session
   → sessions INSERT (name, slug, mode만)

2. 모듈 A 완료
   → sessions UPDATE (scan_result)

3. 모듈 B 완료
   → sessions UPDATE (values_result)

4. 모듈 C 완료
   → sessions UPDATE (strength_result)

5. 모듈 D 완료 (선택)
   → sessions UPDATE (debug_conversation, debug_summary)

6. POST /api/analyze
   → Claude API 호출 → sessions UPDATE (analysis_result)

7. POST /api/unlock
   → sessions UPDATE (unlocked=true, unlocked_at)
```

### 데이터 보존
- MVP: 무기한 보존 (무료 티어 내)
- 프로덕션: 6개월 후 자동 아카이브 (개인정보 보호)
