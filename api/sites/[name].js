// 동적 사이트 라우팅 - /sites/[name] 경로 처리
// Vercel Blob Storage에서 사이트 콘텐츠 가져오기

import { list } from '@vercel/blob';

export default async function handler(req, res) {
    const { name } = req.query;

    if (!name) {
        return res.status(400).send('사이트 이름이 필요합니다');
    }

    try {
        // Blob Storage에서 해당 사이트 찾기
        const { blobs } = await list({ prefix: `sites/${name}/` });

        const indexBlob = blobs.find(b => b.pathname === `sites/${name}/index.html`);

        if (!indexBlob) {
            // 사이트가 없으면 404 페이지
            return res.status(404).send(`
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>사이트를 찾을 수 없습니다 - Algrowithm</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .container {
            text-align: center;
            padding: 2rem;
        }
        h1 { font-size: 6rem; color: #d4af37; }
        p { font-size: 1.5rem; margin: 1rem 0; opacity: 0.8; }
        a {
            display: inline-block;
            margin-top: 2rem;
            padding: 1rem 2rem;
            background: #d4af37;
            color: #1a1a2e;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
        }
        a:hover { background: #b8962e; }
    </style>
</head>
<body>
    <div class="container">
        <h1>404</h1>
        <p>요청하신 사이트를 찾을 수 없습니다</p>
        <a href="/">Algrowithm 홈으로</a>
    </div>
</body>
</html>
            `);
        }

        // Blob URL에서 콘텐츠 가져오기
        const response = await fetch(indexBlob.url);
        const html = await response.text();

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.status(200).send(html);

    } catch (error) {
        console.error('Site fetch error:', error);
        return res.status(500).send('사이트를 불러올 수 없습니다');
    }
}
