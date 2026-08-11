import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from '../router/Router';
import { JobType, JobOffer } from '../types';
import { Search, MapPin, Filter, Sparkles, Calendar, ArrowRight, Building2, CheckCircle2, RefreshCw } from 'lucide-react';

export const OffersListPage: React.FC = () => {
  const { jobsList } = useAuth();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<JobType | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Locations extracted from jobs
  const locations = useMemo(() => {
    const set = new Set<string>();
    jobsList.forEach((j) => {
      if (j.location.includes('Douala')) set.add('Douala');
      else if (j.location.includes('Yaoundé')) set.add('Yaoundé');
      else if (j.location.includes('Bafoussam')) set.add('Bafoussam');
      else if (j.location.includes('Garoua')) set.add('Garoua');
      else if (j.location.includes('Kribi')) set.add('Kribi');
      else set.add(j.location);
    });
    return Array.from(set);
  }, [jobsList]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobsList.filter((job) => {
      // Type filter
      if (selectedType !== 'all' && job.type !== selectedType) {
        return false;
      }
      // Location filter
      if (selectedLocation !== 'all' && !job.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
        return false;
      }
      // Keyword query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(q);
        const matchOrg = job.organization.toLowerCase().includes(q);
        const matchDesc = job.shortDescription.toLowerCase().includes(q);
        const matchCategory = job.category.toLowerCase().includes(q);
        const matchReq = job.requirements.some((r) => r.toLowerCase().includes(q));
        if (!matchTitle && !matchOrg && !matchDesc && !matchCategory && !matchReq) {
          return false;
        }
      }
      return true;
    });
  }, [jobsList, selectedType, selectedLocation, searchQuery]);

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
            <Search className="w-5 h-5 text-encre/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher un mot-clé (ex: MINFOPRA, Plombier, React, Stage...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium transition-all"
            />
          </div>

          {/* Location select */}
          <div className="sm:col-span-5 relative">
            <MapPin className="w-5 h-5 text-encre/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium bg-white appearance-none cursor-pointer"
            >
              <option value="all">Toutes les villes (Cameroun)</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Filter Pills row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-sauge/30">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-encre/60 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Type :
            </span>

            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-full text-xs font-sora font-bold transition-all ${
                selectedType === 'all'
                  ? 'bg-vert-profond text-creme shadow-sm'
                  : 'bg-sauge/20 text-encre/80 hover:bg-sauge/40'
              }`}
            >
              Tous ({jobsList.length})
            </button>

            <button
              onClick={() => setSelectedType('emploi-formel')}
              className={`px-4 py-2 rounded-full text-xs font-sora font-bold transition-all ${
                selectedType === 'emploi-formel'
                  ? 'bg-vert-profond text-creme shadow-sm'
                  : 'bg-vert-profond/10 text-vert-profond hover:bg-vert-profond/20'
              }`}
            >
              Emploi formel
            </button>

            <button
              onClick={() => setSelectedType('emploi-informel')}
              className={`px-4 py-2 rounded-full text-xs font-sora font-bold transition-all ${
                selectedType === 'emploi-informel'
                  ? 'bg-or-ambre text-encre shadow-sm'
                  : 'bg-or-ambre/20 text-vert-profond hover:bg-or-ambre/30'
              }`}
            >
              Emploi informel
            </button>

            <button
              onClick={() => setSelectedType('stage')}
              className={`px-4 py-2 rounded-full text-xs font-sora font-bold transition-all ${
                selectedType === 'stage'
                  ? 'bg-vert-moyen text-creme shadow-sm'
                  : 'bg-sauge/40 text-vert-profond hover:bg-sauge/60'
              }`}
            >
              Stage
            </button>

            <button
              onClick={() => setSelectedType('bourse')}
              className={`px-4 py-2 rounded-full text-xs font-sora font-bold transition-all ${
                selectedType === 'bourse'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-purple-100 text-purple-900 hover:bg-purple-200'
              }`}
            >
              Bourse d'études
            </button>
          </div>

          {(selectedType !== 'all' || selectedLocation !== 'all' || searchQuery.trim() !== '') && (
            <button
              onClick={resetFilters}
              className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Réinitialiser les filtres
            </button>
          )}
        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-vert-profond">
          {filteredJobs.length} {filteredJobs.length > 1 ? 'offres trouvées' : 'offre trouvée'}
        </p>
        <span className="text-xs text-encre/60 font-medium">
          Mises à jour quotidiennement · Alertes envoyées sur WhatsApp
        </span>
      </div>

      {/* Offers Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Link
              key={job.id}
              to={`/offres/${job.id}`}
              className="group bg-white rounded-[24px] p-6 border border-sauge/40 shadow-subtle hover:shadow-xl hover:border-vert-profond/40 transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1 relative"
            >
              
              <div className="space-y-3">
                {/* Header Row: Type Badge & Match percentage */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-sora font-bold border ${getTypeBadgeStyle(job.type)}`}>
                    {job.typeLabel}
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-whatsapp/15 text-vert-profond text-[11px] font-sora font-extrabold border border-whatsapp/30">
                    <Sparkles className="w-3 h-3 text-whatsapp fill-whatsapp" />
                    <span>{job.matchPercentage}% match</span>
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-lg font-sora font-extrabold text-vert-profond group-hover:text-vert-moyen transition-colors leading-snug">
                  {job.title}
                </h2>

                {/* Organization & Location */}
                <div className="space-y-1 text-xs text-encre/70 font-medium">
                  <div className="flex items-center gap-1.5 text-vert-profond font-semibold">
                    <Building2 className="w-3.5 h-3.5 text-vert-moyen shrink-0" />
                    <span className="truncate">{job.organization}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-encre/40 shrink-0" />
                    <span>{job.location}</span>
                  </div>
                </div>

                {/* Short Description */}
                <p className="text-xs text-encre/75 line-clamp-3 leading-relaxed font-normal">
                  {job.shortDescription}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-sauge/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-encre/60 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-or-ambre" />
                  <span>Limite : <strong className="text-vert-profond font-bold">{job.deadline}</strong></span>
                </div>

                <span className="font-sora font-bold text-vert-profond group-hover:text-vert-moyen flex items-center gap-1">
                  <span>Détails</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>

            </Link>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-[32px] p-12 text-center space-y-4 border border-sauge/40 shadow-subtle max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-sauge/30 text-vert-profond flex items-center justify-center mx-auto text-2xl">
            🔍
          </div>
          <h3 className="font-sora font-extrabold text-xl text-vert-profond">
            Aucune offre ne correspond à tes filtres
          </h3>
          <p className="text-xs text-encre/70 leading-relaxed">
            Essaie de modifier tes mots-clés de recherche ou sélectionne "Toutes les villes".
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 rounded-full bg-vert-profond text-creme font-bold text-xs hover:bg-vert-moyen transition-all"
          >
            Afficher toutes les offres
          </button>
        </div>
      )}

    </div>
  );
};
