import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from '../router/Router';
import { LogIn, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Vérifie si l'utilisateur revient après avoir cliqué sur le lien de confirmation
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      const hash = window.location.hash;
      if (search.includes('confirmed=true') || hash.includes('type=signup') || hash.includes('access_token')) {
        setSuccessMessage('🎉 Votre adresse e-mail a été confirmée avec succès ! Vous pouvez maintenant vous connecter.');
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/tableau-de-bord');
    } else {
      setErrorMessage(result.error || 'Identifiants incorrects ou problème de connexion.');
    }
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
          Connexion à ESSOR
        </h1>
        <p className="text-sm text-encre/70">
          Accède à ton tableau de bord et gère tes alertes WhatsApp.
        </p>
      </div>

      {/* Login Form Card */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-sauge/40 shadow-subtle space-y-6">
        
        {/* Success Banner */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-whatsapp/15 border border-whatsapp/40 text-vert-profond text-xs font-semibold flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-whatsapp flex-shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-vert-profond mb-1.5">
              Adresse Email
            </label>
            <input
              type="email"
              required
              placeholder="ex: candidat@gmail.com"
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
            disabled={isSubmitting}
            className="w-full py-4 rounded-full bg-vert-profond hover:bg-vert-moyen text-creme font-sora font-extrabold text-base transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Connexion en cours...' : 'Se connecter'}</span>
            <ArrowRight className="w-4 h-4 text-or-clair" />
          </button>

        </form>

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
