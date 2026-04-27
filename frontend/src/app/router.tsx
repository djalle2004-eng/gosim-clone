import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from 'react-router-dom';
import LandingPage from '../features/landing/index';
import { MarketplacePage } from '../features/marketplace/pages/MarketplacePage';
import PlanDetailPage from '../pages/PlanDetailPage';
import CheckoutFlowPage from '../features/checkout/pages/CheckoutFlowPage';
import OrderSuccessPage from '../pages/OrderSuccessPage';
import DashboardLayout from '../pages/dashboard/DashboardLayout';

// New feature dashboard pages
import DashboardOverviewPage from '../features/dashboard/pages/DashboardOverviewPage';
import DashboardESimsPage from '../features/dashboard/pages/DashboardESimsPage';
import DashboardOrdersPage from '../features/dashboard/pages/DashboardOrdersPage';
import DashboardWalletPage from '../features/dashboard/pages/DashboardWalletPage';
import DashboardReferralPage from '../features/dashboard/pages/DashboardReferralPage';
import DashboardSettingsPage from '../features/dashboard/pages/DashboardSettingsPage';

// Legacy pages kept for reference
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
      <Route path="/plans" element={<MarketplacePage />} />
      <Route path="/plans/:slug" element={<PlanDetailPage />} />
      <Route path="/checkout" element={<CheckoutFlowPage />} />
      <Route path="/checkout/success" element={<OrderSuccessPage />} />
      <Route path="/checkout/cib-simulated" element={<OrderSuccessPage />} />

      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify" element={<VerifyEmailPage />} />

      {/* Protected User Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverviewPage />} />
          <Route path="esims" element={<DashboardESimsPage />} />
          <Route path="orders" element={<DashboardOrdersPage />} />
          <Route path="wallet" element={<DashboardWalletPage />} />
          <Route path="referral" element={<DashboardReferralPage />} />
          <Route path="settings" element={<DashboardSettingsPage />} />
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

          <Route element={<ProtectedRoute requireSuperAdmin={true} />}>
            <Route path="countries" element={<AdminCountriesPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>
      </Route>
    </>
  )
);
