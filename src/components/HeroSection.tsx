import React from 'react';
import { MessageSquare, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from '../router/Router';
import { EssorLogo } from './EssorLogo';

export const HeroSection: React.FC = () => {
  return (
    <section className="pt-28 sm:pt-36 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 min-[900px]:grid-cols-12 gap-12 min-[900px]:gap-8 items-center">
        
        {/* LEFT COLUMN: Main Text & CTAs */}
        <div className="min-[900px]:col-span-7 space-y-6 text-left">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sauge/30 border border-sauge text-vert-profond text-xs sm:text-sm font-semibold tracking-wide">
            <span className="text-base">🇨🇲</span>
            <span>Fait pour le Cameroun</span>
          </div>

          {/* Main Title with Gold Underline on 'opportunité' */}
          <h1 className="text-3xl sm:text-5xl min-[1100px]:text-6xl font-sora font-extrabold text-encre leading-[1.15] tracking-tight">
            L'<span className="gold-underline text-vert-profond">opportunité</span> te trouve, avant que tu ailles la chercher.
          </h1>

          {/* Descriptive Subtitle */}
          <p className="text-base sm:text-lg text-encre/80 font-normal leading-relaxed max-w-2xl">
            ESSOR scanne en continu les concours publics, bourses officielles et offres d'emploi au Cameroun et en Afrique. Recevez des alertes ciblées par <span className="font-semibold text-vert-profond">Email, WhatsApp ou SMS</span> dès qu'une opportunité vous correspond.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <Link
              to="/inscription"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-vert-profond hover:bg-vert-moyen text-creme font-sora font-bold text-base transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-center"
            >
              <span>Créer mon profil gratuitement</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/publier"
              className="inline-flex items-center justify-center px-7 py-4 rounded-full border-2 border-vert-profond text-vert-profond hover:bg-vert-profond/10 font-sora font-bold text-base transition-all duration-200 text-center"
            >
              J'ai un poste à pourvoir
            </Link>
          </div>

          {/* Small Sub-mention */}
          <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm text-encre/70 font-medium">
            <CheckCircle2 className="w-4 h-4 text-vert-moyen shrink-0" />
            <span>Sans frais à l'inscription · Alertes Multicanal (Email, WhatsApp, SMS)</span>
          </div>

        </div>

        {/* RIGHT COLUMN: Mobile Phone Mockup */}
        <div className="min-[900px]:col-span-5 flex justify-center">
          
          <div className="relative w-full max-w-[340px] sm:max-w-[360px] bg-encre rounded-[44px] p-3.5 shadow-phone border-4 border-encre">
            
            {/* Phone Speaker Notch */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-encre rounded-full z-30 flex items-center justify-center">
              <div className="w-10 h-1 rounded-full bg-sauge/40"></div>
            </div>

            {/* Phone Screen Container */}
            <div className="bg-creme rounded-[34px] overflow-hidden pt-10 pb-6 px-4 space-y-4 text-encre border border-sauge/30 relative min-h-[540px] flex flex-col justify-between">
              
              {/* Phone Header */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-sauge/30">
                  <div>
                    <EssorLogo size="sm" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-or-ambre/20 text-vert-profond text-xs font-sora font-bold border border-or-ambre/40 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-or-ambre fill-or-ambre" />
                    <span>3 nouvelles</span>
                  </span>
                </div>

                {/* 3 Dummy Job Cards */}
                <div className="space-y-3 mt-3">
                  
                  {/* Card 1 */}
                  <div className="p-3 rounded-2xl bg-white border border-sauge/40 shadow-subtle space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-sora font-bold text-vert-profond">Assistant Comptable</span>
                      <span className="px-2 py-0.5 rounded-md bg-vert-profond/10 text-vert-profond font-semibold text-[10px]">CDI</span>
                    </div>
                    <p className="text-[11px] text-encre/70 font-medium">Brasseries du Cameroun · Douala</p>
                    <div className="flex items-center justify-between text-[10px] text-encre/50 pt-1 border-t border-sauge/20">
                      <span>Il y a 10 min</span>
                      <span className="font-semibold text-vert-moyen">Match 95%</span>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="p-3 rounded-2xl bg-white border border-sauge/40 shadow-subtle space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-sora font-bold text-vert-profond">Bourse Excellence MINESUP</span>
                      <span className="px-2 py-0.5 rounded-md bg-or-ambre/20 text-vert-profond font-semibold text-[10px]">Bourse 100%</span>
                    </div>
                    <p className="text-[11px] text-encre/70 font-medium">Master & Doctorat · Yaoundé</p>
                    <div className="flex items-center justify-between text-[10px] text-encre/50 pt-1 border-t border-sauge/20">
                      <span>Il y a 35 min</span>
                      <span className="font-semibold text-or-ambre">Match 88%</span>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="p-3 rounded-2xl bg-white border border-sauge/40 shadow-subtle space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-sora font-bold text-vert-profond">Stage Marketing Digital</span>
                      <span className="px-2 py-0.5 rounded-md bg-sauge/40 text-vert-profond font-semibold text-[10px]">Stage Pro</span>
                    </div>
                    <p className="text-[11px] text-encre/70 font-medium">Orange Cameroun · Akwa, Douala</p>
                    <div className="flex items-center justify-between text-[10px] text-encre/50 pt-1 border-t border-sauge/20">
                      <span>Il y a 1h</span>
                      <span className="font-semibold text-vert-moyen">Match 90%</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom Phone Space & Floating Animated WhatsApp Notification Bubble */}
              <div className="relative pt-8">
                
                <div className="whatsapp-notification-loop bg-white rounded-2xl p-3.5 border-2 border-whatsapp shadow-lg text-left space-y-2">
                  
                  {/* Header Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-whatsapp flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        <MessageSquare className="w-3.5 h-3.5 fill-white" />
                      </div>
                      <span className="font-sora font-bold text-xs text-vert-profond">ESSOR</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-whatsapp/15 text-vert-profond text-[10px] font-sora font-extrabold border border-whatsapp/30">
                      92% match
                    </span>
                  </div>

                  {/* Text Body */}
                  <p className="text-[11px] text-encre/90 leading-snug font-medium">
                    Nouvelle offre pour toi : <strong>Développeur Junior à Douala, CDI</strong>. Tape 'voir' pour postuler.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
