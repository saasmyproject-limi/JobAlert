import React from 'react';
import { UserCheck, Search, Cpu, BellRing } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Tu crées ton profil',
      description: 'Renseigne tes compétences, ta région (Littoral, Centre, Ouest...) et le type d\'opportunité recherché en 2 minutes.',
      icon: UserCheck,
    },
    {
      number: '02',
      title: 'On scrute les sources officielles',
      description: 'Nos robots et partenaires analysent MINFOPRA, MINESUP, et les offres publiées en direct par les recruteurs.',
      icon: Search,
    },
    {
      number: '03',
      title: 'On calcule la correspondance',
      description: 'Notre algorithme évalue le score de compatibilité entre ton expérience et les exigences de chaque offre.',
      icon: Cpu,
    },
    {
      number: '04',
      title: 'Tu reçois l\'alerte Multicanal',
      description: 'Dès qu\'un match dépasse ton seuil, une notification par Email, WhatsApp ou SMS arrive avec le lien pour postuler.',
      icon: BellRing,
    },
  ];

  return (
    <section id="comment-ca-marche" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-or-clair/30 border border-or-ambre/40 text-vert-profond text-xs sm:text-sm font-semibold">
          <span>Le parcours</span>
        </div>
        <h2 className="text-3xl sm:text-4xl min-[1100px]:text-5xl font-sora font-extrabold text-vert-profond tracking-tight">
          Comment ça marche ?
        </h2>
        <p className="text-base sm:text-lg text-encre/70 font-normal leading-relaxed">
          4 étapes simples pour recevoir automatiquement les meilleures opportunités du Cameroun sans perdre de temps.
        </p>
      </div>

      {/* Grid of 4 Steps (1 col mobile, 2 col tablet ~560-900px, 4 col desktop >900px) */}
      <div className="grid grid-cols-1 min-[560px]:grid-cols-2 min-[900px]:grid-cols-4 gap-6 lg:gap-8">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-sauge/40 shadow-subtle hover:shadow-md hover:border-or-ambre/60 transition-all duration-200 flex flex-col justify-between space-y-6 group hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Number Circle with Gold Border */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full border-2 border-or-ambre bg-or-clair/20 flex items-center justify-center font-sora font-extrabold text-or-ambre text-base group-hover:bg-or-ambre group-hover:text-vert-profond transition-colors">
                    {step.number}
                  </div>
                  <Icon className="w-6 h-6 text-vert-moyen opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Step Title */}
                <h3 className="font-sora font-bold text-lg text-vert-profond leading-snug">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-sm text-encre/70 leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>

              {/* Progress Line */}
              <div className="w-full h-1 bg-sauge/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-or-ambre transition-all duration-500"
                  style={{ width: `${(idx + 1) * 25}%` }}
                />
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
