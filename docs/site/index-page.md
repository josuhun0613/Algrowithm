# 메인 랜딩 페이지 (`index.html`)

> 약 1,764줄 — 방문자를 워크숍 참가자로 전환하기 위한 랜딩 페이지

---

## HEAD 구성

### SEO 메타 태그

```html
<title>알그로이즘(Algrowithm) - AI 커리어 브랜딩 워크숍 | 퍼스널 브랜딩, 성장 알고리즘</title>
<meta name="description" content="알그로이즘은 AI를 활용한 커리어 브랜딩 워크숍입니다...">
<meta name="keywords" content="알그로이즘, Algrowithm, 커리어 브랜딩, 퍼스널 브랜딩, AI 워크숍...">
```

### Open Graph

```html
<meta property="og:type" content="website">
<meta property="og:title" content="알그로이즘(Algrowithm) - AI 커리어 브랜딩 워크숍">
<meta property="og:url" content="https://algrowithm.org">
<meta property="og:locale" content="ko_KR">
```

### JSON-LD 구조화 데이터

```json
{ "@context": "https://schema.org", "@type": "Organization",
  "name": "알그로이즘", "alternateName": "Algrowithm",
  "url": "https://algrowithm.org",
  "founder": { "@type": "Person", "name": "조수훈" } }
```

### CDN 로드 순서

1. Tailwind CSS + config
2. Lenis (스무스 스크롤)
3. Swiper CSS
4. GSAP + ScrollTrigger
5. Font Awesome
6. Pretendard + Playfair Display
7. Firebase SDK (app + firestore)

---

## JavaScript 전역 함수 (HEAD 내 `<script>`)

Firebase 초기화 후 다음 함수들이 전역 선언됨:

| 함수 | 역할 |
|------|------|
| `openInquiryModal()` | 문의 모달 열기 |
| `closeInquiryModal()` | 문의 모달 닫기 + 폼 초기화 |
| `closeInquirySuccessModal()` | 성공 모달 닫기 |
| `openTextReviewModal()` | 텍스트 후기 모달 열기 |
| `closeTextReviewModal()` | 텍스트 후기 모달 닫기 |
| `openPhotoReviewModal()` | 사진 후기 모달 열기 |
| `closePhotoReviewModal()` | 사진 후기 모달 닫기 |
| `submitTextReview(e)` | 텍스트 후기 → Firestore 저장 |
| `submitPhotoReview(e)` | 사진 후기 → 이미지 압축 → Firestore 저장 |
| `compressImage(file, maxWidth, quality)` | 이미지 base64 압축 (max 1200px, 70%) |
| `previewPhoto(input)` | 사진 업로드 미리보기 |
| `submitInquiry(e)` | 문의 → Firestore 저장 + 텔레그램 알림 |
| `loadTextReviews()` | Firestore에서 텍스트 후기 로드 |
| `loadPhotoReviews()` | Firestore에서 사진 후기 로드 |

---

## BODY 섹션 구조

### 1. 헤더

```html
<div id="header-placeholder"></div>
<script src="js/header.js"></script>
<script>initHeader();</script>
```

### 2. 히어로 섹션

- 전체 화면 (`min-h-screen`)
- 배경: `hero_bg.png` 또는 그라디언트
- 메인 카피: 큰 세리프 폰트로 감성적 헤드라인
- 서브 카피: 워크숍 핵심 가치 설명
- CTA 버튼: "프로그램 문의하기" → `openInquiryModal()`
- GSAP 스크롤 애니메이션 (fade-in, slide-up)

### 3. 특징/이점 섹션

- 3~4개 카드 그리드 (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- 각 카드: 아이콘 + 제목 + 설명
- 워크숍에서 얻을 수 있는 가치 소개

### 4. 워크숍 콘텐츠 섹션

- 4회차 커리큘럼 소개
- 각 회차별 제목, 설명, 아이콘
- 스크롤 트리거 애니메이션

### 5. 후기 섹션 (Swiper 캐러셀)

#### 사진 후기

- Swiper 슬라이더 (`slidesPerView: 1` → `md: 2` → `lg: 3`)
- 각 슬라이드: 사진 + 작성자 + 내용
- Firestore `photoReviews` 컬렉션에서 동적 로드
- "후기 작성" 버튼 → `openPhotoReviewModal()`

#### 텍스트 후기

- 카드형 레이아웃
- Firestore `textReviews` 컬렉션에서 동적 로드
- "후기 작성" 버튼 → `openTextReviewModal()`

### 6. FAQ 섹션

- 아코디언 형태 (클릭 시 답변 펼침)
- 자주 묻는 질문 3~5개

### 7. CTA 섹션

- 최종 행동 유도 영역
- "프로그램 문의하기" 큰 버튼
- 배경 그라디언트 또는 어두운 톤

### 8. 푸터

```html
<footer class="bg-text-dark text-white">
  로고 + 브랜드명
  네비게이션 링크 (About, 실습, 일정, Career Navigator)
  카피라이트: © 2025 Algrowithm. All rights reserved.
</footer>
```

---

## 모달들

### 문의 모달 (`#inquiryModal`)

- **필드**: 이름, 연락처(전화번호), 이메일, 관심 프로그램(select), 문의 내용(textarea)
- **제출**: Firestore `inquiries` 컬렉션 저장 → 텔레그램 알림 (`/api/notify-telegram.js`)
- **성공 시**: 성공 모달 표시 (`#inquirySuccessModal`)

### 텍스트 후기 모달 (`#textReviewModal`)

- **필드**: 이름, 직업, 참여 프로그램, 후기 내용(textarea)
- **제출**: Firestore `textReviews` 컬렉션 저장
- **성공 시**: alert + 후기 섹션 새로고침

### 사진 후기 모달 (`#photoReviewModal`)

- **필드**: 작성자 이름, 후기 내용, 사진 업로드(file input)
- **사진 처리**: `compressImage()` → max 1200px, JPEG 70% → base64
- **제출**: Firestore `photoReviews` 컬렉션에 base64 직접 저장
- **미리보기**: `previewPhoto()` → 업로드 즉시 표시

---

## 동적 데이터 로드

### `loadTextReviews()`

```javascript
db.collection('textReviews')
  .orderBy('createdAt', 'desc')
  .get()
  .then(snapshot => { /* DOM에 카드 생성 */ });
```

### `loadPhotoReviews()`

```javascript
db.collection('photoReviews')
  .orderBy('createdAt', 'desc')
  .get()
  .then(snapshot => { /* Swiper 슬라이드 생성 */ });
```

---

## 초기화 흐름 (DOMContentLoaded)

1. Lenis 스무스 스크롤 초기화
2. GSAP ScrollTrigger 등록
3. Swiper 인스턴스 생성 (후기 캐러셀)
4. `loadTextReviews()` + `loadPhotoReviews()` 호출
5. 스크롤 기반 애니메이션 설정
