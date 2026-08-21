import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from '../router/Router';
import { JobType, JobOffer } from '../types';
import {
  Search,
  MapPin,
  Filter,
  Sparkles,
  Calendar,
  ArrowRight,
  Building2,
  CheckCircle2,
  RefreshCw,
  Globe,
  ExternalLink,
  Tag,
  AlertTriangle,
  FileText
} from 'lucide-react';

export const OffersListPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<JobType | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [expiryFilter, setExpiryFilter] = useState<'active' | 'all' | 'expired'>('active');

  // Chargement depuis Supabase
  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedType !== 'all') {
        query = query.eq('type', selectedType);
      }

      if (selectedLocation !== 'all') {
        query = query.ilike('location', `%${selectedLocation}%`);
      }

      const { data, error: fetchErr } = await query;

      if (fetchErr) {
        throw fetchErr;
      }

      const mappedJobs: JobOffer[] = (data || []).map((row: any) => ({
        id: row.id,
        title: row.title,
        organization: row.organization,
        type: row.type as JobType,
        typeLabel:
          row.type === 'emploi-formel'
            ? 'Emploi Formel (Concours)'
            : row.type === 'emploi-informel'
            ? 'Emploi Informel / Prestation'
            : row.type === 'stage'
            ? 'Stage Académique / Pro'
            : 'Bourse d\'études',
        location: row.city || row.location || 'Douala / Yaoundé',
        shortDescription: row.short_description || row.title,
        fullDescription: row.full_description || row.title,
        requirements: row.requirements || [],
        deadline: row.deadline || 'Non spécifiée',
        matchPercentage: 92,
        category: row.category || 'Général',
        externalUrl: row.external_url || undefined,
        contactWhatsApp: row.contact_whatsapp || undefined,
        contactEmail: row.contact_email || undefined,
        salary: row.salary || undefined,
        postedDate: row.created_at
          ? new Date(row.created_at).toLocaleDateString('fr-FR')
          : 'Récemment',
        isUrgent: row.is_urgent || false,
        source: row.source || 'Scraping Officiel',
        city: row.city || row.location || 'Cameroun',
        contractType: row.contract_type || 'CDI / CDD',
        isExpired: row.is_expired || row.moderation_status === 'expiree' || false,
      }));

      setJobs(mappedJobs);
    } catch (err: any) {
      console.error('Erreur chargement des offres Supabase:', err);
      setError('Impossible de charger les offres pour le moment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [selectedType, selectedLocation]);

  // Locations list
  const locations = ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Kribi', 'Bamenda', 'Maroua', 'Bertoua'];

  // Sources list
  const sources = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      if (j.source) set.add(j.source);
    });
    return Array.from(set);
  }, [jobs]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Expiry filter
      if (expiryFilter === 'active' && job.isExpired) return false;
      if (expiryFilter === 'expired' && !job.isExpired) return false;

      // Source filter
      if (selectedSource !== 'all' && job.source !== selectedSource) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(q);
        const matchOrg = job.organization.toLowerCase().includes(q);
        const matchDesc = job.shortDescription.toLowerCase().includes(q);
        const matchCategory = job.category.toLowerCase().includes(q);
        const matchSource = (job.source || '').toLowerCase().includes(q);
        const matchReq = job.requirements.some((r) => r.toLowerCase().includes(q));
        if (!matchTitle && !matchOrg && !matchDesc && !matchCategory && !matchSource && !matchReq) {
          return false;
        }
      }

      return true;
    });
  }, [jobs, searchQuery, selectedSource, expiryFilter]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedLocation('all');
    setSelectedSource('all');
    setExpiryFilter('active');
  };

  const getTypeBadgeStyle = (type: JobType) => {
    switch (type) {
      case 'emploi-formel':
        return 'bg-vert-profond/10 text-vert-profond border-vert-profond/20';
      case 'emploi-informel':
        return 'bg-or-ambre/20 text-vert-profond border-or-ambre/40';
      case 'stage':
        return 'bg-sauge/40 text-vert-profond border-sauge';
      case 'bourse':
        return 'bg-purple-100 text-purple-900 border-purple-300';
    }
  };

  const getSourceBadgeStyle = (source?: string) => {
    if (!source) return 'bg-slate-100 text-slate-700 border-slate-200';
    if (source.includes('MinaJobs')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (source.includes('JobinCamer')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (source.includes('Emploi.cm')) return 'bg-red-50 text-red-700 border-red-200';
    if (source.includes('MINFOPRA') || source.includes('MINESUP')) return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-extrabold';
    if (source.includes('Jobiglo')) return 'bg-teal-50 text-teal-800 border-teal-300';
    return 'bg-amber-50 text-amber-800 border-amber-300';
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Distinction Banner with Remote Jobs */}
      <div className="bg-gradient-to-r from-vert-profond to-emerald-900 text-creme rounded-[28px] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-sauge/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <Globe className="w-5 h-5 text-whatsapp" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-sora font-extrabold text-creme">
              Vous cherchez du télétravail international (USD / EUR) ?
            </h4>
            <p className="text-[11px] sm:text-xs text-creme/80 font-medium">
              Découvrez notre rubrique dédiée aux offres d'emploi Remote ouvertes aux candidats africains & camerounais.
            </p>
          </div>
        </div>
        
        <Link
          to="/remote-jobs"
          className="px-4 py-2 rounded-full bg-whatsapp text-vert-profond hover:bg-whatsapp/90 text-xs font-sora font-extrabold flex items-center gap-1.5 whitespace-nowrap shadow-md"
        >
          <span>Voir les offres Remote</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Page Title Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sauge/30 text-vert-profond text-xs sm:text-sm font-bold border border-sauge">
          <Sparkles className="w-4 h-4 text-or-ambre fill-or-ambre" />
          <span>Base nationale d'opportunités au Cameroun (Dédoublonnée)</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-sora font-extrabold text-vert-profond tracking-tight">
          Emplois Locaux & Concours au Cameroun
        </h1>
        <p className="text-base sm:text-lg text-encre/70 font-medium">
          Offres agrégées en direct d'Emploi.cm, MinaJobs, JobinCamer, Louma Jobs, MINFOPRA, MINESUP, SABC, Orange & MTN.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-[28px] p-5 sm:p-6 border border-sauge/40 shadow-subtle space-y-4">
        
        {/* Search & Location inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search Query input */}
          <div className="sm:col-span-7 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-encre/40" />
            <input
              type="text"
              placeholder="Rechercher par poste, entreprise, source (ex: MinaJobs, Orange, Administrateur, Plombier)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium transition-all"
            />
          </div>

          {/* Location selector */}
          <div className="sm:col-span-5 relative">
            <MapPin className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-encre/40" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full pl-11 pr-8 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-semibold transition-all appearance-none bg-white"
            >
              <option value="all">Toutes les villes / Régions</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Source & Expiry Sub-filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-bold text-vert-profond/70 uppercase tracking-wider mb-1">
              Source de l'Annonce
            </label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-sauge/60 focus:border-vert-profond outline-none text-xs font-semibold text-encre bg-white"
            >
              <option value="all">Toutes les sources d'origine ({sources.length})</option>
              {sources.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-vert-profond/70 uppercase tracking-wider mb-1">
              Statut de la Date Limite
            </label>
            <select
              value={expiryFilter}
              onChange={(e) => setExpiryFilter(e.target.value as any)}
              className="w-full px-3.5 py-2 rounded-xl border border-sauge/60 focus:border-vert-profond outline-none text-xs font-semibold text-encre bg-white"
            >
              <option value="active">Offres En Cours uniquement</option>
              <option value="all">Toutes les offres (y compris expirées)</option>
              <option value="expired">Offres Expirées uniquement</option>
            </select>
          </div>
        </div>

        {/* Type pills filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-sauge/30">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-vert-profond/70 uppercase tracking-wider flex items-center gap-1.5 mr-1">
              <Filter className="w-3.5 h-3.5" />
              Filtrer par type :
            </span>

            {[
              { id: 'all', label: 'Toutes les offres' },
              { id: 'emploi-formel', label: 'Emploi Formel' },
              { id: 'emploi-informel', label: 'Emploi Informel' },
              { id: 'stage', label: 'Stage' },
              { id: 'bourse', label: 'Bourse d\'études' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-sora font-bold transition-all ${
                  selectedType === tab.id
                    ? 'bg-vert-profond text-creme shadow-sm'
                    : 'bg-creme hover:bg-sauge/30 text-encre/80 border border-sauge/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {(searchQuery || selectedType !== 'all' || selectedLocation !== 'all' || selectedSource !== 'all' || expiryFilter !== 'active') && (
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-vert-profond hover:underline flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Réinitialiser les filtres
            </button>
          )}

        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm font-semibold text-encre/70">
          Affichage de <span className="font-extrabold text-vert-profond">{filteredJobs.length}</span> opportunités vérifiées au Cameroun.
        </p>

        <button
          onClick={fetchOffers}
          className="text-xs font-bold text-vert-profond hover:text-vert-moyen flex items-center gap-1.5 bg-sauge/20 px-3 py-1.5 rounded-full transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-20 text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-vert-profond border-t-transparent mx-auto"></div>
          <p className="text-sm font-semibold text-encre/70">Chargement des opportunités locales...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-6 rounded-3xl bg-red-50 border border-red-200 text-center space-y-2">
          <p className="text-sm font-bold text-red-700">{error}</p>
          <button
            onClick={fetchOffers}
            className="px-4 py-2 bg-red-600 text-white rounded-full text-xs font-bold"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Job Cards Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className={`bg-white rounded-[32px] p-6 sm:p-7 border ${
                job.isExpired ? 'border-amber-200 bg-amber-50/20' : 'border-sauge/40'
              } shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-5 group`}
            >
              <div className="space-y-4">
                
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-sora font-extrabold border ${getTypeBadgeStyle(
                        job.type
                      )}`}
                    >
                      {job.typeLabel}
                    </span>

                    {job.source && (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-sora font-bold border ${getSourceBadgeStyle(
                          job.source
                        )}`}
                      >
                        Via {job.source}
                      </span>
                    )}
                  </div>

                  {job.isExpired ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold">
                      Expirée
                    </span>
                  ) : job.isUrgent ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 text-[10px] font-extrabold uppercase tracking-wider animate-pulse">
                      Urgent
                    </span>
                  ) : null}
                </div>

                {/* Job Title & Org */}
                <div>
                  <h3 className="text-xl font-sora font-extrabold text-vert-profond group-hover:text-vert-moyen transition-colors line-clamp-2">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-encre/70 font-semibold">
                    <Building2 className="w-4 h-4 text-vert-profond/60" />
                    <span>{job.organization}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-encre/80 line-clamp-3 leading-relaxed">
                  {job.shortDescription}
                </p>

                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-encre/70 pt-2 border-t border-sauge/30">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-vert-profond" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-vert-profond" />
                    <span>Limite: {job.deadline}</span>
                  </div>
                </div>

              </div>

              {/* Action row */}
              <div className="pt-3 flex items-center justify-between border-t border-sauge/20">
                <span className="text-xs font-bold text-vert-profond/60">
                  {job.postedDate}
                </span>

                {job.externalUrl ? (
                  <a
                    href={job.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-vert-profond text-creme hover:bg-vert-moyen font-sora font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Postuler sur la source</span>
                    <ExternalLink className="w-3.5 h-3.5 text-or-clair" />
                  </a>
                ) : (
                  <Link
                    to={`/offres/${job.id}`}
                    className="px-5 py-2.5 rounded-full bg-vert-profond text-creme hover:bg-vert-moyen font-sora font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Voir l'offre</span>
                    <ArrowRight className="w-3.5 h-3.5 text-or-clair" />
                  </Link>
                )}
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
            Aucune offre ne correspond à vos critères
          </h3>
          <p className="text-sm text-encre/70">
            Essayez de modifier votre recherche ou de réinitialiser les filtres pour voir d'autres opportunités.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 rounded-full bg-vert-profond text-creme font-sora font-bold text-xs hover:bg-vert-moyen transition-all"
          >
            Voir toutes les offres
          </button>
        </div>
      )}

    </div>
  );
};
