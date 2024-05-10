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
  const [url, payload, method = 'get', headers = {}] = Array.isArray(args) ? args : [args];

  if (method.toLowerCase() === 'post') {
    const res = await axiosInstance.post(url, payload, { headers });
    return res.data;
  }

  if (method.toLowerCase() === 'put') {
    const res = await axiosInstance.put(url, payload, { headers });
    return res.data;
  }

  const res = await axiosInstance.get(url, { headers });
  return res.data;
};

export const endpoints = {
  chat: '/chat',
  kanban: '/kanban',
  calendar: '/calendar',
  auth: {
    me: '/account/me',
    login: '/auth/admin/authenticate',
    register: '/auth/register',
  },
  company: {
    root: '/company-invest',
    addFile: '/company-invest/file',
    deleteFile: '/company-invest/file',
    detailList: '/company-invest/detail-type/list',
    files: '/company-invest/file/list',
  },
  briefcase: {
    adminPage: '/briefcase-account/page',
    updateBrief: 'briefcase-account/order-close',
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
    file: '/account/verification/file',
  },
  transaction: {
    list: '/transaction/history',
    page: '/transaction',
    update: '/transaction',
    tokens: 'transaction/get-token-list',
    save: 'transaction/save-system-token-list',
    p2pCount: 'transaction/get-count-statuses-transaction/p2p',
    add_requisites: 'transaction/add-requisites',
  },
  news: {
    list: '/news/page',
    page: '/news',
    update: '/news',
  },
  order: {
    list: '/order-contact/page',
  },
  settings: {
    wait_requisites: '/setting/code/p2p.time.wait_requisites',
    time_accept: '/setting/code/p2p.time.accept',
    time_process: '/setting/code/p2p.time.process',
  },
};
