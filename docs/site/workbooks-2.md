# 워크북 3~4회차 상세

> 워크북 1~2회차는 [workbooks.md](workbooks.md) 참조

---

## 워크북 3: "커리어 브랜딩" (workbook_3.html, 538줄)

### 테마 색상

- warm-orange `#e67e22`, deep-orange `#d35400`, light-orange `#f39c12`

### 반 접기 구조: 접는 선 (`fold-line`) 가운데 표시

```css
.fold-line {
    position: absolute; left: 50%; top: 0; bottom: 0;
    border-left: 2px dashed #e5e7eb; z-index: 10;
}
```

### 페이지 1 (좌: STEP5 | 우: 표지)

#### 좌측: STEP 5 — 삶의 목적 정리

- 헤더: "3회차 워크지" 뱃지 + "Final Step"
- 타이틀: "My Purpose — 나의 삶의 목적 정리"
- 설명 박스: 5번 원형 + "삶의 목적을 한 줄로 정리하고, 목표를 쓰세요"
- **왕관 아이콘** (`fa-crown`, yellow-400, text-3xl)
- **사람 아이콘** (원형 보더 `w-20 h-20 border-2` 안에 `fa-person-rays`)
- 삶의 목적 입력: `rounded-full border-2 border-rich-black px-4 py-2.5 text-center`
- **목표 3개 박스**: 각각 `border-2 border-warm-orange/40 rounded-xl p-3`
  - "목표 1", "목표 2", "목표 3" 라벨 + textarea
- **화살표 SVG**: 좌/우측에 곡선 화살표 (아래→위 방향)
  - SVG path + polygon 조합, stroke `#d1d5db`

#### 우측: 표지

- 배경: `linear-gradient(135deg, #fefefe 0%, #f8f8f8 50%, rgba(212,175,55,0.05) 100%)`
- 다이아몬드 SVG 배경 패턴 (opacity 30%)
- `sparkling_diamond-removebg-preview.png` (w-40 h-40)
- "Personal Career DNA Discovery" 라벨 (warm-orange, tracking-[0.25em])
- "나만의 커리어 브랜딩 워크북" (text-3xl 세리프)
- 구분선: `w-20 h-0.5 bg-warm-orange mx-auto`
- 명언: "가장 개인적인 것이 가장 창의적인 것이다." — 마틴 스코세이지
- 개인 정보: Name, Birth, Phone (warm-orange/40 보더)
- 하단 로고: "Algrowithm" (text-xl 세리프, warm-orange)

### 페이지 2 (좌: STEP1 | 우: STEP2+3+4)

#### 좌측: STEP 1 — 가치 키워드 테이블

- **10열 x 11행 테이블** (총 110개 가치 키워드)
- 키워드 목록 (일부): 배움, 용기, 변화, 관계, 가족, 공존, 양보, 지식, 인정, 몰입, 대담, 소박, 과정, 나눔, 결과, 능력, 정의, 예의, 창의, 건강, 명예, 경험, 평등, 기쁨, 우정, 자유, 성장, 도전, 완벽, 창조, 책임, 겸손, 안정, 평화, 재미, 성취, 존중, 독립, 모험, 공정, 감사, 사랑, 지혜, 꿈, 위대함...
- 각 셀: `p-1.5 border-r border-gray-100 text-center hover:bg-soft-gold/10 cursor-pointer`
- 테이블: `table-fixed`, `text-[11px]`
- 설명: "모두 체크 → 10개 → 5개 → 3개로 줄여가며 체크"

#### 우측: STEP 2+3+4 (각 1/3 높이)

- **STEP 2**: "내가 살아있음을 느끼게 해주었던 경험 3가지"
  - 예시: "시험을 잘봐서 칭찬받았을 때 / 쓰러진 사람을 도와줬을 때"
  - textarea 3개 (placeholder: 1., 2., 3.)

- **STEP 3**: "내가 동경하는 사람(셀럽)은? 그 이유는?"
  - 예시: "마틴 루터 킹 - 용기, 헌신과 이타적인 마음"
  - textarea 1개

- **STEP 4**: "인생을 마감했을 때, 주변 사람들이 나에게 편지를 남긴다면?"
  - 예시: "아름답고 용감했던 홍길동, ~"
  - textarea 1개

- 하단 안내: "뒷면의 STEP 5로 이어집니다"

---

## 워크북 4: "내가 원하는 삶" (workbook_4.html, 488줄)

### 테마 색상

- deep-navy `#1e3a5f`, navy-blue `#2c5282`, soft-gold `#d4af37`, warm-cream `#faf8f5`

### 커스텀 CSS 클래스

```css
.question-card {
    background: linear-gradient(135deg, rgba(212,175,55,0.03) 0%, rgba(255,255,255,0.8) 100%);
    border: 1px solid rgba(212,175,55,0.2); border-radius: 12px; padding: 12px;
}
.question-title { font-size: 13px; font-weight: 700; color: #0a0a0a; }
.question-input {
    width: 100%; background: transparent; border: none;
    border-bottom: 1px solid rgba(212,175,55,0.3); font-size: 11px;
}
.section-number {
    width: 24px; height: 24px; border-radius: 50%;
    background: linear-gradient(135deg, #d4af37 0%, #f5d17a 100%);
    color: white; font-weight: 700; font-size: 11px;
}
.decorative-line {
    height: 2px; background: linear-gradient(90deg, #d4af37, transparent);
}
```

### 페이지 1 (좌: 섹션3 | 우: 표지)

#### 좌측: 섹션 3 — 가치관, 기여 탐색

- 헤더: "4회차 워크지" 뱃지 (bg-deep-navy) + "Section 3"
- 질문 4개 (question-card, `flex-1`로 균등 배분):
  1. **트로피** (`fa-trophy`): "가장 뿌듯했던 순간은 언제인가요?"
  2. **선물** (`fa-gift`): "타인이 나를 통해 '무엇'을 얻길 원하나요?"
  3. **하트** (`fa-heart`): "돈을 받지 않아도 계속 할 수 있는 일은?"
  4. **지구** (`fa-globe`): "내가 만들고 싶은 문화, 해결하고 싶은 사회문제는?"
- 하단 인사이트: `border-l-4 border-deep-navy` + 전구 아이콘

#### 우측: 표지

- 배경: `linear-gradient(135deg, #fefefe 0%, #f8f8f8 50%, rgba(30,58,95,0.08) 100%)`
- 도트 SVG 배경 패턴 (deep-navy 10% opacity)
- 나침반 아이콘: `w-32 h-32 rounded-full bg-gradient-to-br from-deep-navy/20 to-deep-navy/5`
  - `fa-compass text-5xl text-deep-navy`
- "Self Discovery Journey" 라벨 (deep-navy, tracking-[0.2em])
- "내가 원하는 삶을 찾는 여정 워크북" (text-2xl 세리프)
- 구분선: `w-16 h-0.5 bg-deep-navy mx-auto`
- 명언: "진정한 발견의 여정은 새로운 풍경을 찾는 것이 아니라 새로운 눈을 갖는 것이다." — 마르셀 프루스트
- Name, Birth, Phone 입력 (deep-navy/40 보더)
- 하단 로고: "Algrowithm" (text-lg 세리프, deep-navy)

### 페이지 2 (좌: 섹션1 | 우: 섹션2)

#### 좌측: 섹션 1 — 자아정체성 탐색

- 헤더: "4회차 워크지" 뱃지 (bg-rich-black) + "Section 1"
- 질문 4개 (question-card, soft-gold 아이콘):
  1. **별** (`fa-star`): "어린시절 많이 받은 칭찬은 무엇인가요?"
  2. **사람들** (`fa-users`): "타인이 말하는 나는 어떤 사람인가요?"
  3. **스파** (`fa-spa`): "내가 가장 편안함을 느끼는 순간은?"
  4. **태그** (`fa-tag`): "사람들이 나에게 자주 붙여주는 수식어는? 그게 마음에 드나요?"
- 인사이트: `border-l-4 border-soft-gold` + "나를 아는 것이 모든 지혜의 시작입니다."

#### 우측: 섹션 2 — 욕구 & 방향성 탐색

- 헤더: "4회차 워크지" 뱃지 (bg-soft-gold) + "Section 2"
- 질문 5개 (question-card, soft-gold 아이콘):
  1. **아이** (`fa-child`): "어린시절 내 꿈은 무엇이었나요?"
  2. **불꽃** (`fa-fire`): "삶에서 가장 충족시키고 싶은 욕구는?" (안정/성장/인정/자유/영향력/창조성)
  3. **달력** (`fa-calendar-alt`): "5년 뒤 나는 어떤 삶을 살기를 바라나요?"
  4. **망원경** (`fa-binoculars`): "10년 뒤 나는 어떤 삶을 살기를 바라나요?"
  5. **물음표** (`fa-question-circle`): "이것은 진짜 내 목표인가요, 타인이 기대하는 목표인가요?"
- 인사이트: `border-r-4 border-soft-gold` + "진정한 목표는 내 안에서 우러나온 것이어야 합니다."
