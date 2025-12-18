// Gemini 2.0 Flash 이미지 생성 API
// Gemini API 키로 이미지 생성 (Google AI Studio)

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
        const { prompt, aspectRatio, apiKey, accessCode, testOnly } = req.body;

        // 접근 코드 검증만 하는 경우
        if (testOnly && accessCode) {
            const serverAccessCode = process.env.IMAGE_ACCESS_CODE;
            if (accessCode === serverAccessCode) {
                return res.status(200).json({ success: true, message: '접근 코드가 확인되었습니다' });
            } else {
                return res.status(401).json({ error: '접근 코드가 올바르지 않습니다' });
            }
        }

        if (!prompt) {
            return res.status(400).json({ error: '프롬프트가 필요합니다' });
        }

        // API 키 결정: 암호가 맞으면 서버 키 사용, 아니면 사용자 키 사용
        let finalApiKey = apiKey;

        if (accessCode) {
            // 환경변수에서 암호와 API 키 가져오기
            const serverAccessCode = process.env.IMAGE_ACCESS_CODE;
            const serverApiKey = process.env.GEMINI_API_KEY;

            if (accessCode === serverAccessCode && serverApiKey) {
                finalApiKey = serverApiKey;
            } else if (accessCode !== serverAccessCode) {
                return res.status(401).json({ error: '접근 코드가 올바르지 않습니다' });
            }
        }

        if (!finalApiKey) {
            return res.status(400).json({ error: 'API 키 또는 접근 코드가 필요합니다' });
        }

        // 비율에 따른 안내 추가
        let aspectGuide = '';
        if (aspectRatio === '16:9') {
            aspectGuide = 'wide landscape format (16:9 aspect ratio)';
        } else if (aspectRatio === '9:16') {
            aspectGuide = 'tall portrait format (9:16 aspect ratio)';
        } else if (aspectRatio === '4:3') {
            aspectGuide = 'standard landscape format (4:3 aspect ratio)';
        } else {
            aspectGuide = 'square format (1:1 aspect ratio)';
        }

        // Gemini 2.0 Flash Experimental 이미지 생성 엔드포인트
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${finalApiKey}`;

        const requestBody = {
            contents: [{
                parts: [{
                    text: `Generate a high-quality image: ${prompt}. The image should be in ${aspectGuide}. Only generate the image, no text response needed.`
                }]
            }],
            generationConfig: {
                responseModalities: ["image", "text"],
                responseMimeType: "text/plain"
            }
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Gemini API error:', result);

            let errorMessage = '이미지 생성에 실패했습니다';

            if (result.error) {
                if (result.error.message) {
                    errorMessage = result.error.message;
                }
                if (result.error.status === 'INVALID_ARGUMENT') {
                    errorMessage = '잘못된 요청입니다. 프롬프트를 확인해주세요.';
                }
                if (result.error.status === 'PERMISSION_DENIED') {
                    errorMessage = 'API 키가 유효하지 않습니다.';
                }
                if (result.error.status === 'RESOURCE_EXHAUSTED') {
                    errorMessage = 'API 요청 한도를 초과했습니다. 잠시 후 다시 시도하세요.';
                }
            }

            return res.status(response.status || 500).json({ error: errorMessage });
        }

        // Gemini 응답에서 이미지 추출
        if (result.candidates && result.candidates.length > 0) {
            const candidate = result.candidates[0];
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    // 인라인 이미지 데이터
                    if (part.inlineData) {
                        const imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                        return res.status(200).json({
                            success: true,
                            imageUrl: imageUrl,
                            mimeType: part.inlineData.mimeType
                        });
                    }
                }

                // 이미지가 없으면 텍스트 응답 확인
                for (const part of candidate.content.parts) {
                    if (part.text) {
                        // 이미지 생성이 거부된 경우
                        if (part.text.includes('cannot') || part.text.includes('sorry') || part.text.includes('unable')) {
                            return res.status(400).json({
                                error: '이 프롬프트로는 이미지를 생성할 수 없습니다. 다른 설명을 시도해주세요.'
                            });
                        }
                    }
                }
            }
        }

        // 안전 필터로 차단된 경우
        if (result.candidates && result.candidates[0]?.finishReason === 'SAFETY') {
            return res.status(400).json({
                error: '안전 정책으로 인해 이미지를 생성할 수 없습니다. 다른 프롬프트를 시도해주세요.'
            });
        }

        return res.status(500).json({ error: '이미지를 생성할 수 없습니다. 다른 프롬프트를 시도해주세요.' });

    } catch (error) {
        console.error('Error generating image:', error);
        return res.status(500).json({
            error: '이미지 생성 중 오류가 발생했습니다',
            details: error.message
        });
    }
}
