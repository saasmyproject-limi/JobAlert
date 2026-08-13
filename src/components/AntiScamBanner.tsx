import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

interface AntiScamBannerProps {
  isRemoteOrInternational?: boolean;
}

export const AntiScamBanner: React.FC<AntiScamBannerProps> = ({ isRemoteOrInternational = true }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !isRemoteOrInternational) return null;

  return (
    <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 text-encre space-y-3 relative shadow-subtle">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-amber-500/20 text-slate-500 transition-all"
        title="Masquer l'avertissement"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <div className="space-y-1 pr-6">
          <h4 className="text-sm font-sora font-extrabold text-amber-950 flex items-center gap-2">
            <span>Alerte Sécurité — Recrutement & Remote International</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold">Vigilance ESSOR</span>
          </h4>
          <p className="text-xs text-amber-900/90 font-medium leading-relaxed">
            ESSOR protège ses candidats. **Ne verser JAMAIS d'argent** pour postuler, passer un entretien ou débloquer du matériel de travail.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-amber-500/20 text-[11px] font-semibold text-amber-950">
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <span>Frais de dossier exigés = Arnaque</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span>Vérifiez toujours le site officiel</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <span>Signalez tout abus à ESSOR</span>
        </div>
      </div>
    </div>
  );
};
