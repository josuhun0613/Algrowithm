# AI 도구 페이지 상세 (4~6) + 공통 패턴

> 도구 1~3은 [tools.md](tools.md) 참조

---

## 4. E-book PDF 생성기 (`ebook-pdf-generator.html`, 약 2,129줄)

### 목적

E-book 콘텐츠를 포맷된 PDF로 변환

### 기능

- 콘텐츠 입력 (리치 텍스트 형식)
- 커버 이미지 업로드
- 메타데이터: 제목, 저자, 설명
- 레이아웃: A4 / Letter 선택
- 실시간 미리보기
- PDF 다운로드

### API

- `/api/generate-ebook-pdf.js`: 서버에서 PDF 생성
- `/api/generate-cover-image.js`: AI 커버 이미지 생성

---

## 5. 웹사이트 생성 프롬프트 (`prompt-studio.html`, 약 1,048줄)

### 목적

Claude/Lovable에서 사용할 웹사이트 생성 프롬프트를 단계별로 만들어줌

### 플로우

1. 웹사이트 목적 설명
2. 타겟 방문자 정의
3. 원하는 기능 명시
4. 디자인 스타일 선택
5. 프롬프트 생성 + 복사

### 워크북 업로드 모드

- 워크북 3회차 사진 업로드 → `/api/analyze.js` (mode: 'website')
- Gemini가 워크지 내용 분석 → 웹사이트 기획 프롬프트 자동 생성
- 결과에 포함되는 내용:
  - **웹사이트 정체성**: 이름, 한줄 소개, 타겟, 핵심 무드
  - **디자인 시스템**: 메인/포인트 컬러, 배경, 폰트, 분위기
  - **핵심 콘텐츠**: Hero Title, 서브 카피, 강점 3가지, 자기소개, 경험 스토리, CTA

---

## 6. 5-Why 디버거 (`life-debugger.html`, 약 841줄)

### 목적

개인 문제를 5-Why 분석법으로 디버깅

### 기능

- 문제 입력: "지금 가장 고민인 것은?"
- 5단계 Why 질문: 각 답변에 대해 "왜?"를 반복
- 루트 원인 도출
- 솔루션 제안
- 결과 저장/내보내기

### 연관 프로젝트

- `C:\life-debugger`: 별도 Next.js 앱 (career-navigator에 마이그레이션 예정)
- 이 HTML 버전은 간단한 프론트엔드 전용 구현

---

## 도구 공통 디자인 패턴

### 접근 코드 입력 UI

```html
<div class="flex gap-2">
    <input type="password" placeholder="접근 코드 입력"
        class="flex-1 px-4 py-3 border rounded-xl focus:border-soft-gold">
    <button class="px-6 py-3 bg-soft-gold text-white rounded-xl font-bold">
        확인
    </button>
</div>
```

### 로딩 스피너

```html
<div class="spinner hidden">
    <div class="w-6 h-6 border-2 border-soft-gold border-t-transparent
                rounded-full animate-spin"></div>
</div>
```

### 토스트 알림

```javascript
function showToast(message, type = 'success') {
    // 우측 상단에 일시적으로 표시되는 알림
    // type: success (green), error (red), info (blue)
}
```

### 이미지 업로드 드래그앤드롭

```html
<div class="border-2 border-dashed border-gray-300 rounded-2xl p-8
            hover:border-soft-gold transition-colors cursor-pointer"
     ondragover="..." ondrop="..." onclick="fileInput.click()">
    <i class="fa-solid fa-cloud-upload text-4xl text-gray-300"></i>
    <p>이미지를 드래그하거나 클릭하세요</p>
    <input type="file" accept="image/*" class="hidden">
</div>
```

### 결과 표시 + 복사 버튼

```html
<div class="bg-gray-50 rounded-2xl p-6 border border-gray-200">
    <div class="flex justify-between items-center mb-3">
        <h3 class="font-bold">생성된 프롬프트</h3>
        <button onclick="copyToClipboard()"
            class="px-4 py-2 bg-soft-gold text-white rounded-lg text-sm font-bold">
            <i class="fa-solid fa-copy mr-1"></i> 복사
        </button>
    </div>
    <div id="result" class="text-sm text-gray-700 whitespace-pre-wrap"></div>
</div>
```

### 스텝 진행 표시기 (E-book 생성기)

```html
<div class="flex items-center justify-center gap-2">
    <!-- 각 스텝: 원형 번호 + 연결선 -->
    <div class="w-8 h-8 rounded-full bg-soft-gold text-white flex items-center
                justify-center font-bold text-sm">1</div>
    <div class="w-12 h-0.5 bg-soft-gold"></div>
    <div class="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center
                justify-center font-bold text-sm">2</div>
    <!-- ... -->
</div>
```
