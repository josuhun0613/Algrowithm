// Vercel Serverless Function - Gemini API 연동
// API 키는 Vercel 환경변수에 저장됨 (GEMINI_API_KEY)

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
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ error: 'Image is required' });
        }

        const API_KEY = process.env.GEMINI_API_KEY;

        if (!API_KEY) {
            return res.status(500).json({ error: 'API key not configured' });
        }

        // Base64 이미지에서 헤더 제거
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

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
                            parts: [
                                {
                                    text: `이 이미지는 "나만의 커리어 브랜딩 워크북 (3회차)"입니다.

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

# [요청 사항: 위 정보를 바탕으로 이렇게 작성해 주세요]

## 1. 페이지 구조 (Structure)
아래 섹션 순서대로 구체적인 **디자인 지시사항**과 **들어갈 텍스트**를 작성해 주세요.

**(1) 헤더 (Header)** - 로고와 메뉴 구성
**(2) 히어로 섹션 (Hero Section)** - 메인 카피와 비주얼
**(3) 특징/강점 섹션 (Features)** - 목표 3가지를 강점 카드로
**(4) 소개 및 신뢰도 (About/Proof)** - 롤모델 동경 이유 + 유산 편지 기반 자기소개
**(5) 경험 섹션 (Experience)** - 살아있음을 느낀 경험 3가지
**(6) 행동 유도 및 푸터 (CTA & Footer)** - CTA 버튼과 연락처

## 2. 인터랙션 및 디테일
- **반응형:** 모바일에서도 완벽하게 보이도록
- **모션:** 부드러운 호버 효과와 스크롤 애니메이션

## 3. 톤앤매너
- 모든 문구는 STEP 1 핵심 가치 키워드의 분위기에 맞는 말투로 통일
---

만약 손글씨가 잘 안 보이거나 비어있다면, 그 부분은 [미입력]으로 표시하고 합리적인 기본값으로 대체해주세요.`
                                },
                                {
                                    inline_data: {
                                        mime_type: 'image/jpeg',
                                        data: base64Data
                                    }
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1500,
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

        // 키워드 추출 (간단한 파싱)
        const keywordMatch = generatedText.match(/추출된 키워드[^:]*[:：]([^\n]+)/);
        const keywords = keywordMatch
            ? keywordMatch[1].split(/[,，、]/).map(k => k.trim().replace(/[#\-\*]/g, '')).filter(k => k)
            : ['창의적', '따뜻함', '전문성'];

        // 프롬프트 추출
        const promptMatch = generatedText.match(/웹사이트 생성 프롬프트[^:]*[:：]\s*([\s\S]*?)$/i);
        const prompt = promptMatch
            ? promptMatch[1].trim()
            : generatedText;

        return res.status(200).json({
            success: true,
            keywords: keywords.slice(0, 7),
            prompt: prompt || generatedText,
            rawResponse: generatedText
        });

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}
