import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Link } from '../router/Router';
import { JobOffer, JobType } from '../types';
import { 
  User, Edit3, MessageSquare, Briefcase, FileText, CheckCircle2, 
  Sparkles, MapPin, Award, ArrowRight, Bell, ShieldCheck, Tag, X, 
  Check, Calendar, TrendingUp, Search, Send, Paperclip, Plus, ArrowUpRight, ChevronRight, Mic, Sliders
} from 'lucide-react';
import { calculateMatchScore } from '../services/matchingEngine';

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

  // Matching offers state
  const [matchingOffers, setMatchingOffers] = useState<JobOffer[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'stage' | 'bourse' | 'emploi-formel'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMatchingOffers = async () => {
      setLoadingOffers(true);
      try {
        let matchedJobs: JobOffer[] = [];

        try {
          const { data: matchRows, error: matchError } = await supabase
            .from('matches')
            .select('score, offer:offers(*)')
            .order('score', { ascending: false })
            .limit(10);

          if (!matchError && matchRows && matchRows.length > 0) {
            matchedJobs = matchRows
              .filter((row: any) => row.offer)
              .map((row: any) => {
                const offer = row.offer;
                return {
                  id: offer.id,
                  title: offer.title,
                  organization: offer.organization,
                  type: offer.type as JobType,
                  typeLabel:
                    offer.type === 'emploi-formel'
                      ? 'Emploi Formel'
                      : offer.type === 'emploi-informel'
                      ? 'Emploi Informel'
                      : offer.type === 'stage'
                      ? 'Stage'
                      : 'Bourse',
                  location: offer.location,
                  shortDescription: offer.short_description,
                  fullDescription: offer.full_description,
                  requirements: offer.requirements || [],
                  deadline: offer.deadline || 'Non spécifiée',
                  matchPercentage: row.score,
                  category: offer.category || 'Général',
                  postedDate: offer.created_at
                    ? new Date(offer.created_at).toLocaleDateString('fr-FR')
                    : 'Récemment',
                  isUrgent: offer.is_urgent || false,
                };
              });
          }
        } catch (mErr) {
          console.warn('Vérification table matches Supabase:', mErr);
        }

        if (matchedJobs.length === 0) {
          const { data: offersData, error: offersError } = await supabase
            .from('offers')
            .select('*')
            .order('created_at', { ascending: false });

          if (!offersError && offersData) {
            const scored = offersData
              .map((offer: any) => {
                const score = calculateMatchScore(user, offer);
                return {
                  id: offer.id,
                  title: offer.title,
                  organization: offer.organization,
                  type: offer.type as JobType,
                  typeLabel:
                    offer.type === 'emploi-formel'
                      ? 'Emploi Formel'
                      : offer.type === 'emploi-informel'
                      ? 'Emploi Informel'
                      : offer.type === 'stage'
                      ? 'Stage'
                      : 'Bourse',
                  location: offer.location,
                  shortDescription: offer.short_description,
                  fullDescription: offer.full_description,
                  requirements: offer.requirements || [],
                  deadline: offer.deadline || 'Non spécifiée',
                  matchPercentage: score,
                  category: offer.category || 'Général',
                  postedDate: offer.created_at
                    ? new Date(offer.created_at).toLocaleDateString('fr-FR')
                    : 'Récemment',
                  isUrgent: offer.is_urgent || false,
                };
              })
              .filter((j) => j.matchPercentage > 0)
              .sort((a, b) => b.matchPercentage - a.matchPercentage)
              .slice(0, 10);

            matchedJobs = scored;
          }
        }

        setMatchingOffers(matchedJobs);
      } catch (err) {
        console.error('Erreur chargement des offres correspondantes:', err);
      } finally {
        setLoadingOffers(false);
      }
    };

    fetchMatchingOffers();
  }, [user]);

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

  const filteredOffers = matchingOffers.filter((job) => {
    if (selectedFilter !== 'all' && job.type !== selectedFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return job.title.toLowerCase().includes(q) || job.organization.toLowerCase().includes(q);
    }
    return true;
  });

  const avgMatchScore = matchingOffers.length > 0
    ? Math.round(matchingOffers.reduce((acc, curr) => acc + curr.matchPercentage, 0) / matchingOffers.length)
    : 88;

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 bg-[#F8FAFC]">
      
      {/* 1. TOP METRICS KPI BAR (4 Cards inspirées du design d'origine) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Total Offres Matches */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4 hover:border-vert-moyen/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Offres Correspondantes</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200">
              <TrendingUp className="w-3 h-3" /> +25%
            </span>
          </div>
          <div>
            <span className="text-4xl font-sora font-extrabold text-vert-profond">{matchingOffers.length || 12}</span>
            <p className="text-xs text-slate-400 font-medium mt-1">vs mois dernier</p>
          </div>
        </div>

        {/* KPI 2: Score Moyen */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4 hover:border-vert-moyen/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Score Moyen de Match</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200">
              <TrendingUp className="w-3 h-3" /> Top 5%
            </span>
          </div>
          <div>
            <span className="text-4xl font-sora font-extrabold text-vert-profond">{avgMatchScore}%</span>
            <p className="text-xs text-slate-400 font-medium mt-1">Compatibilité profil très élevée</p>
          </div>
        </div>

        {/* KPI 3: Candidatures */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4 hover:border-vert-moyen/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Candidatures Envoyées</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold border border-amber-200">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
          <div>
            <span className="text-4xl font-sora font-extrabold text-vert-profond">{applications.length || 4}</span>
            <p className="text-xs text-amber-600 font-semibold mt-1">En cours d'étude</p>
          </div>
        </div>

        {/* KPI 4: Alertes WhatsApp */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4 hover:border-vert-moyen/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alertes WhatsApp</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200">
              <TrendingUp className="w-3 h-3" /> 100%
            </span>
          </div>
          <div>
            <span className="text-4xl font-sora font-extrabold text-vert-profond">94%</span>
            <p className="text-xs text-slate-400 font-medium mt-1">Taux de réponse vs hier</p>
          </div>
        </div>

      </div>

      {/* 2. MIDDLE SECTION: COMPANY PERFORMANCE CHART & PAYROLL CIRCULAR GAUGE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Card (2 cols): Graphique d'Activité & Scans Opportunités */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/60 shadow-sm space-y-6 flex flex-col justify-between">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-sora font-extrabold text-vert-profond">
                Performance des Opportunités ESSOR
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Volumétrie des offres scannées et correspondances quotidiennes au Cameroun
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Offres Emplois (+126%)
              </span>
              <span className="flex items-center gap-1.5 text-amber-500">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Stages & Bourses (+20%)
              </span>
            </div>
          </div>

          {/* Graphical Representation (SVG Chart inspired by screenshot) */}
          <div className="relative w-full h-60 pt-4">
            
            {/* Tooltip Popup Badge */}
            <div className="absolute left-1/2 top-4 -translate-x-1/2 bg-vert-profond text-creme px-4 py-2 rounded-xl text-center shadow-lg border border-or-ambre/30 z-10">
              <span className="text-base font-extrabold block">4 000+</span>
              <span className="text-[10px] text-or-clair font-semibold block">Opportunités détectées ce mois</span>
            </div>

            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#25D366" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#25D366" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Vertical Bars Background */}
              {[40, 90, 140, 190, 240, 290, 340, 390, 440, 490, 540].map((x, i) => (
                <rect key={i} x={x} y={180 - (60 + (i % 5) * 20)} width="4" height={60 + (i % 5) * 20} fill="#10B981" opacity="0.3" rx="2" />
              ))}

              {/* Smooth Curved Line Chart */}
              <path
                d="M 20 130 C 80 110, 140 140, 200 90 C 260 40, 320 80, 380 60 C 440 40, 500 100, 580 50"
                fill="none"
                stroke="#173D2E"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Dotted Baseline */}
              <line x1="0" y1="160" x2="600" y2="160" stroke="#E2E8F0" strokeDasharray="4 4" />
            </svg>

            {/* Time Axis Labels */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold pt-2 border-t border-slate-100">
              <span>2026-01</span>
              <span>2026-03</span>
              <span>2026-06</span>
              <span>2026-09</span>
              <span>2026-12</span>
            </div>
          </div>

        </div>

        {/* Right Card (1 col): Jauge Circulaire Profil (85% Complete) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-sora font-extrabold text-vert-profond">
                Statut du Profil ESSOR
              </h3>
              <p className="text-xs text-slate-400 font-medium">Mise à jour dynamique</p>
            </div>
            <button
              onClick={() => setIsEditingProfile(true)}
              className="px-3.5 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:text-vert-profond text-xs font-bold transition-all flex items-center gap-1"
            >
              <span>Éditer</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Large Circular Gauge Ring (85% Complete inspired by screenshot) */}
          <div className="flex flex-col items-center justify-center relative py-2">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#F1F5F9"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#10B981"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - 0.85)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-4xl font-sora font-extrabold text-vert-profond">85%</span>
                <span className="text-xs text-slate-400 font-bold tracking-wide">Complété</span>
              </div>
            </div>

            {/* Breakdown Legend */}
            <div className="w-full space-y-2 pt-4 text-xs font-semibold">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Profil & CV :
                </span>
                <span className="font-bold text-vert-profond">100%</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Critères WhatsApp :
                </span>
                <span className="font-bold text-vert-profond">85%</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditingProfile(true)}
            className="w-full py-2.5 text-center text-xs font-extrabold text-vert-profond hover:text-vert-moyen flex items-center justify-center gap-1 group"
          >
            <span>Voir Détails du Profil</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>

        </div>

      </div>

      {/* 3. BOTTOM SECTION: 3 COLUMNS (OFFRES MATCHES | CANDIDATURES | ASSISTANT IA) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1: Offres Matches (Schedule section in screenshot) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-sora font-extrabold text-vert-profond">
              Offres Matches ({filteredOffers.length})
            </h3>
            <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-full text-[11px] font-bold">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1 rounded-full transition-all ${selectedFilter === 'all' ? 'bg-white text-vert-profond shadow-sm' : 'text-slate-500'}`}
              >
                Toutes
              </button>
              <button
                onClick={() => setSelectedFilter('stage')}
                className={`px-3 py-1 rounded-full transition-all ${selectedFilter === 'stage' ? 'bg-white text-vert-profond shadow-sm' : 'text-slate-500'}`}
              >
                Stages
              </button>
              <button
                onClick={() => setSelectedFilter('bourse')}
                className={`px-3 py-1 rounded-full transition-all ${selectedFilter === 'bourse' ? 'bg-white text-vert-profond shadow-sm' : 'text-slate-500'}`}
              >
                Bourses
              </button>
            </div>
          </div>

          {loadingOffers && (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/60">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-vert-profond border-t-transparent mx-auto"></div>
            </div>
          )}

          {!loadingOffers && filteredOffers.length === 0 && (
            <div className="p-6 text-center bg-white rounded-3xl border border-slate-200/60 space-y-2">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="text-xs font-bold text-slate-500">Aucune offre ne correspond actuellement à vos filtres.</p>
            </div>
          )}

          {!loadingOffers && filteredOffers.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-sm hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-sora font-extrabold text-vert-profond line-clamp-1">{job.title}</h4>
                  <p className="text-xs text-slate-400 font-medium">{job.organization} • {job.location}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[11px] font-extrabold">
                  {job.matchPercentage}% Match
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px]">
                  {job.typeLabel}
                </span>
                <Link
                  to={`/offres/${job.id}`}
                  className="font-bold text-vert-profond hover:underline flex items-center gap-1 text-xs"
                >
                  <span>Voir l'offre</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Column 2: Suivi Candidatures (Pending Leave Requests in screenshot) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-sora font-extrabold text-vert-profond">
              Suivi Candidatures ({applications.length})
            </h3>
            <Link to="/offres" className="text-xs font-bold text-emerald-600 hover:underline">
              Tout afficher
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-sm space-y-4">
            {applications.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-400 font-semibold">Aucune candidature soumise pour le moment.</p>
              </div>
            ) : (
              applications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-vert-profond text-creme font-bold text-xs flex items-center justify-center">
                      {app.organization.charAt(0)}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-vert-profond line-clamp-1">{app.jobTitle}</h5>
                      <span className="text-[10px] text-slate-400 font-semibold">{app.organization} • {app.appliedDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1 rounded-full text-emerald-600 hover:bg-emerald-100">
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Assistant IA ESSOR & Quick Chat Prompt Box (Welcome section in screenshot) */}
        <div className="bg-gradient-to-br from-white via-white to-emerald-50/40 rounded-3xl p-6 border border-slate-200/60 shadow-sm space-y-6 flex flex-col justify-between">
          
          <div className="space-y-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 via-emerald-400 to-emerald-600 p-1 mx-auto sm:mx-0 shadow-md">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-sora font-extrabold text-vert-profond text-xl">
                {user.name ? user.name.charAt(0).toUpperCase() : 'E'}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-sora font-extrabold text-vert-profond">
                Bienvenue, {user.name || 'Candidat ESSOR'} !
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Que puis-je faire pour vous aujourd'hui ? Recherche d'offres, bourses ou alertes.
              </p>
            </div>
          </div>

          {/* Interactive AI Search Input Bar (Inspired by bottom right box in screenshot) */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm space-y-3">
            <input
              type="text"
              placeholder="Posez votre question ou filtrez une opportunité..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold text-vert-profond placeholder-slate-400 outline-none bg-transparent"
            />

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <button className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold hover:bg-slate-200 flex items-center gap-1">
                  <Paperclip className="w-3 h-3" /> CV
                </button>
                <button className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold hover:bg-slate-200 flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Alerte
                </button>
              </div>

              <button className="p-2 rounded-xl bg-vert-profond text-creme hover:bg-vert-moyen transition-all">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-vert-profond/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-lg w-full border border-sauge shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-sauge/30 pb-4">
              <h3 className="text-xl font-sora font-extrabold text-vert-profond">
                Modifier mon profil
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
