import axios from 'src/utils/axios';

export const setSession = (acceptToken: string | null, refreshToken: string | null) => {
  if (acceptToken && refreshToken) {
    localStorage.setItem('acceptToken', acceptToken);
    localStorage.setItem('refreshToken', refreshToken);
    axios.defaults.headers.common.Authorization = acceptToken;
  }
};
