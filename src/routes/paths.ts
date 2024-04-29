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
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
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
    p2p: {
      list: `${ROOTS.DASHBOARD}/p2p/list`,
    },
    user: {
      list: `${ROOTS.DASHBOARD}/user/list`,
    },
    news: {
      root: `${ROOTS.DASHBOARD}/news`,
      create: `${ROOTS.DASHBOARD}/news/create`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/news/${id}/edit`,
    },
  },
};
