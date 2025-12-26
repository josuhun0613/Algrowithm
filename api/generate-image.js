// Imagen 4 이미지 생성 API
// Google Imagen 4 모델 사용 (최신 고품질 이미지 생성)

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

        // Imagen 4 지원 비율: "1:1", "3:4", "4:3", "9:16", "16:9"
        let imagenAspectRatio = '1:1';
        if (aspectRatio === '16:9') {
            imagenAspectRatio = '16:9';
        } else if (aspectRatio === '9:16') {
            imagenAspectRatio = '9:16';
        } else if (aspectRatio === '4:3') {
            imagenAspectRatio = '4:3';
        } else if (aspectRatio === '3:4') {
            imagenAspectRatio = '3:4';
        }

        // Imagen 4 엔드포인트
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict`;

        const requestBody = {
            instances: [{
                prompt: prompt
            }],
            parameters: {
                sampleCount: 1,
                aspectRatio: imagenAspectRatio
            }
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': finalApiKey
            },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Imagen 4 API error:', result);

            let errorMessage = '이미지 생성에 실패했습니다';

            if (result.error) {
                if (result.error.message) {
                    errorMessage = result.error.message;
                }
                if (result.error.status === 'INVALID_ARGUMENT') {
                    errorMessage = '잘못된 요청입니다. 프롬프트를 확인해주세요.';
                }
                if (result.error.status === 'PERMISSION_DENIED') {
                    errorMessage = 'API 키가 유효하지 않거나 Imagen 4 접근 권한이 없습니다.';
                }
                if (result.error.status === 'RESOURCE_EXHAUSTED') {
                    errorMessage = 'API 요청 한도를 초과했습니다. 잠시 후 다시 시도하세요.';
                }
            }

            return res.status(response.status || 500).json({ error: errorMessage });
        }

        // Imagen 4 응답에서 이미지 추출
        if (result.predictions && result.predictions.length > 0) {
            const prediction = result.predictions[0];

            // base64 이미지 데이터
            if (prediction.bytesBase64Encoded) {
                const imageUrl = `data:image/png;base64,${prediction.bytesBase64Encoded}`;
                return res.status(200).json({
                    success: true,
                    imageUrl: imageUrl,
                    mimeType: 'image/png',
                    model: 'imagen-4.0-generate-001'
                });
            }
        }

        // 안전 필터로 차단된 경우
        if (result.predictions && result.predictions.length === 0) {
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
