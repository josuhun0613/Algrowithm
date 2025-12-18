// Vertex AI Imagen 3 이미지 생성 API
// Google Cloud Vertex AI를 통해 Imagen 3 모델로 이미지 생성

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

        // Aspect ratio를 Imagen 3 형식으로 변환
        const aspectRatioMap = {
            '1:1': '1:1',
            '16:9': '16:9',
            '9:16': '9:16',
            '4:3': '4:3',
            '3:4': '3:4'
        };

        const imagenAspectRatio = aspectRatioMap[aspectRatio] || '1:1';

        // Google Cloud 프로젝트 설정
        const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || 'your-project-id';
        const location = 'us-central1';

        // Vertex AI Imagen 3 API 엔드포인트
        const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/imagen-3.0-generate-001:predict`;

        const requestBody = {
            instances: [
                {
                    prompt: prompt
                }
            ],
            parameters: {
                sampleCount: 1,
                aspectRatio: imagenAspectRatio,
                safetyFilterLevel: 'block_some',
                personGeneration: 'allow_adult',
                // 이미지 품질 설정
                addWatermark: false
            }
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Vertex AI error:', result);

            // 에러 메시지 파싱
            let errorMessage = '이미지 생성에 실패했습니다';
            if (result.error) {
                if (result.error.message) {
                    errorMessage = result.error.message;
                }
                if (result.error.code === 401) {
                    errorMessage = 'API 키가 유효하지 않습니다';
                }
                if (result.error.code === 403) {
                    errorMessage = 'API 접근 권한이 없습니다. Google Cloud 프로젝트 설정을 확인하세요';
                }
                if (result.error.code === 429) {
                    errorMessage = 'API 요청 한도를 초과했습니다. 잠시 후 다시 시도하세요';
                }
            }

            return res.status(response.status).json({ error: errorMessage });
        }

        // 응답에서 이미지 추출
        if (!result.predictions || result.predictions.length === 0) {
            return res.status(500).json({ error: '이미지 생성 결과가 없습니다' });
        }

        const prediction = result.predictions[0];

        // Imagen 3는 base64 인코딩된 이미지를 반환
        if (prediction.bytesBase64Encoded) {
            const imageBase64 = prediction.bytesBase64Encoded;
            const imageUrl = `data:image/png;base64,${imageBase64}`;

            return res.status(200).json({
                success: true,
                imageUrl: imageUrl,
                mimeType: prediction.mimeType || 'image/png'
            });
        }

        // 대체: GCS URI가 반환된 경우
        if (prediction.gcsUri) {
            return res.status(200).json({
                success: true,
                imageUrl: prediction.gcsUri
            });
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
