import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/admin/one'));
const PageTwo = lazy(() => import('src/pages/admin/two'));
const PageThree = lazy(() => import('src/pages/admin/three'));
const PageCompanies = lazy(() => import('src/pages/admin/companies/list'));
const PageCompaniesCreate = lazy(() => import('src/pages/admin/companies/new'));
const PageCompaniesEdit = lazy(() => import('src/pages/admin/companies/edit'));

// p2p
const P2pListPage = lazy(() => import('src/pages/admin/p2p/list'));

// news
const NewsListPage = lazy(() => import('src/pages/admin/news/list'));
const NewsCreatePage = lazy(() => import('src/pages/admin/news/create'));
const NewsEditPage = lazy(() => import('src/pages/admin/news/edit'));

// USER
const UserListPage = lazy(() => import('src/pages/admin/user/list'));

// Transaction
const TransactionListPage = lazy(() => import('src/pages/admin/transaction/list'));

// Settings
const SettingsPage = lazy(() => import('src/pages/admin/settings/root'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'admin',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      { path: 'two', element: <PageTwo /> },
      { path: 'three', element: <PageThree /> },
      {
        path: 'companies',
        children: [
          { element: <PageCompanies />, index: true },
          { path: 'create', element: <PageCompaniesCreate /> },
          { path: ':id/edit', element: <PageCompaniesEdit /> },
        ],
      },
      {
        path: 'user',
        children: [{ path: 'list', element: <UserListPage />, index: true }],
      },
      {
        path: 'transaction',
        children: [{ path: 'list', element: <TransactionListPage />, index: true }],
      },
      {
        path: 'p2p',
        children: [{ path: 'list', element: <P2pListPage />, index: true }],
      },
      {
        path: 'news',
        children: [
          { element: <NewsListPage />, index: true },
          { path: 'create', element: <NewsCreatePage /> },
          { path: ':id/edit', element: <NewsEditPage /> },
        ],
      },
      {
        path: 'settings',
        children: [
          { element: <SettingsPage />, index: true, path: 'list' },
        ],
      },
    ],
  },
];
