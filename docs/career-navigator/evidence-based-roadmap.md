# Career Navigator 근거 기반 진단 로드맵

> 작성일: 2026-03-09
> 목적: AI 커리어 진단 도구의 학술적 근거 확보 및 단계별 고도화 전략

---

## 현재 적용 프레임워크 (Lv1)

### 모듈 A: 커리어 스캔 — Career Construction Theory (Savickas)

**이론 배경:**
- Mark Savickas의 Career Construction Theory (2005, 2013)
- 커리어는 객관적 사실이 아니라 개인이 "구성하는 이야기"
- 4C 모델: Concern(관심), Control(통제), Curiosity(탐색), Confidence(확신)

**적용 방식:**
| 문항 | 측정 차원 | Savickas 4C |
|------|----------|-------------|
| 커리어 감정 | Career Concern | Concern |
| 커리어 단계 | Career Stage (Super 참조) | — |
| 가장 큰 이슈 | Adaptability Challenge | Control |
| 행동 패턴 | Adaptability Resources | Curiosity |
| 미래 비전 | Life Design Narrative | Curiosity |
| 듣고 싶은 말 | Intervention Needs | Confidence |

**주요 문헌:**
- Savickas, M. L. (2013). *Career Construction Theory and Practice.* In S. D. Brown & R. W. Lent (Eds.), Career Development and Counseling (2nd ed., pp. 147–183).
- Savickas, M. L. (2005). *The Theory and Practice of Career Construction.* In S. D. Brown & R. W. Lent (Eds.), Career Development and Counseling (pp. 42–70).
- Savickas, M. L., & Porfeli, E. J. (2012). Career Adapt-Abilities Scale: Construction, reliability, and measurement equivalence across 13 countries. *Journal of Vocational Behavior, 80*(3), 661–673.

---

### 모듈 B: 가치관 프리즘 — Super's Work Values / Schwartz Values Theory

**이론 배경:**
- Donald Super의 Work Values Inventory (1970): 직업 가치를 15개 차원으로 측정
- Shalom Schwartz의 Basic Human Values Theory (1992): 10가지 보편적 가치 유형
- 두 이론의 교차점에서 6개 핵심 커리어 가치 도출

**적용 방식 (6개 가치 축):**
| 가치 | Super WVI | Schwartz Values | 측정 문항 |
|------|----------|----------------|----------|
| 보상 (Money) | Economic Returns | Power-Resources | Q1 |
| 의미 (Meaning) | Altruism, Creativity | Benevolence, Universalism | Q1 |
| 안정 (Stability) | Security, Lifestyle | Security, Conformity | Q2, Q4 |
| 성장 (Growth) | Achievement, Advancement | Achievement, Self-Direction | Q2, Q4 |
| 인정 (Recognition) | Prestige, Social Interaction | Power-Dominance, Achievement | Q3, Q5 |
| 자율 (Autonomy) | Autonomy, Independence | Self-Direction | Q3, Q5 |

**주요 문헌:**
- Super, D. E. (1970). *Work Values Inventory.* Boston: Houghton Mifflin.
- Schwartz, S. H. (1992). Universals in the content and structure of values: Theoretical advances and empirical tests in 20 countries. *Advances in Experimental Social Psychology, 25*, 1–65.
- Schwartz, S. H. (2012). An overview of the Schwartz theory of basic values. *Online Readings in Psychology and Culture, 2*(1).
- Rounds, J. B., & Armstrong, P. I. (2005). Assessment of needs and values. In S. D. Brown & R. W. Lent (Eds.), *Career Development and Counseling* (pp. 305–329).

---

### 모듈 C: 강점 디코더 — VIA Character Strengths (Peterson & Seligman)

**이론 배경:**
- VIA Classification of Character Strengths (Peterson & Seligman, 2004)
- 24개 성격 강점을 6개 덕목(Virtue) 카테고리로 분류
- 50개국 이상, 수백만 명 대상 검증된 프레임워크
- 무료 공개 프레임워크 (CliftonStrengths와 달리 라이센스 불필요)

**적용 방식 (6개 덕목 카테고리):**
| 덕목 | VIA Virtue | 포함 강점 | 측정 시나리오 |
|------|-----------|----------|-------------|
| 지혜 | Wisdom | 판단력, 학습열정, 탐구심, 창의력, 통찰력 | Q1, Q2, Q3, Q4, Q5 |
| 용기 | Courage | 용감함, 활력, 진실성, 끈기 | Q1, Q2, Q3, Q4, Q5 |
| 인간애 | Humanity | 사회지능, 배려심 | Q1, Q2, Q3, Q5 |
| 정의 | Justice | 리더십, 공정성, 협동심 | Q1, Q2, Q5 |
| 절제 | Temperance | 신중함, 겸손, 자기조절 | Q1, Q3, Q4, Q5 |
| 초월 | Transcendence | 희망 | Q3, Q4, Q5 |

**주요 문헌:**
- Peterson, C., & Seligman, M. E. P. (2004). *Character Strengths and Virtues: A Handbook and Classification.* Oxford University Press.
- Park, N., Peterson, C., & Seligman, M. E. P. (2006). Character strengths in fifty-four nations and the fifty US states. *The Journal of Positive Psychology, 1*(3), 118–129.
- Niemiec, R. M. (2018). *Character Strengths Interventions: A Field Guide for Practitioners.* Hogrefe Publishing.
- McGrath, R. E. (2019). Technical report: The VIA Assessment Suite for Adults. VIA Institute on Character.

---

## 단계별 고도화 로드맵

### Lv1: 공개 프레임워크 차용 + AI 해석 (현재)

**상태:** ✅ 구현 완료

**내용:**
- 검증된 프레임워크 문항 구조 차용 (Savickas, Super/Schwartz, VIA)
- AI(Gemini)가 프레임워크 기반 데이터를 종합 해석
- 대시보드에 "본 진단은 OO 프레임워크를 참고하여 설계되었습니다" 표기

**한계:**
- 문항이 원본 도구의 축약 버전 (5문항 vs 원본 48~240문항)
- 심리측정학적 검증(신뢰도/타당도) 미실시
- AI 해석의 일관성 미검증

**필요 리소스:** 개발자 1명

---

### Lv2: 데이터 기반 문항 검증 (3~6개월 후)

**목표:** 부스 운영 데이터로 문항 신뢰도 확인

**작업 내용:**
1. **데이터 수집:** 최소 100명 이상의 응답 데이터 (Supabase에 이미 축적)
2. **내적 일관성 검증:** Cronbach's α 계산 (모듈별 0.7 이상 목표)
3. **문항-총점 상관:** 각 문항이 해당 모듈 총점과 상관관계가 있는지 확인
4. **AI 해석 일관성:** 동일 입력에 대한 AI 결과 일관성 측정 (10회 반복)
5. **사용자 피드백:** "이 결과가 나를 잘 설명한다" 5점 척도 (Face Validity)

**분석 도구:**
- Python + pandas + scipy.stats (Cronbach's α, 상관분석)
- 또는 Google Sheets + 수동 계산 (소규모 시)

**주요 문헌:**
- Cronbach, L. J. (1951). Coefficient alpha and the internal structure of tests. *Psychometrika, 16*(3), 297–334.
- Nunnally, J. C. (1978). *Psychometric Theory* (2nd ed.). McGraw-Hill.

**필요 리소스:** 통계 기본 지식 + 부스 3~4회 운영 데이터

---

### Lv3: 전문가 자문 및 문항 정교화 (6~12개월 후)

**목표:** 심리측정 전문가와 협업하여 도구 품질 향상

**작업 내용:**
1. **전문가 자문 확보:**
   - 상담심리학 또는 산업/조직심리학 전공 교수/박사
   - 한국커리어개발원, 한국상담심리학회 등 네트워크 활용
2. **문항 정교화:**
   - Content Validity Index (CVI) 평가: 전문가 패널 3~5명
   - 문항 표현 다듬기 (문화적 적합성, 연령대 적합성)
3. **수렴/변별 타당도:**
   - 기존 검증 도구(Holland SDS, CAAS)와 상관분석
   - 우리 도구가 측정하는 것이 기존 도구와 일치하는지 확인
4. **규준(Norm) 개발:**
   - 2030대 한국인 규준 데이터 (500명+ 목표)
   - 연령/성별/경력 단계별 세분화

**주요 문헌:**
- DeVellis, R. F. (2016). *Scale Development: Theory and Applications* (4th ed.). SAGE.
- Lynn, M. R. (1986). Determination and quantification of content validity. *Nursing Research, 35*(6), 382–385.
- Holland, J. L. (1997). *Making Vocational Choices: A Theory of Vocational Personalities and Work Environments* (3rd ed.). Psychological Assessment Resources.

**필요 리소스:** 심리측정 전문가 1명 + 기존 검증 도구 라이센스

---

### Lv4: 학술 검증 및 공식 도구 등록 (1~2년 후)

**목표:** 학술적으로 인정받는 공식 커리어 진단 도구

**작업 내용:**
1. **IRB (연구윤리심의위원회) 승인:**
   - 대학 부설 연구윤리위원회 또는 독립 IRB 신청
   - 참가자 동의서, 데이터 보호 계획 포함
2. **탐색적/확인적 요인분석:**
   - EFA (Exploratory Factor Analysis): 문항 구조 확인
   - CFA (Confirmatory Factor Analysis): 이론적 모델 적합도 검증
   - 표본 최소 300명 (EFA) + 300명 (CFA) 별도
3. **검사-재검사 신뢰도:**
   - 2~4주 간격으로 동일 참가자 재실시
   - ICC (Intraclass Correlation) 0.7 이상 목표
4. **학술 논문 출판:**
   - 한국심리학회지, 한국직업능력개발원 등 KCI 등재지
   - 또는 국제 저널: *Journal of Vocational Behavior*, *Career Development Quarterly*
5. **도구 등록:**
   - 한국심리검사학회 또는 한국직업능력개발원 등록
   - 공인 검사 도구로 인정

**주요 문헌:**
- Tabachnick, B. G., & Fidell, L. S. (2019). *Using Multivariate Statistics* (7th ed.). Pearson.
- Brown, T. A. (2015). *Confirmatory Factor Analysis for Applied Research* (2nd ed.). Guilford Press.
- Savickas, M. L., & Porfeli, E. J. (2012). Career Adapt-Abilities Scale. *Journal of Vocational Behavior, 80*(3), 661–673. (참고 사례: CAAS 개발 프로세스)

**필요 리소스:** 연구팀 (심리측정 전문가 + 통계 전문가 + 데이터 수집 인력)

---

## 참고: RIASEC (Holland Code) 향후 통합 가능성

현재는 RIASEC를 직접 측정하지 않지만, 향후 모듈 확장 시 통합 가능:
- O*NET Interest Profiler (미국 노동부 공개): 60문항 → 12문항 축약 가능
- Holland SDS (Self-Directed Search): 라이센스 필요
- 모듈 B에 6문항 추가하여 RIASEC 프로필 측정 (Lv3 단계)

**문헌:**
- Holland, J. L. (1997). *Making Vocational Choices* (3rd ed.).
- Rounds, J. (1995). Vocational interests: Evaluating structural hypotheses. In D. Lubinski & R. V. Dawis (Eds.), *Assessing Individual Differences in Human Behavior*.
- O*NET Resource Center: https://www.onetcenter.org/IP.html

---

## 핵심 포지셔닝

> **"검증된 프레임워크로 측정하고, AI가 통합 해석합니다."**

| 요소 | 우리 도구 | 일반 AI 챗봇 | 전문 검사 도구 |
|------|----------|-------------|-------------|
| 측정 구조 | 프레임워크 기반 | 없음 | 정밀 검증 |
| 해석 | AI 종합 해석 | AI 임의 해석 | 전문가 해석 |
| 소요 시간 | 5분 | 대화 의존 | 30~60분 |
| 시각화 | 대시보드 | 텍스트 | PDF 리포트 |
| 공유/전환 | SNS → 세미나 | 없음 | 없음 |
| 비용 | 무료 (부스) | 무료 | 3~10만원 |

이 포지션은 "전문 검사만큼 정밀하진 않지만, AI 챗봇보다 훨씬 구조적"인 중간 지점.
부스 체험 → 공유 → 세미나 전환이라는 마케팅 퍼널에 최적화된 형태.
