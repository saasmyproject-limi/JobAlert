import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from '../router/Router';
import { JobOffer, JobType } from '../types';
import { Building2, MapPin, Calendar, CheckCircle2, ExternalLink, ArrowLeft, Send, Sparkles, MessageSquare, Share2, AlertCircle } from 'lucide-react';

export const OfferDetailPage: React.FC = () => {
  const { pathname } = useLocation();
  const { applyToJob, hasApplied } = useAuth();

  // Extract ID from pathname (e.g. /offres/UUID)
  const id = pathname.replace('/offres/', '').replace('/', '');

  const [job, setJob] = useState<JobOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  useEffect(() => {
    const fetchOfferDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchErr } = await supabase
          .from('offers')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchErr || !data) {
          throw fetchErr || new Error('Offre non trouvée');
        }

        const mappedJob: JobOffer = {
          id: data.id,
          title: data.title,
          organization: data.organization,
          type: data.type as JobType,
          typeLabel:
            data.type === 'emploi-formel'
              ? 'Emploi Formel (Concours)'
              : data.type === 'emploi-informel'
              ? 'Emploi Informel / Prestation'
              : data.type === 'stage'
              ? 'Stage Académique / Pro'
              : 'Bourse d\'études',
          location: data.location,
          shortDescription: data.short_description,
          fullDescription: data.full_description,
          requirements: data.requirements || [],
          deadline: data.deadline || 'Non spécifiée',
          matchPercentage: 95,
          category: data.category || 'Général',
          externalUrl: data.external_url || undefined,
          contactWhatsApp: data.contact_whatsapp || undefined,
          contactEmail: data.contact_email || undefined,
          salary: data.salary || undefined,
          postedDate: data.created_at
            ? new Date(data.created_at).toLocaleDateString('fr-FR')
            : 'Récemment',
          isUrgent: data.is_urgent || false,
        };

        setJob(mappedJob);
        setAppliedSuccess(hasApplied(mappedJob.id));
      } catch (err: any) {
        console.error('Erreur chargement offre Supabase:', err);
        setError('Impossible de trouver l’offre demandée.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOfferDetail();
    }
  }, [id]);

  const handleApply = () => {
    if (job) {
      applyToJob(job);
      setAppliedSuccess(true);
      setShowApplyModal(true);
    }
  };

  if (loading) {
    return (
      <div className="pt-28 pb-24 px-4 max-w-4xl mx-auto text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-vert-profond border-t-transparent mx-auto"></div>
        <p className="text-sm font-semibold text-encre/70">Chargement des détails de l'offre...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="pt-28 pb-24 px-4 max-w-4xl mx-auto text-center space-y-6">
        <div className="p-8 bg-white rounded-3xl border border-sauge/40 shadow-subtle space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-2xl font-sora font-bold text-vert-profond">Offre introuvable</h2>
          <p className="text-sm text-encre/70">L'offre d'emploi demandée n'existe pas ou a été retirée.</p>
          <Link
            to="/offres"
            className="inline-block px-6 py-3 rounded-full bg-vert-profond text-creme font-sora font-bold text-xs"
          >
            Retourner à la liste des offres
          </Link>
        </div>
      </div>
    );
  }

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
                <span>Candidature enregistrée</span>
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
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-sauge/60 text-vert-profond font-sora font-bold text-xs hover:bg-sauge/20 transition-all"
              >
                <span>Site officiel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {job.contactWhatsApp && (
              <a
                href={`https://wa.me/${job.contactWhatsApp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-whatsapp/10 border border-whatsapp/40 text-vert-profond font-sora font-bold text-xs hover:bg-whatsapp/20 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-whatsapp fill-whatsapp" />
                <span>Contact Direct WhatsApp</span>
              </a>
            )}

          </div>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: job.title, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Lien de l’offre copié !');
              }
            }}
            className="p-3 rounded-full border border-sauge/40 text-encre/60 hover:text-vert-profond hover:bg-sauge/20 transition-all"
            title="Partager cette offre"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Content (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Full Description */}
          <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-sauge/40 shadow-subtle space-y-4">
            <h2 className="text-xl font-sora font-extrabold text-vert-profond">
              Description de l'opportunité
            </h2>
            <div className="prose prose-sm text-encre/80 leading-relaxed whitespace-pre-line font-medium">
              {job.fullDescription}
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-sauge/40 shadow-subtle space-y-4">
              <h2 className="text-xl font-sora font-extrabold text-vert-profond">
                Conditions & Profil recherché
              </h2>
              <ul className="space-y-2.5">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-encre/80 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-vert-moyen flex-shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Sidebar Info (1 col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-[28px] p-6 border border-sauge/40 shadow-subtle space-y-4">
            <h3 className="text-base font-sora font-extrabold text-vert-profond border-b border-sauge/30 pb-3">
              Informations clés
            </h3>

            <div className="space-y-3.5 text-xs font-semibold text-encre/80">
              <div>
                <span className="text-encre/50 block font-normal">Catégorie :</span>
                <span className="text-sm font-bold text-vert-profond">{job.category}</span>
              </div>

              {job.salary && (
                <div>
                  <span className="text-encre/50 block font-normal">Rémunération / Grille :</span>
                  <span className="text-sm font-bold text-or-ambre">{job.salary}</span>
                </div>
              )}

              <div>
                <span className="text-encre/50 block font-normal">Publiée le :</span>
                <span className="text-sm font-bold text-encre/90">{job.postedDate}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Success Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-vert-profond/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-md w-full border border-sauge shadow-2xl text-center space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-full bg-whatsapp/20 text-whatsapp flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-sora font-extrabold text-vert-profond">
                Candidature transmise !
              </h3>
              <p className="text-sm text-encre/70">
                Votre profil et vos coordonnées ont été enregistrés pour cette opportunité. Vous recevrez le suivi directement sur votre WhatsApp.
              </p>
            </div>

            <button
              onClick={() => setShowApplyModal(false)}
              className="w-full py-3.5 rounded-full bg-vert-profond text-creme font-sora font-extrabold text-sm hover:bg-vert-moyen transition-all"
            >
              Compris, merci
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
