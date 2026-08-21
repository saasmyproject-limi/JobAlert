import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { RemoteJob, RemoteJobLocationStatus } from '../types';
import {
  Globe,
  Search,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  RefreshCw,
  Building2,
  Calendar,
  Sparkles,
  Plane,
  ShieldCheck,
  MapPin,
  Tag,
  Info
} from 'lucide-react';

export const RemoteJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<RemoteJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryTab, setCategoryTab] = useState<'all' | 'remote_afrique' | 'relocation'>('all');
  const [selectedSource, setSelectedSource] = useState('all');

  const fetchRemoteJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from('remote_jobs')
        .select('*')
        .neq('type_offre_final', 'aucun')
        .or('eligible_remote_afrique.eq.true,relocation_disponible.eq.true')
        .order('published_at', { ascending: false });

      if (fetchErr) throw fetchErr;

      const mapped: RemoteJob[] = (data || []).map((row: any) => ({
        id: row.id,
        title: row.title,
        company: row.company,
        source: row.source,
        sourceUrl: row.source_url,
        locationRaw: row.location_raw || 'Worldwide',
        isAfricaEligible: row.is_africa_eligible ?? true,
        locationStatus: (row.location_status || 'eligible') as RemoteJobLocationStatus,
        category: row.category || 'Tech',
        tags: row.tags || [],
        publishedAt: row.published_at ? new Date(row.published_at).toLocaleDateString('fr-FR') : 'Récemment',
        fetchedAt: row.fetched_at,
        salaryRaw: row.salary_raw,
        description: row.description,
        typeOffreFinal: row.type_offre_final || (row.relocation_disponible ? 'relocation' : 'remote_afrique'),
        eligibleRemoteAfrique: row.eligible_remote_afrique,
        confidenceRemote: row.confidence_remote,
        justificationRemote: row.justification_remote,
        relocationDisponible: row.relocation_disponible,
        confidenceRelocation: row.confidence_relocation,
        justificationRelocation: row.justification_relocation,
        paysDestinationRelocation: row.pays_destination_relocation,
        filtreRegexStatut: row.filtre_regex_statut,
        filtreRegexMotif: row.filtre_regex_motif,
      }));

      setJobs(mapped);
    } catch (err: any) {
      console.error('Erreur chargement offres remote:', err);
      setError('Impossible de charger les offres remote.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRemoteJobs();
  }, []);

  const sources = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach(j => { if (j.source) set.add(j.source); });
    return Array.from(set);
  }, [jobs]);

  const counts = useMemo(() => {
    let remoteCount = 0;
    let relocationCount = 0;
    jobs.forEach(j => {
      if (j.typeOffreFinal === 'relocation' || j.relocationDisponible) relocationCount++;
      else remoteCount++;
    });
    return { all: jobs.length, remote: remoteCount, relocation: relocationCount };
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Category Tab
      if (categoryTab === 'remote_afrique' && job.typeOffreFinal === 'relocation') return false;
      if (categoryTab === 'relocation' && job.typeOffreFinal !== 'relocation' && !job.relocationDisponible) return false;

      // Source Filter
      if (selectedSource !== 'all' && job.source !== selectedSource) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mTitle = job.title.toLowerCase().includes(q);
        const mCompany = job.company.toLowerCase().includes(q);
        const mSource = job.source.toLowerCase().includes(q);
        const mDesc = (job.description || '').toLowerCase().includes(q);
        const mCountry = (job.paysDestinationRelocation || '').toLowerCase().includes(q);
        if (!mTitle && !mCompany && !mSource && !mDesc && !mCountry) return false;
      }

      return true;
    });
  }, [jobs, categoryTab, selectedSource, searchQuery]);

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header Title */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-vert-profond text-xs sm:text-sm font-bold border border-emerald-200">
          <Globe className="w-4 h-4 text-whatsapp" />
          <span>Filtre IA & Regex Anti-Restrictions Géographiques</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-sora font-extrabold text-vert-profond tracking-tight">
          Remote Jobs & Relocation Internationales
        </h1>
        <p className="text-base sm:text-lg text-encre/70 font-medium">
          Offres en télétravail ouvertes aux talents d'Afrique & recrutements à l'étranger avec visa/relocation sponsorisés.
        </p>
      </div>

      {/* Filter Bar & Tabs */}
      <div className="bg-white rounded-[28px] p-5 sm:p-6 border border-sauge/40 shadow-subtle space-y-5">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 border-b border-sauge/30 pb-4">
          <button
            onClick={() => setCategoryTab('all')}
            className={`px-5 py-2.5 rounded-full text-xs font-sora font-bold transition-all flex items-center gap-2 ${
              categoryTab === 'all'
                ? 'bg-vert-profond text-creme shadow-sm'
                : 'bg-creme hover:bg-sauge/30 text-encre/80 border border-sauge/40'
            }`}
          >
            <span>Toutes les opportunités</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px]">{counts.all}</span>
          </button>

          <button
            onClick={() => setCategoryTab('remote_afrique')}
            className={`px-5 py-2.5 rounded-full text-xs font-sora font-bold transition-all flex items-center gap-2 ${
              categoryTab === 'remote_afrique'
                ? 'bg-emerald-700 text-creme shadow-sm'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-whatsapp" />
            <span>Remote Afrique 🌍</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-900/30 text-[10px] text-white">{counts.remote}</span>
          </button>

          <button
            onClick={() => setCategoryTab('relocation')}
            className={`px-5 py-2.5 rounded-full text-xs font-sora font-bold transition-all flex items-center gap-2 ${
              categoryTab === 'relocation'
                ? 'bg-indigo-900 text-creme shadow-sm'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200'
            }`}
          >
            <Plane className="w-3.5 h-3.5 text-amber-400" />
            <span>Relocation & Visa Sponsorisé ✈️</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-[10px] text-white">{counts.relocation}</span>
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-encre/40" />
            <input
              type="text"
              placeholder="Rechercher par mot-clé (ex: Developer, Dubai, Visa, Customer Support, Marketing)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond outline-none text-encre text-sm font-medium"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond outline-none text-encre text-sm font-semibold bg-white"
            >
              <option value="all">Toutes les sources ({sources.length})</option>
              {sources.map(src => (
                <option key={src} value={src}>{src}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Header Info */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm font-semibold text-encre/70">
          Affichage de <span className="font-extrabold text-vert-profond">{filteredJobs.length}</span> opportunités validées par l'IA Essor.
        </p>

        <button
          onClick={fetchRemoteJobs}
          className="text-xs font-bold text-vert-profond hover:text-vert-moyen flex items-center gap-1.5 bg-sauge/20 px-3 py-1.5 rounded-full transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-20 text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-vert-profond border-t-transparent mx-auto"></div>
          <p className="text-sm font-semibold text-encre/70">Filtrage et qualification IA des offres internationales...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-6 rounded-3xl bg-red-50 border border-red-200 text-center space-y-2">
          <p className="text-sm font-bold text-red-700">{error}</p>
          <button onClick={fetchRemoteJobs} className="px-4 py-2 bg-red-600 text-white rounded-full text-xs font-bold">
            Réessayer
          </button>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map(job => (
            <div
              key={job.id}
              className={`bg-white rounded-[32px] p-6 sm:p-7 border ${
                job.typeOffreFinal === 'relocation'
                  ? 'border-indigo-200 bg-indigo-50/10'
                  : 'border-sauge/40'
              } shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-5 group`}
            >
              <div className="space-y-4">
                
                {/* Header badges */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {job.typeOffreFinal === 'relocation' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-sora font-extrabold bg-indigo-100 text-indigo-900 border border-indigo-300">
                        <Plane className="w-3 h-3 text-indigo-700" />
                        Relocation / Visa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-sora font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        <Globe className="w-3 h-3 text-emerald-700" />
                        Remote Afrique
                      </span>
                    )}

                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-sora font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      Via {job.source}
                    </span>
                  </div>

                  {job.paysDestinationRelocation && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold">
                      <MapPin className="w-3 h-3 text-amber-700" />
                      {job.paysDestinationRelocation}
                    </span>
                  )}
                </div>

                {/* Title & Company */}
                <div>
                  <h3 className="text-xl font-sora font-extrabold text-vert-profond group-hover:text-vert-moyen transition-colors line-clamp-2">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-encre/70 font-semibold">
                    <Building2 className="w-4 h-4 text-vert-profond/60" />
                    <span>{job.company}</span>
                  </div>
                </div>

                {/* AI Justification Box */}
                <div className="p-3.5 rounded-2xl bg-sauge/15 border border-sauge/30 text-xs text-encre/80 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-vert-profond text-[11px] uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Validation IA Essor :</span>
                  </div>
                  <p className="italic leading-relaxed">
                    "{job.justificationRemote || job.justificationRelocation || "Offre validée sans restriction géographique stricte excluant l'Afrique."}"
                  </p>
                </div>

                {/* Description snippet */}
                <p className="text-xs text-encre/70 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-encre/70 pt-2 border-t border-sauge/30">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-vert-profond" />
                    <span>{job.locationRaw}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-vert-profond" />
                    <span>Publié: {job.publishedAt}</span>
                  </div>
                  {job.salaryRaw && job.salaryRaw !== 'Non spécifié' && (
                    <div className="flex items-center gap-1 text-emerald-800 font-extrabold">
                      <span>💰 {job.salaryRaw}</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Action row */}
              <div className="pt-3 flex items-center justify-between border-t border-sauge/20">
                <span className="text-[11px] font-bold text-vert-profond/60">
                  Ref: {job.id.slice(0, 8)}
                </span>

                <a
                  href={job.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-vert-profond text-creme hover:bg-vert-moyen font-sora font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>Postuler sur la source</span>
                  <ExternalLink className="w-3.5 h-3.5 text-or-clair" />
                </a>
              </div>

            </div>
          ))}
        </div>
      )}

      {!loading && !error && filteredJobs.length === 0 && (
        <div className="bg-white rounded-[32px] p-12 border border-sauge/40 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-sauge/30 text-vert-profond flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-sora font-bold text-vert-profond">
            Aucune offre ne correspond aux critères
          </h3>
          <p className="text-sm text-encre/70">
            Essayez de modifier votre recherche ou de changer d'onglet pour afficher d'autres opportunités.
          </p>
        </div>
      )}

    </div>
  );
};
