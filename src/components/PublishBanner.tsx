import React from 'react';
import { PlusCircle, ArrowRight } from 'lucide-react';

export const PublishBanner: React.FC = () => {
  return (
    <section id="publier-une-offre" className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Big Card with Gold Gradient (or-clair to or-ambre) */}
      <div className="bg-gradient-to-r from-or-clair via-or-ambre to-or-ambre rounded-[36px] p-8 sm:p-12 lg:p-16 shadow-gold border border-or-ambre/40 flex flex-col min-[900px]:flex-row items-center justify-between gap-8 text-center min-[900px]:text-left">
        
        {/* Left Column: Title & Text */}
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-vert-profond/10 text-vert-profond text-xs sm:text-sm font-bold border border-vert-profond/20">
            <PlusCircle className="w-4 h-4 text-vert-profond" />
            <span>Espace Recruteurs & Employeurs</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sora font-extrabold text-vert-profond tracking-tight leading-tight">
            Tu as un poste, une mission ou un besoin ?
          </h2>

          <p className="text-base sm:text-lg text-vert-profond/90 font-medium leading-relaxed">
            Publie ton offre d'emploi, ton appel à stage ou ton besoin de recrutement direct. Atteins instantanément des milliers de candidats qualifiés partout au Cameroun par notification WhatsApp.
          </p>
        </div>

        {/* Right Column: CTA Button in Vert Profond */}
        <div className="shrink-0">
          <a
            href="#form-publier"
            className="inline-flex items-center gap-3 px-8 py-5 rounded-full bg-vert-profond hover:bg-vert-moyen text-creme font-sora font-extrabold text-base sm:text-lg transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 text-center"
          >
            <span>Publier une offre</span>
            <ArrowRight className="w-5 h-5 text-or-clair" />
          </a>
        </div>

      </div>

    </section>
  );
};
