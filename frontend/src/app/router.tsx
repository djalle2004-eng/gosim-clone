import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from 'react-router-dom';
import LandingPage from '../features/landing/index';
import PlansPage from '../pages/PlansPage';
import PlanDetailPage from '../pages/PlanDetailPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrderSuccessPage from '../pages/OrderSuccessPage';
import DashboardLayout from '../pages/dashboard/DashboardLayout';
import MyESimsPage from '../pages/dashboard/MyESimsPage';
import MyOrdersPage from '../pages/dashboard/MyOrdersPage';
import ProfilePage from '../pages/dashboard/ProfilePage';
import NotificationsPage from '../pages/dashboard/NotificationsPage';
import SupportPage from '../pages/dashboard/SupportPage';

import AdminLayout from '../pages/admin/AdminLayout';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminPlansPage from '../pages/admin/AdminPlansPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminESimsPage from '../pages/admin/AdminESimsPage';
import AdminCountriesPage from '../pages/admin/AdminCountriesPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<LandingPage />} />
      <Route path="/plans" element={<PlansPage />} />
      <Route path="/plans/:slug" element={<PlanDetailPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/checkout/success" element={<OrderSuccessPage />} />
      <Route path="/checkout/cib-simulated" element={<OrderSuccessPage />} />

      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Semi-Protected for email verification only */}
      <Route path="/verify" element={<VerifyEmailPage />} />

      {/* Protected User Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard/esims" replace />} />
          <Route path="esims" element={<MyESimsPage />} />
          <Route path="orders" element={<MyOrdersPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="support" element={<SupportPage />} />
        </Route>
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute requireAdmin={true} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="plans" element={<AdminPlansPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="esims" element={<AdminESimsPage />} />

          {/* Countries is Super Admin Only */}
          <Route element={<ProtectedRoute requireSuperAdmin={true} />}>
            <Route path="countries" element={<AdminCountriesPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>
      </Route>
    </>
  )
);
