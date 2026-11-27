const { parseCookies, verify } = require('../lib/auth');

module.exports = (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  const payload = verify(cookies.dh_session);
  res.setHeader('Cache-Control', 'no-store');
  if (!payload) return res.status(200).json({ user: null });
  return res.status(200).json({
    user: {
      id: payload.id,
      username: payload.username,
      globalName: payload.globalName || payload.username,
      discriminator: payload.discriminator || null,
      avatar: payload.avatar || null,
      banner: payload.banner || null,
      loginAt: payload.loginAt || null
    }
  });
};
