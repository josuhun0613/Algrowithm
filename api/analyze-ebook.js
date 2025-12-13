// Vercel Serverless Function - E-book 워크지 분석을 위한 Gemini API 연동
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
        const { images } = req.body;

        if (!images || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ error: 'images array is required' });
        }

        const API_KEY = process.env.GEMINI_API_KEY;

        if (!API_KEY) {
            return res.status(500).json({ error: 'API key not configured' });
        }

        // 이미지 파트 구성
        const imageParts = images.map(img => ({
            inlineData: {
                data: img.data,
                mimeType: img.mimeType
            }
        }));

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

        // Gemini API 호출
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            ...imageParts,
                            { text: promptText }
                        ]
                    }]
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API Error:', errorData);
            return res.status(500).json({ error: 'Gemini API error', details: errorData });
        }

        const data = await response.json();

        return res.status(200).json(data);

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}
