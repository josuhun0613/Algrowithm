// Vercel Serverless Function — 코칭 신청 접수 + Resend 이메일 알림
// 환경변수: RESEND_API_KEY (Vercel Dashboard에서 설정)

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { name, org, email, phone, type, program, headcount, message, signature, nda_agreed_at, privacy_agreed_at } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ error: '필수 항목을 입력해 주세요.' });
        }

        const typeLabels = {
            individual: '개인 참여',
            b2b: '기업·기관 단체 도입',
            workshop: '1일 워크숍',
            consulting: '맞춤 상담 요청'
        };

        const programLabels = {
            intensive: 'Intensive (10회)',
            standard: 'Standard (24회)',
            full: 'Full Journey (8개월)',
            custom: '커스터마이징 희망'
        };

        const htmlContent = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 32px; border-radius: 12px;">
                <h1 style="color: #1e293b; font-size: 22px; margin-bottom: 24px; border-bottom: 2px solid #6366f1; padding-bottom: 12px;">
                    📋 새로운 코칭 신청
                </h1>

                <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 12px 8px; color: #64748b; width: 120px;">이름</td>
                        <td style="padding: 12px 8px; color: #1e293b; font-weight: 600;">${name}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 12px 8px; color: #64748b;">소속/직함</td>
                        <td style="padding: 12px 8px; color: #1e293b;">${org || '-'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 12px 8px; color: #64748b;">이메일</td>
                        <td style="padding: 12px 8px; color: #1e293b;"><a href="mailto:${email}" style="color: #6366f1;">${email}</a></td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 12px 8px; color: #64748b;">연락처</td>
                        <td style="padding: 12px 8px; color: #1e293b;"><a href="tel:${phone}" style="color: #6366f1;">${phone}</a></td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 12px 8px; color: #64748b;">신청 유형</td>
                        <td style="padding: 12px 8px; color: #1e293b;">${typeLabels[type] || type || '-'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 12px 8px; color: #64748b;">관심 코칭 과정</td>
                        <td style="padding: 12px 8px; color: #1e293b;">${programLabels[program] || program || '-'}</td>
                    </tr>
                    ${headcount ? `<tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 12px 8px; color: #64748b;">참여 인원</td>
                        <td style="padding: 12px 8px; color: #1e293b;">${headcount}</td>
                    </tr>` : ''}
                    ${message ? `<tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 12px 8px; color: #64748b;">추가 요청</td>
                        <td style="padding: 12px 8px; color: #1e293b;">${message}</td>
                    </tr>` : ''}
                </table>

                <div style="margin-top: 24px; padding: 16px; background: #f1f5f9; border-radius: 8px; font-size: 13px; color: #64748b;">
                    <p style="margin: 0;">✅ NDA 동의: ${nda_agreed_at || '-'}</p>
                    <p style="margin: 4px 0 0;">✅ 개인정보 동의: ${privacy_agreed_at || '-'}</p>
                </div>
            </div>
        `;

        const resendRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'Algrowithm <noreply@algrowithm.org>',
                to: 'josuhun0613@gmail.com',
                subject: `[코칭 신청] ${name} / ${typeLabels[type] || '기타'}`,
                html: htmlContent
            })
        });

        const resendData = await resendRes.json();

        if (!resendRes.ok) {
            console.error('Resend error:', resendData);
            return res.status(500).json({ error: '이메일 발송 실패', detail: resendData });
        }

        return res.status(200).json({ success: true, message: '신청이 접수되었습니다.' });

    } catch (err) {
        console.error('Apply API error:', err);
        return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}
