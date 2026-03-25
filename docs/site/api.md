# API Serverless Functions

> `api/` 디렉토리 — Vercel Serverless Functions (Node.js, ESM)
> 모든 함수: `export default async function handler(req, res)`

---

## 공통 패턴

### CORS 헤더

```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
if (req.method === 'OPTIONS') return res.status(200).end();
```

### 인증 3단계

1. **접근 코드** → 환경변수 API 키 사용 (기본)
2. **사용자 API 키** → 직접 제공한 키 사용
3. **환경변수 기본값** → 코드/키 없으면 서버 키 사용

---

## 1. analyze.js — Gemini 분석 (워크북 → 프롬프트)

### 엔드포인트

`POST /api/analyze`

### 입력

```json
{
  "images": ["base64...", "base64..."],  // 또는 "image": "base64..."
  "mode": "website | character | video",
  "accessCode": "선택",
  "apiKey": "선택",
  "characterStyle": "minion | chibi | anime | pixar | webtoon | minimal",
  "characterType": "human | animal | fantasy | robot",
  "backgroundType": "transparent | gradient | themed",
  "platform": "runway | kling",
  "originalPrompt": "비디오 모드용 원본 프롬프트"
}
```

### 3가지 모드

#### `character` 모드

- 워크북 1("빌런") 사진에서 캐릭터 정보 추출
- 스타일별 힌트 반영하여 Imagen용 영어 프롬프트 생성
- **출력**: `{ analysis, imagePrompt, rawResponse, mode: 'character' }`

#### `video` 모드

- AI 생성 캐릭터 이미지를 Runway/Kling용 영상 프롬프트로 변환
- 5가지 모션 옵션: 인트로, 아이들, 인터랙션, 루프, 시네마틱
- **출력**: `{ videoPrompt, rawResponse, mode: 'video' }`

#### `website` 모드 (기본)

- 워크북 3("커리어 브랜딩") 사진에서 정보 추출
- Lovable용 웹사이트 기획 프롬프트 생성
- **출력**: `{ keywords, prompt, rawResponse, imageCount, mode: 'website' }`

### Gemini API 호출

```javascript
const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }, ...imageParts] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 2000 }
        })
    }
);
```

- **모델**: `gemini-2.0-flash`
- **이미지**: base64 → `inline_data` (mime_type: image/jpeg)
- **최대 4장**

---

## 2. generate-image.js — Imagen 4 이미지 생성

### 엔드포인트

`POST /api/generate-image`

### 입력

```json
{
  "prompt": "영어 프롬프트",
  "aspectRatio": "1:1 | 3:4 | 4:3 | 9:16 | 16:9",
  "accessCode": "선택",
  "apiKey": "선택",
  "testOnly": false
}
```

### Imagen 4 API 호출

```javascript
const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict`;
const requestBody = {
    instances: [{ prompt: prompt }],
    parameters: { sampleCount: 1, aspectRatio: imagenAspectRatio }
};
const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': finalApiKey },
    body: JSON.stringify(requestBody)
});
```

### 출력

```json
{
  "success": true,
  "imageUrl": "data:image/png;base64,...",
  "mimeType": "image/png",
  "model": "imagen-4.0-generate-001"
}
```

### 에러 처리

| 상태 | 메시지 |
|------|--------|
| `INVALID_ARGUMENT` | 잘못된 요청, 프롬프트 확인 |
| `PERMISSION_DENIED` | API 키 무효 또는 접근 권한 없음 |
| `RESOURCE_EXHAUSTED` | API 요청 한도 초과 |
| predictions 비어있음 | 안전 정책으로 차단됨 |

---

## 3. generate-website.js — 웹사이트 코드 생성

### 엔드포인트

`POST /api/generate-website`

### 입력

```json
{
  "message": "사용자 요청 텍스트",
  "codeContext": "현재 HTML/CSS/JS 코드 상태",
  "accessCode": "필수",
  "testOnly": false
}
```

### 시스템 프롬프트 요약

- 웹 개발 전문가 역할
- 수정된 전체 코드 제공
- HTML/CSS/JS 별도 코드 블록
- 한국어 설명 우선
- 기존 코드 스타일 유지

### 출력

```json
{ "success": true, "response": "설명 + ```html...``` + ```css...``` + ```javascript...```" }
```

---

## 4. 기타 API 함수

| 함수 | 역할 |
|------|------|
| `analyze-ebook.js` | E-book 콘텐츠 분석 + 포맷 변환 |
| `generate-ebook-pdf.js` | E-book 콘텐츠 → PDF 파일 생성 |
| `generate-cover-image.js` | E-book 커버 이미지 AI 생성 |
| `enneagram-report.js` | 에니어그램 성격 유형 리포트 생성 |
| `deploy-site.js` | 생성된 웹사이트 Vercel 배포 (URL: `/sites/{name}`) |
| `notify-telegram.js` | 문의 접수 시 텔레그램 봇 알림 (`submitInquiry()` 후) |
| `github-auth.js` | GitHub OAuth 인증 (포트폴리오 연동용) |
