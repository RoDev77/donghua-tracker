const { parseCookies, sign, setCookie, clearCookie } = require('../../lib/auth');

const CLIENT_ID = '1575860393132171344';
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || 'https://dh.rstudiolab.tech/callback';

module.exports = async function handler(req, res) {
  const url = new URL(req.url, 'https://dh.rstudiolab.tech');
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookies = parseCookies(req.headers.cookie);

  const fail = (msg) => {
    clearCookie(res, 'discord_oauth_state');
    res.writeHead(302, { Location: '/?login_error=' + encodeURIComponent(msg) });
    res.end();
  };

  if (!code || !state || state !== cookies.discord_oauth_state) return fail('invalid_state');
  if (!process.env.DISCORD_CLIENT_SECRET) return fail('missing_client_secret');

  try {
    const body = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI
    });
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });
    if (!tokenRes.ok) return fail('token_exchange_failed');
    const token = await tokenRes.json();

    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token.access_token}` }
    });
    if (!userRes.ok) return fail('user_fetch_failed');
    const user = await userRes.json();

    const payload = {
      id: user.id,
      username: user.username,
      globalName: user.global_name || user.username,
      discriminator: user.discriminator || null,
      avatar: user.avatar || null,
      banner: user.banner || null,
      loginAt: Date.now(),
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000
    };
    setCookie(res, 'dh_session', sign(payload), 7 * 24 * 60 * 60);
    clearCookie(res, 'discord_oauth_state');
    res.writeHead(302, { Location: '/' });
    res.end();
  } catch (e) {
    fail('server_error');
  }
};
