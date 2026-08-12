import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from '../router/Router';
import { JobType, JobOffer } from '../types';
import { Search, MapPin, Filter, Sparkles, Calendar, ArrowRight, Building2, CheckCircle2, RefreshCw } from 'lucide-react';

export const OffersListPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<JobType | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Chargement depuis Supabase (statut 'publiee' uniquement)
  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('offers')
        .select('*')
        .eq('moderation_status', 'publiee')
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
        location: row.location,
        shortDescription: row.short_description,
        fullDescription: row.full_description,
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
  const locations = ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Kribi', 'Bamenda'];

  // Filtered jobs by client-side text search query
  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return jobs;
    const q = searchQuery.toLowerCase();
    return jobs.filter((job) => {
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchOrg = job.organization.toLowerCase().includes(q);
      const matchDesc = job.shortDescription.toLowerCase().includes(q);
      const matchCategory = job.category.toLowerCase().includes(q);
      const matchReq = job.requirements.some((r) => r.toLowerCase().includes(q));
      return matchTitle || matchOrg || matchDesc || matchCategory || matchReq;
    });
  }, [jobs, searchQuery]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedLocation('all');
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

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Page Title Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sauge/30 text-vert-profond text-xs sm:text-sm font-bold border border-sauge">
          <Sparkles className="w-4 h-4 text-or-ambre fill-or-ambre" />
          <span>Base nationale d'opportunités au Cameroun</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-sora font-extrabold text-vert-profond tracking-tight">
          Toutes les opportunités d'emploi & bourses
        </h1>
        <p className="text-base sm:text-lg text-encre/70 font-medium">
          Concours MINFOPRA, bourses MINESUP, emplois formels, stages académiques et missions informelles vérifiés.
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
              placeholder="Rechercher par titre, entreprise, compétences (ex: Administrateur, Plombier, React)..."
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

        {/* Type pills filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-sauge/30">
          
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

          {(searchQuery || selectedType !== 'all' || selectedLocation !== 'all') && (
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
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-20 text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-vert-profond border-t-transparent mx-auto"></div>
          <p className="text-sm font-semibold text-encre/70">Chargement des opportunités...</p>
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
              className="bg-white rounded-[32px] p-6 sm:p-7 border border-sauge/40 shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-4">
                
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-sora font-extrabold border ${getTypeBadgeStyle(
                      job.type
                    )}`}
                  >
                    {job.typeLabel}
                  </span>

                  {job.isUrgent && (
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 border border-red-200 text-[10px] font-extrabold uppercase tracking-wider animate-pulse">
                      Urgent
                    </span>
                  )}
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
              <div className="pt-3 flex items-center justify-between">
                <span className="text-xs font-bold text-vert-profond/60">
                  {job.postedDate}
                </span>

                <Link
                  to={`/offres/${job.id}`}
                  className="px-5 py-2.5 rounded-full bg-vert-profond text-creme hover:bg-vert-moyen font-sora font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>Voir l'offre</span>
                  <ArrowRight className="w-3.5 h-3.5 text-or-clair" />
                </Link>
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
