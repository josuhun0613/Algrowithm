# About 페이지 + Schedule 페이지

---

## About 페이지 (`about.html`, 약 1,158줄)

### Tailwind 커스텀 색상

```javascript
'soft-gold': '#d4af37',
'deep-navy': '#001F3F',
'rich-black': '#0a0a0a',
'text-dark': '#1a1a1a',
```

### CDN 추가

- Swiper.js 11 (사진 캐러셀)
- GSAP + ScrollTrigger (스크롤 애니메이션)

### 페이지 구조

#### 1. 헤더

```html
<div id="header-placeholder"></div>
<script src="./js/header.js"></script>
<script>initHeader({ showStartButton: false });</script>
```

#### 2. 히어로 섹션

- 상단 라벨: `tracking-widest uppercase` 스타일 영문 텍스트
- 메인 타이틀: 세리프 폰트, 글로우 텍스트 애니메이션 (shimmer effect)
- 서브 카피: 회사 소개 문구

#### 3. 대표 소개 (조수훈 - ESTJ AI Architect)

- **프로필 이미지**: floating 애니메이션 (위아래 부드러운 움직임)
- **경력/철학**: 텍스트 블록
- **사진 캐러셀**: Swiper.js — 12장 이상 강연/모임 사진
  - Navigation arrows 포함
  - `slidesPerView: 1` → `md: 2` → `lg: 3`
  - 클릭 시 이미지 팝업 모달 (확대)

#### 4. 강사 소개 (최슬지)

- 유사한 프로필 레이아웃
- 교육 경력/배경 소개

#### 5. 후기/추천사 섹션

- **다크 네온 카드 디자인**:
  ```css
  background: rgba(15, 15, 15, 0.95);
  border: 1px solid rgba(0, 255, 255, 0.3);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
  ```
- 글래스모피즘 스타일
- 사진 + 작성자 정보 + 추천 내용

#### 6. 푸터

- 다크 배경, 로고 + 카피라이트

### 특수 스타일 효과

```css
/* 글로우 텍스트 (시머 효과) */
.glow-text {
    background: linear-gradient(90deg, #d4af37, #fff, #d4af37);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s infinite linear;
}
@keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
}

/* 플로팅 애니메이션 */
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

/* 이미지 팝업 모달 */
.image-popup { /* 클릭한 이미지를 풀스크린으로 표시 */ }
```

### GSAP 초기화

```javascript
gsap.registerPlugin(ScrollTrigger);
// 각 섹션 fade-in + slide-up 애니메이션
gsap.from('.section', {
    scrollTrigger: { trigger: '.section', start: 'top 80%' },
    opacity: 0, y: 50, duration: 0.8
});
```

---

## Schedule 페이지 (`schedule.html`, 698줄)

### Tailwind 커스텀 색상

```javascript
'pure-white': '#ffffff',
'soft-gray': '#f8f9fa',
'text-dark': '#1a1a1a',
'soft-gold': '#d4af37',
```

### 레이아웃 구조

```
┌──────────────────────────────┬──────────┐
│                              │  사이드바  │
│        캘린더 영역             │  (450px)  │
│     (main-content)           │  다가오는  │
│     margin-right: 450px      │  일정 목록  │
│                              │          │
└──────────────────────────────┴──────────┘

@media (max-width: 1024px) → 사이드바가 캘린더 아래로 이동
```

### 사이드바 (`aside.event-sidebar`)

- **위치**: `position: fixed; top: 0; right: 0; width: 450px; height: 100vh;`
- **헤더**: "다가오는 일정" + 일정 추가 버튼 (gold 동그라미)
- **스크롤**: 커스텀 스크롤바 (gold 색상)
- **이벤트 카드**: 좌측 4px 컬러 보더 (gold=워크샵, blue=온라인)

#### 이벤트 카드 구조

```html
<div class="event-item bg-gray-50 rounded-xl p-5">
    <div>날짜 뱃지 + 요일</div>
    <h4>이벤트 제목</h4>
    <p>부제목 (soft-gold)</p>
    <p>설명</p>
    <div>시간 + 장소(오프라인/온라인)</div>
</div>
```

### 캘린더 영역

- **헤더**: 이전/다음 월 버튼 + "Month Year" (세리프 폰트)
- **요일 헤더**: SUN~SAT (gold 색상)
- **그리드**: `grid-template-columns: repeat(7, 1fr); gap: 0.5rem;`
- **셀 스타일**:
  - 기본: `min-height: 70px; border: 1px solid #f0f0f0; border-radius: 10px;`
  - 오늘: `background: #fffdf5; border-color: #d4af37;`
  - 타월: `opacity: 0.4;`
  - 호버: `border-color: #d4af37; box-shadow`
- **이벤트 칩**: 셀 내부, 라운드 배지 (gold=워크샵, blue=온라인)

### 캘린더 JavaScript

```javascript
const events = {
    '2025-12-15': [{ title: '1회차 워크샵', type: 'workshop' }],
    '2025-12-18': [{ title: 'Q&A 세션', type: 'online' }],
    // ...
};

function renderCalendar() {
    // 1. 이전 달 빈 셀
    // 2. 현재 달 날짜 + 이벤트 칩
    // 3. 다음 달 빈 셀
}

function prevMonth() { currentMonth--; renderCalendar(); }
function nextMonth() { currentMonth++; renderCalendar(); }
```

### 일정 추가 모달 (`#addModal`)

- **필드**: 제목, 부제목(선택), 날짜(date), 유형(select: 워크샵/온라인), 시작/종료 시간(time), 설명(textarea)
- **제출**: 사이드바에 이벤트 카드 추가 + 캘린더 events 객체에 추가 + `renderCalendar()`
- **취소/닫기**: 오버레이 클릭 또는 취소 버튼

### 범례

```html
<div class="flex justify-center gap-8">
    <div>■ 워크샵 (soft-gold)</div>
    <div>■ 온라인 세션 (#4a90d9)</div>
</div>
```

### 푸터

- `main-content bg-text-dark` 푸터 — 로고(invert) + 카피라이트, `margin-right: 450px`로 사이드바 영역 제외
