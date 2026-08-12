import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    question: "Comment fonctionne la réception d'alertes par WhatsApp ?",
    answer: "Dès que vous créez votre profil en renseignant votre domaine, niveau d'études et numéro WhatsApp, notre algorithme analyse en continu les nouvelles opportunités publiées au Cameroun. Lorsqu'une offre correspond à votre profil, vous la recevez instantanément sous forme de notification sur WhatsApp."
  },
  {
    question: "JobAlert est-il totalement gratuit pour les candidats ?",
    answer: "Oui, l'inscription et la réception des alertes d'emploi, concours MINFOPRA et bourses sur WhatsApp sont 100% gratuites pour tous les candidats et étudiants au Cameroun."
  },
  {
    question: "Quels types d'opportunités sont publiées sur la plateforme ?",
    answer: "Nous couvrons 4 grandes catégories : les concours de la Fonction Publique (MINFOPRA, ENAM, etc.), les bourses d'études nationales et internationales (MINESUP), les emplois formels (CDI/CDD) et les prestations/offres du secteur informel (BTP, artisanat, missions)."
  },
  {
    question: "Comment les recruteurs ou particuliers peuvent-ils publier une offre ?",
    answer: "Tout recruteur ou particulier peut cliquer sur 'Publier une offre' dans le menu. Après vérification par notre équipe de modération sous 2 heures, l'annonce est validée et diffusée auprès des candidats ciblés."
  },
  {
    question: "Mes données personnelles et mon numéro WhatsApp sont-ils en sécurité ?",
    answer: "Absolument. Vos coordonnées sont strictement confidentielles et utilisées uniquement pour l'envoi de vos alertes personnalisées. Elles ne sont jamais revendues à des tiers."
  }
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sauge/30 text-vert-profond text-xs sm:text-sm font-bold border border-sauge">
          <HelpCircle className="w-4 h-4 text-vert-profond" />
          <span>Foire Aux Questions</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-sora font-extrabold text-vert-profond tracking-tight">
          Questions Fréquemment Posées (FAQ)
        </h2>
        <p className="text-base text-encre/70 max-w-xl mx-auto font-medium">
          Tout ce que vous devez savoir sur le fonctionnement de JobAlert et le traitement de vos candidatures.
        </p>
      </div>

      {/* Accordion list */}
      <div className="space-y-4">
        {FAQ_DATA.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-sauge/40 shadow-subtle overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 font-sora font-extrabold text-base sm:text-lg text-vert-profond hover:text-vert-moyen transition-colors"
              >
                <span>{item.question}</span>
                <div
                  className={`w-8 h-8 rounded-full bg-sauge/30 flex items-center justify-center text-vert-profond transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-vert-profond text-creme' : ''
                  }`}
                >
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-encre/80 leading-relaxed border-t border-sauge/20 font-medium">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
