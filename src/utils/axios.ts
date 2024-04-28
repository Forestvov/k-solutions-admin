import axios from 'axios';

import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

export const fetcher = async (args: string) => {
  const [url, payload, method = 'get'] = Array.isArray(args) ? args : [args];

  if (method.toLowerCase() === 'post') {
    const res = await axiosInstance.post(url, payload);
    return res.data;
  }

  if (method.toLowerCase() === 'put') {
    const res = await axiosInstance.put(url, payload);
    return res.data;
  }

  const res = await axiosInstance.get(url);
  return res.data;
};

export const endpoints = {
  chat: '/chat',
  kanban: '/kanban',
  calendar: '/calendar',
  auth: {
    me: '/account/me',
    login: '/auth/authenticate',
    register: '/auth/register',
  },
  company: {
    root: '/company-invest',
    detailList: '/company-invest/detail-type/list',
  },
  briefcase: {
    page: '/briefcase/page',
    list: '/briefcase/list',
    add: '/briefcase',
    update: '/briefcase/page',
    details: '/briefcase',
  },
  mail: {
    list: '/mail/list',
    details: '/mail/details',
    labels: '/briefcase',
  },
  post: {
    list: '/post/list',
    details: '/post/details',
    latest: '/post/latest',
    search: '/post/search',
  },
  product: {
    list: '/product/list',
    details: '/product/details',
    search: '/product/search',
  },
  user: {
    list: '/account/page',
    update: '/account/update',
  },
  transaction: {
    list: '/transaction/history',
    update: '/transaction',
  },
};
