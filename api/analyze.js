// Vercel Serverless Function - Gemini API 연동 (다중 모드 지원)
// API 키는 Vercel 환경변수에 저장됨 (GEMINI_API_KEY)
// 모드: 'website' (기본), 'character' (캐릭터 이미지 생성), 'video' (영상화 프롬프트)

export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 다중 이미지 지원: images 배열 또는 기존 image 단일 값
        let images = req.body.images || (req.body.image ? [req.body.image] : []);
        const mode = req.body.mode || 'website';  // 'website', 'character', 'video'
        const originalPrompt = req.body.originalPrompt || '';
        const accessCode = req.body.accessCode;
        const userApiKey = req.body.apiKey;

        if (!images || images.length === 0) {
            return res.status(400).json({ error: 'At least one image is required' });
        }

        // 최대 4장 제한
        if (images.length > 4) {
            images = images.slice(0, 4);
        }

        // API 키 결정 (접근 코드 > 사용자 입력 > 환경변수)
        let API_KEY = process.env.GEMINI_API_KEY;

        if (accessCode) {
            // 접근 코드 검증
            const validAccessCode = process.env.ACCESS_CODE;
            if (accessCode === validAccessCode) {
                API_KEY = process.env.GEMINI_API_KEY;
            } else {
                return res.status(401).json({ error: '접근 코드가 올바르지 않습니다' });
            }
        } else if (userApiKey) {
            API_KEY = userApiKey;
        }

        if (!API_KEY) {
            return res.status(500).json({ error: 'API key not configured' });
        }

        // 이미지 parts 배열 생성
        const imageParts = images.map(img => ({
            inline_data: {
                mime_type: 'image/jpeg',
                data: img.replace(/^data:image\/\w+;base64,/, '')
            }
        }));

        let promptText = '';

        // 모드별 프롬프트 설정
        if (mode === 'character') {
            // 캐릭터 이미지 생성용 프롬프트
            promptText = `이 이미지는 "내 안의 빌런을 찾아라!" 워크지입니다.

## 워크지 구조 (손글씨로 작성됨)
- **표지**: 이름, 생년월일, MBTI
- **섹션 1 - 나의 캐릭터 스탯**: ENERGY(아침형/저녁형/새벽형), FOCUS(한우물형/멀티태스킹), ACTION(계획형/즉흥형), SOCIAL(혼자충전/같이충전), CREATE(새로운것/기존것발전)
- **나의 숨겨진 속성**: 야행성, 음악필수, 맛집러, 승부욕폭발, 집순이/집돌이, 여행러, 동물덕후, 수다쟁이, 정보수집가, 만들기좋아, 카페인중독, SNS마스터 등 체크된 항목
- **섹션 2 - 나의 강점 키워드 발굴소**: 주변에서 자주 듣는 말 (유머, 공감, 정보력, 해결사, 섬세함, 편안함, 창의력, 신뢰감)
- **내가 자신있는 것 TOP 3**
- **나의 빌런 포인트** (단점도 매력): 귀찮아하는편, 늦잠챔피언, 결정장애, 욕심쟁이, 완벽주의, 급한성격, 혼자끙끙, TMI폭주 등
- **섹션 3 - 나의 캐릭터 완성**: 캐릭터명, 캐릭터타입(사람형/동물형/판타지), 나를 동물로 표현하면?, 시그니처 컬러, 캐릭터 한줄소개, 슬로건/좌우명
- **최종 키워드 TOP 5**

---

워크지에서 다음 정보를 추출하고, 이를 바탕으로 **Imagen/Midjourney용 캐릭터 이미지 생성 프롬프트**를 만들어주세요.

## 추출할 정보:
1. 이름/캐릭터명
2. 체크된 스탯과 속성들
3. 강점 키워드들
4. 빌런 포인트 (매력적인 단점)
5. 캐릭터 타입 (사람형/동물형/판타지)
6. 동물 표현
7. 시그니처 컬러
8. 캐릭터 한줄소개
9. 슬로건/좌우명

---

## 출력 형식:

**분석 결과:**
[추출된 정보 요약 - 3-5줄로 간단히]

**이미지 생성 프롬프트:**
[영어로 작성된 Imagen/Midjourney 프롬프트. 다음 요소 포함:
- 캐릭터 스타일 (3D cartoon, anime, digital art 등)
- 캐릭터 외형 (체크된 속성과 동물 표현 반영)
- 컬러 팔레트 (시그니처 컬러 활용)
- 표정과 포즈 (슬로건/성격 반영)
- 배경 스타일
- 아트 스타일 키워드]

프롬프트는 반드시 영어로, 쉼표로 구분된 키워드 형태로 작성해주세요.
예시: "3D cartoon character, cute owl wearing goggles, purple and yellow color scheme, confident pose, minimal background, Pixar style, high quality render"`;

        } else if (mode === 'video') {
            // 영상화 프롬프트 추출
            promptText = `이 이미지는 AI가 생성한 캐릭터 이미지입니다.
${originalPrompt ? `원본 이미지 생성 프롬프트: ${originalPrompt}` : ''}

이 캐릭터 이미지를 **Runway Gen-3, Pika, Sora** 같은 AI 영상 생성 도구에서 사용할 수 있는 **영상화 프롬프트**로 변환해주세요.

## 요청사항:
1. 이미지의 캐릭터, 스타일, 분위기를 분석
2. 3-5가지 다른 움직임/애니메이션 옵션 제안
3. 각 옵션에 대한 영어 프롬프트 제공

## 출력 형식:

**캐릭터 분석:**
[캐릭터의 특징, 스타일, 분위기 간단 분석 - 2-3줄]

**영상화 프롬프트 옵션:**

1. **인트로 모션** (캐릭터 등장)
\`\`\`
[영어 프롬프트 - 캐릭터가 화면에 등장하는 애니메이션]
\`\`\`

2. **아이들 모션** (자연스러운 움직임)
\`\`\`
[영어 프롬프트 - 캐릭터가 가만히 있을 때의 자연스러운 움직임]
\`\`\`

3. **인터랙션 모션** (특정 동작)
\`\`\`
[영어 프롬프트 - 캐릭터가 손을 흔들거나 특정 동작을 하는 애니메이션]
\`\`\`

4. **루프 모션** (반복 가능한 움직임)
\`\`\`
[영어 프롬프트 - 무한 반복 가능한 부드러운 움직임]
\`\`\`

5. **시네마틱 모션** (영화같은 연출)
\`\`\`
[영어 프롬프트 - 카메라 무브먼트와 함께하는 드라마틱한 연출]
\`\`\`

각 프롬프트는 Runway Gen-3에 바로 사용할 수 있는 형태로 작성해주세요.`;

        } else {
            // 기본 웹사이트 생성 프롬프트 (기존 로직)
            const imageCountText = images.length > 1
                ? `이 ${images.length}장의 이미지는 "나만의 커리어 브랜딩 워크북 (3회차)"의 앞/뒤면입니다.`
                : '이 이미지는 "나만의 커리어 브랜딩 워크북 (3회차)"입니다.';

            promptText = `${imageCountText}

## 워크지 구조 (손글씨로 작성됨)
- **표지**: 이름, 전화번호
- **STEP 1**: 가치 키워드 100개 중 체크 → 최종 3개 선택
- **STEP 2**: 살아있음을 느낀 경험 3가지
- **STEP 3**: 롤모델과 동경 이유
- **STEP 4**: 유산 편지 (나에게 남길 메시지)
- **STEP 5**: 삶의 목적(가치관) 한 줄 + 목표 3가지

---

먼저 워크지에서 아래 내용을 추출해주세요:

1. **추출된 키워드** (5-7개): 워크지에서 발견한 핵심 키워드들

그리고 이 정보를 바탕으로 **Lovable에서 웹사이트를 만들 수 있는 프롬프트**를 아래 형식으로 작성해주세요:

---
**웹사이트 생성 프롬프트:**

# Role
당신은 **센스 있는 웹사이트 디자이너이자 만들기 도우미**입니다.
사용자가 입력한 아래 정보를 바탕으로, **러버블(Lovable)이 즉시 코드로 구현할 수 있는 구체적이고 전문적인 웹사이트 기획안**을 작성해 주세요.

---

# [입력된 사용자 정보]

## 1. 웹사이트 정체성
- **웹사이트 이름:** [표지의 이름]
- **한 줄 소개:** [STEP 5의 "삶의 목적" 한 줄]
- **주요 타겟:** [STEP 3 롤모델 동경 이유에서 유추한 타겟]
- **핵심 무드(Feeling):** 방문자가 이 사이트에서 "[STEP 1 핵심 가치 3개]" 느낌을 받아야 합니다.

## 2. 디자인 시스템
- **메인 컬러:** [STEP 1 핵심 가치 키워드 느낌에 맞는 색상 추천]
- **포인트 컬러:** [보조 컬러 추천]
- **배경 스타일:** [가치 키워드 분위기에 맞는 배경 스타일]
- **폰트/글자 느낌:** [가치 키워드 분위기에 맞는 폰트 추천]
- **전반적인 분위기:** 위 컬러와 스타일을 조합하여 "[톤앤매너]" 느낌으로 디자인해 주세요.

## 3. 핵심 콘텐츠 내용
- **메인 카피(Hero Title):** "[STEP 5 삶의 목적을 임팩트 있는 헤드라인으로]"
- **서브 카피:** "[STEP 5 목표 3가지를 요약한 문장]"
- **주요 특징/강점 3가지:** [STEP 5의 목표 1, 2, 3을 강점 카드로 변환]
- **자기소개:** [STEP 3 롤모델 동경 이유 + STEP 4 유산 편지 내용 조합]
- **경험 스토리:** [STEP 2의 경험 3가지를 스토리텔링으로]
- **마지막 행동 유도(CTA):** "[목표와 연결된 행동 유도 문구]"
- **연락처 및 링크:** [표지의 전화번호 있으면 포함]

---

만약 손글씨가 잘 안 보이거나 비어있다면, 그 부분은 [미입력]으로 표시하고 합리적인 기본값으로 대체해주세요.`;
        }

        // parts 배열 구성: 텍스트 프롬프트 + 모든 이미지
        const parts = [{ text: promptText }, ...imageParts];

        // Gemini API 호출
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: parts
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2000,
                    }
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API Error:', errorData);
            return res.status(500).json({ error: 'Gemini API error', details: errorData });
        }

        const data = await response.json();

        // 응답에서 텍스트 추출
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // 모드별 응답 파싱
        if (mode === 'character') {
            // 캐릭터 모드: 분석 결과와 이미지 프롬프트 추출
            const analysisMatch = generatedText.match(/분석 결과[：:\s]*([\s\S]*?)(?=이미지 생성 프롬프트|$)/i);
            const promptMatch = generatedText.match(/이미지 생성 프롬프트[：:\s]*([\s\S]*?)$/i);

            const analysis = analysisMatch ? analysisMatch[1].trim() : generatedText.substring(0, 500);
            let imagePrompt = promptMatch ? promptMatch[1].trim() : '';

            // 프롬프트에서 마크다운 제거
            imagePrompt = imagePrompt.replace(/```[\s\S]*?```/g, '').replace(/\*\*/g, '').trim();

            // 기본 프롬프트 생성 (추출 실패 시)
            if (!imagePrompt || imagePrompt.length < 20) {
                imagePrompt = "3D cartoon character, cute friendly design, vibrant colors, expressive face, dynamic pose, minimal clean background, Pixar Disney style, high quality render, soft lighting";
            }

            return res.status(200).json({
                success: true,
                analysis: analysis,
                imagePrompt: imagePrompt,
                rawResponse: generatedText,
                mode: 'character'
            });

        } else if (mode === 'video') {
            // 비디오 모드: 영상화 프롬프트 추출
            return res.status(200).json({
                success: true,
                videoPrompt: generatedText,
                rawResponse: generatedText,
                mode: 'video'
            });

        } else {
            // 기본 웹사이트 모드
            const keywordMatch = generatedText.match(/추출된 키워드[^:]*[:：]([^\n]+)/);
            const keywords = keywordMatch
                ? keywordMatch[1].split(/[,，、]/).map(k => k.trim().replace(/[#\-\*]/g, '')).filter(k => k)
                : ['창의적', '따뜻함', '전문성'];

            const websitePromptMatch = generatedText.match(/웹사이트 생성 프롬프트[^:]*[:：]\s*([\s\S]*?)$/i);
            const prompt = websitePromptMatch
                ? websitePromptMatch[1].trim()
                : generatedText;

            return res.status(200).json({
                success: true,
                keywords: keywords.slice(0, 7),
                prompt: prompt || generatedText,
                rawResponse: generatedText,
                imageCount: images.length,
                mode: 'website'
            });
        }

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}
