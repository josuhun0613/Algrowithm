# Algrowithm 홈페이지 전체 문서

> **algrowithm.org** — AI 커리어 브랜딩 워크숍 웹사이트
> 이 문서는 사이트를 처음부터 재구현할 수 있을 정도로 상세하게 작성되었습니다.

---

## 문서 목차

| # | 문서 | 설명 |
|---|------|------|
| 1 | [overview.md](overview.md) | 프로젝트 개요, 기술 스택, 디렉토리 구조, 배포 설정 |
| 2 | [design-system.md](design-system.md) | 컬러 팔레트, 타이포그래피, CDN 의존성, 공통 스타일 패턴 |
| 3 | [header-component.md](header-component.md) | `js/header.js` 공통 헤더 컴포넌트 상세 |
| 4 | [index-page.md](index-page.md) | 메인 랜딩 페이지 (`index.html`) 전체 구조 |
| 5 | [about-schedule.md](about-schedule.md) | About 페이지 + Schedule 페이지 |
| 6 | [workbooks.md](workbooks.md) | 워크북 1~2회차 상세 — 인쇄 최적화 포함 |
| 6-2 | [workbooks-2.md](workbooks-2.md) | 워크북 3~4회차 상세 |
| 7 | [tools.md](tools.md) | AI 도구 1~3 (이미지 스튜디오, 웹사이트 스튜디오, E-book 프롬프트) |
| 7-2 | [tools-2.md](tools-2.md) | AI 도구 4~6 (PDF 생성, 프롬프트 스튜디오, 5-Why) + 공통 패턴 |
| 8 | [api.md](api.md) | Vercel Serverless Functions (Gemini, Imagen 4 등) |
| 9 | [admin.md](admin.md) | 관리자 페이지 (문의 관리, EPTI, 홍보포스터) |

---

## 빠른 참조

- **호스팅**: Vercel (정적 HTML + Serverless Functions)
- **프레임워크 없음**: 순수 HTML + Tailwind CDN + Vanilla JS
- **AI API**: Google Gemini 2.0 Flash, Google Imagen 4
- **DB**: Firebase Firestore (무료 플랜)
- **도메인**: algrowithm.org
- **대표**: 조수훈 (ESTJ / AI Architect)

---

## 사이트 구현 순서 가이드

1. **Vercel 프로젝트 생성** → `vercel.json` 설정
2. **공통 헤더** → `js/header.js` 작성 (모든 페이지에서 사용)
3. **디자인 시스템** → Tailwind config, 폰트, 아이콘 CDN 세팅
4. **메인 랜딩** → `index.html` (히어로 → 특징 → 후기 → CTA → 푸터)
5. **서브 페이지** → `about.html`, `schedule.html`
6. **워크북 4종** → `workbooks/workbook_1~4.html` (인쇄 최적화)
7. **AI 도구** → `tools/*.html` (각각 독립된 SPA 스타일)
8. **API 함수** → `api/*.js` (Vercel Serverless)
9. **관리자** → `admin/*.html` (Firebase 연동)
10. **Firebase** → Firestore 컬렉션 설정 (inquiries, textReviews, photoReviews)
