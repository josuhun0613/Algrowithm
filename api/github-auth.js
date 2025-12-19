// GitHub OAuth 콜백 처리
// 환경변수: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET

export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { action, code } = req.query;

    // GitHub OAuth 시작 - 로그인 URL 반환
    if (action === 'login') {
        const clientId = process.env.GITHUB_CLIENT_ID;
        if (!clientId) {
            return res.status(500).json({ error: 'GitHub Client ID가 설정되지 않았습니다' });
        }

        // 고정 redirect URI 사용 (GitHub OAuth App 설정과 일치해야 함)
        const redirectUri = 'https://algrowithm.org/api/github-auth?action=callback';
        const scope = 'repo';
        const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;

        return res.status(200).json({ authUrl });
    }

    // GitHub OAuth 콜백 - code를 access_token으로 교환
    if (action === 'callback') {
        if (!code) {
            // 에러 페이지로 리다이렉트
            return res.redirect('/website-studio.html?github_error=no_code');
        }

        const clientId = process.env.GITHUB_CLIENT_ID;
        const clientSecret = process.env.GITHUB_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            return res.redirect('/website-studio.html?github_error=server_config');
        }

        try {
            // code를 access_token으로 교환
            const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    client_id: clientId,
                    client_secret: clientSecret,
                    code: code
                })
            });

            const tokenData = await tokenResponse.json();

            if (tokenData.error) {
                console.error('GitHub token error:', tokenData);
                return res.redirect('/website-studio.html?github_error=token_failed');
            }

            // 성공 시 토큰과 함께 리다이렉트 (URL fragment로 전달하여 서버 로그에 남지 않게)
            return res.redirect(`/website-studio.html#github_token=${tokenData.access_token}`);

        } catch (error) {
            console.error('GitHub OAuth error:', error);
            return res.redirect('/website-studio.html?github_error=server_error');
        }
    }

    // access_token으로 사용자 정보 가져오기
    if (req.method === 'POST' && action === 'user') {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: '토큰이 필요합니다' });
        }

        try {
            const userResponse = await fetch('https://api.github.com/user', {
                headers: {
                    Authorization: `token ${token}`,
                    'User-Agent': 'Algrowithm-Website-Studio'
                }
            });

            if (!userResponse.ok) {
                return res.status(401).json({ error: '유효하지 않은 토큰입니다' });
            }

            const user = await userResponse.json();
            return res.status(200).json({
                success: true,
                user: {
                    login: user.login,
                    name: user.name,
                    avatar_url: user.avatar_url
                }
            });

        } catch (error) {
            console.error('GitHub user fetch error:', error);
            return res.status(500).json({ error: '사용자 정보를 가져올 수 없습니다' });
        }
    }

    return res.status(400).json({ error: '잘못된 요청입니다' });
}
