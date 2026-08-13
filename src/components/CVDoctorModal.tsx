import React, { useState } from 'react';
import { JobOffer, UserProfile } from '../types';
import { Stethoscope, CheckCircle, AlertTriangle, Sparkles, X, FileText, ArrowRight } from 'lucide-react';

interface CVDoctorModalProps {
  job: JobOffer;
  user: UserProfile;
  onClose: () => void;
}

export const CVDoctorModal: React.FC<CVDoctorModalProps> = ({ job, user, onClose }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(true);

  // Compute missing vs matching skills
  const userSkillsNorm = (user.skills || []).map((s) => s.toLowerCase());
  const offerReqs = job.requirements || [];

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const req of offerReqs) {
    const isMatched = userSkillsNorm.some((s) => req.toLowerCase().includes(s) || s.includes(req.toLowerCase()));
    if (isMatched) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  }

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
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-sora font-extrabold text-vert-profond flex items-center gap-2">
              <span>CV Doctor IA ESSOR</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Diagnostic sur mesure</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Analyse comparative pour : <span className="font-bold text-vert-profond">{job.title}</span>
            </p>
          </div>
        </div>

        {/* Diagnosis Results */}
        <div className="space-y-5">
          
          {/* Match Score Summary */}
          <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-900 block">Indice d'Adéquation CV</span>
              <p className="text-xs text-emerald-700 font-medium">
                {matchedSkills.length > 0 ? 'Votre profil possède des atouts forts pour ce poste.' : 'Quelques ajustements recommandés avant de postuler.'}
              </p>
            </div>
            <span className="text-3xl font-sora font-extrabold text-emerald-700">{job.matchPercentage}%</span>
          </div>

          {/* Strong Points */}
          <div className="space-y-2">
            <h4 className="text-sm font-extrabold text-vert-profond flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Points Forts Détectés dans votre CV</span>
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs font-semibold text-slate-700">
              <p>• Domaine d'activité ({user.domain || 'Votre domaine'}) aligné avec l'offre.</p>
              <p>• Localisation et disponibilité conformes aux exigences du poste.</p>
              {matchedSkills.map((sk, i) => (
                <p key={i} className="text-emerald-700">• Compétence validée : {sk}</p>
              ))}
            </div>
          </div>

          {/* Missing Keywords & Recommendations */}
          <div className="space-y-2">
            <h4 className="text-sm font-extrabold text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Mots-clés Recommandés à Ajouter</span>
            </h4>
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2 text-xs font-semibold text-amber-900">
              {missingSkills.length > 0 ? (
                missingSkills.map((sk, i) => (
                  <p key={i}>💡 Ajoutez explicitement "<span className="font-bold">{sk}</span>" dans la section compétences de votre CV.</p>
                ))
              ) : (
                <p>🎉 Excellent ! Votre CV couvre l'ensemble des prérequis majeurs indiqués par le recruteur.</p>
              )}
            </div>
          </div>

        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-vert-profond text-creme font-sora font-bold text-xs hover:bg-vert-moyen transition-all"
          >
            Fermer le diagnostic
          </button>
        </div>

      </div>
    </div>
  );
};
