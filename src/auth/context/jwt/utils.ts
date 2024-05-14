import { paths } from 'src/routes/paths';

import axios from 'src/utils/axios';

// ----------------------------------------------------------------------

function jwtDecode(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
}

// ----------------------------------------------------------------------

export const isValidToken = (acceptToken: string) => {
  if (!acceptToken) {
    return false;
  }

  const decoded = jwtDecode(acceptToken);

  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

// ----------------------------------------------------------------------

export const tokenExpired = (exp: number) => {
  // eslint-disable-next-line prefer-const
  let expiredTimer;

  const currentTime = Date.now();

  // Test token expires after 10s
  // const timeLeft = currentTime + 10000 - currentTime; // ~10s
  const timeLeft = exp * 1000 - currentTime;

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(() => {
    localStorage.removeItem('acceptToken');

    window.location.href = paths.auth.jwt.login;
  }, timeLeft);
};

// ----------------------------------------------------------------------

export const setSession = (acceptToken: string | null) => {
  if (acceptToken) {
    localStorage.setItem('acceptToken', acceptToken);

    axios.defaults.headers.common.Authorization = acceptToken;

    // This function below will handle when token is expired
    const { exp } = jwtDecode(acceptToken); // ~3 days by minimals server
    tokenExpired(exp);
  } else {
    localStorage.removeItem('acceptToken');

    delete axios.defaults.headers.common.Authorization;
  }
};
