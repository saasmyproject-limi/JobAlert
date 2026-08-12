import React from 'react';
import { RouterProvider, useLocation, useNavigate } from './router/Router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppNavbar } from './components/AppNavbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { OffersListPage } from './pages/OffersListPage';
import { OfferDetailPage } from './pages/OfferDetailPage';
import { PublishOfferPage } from './pages/PublishOfferPage';
import { DashboardPage } from './pages/DashboardPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !user.isLoggedIn) {
      navigate('/connexion');
    }
  }, [user.isLoggedIn, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-vert-profond border-t-transparent"></div>
      </div>
    );
  }

  if (!user.isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}

function RouterSwitch() {
  const { pathname } = useLocation();

  const renderCurrentPage = () => {
    // Detail offer page: /offres/:id
    if (pathname.startsWith('/offres/') && pathname !== '/offres' && pathname !== '/offres/') {
      return <OfferDetailPage />;
    }

    switch (pathname) {
      case '/inscription':
        return <RegisterPage />;
      case '/connexion':
        return <LoginPage />;
      case '/offres':
      case '/offres/':
        return <OffersListPage />;
      case '/publier':
        return (
          <ProtectedRoute>
            <PublishOfferPage />
          </ProtectedRoute>
        );
      case '/tableau-de-bord':
        return (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        );
      case '/':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-creme text-encre font-inter flex flex-col selection:bg-or-ambre selection:text-vert-profond overflow-x-hidden">
      {/* Universal Fixed Navigation Bar */}
      <AppNavbar />

      {/* Dynamic Page Content */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Universal Footer */}
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <RouterSwitch />
      </AuthProvider>
    </RouterProvider>
  );
}

export default App;
