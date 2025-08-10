import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Status from "./pages/Status";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TenantsPage from "./pages/TenantPage";
import TenantDetail from "./components/tenants/TenantDetail";
import PaymentsPage from "./pages/PaymentPage";
import PropertiesPage from "./pages/PropertyPage";
import { useAuth } from "./contexts/AuthContext";
import Sidebar from "./components/Sidebar";
import EditTenantPage from "./pages/EditTenantPage";
import PropertyDetail from "./components/properties/PropertyDetail";
import EditPropertyPage from "./pages/EditPropertyPage";
import PaymentsHistoryPage from "./pages/PaymentHistoryPage";
import EditPaymentPage from "./pages/EditPaymentPage";
import FineSettingsPage from "./pages/FineSettingsPage";
import NotificationPage from "./pages/NotificationPage";
import NotificationDetailPage from "./pages/NotificationDetail";
import PaymentDetail from "./components/payments/PaymentDetail";
import { AdminRegisterForm } from "./components/admin/AdminRegisterForm";
import AdminDashboard from "./pages/AdminDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import SystemFeatures from "./pages/SystemFeature";
import BlogPost from "./pages/BlogPost";
import AdminBlogPosts from "./pages/AdminBlogPosts";
import BlogPostEditor from "./pages/BlogPostEditor";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { AdminUserForm } from "./components/admin/AdminUserForm";
import { AdminUserDetail } from "./pages/AdminUserDetail";
import { AdminSettingsPage } from "./pages/AdminSettingsPage";
import { ManagerProfilePage } from "./pages/ManagerProfilePage";
import AboutAdminPanel from "./components/admin/AboutAdminPanel";
import ContactAdminPanel from "./components/admin/ContactAdminPanel";
import FeaturesManager from "./components/admin/FeaturesManager";
import StatusAdminPanel from "./components/admin/StatusAdminPanel";

// Componente para rotas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated === null) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default function App() {
  const { isAuthenticated } = useAuth()
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  return (
    <Router>
      <div className="flex min-h-screen w-full">
        {/* Sidebar - visível apenas quando autenticado */}

        {isAuthenticated && <Sidebar isAdmin={isAdmin} />}

        {/* Conteúdo principal */}
        <main className="flex-1 overflow-y-auto ml-0 p-2 md:p-6 bg-gray-50 dark:bg-gray-900 w-full">
          <Routes>
              
              {/* Rotas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login /> } />
              <Route path="/reset-password" element={<ResetPasswordPage /> } />
              <Route path="/register" element={<Register /> } />
              <Route path="/about" element={<About /> } />
              <Route path="/blog/:slug" element={<BlogPost /> } />
              <Route path="/blog" element={<Blog /> } />
              <Route path="/status" element={<Status /> } />
              <Route path="/contact" element={<Contact /> } />
              <Route path="/admin/register" element={<AdminRegisterForm /> } />
              <Route path="/admin/blog" element={<AdminBlogPosts />} />
              <Route path="/admin/blog/new" element={<BlogPostEditor />} />
              <Route path="/admin/blog/edit/:postId" element={<BlogPostEditor />} />
              <Route path="/admin/about" element={<AboutAdminPanel />} />
              <Route path="/admin/contact" element={<ContactAdminPanel />} />
              <Route path="/admin/status" element={<StatusAdminPanel />} />
              <Route path="/admin/features" element={<FeaturesManager />} />
              <Route path="/privacy" element={<PrivacyPolicy /> } />
              <Route path="/terms" element={<TermsOfService /> } />
              <Route path="/features" element={<SystemFeatures /> } />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute>
                  <AdminUsersPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users/new" 
              element={
                <ProtectedRoute>
                  <AdminUserForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users/:id" 
              element={
                <ProtectedRoute>
                  <AdminUserDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users/:id/edit" 
              element={
                <ProtectedRoute>
                  <AdminUserForm />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/admin/settings" 
              element={
                <ProtectedRoute>
                  <AdminSettingsPage />
                </ProtectedRoute>
              } 
            />

            <Route
              path="/manager"
              element={
                <ProtectedRoute>
                  <ManagerProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tenants"
              element={
                <ProtectedRoute>
                  <TenantsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenants/:id"
              element={
                <ProtectedRoute>
                  <TenantDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenants/:id/edit"
              element={
                <ProtectedRoute>
                  <EditTenantPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <PaymentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments/:id"
              element={
                <ProtectedRoute>
                  <PaymentDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments/:paymentId/edit"
              element={
                <ProtectedRoute>
                  <EditPaymentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/properties"
              element={
                <ProtectedRoute>
                  <PropertiesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/properties/:id"
              element={
                <ProtectedRoute>
                  <PropertyDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/properties/:id/edit"
              element={
                <ProtectedRoute>
                  <EditPropertyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/paymenthistories"
              element={
                <ProtectedRoute>
                  <PaymentsHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <FineSettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications/:tenantId"
              element={
                <ProtectedRoute>
                  <NotificationDetailPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}