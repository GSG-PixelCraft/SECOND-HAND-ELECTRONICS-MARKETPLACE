import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { AuthGuard, RoleGuard } from './guards';
import { AppLayout } from '@/components/layout/app-layout';
import HomePage from '@/pages/HomePage';
import DashboardPage from '@/pages/DashboardPage';
import AuthPage from '@/pages/auth';
import ErrorPages from '@/pages/error-pages';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <AppLayout />,
    errorElement: <ErrorPages type="unexpected" />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ROUTES.LOGIN,
        element: <AuthPage mode="login" />,
      },
      {
        path: ROUTES.REGISTER,
        element: <AuthPage mode="register" />,
      },
      {
        path: ROUTES.DASHBOARD,
        element: (
          <AuthGuard>
            <DashboardPage />
          </AuthGuard>
        ),
      },
      {
        path: ROUTES.PRODUCTS,
        element: <ProductsPage />,
      },
      {
        path: ROUTES.PRODUCT_DETAIL,
        element: <ProductDetailPage />,
      },
      {
        path: ROUTES.CART,
        element: (
          <AuthGuard>
            <CartPage />
          </AuthGuard>
        ),
      },
      // Admin routes
      {
        path: '/admin',
        element: (
          <AuthGuard>
            <RoleGuard allowedRoles={['admin']}>
              <AdminLayout />
            </RoleGuard>
          </AuthGuard>
        ),
        children: [
          // ... admin routes
        ],
      },
    ],
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <ErrorPages type="not-found" />,
  },
  {
    path: '*',
    element: <ErrorPages type="not-found" />,
  },
]);