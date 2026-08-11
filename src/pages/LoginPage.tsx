import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from '../router/Router';
import { LogIn, ArrowRight, Eye, EyeOff, Sparkles, MessageSquare } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('jeanmarc.nkoa@gmail.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    navigate('/tableau-de-bord');
  };

  const handleQuickDemoLogin = () => {
    login('jeanmarc.nkoa@gmail.com', 'password123');
    navigate('/tableau-de-bord');
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-md mx-auto min-h-[80vh] flex flex-col justify-center">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sauge/30 text-vert-profond text-xs font-bold border border-sauge">
          <LogIn className="w-3.5 h-3.5 text-vert-profond" />
          <span>Espace Candidat & Employeur</span>
        </div>

        <h1 className="text-3xl font-sora font-extrabold text-vert-profond tracking-tight">
          Connexion à JobAlert
        </h1>
        <p className="text-sm text-encre/70">
          Accède à ton tableau de bord et gère tes alertes WhatsApp.
        </p>
      </div>

      {/* Login Form Card */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-sauge/40 shadow-subtle space-y-6">
        
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-vert-profond mb-1.5">
              Adresse Email
            </label>
            <input
              type="email"
              required
              placeholder="ex: jeanmarc@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-vert-profond">
                Mot de passe
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert("Un lien de réinitialisation vous sera envoyé sur WhatsApp."); }} className="text-xs text-encre/60 hover:text-vert-profond font-semibold">
                Oublié ?
              </a>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium pr-10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-encre/50 hover:text-vert-profond"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-4 rounded-full bg-vert-profond hover:bg-vert-moyen text-creme font-sora font-extrabold text-base transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span>Se connecter</span>
            <ArrowRight className="w-4 h-4 text-or-clair" />
          </button>

        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-sauge/40"></div>
          <span className="flex-shrink mx-4 text-xs font-bold text-encre/40 uppercase">Ou</span>
          <div className="flex-grow border-t border-sauge/40"></div>
        </div>

        {/* Quick Demo Login */}
        <button
          type="button"
          onClick={handleQuickDemoLogin}
          className="w-full py-3 rounded-full border border-whatsapp/40 bg-whatsapp/10 text-vert-profond font-sora font-bold text-xs sm:text-sm hover:bg-whatsapp/20 transition-all flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4 text-whatsapp fill-whatsapp" />
          <span>Connexion rapide Démo (Jean-Marc Nkoa)</span>
        </button>

        {/* Link to Register */}
        <div className="pt-3 border-t border-sauge/30 text-center space-y-2">
          <p className="text-sm text-encre/70 font-medium">
            Pas encore de compte ?
          </p>
          <Link
            to="/inscription"
            className="inline-block px-6 py-2.5 rounded-full border border-vert-profond text-vert-profond font-sora font-bold text-xs hover:bg-vert-profond/10 transition-all"
          >
            Créer mon profil gratuitement
          </Link>
        </div>

      </div>

    </div>
  );
};
