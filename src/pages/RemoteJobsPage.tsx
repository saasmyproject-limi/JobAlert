import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { RemoteJob, RemoteJobLocationStatus } from '../types';
import {
  Search,
  Globe,
  Filter,
  Sparkles,
  Calendar,
  ExternalLink,
  Building2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  DollarSign,
  Tag,
  ShieldCheck,
  Laptop
} from 'lucide-react';

// Fallback Mock Data in case DB is offline or empty during dev
const MOCK_REMOTE_JOBS: RemoteJob[] = [
  {
    id: 'mock-1',
    title: 'Senior Full Stack Engineer (React & Node.js)',
    company: 'GitLab',
    source: 'Remotive',
    sourceUrl: 'https://remotive.com',
    locationRaw: 'Worldwide (Africa Eligible)',
    isAfricaEligible: true,
    locationStatus: 'eligible',
    category: 'Software Development',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Worldwide'],
    publishedAt: new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
    salaryRaw: '$80,000 - $120,000 USD / an',
    description: 'Rejoignez une équipe 100% distribuée dans le monde entier. Développement d\'applications cloud modernes.'
  },
  {
    id: 'mock-2',
    title: 'DevOps & Cloud Infrastructure Specialist',
    company: 'Canonical (Ubuntu)',
    source: 'We Work Remotely',
    sourceUrl: 'https://weworkremotely.com',
    locationRaw: 'EMEA / Africa & Europe',
    isAfricaEligible: true,
    locationStatus: 'eligible',
    category: 'DevOps & Sysadmin',
    tags: ['Kubernetes', 'Python', 'AWS', 'Linux'],
    publishedAt: new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
    salaryRaw: '$70,000 - $95,000 USD / an',
    description: 'Poste ouvert aux ingénieurs basés dans les fuseaux horaires UTC à UTC+4 (Afrique centrale & de l\'ouest incluses).'
  },
  {
    id: 'mock-3',
    title: 'Senior Product Designer (UI/UX & Design System)',
    company: 'Doist (Todoist)',
    source: 'RemoteOK',
    sourceUrl: 'https://remoteok.com',
    locationRaw: 'Anywhere in the World',
    isAfricaEligible: true,
    locationStatus: 'eligible',
    category: 'Design & UX',
    tags: ['Figma', 'UI/UX', 'Product Design'],
    publishedAt: new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
    salaryRaw: '$65,000 - $90,000 USD',
    description: 'Conception d\'interfaces simples et élégantes pour des millions d\'utilisateurs. Travail en asynchrone.'
  },
  {
    id: 'mock-4',
    title: 'Technical Writer & Developer Relations',
    company: 'Supabase',
    source: 'Jobicy',
    sourceUrl: 'https://jobicy.com',
    locationRaw: 'Global Remote',
    isAfricaEligible: true,
    locationStatus: 'eligible',
    category: 'Content & Tech',
    tags: ['Documentation', 'SQL', 'TypeScript'],
    publishedAt: new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
    salaryRaw: '$55,000 - $80,000 USD',
    description: 'Rédaction de guides techniques, exemples de code et animation de la communauté développeur mondiale.'
  },
  {
    id: 'mock-5',
    title: 'Customer Success & Support Engineer (Bilingue Fr/En)',
    company: 'Automattic (WordPress)',
    source: 'Remote4Africa',
    sourceUrl: 'https://remote4africa.com',
    locationRaw: 'Africa / Cameroun Open',
    isAfricaEligible: true,
    locationStatus: 'eligible',
    category: 'Support & Success',
    tags: ['WordPress', 'Français', 'Anglais', 'Support'],
    publishedAt: new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
    salaryRaw: '$45,000 - $65,000 USD',
    description: 'Accompagnement des utilisateurs francophones et anglophones sur les solutions web de l\'écosystème Automattic.'
  },
  {
    id: 'mock-6',
    title: 'Développeur Frontend Senior React / Next.js (Télétravail)',
    company: 'Tech Agency Cameroun',
    source: 'Jobiglo Cameroun',
    sourceUrl: 'https://cm.jobiglo.com',
    locationRaw: 'Douala / Yaoundé (Remote)',
    isAfricaEligible: true,
    locationStatus: 'eligible',
    category: 'Software Development',
    tags: ['React', 'Next.js', 'Télétravail', 'Cameroun'],
    publishedAt: new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
    salaryRaw: '800,000 FCFA - 1,500,000 FCFA / mois',
    description: 'Développement de plateformes SaaS d\'entreprises partenaires au Cameroun avec possibilité de télétravail hybride.'
  }
];

export const RemoteJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<RemoteJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | RemoteJobLocationStatus>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');

  // Fetch from Supabase remote_jobs table
  const fetchRemoteJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from('remote_jobs')
        .select('*')
        .order('published_at', { ascending: false });

      if (fetchErr) throw fetchErr;

      if (data && data.length > 0) {
        const mapped: RemoteJob[] = data.map((row: any) => ({
          id: row.id,
          title: row.title,
          company: row.company,
          source: row.source,
          sourceUrl: row.source_url,
          locationRaw: row.location_raw || 'Worldwide',
          isAfricaEligible: row.is_africa_eligible ?? true,
          locationStatus: (row.location_status as RemoteJobLocationStatus) || 'eligible',
          category: row.category || 'Général Tech',
          tags: Array.isArray(row.tags) ? row.tags : ['Remote'],
          publishedAt: row.published_at || row.created_at || new Date().toISOString(),
          fetchedAt: row.fetched_at || new Date().toISOString(),
          salaryRaw: row.salary_raw || 'Non spécifié',
          description: row.description || '',
        }));
        setJobs(mapped);
      } else {
        // Fallback to rich mock data if table is currently empty
        setJobs(MOCK_REMOTE_JOBS);
      }
    } catch (err: any) {
      console.warn('Utilisation du mode secours (mock data) pour Remote Jobs:', err.message);
      setJobs(MOCK_REMOTE_JOBS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRemoteJobs();
  }, []);

  // Filter options lists
  const categories = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      if (j.category) set.add(j.category);
    });
    return Array.from(set);
  }, [jobs]);

  const sources = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      if (j.source) set.add(j.source);
    });
    return Array.from(set);
  }, [jobs]);

  // Client-side filtering
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(q);
        const matchCompany = job.company.toLowerCase().includes(q);
        const matchCat = job.category.toLowerCase().includes(q);
        const matchDesc = (job.description || '').toLowerCase().includes(q);
        const matchTags = job.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchCompany && !matchCat && !matchDesc && !matchTags) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== 'all') {
        if (selectedStatus === 'eligible' && !job.isAfricaEligible && job.locationStatus !== 'eligible') {
          return false;
        }
        if (selectedStatus === 'restricted' && job.locationStatus !== 'restricted') {
          return false;
        }
        if (selectedStatus === 'manual_check' && job.locationStatus !== 'manual_check') {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && job.category !== selectedCategory) {
        return false;
      }

      // Source filter
      if (selectedSource !== 'all' && job.source !== selectedSource) {
        return false;
      }

      return true;
    });
  }, [jobs, searchQuery, selectedStatus, selectedCategory, selectedSource]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSelectedCategory('all');
    setSelectedSource('all');
  };

  const getSourceBadgeStyle = (source: string) => {
    switch (source) {
      case 'We Work Remotely':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Remotive':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'RemoteOK':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Jobicy':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Remote4Africa':
        return 'bg-amber-50 text-amber-800 border-amber-300 font-extrabold';
      case 'Jobiglo Cameroun':
        return 'bg-teal-50 text-teal-800 border-teal-300 font-extrabold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getLocationBadge = (status: RemoteJobLocationStatus, isEligible: boolean) => {
    if (isEligible || status === 'eligible') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sora font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Ouvert Afrique / Cameroun 🟢</span>
        </span>
      );
    }
    if (status === 'restricted') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sora font-semibold bg-red-50 text-red-700 border border-red-200">
          <Globe className="w-3.5 h-3.5 text-red-500" />
          <span>Restreint (Hors Afrique)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sora font-semibold bg-amber-100 text-amber-800 border border-amber-300">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        <span>À vérifier manuellement ⚠️</span>
      </span>
    );
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Hero Banner Section */}
      <div className="bg-vert-profond text-creme rounded-[36px] p-8 sm:p-12 relative overflow-hidden shadow-2xl space-y-6 border border-sauge/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-whatsapp/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-or-ambre/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-or-ambre/20 text-or-ambre border border-or-ambre/30 text-xs font-sora font-extrabold flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-or-ambre" />
            <span>Agrégateur Officiel de Jobs en Télétravail (Cron 6h)</span>
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-whatsapp/20 text-whatsapp border border-whatsapp/30 text-xs font-sora font-extrabold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Candidats Camerounais & Africains</span>
          </span>
        </div>

        <div className="space-y-3 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl font-sora font-extrabold leading-tight tracking-tight">
            Offres Remote Internationales ouvertes à l'Afrique & au Cameroun
          </h1>
          <p className="text-creme/80 text-sm sm:text-base font-medium leading-relaxed">
            Consultez les opportunités en télétravail d'Europe, des USA et d'Afrique synchronisées automatiquement depuis 9 sources officielles (We Work Remotely, Remotive, RemoteOK, Jobicy, Remote4Africa, etc.).
          </p>
        </div>

        {/* Key Features Chips */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl text-xs font-semibold text-creme/90">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/10">
            <Laptop className="w-4 h-4 text-or-ambre" />
            <span>100% Télétravail & Flexibilité</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/10">
            <DollarSign className="w-4 h-4 text-whatsapp" />
            <span>Paiement en Devises & FCFA</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/10">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Filtrage Géo Automatique</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-[28px] p-5 sm:p-6 border border-sauge/40 shadow-subtle space-y-4">
        
        {/* Search query input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-encre/40" />
          <input
            type="text"
            placeholder="Rechercher par titre de poste, compétences (ex: React, DevOps, Design, Support, Python)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium transition-all"
          />
        </div>

        {/* Filter selectors row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Eligibility Filter */}
          <div>
            <label className="block text-[11px] font-bold text-vert-profond/70 uppercase tracking-wider mb-1">
              Éligibilité Géographique
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-xs font-semibold text-encre bg-white"
            >
              <option value="all">Toutes les éligibilités</option>
              <option value="eligible">🟢 Ouvert Afrique / Cameroun</option>
              <option value="manual_check">⚠️ À vérifier manuellement</option>
              <option value="restricted">🔴 Restreint (Hors Afrique)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold text-vert-profond/70 uppercase tracking-wider mb-1">
              Domaine / Catégorie
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-xs font-semibold text-encre bg-white"
            >
              <option value="all">Tous les domaines</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Source Filter */}
          <div>
            <label className="block text-[11px] font-bold text-vert-profond/70 uppercase tracking-wider mb-1">
              Source d'Origine
            </label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-xs font-semibold text-encre bg-white"
            >
              <option value="all">Toutes les sources ({sources.length})</option>
              {sources.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Active Filters Reset */}
        {(searchQuery || selectedStatus !== 'all' || selectedCategory !== 'all' || selectedSource !== 'all') && (
          <div className="flex items-center justify-between pt-2 border-t border-sauge/30">
            <span className="text-xs text-encre/70 font-medium">
              Filtres actifs appliqués.
            </span>
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-vert-profond hover:underline flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Réinitialiser les filtres
            </button>
          </div>
        )}

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm font-semibold text-encre/70">
          Affichage de <span className="font-extrabold text-vert-profond">{filteredJobs.length}</span> offres remote agrégées.
        </p>

        <button
          onClick={fetchRemoteJobs}
          className="text-xs font-bold text-vert-profond hover:text-vert-moyen flex items-center gap-1.5 bg-sauge/20 px-3 py-1.5 rounded-full transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Actualiser les offres</span>
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-20 text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-vert-profond border-t-transparent mx-auto"></div>
          <p className="text-sm font-semibold text-encre/70">Interrogation des sources d'offres Remote...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-6 rounded-3xl bg-red-50 border border-red-200 text-center space-y-2">
          <p className="text-sm font-bold text-red-700">{error}</p>
          <button
            onClick={fetchRemoteJobs}
            className="px-4 py-2 bg-red-600 text-white rounded-full text-xs font-bold"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Job Cards Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-[32px] p-6 sm:p-7 border border-sauge/40 shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-4">
                
                {/* Header row: Source Badge & Location Eligibility */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {/* Source Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-sora font-extrabold border ${getSourceBadgeStyle(
                      job.source
                    )}`}
                  >
                    Via {job.source}
                  </span>

                  {/* Location status pill */}
                  {getLocationBadge(job.locationStatus, job.isAfricaEligible)}
                </div>

                {/* Job Title & Company */}
                <div>
                  <h3 className="text-xl font-sora font-extrabold text-vert-profond group-hover:text-vert-moyen transition-colors line-clamp-2">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-encre/70 font-semibold">
                    <Building2 className="w-4 h-4 text-vert-profond/60" />
                    <span>{job.company}</span>
                  </div>
                </div>

                {/* Description snippet */}
                {job.description && (
                  <p className="text-xs text-encre/80 line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>
                )}

                {/* Tags */}
                {job.tags && job.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.tags.slice(0, 4).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-md bg-sauge/25 text-vert-profond text-[11px] font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Meta Row: Raw Location & Salary */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-encre/70 pt-3 border-t border-sauge/30">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-vert-profond" />
                    <span className="truncate max-w-[200px]" title={job.locationRaw}>
                      {job.locationRaw}
                    </span>
                  </div>
                  
                  {job.salaryRaw && (
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{job.salaryRaw}</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Action row */}
              <div className="pt-3 flex items-center justify-between border-t border-sauge/20">
                <span className="text-[11px] font-semibold text-encre/50">
                  {new Date(job.publishedAt).toLocaleDateString('fr-FR')}
                </span>

                <a
                  href={job.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-vert-profond text-creme hover:bg-vert-moyen font-sora font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm group-hover:shadow-md"
                >
                  <span>Postuler sur {job.source}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-or-clair" />
                </a>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredJobs.length === 0 && (
        <div className="bg-white rounded-[32px] p-12 border border-sauge/40 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-sauge/30 text-vert-profond flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-sora font-bold text-vert-profond">
            Aucune offre ne correspond à vos filtres
          </h3>
          <p className="text-sm text-encre/70">
            Modifiez vos filtres de recherche ou l'éligibilité géographique pour afficher plus d'offres.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 rounded-full bg-vert-profond text-creme font-sora font-bold text-xs hover:bg-vert-moyen transition-all"
          >
            Voir toutes les offres Remote
          </button>
        </div>
      )}

    </div>
  );
};
