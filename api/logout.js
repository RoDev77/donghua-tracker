const { clearCookie } = require('../lib/auth');

module.exports = (req, res) => {
  clearCookie(res, 'dh_session');
  res.status(200).json({ ok: true });
};
