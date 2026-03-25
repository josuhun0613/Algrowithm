# 공통 헤더 컴포넌트 (`js/header.js`)

> 모든 페이지에서 동일한 내비게이션을 제공하는 JavaScript 모듈 (326줄)

---

## 사용법

```html
<!-- HTML에 placeholder 추가 -->
<div id="header-placeholder"></div>
<script src="/js/header.js"></script>
<script>initHeader();</script>

<!-- 또는 옵션 전달 -->
<script>initHeader({ showStartButton: false });</script>

<!-- 또는 data 속성으로 자동 초기화 -->
<div id="header-placeholder" data-auto-header data-show-start-button="false"></div>
```

### 옵션

| 옵션 | 기본값 | 설명 |
|------|--------|------|
| `showStartButton` | `true` | "시작하기" 버튼 표시 여부 |
| `startButtonLink` | `/workbooks/workbook_1.html` | 시작하기 버튼 링크 |

---

## 내보내는 함수

| 함수 | 역할 |
|------|------|
| `getHeaderHTML(options)` | 헤더 HTML 문자열 반환 |
| `getHeaderStyles()` | 헤더 CSS 문자열 반환 |
| `initHeader(options)` | DOM에 헤더 삽입 + 이벤트 바인딩 |
| `openMobileMenu()` | 모바일 드로어 열기 |
| `closeMobileMenu()` | 모바일 드로어 닫기 |
| `toggleMobileAccordion()` | "실습" 하위메뉴 토글 |

---

## 데스크탑 네비게이션 구조

```
nav.fixed.w-full.z-50.header-blur
├── Logo (img + span "Algrowithm")  → href="/"
├── 데스크탑 메뉴 (hidden md:flex)
│   ├── About                       → href="/about.html"
│   ├── 실습 (드롭다운)
│   │   ├── 01 내 안의 빌런을 찾아라  → /workbooks/workbook_1.html
│   │   ├── 02 이미지 아이덴티티      → /workbooks/workbook_2.html
│   │   ├── 03 커리어 브랜딩          → /workbooks/workbook_3.html
│   │   ├── 04 내가 원하는 삶          → /workbooks/workbook_4.html
│   │   ├── ── 구분선 ──
│   │   ├── 웹사이트 생성 프롬프트     → /tools/prompt-studio.html
│   │   ├── E-book 프롬프트           → /tools/ebook-generator.html
│   │   ├── E-book PDF 생성          → /tools/ebook-pdf-generator.html
│   │   ├── AI 이미지 생성            → /tools/image-studio.html
│   │   └── 웹사이트 스튜디오         → /tools/website-studio.html
│   └── 일정                         → /schedule.html
├── 시작하기 버튼 (hidden md:flex)
└── 햄버거 버튼 (md:hidden)
```

---

## 드롭다운 CSS

```css
.dropdown { position: relative; }
.dropdown-menu {
    position: absolute;
    top: 100%; left: 50%;
    transform: translateX(-50%) translateY(10px);
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    opacity: 0; visibility: hidden;
    transition: all 0.3s ease;
    min-width: 240px; padding: 10px 0; z-index: 100;
}
.dropdown:hover .dropdown-menu {
    opacity: 1; visibility: visible;
    transform: translateX(-50%) translateY(0);
}
.dropdown-item {
    display: block; padding: 14px 24px;
    color: #1a1a1a; font-size: 15px;
}
.dropdown-item:hover {
    background: rgba(212, 175, 55, 0.1); color: #d4af37;
}
```

---

## 모바일 드로어

### 구조

```
#mobileDrawerOverlay (fixed inset-0, bg-black/50, z-[90])
#mobileDrawer (fixed top-0 right-0, w-[280px], z-[100], translate-x-full)
├── 드로어 헤더 (로고 + 닫기 버튼)
├── 네비게이션 링크
│   ├── About
│   ├── 실습 (아코디언)
│   │   ├── 01~04 워크북 링크
│   │   ├── 구분선
│   │   └── AI 도구 링크
│   └── 일정
└── CTA 버튼 ("프로그램 문의하기")
```

### 동작

1. **열기**: `openMobileMenu()` → `translate-x-full` 제거, 오버레이 opacity 100
2. **닫기**: `closeMobileMenu()` → 역순 + body overflow 복원
3. **햄버거→X 애니메이션**: 3개 span에 CSS transform 적용
   - 상단 줄: `translateY(8px) rotate(45deg)`
   - 중간 줄: `opacity: 0`
   - 하단 줄: `translateY(-8px) rotate(-45deg)`
4. **ESC 키**: document keydown 이벤트에서 드로어 닫기
5. **오버레이 클릭**: `closeMobileMenu()` 호출

### 아코디언

```javascript
function toggleMobileAccordion() {
    const content = document.getElementById('accordionContent');
    const icon = document.getElementById('accordionIcon');
    content.classList.toggle('hidden');
    icon.style.transform = content.classList.contains('hidden') ? '' : 'rotate(180deg)';
}
```

---

## 시작하기 버튼

```html
<a href="/workbooks/workbook_1.html"
    class="hidden md:flex px-6 py-2.5 bg-text-dark text-white rounded-full
           text-sm font-bold hover:bg-soft-gold transition-all duration-300
           shadow-lg items-center gap-2">
    <i class="fa-solid fa-pen-nib"></i>
    <span>시작하기</span>
</a>
```

- 데스크탑에서만 표시 (`hidden md:flex`)
- 기본 배경: `bg-text-dark` (#1a1a1a)
- 호버 시: `bg-soft-gold` (#d4af37)로 전환

---

## 워크북 페이지에서의 사용

워크북은 인쇄 최적화가 필요하므로 header-placeholder에 `no-print` 클래스 추가:

```html
<div id="header-placeholder" class="no-print"></div>
<script src="../js/header.js"></script>
<script>initHeader({ showStartButton: false });</script>
```

- 상대 경로 사용: `../js/header.js` (workbooks 폴더 기준)
- 인쇄 시 헤더 숨김: `.no-print { display: none !important; }`
