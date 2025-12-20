// 직접 사이트 배포 API - Vercel Blob Storage 사용
// 환경변수: BLOB_READ_WRITE_TOKEN, IMAGE_ACCESS_CODE

import { put, list, del } from '@vercel/blob';

export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { action } = req.query;

    // 사이트 목록 조회
    if (req.method === 'GET' && action === 'list') {
        try {
            const { blobs } = await list({ prefix: 'sites/' });
            const sites = blobs
                .filter(b => b.pathname.endsWith('/index.html'))
                .map(b => {
                    const name = b.pathname.split('/')[1];
                    return {
                        name,
                        url: `https://algrowithm.org/sites/${name}`,
                        uploadedAt: b.uploadedAt
                    };
                });
            return res.status(200).json({ success: true, sites });
        } catch (error) {
            console.error('List sites error:', error);
            return res.status(500).json({ error: '사이트 목록을 가져올 수 없습니다' });
        }
    }

    // 사이트 배포
    if (req.method === 'POST' && action === 'deploy') {
        const { siteName, html, css, js, accessCode } = req.body;

        // 접근 코드 검증
        const serverAccessCode = process.env.IMAGE_ACCESS_CODE;
        if (!accessCode || accessCode !== serverAccessCode) {
            return res.status(401).json({ error: '접근 코드가 올바르지 않습니다' });
        }

        if (!siteName) {
            return res.status(400).json({ error: '사이트 이름이 필요합니다' });
        }

        // 사이트 이름 유효성 검사 (영문, 숫자, 하이픈만)
        if (!/^[a-z0-9-]+$/.test(siteName)) {
            return res.status(400).json({ error: '사이트 이름은 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다' });
        }

        if (siteName.length < 3 || siteName.length > 30) {
            return res.status(400).json({ error: '사이트 이름은 3-30자여야 합니다' });
        }

        // 예약어 체크
        const reserved = ['admin', 'api', 'www', 'app', 'blog', 'sites', 'static'];
        if (reserved.includes(siteName)) {
            return res.status(400).json({ error: '이 사이트 이름은 사용할 수 없습니다' });
        }

        try {
            // HTML, CSS, JS를 하나의 파일로 합치기
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

            // Vercel Blob에 업로드
            const blob = await put(`sites/${siteName}/index.html`, fullHtml, {
                access: 'public',
                contentType: 'text/html'
            });

            return res.status(200).json({
                success: true,
                url: `https://algrowithm.org/sites/${siteName}`,
                blobUrl: blob.url,
                message: '사이트가 배포되었습니다!'
            });

        } catch (error) {
            console.error('Deploy error:', error);
            return res.status(500).json({ error: '배포에 실패했습니다: ' + error.message });
        }
    }

    // 사이트 삭제
    if (req.method === 'DELETE' && action === 'delete') {
        const { siteName, accessCode } = req.body;

        const serverAccessCode = process.env.IMAGE_ACCESS_CODE;
        if (!accessCode || accessCode !== serverAccessCode) {
            return res.status(401).json({ error: '접근 코드가 올바르지 않습니다' });
        }

        if (!siteName) {
            return res.status(400).json({ error: '사이트 이름이 필요합니다' });
        }

        try {
            await del(`sites/${siteName}/index.html`);
            return res.status(200).json({ success: true, message: '사이트가 삭제되었습니다' });
        } catch (error) {
            console.error('Delete error:', error);
            return res.status(500).json({ error: '삭제에 실패했습니다' });
        }
    }

    return res.status(400).json({ error: '잘못된 요청입니다' });
}
