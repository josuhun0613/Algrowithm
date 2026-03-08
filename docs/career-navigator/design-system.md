# 5. 디자인 시스템 (토스 베이스)

> [← 대시보드](./dashboard.md) | [API 명세 →](./api-spec.md)

---

## 디자인 원칙 (토스에서 가져온 것)

1. **한 화면에 하나** — 질문 1개, 정보 1덩어리
2. **거대한 여백** — 콘텐츠보다 빈 공간이 더 많아야 함
3. **절제된 색상** — 거의 흑백 + 포인트 블루 하나
4. **큰 타이포** — 모바일에서 헤드라인 28px+
5. **부드러운 전환** — 페이지 전환 아닌 콘텐츠 흐름

---

## 색상 팔레트

```typescript
// tailwind.config.ts
colors: {
  // 그레이 스케일 (토스 공식)
  gray: {
    50:  '#f9fafb',  // 페이지 배경
    100: '#f2f4f6',  // 카드 배경 (비활성)
    200: '#e5e8eb',  // 보더, 구분선
    300: '#d1d6db',  // 비활성 요소
    400: '#b0b8c1',  // 플레이스홀더
    500: '#8b95a1',  // 캡션
    600: '#6b7684',  // 서브 텍스트
    700: '#4e5968',  // 본문
    800: '#333d4b',  // 강조 본문
    900: '#191f28',  // 헤드라인
  },

  // 브랜드 (최소한으로 사용)
  blue: {
    50:  '#e8f3ff',
    100: '#c9e2ff',
    200: '#90c2ff',
    300: '#64a8ff',
    400: '#4593fc',
    500: '#3182f6',  // PRIMARY — CTA, 프로그레스, 링크
    600: '#2272eb',
    700: '#1b64da',
    800: '#1957c2',
    900: '#194aa6',
  },

  // 시맨틱 (대시보드에서 사용)
  semantic: {
    success: '#34c759',  // 강점, 완료
    warning: '#ff9500',  // 주의, 중간
    error:   '#ff3b30',  // 버그, 문제
    info:    '#5856d6',  // 인사이트
  },

  // Algrowithm 브랜드 (잠금 섹션, 프리미엄)
  gold: {
    400: '#e5c16e',
    500: '#d4af37',  // 프리미엄/잠금
    600: '#b8941f',
  },
}
```

### 색상 사용 규칙

| 용도 | 색상 | 비고 |
|------|------|------|
| 배경 | gray-50 (#f9fafb) | 메인 배경 |
| 카드 | white (#ffffff) | 카드 배경 |
| 텍스트 (헤드라인) | gray-900 | 가장 진한 |
| 텍스트 (본문) | gray-700 | 기본 |
| 텍스트 (서브) | gray-500 | 보조 |
| CTA 버튼 | blue-500 | 유일한 컬러 포인트 |
| 프로그레스 바 | blue-500 | |
| 선택된 카드 보더 | blue-500 | |
| 잠금 섹션 | gold-500 | 프리미엄 느낌 |
| 차트 포지티브 | semantic-success | 강점 |
| 차트 네거티브 | semantic-error | 약점/버그 |

---

## 타이포그래피

```typescript
// tailwind.config.ts
fontSize: {
  // 모바일 기준 (데스크탑은 1.2배)
  'display':   ['32px', { lineHeight: '1.3', fontWeight: '700', letterSpacing: '-0.02em' }],
  'heading-1': ['26px', { lineHeight: '1.35', fontWeight: '700', letterSpacing: '-0.02em' }],
  'heading-2': ['22px', { lineHeight: '1.4', fontWeight: '700' }],
  'title':     ['18px', { lineHeight: '1.5', fontWeight: '600' }],
  'body':      ['16px', { lineHeight: '1.6', fontWeight: '400' }],
  'body-bold': ['16px', { lineHeight: '1.6', fontWeight: '600' }],
  'caption':   ['14px', { lineHeight: '1.5', fontWeight: '400' }],
  'small':     ['12px', { lineHeight: '1.4', fontWeight: '400' }],
},

fontFamily: {
  sans: [
    'Pretendard',
    '-apple-system',
    'BlinkMacSystemFont',
    'system-ui',
    'Roboto',
    'sans-serif',
  ],
},
```

### 텍스트 스타일 가이드

- **질문 텍스트:** heading-1, gray-900, `word-break: keep-all`
- **선택지 텍스트:** title, gray-800
- **설명/서브:** body, gray-600
- **캡션/단계:** caption, gray-500
- **CTA 버튼:** body-bold, white (on blue-500)

---

## 컴포넌트 스펙

### 버튼

```
Primary (CTA):
  bg: blue-500
  text: white
  rounded: 16px
  padding: 16px 24px
  font: body-bold
  hover: blue-600
  active: blue-700 + scale(0.98)
  transition: 150ms ease

Secondary:
  bg: gray-100
  text: gray-700
  border: 1px solid gray-200

Ghost:
  bg: transparent
  text: blue-500
```

### 카드 (선택형)

```
Default:
  bg: white
  border: 1px solid gray-200
  rounded: 16px
  padding: 20px 24px
  shadow: none

Selected:
  border: 2px solid blue-500
  bg: blue-50

Hover (desktop):
  border: 1px solid gray-300
  bg: gray-50
```

### 프로그레스 바

```
Track:
  bg: gray-200
  height: 4px
  rounded: 2px

Fill:
  bg: blue-500
  transition: width 300ms ease
```

### 페이지 전환 (Framer Motion)

```typescript
// components/ui/PageTransition.tsx
const pageVariants = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
};
```

---

## 반응형 브레이크포인트

```typescript
screens: {
  'sm': '640px',   // 모바일 → 태블릿
  'md': '768px',   // 태블릿
  'lg': '1024px',  // 노트북
  'xl': '1280px',  // 데스크탑/부스 모니터
}
```

### 레이아웃 전략

| 화면 | 레이아웃 | 용도 |
|------|---------|------|
| 모바일 (~640px) | 1컬럼, 풀폭 | QR 스캔 사용자 |
| 태블릿 (768px) | 1컬럼, 중앙 max-w-md | 부스 태블릿 |
| 노트북 (1024px+) | 2컬럼 그리드 | 상담사 모니터 |
| 부스 모니터 (1280px+) | 2컬럼, 여백 확대 | 구경꾼용 |

### 대시보드 그리드

```
모바일: 1컬럼 세로 스크롤
┌─────────────────┐
│ 아키타입 카드     │
├─────────────────┤
│ 커리어 좌표      │
├─────────────────┤
│ 가치관 DNA       │
├─────────────────┤
│ 강점 뱃지        │
├─────────────────┤
│ 내비 경로        │
├─────────────────┤
│ 이번 주 액션      │
├─────────────────┤
│ 🔒 잠금 섹션     │
└─────────────────┘

노트북: 2컬럼 그리드
┌──────────┬──────────┐
│ 아키타입  │ 커리어    │
│ 카드      │ 좌표     │
├──────────┼──────────┤
│ 가치관    │ 강점     │
│ DNA       │ 뱃지     │
├──────────┴──────────┤
│ 내비게이션 경로      │
├─────────────────────┤
│ 이번 주 액션 │ 🔒    │
└─────────────────────┘
```

---

## 특수 화면

### 로딩 (분석 중)

```
배경: white
중앙 정렬
프로그레스 바 (blue-500, 0→100%)
메시지 텍스트 (body, gray-600)
  → 3초마다 fade 전환
```

### 에러

```
중앙 정렬
이모지: 😅
텍스트: "잠시 문제가 생겼어요" (heading-2)
서브: "다시 시도해주세요" (body, gray-500)
버튼: [다시 시도] (Primary)
```
