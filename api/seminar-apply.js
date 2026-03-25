// 세미나 신청 API — Telegram 알림 연동
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { name, phone, occupation, org, expectation, ref } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ error: '이름과 연락처는 필수입니다.' });
        }

        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        if (!BOT_TOKEN || !CHAT_ID) {
            console.error('Telegram credentials not configured');
            return res.status(500).json({ error: 'Telegram not configured' });
        }

        const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

        const occupationMap = {
            student: '대학생',
            jobseeker: '취업준비생',
            worker: '직장인',
            founder: '창업자/프리랜서',
        };

        const telegramMessage = `🎤 *새로운 세미나 신청*

📅 *접수 시간:* ${now}

👤 *이름:* ${name}
📱 *연락처:* ${phone}
💼 *소속/직업:* ${occupationMap[occupation] || occupation || '미선택'}
🏢 *학교/회사:* ${org || '미입력'}
📣 *유입 경로:* ${ref || 'direct'}

💬 *기대평:*
${expectation || '(내용 없음)'}

---
_Algrowithm 세미나 페이지에서 접수됨_`;

        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: telegramMessage,
                    parse_mode: 'Markdown',
                }),
            }
        );

        const result = await telegramResponse.json();

        if (!result.ok) {
            console.error('Telegram API error:', result);
            return res.status(500).json({ error: 'Failed to send notification' });
        }

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Seminar apply error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
