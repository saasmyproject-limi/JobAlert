import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from '../router/Router';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Menu, X, PlusCircle, Briefcase, LayoutDashboard, LogIn } from 'lucide-react';
import { EssorLogo } from './EssorLogo';

export const AppNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-creme/95 backdrop-blur-md border-b border-sauge/40 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo ESSOR Concept 3 */}
        <Link to="/">
          <EssorLogo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-encre/80">
          <Link 
            to="/" 
            className={`transition-colors py-1 px-3 rounded-full ${
              isActive('/') && pathname === '/'
                ? 'bg-vert-profond/10 text-vert-profond font-semibold'
                : 'hover:text-vert-profond hover:bg-sauge/20'
            }`}
          >
            Accueil
          </Link>
          <Link 
            to="/offres" 
            className={`transition-colors py-1 px-3 rounded-full flex items-center gap-1.5 ${
              isActive('/offres') 
                ? 'bg-vert-profond/10 text-vert-profond font-semibold'
                : 'hover:text-vert-profond hover:bg-sauge/20'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Offres d'emploi</span>
          </Link>
          <Link 
            to="/publier" 
            className={`transition-colors py-1 px-3 rounded-full flex items-center gap-1.5 ${
              isActive('/publier') 
                ? 'bg-vert-profond/10 text-vert-profond font-semibold'
                : 'hover:text-vert-profond hover:bg-sauge/20'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-or-ambre" />
            <span>Publier une offre</span>
          </Link>

          {user.isLoggedIn && (
            <Link 
              to="/tableau-de-bord" 
              className={`transition-colors py-1 px-3 rounded-full flex items-center gap-1.5 ${
                isActive('/tableau-de-bord') 
                  ? 'bg-vert-profond text-creme font-semibold shadow-sm'
                  : 'text-vert-profond bg-sauge/30 hover:bg-sauge/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Mon Tableau de bord</span>
            </Link>
          )}
        </nav>

        {/* Right Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {user.isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link
                to="/tableau-de-bord"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-sauge/60 text-vert-profond text-xs font-bold shadow-subtle hover:bg-sauge/10 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-vert-profond text-creme flex items-center justify-center text-xs font-sora">
                  {user.name.charAt(0)}
                </div>
                <span className="max-w-[120px] truncate">{user.name}</span>
              </Link>
              
              <button
                onClick={handleLogout}
                title="Se déconnecter"
                className="p-2 rounded-full text-encre/60 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/connexion"
                className="px-4 py-2 rounded-full text-vert-profond font-semibold text-sm hover:bg-sauge/20 transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>Connexion</span>
              </Link>
              <Link
                to="/inscription"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-vert-profond text-creme font-semibold text-sm hover:bg-vert-moyen transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                Créer mon profil
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          {user.isLoggedIn && (
            <Link
              to="/tableau-de-bord"
              className="w-8 h-8 rounded-full bg-vert-profond text-creme flex items-center justify-center font-bold text-xs shadow-sm"
              title="Tableau de bord"
            >
              {user.name.charAt(0)}
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-vert-profond hover:bg-sauge/30 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-creme border-b border-sauge/40 px-4 pt-3 pb-6 space-y-3 animate-fadeIn shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-2.5 rounded-xl font-medium text-sm ${
              pathname === '/' ? 'bg-vert-profond text-creme font-semibold' : 'text-encre hover:bg-sauge/20'
            }`}
          >
            Accueil
          </Link>
          <Link
            to="/offres"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm ${
              isActive('/offres') ? 'bg-vert-profond text-creme font-semibold' : 'text-encre hover:bg-sauge/20'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Offres d'emploi</span>
          </Link>
          <Link
            to="/publier"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm ${
              isActive('/publier') ? 'bg-vert-profond text-creme font-semibold' : 'text-encre hover:bg-sauge/20'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-or-ambre" />
            <span>Publier une offre</span>
          </Link>

          {user.isLoggedIn ? (
            <>
              <Link
                to="/tableau-de-bord"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm ${
                  isActive('/tableau-de-bord') ? 'bg-vert-profond text-creme font-semibold' : 'bg-sauge/30 text-vert-profond'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Mon Tableau de bord</span>
              </Link>
              <div className="pt-2 border-t border-sauge/30 flex items-center justify-between px-2">
                <span className="text-xs text-encre/70 font-semibold">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs text-red-600 font-semibold py-1 px-3 rounded-lg bg-red-50 hover:bg-red-100"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </>
          ) : (
            <div className="pt-3 border-t border-sauge/30 grid grid-cols-2 gap-2">
              <Link
                to="/connexion"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 rounded-full border border-vert-profond text-vert-profond text-center font-semibold text-sm"
              >
                Connexion
              </Link>
              <Link
                to="/inscription"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 rounded-full bg-vert-profond text-creme text-center font-semibold text-sm shadow-sm"
              >
                Créer un profil
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
