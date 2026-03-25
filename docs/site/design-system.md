# 디자인 시스템

## CDN 의존성 (모든 페이지 공통)

```html
<!-- Tailwind CSS v3 -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Pretendard 한국어 폰트 -->
<link rel="stylesheet" as="style" crossorigin
    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />

<!-- Playfair Display 세리프 폰트 -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
    rel="stylesheet">

<!-- Font Awesome 6.4.0 아이콘 -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

### 페이지별 추가 CDN

| 라이브러리 | 사용 페이지 | CDN URL |
|-----------|------------|---------|
| Swiper.js 11 | index.html, about.html | `cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css` + `.js` |
| GSAP 3.12.2 | index.html, about.html | `cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js` |
| ScrollTrigger | index.html, about.html | `cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js` |
| Lenis 1.1.13 | index.html | `unpkg.com/lenis@1.1.13/dist/lenis.min.js` |
| Firebase 10.7.1 | index.html, admin.html | `gstatic.com/firebasejs/10.7.1/firebase-app-compat.js` + `firebase-firestore-compat.js` |
| Monaco Editor 0.45.0 | website-studio.html | `cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/editor/editor.main.min.js` |

---

## Tailwind 커스텀 설정

### 메인 페이지 (index.html) — 기본 구성

```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                'pure-white': '#ffffff',
                'off-white': '#f5f5f5',
                'text-dark': '#1a1a1a',
                'soft-gold': '#d4af37',
            },
            fontFamily: {
                sans: ['Pretendard', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            }
        }
    }
}
```

### about.html 추가 색상

```javascript
'deep-navy': '#001F3F',
'rich-black': '#0a0a0a',
```

### workbook_1.html (미니언즈 테마)

```javascript
'minion-yellow': '#FFE135',
'minion-blue': '#4169E1',
'villain-purple': '#8B5CF6',
```

### workbook_3.html (커리어 브랜딩 테마)

```javascript
'warm-orange': '#e67e22',
'deep-orange': '#d35400',
'light-orange': '#f39c12',
```

### workbook_4.html (자아탐색 테마)

```javascript
'deep-purple': '#4a3c6d',
'soft-teal': '#5a9e9e',
'deep-navy': '#1e3a5f',
'navy-blue': '#2c5282',
'light-navy': '#4a7396',
'warm-cream': '#faf8f5',
```

---

## 컬러 팔레트 총정리

| 이름 | HEX | 용도 |
|------|-----|------|
| **soft-gold** | `#d4af37` | 메인 액센트 — 버튼, 링크, 하이라이트 |
| **rich-black** | `#0a0a0a` | 텍스트, 다크 UI |
| **text-dark** | `#1a1a1a` | 본문 텍스트 |
| **off-white** | `#f5f5f5` | 배경 |
| **pure-white** | `#ffffff` | 카드 배경 |
| minion-yellow | `#FFE135` | 워크북1 테마 |
| minion-blue | `#4169E1` | 워크북1 테마 |
| villain-purple | `#8B5CF6` | 워크북1 테마 |
| warm-orange | `#e67e22` | 워크북3 액센트 |
| deep-navy | `#1e3a5f` | 워크북4 테마 |
| workshop (gold) | `#d4af37` | 캘린더 워크샵 이벤트 |
| online (blue) | `#4a90d9` | 캘린더 온라인 이벤트 |

---

## 타이포그래피

### 폰트 스택

```css
/* 기본 산세리프 (본문) */
font-family: 'Pretendard', sans-serif;

/* 세리프 (타이틀, 브랜드명) */
font-family: 'Playfair Display', serif;
```

### 사용 패턴

- **페이지 타이틀**: `text-3xl md:text-4xl font-serif font-bold`
- **섹션 헤더**: `text-xl md:text-2xl font-bold`
- **본문**: `text-sm md:text-base` (Pretendard)
- **라벨/캡션**: `text-xs text-gray-500`
- **브랜드명**: `font-serif font-bold tracking-tight`
- **영문 상단 라벨**: `tracking-widest uppercase text-[10px] font-bold`

---

## 공통 스타일 패턴

### 글래스모피즘 (헤더, 드롭다운)

```css
.header-blur {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
}
```

### 모달 오버레이

```css
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
    display: none;
}
.modal-overlay.active { display: flex; align-items: center; justify-content: center; }
```

### 인쇄 기본 설정 (워크북 공통)

```css
body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}
@media print {
    @page { size: A4 landscape; margin: 0; }
    .no-print { display: none !important; }
    .print-container {
        width: 297mm; height: 210mm;
        padding: 8mm; margin: 0;
        overflow: hidden; page-break-inside: avoid;
    }
}
@media screen {
    .print-container {
        width: 297mm; height: 210mm;
        margin: 2rem auto; background-color: white;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        padding: 8mm;
    }
}
```

### 워크북 입력 요소 (인쇄용)

```css
.print-checkbox { width: 18px; height: 18px; border: 2px solid #333; border-radius: 50%; }
.print-radio    { width: 16px; height: 16px; border: 2px solid #333; border-radius: 50%; }
.write-line     { border-bottom: 1.5px solid #333; min-height: 24px; }
.write-box      { border: 1.5px solid #ddd; border-radius: 6px; min-height: 28px; }
```

### 다이아몬드 SVG 배경 패턴 (워크북2, 3): `d4af37` fill-opacity 0.05 인라인 SVG

## 반응형 + 애니메이션

- **반응형**: `md`(768px) 전환, `hidden md:flex`, `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, 패딩 `px-5 md:px-[60px]`
- **애니메이션**: GSAP ScrollTrigger, Swiper(캐러셀), Lenis(스무스스크롤), CSS transform(햄버거, 드로어, 플로팅, 시머)
