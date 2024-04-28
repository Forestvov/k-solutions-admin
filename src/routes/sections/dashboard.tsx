import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/one'));
const PageTwo = lazy(() => import('src/pages/dashboard/two'));
const PageThree = lazy(() => import('src/pages/dashboard/three'));
const PageCompanies = lazy(() => import('src/pages/dashboard/companies/list'));
const PageCompaniesCreate = lazy(() => import('src/pages/dashboard/companies/new'));

// USER
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
// Transaction
const TransactionListPage = lazy(() => import('src/pages/dashboard/transaction/list'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
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
