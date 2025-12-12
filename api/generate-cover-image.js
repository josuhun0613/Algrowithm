// Vercel Serverless Function - AI 표지 이미지 생성 (Gemini 2.5 Flash Image)
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
        const { title, subtitle, hint, topic } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'title is required' });
        }

        const API_KEY = process.env.GEMINI_API_KEY;

        if (!API_KEY) {
            return res.status(500).json({ error: 'API key not configured' });
        }

        // 표지 이미지 생성 프롬프트
        const promptText = `Create a professional e-book cover image with the following specifications:

**Book Information:**
- Title: "${title}"
${subtitle ? `- Subtitle: "${subtitle}"` : ''}
${topic ? `- Topic/Theme: "${topic}"` : ''}
${hint ? `- Style Hint: "${hint}"` : ''}

**Design Requirements:**
1. Create a vertical book cover (2:3 aspect ratio, 800x1200 pixels)
2. Professional, clean, and modern design
3. Use sophisticated color palette
4. Include subtle decorative elements that match the book's theme
5. Leave appropriate space for title and author name (but do NOT include any text in the image)
6. The design should evoke emotion and curiosity
7. High-quality, publication-ready aesthetic

**Style Guidelines:**
- Minimalist and elegant
- Korean publishing aesthetic (clean, refined)
- Suitable for both digital and print
- No text, logos, or words in the image

Generate ONLY the background/decorative design for the book cover. The title and author text will be overlaid separately.`;

        // Gemini 2.5 Flash (이미지 생성 지원 모델) API 호출
        // 참고: gemini-2.0-flash-exp-image-generation 또는 imagen 모델 사용
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: promptText }]
                        }
                    ],
                    generationConfig: {
                        responseModalities: ["image", "text"],
                        responseMimeType: "image/png"
                    }
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API Error:', errorData);

            // 이미지 생성이 지원되지 않는 경우 대체 응답
            if (errorData.error?.message?.includes('not supported')) {
                return res.status(200).json({
                    success: false,
                    error: 'Image generation not supported',
                    fallback: true,
                    suggestion: '현재 Gemini API에서 이미지 생성이 지원되지 않습니다. 그라데이션 또는 패턴 표지를 사용해주세요.'
                });
            }

            return res.status(500).json({ error: 'Gemini API error', details: errorData });
        }

        const data = await response.json();

        // 응답에서 이미지 데이터 추출
        const candidates = data.candidates || [];
        let imageData = null;

        for (const candidate of candidates) {
            const parts = candidate.content?.parts || [];
            for (const part of parts) {
                if (part.inlineData?.mimeType?.startsWith('image/')) {
                    imageData = part.inlineData;
                    break;
                }
            }
            if (imageData) break;
        }

        if (imageData) {
            // Base64 이미지 데이터를 data URL로 변환
            const imageUrl = `data:${imageData.mimeType};base64,${imageData.data}`;

            return res.status(200).json({
                success: true,
                imageUrl: imageUrl,
                mimeType: imageData.mimeType
            });
        } else {
            // 이미지가 생성되지 않은 경우
            return res.status(200).json({
                success: false,
                error: 'No image generated',
                fallback: true,
                suggestion: 'AI가 이미지를 생성하지 못했습니다. 다른 스타일 힌트를 시도하거나 그라데이션 표지를 사용해주세요.',
                rawResponse: data
            });
        }

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}
