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

// USER
const UserListPage = lazy(() => import('src/pages/admin/user/list'));
// Transaction
const TransactionListPage = lazy(() => import('src/pages/admin/transaction/list'));

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
    ],
  },
];
