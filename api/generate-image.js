// Google AI Studio Imagen 3 이미지 생성 API
// Gemini API 키로 Imagen 3 모델 사용 (Google AI Studio)

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
        const { prompt, aspectRatio, apiKey } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: '프롬프트가 필요합니다' });
        }

        if (!apiKey) {
            return res.status(400).json({ error: 'API 키가 필요합니다' });
        }

        // Google AI Studio Imagen 3 API 엔드포인트
        // 참고: https://ai.google.dev/gemini-api/docs/imagen
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

        const requestBody = {
            instances: [
                {
                    prompt: prompt
                }
            ],
            parameters: {
                sampleCount: 1,
                aspectRatio: aspectRatio || '1:1',
                // 안전 필터 설정
                safetyFilterLevel: 'BLOCK_MEDIUM_AND_ABOVE',
                // 사람 생성 허용
                personGeneration: 'ALLOW_ADULT'
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
            console.error('Imagen API error:', result);

            let errorMessage = '이미지 생성에 실패했습니다';

            if (result.error) {
                if (result.error.message) {
                    errorMessage = result.error.message;
                }
                if (result.error.status === 'INVALID_ARGUMENT') {
                    errorMessage = '잘못된 요청입니다. 프롬프트를 확인해주세요.';
                }
                if (result.error.status === 'PERMISSION_DENIED') {
                    errorMessage = 'API 키가 유효하지 않거나 Imagen 접근 권한이 없습니다.';
                }
                if (result.error.status === 'RESOURCE_EXHAUSTED') {
                    errorMessage = 'API 요청 한도를 초과했습니다. 잠시 후 다시 시도하세요.';
                }
                // Imagen이 아직 API 키로 지원되지 않는 경우
                if (result.error.message && result.error.message.includes('not found')) {
                    errorMessage = 'Imagen 3 API는 현재 Google AI Studio에서 제한적으로 지원됩니다. Vertex AI를 사용해주세요.';
                }
            }

            return res.status(response.status || 500).json({ error: errorMessage });
        }

        // 응답에서 이미지 추출
        if (result.predictions && result.predictions.length > 0) {
            const prediction = result.predictions[0];

            // base64 인코딩된 이미지
            if (prediction.bytesBase64Encoded) {
                const imageUrl = `data:image/png;base64,${prediction.bytesBase64Encoded}`;
                return res.status(200).json({
                    success: true,
                    imageUrl: imageUrl,
                    mimeType: 'image/png'
                });
            }

            // 이미지 URL이 직접 반환된 경우
            if (prediction.image) {
                return res.status(200).json({
                    success: true,
                    imageUrl: prediction.image
                });
            }
        }

        // Gemini의 generateContent 형식 응답 처리 (대체 방식)
        if (result.candidates && result.candidates.length > 0) {
            const candidate = result.candidates[0];
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    if (part.inlineData) {
                        const imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                        return res.status(200).json({
                            success: true,
                            imageUrl: imageUrl,
                            mimeType: part.inlineData.mimeType
                        });
                    }
                }
            }
        }

        return res.status(500).json({ error: '이미지 데이터를 파싱할 수 없습니다' });

    } catch (error) {
        console.error('Error generating image:', error);
        return res.status(500).json({
            error: '이미지 생성 중 오류가 발생했습니다',
            details: error.message
        });
    }
}
