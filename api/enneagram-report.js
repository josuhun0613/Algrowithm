// Vercel Serverless Function - 애니어그램 AI 리포트 생성
// Gemini API를 사용하여 심층 분석 리포트 생성

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
        const { scores, userName, userAge, userGender } = req.body;

        if (!scores || Object.keys(scores).length !== 9) {
            return res.status(400).json({ error: 'Invalid scores data' });
        }

        const API_KEY = process.env.GEMINI_API_KEY;
        if (!API_KEY) {
            return res.status(500).json({ error: 'API key not configured' });
        }

        // 점수 순위 계산
        const sortedTypes = Object.entries(scores)
            .sort((a, b) => b[1] - a[1])
            .map(([type, score]) => ({ type: parseInt(type), score }));

        const mainType = sortedTypes[0];
        const secondType = sortedTypes[1];
        const thirdType = sortedTypes[2];
        const lowestType = sortedTypes[8];

        // 유형 정보
        const typeNames = {
            1: "완벽주의자 (The Reformer)",
            2: "돕는 사람 (The Helper)",
            3: "성취자 (The Achiever)",
            4: "개인주의자 (The Individualist)",
            5: "탐구자 (The Investigator)",
            6: "충실한 사람 (The Loyalist)",
            7: "열정적인 사람 (The Enthusiast)",
            8: "도전자 (The Challenger)",
            9: "평화주의자 (The Peacemaker)"
        };

        // 프롬프트 구성
        const prompt = `당신은 20년 경력의 애니어그램 전문 상담사이자 심리학자입니다.
내담자의 애니어그램 검사 결과를 바탕으로 **깊이 있고 공감 가는 심층 분석 리포트**를 작성해주세요.

## 내담자 정보
- 이름: ${userName || '익명'}
${userAge ? `- 나이: ${userAge}세` : ''}
${userGender ? `- 성별: ${userGender}` : ''}

## 검사 결과 (45점 만점)
${sortedTypes.map((t, i) => `${i + 1}. ${t.type}유형 ${typeNames[t.type]}: ${t.score}점`).join('\n')}

## 주요 분석 포인트
- **주유형**: ${mainType.type}유형 (${mainType.score}점)
- **보조유형**: ${secondType.type}유형 (${secondType.score}점)
- **제3유형**: ${thirdType.type}유형 (${thirdType.score}점)
- **가장 낮은 유형**: ${lowestType.type}유형 (${lowestType.score}점)
- **날개 가능성**: ${mainType.type - 1 || 9}w 또는 ${mainType.type + 1 > 9 ? 1 : mainType.type + 1}w

---

## 리포트 작성 가이드라인

**어조**: 따뜻하고 공감하는 전문가의 어조. 내담자가 "내 이야기네"라고 느끼게 해주세요.

**리포트 구조**:

### 1. 당신의 핵심 유형: [주유형] (200-250자)
- 이 유형의 본질적 특성
- 내담자가 일상에서 자연스럽게 하는 행동 패턴 예시
- "혹시 ~하신 적 있으신가요?" 형식의 공감 질문 포함

### 2. 당신만의 독특한 조합 (300-350자)
- 주유형 + 보조유형의 시너지 분석
- 이 조합이 만들어내는 독특한 강점
- 실제 상황에서 이 조합이 어떻게 발현되는지 구체적 예시
- 제3유형이 보조적으로 어떻게 작용하는지

### 3. 내면의 목소리: 당신을 움직이는 힘 (250-300자)
- 핵심 욕구와 동기
- 무의식적으로 추구하는 것
- 반복되는 내면의 대화 패턴 (예: "나는 ~해야 해", "왜 다들 ~하지 않을까")

### 4. 그림자 영역: 성장을 위한 인식 (250-300자)
- 스트레스 상황에서의 반응 패턴
- 무의식적으로 회피하는 것
- 가장 낮은 점수 유형(${lowestType.type}유형)이 의미하는 것
- **중요**: 비난이 아닌 따뜻한 이해의 관점으로

### 5. 관계 속의 당신 (200-250자)
- 친밀한 관계에서의 패턴
- 갈등 상황에서의 전형적 반응
- 상대방이 당신에게 원하는 것

### 6. 성장 로드맵: 다음 단계를 위한 제안 (300-350자)
- **당장 시도해볼 것** (1-2가지 구체적 행동)
- **한 달간 의식해볼 것** (마음가짐/태도 변화)
- **장기적 성장 방향** (이 유형의 건강한 모습)

### 7. 전문가 상담 포인트 (150-200자)
- 이 결과를 바탕으로 전문 컨설턴트와 나눌 수 있는 대화 주제 3가지
- "더 깊이 탐색하고 싶다면..." 형식으로 상담 유도

---

**중요 지침**:
1. 딱딱한 심리학 용어보다 일상적 언어 사용
2. "~일 수 있습니다" 같은 가능성 표현 사용
3. 내담자가 자신의 모습을 발견하며 "아!" 하고 깨닫는 순간을 만들어주세요
4. 점수가 비슷한 유형들이 있다면 그 복합성에 대해 언급
5. 결과에 대한 열린 해석 여지 남기기 (애니어그램은 고정된 것이 아님)
6. 마지막에 희망적이고 성장 지향적인 메시지로 마무리

각 섹션은 **##** 헤딩으로 구분하고, 가독성을 위해 적절히 줄바꿈을 넣어주세요.`;

        // Gemini API 호출
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.8,
                        maxOutputTokens: 4000,
                    }
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API Error:', errorData);
            return res.status(500).json({ error: 'AI 리포트 생성 실패', details: errorData });
        }

        const data = await response.json();
        const report = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        return res.status(200).json({
            success: true,
            report: report,
            summary: {
                mainType: mainType,
                secondType: secondType,
                thirdType: thirdType,
                lowestType: lowestType,
                allScores: scores
            }
        });

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}
