import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from '../router/Router';
import { Building2, MapPin, Calendar, CheckCircle2, ExternalLink, ArrowLeft, Send, Sparkles, MessageSquare, Share2, AlertCircle } from 'lucide-react';

export const OfferDetailPage: React.FC = () => {
  const { pathname } = useLocation();
  const { jobsList, applyToJob, hasApplied } = useAuth();

  // Extract ID from pathname (e.g. /offres/minfopra-admin-2026)
  const id = pathname.replace('/offres/', '');
  const job = jobsList.find((j) => j.id === id) || jobsList[0];

  const alreadyApplied = hasApplied(job.id);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(alreadyApplied);

  const handleApply = () => {
    applyToJob(job);
    setAppliedSuccess(true);
    setShowApplyModal(true);
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      
      {/* Back Button */}
      <div>
        <Link
          to="/offres"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-sauge/60 text-vert-profond font-semibold text-xs hover:bg-sauge/20 transition-all shadow-subtle"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à toutes les offres</span>
        </Link>
      </div>

      {/* Main Job Banner Card */}
      <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-sauge/40 shadow-subtle space-y-6">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="px-3.5 py-1.5 rounded-full bg-vert-profond/10 text-vert-profond border border-vert-profond/20 text-xs font-sora font-extrabold">
            {job.typeLabel}
          </span>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-whatsapp/15 text-vert-profond text-xs font-sora font-extrabold border border-whatsapp/30">
              <Sparkles className="w-3.5 h-3.5 text-whatsapp fill-whatsapp" />
              <span>{job.matchPercentage}% de correspondance WhatsApp</span>
            </span>
          </div>
        </div>

        {/* Title & Employer */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-4xl font-sora font-extrabold text-vert-profond leading-tight">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-encre/70 font-medium">
            <div className="flex items-center gap-1.5 text-vert-profond font-bold">
              <Building2 className="w-4 h-4 text-vert-moyen" />
              <span>{job.organization}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-encre/40" />
              <span>{job.location}</span>
            </div>

            <div className="flex items-center gap-1.5 text-or-ambre font-semibold">
              <Calendar className="w-4 h-4" />
              <span>Date limite : {job.deadline}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Header Bar */}
        <div className="pt-4 border-t border-sauge/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Primary Apply Button */}
            {appliedSuccess ? (
              <div className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-whatsapp/20 text-vert-profond font-sora font-extrabold text-sm border border-whatsapp/40">
                <CheckCircle2 className="w-5 h-5 text-whatsapp" />
                <span>Candidature envoyée</span>
              </div>
            ) : (
              <button
                onClick={handleApply}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-vert-profond hover:bg-vert-moyen text-creme font-sora font-extrabold text-sm sm:text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <Send className="w-4 h-4 text-or-clair" />
                <span>Postuler via JobAlert</span>
              </button>
            )}

            {/* External Link Button */}
            {job.externalUrl && (
              <a
                href={job.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Redirection vers la source officielle (${job.externalUrl})`);
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border-2 border-sauge text-vert-profond hover:bg-sauge/20 font-sora font-bold text-xs sm:text-sm transition-all"
              >
                <span>Voir plus d'infos (Source externe)</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

          </div>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: job.title, url: window.location.href });
              } else {
                alert('Lien de l\'offre copié dans le presse-papier !');
              }
            }}
            className="p-3 rounded-full text-encre/60 hover:text-vert-profond hover:bg-sauge/20 transition-colors"
            title="Partager l'offre"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Detailed Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Full Description & Requirements */}
        <div className="md:col-span-8 bg-white rounded-[32px] p-6 sm:p-8 border border-sauge/40 shadow-subtle space-y-6">
          
          <div>
            <h3 className="font-sora font-extrabold text-xl text-vert-profond mb-3">
              Description complète de l'offre
            </h3>
            <div className="text-sm text-encre/80 font-normal leading-relaxed whitespace-pre-line space-y-2">
              {job.fullDescription}
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="pt-4 border-t border-sauge/30">
              <h3 className="font-sora font-extrabold text-lg text-vert-profond mb-3">
                Critères et compétences requis
              </h3>
              <ul className="space-y-2.5">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-encre/80 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-vert-moyen shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Right Column: Info Card */}
        <div className="md:col-span-4 space-y-4">
          
          <div className="bg-creme rounded-[28px] p-6 border border-sauge/40 shadow-subtle space-y-4">
            <h4 className="font-sora font-bold text-sm text-vert-profond uppercase tracking-wider">
              Aperçu de l'offre
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-sauge/30">
                <span className="text-encre/60">Organisme</span>
                <span className="font-bold text-vert-profond">{job.organization}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sauge/30">
                <span className="text-encre/60">Catégorie</span>
                <span className="font-bold text-vert-profond">{job.category}</span>
              </div>
              {job.salary && (
                <div className="flex justify-between py-1 border-b border-sauge/30">
                  <span className="text-encre/60">Rémunération</span>
                  <span className="font-bold text-vert-moyen">{job.salary}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-sauge/30">
                <span className="text-encre/60">Publication</span>
                <span className="font-semibold text-encre/80">{job.postedDate}</span>
              </div>
            </div>

            {/* WhatsApp notification teaser */}
            <div className="p-3.5 rounded-2xl bg-white border border-whatsapp/40 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-vert-profond">
                <MessageSquare className="w-4 h-4 text-whatsapp fill-whatsapp" />
                <span>Alerte WhatsApp JobAlert</span>
              </div>
              <p className="text-[11px] text-encre/70 leading-snug">
                Cette offre a été transmise aux candidats inscrits ayant un profil correspondant à {job.matchPercentage}%.
              </p>
            </div>

          </div>

          <div className="bg-white rounded-[28px] p-6 border border-sauge/40 shadow-subtle text-center space-y-3">
            <AlertCircle className="w-6 h-6 text-or-ambre mx-auto" />
            <h4 className="font-sora font-bold text-xs text-vert-profond">
              Conseil aux candidats
            </h4>
            <p className="text-[11px] text-encre/70 leading-relaxed">
              JobAlert ne demande jamais d'argent pour postuler à une offre d'emploi ou un concours public.
            </p>
          </div>

        </div>

      </div>

      {/* Confirmation Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-encre/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 sm:p-8 space-y-5 text-center shadow-2xl animate-scaleIn border border-sauge">
            <div className="w-16 h-16 rounded-full bg-whatsapp/20 text-whatsapp flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-sora font-extrabold text-vert-profond">
                Candidature transmise !
              </h3>
              <p className="text-xs text-encre/80 leading-relaxed">
                Ta candidature pour <strong className="text-vert-profond">{job.title}</strong> a été enregistrée avec succès.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-creme border border-sauge/40 text-left text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-vert-profond">
                <MessageSquare className="w-3.5 h-3.5 text-whatsapp fill-whatsapp" />
                <span>Suivi sur WhatsApp</span>
              </div>
              <p className="text-encre/70">
                Vous recevrez la confirmation et les mises à jour sur votre numéro WhatsApp.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/tableau-de-bord"
                onClick={() => setShowApplyModal(false)}
                className="py-3 rounded-full bg-vert-profond text-creme font-sora font-bold text-xs hover:bg-vert-moyen transition-all"
              >
                Voir dans mon Tableau de bord
              </Link>
              <button
                onClick={() => setShowApplyModal(false)}
                className="py-2.5 text-xs text-encre/60 hover:text-encre font-bold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
