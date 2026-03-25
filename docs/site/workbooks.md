# 워크북 1~2회차 상세

> 모든 워크북은 **A4 가로 (297mm x 210mm)** 인쇄에 최적화된 2페이지 접기 구조
> 워크북 3~4회차는 [workbooks-2.md](workbooks-2.md) 참조

---

## 공통 사항

### 기본 구성

- 공통 헤더: `no-print` 클래스 적용 → 인쇄 시 숨김
- Print 버튼: `fixed bottom-6 right-6` 고정, `no-print`
- 상단 여백: `<div class="h-20 no-print"></div>` (헤더 아래)

### 인쇄 CSS (모든 워크북 동일)

```css
@page { size: A4 landscape; margin: 0; }
body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.no-print { display: none !important; }
.print-container {
    width: 297mm; height: 210mm; padding: 8mm;
    overflow: hidden; page-break-inside: avoid;
}
.print-container:first-of-type { page-break-after: always; }
.print-container:last-of-type { page-break-after: avoid; }
```

### 화면 표시 CSS

```css
.print-container {
    width: 297mm; height: 210mm;
    margin: 2rem auto; background-color: white;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    padding: 8mm;
}
```

### 워크북 입력 요소 (인쇄용)

```css
.print-checkbox { width: 18px; height: 18px; border: 2px solid #333; border-radius: 50%; }
.print-radio    { width: 16px; height: 16px; border: 2px solid #333; border-radius: 50%; }
.write-line     { border-bottom: 1.5px solid #333; min-height: 24px; }
.write-box      { border: 1.5px solid #ddd; border-radius: 6px; min-height: 28px; }
```

---

## 워크북 1: "내 안의 빌런을 찾아라!" (workbook_1.html, 706줄)

### 테마 색상

- minion-yellow `#FFE135`, minion-blue `#4169E1`, villain-purple `#8B5CF6`

### 페이지 1 (좌: 섹션1 | 우: 표지) — `flex` 2단 분할

#### 좌측: 섹션 1 — 나의 캐릭터 스탯

- **ENERGY**: 아침형/저녁형/새벽형 (print-radio 3개, 바 위 배치)
- **FOCUS**: 한우물형/멀티태스킹 (print-radio 2개)
- **ACTION**: 계획형/반반/즉흥형 (print-radio 3개)
- **SOCIAL**: 혼자충전/같이충전 (print-radio 2개)
- **CREATE**: 새로운거/발전시키기 (print-radio 2개)
- 각 스탯: 이모지 + 라벨 + 흰 바(`h-4 rounded-full`) 위에 radio 배치
- 배경: `bg-gradient-to-br from-minion-yellow/15 to-minion-blue/10`

#### 좌측: 숨겨진 속성 (체크박스 18개)

- 3열 그리드 (`grid-cols-3 gap-x-8 gap-y-6`)
- 항목: 야행성, 음악필수, 맛집러, 승부욕, 집순이, 여행러, 동물덕후, 수다쟁이, 정보수집, 만들기, 카페인, SNS, 드라마, 운동러, 노래방, 쇼핑러, 독서광, 정리왕
- 각각 이모지 + 텍스트 + print-checkbox

#### 우측: 표지

- 미니언즈 이미지 2개 (절대 위치: 우상단 `미니언즈점프.png`, 좌하단 `미니언즈바나나먹음.png`)
- 회차 뱃지: `bg-minion-yellow text-rich-black rounded-full`
- 타이틀: "내 안의 빌런을 찾아라!"
- 서브: "AI가 나만의 캐릭터를 만들어줄 거야"
- 입력 폼: 이름, 생년월일, MBTI (write-line)
- 인용구: "모든 빌런에겐 자기만의 스토리가 있다."
- 하단 로고: `logo.svg` + "Algrowithm"

### 페이지 2 (좌: 섹션2 | 우: 섹션3) — `flex` 2단 분할

#### 좌측: 섹션 2 — 나의 강점 키워드 발굴소

- **주변에서 자주 하는 말** (체크박스 8개):
  - "너 진짜 웃겨" → 유머, "속 시원해" → 공감, "어떻게 알아?" → 정보력
  - "너 덕분에" → 해결사, "꼼꼼하다" → 섬세함, "같이 있으면 편해" → 편안함
  - "아이디어 좋다" → 창의력, "믿고 맡길 수 있어" → 신뢰감
  - 기타 입력란 (write-line)
- **내가 자신 있는 것 TOP 3**: 금/은/동 메달 번호 + write-line
- **빌런 포인트** (체크박스 8개, 2열): 귀찮아, 늦잠, 결정장애, 욕심쟁이, 완벽주의, 급한성격, 혼자끙끙, TMI폭주

#### 우측: 섹션 3 — 나의 캐릭터 완성

- **캐릭터 스케치 공간**: 128x128 빈 박스 + 연필 아이콘
- **캐릭터 정보**: 캐릭터명(write-box), 타입(print-radio: 사람형/동물형/판타지), 동물 표현(write-line), 시그니처 컬러 3칸(빈 컬러 박스)
- **캐릭터 한줄소개**: 흰 배경 텍스트 영역
- **슬로건/좌우명**: write-line (큰따옴표 시작)
- **최종 키워드 TOP 5**: 5칸 그리드 카드 (`grid-cols-5`)
- 하단 안내: "이 워크지를 Image Studio에 업로드하면 AI가 캐릭터를 만들어줘요!"

---

## 워크북 2: "이미지 아이덴티티" (workbook_2.html, 297줄)

### 테마

- soft-gold `#d4af37`, 다이아몬드 SVG 배경 패턴, 원석 이미지 장식

### 단일 페이지 — 3단 분할 (`grid-cols-12`)

#### 헤더

- 뱃지: "2회차 워크지", "Personal Career DNA Discovery"
- 타이틀: "이미지 아이덴티티 — 나만의 시각적 정체성 디자인"
- 인용구: "AI는 도구일 뿐, 진짜 답은 네 안에 있어. (Find You, Then AI)"
- 우측: Name/Partner 입력 + 오늘의 미션 + 마틴 스코세이지 명언

#### 좌측 (col-span-4): 섹션 1 — 자기 이해 진단

1. 나를 생각할 때 떠오르는 단어 **15개 이상** (textarea)
2. 위 단어 2개 이상으로 나를 표현하는 문장 **5개** (textarea)
3. 부정적 표현 → 긍정적 표현 리프레이밍 (textarea, "리프레이밍" 뱃지)

#### 중앙 (col-span-4): 섹션 2 — 관계 속에서의 나

1. 가까운 사람들이 보는 나 (`bg-pink-50/50`, 핑크 보더 textarea)
2. 일반 타인이 보는 나 (`bg-blue-50/50`, 블루 보더 textarea)
3. 내가 되고 싶은 모습 (`bg-yellow-50/50`, 옐로 보더 textarea)

#### 우측 (col-span-4): 섹션 3 — 나의 색깔 정하기

1. 브랜드 컬러 선택: `<input type="color" value="#d4af37">` + 색 이름 입력
2. 그 색을 고른 이유 (textarea)
3. **나만의 브랜드 문구**: 한 단어 (input, `border-b-2 border-soft-gold`) + 한 문장 (textarea)
   - 골드 보더 카드, floating 라벨: "나만의 브랜드 문구"

#### 배경 장식

- `rough_gemstone.png`: 좌하단 (w-64, opacity-20, mix-blend-multiply)
- `blue_diamond.png`: 우상단 (w-64, opacity-20, mix-blend-multiply)
