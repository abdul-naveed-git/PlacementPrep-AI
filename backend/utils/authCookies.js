const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "pf_auth";

const getAuthCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.COOKIE_SAME_SITE || "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const setAuthCookie = (res, token) => {
  res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
};

const clearAuthCookie = (res) => {
  res.clearCookie(AUTH_COOKIE_NAME, {
    ...getAuthCookieOptions(),
    maxAge: undefined,
  });
};

module.exports = {
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
  setAuthCookie,
  clearAuthCookie,
};
