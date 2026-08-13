import React from 'react';
import { CreditCard, Globe, ShieldCheck, ArrowRight, DollarSign, Wallet, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Link } from '../router/Router';

export const FreelanceGuidePage: React.FC = () => {
  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="bg-vert-profond text-creme rounded-[32px] p-8 sm:p-12 space-y-4 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-whatsapp/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        <span className="px-3.5 py-1.5 rounded-full bg-or-ambre/20 text-or-ambre border border-or-ambre/30 text-xs font-sora font-extrabold inline-block">
          🌍 Guide Pratique Freelance International
        </span>
        
        <h1 className="text-3xl sm:text-5xl font-sora font-extrabold leading-tight">
          Travailler en Remote International depuis le Cameroun & l'Afrique
        </h1>
        
        <p className="text-creme/80 text-sm sm:text-base font-medium max-w-2xl">
          Toutes les solutions éprouvées pour recevoir vos paiements en Devises (USD, EUR) directement vers votre compte local ou Mobile Money (MTN / Orange).
        </p>
      </div>

      {/* Grid of Payment Solutions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Solution 1: Payoneer */}
        <div className="bg-white rounded-[28px] p-6 border border-sauge/40 shadow-subtle space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">
              💳
            </div>
            <h3 className="text-lg font-sora font-extrabold text-vert-profond">Payoneer</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Crée un compte bancaire virtuel en USD, EUR et GBP. Permet de recevoir des virement des plateformes d'emploi occidentales.
            </p>
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-700">
            <p className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Retrait DAB au Cameroun via Carte MasterCard</span>
            </p>
            <p className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Virement direct vers Mobile Money</span>
            </p>
          </div>
        </div>

        {/* Solution 2: Wise */}
        <div className="bg-white rounded-[28px] p-6 border border-sauge/40 shadow-subtle space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
              🚀
            </div>
            <h3 className="text-lg font-sora font-extrabold text-vert-profond">Wise (ex-TransferWise)</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Taux de change réels du marché sans frais cachés. Idéal pour recevoir les paiements de clients directs en Europe.
            </p>
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-700">
            <p className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Coût de conversion ultra-faible</span>
            </p>
            <p className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Transferts ultra-rapides</span>
            </p>
          </div>
        </div>

        {/* Solution 3: Direct Mobile Money & Bank */}
        <div className="bg-white rounded-[28px] p-6 border border-sauge/40 shadow-subtle space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xl">
              📱
            </div>
            <h3 className="text-lg font-sora font-extrabold text-vert-profond">Mobile Money / UBA Card</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Combinaison d'une carte prépayée Visa UBA ou Ecobank reliée à votre compte Orange Money ou MTN Mobile Money.
            </p>
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-700">
            <p className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Disponibilité instantanée des fonds</span>
            </p>
            <p className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% adapté au marché camerounais</span>
            </p>
          </div>
        </div>

      </div>

      {/* Tax & Legal Compliance Section */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-[28px] p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-sora font-extrabold text-amber-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-700" />
          <span>Statut Légal & Fiscalité au Cameroun</span>
        </h3>
        <p className="text-xs text-amber-900/80 font-medium leading-relaxed">
          Au Cameroun, l'exercice d'une activité de prestation de services ou de consulting indépendant en ligne s'effectue sous le statut d'**Etablissement Individuel** ou d'**Auto-Entrepreneur**. La création d'un NIU (Numéro d'Identifiant Unique) auprès de la Direction Générale des Impôts (DGI) s'effectue gratuitement en ligne en 10 minutes.
        </p>
      </div>

      {/* Navigation Link */}
      <div className="flex items-center justify-between bg-white rounded-full p-4 border border-sauge/40 shadow-subtle">
        <span className="text-xs font-bold text-vert-profond px-4">
          Prêt à explorer les offres remote internationales ?
        </span>
        <Link
          to="/offres"
          className="px-6 py-2.5 rounded-full bg-vert-profond text-creme font-sora font-bold text-xs hover:bg-vert-moyen transition-all flex items-center gap-2"
        >
          <span>Voir les offres remote</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};
