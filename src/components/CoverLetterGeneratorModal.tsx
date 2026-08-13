import React, { useState } from 'react';
import { JobOffer, UserProfile } from '../types';
import { FileText, Copy, Download, Check, X, Sparkles } from 'lucide-react';

interface CoverLetterGeneratorModalProps {
  job: JobOffer;
  user: UserProfile;
  onClose: () => void;
}

export const CoverLetterGeneratorModal: React.FC<CoverLetterGeneratorModalProps> = ({ job, user, onClose }) => {
  const [copied, setCopied] = useState(false);

  const defaultLetterText = `[Objet : Candidature au poste de ${job.title}]

Madame, Monsieur le Responsable des Recrutements chez ${job.organization},

C'est avec un vif intérêt que je vous adresse ma candidature pour le poste de ${job.title} basé à ${job.location}.

Fort(e) de mon parcours dans le domaine de ${user.domain || 'votre secteur'} et de mon expérience (${user.experience || 'plusieurs années'}), j'ai développé des compétences clés en ${user.skills?.join(', ') || 'gestion de projets et compétences techniques'}.

L'engagement et l'excellence de ${job.organization} correspondent parfaitement à mes aspirations professionnelles. Je suis convaincu(e) de pouvoir contribuer activement à vos projets.

Je reste à votre entière disposition pour un entretien afin de vous exposer plus de vive voix mes motivations.

Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

${user.name || 'Le/La Candidat(e)'}
Téléphone / WhatsApp : ${user.phone || 'Non renseigné'}
Email : ${user.email}`;

  const [letterContent, setLetterContent] = useState(defaultLetterText);

  const handleCopy = () => {
    navigator.clipboard.writeText(letterContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([letterContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Lettre_Motivation_${job.organization.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 bg-vert-profond/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-2xl w-full border border-sauge shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-sauge/20 text-slate-500"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-sora font-extrabold text-vert-profond flex items-center gap-2">
              <span>Générateur de Lettre IA ESSOR</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">Sur mesure</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Brouillon rédigé pour : <span className="font-bold text-vert-profond">{job.organization}</span>
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-vert-profond">
            Vous pouvez personnaliser le texte ci-dessous avant de copier ou télécharger :
          </label>
          <textarea
            rows={12}
            value={letterContent}
            onChange={(e) => setLetterContent(e.target.value)}
            className="w-full p-4 rounded-2xl border border-sauge/60 focus:border-vert-profond outline-none text-xs font-medium leading-relaxed text-encre bg-slate-50/50"
          ></textarea>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-sora font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copié !' : 'Copier le texte'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-sora font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger (.txt)</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-vert-profond text-creme font-sora font-bold text-xs hover:bg-vert-moyen transition-all"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
