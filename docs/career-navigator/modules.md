# 3. 입력 모듈 상세 설계

> [← 사용자 플로우](./user-flow.md) | [대시보드 →](./dashboard.md)

---

## 모듈 개요

| 모듈 | 이름 | 수집 데이터 | 소요 시간 | 입력 방식 |
|------|------|------------|----------|-----------|
| A | 커리어 스캔 | 현재 위치 + 감정 | 90초 | 카드 선택 6개 |
| B | 가치관 프리즘 | 가치관 우선순위 | 60초 | 트레이드오프 5개 |
| C | 강점 디코더 | 핵심 강점 | 60초 | 시나리오 선택 5개 |
| D | 5-Why 디버거 | 장애물 근본 원인 | 120초 | AI 대화 3~5턴 |

---

## 모듈 A: 커리어 스캔 (6문항)

**목적:** 현재 커리어 상태를 다각도로 파악 (감정, 위치, 패턴, 방향)

### 문항 설계

```typescript
// lib/constants.ts — scanQuestions

const scanQuestions: ScanQuestion[] = [
  {
    id: 'emotion',
    question: '요즘 커리어에 대한 기분은?',
    options: [
      { id: 'frustrated', emoji: '😤', label: '답답해', value: { stress: 80, satisfaction: 20 } },
      { id: 'numb', emoji: '😶', label: '무덤덤해', value: { stress: 40, satisfaction: 40 } },
      { id: 'anxious', emoji: '😰', label: '불안해', value: { stress: 70, satisfaction: 30 } },
      { id: 'curious', emoji: '🤔', label: '뭔가 바꾸고 싶어', value: { stress: 50, satisfaction: 50 } },
      { id: 'stable', emoji: '😊', label: '괜찮은 편이야', value: { stress: 20, satisfaction: 70 } },
    ]
  },
  {
    id: 'stage',
    question: '지금 커리어 단계는?',
    options: [
      { id: 'early', label: '시작하는 중 (0~2년)', value: { experience: 'early' } },
      { id: 'growing', label: '성장하는 중 (3~5년)', value: { experience: 'growing' } },
      { id: 'plateau', label: '정체된 느낌 (5년+)', value: { experience: 'plateau' } },
      { id: 'transition', label: '전환 고민 중', value: { experience: 'transition' } },
    ]
  },
  {
    id: 'biggest_issue',
    question: '지금 가장 큰 건?',
    options: [
      { id: 'direction', emoji: '🧭', label: '방향을 모르겠어' },
      { id: 'motivation', emoji: '⚡', label: '의욕이 안 나' },
      { id: 'identity', emoji: '🎭', label: '진짜 내가 아닌 것 같아' },
      { id: 'growth', emoji: '📈', label: '성장이 멈춘 느낌' },
      { id: 'balance', emoji: '⚖️', label: '일과 삶의 균형' },
    ]
  },
  {
    id: 'work_pattern',
    question: '나와 가장 비슷한 사람은?',
    options: [
      { id: 'planner', label: '계획은 완벽한데 실행이...', value: { pattern: 'planner' } },
      { id: 'ideator', label: '아이디어는 많은데 시작이...', value: { pattern: 'ideator' } },
      { id: 'doer', label: '열심히 하는데 방향이...', value: { pattern: 'doer' } },
      { id: 'explorer', label: '이것저것 해보는데 깊이가...', value: { pattern: 'explorer' } },
    ]
  },
  {
    id: 'future_vision',
    question: '5년 후, 어디에 있고 싶어?',
    options: [
      { id: 'expert', emoji: '🏢', label: '업계 전문가' },
      { id: 'founder', emoji: '🚀', label: '내 사업/브랜드' },
      { id: 'passion', emoji: '🎨', label: '좋아하는 일' },
      { id: 'freedom', emoji: '🌊', label: '자유로운 삶' },
      { id: 'unknown', emoji: '❓', label: '아직 모르겠어' },
    ]
  },
  {
    id: 'desired_message',
    question: '지금 가장 듣고 싶은 말은?',
    options: [
      { id: 'affirm', label: '"넌 잘하고 있어"', value: { need: 'validation' } },
      { id: 'direct', label: '"이쪽으로 가봐"', value: { need: 'direction' } },
      { id: 'reveal', label: '"이게 진짜 너야"', value: { need: 'identity' } },
      { id: 'push', label: '"지금 당장 시작해"', value: { need: 'action' } },
    ]
  },
];
```

### 수집 데이터 → AI 전달 형식

```typescript
interface ScanResult {
  emotion: string;       // 'frustrated' | 'numb' | 'anxious' | ...
  stage: string;         // 'early' | 'growing' | 'plateau' | 'transition'
  biggestIssue: string;  // 'direction' | 'motivation' | 'identity' | ...
  workPattern: string;   // 'planner' | 'ideator' | 'doer' | 'explorer'
  futureVision: string;  // 'expert' | 'founder' | 'passion' | ...
  desiredMessage: string;// 'affirm' | 'direct' | 'reveal' | 'push'
}
```

---

## 모듈 B: 가치관 프리즘 (5문항)

**목적:** 트레이드오프를 통해 진짜 가치관 우선순위 도출

### 문항 설계

```typescript
const valueQuestions: TradeoffQuestion[] = [
  {
    id: 'money_vs_meaning',
    optionA: { label: '연봉 1억', sub: '흥미 없는 일', value: 'money' },
    optionB: { label: '하고 싶은 일', sub: '연봉은 반으로', value: 'meaning' },
  },
  {
    id: 'stability_vs_growth',
    optionA: { label: '안정적인 대기업', sub: '성장은 느림', value: 'stability' },
    optionB: { label: '성장하는 환경', sub: '불안정할 수 있음', value: 'growth' },
  },
  {
    id: 'recognition_vs_autonomy',
    optionA: { label: '팀에서 인정받기', sub: '자율성은 적음', value: 'recognition' },
    optionB: { label: '혼자서 만족하기', sub: '인정은 적음', value: 'autonomy' },
  },
  {
    id: 'now_vs_future',
    optionA: { label: '지금 당장 편한 선택', sub: '미래는 불확실', value: 'present' },
    optionB: { label: '3년 후를 위한 선택', sub: '지금은 힘듦', value: 'future' },
  },
  {
    id: 'depth_vs_breadth',
    optionA: { label: '한 분야 깊게 파기', sub: '다른 건 모름', value: 'depth' },
    optionB: { label: '여러 분야 경험하기', sub: '전문성은 약함', value: 'breadth' },
  },
];
```

### 수집 데이터 → 가치관 DNA

```typescript
interface ValuesResult {
  selections: string[];  // ['meaning', 'growth', 'autonomy', 'future', 'depth']
  profile: {
    money: number;       // 0~100 (선택 빈도 기반)
    meaning: number;
    stability: number;
    growth: number;
    recognition: number;
    autonomy: number;
    riskTolerance: number;  // 도전적 선택 비율
    timeOrientation: number; // 미래지향 비율
  }
}
```

---

## 모듈 C: 강점 디코더 (5문항)

**목적:** 상황 시나리오 기반으로 숨겨진 강점 패턴 발견

### 문항 설계

```typescript
const strengthQuestions: ScenarioQuestion[] = [
  {
    id: 'crisis',
    scenario: '팀 프로젝트 마감 3일 전, 방향이 안 잡혔다.',
    options: [
      { label: '방향을 정해서 팀을 이끈다', strengths: ['leadership', 'decisiveness'] },
      { label: '지금까지 나온 걸 정리한다', strengths: ['analysis', 'organization'] },
      { label: '팀원 의견을 모아 합의한다', strengths: ['communication', 'collaboration'] },
    ]
  },
  {
    id: 'new_field',
    scenario: '완전히 새로운 분야에 도전해야 할 때.',
    options: [
      { label: '관련 자료를 찾아서 공부한다', strengths: ['learning', 'analysis'] },
      { label: '그 분야 사람을 만나 물어본다', strengths: ['networking', 'communication'] },
      { label: '일단 뭐라도 만들어본다', strengths: ['execution', 'courage'] },
    ]
  },
  {
    id: 'conflict',
    scenario: '동료와 의견이 완전히 다를 때.',
    options: [
      { label: '데이터로 설득한다', strengths: ['logic', 'persuasion'] },
      { label: '상대 의견을 먼저 충분히 듣는다', strengths: ['empathy', 'patience'] },
      { label: '제3의 대안을 제시한다', strengths: ['creativity', 'problemSolving'] },
    ]
  },
  {
    id: 'monotony',
    scenario: '같은 일이 반복되어 지루할 때.',
    options: [
      { label: '프로세스를 개선할 방법을 찾는다', strengths: ['optimization', 'analysis'] },
      { label: '새로운 프로젝트를 제안한다', strengths: ['initiative', 'creativity'] },
      { label: '다른 팀/분야 일을 배워본다', strengths: ['curiosity', 'adaptability'] },
    ]
  },
  {
    id: 'failure',
    scenario: '중요한 프로젝트가 실패했을 때.',
    options: [
      { label: '원인을 분석하고 교훈을 정리한다', strengths: ['resilience', 'analysis'] },
      { label: '바로 다음 도전을 시작한다', strengths: ['courage', 'execution'] },
      { label: '주변 사람들에게 피드백을 구한다', strengths: ['openness', 'collaboration'] },
    ]
  },
];
```

### 수집 데이터 → 강점 프로필

```typescript
interface StrengthResult {
  selections: string[];  // 선택한 옵션 ID 배열
  strengthScores: Record<string, number>;  // 각 강점별 점수
  topStrengths: string[];  // 상위 3개 강점
  strengthArchetype: string; // '전략가' | '실행가' | '연결가' | '분석가' | '창조가'
}
```

---

## 모듈 D: 5-Why 디버거

**목적:** A/B/C 결과를 기반으로 장애물의 근본 원인 추적

### 기존 life-debugger와의 차이점

| 항목 | life-debugger (기존) | Career Navigator (신규) |
|------|---------------------|------------------------|
| AI 엔진 | Gemini Flash | Claude 3.5 Sonnet |
| 시작 질문 | "어떤 고민이 있으세요?" | A/B/C 결과 기반 맞춤 질문 |
| 턴 수 | 고정 5턴 | 3~5턴 (AI 판단) |
| 결과 형식 | surfaceProblem/rootCause/insight | 종합 분석에 통합 |
| 컨텍스트 | 없음 | A/B/C 전체 데이터 |

### 컨텍스트 기반 시작 질문 예시

```
A 결과: emotion=frustrated, stage=plateau, issue=direction
B 결과: meaning > money, growth > stability
C 결과: topStrengths=[execution, decisiveness]

→ AI 시작 질문:
"홍길동님은 실행력과 결단력이 강점인데, 5년 넘게 일하면서
 방향이 안 잡히는 느낌이 드시는 거죠. 의미 있는 일을 하고
 싶은 마음이 큰데, 언제부터 이런 답답함이 시작됐나요?"
```

### 턴 수 조절 로직

```typescript
// AI가 3번째 답변 후 판단:
// - 근본 원인이 명확하면 → 3턴에서 종료
// - 아직 표면적이면 → 4~5턴까지 계속
// 프롬프트에서 제어 (ai-prompts.md 참조)
```

---

## 모듈 조합 시나리오

| 시나리오 | 모듈 조합 | 소요 시간 | 결과 품질 |
|---------|----------|----------|----------|
| 서서 퀵 | A만 | 90초 | ★★☆☆☆ 미니 리포트 |
| 부스 기본 | A + B + C | 3.5분 | ★★★★☆ 풀 리포트 |
| 부스 풀코스 | A + B + C + D | 5.5분 | ★★★★★ 완전체 |
| 상담사 직행 | D만 | 2분 | ★★★☆☆ 5-Why 리포트만 |

각 조합에 따라 대시보드에 표시되는 섹션이 달라짐 → [dashboard.md](./dashboard.md) 참조
