import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Link } from '../router/Router';
import { JobOffer, JobType } from '../types';
import { User, Edit3, MessageSquare, Briefcase, FileText, CheckCircle2, Sparkles, MapPin, Award, ArrowRight, Bell, ShieldCheck, Tag, X, Check, Calendar } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, applications, updateProfile } = useAuth();

  // Edit profile modal state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editDomain, setEditDomain] = useState(user.domain);
  const [editEducation, setEditEducation] = useState(user.education);
  const [editExperience, setEditExperience] = useState(user.experience);
  const [editLocation, setEditLocation] = useState(user.location);

  // Matching offers state (dernières offres publiées depuis Supabase)
  const [matchingOffers, setMatchingOffers] = useState<JobOffer[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(true);

  // TODO: remplacer par le vrai moteur de matching
  useEffect(() => {
    const fetchLatestOffers = async () => {
      setLoadingOffers(true);
      try {
        const { data, error } = await supabase
          .from('offers')
          .select('*')
          .eq('moderation_status', 'publiee')
          .order('created_at', { ascending: false })
          .limit(4);

        if (error) throw error;

        const mappedJobs: JobOffer[] = (data || []).map((row: any) => ({
          id: row.id,
          title: row.title,
          organization: row.organization,
          type: row.type as JobType,
          typeLabel:
            row.type === 'emploi-formel'
              ? 'Emploi Formel'
              : row.type === 'emploi-informel'
              ? 'Emploi Informel'
              : row.type === 'stage'
              ? 'Stage'
              : 'Bourse',
          location: row.location,
          shortDescription: row.short_description,
          fullDescription: row.full_description,
          requirements: row.requirements || [],
          deadline: row.deadline || 'Non spécifiée',
          matchPercentage: 96,
          category: row.category || 'Général',
          postedDate: row.created_at
            ? new Date(row.created_at).toLocaleDateString('fr-FR')
            : 'Récemment',
          isUrgent: row.is_urgent || false,
        }));

        setMatchingOffers(mappedJobs);
      } catch (err) {
        console.error('Erreur chargement offres récentes tableau de bord:', err);
      } finally {
        setLoadingOffers(false);
      }
    };

    fetchLatestOffers();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name: editName,
      phone: editPhone,
      domain: editDomain,
      education: editEducation,
      experience: editExperience,
      location: editLocation,
    });
    setIsEditingProfile(false);
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Envoyée':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'En cours d\'examen':
        return 'bg-or-ambre/20 text-vert-profond border-or-ambre/40';
      case 'Entretien programmé':
        return 'bg-whatsapp/20 text-vert-profond border-whatsapp/40';
      case 'Retenue':
        return 'bg-vert-profond text-creme border-vert-profond';
      default:
        return 'bg-sauge/30 text-vert-profond border-sauge';
    }
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* 1. Header Profile Summary Card */}
      <div className="bg-gradient-to-br from-vert-profond via-vert-profond to-vert-moyen rounded-[36px] p-6 sm:p-10 text-creme shadow-xl relative overflow-hidden space-y-6">
        
        {/* Background Decorative Accent */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-or-ambre/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          {/* User Info Avatar & Title */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-or-ambre text-vert-profond font-sora font-extrabold text-2xl sm:text-3xl flex items-center justify-center shadow-lg border-2 border-or-clair">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-sora font-extrabold text-white">
                  {user.name || 'Profil Candidate JobAlert'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-whatsapp/20 text-whatsapp border border-whatsapp/40 text-[11px] font-bold">
                  Profil vérifié (Supabase)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-creme/80 font-medium">
                <span>{user.email}</span>
                {user.phone && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-whatsapp font-bold">
                      <MessageSquare className="w-3.5 h-3.5 fill-whatsapp" />
                      {user.phone}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={() => {
              setEditName(user.name);
              setEditPhone(user.phone);
              setEditDomain(user.domain);
              setEditEducation(user.education);
              setEditExperience(user.experience);
              setEditLocation(user.location);
              setIsEditingProfile(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-creme/30 text-creme font-sora font-bold text-xs sm:text-sm transition-all hover:shadow-md"
          >
            <Edit3 className="w-4 h-4 text-or-clair" />
            <span>Modifier mon profil</span>
          </button>

        </div>

        {/* Profile Attributes Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-creme/15 relative z-10 text-xs font-semibold">
          <div className="bg-white/5 rounded-2xl p-3 border border-creme/10">
            <span className="text-creme/60 block text-[11px]">Domaine :</span>
            <span className="text-white font-bold truncate block">{user.domain || 'Non renseigné'}</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-creme/10">
            <span className="text-creme/60 block text-[11px]">Niveau d'études :</span>
            <span className="text-white font-bold truncate block">{user.education || 'Non renseigné'}</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-creme/10">
            <span className="text-creme/60 block text-[11px]">Expérience :</span>
            <span className="text-white font-bold truncate block">{user.experience || 'Non renseignée'}</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-creme/10">
            <span className="text-creme/60 block text-[11px]">Localisation :</span>
            <span className="text-white font-bold truncate block">{user.location || 'Non renseignée'}</span>
          </div>
        </div>

      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 cols) - Matching Jobs & Applications */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Matching Jobs Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-or-ambre fill-or-ambre" />
                <h2 className="text-xl font-sora font-extrabold text-vert-profond">
                  Offres récentes pour vous (Supabase)
                </h2>
              </div>
              <Link to="/offres" className="text-xs font-bold text-vert-profond hover:underline flex items-center gap-1">
                <span>Tout voir</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loadingOffers && (
              <div className="p-8 text-center bg-white rounded-3xl border border-sauge/40">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-vert-profond border-t-transparent mx-auto"></div>
              </div>
            )}

            {/* TODO: remplacer par le vrai moteur de matching */}
            {!loadingOffers && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matchingOffers.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-3xl p-5 border border-sauge/40 shadow-subtle hover:shadow-card transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-sauge/30 text-vert-profond text-[11px] font-extrabold">
                          {job.typeLabel}
                        </span>
                        <span className="text-[11px] font-bold text-whatsapp">
                          {job.matchPercentage}% Match
                        </span>
                      </div>

                      <h3 className="text-base font-sora font-extrabold text-vert-profond line-clamp-2">
                        {job.title}
                      </h3>

                      <p className="text-xs text-encre/70 line-clamp-2">
                        {job.shortDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-sauge/30 flex items-center justify-between">
                      <span className="text-[11px] text-encre/60 font-semibold">{job.location}</span>
                      <Link
                        to={`/offres/${job.id}`}
                        className="px-4 py-2 rounded-full bg-vert-profond text-creme font-sora font-bold text-xs hover:bg-vert-moyen transition-all"
                      >
                        Voir
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Applications History */}
          <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-sauge/40 shadow-subtle space-y-5">
            <div className="flex items-center justify-between border-b border-sauge/30 pb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-vert-profond" />
                <h2 className="text-xl font-sora font-extrabold text-vert-profond">
                  Mes Candidatures ({applications.length})
                </h2>
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <FileText className="w-10 h-10 text-sauge/80 mx-auto" />
                <p className="text-sm font-semibold text-encre/70">
                  Vous n'avez pas encore postulé à une offre.
                </p>
                <Link
                  to="/offres"
                  className="inline-block px-5 py-2.5 rounded-full bg-vert-profond text-creme text-xs font-bold font-sora"
                >
                  Parcourir les offres
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl border border-sauge/40 bg-creme/50 hover:bg-creme transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-vert-profond">
                        {app.jobTitle}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-encre/70 font-medium">
                        <span>{app.organization}</span>
                        <span>•</span>
                        <span>{app.location}</span>
                        <span>•</span>
                        <span>Postulé le {app.appliedDate}</span>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-center ${getStatusBadgeStyle(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (1 col) - WhatsApp Alerts & CV Status */}
        <div className="space-y-8">
          
          {/* WhatsApp Alerts Status Card */}
          <div className="bg-white rounded-[32px] p-6 border border-sauge/40 shadow-subtle space-y-4">
            <div className="flex items-center gap-3 border-b border-sauge/30 pb-4">
              <div className="w-10 h-10 rounded-full bg-whatsapp/15 text-whatsapp flex items-center justify-center">
                <MessageSquare className="w-5 h-5 fill-whatsapp" />
              </div>
              <div>
                <h3 className="text-base font-sora font-extrabold text-vert-profond">
                  Alertes WhatsApp
                </h3>
                <p className="text-xs text-whatsapp font-bold">Actives & Connectées</p>
              </div>
            </div>

            <p className="text-xs text-encre/70 leading-relaxed">
              Vos alertes sont configurées pour recevoir les opportunités correspondant à vos critères au numéro <span className="font-bold text-vert-profond">{user.phone || 'non renseigné'}</span>.
            </p>
          </div>

        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-vert-profond/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-lg w-full border border-sauge shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-sauge/30 pb-4">
              <h3 className="text-xl font-sora font-extrabold text-vert-profond">
                Modifier mon profil (Supabase)
              </h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-2 rounded-full hover:bg-sauge/20 text-encre/60 hover:text-vert-profond"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-vert-profond mb-1">Nom complet</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-sauge/60 focus:border-vert-profond outline-none"
                />
              </div>

              <div>
                <label className="block text-vert-profond mb-1">Numéro WhatsApp</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-sauge/60 focus:border-vert-profond outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-vert-profond mb-1">Domaine</label>
                  <input
                    type="text"
                    value={editDomain}
                    onChange={(e) => setEditDomain(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-sauge/60 focus:border-vert-profond outline-none"
                  />
                </div>

                <div>
                  <label className="block text-vert-profond mb-1">Niveau d'études</label>
                  <input
                    type="text"
                    value={editEducation}
                    onChange={(e) => setEditEducation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-sauge/60 focus:border-vert-profond outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-vert-profond mb-1">Expérience</label>
                  <input
                    type="text"
                    value={editExperience}
                    onChange={(e) => setEditExperience(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-sauge/60 focus:border-vert-profond outline-none"
                  />
                </div>

                <div>
                  <label className="block text-vert-profond mb-1">Ville</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-sauge/60 focus:border-vert-profond outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-5 py-2.5 rounded-full border border-sauge/60 text-encre/70 font-sora font-bold text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-vert-profond text-creme font-sora font-bold text-xs hover:bg-vert-moyen transition-all"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
