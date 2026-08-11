import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from '../router/Router';

export const FinalCTA: React.FC = () => {
  return (
    <section id="creer-profil" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      <div className="bg-white rounded-[40px] p-8 sm:p-14 lg:p-16 border border-sauge/40 shadow-subtle space-y-8 relative overflow-hidden">
        
        {/* Subtle Background Glow Accent */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-or-clair/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sauge/30 text-vert-profond text-xs sm:text-sm font-semibold border border-sauge">
            <Sparkles className="w-4 h-4 text-or-ambre fill-or-ambre" />
            <span>Rejoins la communauté JobAlert</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-sora font-extrabold text-vert-profond tracking-tight leading-tight">
            Laisse JobAlert chercher pendant que tu avances.
          </h2>

          <p className="text-base sm:text-lg text-encre/80 font-normal leading-relaxed">
            Ne passe plus des heures à rafraîchir les sites d'annonces. Configure tes préférences en 2 minutes et reçois tes alertes d'emploi, de stage ou de bourse sur WhatsApp.
          </p>

        </div>

        {/* CTA Button */}
        <div className="relative z-10 pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/inscription"
            className="inline-flex items-center justify-center gap-2 px-9 py-5 rounded-full bg-vert-profond hover:bg-vert-moyen text-creme font-sora font-extrabold text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 text-center w-full sm:w-auto"
          >
            <span>Créer mon profil gratuitement</span>
            <ArrowRight className="w-5 h-5 text-or-clair" />
          </Link>
        </div>

        <p className="relative z-10 text-xs text-encre/60 font-medium">
          Inscription 100% gratuite · Sans spam · Désinscription en un clic
        </p>

      </div>
    </section>
  );
};
