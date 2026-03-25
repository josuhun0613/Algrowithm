// 통합 AI API — Gemini 기반 모든 AI 기능
// mode: 'analyze' | 'analyze-ebook' | 'enneagram-report' | 'generate-ebook-pdf'

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { mode } = req.body;

    switch (mode) {
        case 'analyze-ebook': return handleAnalyzeEbook(req, res);
        case 'enneagram-report': return handleEnneagramReport(req, res);
        case 'generate-ebook-pdf': return handleGenerateEbookPdf(req, res);
        default: return handleAnalyze(req, res); // 'analyze' 또는 기존 호환
    }
}

// ─── analyze (다중 모드: website/character/video) ───
async function handleAnalyze(req, res) {
    try {
        let images = req.body.images || (req.body.image ? [req.body.image] : []);
        const analysisMode = req.body.mode2 || req.body.analysisMode || req.body.mode || 'website';
        const originalPrompt = req.body.originalPrompt || '';
        const accessCode = req.body.accessCode;
        const userApiKey = req.body.apiKey;
        const characterStyle = req.body.characterStyle || 'minion';
        const characterType = req.body.characterType || 'human';
        const backgroundType = req.body.backgroundType || 'transparent';
        const platform = req.body.platform || 'runway';

        if (!images || images.length === 0) {
            return res.status(400).json({ error: 'At least one image is required' });
        }
        if (images.length > 4) images = images.slice(0, 4);

        let API_KEY = process.env.GEMINI_API_KEY;
        if (accessCode) {
            const validAccessCode = process.env.ACCESS_CODE;
            if (accessCode !== validAccessCode) {
                return res.status(401).json({ error: '접근 코드가 올바르지 않습니다' });
            }
        } else if (userApiKey) {
            API_KEY = userApiKey;
        }
        if (!API_KEY) return res.status(500).json({ error: 'API key not configured' });

        const imageParts = images.map(img => ({
            inline_data: {
                mime_type: 'image/jpeg',
                data: img.replace(/^data:image\/\w+;base64,/, '')
            }
        }));

        let promptText = '';

        if (analysisMode === 'character') {
            const styleHints = {
                minion: 'Minions/Despicable Me style, yellow round cute character, goggles, overalls, playful and mischievous',
                chibi: 'Chibi/SD style, super deformed proportions, big head small body, cute kawaii',
                anime: 'Japanese anime style, expressive eyes, dynamic pose, vibrant colors',
                pixar: 'Pixar/Disney 3D style, high quality 3D render, soft lighting, family friendly',
                webtoon: 'Korean webtoon style, clean lines, soft shading, modern digital art',
                minimal: 'Minimal icon style, simple shapes, flat design, clean lines'
            };
            const typeHints = {
                human: 'human character design',
                animal: 'anthropomorphic animal character, cute animal features',
                fantasy: 'fantasy creature, magical elements, ethereal',
                robot: 'cute robot character, mechanical design, friendly appearance'
            };
            const bgHints = {
                transparent: 'solid white background, clean backdrop, isolated character',
                gradient: 'soft gradient background, pastel colors, subtle glow',
                themed: 'themed environment background matching character personality'
            };

            promptText = `이 이미지는 "내 안의 빌런을 찾아라!" 워크지입니다.

## 사용자 선택 스타일 옵션:
- **캐릭터 스타일**: ${characterStyle} (${styleHints[characterStyle] || styleHints.minion})
- **캐릭터 형태**: ${characterType} (${typeHints[characterType] || typeHints.human})
- **배경 타입**: ${backgroundType} (${bgHints[backgroundType] || bgHints.transparent})

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

워크지에서 다음 정보를 추출하고, **위의 선택된 스타일 옵션을 반드시 반영하여** Imagen용 캐릭터 이미지 생성 프롬프트를 만들어주세요.

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
[추출된 정보 요약 - 3-5줄로 간단히. 캐릭터명, MBTI, 주요 특성 포함]

**이미지 생성 프롬프트:**
[영어로 작성된 Imagen 프롬프트. 반드시 아래 요소를 포함:
- 사용자가 선택한 캐릭터 스타일 (${styleHints[characterStyle] || styleHints.minion})
- 사용자가 선택한 캐릭터 형태 (${typeHints[characterType] || typeHints.human})
- 시그니처 컬러 반영 (워크지에서 추출)
- 성격과 특성을 반영한 표정/포즈
- 사용자가 선택한 배경 스타일 (${bgHints[backgroundType] || bgHints.transparent})
- high quality, detailed illustration
- **중요: 이미지에 텍스트, 글자, 문자, 로고가 절대 포함되지 않도록 "no text, no letters, no words, no typography, no logo, no watermark" 반드시 포함**]

프롬프트는 반드시 영어로, 쉼표로 구분된 키워드 형태로 작성해주세요.
${characterStyle === 'minion' ? '예시: "Minions style character, yellow round body, goggles, blue overalls, cute mischievous expression, holding banana, white clean background, Despicable Me animation style, high quality 3D render, no text, no letters, no words, no typography"' : '예시: "3D cartoon character, cute design, vibrant colors, expressive face, dynamic pose, clean background, high quality render, no text, no letters, no words"'}`;

        } else if (analysisMode === 'video') {
            const platformName = platform === 'kling' ? 'Kling AI' : 'Runway Gen-3';
            promptText = `이 이미지는 AI가 생성한 캐릭터 이미지입니다.
${originalPrompt ? `원본 이미지 생성 프롬프트: ${originalPrompt}` : ''}

이 캐릭터 이미지를 **${platformName}**에서 사용할 수 있는 **영상화 프롬프트**로 변환해주세요.

## 요청사항:
1. 이미지의 캐릭터, 스타일, 분위기를 분석
2. ${platformName}에 최적화된 3-5가지 움직임/애니메이션 옵션 제안
3. 각 옵션에 대한 영어 프롬프트 제공

## 출력 형식:

**캐릭터 분석:**
[캐릭터의 특징, 스타일, 분위기 간단 분석 - 2-3줄]

**${platformName} 영상화 프롬프트:**

1. **인트로 모션** (캐릭터 등장)
[영어 프롬프트]

2. **아이들 모션** (자연스러운 움직임)
[영어 프롬프트]

3. **인터랙션 모션** (특정 동작)
[영어 프롬프트]

4. **루프 모션** (반복 가능한 움직임)
[영어 프롬프트]

5. **시네마틱 모션** (영화같은 연출)
[영어 프롬프트]

각 프롬프트는 ${platformName}에 바로 복사해서 사용할 수 있도록 영어로 간결하게 작성해주세요.
${platform === 'kling' ? '참고: Kling AI는 카메라 무브먼트와 캐릭터 모션을 잘 처리합니다.' : '참고: Runway Gen-3는 일관된 스타일 유지를 잘 합니다.'}`;

        } else {
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

        const parts = [{ text: promptText }, ...imageParts];

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts }],
                    generationConfig: { temperature: 0.7, maxOutputTokens: 2000 }
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API Error:', errorData);
            return res.status(500).json({ error: 'Gemini API error', details: errorData });
        }

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        if (analysisMode === 'character') {
            const analysisMatch = generatedText.match(/분석 결과[：:\s]*([\s\S]*?)(?=이미지 생성 프롬프트|$)/i);
            const promptMatch = generatedText.match(/이미지 생성 프롬프트[：:\s]*([\s\S]*?)$/i);
            const analysis = analysisMatch ? analysisMatch[1].trim() : generatedText.substring(0, 500);
            let imagePrompt = promptMatch ? promptMatch[1].trim() : '';
            imagePrompt = imagePrompt.replace(/```[\s\S]*?```/g, '').replace(/\*\*/g, '').trim();
            if (!imagePrompt || imagePrompt.length < 20) {
                imagePrompt = "3D cartoon character, cute friendly design, vibrant colors, expressive face, dynamic pose, minimal clean background, Pixar Disney style, high quality render, soft lighting";
            }
            return res.status(200).json({ success: true, analysis, imagePrompt, rawResponse: generatedText, mode: 'character' });

        } else if (analysisMode === 'video') {
            return res.status(200).json({ success: true, videoPrompt: generatedText, rawResponse: generatedText, mode: 'video' });

        } else {
            const keywordMatch = generatedText.match(/추출된 키워드[^:]*[:：]([^\n]+)/);
            const keywords = keywordMatch
                ? keywordMatch[1].split(/[,，、]/).map(k => k.trim().replace(/[#\-\*]/g, '')).filter(k => k)
                : ['창의적', '따뜻함', '전문성'];
            const websitePromptMatch = generatedText.match(/웹사이트 생성 프롬프트[^:]*[:：]\s*([\s\S]*?)$/i);
            const prompt = websitePromptMatch ? websitePromptMatch[1].trim() : generatedText;
            return res.status(200).json({ success: true, keywords: keywords.slice(0, 7), prompt: prompt || generatedText, rawResponse: generatedText, imageCount: images.length, mode: 'website' });
        }
    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}

// ─── analyze-ebook ───
async function handleAnalyzeEbook(req, res) {
    try {
        const { images } = req.body;
        if (!images || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ error: 'images array is required' });
        }
        const API_KEY = process.env.GEMINI_API_KEY;
        if (!API_KEY) return res.status(500).json({ error: 'API key not configured' });

        const imageParts = images.map(img => ({ inlineData: { data: img.data, mimeType: img.mimeType } }));

        const promptText = `당신은 E-book 작가를 위한 전문 분석가입니다. 이 워크지 이미지에서 사용자가 직접 손으로 작성한 답변만 추출해주세요.

## 분석 지침:
- "*참고*", "예시", "작성 방법" 등 인쇄된 안내 문구는 무시하세요
- 오직 사용자가 필기한 내용(손글씨, 타이핑된 개인 답변)에만 집중하세요
- 빈칸에 작성된 답변, 메모, 개인적인 생각을 추출하세요

## 응답 형식 (E-book 집필용):

1. **나의 이야기 핵심**: (사용자가 작성한 내용에서 가장 중요한 메시지 한 문장)

2. **책의 소재들**:
   - 경험/에피소드: (사용자가 언급한 구체적인 경험들)
   - 가치관/신념: (사용자가 표현한 믿음이나 가치)
   - 감정/깨달음: (사용자가 느낀 감정이나 인사이트)

3. **E-book 방향 제안**:
   - 추천 장르: (자기계발, 에세이, 자서전 등)
   - 타겟 독자: (이 이야기가 공감될 독자층)
   - 서술 톤: (진솔한, 유머러스한, 성찰적인 등)

4. **원본 필기 내용**: (사용자가 작성한 내용을 있는 그대로 정리)

이미지가 흐리더라도 손글씨 내용을 최대한 해독해주세요.`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [...imageParts, { text: promptText }] }] })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(500).json({ error: 'Gemini API error', details: errorData });
        }
        return res.status(200).json(await response.json());
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}

// ─── enneagram-report ───
async function handleEnneagramReport(req, res) {
    try {
        const { scores, userName, userAge, userGender } = req.body;
        if (!scores || Object.keys(scores).length !== 9) {
            return res.status(400).json({ error: 'Invalid scores data' });
        }
        const API_KEY = process.env.GEMINI_API_KEY;
        if (!API_KEY) return res.status(500).json({ error: 'API key not configured' });

        const sortedTypes = Object.entries(scores).sort((a, b) => b[1] - a[1]).map(([type, score]) => ({ type: parseInt(type), score }));
        const mainType = sortedTypes[0], secondType = sortedTypes[1], thirdType = sortedTypes[2], lowestType = sortedTypes[8];

        const typeNames = { 1:"완벽주의자 (The Reformer)",2:"돕는 사람 (The Helper)",3:"성취자 (The Achiever)",4:"개인주의자 (The Individualist)",5:"탐구자 (The Investigator)",6:"충실한 사람 (The Loyalist)",7:"열정적인 사람 (The Enthusiast)",8:"도전자 (The Challenger)",9:"평화주의자 (The Peacemaker)" };
        const centerTypes = { head:[5,6,7], heart:[2,3,4], gut:[8,9,1] };
        const horneyGroups = { assertive:[3,7,8], compliant:[1,2,6], withdrawn:[4,5,9] };
        const harmonicGroups = { positive:[2,7,9], competency:[1,3,5], reactive:[4,6,8] };
        const growthDirections = { 1:{growth:7,stress:4},2:{growth:4,stress:8},3:{growth:6,stress:9},4:{growth:1,stress:2},5:{growth:8,stress:7},6:{growth:9,stress:3},7:{growth:5,stress:1},8:{growth:2,stress:5},9:{growth:3,stress:6} };

        const leftWing = mainType.type === 1 ? 9 : mainType.type - 1;
        const rightWing = mainType.type === 9 ? 1 : mainType.type + 1;
        const dominantWing = scores[leftWing] >= scores[rightWing] ? leftWing : rightWing;

        const getCenter = (t) => centerTypes.head.includes(t) ? '머리 중심 (사고형)' : centerTypes.heart.includes(t) ? '가슴 중심 (감정형)' : '장 중심 (본능형)';
        const getHorneyGroup = (t) => horneyGroups.assertive.includes(t) ? '자기주장형 (Assertive)' : horneyGroups.compliant.includes(t) ? '순응형 (Compliant)' : '위축형 (Withdrawn)';
        const getHarmonicGroup = (t) => harmonicGroups.positive.includes(t) ? '긍정적 관점 그룹' : harmonicGroups.competency.includes(t) ? '유능함 그룹' : '반응형 그룹';

        const growth = growthDirections[mainType.type];

        const prompt = `당신은 20년 경력의 성격유형 전문 상담사이자 심리학자입니다.
내담자의 EPTI(성격유형 검사) 결과를 바탕으로 **전문적이고 깊이 있는 심층 분석 리포트**를 작성해주세요.

## 내담자 정보
- 이름: ${userName || '익명'}
${userAge ? `- 나이: ${userAge}세` : ''}
${userGender ? `- 성별: ${userGender}` : ''}

## 검사 결과 (45점 만점)
${sortedTypes.map((t, i) => `${i + 1}. ${t.type}유형 ${typeNames[t.type]}: ${t.score}점`).join('\n')}

## 핵심 분석 데이터
- **주유형**: ${mainType.type}유형 ${typeNames[mainType.type]} (${mainType.score}점)
- **보조유형**: ${secondType.type}유형 (${secondType.score}점)
- **제3유형**: ${thirdType.type}유형 (${thirdType.score}점)
- **가장 낮은 유형**: ${lowestType.type}유형 (${lowestType.score}점)

## 날개 분석
- **왼쪽 날개**: ${leftWing}유형 (${scores[leftWing]}점)
- **오른쪽 날개**: ${rightWing}유형 (${scores[rightWing]}점)
- **우세 날개**: ${dominantWing}w (${mainType.type}w${dominantWing})

## 중심 에너지 & 그룹 분류
- **중심 에너지**: ${getCenter(mainType.type)}
- **대인관계 스타일**: ${getHorneyGroup(mainType.type)}
- **갈등 대처 스타일**: ${getHarmonicGroup(mainType.type)}

## 성장/퇴행 방향
- **성장 방향 (통합)**: ${growth.growth}유형 ${typeNames[growth.growth]}
- **스트레스 방향 (분열)**: ${growth.stress}유형 ${typeNames[growth.stress]}

---

## 리포트 작성 가이드라인

**어조**: 따뜻하면서도 전문적인 컨설턴트의 어조.

**리포트 구조** (10개 섹션, 전체 3000-4000자):
## 1. 핵심 유형 프로필 (300-350자)
## 2. 날개 분석: ${mainType.type}w${dominantWing} (250-300자)
## 3. 중심 에너지 (300-350자)
## 4. 대인관계 스타일 (250-300자)
## 5. 갈등 대처 스타일 (200-250자)
## 6. 성장 방향: ${growth.growth}유형으로의 통합 (350-400자)
## 7. 스트레스 방향: ${growth.stress}유형으로의 분열 (300-350자)
## 8. 내면 성장 로드맵 (400-450자)
## 9. 관계 가이드 (250-300자)
## 10. 자아 탐색 (300-350자)

**마무리 메시지** (100-150자)

## 중요 지침
1. "애니어그램"이라는 단어 사용 금지 (대신 "성격유형", "EPTI" 사용)
2. 일상적 언어 사용
3. "~일 수 있습니다" 같은 가능성 표현
4. 비난이나 부정적 판단 없이 중립적/긍정적 서술
5. 각 섹션은 ## 헤딩으로 구분
6. 문장 완결성 필수
7. 내면의 변화, 자기 인식, 자아 수용, 정체성 탐색에 중점`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.8, maxOutputTokens: 8000 } })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(500).json({ error: 'AI 리포트 생성 실패', details: errorData });
        }

        const data = await response.json();
        const report = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        return res.status(200).json({
            success: true, report,
            summary: { mainType, secondType, thirdType, lowestType, dominantWing, center: getCenter(mainType.type), horneyGroup: getHorneyGroup(mainType.type), harmonicGroup: getHarmonicGroup(mainType.type), growthDirection: growth.growth, stressDirection: growth.stress, allScores: scores }
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}

// ─── generate-ebook-pdf ───
async function handleGenerateEbookPdf(req, res) {
    try {
        const { title, subtitle, author, topic, chapterCount = 5, includePreface, prefaceText, includeEpilogue, includeAuthorBio } = req.body;
        if (!title || !author || !topic) return res.status(400).json({ error: 'title, author, topic are required' });

        const API_KEY = process.env.GEMINI_API_KEY;
        if (!API_KEY) return res.status(500).json({ error: 'API key not configured' });

        const promptText = `당신은 에세이와 수필 전문 작가입니다. 아래 정보를 바탕으로 개인의 이야기를 담은 전자책을 작성해주세요.

## 책 정보
- 제목: ${title}
${subtitle ? `- 부제: ${subtitle}` : ''}
- 저자: ${author}
- 주제/내용: ${topic}
- 챕터 수: ${chapterCount}개

## 요청 사항

아래 JSON 형식으로 정확하게 출력해주세요. 다른 텍스트 없이 JSON만 출력하세요.

{
  "preface": "${includePreface && !prefaceText ? '서문 내용 (1000-1500자)' : ''}",
  "chapters": [
    { "title": "챕터 제목", "content": "챕터 본문 (4000-5000자)" }
  ],
  "epilogue": "${includeEpilogue ? '에필로그 (1000-1500자)' : ''}",
  "authorBio": "${includeAuthorBio ? '저자 소개 (300-500자)' : ''}"
}

## 작성 지침
1. 각 챕터는 반드시 4000자 이상
2. 에세이/수필 형식, 1인칭 시점
3. 구체적인 장면, 대화, 감정, 오감 활용
4. 따뜻하고 친근한 문체
5. 반드시 유효한 JSON, 줄바꿈은 \\n으로

${includePreface && prefaceText ? `서문은 다음 내용을 기반으로 확장: "${prefaceText}"` : ''}`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }], generationConfig: { temperature: 0.8, maxOutputTokens: 32000 } })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(500).json({ error: 'Gemini API error', details: errorData });
        }

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        let ebookData;
        try {
            let jsonText = generatedText;
            const jsonMatch = generatedText.match(/```json\s*([\s\S]*?)\s*```/);
            if (jsonMatch) { jsonText = jsonMatch[1]; }
            else {
                const si = generatedText.indexOf('{'), ei = generatedText.lastIndexOf('}');
                if (si !== -1 && ei !== -1) jsonText = generatedText.substring(si, ei + 1);
            }
            ebookData = JSON.parse(jsonText);
        } catch {
            ebookData = {
                preface: includePreface ? "이 책은 독자 여러분의 성장을 위해 작성되었습니다." : "",
                chapters: Array.from({ length: chapterCount }, (_, i) => ({ title: `Chapter ${i + 1}`, content: `챕터 ${i + 1} - 다시 시도해주세요.` })),
                epilogue: includeEpilogue ? "끝까지 읽어주셔서 감사합니다." : "",
                authorBio: includeAuthorBio ? `${author}은(는) 이 책의 저자입니다.` : ""
            };
        }
        if (includePreface && prefaceText) ebookData.preface = prefaceText;

        return res.status(200).json({ success: true, ...ebookData });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}
