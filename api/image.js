// 통합 이미지 생성 API — Imagen 4 + Gemini 표지 생성
// type: 'imagen' (기본) | 'cover'

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { type } = req.body;
    if (type === 'cover') return handleCoverImage(req, res);
    return handleImagen(req, res);
}

// ─── Imagen 4 이미지 생성 ───
async function handleImagen(req, res) {
    try {
        const { prompt, aspectRatio, apiKey, accessCode, testOnly } = req.body;

        if (testOnly && accessCode) {
            const serverAccessCode = process.env.IMAGE_ACCESS_CODE;
            if (accessCode === serverAccessCode) return res.status(200).json({ success: true, message: '접근 코드가 확인되었습니다' });
            return res.status(401).json({ error: '접근 코드가 올바르지 않습니다' });
        }

        if (!prompt) return res.status(400).json({ error: '프롬프트가 필요합니다' });

        let finalApiKey = process.env.GEMINI_API_KEY;
        if (accessCode) {
            if (accessCode !== process.env.IMAGE_ACCESS_CODE) return res.status(401).json({ error: '접근 코드가 올바르지 않습니다' });
        } else if (apiKey) {
            finalApiKey = apiKey;
        }
        if (!finalApiKey) return res.status(400).json({ error: 'API 키가 설정되지 않았습니다' });

        const ratioMap = { '16:9': '16:9', '9:16': '9:16', '4:3': '4:3', '3:4': '3:4' };
        const imagenAspectRatio = ratioMap[aspectRatio] || '1:1';

        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': finalApiKey },
            body: JSON.stringify({ instances: [{ prompt }], parameters: { sampleCount: 1, aspectRatio: imagenAspectRatio } })
        });

        const result = await response.json();
        if (!response.ok) {
            let errorMessage = '이미지 생성에 실패했습니다';
            if (result.error) {
                if (result.error.status === 'INVALID_ARGUMENT') errorMessage = '잘못된 요청입니다. 프롬프트를 확인해주세요.';
                else if (result.error.status === 'PERMISSION_DENIED') errorMessage = 'API 키가 유효하지 않거나 Imagen 4 접근 권한이 없습니다.';
                else if (result.error.status === 'RESOURCE_EXHAUSTED') errorMessage = 'API 요청 한도를 초과했습니다.';
                else if (result.error.message) errorMessage = result.error.message;
            }
            return res.status(response.status || 500).json({ error: errorMessage });
        }

        if (result.predictions?.[0]?.bytesBase64Encoded) {
            return res.status(200).json({ success: true, imageUrl: `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`, mimeType: 'image/png', model: 'imagen-4.0-generate-001' });
        }
        if (result.predictions?.length === 0) return res.status(400).json({ error: '안전 정책으로 인해 이미지를 생성할 수 없습니다.' });
        return res.status(500).json({ error: '이미지를 생성할 수 없습니다.' });
    } catch (error) {
        return res.status(500).json({ error: '이미지 생성 중 오류가 발생했습니다', details: error.message });
    }
}

// ─── Gemini 표지 이미지 생성 ───
async function handleCoverImage(req, res) {
    try {
        const { title, subtitle, hint, topic } = req.body;
        if (!title) return res.status(400).json({ error: 'title is required' });

        const API_KEY = process.env.GEMINI_API_KEY;
        if (!API_KEY) return res.status(500).json({ error: 'API key not configured' });

        const promptText = `Create a professional e-book cover image with the following specifications:

**Book Information:**
- Title: "${title}"
${subtitle ? `- Subtitle: "${subtitle}"` : ''}
${topic ? `- Topic/Theme: "${topic}"` : ''}
${hint ? `- Style Hint: "${hint}"` : ''}

**Design Requirements:**
1. Vertical book cover (2:3 aspect ratio, 800x1200 pixels)
2. Professional, clean, and modern design
3. Sophisticated color palette
4. No text, logos, or words in the image
5. Minimalist and elegant, Korean publishing aesthetic

Generate ONLY the background/decorative design for the book cover.`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }],
                    generationConfig: { responseModalities: ["image", "text"], responseMimeType: "image/png" }
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            if (errorData.error?.message?.includes('not supported')) {
                return res.status(200).json({ success: false, error: 'Image generation not supported', fallback: true, suggestion: '그라데이션 또는 패턴 표지를 사용해주세요.' });
            }
            return res.status(500).json({ error: 'Gemini API error', details: errorData });
        }

        const data = await response.json();
        let imageData = null;
        for (const candidate of (data.candidates || [])) {
            for (const part of (candidate.content?.parts || [])) {
                if (part.inlineData?.mimeType?.startsWith('image/')) { imageData = part.inlineData; break; }
            }
            if (imageData) break;
        }

        if (imageData) return res.status(200).json({ success: true, imageUrl: `data:${imageData.mimeType};base64,${imageData.data}`, mimeType: imageData.mimeType });
        return res.status(200).json({ success: false, error: 'No image generated', fallback: true, suggestion: '다른 스타일 힌트를 시도해주세요.', rawResponse: data });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}
