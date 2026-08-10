import React from 'react';

export const CoverageSection: React.FC = () => {
  const coverageItems = [
    {
      emoji: '💼',
      title: 'Emploi formel',
      description: 'Postes en CDI, CDD et cadres dans les entreprises structurées, multinationales et organismes au Cameroun.',
    },
    {
      emoji: '🛠️',
      title: 'Emploi informel',
      description: 'Recrutements directs, chauffeurs, techniciens, commerciaux terrain et missions indépendantes à paiement rapide.',
    },
    {
      emoji: '🎓',
      title: 'Stages',
      description: 'Stages académiques et professionnels pour étudiants et jeunes diplômés désireux d\'acquérir une première expérience.',
    },
    {
      emoji: '📚',
      title: 'Bourses d\'études',
      description: 'Bourses de licence, master, doctorat et coopérations internationales répertoriées par le MINESUP et partenaires.',
    },
  ];

  return (
    <section id="ce-qu-on-couvre" className="py-16 md:py-24 bg-vert-profond text-creme px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-vert-moyen/60 border border-sauge/30 text-or-clair text-xs sm:text-sm font-semibold">
            <span>Ce qu'on couvre</span>
          </div>
          <h2 className="text-3xl sm:text-4xl min-[1100px]:text-5xl font-sora font-extrabold text-creme tracking-tight">
            Toutes les opportunités sur une seule plateforme
          </h2>
          <p className="text-base sm:text-lg text-creme/80 font-normal leading-relaxed">
            Du secteur formel au secteur informel, des stages d'études aux bourses de doctorat, ne manquez aucune annonce.
          </p>
        </div>

        {/* 4 Semi-Transparent Cards Grid (1 col mobile, 2 col tablet ~560-900px, 4 col desktop >900px) */}
        <div className="grid grid-cols-1 min-[560px]:grid-cols-2 min-[900px]:grid-cols-4 gap-6 lg:gap-8">
          {coverageItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-vert-moyen/30 border border-sauge/20 p-6 sm:p-8 rounded-3xl backdrop-blur-sm space-y-4 hover:border-or-ambre/60 hover:bg-vert-moyen/50 transition-all duration-200 group hover:-translate-y-1"
            >
              {/* Emoji Icon */}
              <div className="text-4xl p-3 bg-vert-profond/60 w-14 h-14 rounded-2xl border border-sauge/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                {item.emoji}
              </div>

              {/* Title */}
              <h3 className="font-sora font-bold text-xl text-creme group-hover:text-or-clair transition-colors">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-creme/80 leading-relaxed font-normal">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
