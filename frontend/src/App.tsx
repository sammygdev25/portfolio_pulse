import './App.css';
import type { ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PortfolioProvider } from './contexts/PortfolioContext';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import { Footer } from './components/ui';
import { STAFF_ROLES, homeFor } from './lib/roles';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PortfoliosPage from './pages/PortfoliosPage';
import PortfolioDetailPage from './pages/PortfolioDetailPage';
import WatchlistPage from './pages/WatchlistPage';
import AdminStocksPage from './pages/AdminStocksPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

interface RequireAuthProps { children: ReactNode }

function RequireAuth({ children }: RequireAuthProps) {
  const auth = useAuth() as { isAuthenticated?: boolean; loading?: boolean };
  if (auth && auth.loading) {
    return null;
  }
  const authed = auth && typeof auth.isAuthenticated === 'boolean' ? auth.isAuthenticated : Boolean(localStorage.getItem('token'));
  if (!authed) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

interface RequireRoleProps { roles: readonly string[]; children: ReactNode }

function RequireRole({ roles, children }: RequireRoleProps) {
  const auth = useAuth() as { isAuthenticated?: boolean; loading?: boolean; user?: { role?: string } | null };
  if (auth && auth.loading) {
    return null;
  }
  if (auth == null || auth.isAuthenticated !== true) {
    return <Navigate to="/login" replace />;
  }
  const role = (auth.user && auth.user?.role) || '';
  if (roles.indexOf(role) < 0) {
    return <Navigate to={homeFor(role)} replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <ErrorBoundary>
          <div className="ds-page">
            <Navbar />
            <main className="ds-page-main">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
                <Route path="/portfolios" element={<RequireAuth><PortfoliosPage /></RequireAuth>} />
                <Route path="/portfolios/:id" element={<RequireAuth><PortfolioDetailPage /></RequireAuth>} />
                <Route path="/watchlist" element={<RequireAuth><WatchlistPage /></RequireAuth>} />
                <Route path="/staff/stocks" element={<RequireRole roles={STAFF_ROLES}><AdminStocksPage /></RequireRole>} />
                <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer brand="Portfolio Pulse" columns={[{ title: 'Explore', links: [{ label: 'Home', to: '/' }] }]} />
          </div>
        </ErrorBoundary>
      </PortfolioProvider>
    </AuthProvider>
  );
}

export default App;
