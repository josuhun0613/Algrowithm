# 관리자 페이지

> `admin/` 디렉토리 — Firebase Firestore 기반 관리 도구

---

## 1. 메인 관리 대시보드 (`admin.html`, 약 1,263줄)

### 접근 방식

- 비밀번호 로그인 화면 → 인증 후 대시보드 표시
- 비밀번호는 코드 내 해싱 비교 (Firestore 아님)

### 탭 구조

| 탭 | 내용 |
|----|------|
| 프로그램 문의 | Firestore `inquiries` 컬렉션 관리 |
| 사진 후기 | Firestore `photoReviews` 컬렉션 관리 |
| 텍스트 후기 | Firestore `textReviews` 컬렉션 관리 |

### 프로그램 문의 탭

- Firestore에서 문의 목록 로드 (최신순)
- 각 문의: 이름, 연락처, 이메일, 프로그램, 메시지, 날짜
- 읽음/안읽음 상태 토글 (`isRead` 필드)
- 삭제 기능

### 사진 후기 탭

#### 후기 목록

- 기존 사진 후기 카드 형태 표시
- 각 카드: 사진(base64), 작성자, 내용, 날짜
- 편집/삭제 버튼

#### 후기 업로드

```html
<!-- 드래그앤드롭 업로드 영역 -->
<div class="border-2 border-dashed rounded-2xl p-8"
     ondragover="..." ondrop="...">
    이미지를 드래그하세요
</div>

<!-- 폼 필드 -->
- 후기 텍스트 (textarea)
- 작성자 이름 (input)
- 표지 순서 (number) — 메인 페이지 표시 순서
```

#### 기능

- 이미지 업로드 → base64 압축 → Firestore 저장
- 미리보기 표시
- 표지 순서 정규화 (1, 2, 3... 순서 재정렬)

### 텍스트 후기 탭

- 기존 텍스트 후기 목록
- 각 후기: 이름, 직업, 프로그램, 내용, 날짜
- 편집/삭제 기능

### CDN (admin 전용 추가)

```html
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
```

---

## 2. EPTI 관리 (`epti-admin.html`, 약 1,435줄)

### 목적

EPTI(Enneagram Personality Type Indicator) 기반 성격 유형 검사 관리

### 기능

- 참가자 EPTI 검사 결과 관리
- 유형별 분류 및 통계
- 개별 리포트 생성
- Firestore 연동

---

## 3. EPTI 뷰어 (`epti.html`, 약 925줄)

### 목적

참가자가 자신의 EPTI 결과를 확인하는 페이지

### 기능

- URL 파라미터로 결과 ID 전달
- 성격 유형 설명 표시
- 시각적 차트/그래프
- 공유 기능

---

## 4. 홍보 포스터 (`홍보포스터.html`, 약 559줄)

### 목적

워크숍 홍보용 포스터 생성/관리

### 기능

- 포스터 레이아웃 편집
- 일정, 장소, 내용 입력
- 인쇄/다운로드 기능

---

## Firestore 데이터 모델 상세

### `inquiries` 컬렉션

```javascript
{
  name: "홍길동",           // string
  phone: "010-1234-5678",  // string
  email: "user@email.com", // string
  program: "커리어 브랜딩",  // string
  message: "문의 내용...",   // string
  timestamp: Timestamp,     // firebase.firestore.FieldValue.serverTimestamp()
  isRead: false             // boolean
}
```

### `textReviews` 컬렉션

```javascript
{
  name: "김철수",           // string
  role: "마케터 | 1기",     // string (job + program 조합)
  job: "마케터",            // string
  program: "1기",           // string
  content: "후기 내용...",   // string
  createdAt: Timestamp      // firebase.firestore.FieldValue.serverTimestamp()
}
```

### `photoReviews` 컬렉션

```javascript
{
  author: "이영희",                     // string
  text: "후기 내용...",                  // string
  imageUrl: "data:image/jpeg;base64,...", // string (압축된 base64)
  createdAt: Timestamp,                  // firebase.firestore.FieldValue.serverTimestamp()
  coverOrder: 1                          // number (선택, 표지 순서)
}
```

### 이미지 저장 방식

- **Firebase Storage 미사용** (무료 플랜 유지)
- 이미지를 `compressImage()` 함수로 압축:
  - 최대 너비: 1200px
  - JPEG 품질: 70%
  - Canvas API로 리사이즈 후 `toDataURL('image/jpeg', 0.7)`
- base64 문자열을 Firestore 문서에 직접 저장
- Firestore 문서 크기 제한: 1MB (압축 후 충분)
