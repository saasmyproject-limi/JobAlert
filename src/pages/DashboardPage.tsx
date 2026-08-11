import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from '../router/Router';
import { UserProfile, JobOffer } from '../types';
import { User, Edit3, MessageSquare, Briefcase, FileText, CheckCircle2, Sparkles, MapPin, Award, ArrowRight, Bell, ShieldCheck, Tag, X, Check } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, applications, jobsList, updateProfile } = useAuth();

  // Edit profile modal state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editDomain, setEditDomain] = useState(user.domain);
  const [editEducation, setEditEducation] = useState(user.education);
  const [editExperience, setEditExperience] = useState(user.experience);
  const [editLocation, setEditLocation] = useState(user.location);
  const [alertsActive, setAlertsActive] = useState(true);

  // Matching offers for the dashboard (top 3-4 sorted by matchPercentage)
  const matchingOffers = jobsList.slice(0, 4);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
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
              {user.name.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-sora font-extrabold text-white">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-whatsapp/20 text-whatsapp border border-whatsapp/40 text-[11px] font-bold">
                  Profil vérifié
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-creme/80 font-medium">
                <span>{user.email}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-whatsapp font-bold">
                  <MessageSquare className="w-3.5 h-3.5 fill-whatsapp" />
                  {user.phone}
                </span>
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

        {/* Profile Attributes Badges Grid */}
        <div className="pt-6 border-t border-creme/15 grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10 text-xs">
          
          <div className="bg-white/10 rounded-2xl p-3.5 backdrop-blur-sm border border-creme/10 space-y-1">
            <span className="text-creme/60 uppercase tracking-wider text-[10px] font-bold block">Domaine</span>
            <span className="font-bold text-white block truncate">{user.domain}</span>
          </div>

          <div className="bg-white/10 rounded-2xl p-3.5 backdrop-blur-sm border border-creme/10 space-y-1">
            <span className="text-creme/60 uppercase tracking-wider text-[10px] font-bold block">Niveau d'études</span>
            <span className="font-bold text-white block truncate">{user.education}</span>
          </div>

          <div className="bg-white/10 rounded-2xl p-3.5 backdrop-blur-sm border border-creme/10 space-y-1">
            <span className="text-creme/60 uppercase tracking-wider text-[10px] font-bold block">Expérience</span>
            <span className="font-bold text-white block truncate">{user.experience}</span>
          </div>

          <div className="bg-white/10 rounded-2xl p-3.5 backdrop-blur-sm border border-creme/10 space-y-1">
            <span className="text-creme/60 uppercase tracking-wider text-[10px] font-bold block">Ville</span>
            <span className="font-bold text-white block truncate">{user.location}</span>
          </div>

        </div>

        {/* WhatsApp Alert Status Control */}
        <div className="bg-white/10 rounded-2xl p-4 border border-creme/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${alertsActive ? 'bg-whatsapp animate-ping' : 'bg-red-400'}`}></div>
            <div>
              <p className="font-bold text-white">
                Alertes WhatsApp : {alertsActive ? 'ACTIVES (Envois en direct)' : 'EN PAUSE'}
              </p>
              <p className="text-creme/70 text-[11px]">
                Vous recevez les opportunités correspondant à votre profil au +237 {user.phone}
              </p>
            </div>
          </div>

          <button
            onClick={() => setAlertsActive(!alertsActive)}
            className="px-4 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-all shrink-0"
          >
            {alertsActive ? 'Mettre en pause' : 'Réactiver les alertes'}
          </button>
        </div>

      </div>

      {/* 2. Section "Offres correspondantes à ton profil" */}
      <div className="space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-or-ambre fill-or-ambre" />
            <h2 className="font-sora font-extrabold text-xl text-vert-profond">
              Offres correspondantes à ton profil
            </h2>
          </div>

          <Link
            to="/offres"
            className="text-xs font-bold text-vert-profond hover:text-vert-moyen flex items-center gap-1"
          >
            <span>Voir toutes les offres</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3-4 Dummy matching job cards in same style as offer list page */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {matchingOffers.map((job) => (
            <Link
              key={job.id}
              to={`/offres/${job.id}`}
              className="group bg-white rounded-[24px] p-5 border border-sauge/40 shadow-subtle hover:shadow-lg hover:border-vert-profond/40 transition-all duration-200 flex flex-col justify-between space-y-3 hover:-translate-y-0.5"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sora font-bold bg-vert-profond/10 text-vert-profond">
                    {job.typeLabel.split(' ')[0]}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-whatsapp/15 text-vert-profond text-[10px] font-sora font-extrabold border border-whatsapp/30">
                    {job.matchPercentage}% match
                  </span>
                </div>

                <h3 className="font-sora font-bold text-sm text-vert-profond group-hover:text-vert-moyen line-clamp-2 leading-snug">
                  {job.title}
                </h3>

                <p className="text-xs text-encre/60 font-medium">
                  {job.organization} · {job.location}
                </p>
              </div>

              <div className="pt-3 border-t border-sauge/30 flex items-center justify-between text-[11px] font-semibold text-vert-profond">
                <span>Limite : {job.deadline}</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>

      </div>

      {/* 3. Section "Mes candidatures" */}
      <div className="space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-vert-moyen" />
            <h2 className="font-sora font-extrabold text-xl text-vert-profond">
              Mes candidatures ({applications.length})
            </h2>
          </div>
        </div>

        {applications.length > 0 ? (
          <div className="bg-white rounded-[28px] border border-sauge/40 shadow-subtle overflow-hidden">
            
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-creme/70 border-b border-sauge/30 text-vert-profond font-sora font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-4 px-6">Offre / Postulée</th>
                    <th className="py-4 px-4">Organisme</th>
                    <th className="py-4 px-4">Ville</th>
                    <th className="py-4 px-4">Date de postulation</th>
                    <th className="py-4 px-6 text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sauge/20 font-medium text-encre/80">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-sauge/10 transition-colors">
                      <td className="py-4 px-6 font-bold text-vert-profond">
                        <Link to={`/offres/${app.jobId}`} className="hover:underline">
                          {app.jobTitle}
                        </Link>
                      </td>
                      <td className="py-4 px-4">{app.organization}</td>
                      <td className="py-4 px-4">{app.location}</td>
                      <td className="py-4 px-4">{app.appliedDate}</td>
                      <td className="py-4 px-6 text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-sora font-extrabold border ${getStatusBadgeStyle(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden divide-y divide-sauge/30">
              {applications.map((app) => (
                <div key={app.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-sora font-extrabold border ${getStatusBadgeStyle(app.status)}`}>
                      {app.status}
                    </span>
                    <span className="text-[10px] text-encre/50">{app.appliedDate}</span>
                  </div>
                  <h3 className="font-sora font-bold text-sm text-vert-profond">
                    {app.jobTitle}
                  </h3>
                  <p className="text-xs text-encre/70">
                    {app.organization} · {app.location}
                  </p>
                </div>
              ))}
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-[28px] p-8 text-center space-y-3 border border-sauge/40">
            <p className="text-xs text-encre/70 font-medium">
              Tu n'as pas encore envoyé de candidature.
            </p>
            <Link
              to="/offres"
              className="inline-block px-6 py-2 rounded-full bg-vert-profond text-creme font-bold text-xs hover:bg-vert-moyen"
            >
              Découvrir les offres disponibles
            </Link>
          </div>
        )}

      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-encre/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-scaleIn border border-sauge max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-sauge/30 pb-4">
              <h3 className="text-xl font-sora font-extrabold text-vert-profond">
                Modifier mon profil
              </h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-1 rounded-full text-encre/60 hover:bg-sauge/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs sm:text-sm">
              
              <div>
                <label className="block font-semibold text-vert-profond mb-1">Nom et Prénom</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-sauge/60 focus:border-vert-profond outline-none text-encre font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-vert-profond mb-1">Numéro WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-sauge/60 focus:border-vert-profond outline-none text-encre font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-vert-profond mb-1">Domaine</label>
                  <input
                    type="text"
                    value={editDomain}
                    onChange={(e) => setEditDomain(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-sauge/60 focus:border-vert-profond outline-none text-encre font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-vert-profond mb-1">Niveau d'études</label>
                  <input
                    type="text"
                    value={editEducation}
                    onChange={(e) => setEditEducation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-sauge/60 focus:border-vert-profond outline-none text-encre font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-vert-profond mb-1">Expérience</label>
                  <input
                    type="text"
                    value={editExperience}
                    onChange={(e) => setEditExperience(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-sauge/60 focus:border-vert-profond outline-none text-encre font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-vert-profond mb-1">Ville</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-sauge/60 focus:border-vert-profond outline-none text-encre font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-5 py-2.5 rounded-full border border-sauge text-encre/70 font-bold"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-vert-profond text-creme font-bold hover:bg-vert-moyen flex items-center gap-1.5 shadow-md"
                >
                  <Check className="w-4 h-4 text-or-clair" />
                  <span>Enregistrer les modifications</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
