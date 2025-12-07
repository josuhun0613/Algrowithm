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
                                    text: `이 이미지는 자기 브랜딩 워크지입니다. 워크지에 적힌 내용을 분석해서 다음 형식으로 정리해주세요:

1. **추출된 키워드** (5-7개): 워크지에서 발견한 핵심 키워드들
2. **브랜드 컬러**: 사용자가 선택한 색상 (없으면 내용에서 추론)
3. **핵심 특성**: 자기 이해 진단에서 발견된 주요 특성 3가지
4. **관계 속 이미지**: 타인이 보는 이미지와 되고 싶은 모습
5. **브랜드 문구**: 사용자가 적은 한 단어/문장

그리고 이 정보를 바탕으로 AI 화보 생성용 프롬프트를 만들어주세요:

---
**AI 화보 생성 프롬프트:**

[브랜드 컬러] 톤의 스튜디오 배경에서, [핵심 특성]의 분위기를 가진 사람의 프로필 화보.
[관계 속 이미지]의 느낌으로, [브랜드 문구]를 시각적으로 표현.
밝고 자연스러운 조명, 전문적이면서도 친근한 느낌의 고퀄리티 프로필 사진.
---

만약 워크지 내용이 잘 안 보이거나 비어있다면, 그 부분은 [미입력]으로 표시하고 기본값으로 대체해주세요.`
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
        const promptMatch = generatedText.match(/AI 화보 생성 프롬프트[^:]*[:：]\s*([\s\S]*?)(?:---|$)/i);
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
