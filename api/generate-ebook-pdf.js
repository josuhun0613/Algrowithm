// Vercel Serverless Function - E-book PDF 생성을 위한 Gemini API 연동
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
        const {
            title,
            subtitle,
            author,
            topic,
            chapterCount = 5,
            includePreface,
            prefaceText,
            includeEpilogue,
            includeAuthorBio
        } = req.body;

        if (!title || !author || !topic) {
            return res.status(400).json({ error: 'title, author, topic are required' });
        }

        const API_KEY = process.env.GEMINI_API_KEY;

        if (!API_KEY) {
            return res.status(500).json({ error: 'API key not configured' });
        }

        // E-book 생성 프롬프트
        const promptText = `당신은 전문 작가입니다. 아래 정보를 바탕으로 전자책의 내용을 작성해주세요.

## 책 정보
- 제목: ${title}
${subtitle ? `- 부제: ${subtitle}` : ''}
- 저자: ${author}
- 주제/내용: ${topic}
- 챕터 수: ${chapterCount}개

## 요청 사항

아래 JSON 형식으로 정확하게 출력해주세요. 다른 텍스트 없이 JSON만 출력하세요.

{
  "preface": "${includePreface && !prefaceText ? '서문 내용 (500-800자, 저자가 독자에게 전하는 진솔한 말)' : ''}",
  "chapters": [
    {
      "title": "챕터 1 제목",
      "content": "챕터 1 본문 내용 (2000-3000자, 구체적인 예시와 이야기 포함)"
    },
    {
      "title": "챕터 2 제목",
      "content": "챕터 2 본문 내용 (2000-3000자, 구체적인 예시와 이야기 포함)"
    }
    // ... ${chapterCount}개의 챕터
  ],
  "epilogue": "${includeEpilogue ? '에필로그 내용 (500-800자, 여운이 남는 마무리 글)' : ''}",
  "authorBio": "${includeAuthorBio ? '저자 소개 (200-300자)' : ''}"
}

## 작성 지침
1. 각 챕터는 최소 2000자 이상으로 풍부하게 작성해주세요.
2. 추상적인 설명보다 구체적인 예시, 일화, 경험담을 많이 포함해주세요.
3. 챕터 내에서 소주제를 나누어 내용을 체계적으로 구성해주세요.
4. 독자가 공감할 수 있는 생생한 묘사와 감정 표현을 담아주세요.
5. 각 챕터 끝에는 핵심 메시지나 독자에게 전하는 질문을 포함해주세요.
6. 한국어로 작성하고 자연스럽고 읽기 쉬운 문체를 사용해주세요.
7. JSON 형식이 유효하도록 특수문자를 적절히 이스케이프해주세요.

${includePreface && prefaceText ? `서문은 다음 내용을 기반으로 작성: "${prefaceText}"` : ''}`;

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
                            parts: [{ text: promptText }]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.8,
                        maxOutputTokens: 32000,
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
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // JSON 파싱 시도
        let ebookData;
        try {
            // JSON 블록 추출 (```json ... ``` 형식 처리)
            let jsonText = generatedText;
            const jsonMatch = generatedText.match(/```json\s*([\s\S]*?)\s*```/);
            if (jsonMatch) {
                jsonText = jsonMatch[1];
            } else {
                // 순수 JSON 찾기
                const startIndex = generatedText.indexOf('{');
                const endIndex = generatedText.lastIndexOf('}');
                if (startIndex !== -1 && endIndex !== -1) {
                    jsonText = generatedText.substring(startIndex, endIndex + 1);
                }
            }

            ebookData = JSON.parse(jsonText);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.log('Raw response:', generatedText);

            // 파싱 실패 시 기본 구조 생성
            ebookData = {
                preface: includePreface ? "이 책은 독자 여러분의 성장을 위해 작성되었습니다." : "",
                chapters: Array.from({ length: chapterCount }, (_, i) => ({
                    title: `Chapter ${i + 1}`,
                    content: `챕터 ${i + 1}의 내용입니다. AI 응답을 파싱하는 데 문제가 발생했습니다. 다시 시도해주세요.`
                })),
                epilogue: includeEpilogue ? "끝까지 읽어주셔서 감사합니다." : "",
                authorBio: includeAuthorBio ? `${author}은(는) 이 책의 저자입니다.` : ""
            };
        }

        // 응답에 사용자 입력 서문이 있으면 사용
        if (includePreface && prefaceText) {
            ebookData.preface = prefaceText;
        }

        return res.status(200).json({
            success: true,
            ...ebookData
        });

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}
