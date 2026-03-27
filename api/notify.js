// 통합 알림 API — 이메일(Resend) + 텔레그램
// channel: 'email' | 'telegram' (기본)

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { channel } = req.body;
    if (channel === 'email') return handleEmail(req, res);
    return handleTelegram(req, res);
}

// ─── Resend 이메일 (코칭 신청) ───
async function handleEmail(req, res) {
    try {
        const { name, org, email, phone, type, program, headcount, message, nda_agreed_at, privacy_agreed_at } = req.body;
        if (!name || !email || !phone) return res.status(400).json({ error: '필수 항목을 입력해 주세요.' });

        const typeLabels = { individual: '개인 참여', b2b: '기업·기관 단체 도입', workshop: '1일 워크숍', consulting: '맞춤 상담 요청' };
        const programLabels = { intensive: 'Intensive (10회)', standard: 'Standard (24회)', full: 'Full Journey (8개월)', custom: '커스터마이징 희망' };

        const htmlContent = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 32px; border-radius: 12px;">
                <h1 style="color: #1e293b; font-size: 22px; margin-bottom: 24px; border-bottom: 2px solid #6366f1; padding-bottom: 12px;">📋 새로운 코칭 신청</h1>
                <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                    <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 12px 8px; color: #64748b; width: 120px;">이름</td><td style="padding: 12px 8px; color: #1e293b; font-weight: 600;">${name}</td></tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 12px 8px; color: #64748b;">소속/직함</td><td style="padding: 12px 8px; color: #1e293b;">${org || '-'}</td></tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 12px 8px; color: #64748b;">이메일</td><td style="padding: 12px 8px; color: #1e293b;"><a href="mailto:${email}" style="color: #6366f1;">${email}</a></td></tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 12px 8px; color: #64748b;">연락처</td><td style="padding: 12px 8px; color: #1e293b;"><a href="tel:${phone}" style="color: #6366f1;">${phone}</a></td></tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 12px 8px; color: #64748b;">신청 유형</td><td style="padding: 12px 8px; color: #1e293b;">${typeLabels[type] || type || '-'}</td></tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 12px 8px; color: #64748b;">관심 코칭 과정</td><td style="padding: 12px 8px; color: #1e293b;">${programLabels[program] || program || '-'}</td></tr>
                    ${headcount ? `<tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 12px 8px; color: #64748b;">참여 인원</td><td style="padding: 12px 8px; color: #1e293b;">${headcount}</td></tr>` : ''}
                    ${message ? `<tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 12px 8px; color: #64748b;">추가 요청</td><td style="padding: 12px 8px; color: #1e293b;">${message}</td></tr>` : ''}
                </table>
                <div style="margin-top: 24px; padding: 16px; background: #f1f5f9; border-radius: 8px; font-size: 13px; color: #64748b;">
                    <p style="margin: 0;">✅ NDA 동의: ${nda_agreed_at || '-'}</p>
                    <p style="margin: 4px 0 0;">✅ 개인정보 동의: ${privacy_agreed_at || '-'}</p>
                </div>
            </div>`;

        const resendRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.RESEND_API_KEY}` },
            body: JSON.stringify({ from: 'Algrowithm <noreply@algrowithm.org>', to: 'josuhun0613@gmail.com', subject: `[코칭 신청] ${name} / ${typeLabels[type] || '기타'}`, html: htmlContent })
        });

        const resendData = await resendRes.json();
        if (!resendRes.ok) return res.status(500).json({ error: '이메일 발송 실패', detail: resendData });
        return res.status(200).json({ success: true, message: '신청이 접수되었습니다.' });
    } catch (err) {
        return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}

// ─── 텔레그램 알림 (코칭 문의 + 세미나 신청) ───
async function handleTelegram(req, res) {
    try {
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
        const PERSONAL_CHAT_ID = process.env.TELEGRAM_PERSONAL_CHAT_ID || '1447885827';
        if (!BOT_TOKEN || !CHAT_ID) return res.status(500).json({ error: 'Telegram not configured' });

        const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
        const { type } = req.body;
        let telegramMessage;
        let targetChatId = CHAT_ID;

        if (type === 'seminar') {
            const { name, phone, age, occupation, org, region, expectation, ref } = req.body;
            if (!name || !phone) return res.status(400).json({ error: '이름과 연락처는 필수입니다.' });
            const occupationMap = { student: '대학생', jobseeker: '취업준비생', worker: '직장인', founder: '창업자/프리랜서' };
            telegramMessage = `🎤 *새로운 강연 신청*\n\n📅 *접수 시간:* ${now}\n\n👤 *이름:* ${name}\n🎂 *나이:* ${age || '미입력'}세\n📱 *연락처:* ${phone}\n💼 *소속/직업:* ${occupationMap[occupation] || occupation || '미선택'}\n🏢 *학교/회사:* ${org || '미입력'}\n📍 *사는 곳:* ${region || '미입력'}\n📣 *유입 경로:* ${ref || 'direct'}\n\n💬 *기대평:*\n${expectation || '(내용 없음)'}\n\n---\n_Algrowithm 강연 페이지에서 접수됨_`;
        } else {
            const { name, phone, email, program, message } = req.body;
            telegramMessage = `🔔 *새로운 코칭 참여 문의*\n\n📅 *접수 시간:* ${now}\n\n👤 *이름:* ${name || '미입력'}\n📱 *연락처:* ${phone || '미입력'}\n📧 *이메일:* ${email || '미입력'}\n📋 *코칭 과정:* ${program || '미선택'}\n\n💬 *문의 내용:*\n${message || '(내용 없음)'}\n\n---\n_Algrowithm 웹사이트에서 접수됨_`;
        }

        const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: targetChatId, text: telegramMessage, parse_mode: 'Markdown' })
        });

        const result = await telegramResponse.json();
        if (!result.ok) return res.status(500).json({ error: 'Failed to send Telegram notification' });

        // ── 강연 신청 시 확인 SMS 발송 ──
        if (type === 'seminar' && req.body.phone) {
            await sendSMS(req.body.phone, req.body.name);
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// ─── Solapi SMS ───
async function sendSMS(phone, name) {
    try {
        const API_KEY = process.env.SOLAPI_API_KEY;
        const API_SECRET = process.env.SOLAPI_API_SECRET;
        const FROM = process.env.SOLAPI_FROM;
        if (!API_KEY || !API_SECRET || !FROM) return;

        const date = new Date().toISOString();
        const salt = Math.random().toString(36).slice(2);
        const crypto = await import('crypto');
        const signature = crypto.createHmac('sha256', API_SECRET)
            .update(date + salt).digest('hex');

        const cleanPhone = phone.replace(/-/g, '');
        const text = `[Algrowithm] ${name}님, 강연 신청이 완료되었습니다.\n\n📅 3/28(토) 16:00\n📍 공덕 창업허브 1F (G-TOWN)\n\n문의: algrowithm@kakao.com`;

        await fetch('https://api.solapi.com/messages/v4/send-many/detail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `HMAC-SHA256 apiKey=${API_KEY}, date=${date}, salt=${salt}, signature=${signature}`,
            },
            body: JSON.stringify({
                messages: [{ to: cleanPhone, from: FROM, text }]
            }),
        });
    } catch (e) {
        console.error('SMS send failed:', e);
    }
}
