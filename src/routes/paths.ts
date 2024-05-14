// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/admin',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.DASHBOARD}/jwt/login`,
      register: `${ROOTS.DASHBOARD}/jwt/register`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    one: `${ROOTS.DASHBOARD}/one`,
    two: `${ROOTS.DASHBOARD}/two`,
    three: `${ROOTS.DASHBOARD}/three`,
    companies: {
      root: `${ROOTS.DASHBOARD}/companies`,
      create: `${ROOTS.DASHBOARD}/companies/create`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/companies/${id}/edit`,
    },
    transaction: {
      root: `${ROOTS.DASHBOARD}/transaction/list`,
    },
    close: {
      root: `${ROOTS.DASHBOARD}/close/list`,
    },
    p2p: {
      list: `${ROOTS.DASHBOARD}/p2p`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/p2p/${id}/edit`,
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order/list`,
    },
    user: {
      list: `${ROOTS.DASHBOARD}/user`,
      verification: `${ROOTS.DASHBOARD}/user/verification`,
    },
    news: {
      root: `${ROOTS.DASHBOARD}/news`,
      create: `${ROOTS.DASHBOARD}/news/create`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/news/${id}/edit`,
    },
    settings: {
      root: `${ROOTS.DASHBOARD}/settings/list`,
    },
  },
};
