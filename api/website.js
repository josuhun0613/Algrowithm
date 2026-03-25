// 통합 웹사이트 API — 코드 생성 + 배포 + 관리
// action: 'generate' | 'deploy' | 'list' | 'delete'

import { put, list, del } from '@vercel/blob';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const action = req.query.action || req.body?.action;

    switch (action) {
        case 'generate': return handleGenerate(req, res);
        case 'deploy': return handleDeploy(req, res);
        case 'list': return handleList(req, res);
        case 'delete': return handleDelete(req, res);
        default: return res.status(400).json({ error: '잘못된 요청입니다. action 파라미터가 필요합니다.' });
    }
}

// ─── 코드 생성 (Gemini) ───
async function handleGenerate(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { message, codeContext, accessCode, testOnly } = req.body;

        if (testOnly && accessCode) {
            if (accessCode === process.env.IMAGE_ACCESS_CODE) return res.status(200).json({ success: true, message: '접근 코드가 확인되었습니다' });
            return res.status(401).json({ error: '접근 코드가 올바르지 않습니다' });
        }

        if (!message) return res.status(400).json({ error: '메시지가 필요합니다' });

        if (!accessCode || accessCode !== process.env.IMAGE_ACCESS_CODE) return res.status(401).json({ error: '접근 코드가 올바르지 않습니다' });

        const serverApiKey = process.env.GEMINI_API_KEY;
        if (!serverApiKey) return res.status(500).json({ error: '서버 API 키가 설정되지 않았습니다' });

        const systemPrompt = `당신은 웹 개발 전문가입니다. 사용자의 요청에 따라 웹사이트 코드를 수정하거나 새로 작성해주세요.

중요 규칙:
1. 반드시 수정된 전체 코드를 제공해주세요
2. HTML, CSS, JavaScript 각각 별도의 코드 블록으로 제공해주세요
3. 코드 블록은 반드시 \`\`\`html, \`\`\`css, \`\`\`javascript 형식으로 시작해주세요
4. 한국어로 간단한 설명을 먼저 해주세요
5. 기존 코드의 스타일과 구조를 유지하면서 수정해주세요

${codeContext}`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${serverApiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `${systemPrompt}\n\n사용자 요청: ${message}` }] }],
                    generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
                })
            }
        );

        const data = await response.json();
        if (!response.ok) {
            let errorMessage = '코드 생성에 실패했습니다';
            if (data.error?.status === 'RESOURCE_EXHAUSTED') errorMessage = 'API 요청 한도를 초과했습니다.';
            else if (data.error?.message) errorMessage = data.error.message;
            return res.status(response.status || 500).json({ error: errorMessage });
        }

        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            return res.status(200).json({ success: true, response: data.candidates[0].content.parts[0].text });
        }
        return res.status(500).json({ error: '응답을 받지 못했습니다' });
    } catch (error) {
        return res.status(500).json({ error: '코드 생성 중 오류가 발생했습니다', details: error.message });
    }
}

// ─── 사이트 배포 ───
async function handleDeploy(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { siteName, html, css, js, accessCode } = req.body;
    if (!accessCode || accessCode !== process.env.IMAGE_ACCESS_CODE) return res.status(401).json({ error: '접근 코드가 올바르지 않습니다' });
    if (!siteName) return res.status(400).json({ error: '사이트 이름이 필요합니다' });
    if (!/^[a-z0-9-]+$/.test(siteName)) return res.status(400).json({ error: '사이트 이름은 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다' });
    if (siteName.length < 3 || siteName.length > 30) return res.status(400).json({ error: '사이트 이름은 3-30자여야 합니다' });

    const reserved = ['admin', 'api', 'www', 'app', 'blog', 'sites', 'static'];
    if (reserved.includes(siteName)) return res.status(400).json({ error: '이 사이트 이름은 사용할 수 없습니다' });

    try {
        const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${siteName} - Algrowithm</title>
    <style>
${css || ''}
    </style>
</head>
<body>
${html || ''}
    <script>
${js || ''}
    </script>
</body>
</html>`;

        const blob = await put(`sites/${siteName}/index.html`, fullHtml, { access: 'public', contentType: 'text/html' });
        return res.status(200).json({ success: true, url: `https://algrowithm.org/sites/${siteName}`, blobUrl: blob.url, message: '사이트가 배포되었습니다!' });
    } catch (error) {
        return res.status(500).json({ error: '배포에 실패했습니다: ' + error.message });
    }
}

// ─── 사이트 목록 ───
async function handleList(req, res) {
    try {
        const { blobs } = await list({ prefix: 'sites/' });
        const sites = blobs.filter(b => b.pathname.endsWith('/index.html')).map(b => ({
            name: b.pathname.split('/')[1],
            url: `https://algrowithm.org/sites/${b.pathname.split('/')[1]}`,
            uploadedAt: b.uploadedAt
        }));
        return res.status(200).json({ success: true, sites });
    } catch (error) {
        return res.status(500).json({ error: '사이트 목록을 가져올 수 없습니다' });
    }
}

// ─── 사이트 삭제 ───
async function handleDelete(req, res) {
    const { siteName, accessCode } = req.body;
    if (!accessCode || accessCode !== process.env.IMAGE_ACCESS_CODE) return res.status(401).json({ error: '접근 코드가 올바르지 않습니다' });
    if (!siteName) return res.status(400).json({ error: '사이트 이름이 필요합니다' });

    try {
        await del(`sites/${siteName}/index.html`);
        return res.status(200).json({ success: true, message: '사이트가 삭제되었습니다' });
    } catch (error) {
        return res.status(500).json({ error: '삭제에 실패했습니다' });
    }
}
