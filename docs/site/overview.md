# 프로젝트 개요

## 프로젝트 정보

- **사이트명**: 알그로이즘 (Algrowithm)
- **URL**: https://algrowithm.org
- **목적**: AI를 활용한 커리어 브랜딩 워크숍 — 2030대 직장인 대상
- **대표**: 조수훈 (ESTJ / AI Architect)
- **언어**: 한국어 (ko)

---

## 기술 스택

| 분류 | 기술 | 비고 |
|------|------|------|
| 프론트엔드 | 순수 HTML + Tailwind CSS CDN | 빌드 프로세스 없음 |
| JavaScript | Vanilla JS (ES6+) | 프레임워크 없음 |
| 백엔드 | Vercel Serverless Functions (Node.js) | `api/` 디렉토리 |
| AI | Google Gemini 2.0 Flash | 텍스트 분석/생성 |
| 이미지 생성 | Google Imagen 4 | `imagen-4.0-generate-001` |
| DB | Firebase Firestore | 문의, 후기 저장 (무료) |
| 호스팅 | Vercel | 자동 배포 (Git 연동) |
| 코드 에디터 | Monaco Editor (CDN) | website-studio에서만 사용 |

---

## 디렉토리 구조

```
c:\Algrowithm\
├── index.html                     # 메인 랜딩 페이지
├── about.html                     # 소개/강사 페이지
├── schedule.html                  # 일정 (캘린더 + 사이드바)
├── js/
│   └── header.js                  # 공통 헤더 컴포넌트 (326줄)
├── workbooks/                     # 인쇄용 워크시트 (A4 가로)
│   ├── workbook_1.html            # 1회차: 내 안의 빌런을 찾아라
│   ├── workbook_2.html            # 2회차: 이미지 아이덴티티
│   ├── workbook_3.html            # 3회차: 커리어 브랜딩
│   ├── workbook_4.html            # 4회차: 내가 원하는 삶
│   ├── workbook_aq.html           # AQ 성장 알고리즘
│   ├── workbook_branding.html     # 퍼스널 브랜딩
│   └── workbook_star.html         # STAR 기법
├── tools/                         # AI 도구 (각각 독립 SPA)
│   ├── image-studio.html          # AI 이미지 생성 (Imagen 4)
│   ├── website-studio.html        # 웹사이트 빌더 (Monaco Editor)
│   ├── ebook-generator.html       # E-book 프롬프트 생성
│   ├── ebook-pdf-generator.html   # E-book PDF 생성
│   ├── prompt-studio.html         # 웹사이트 생성 프롬프트
│   └── life-debugger.html         # 5-Why 디버거
├── admin/                         # 관리자 페이지
│   ├── admin.html                 # 메인 관리 대시보드
│   ├── epti-admin.html            # EPTI 관리
│   ├── epti.html                  # EPTI 뷰어
│   └── 홍보포스터.html             # 홍보 포스터
├── api/                           # Vercel Serverless Functions
│   ├── analyze.js                 # Gemini 분석 (워크북→프롬프트)
│   ├── analyze-ebook.js           # E-book 분석
│   ├── generate-image.js          # Imagen 4 이미지 생성
│   ├── generate-cover-image.js    # 커버 이미지 생성
│   ├── generate-ebook-pdf.js      # PDF 생성
│   ├── generate-website.js        # 웹사이트 코드 생성
│   ├── enneagram-report.js        # 에니어그램 리포트
│   ├── deploy-site.js             # 생성된 사이트 배포
│   ├── notify-telegram.js         # 텔레그램 알림
│   └── github-auth.js             # GitHub OAuth
├── assets/                        # 이미지, 로고
│   ├── logo.svg                   # 브랜드 로고 (SVG)
│   ├── hero_bg.png                # 히어로 배경
│   ├── sparkling_diamond.png      # 다이아몬드 장식
│   ├── blue_diamond.png           # 파란 다이아몬드
│   ├── rough_gemstone.png         # 원석 이미지
│   ├── 미니언즈점프.png            # 워크북1 장식
│   ├── 미니언즈바나나먹음.png      # 워크북1 장식
│   └── [강연/모임 사진들]          # 홍보용 사진
├── vercel.json                    # Vercel 배포 설정
├── CLAUDE.md                      # 프로젝트 가이드
└── docs/                          # 문서
    ├── site/                      # 이 문서 폴더
    └── career-navigator/          # Career Navigator SaaS 문서
```

---

## vercel.json 설정

```json
{
  "version": 2,
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    { "source": "/sites/:name", "destination": "/api/sites/:name" }
  ]
}
```

- `cleanUrls`: `.html` 확장자 없이 접근 가능 (`/about` → `about.html`)
- `trailingSlash`: URL 끝 슬래시 제거
- `rewrites`: `/sites/*` 경로를 API로 라우팅 (생성된 사이트 서빙)

---

## 환경 변수 (Vercel Dashboard)

| 변수명 | 용도 |
|--------|------|
| `GEMINI_API_KEY` | Google Gemini API 키 |
| `IMAGE_ACCESS_CODE` | 이미지 생성 접근 코드 |
| `ACCESS_CODE` | 일반 접근 코드 |

---

## Firebase 설정

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyBK37wEth9Hoz_q17Ca0Ulm1W-JNEyllIk",
    authDomain: "algrowithm-feea0.firebaseapp.com",
    projectId: "algrowithm-feea0",
    storageBucket: "algrowithm-feea0.firebasestorage.app",
    messagingSenderId: "665224680106",
    appId: "1:665224680106:web:86a2d938ac636751e336d3"
};
```

### Firestore 컬렉션

| 컬렉션명 | 용도 | 주요 필드 |
|----------|------|-----------|
| `inquiries` | 프로그램 문의 | name, phone, email, message, program, timestamp, isRead |
| `textReviews` | 텍스트 후기 | name, role, job, program, content, createdAt |
| `photoReviews` | 사진 후기 | author, text, imageUrl(base64), createdAt |

---

## SEO 설정

- **네이버 서치어드바이저**: `meta name="naver-site-verification" content="030d623a79f0542c415c699161a0e9e3db550b90"`
- **구글 서치콘솔**: `meta name="google-site-verification" content="gHr0K5Nq2JKD3zhKhXsZJIP_GaNZUrZjs1um06OTJyk"`
- **JSON-LD**: Organization 스키마 (`@type: Organization`, founder: 조수훈)
- **Open Graph**: 카카오톡/SNS 공유 최적화 (og:title, og:description, og:url)
