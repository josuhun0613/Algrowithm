// Website Studio - Gemini API for code generation
// 접근 코드로 서버 API 키 사용

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
        const { message, codeContext, accessCode, testOnly } = req.body;

        // 접근 코드 검증만 하는 경우
        if (testOnly && accessCode) {
            const serverAccessCode = process.env.IMAGE_ACCESS_CODE; // 같은 접근 코드 사용
            if (accessCode === serverAccessCode) {
                return res.status(200).json({ success: true, message: '접근 코드가 확인되었습니다' });
            } else {
                return res.status(401).json({ error: '접근 코드가 올바르지 않습니다' });
            }
        }

        if (!message) {
            return res.status(400).json({ error: '메시지가 필요합니다' });
        }

        // 접근 코드 검증
        const serverAccessCode = process.env.IMAGE_ACCESS_CODE;
        const serverApiKey = process.env.GEMINI_API_KEY;

        if (!accessCode || accessCode !== serverAccessCode) {
            return res.status(401).json({ error: '접근 코드가 올바르지 않습니다' });
        }

        if (!serverApiKey) {
            return res.status(500).json({ error: '서버 API 키가 설정되지 않았습니다' });
        }

        // Build prompt
        const systemPrompt = `당신은 웹 개발 전문가입니다. 사용자의 요청에 따라 웹사이트 코드를 수정하거나 새로 작성해주세요.

중요 규칙:
1. 반드시 수정된 전체 코드를 제공해주세요
2. HTML, CSS, JavaScript 각각 별도의 코드 블록으로 제공해주세요
3. 코드 블록은 반드시 \`\`\`html, \`\`\`css, \`\`\`javascript 형식으로 시작해주세요
4. 한국어로 간단한 설명을 먼저 해주세요
5. 기존 코드의 스타일과 구조를 유지하면서 수정해주세요

${codeContext}`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${serverApiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: `${systemPrompt}\n\n사용자 요청: ${message}` }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 8192
                    }
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('Gemini API error:', data);
            let errorMessage = '코드 생성에 실패했습니다';

            if (data.error) {
                if (data.error.status === 'RESOURCE_EXHAUSTED') {
                    errorMessage = 'API 요청 한도를 초과했습니다. 잠시 후 다시 시도하세요.';
                } else if (data.error.message) {
                    errorMessage = data.error.message;
                }
            }

            return res.status(response.status || 500).json({ error: errorMessage });
        }

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            return res.status(200).json({
                success: true,
                response: data.candidates[0].content.parts[0].text
            });
        }

        return res.status(500).json({ error: '응답을 받지 못했습니다' });

    } catch (error) {
        console.error('Error generating code:', error);
        return res.status(500).json({
            error: '코드 생성 중 오류가 발생했습니다',
            details: error.message
        });
    }
}
