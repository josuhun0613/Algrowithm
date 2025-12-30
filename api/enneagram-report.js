// Vercel Serverless Function - EPTI AI 리포트 생성
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

        // 중심 에너지 (머리형/가슴형/장형)
        const centerTypes = {
            head: [5, 6, 7],  // 머리 중심 (사고형) - 두려움 기반
            heart: [2, 3, 4], // 가슴 중심 (감정형) - 수치심 기반
            gut: [8, 9, 1]    // 장 중심 (본능형) - 분노 기반
        };

        // 호니비안 그룹 (대인관계 스타일)
        const horneyGroups = {
            assertive: [3, 7, 8],   // 자기주장형 (공격형) - 타인에게 맞서 움직임
            compliant: [1, 2, 6],   // 순응형 (의존형) - 타인에게로 움직임
            withdrawn: [4, 5, 9]    // 위축형 (회피형) - 타인에게서 멀어짐
        };

        // 하모닉 그룹 (갈등 대처 스타일)
        const harmonicGroups = {
            positive: [2, 7, 9],    // 긍정적 관점 - 긍정적으로 재구성
            competency: [1, 3, 5],  // 유능함 그룹 - 객관적/논리적 해결
            reactive: [4, 6, 8]     // 반응형 그룹 - 감정적 반응
        };

        // 성장/퇴행 방향
        const growthDirections = {
            1: { growth: 7, stress: 4 },
            2: { growth: 4, stress: 8 },
            3: { growth: 6, stress: 9 },
            4: { growth: 1, stress: 2 },
            5: { growth: 8, stress: 7 },
            6: { growth: 9, stress: 3 },
            7: { growth: 5, stress: 1 },
            8: { growth: 2, stress: 5 },
            9: { growth: 3, stress: 6 }
        };

        // 날개 계산
        const leftWing = mainType.type === 1 ? 9 : mainType.type - 1;
        const rightWing = mainType.type === 9 ? 1 : mainType.type + 1;
        const leftWingScore = scores[leftWing];
        const rightWingScore = scores[rightWing];
        const dominantWing = leftWingScore >= rightWingScore ? leftWing : rightWing;

        // 중심 에너지 판별
        const getCenter = (type) => {
            if (centerTypes.head.includes(type)) return '머리 중심 (사고형)';
            if (centerTypes.heart.includes(type)) return '가슴 중심 (감정형)';
            if (centerTypes.gut.includes(type)) return '장 중심 (본능형)';
        };

        // 호니비안 그룹 판별
        const getHorneyGroup = (type) => {
            if (horneyGroups.assertive.includes(type)) return '자기주장형 (Assertive)';
            if (horneyGroups.compliant.includes(type)) return '순응형 (Compliant)';
            if (horneyGroups.withdrawn.includes(type)) return '위축형 (Withdrawn)';
        };

        // 하모닉 그룹 판별
        const getHarmonicGroup = (type) => {
            if (harmonicGroups.positive.includes(type)) return '긍정적 관점 그룹';
            if (harmonicGroups.competency.includes(type)) return '유능함 그룹';
            if (harmonicGroups.reactive.includes(type)) return '반응형 그룹';
        };

        const growth = growthDirections[mainType.type];

        // 프롬프트 구성
        const prompt = `당신은 20년 경력의 성격유형 전문 상담사이자 심리학자입니다.
내담자의 EPTI(성격유형 검사) 결과를 바탕으로 **전문적이고 깊이 있는 심층 분석 리포트**를 작성해주세요.

## 내담자 정보
- 이름: ${userName || '익명'}
${userAge ? `- 나이: ${userAge}세` : ''}
${userGender ? `- 성별: ${userGender}` : ''}

## 검사 결과 (45점 만점)
${sortedTypes.map((t, i) => `${i + 1}. ${t.type}유형 ${typeNames[t.type]}: ${t.score}점`).join('\n')}

## 핵심 분석 데이터
- **주유형**: ${mainType.type}유형 ${typeNames[mainType.type]} (${mainType.score}점)
- **보조유형**: ${secondType.type}유형 (${secondType.score}점)
- **제3유형**: ${thirdType.type}유형 (${thirdType.score}점)
- **가장 낮은 유형**: ${lowestType.type}유형 (${lowestType.score}점)

## 날개 분석
- **왼쪽 날개**: ${leftWing}유형 (${leftWingScore}점)
- **오른쪽 날개**: ${rightWing}유형 (${rightWingScore}점)
- **우세 날개**: ${dominantWing}w (${mainType.type}w${dominantWing})

## 중심 에너지 & 그룹 분류
- **중심 에너지**: ${getCenter(mainType.type)}
- **대인관계 스타일**: ${getHorneyGroup(mainType.type)}
- **갈등 대처 스타일**: ${getHarmonicGroup(mainType.type)}

## 성장/퇴행 방향
- **성장 방향 (통합)**: ${growth.growth}유형 ${typeNames[growth.growth]}
- **스트레스 방향 (분열)**: ${growth.stress}유형 ${typeNames[growth.stress]}

---

## 리포트 작성 가이드라인

**어조**: 따뜻하면서도 전문적인 컨설턴트의 어조. 내담자가 "내 이야기네"라고 느끼면서도 새로운 통찰을 얻게 해주세요.

**리포트 구조** (각 섹션별 지정된 분량을 반드시 지켜주세요):

---

## 1. 핵심 유형 프로필: ${mainType.type}유형 ${typeNames[mainType.type]} (300-350자)

- 이 유형의 본질적 특성과 세계를 바라보는 관점
- 핵심 욕구 (가장 원하는 것)와 핵심 두려움 (가장 피하고 싶은 것)
- 일상에서 자연스럽게 나타나는 행동 패턴 2-3가지
- "혹시 ~하신 적 있으신가요?" 형식의 공감 질문 포함

---

## 2. 날개 분석: ${mainType.type}w${dominantWing} (250-300자)

- ${dominantWing}번 날개가 주유형에 어떤 색채를 더하는지
- 이 날개 조합의 고유한 강점
- 반대 날개(${dominantWing === leftWing ? rightWing : leftWing}번)가 발달하면 어떤 균형을 가져올 수 있는지
- 실제 상황에서 이 날개가 어떻게 발현되는지 구체적 예시

---

## 3. 중심 에너지: ${getCenter(mainType.type)} (300-350자)

**${getCenter(mainType.type)}의 특징:**

${centerTypes.head.includes(mainType.type) ? `
- 머리 중심 유형으로서 정보 수집, 분석, 계획에 강점
- 기반 감정: **두려움** - 안전과 확실성에 대한 욕구
- 의사결정 시 논리와 데이터를 중시
- 과도하게 머리를 쓸 때 나타나는 패턴 (과잉 분석, 걱정, 불안)
` : ''}
${centerTypes.heart.includes(mainType.type) ? `
- 가슴 중심 유형으로서 관계, 감정, 이미지에 민감
- 기반 감정: **수치심** - 가치와 인정에 대한 욕구
- 의사결정 시 감정과 관계를 중시
- 과도하게 감정에 빠질 때 나타나는 패턴 (타인 의식, 이미지 관리, 정체성 혼란)
` : ''}
${centerTypes.gut.includes(mainType.type) ? `
- 장 중심 유형으로서 직감, 본능, 행동력에 강점
- 기반 감정: **분노** - 자율성과 통제에 대한 욕구
- 의사결정 시 직감과 본능을 중시
- 과도하게 본능에 의존할 때 나타나는 패턴 (충동성, 분노 폭발 또는 억압)
` : ''}

- 이 중심 에너지를 건강하게 활용하는 방법

---

## 4. 대인관계 스타일: ${getHorneyGroup(mainType.type)} (250-300자)

**호니비안 그룹 분석:**

${horneyGroups.assertive.includes(mainType.type) ? `
**자기주장형 (Assertive)**
- 타인에게 **맞서** 움직이는 스타일
- 자신의 욕구를 적극적으로 추구하고 환경을 자신에게 맞추려 함
- 강점: 추진력, 자신감, 목표 지향성
- 주의점: 타인의 감정이나 필요를 간과할 수 있음
` : ''}
${horneyGroups.compliant.includes(mainType.type) ? `
**순응형 (Compliant)**
- 타인에게 **다가가** 움직이는 스타일
- 관계를 통해 욕구를 충족하고 타인의 기대에 부응하려 함
- 강점: 협력, 배려, 헌신
- 주의점: 자신의 욕구를 억누르거나 의존적이 될 수 있음
` : ''}
${horneyGroups.withdrawn.includes(mainType.type) ? `
**위축형 (Withdrawn)**
- 타인에게서 **멀어져** 움직이는 스타일
- 내면 세계나 개인 공간으로 물러나 욕구를 충족
- 강점: 독립성, 깊은 내면 세계, 자기 성찰
- 주의점: 고립되거나 현실과 괴리될 수 있음
` : ''}

- 이 스타일이 관계에서 어떻게 나타나는지 구체적 예시

---

## 5. 갈등 대처 스타일: ${getHarmonicGroup(mainType.type)} (200-250자)

**하모닉 그룹 분석:**

${harmonicGroups.positive.includes(mainType.type) ? `
**긍정적 관점 그룹**
- 문제 상황을 긍정적으로 재구성하려는 경향
- 갈등을 피하거나 밝은 면을 찾으려 함
- 강점: 낙관성, 회복탄력성
- 성장 포인트: 부정적 감정도 직면하고 수용하기
` : ''}
${harmonicGroups.competency.includes(mainType.type) ? `
**유능함 그룹**
- 객관적, 논리적으로 문제를 해결하려는 경향
- 감정을 배제하고 효율적 해결책을 찾음
- 강점: 분석력, 문제해결력
- 성장 포인트: 감정을 인정하고 표현하기
` : ''}
${harmonicGroups.reactive.includes(mainType.type) ? `
**반응형 그룹**
- 감정을 즉각적으로 표현하는 경향
- 문제에 대해 강한 정서적 반응을 보임
- 강점: 진정성, 열정
- 성장 포인트: 반응 전 한 박자 쉬기
` : ''}

---

## 6. 성장 방향: ${growth.growth}유형으로의 통합 (350-400자)

**${mainType.type}유형 → ${growth.growth}유형 (${typeNames[growth.growth]}) 통합**

- ${growth.growth}유형의 건강한 특성 중 배워야 할 것들
- 통합 방향으로 갈 때 나타나는 긍정적 변화들
- 이 방향으로 성장하기 위한 구체적 실천 방법 3-4가지
- 일상에서 바로 시작할 수 있는 작은 행동 제안

**통합의 징후 (이런 모습이 나타나면 성장하고 있는 것):**
- 구체적인 행동/감정/태도 변화 3가지

---

## 7. 스트레스 방향: ${growth.stress}유형으로의 분열 (300-350자)

**${mainType.type}유형 → ${growth.stress}유형 (${typeNames[growth.stress]}) 분열**

- 스트레스 상황에서 ${growth.stress}유형의 부정적 특성이 어떻게 나타나는지
- 분열의 초기 경고 신호 (이런 모습이 보이면 주의)
- 스트레스 상황에서 빠지기 쉬운 함정들
- 분열 상태에서 벗어나기 위한 구체적 방법

**위험 신호 체크리스트:**
- 자신이 분열 방향으로 가고 있다는 것을 알 수 있는 신호 3-4가지

---

## 8. 내면 성장 로드맵: 자기 변화 가이드 (400-450자)

**중요**: 진정한 변화는 외적 행동보다 **내면의 자각과 변화**에서 시작됩니다.

### 즉시 실천: 내면 자각 (오늘부터)
- 자신의 자동적 반응 패턴을 **관찰**하는 연습 (판단 없이 알아차리기)
- 핵심 두려움이나 욕구가 올라올 때 그것을 인정하고 수용하기
- 내면의 목소리에 귀 기울이는 시간 갖기 (명상, 저널링, 산책 등)

### 단기 목표 (1-3개월): 자기 수용과 통합
- 자신의 그림자(숨기고 싶은 부분)를 인정하고 포용하기
- "~해야 한다"는 당위에서 벗어나 진정한 욕구 탐색하기
- 완벽하지 않은 자신을 있는 그대로 받아들이는 연습

### 중장기 목표 (6개월-1년): 자아 확장과 통합
- 제한된 자기 정체성에서 벗어나 더 넓은 '나'로 확장하기
- 자신의 모든 측면(밝은 면과 어두운 면)을 통합하기
- 에고의 방어 기제를 부드럽게 내려놓는 연습

### 자아 완성을 위한 내면 작업
- 핵심 신념 재검토: "나는 ~해야만 가치있다"라는 조건부 신념 탐색
- 본질적 자기(Essential Self)와 연결되는 시간 갖기
- 자기 연민과 자기 수용의 깊이 더하기

---

## 9. 관계 가이드 (250-300자)

### 이 유형과 잘 맞는 관계
- 시너지를 내는 유형들과 그 이유

### 갈등이 생기기 쉬운 관계
- 주의해야 할 유형들과 갈등 예방법

### 파트너/동료에게 부탁하고 싶은 것
- "저는 이럴 때 ~해주시면 좋겠어요" 형식으로 3가지

---

## 10. 자아 탐색: 정체성과 자아완성의 여정 (300-350자)

**자아 발견과 정체성 개발**

내담자가 탐색할 수 있는 깊은 질문들:
- "유형의 특성을 넘어, 진정한 나는 누구인가?"
- "내 핵심 두려움과 욕구는 어디서 왔는가?"
- "내가 만들어온 '나'라는 이미지와 본질적인 '나' 사이의 차이는?"

**자아완성을 향한 길:**
- 유형의 패턴은 '나'의 일부일 뿐, 전부가 아님을 인식하기
- 조건 없이 자신의 존재 가치를 인정하는 연습
- 진정한 자기(True Self)와 에고(Ego)를 구분하는 통찰력 기르기

**전문가와 함께 탐색할 주제:**
1. [내면 깊숙한 핵심 상처와 그것이 현재에 미치는 영향]
2. [자기 정체성의 확장과 재구성]
3. [내면의 지혜와 연결되는 방법]

**"진정한 변화는 '다른 사람이 되는 것'이 아니라 '더 온전한 나 자신이 되는 것'입니다."**

---

**마무리 메시지**: 내담자가 자신의 고유한 여정을 존중하며, 내면의 지혜를 믿고 자아완성을 향해 나아갈 용기를 주는 따뜻한 마무리 (100-150자). 유형의 틀을 넘어 무한한 가능성을 가진 존재임을 상기시켜 주세요.

---

## 중요 지침

1. **절대 사용하지 말 것**: "애니어그램"이라는 단어 (대신 "성격유형", "EPTI" 등 사용)
2. 딱딱한 심리학 용어보다 일상적 언어 사용
3. "~일 수 있습니다" 같은 가능성 표현 사용
4. 내담자가 자신의 모습을 발견하며 "아!" 하고 깨닫는 순간을 만들어주세요
5. 점수가 비슷한 유형들이 있다면 그 복합성에 대해 언급
6. 비난이나 부정적 판단 없이 모든 특성을 중립적/긍정적으로 서술
7. 각 섹션은 **##** 헤딩으로 구분하고, 가독성을 위해 적절히 줄바꿈과 볼드체 사용
8. 전체 리포트는 3000-4000자 내외로 작성
9. **문장 완결성 필수**: 모든 문장은 완전하게 작성할 것. 영어/한글 혼용으로 인한 끊김 금지 (예: "전문가의 지 guidance" 같은 문장 끊김 절대 금지)
10. **솔루션 방향**: 외적 행동 변화보다 **내면의 변화, 자기 인식, 자아 수용, 정체성 탐색**에 중점을 둘 것
11. 영어 단어를 사용할 경우 문맥상 자연스럽게 통합하거나, 한글로만 작성할 것`;

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
                        maxOutputTokens: 8000,
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
                dominantWing: dominantWing,
                center: getCenter(mainType.type),
                horneyGroup: getHorneyGroup(mainType.type),
                harmonicGroup: getHarmonicGroup(mainType.type),
                growthDirection: growth.growth,
                stressDirection: growth.stress,
                allScores: scores
            }
        });

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}
