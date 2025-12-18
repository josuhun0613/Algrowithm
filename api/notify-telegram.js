// Telegram 알림 API
// 프로그램 참여 문의가 들어오면 Telegram으로 알림 전송

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
        const { name, phone, email, program, message } = req.body;

        // 환경변수에서 Telegram 설정 가져오기
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        if (!BOT_TOKEN || !CHAT_ID) {
            console.error('Telegram credentials not configured');
            return res.status(500).json({ error: 'Telegram not configured' });
        }

        // 알림 메시지 구성
        const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
        const telegramMessage = `🔔 *새로운 프로그램 참여 문의*

📅 *접수 시간:* ${now}

👤 *이름:* ${name || '미입력'}
📱 *연락처:* ${phone || '미입력'}
📧 *이메일:* ${email || '미입력'}
📋 *프로그램:* ${program || '미선택'}

💬 *문의 내용:*
${message || '(내용 없음)'}

---
_Algrowithm 웹사이트에서 접수됨_`;

        // Telegram API로 메시지 전송
        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
            return res.status(500).json({ error: 'Failed to send Telegram notification', details: result });
        }

        return res.status(200).json({ success: true, message: 'Notification sent' });

    } catch (error) {
        console.error('Error sending Telegram notification:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}
