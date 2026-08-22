/**
 * ESSOR Relocation & Visa Sponsorship Sources Configuration
 * Registre structuré des sources de scraping par pays avec priorités et règles d'optimisation.
 */

export const RELOCATION_PRIORITY_SECTORS = [
  'Hôtellerie & Restauration',
  'Soins infirmiers & Santé',
  'BTP & Construction',
  'Agriculture saisonnière',
  'Technologies & Informatique'
];

export const RELOCATION_SOURCES_BY_COUNTRY = {
  canada: {
    country: 'Canada',
    countryCode: 'CA',
    sources: [
      {
        id: 'jobbank_tfw',
        name: 'Job Bank — Temporary Foreign Workers',
        url: 'https://www.jobbank.gc.ca/jobsearch/jobsearch?fsrc=32',
        type: 'officiel_gouv',
        priority: 1,
        explicitSponsorship: true,
        notes: 'Offres où l\'employeur a déjà une LMIA (EIMT) ou en a fait la demande. Signal de relocation le plus fiable.',
        targetSectors: RELOCATION_PRIORITY_SECTORS
      },
      {
        id: 'jobbank_general',
        name: 'Job Bank — Recherche Générale',
        url: 'https://www.jobbank.gc.ca/jobsearch/',
        type: 'officiel_gouv',
        priority: 1,
        explicitSponsorship: false,
        keywordsFilter: ['LMIA', 'EIMT', 'Temporary Foreign Worker', 'visa sponsorship'],
        notes: 'Base d\'offres nationale canadienne. Filtrer ensuite par mots-clés LMIA/EIMT.'
      },
      {
        id: 'visasponsor_jobs_ca',
        name: 'visasponsor.jobs Canada API',
        url: 'https://visasponsor.jobs/api/jobs?country=Canada',
        type: 'specialise_visa',
        priority: 2,
        explicitSponsorship: true,
        isApi: true,
        notes: 'Endpoint API spécialisé visa — accès JSON structuré.'
      },
      {
        id: 'workopolis_canada',
        name: 'Workopolis / SimplyHired Canada',
        url: 'https://www.workopolis.com/search?q=visa+sponsorship&l=canada',
        type: 'generaliste',
        priority: 3,
        explicitSponsorship: false,
        notes: 'Bon volume pour hôtellerie/restauration au Québec.'
      },
      {
        id: 'indeed_canada',
        name: 'Indeed Canada',
        url: 'https://emplois.ca.indeed.com/q-visa-sponsorship-emplois.html',
        type: 'generaliste',
        priority: 4,
        explicitSponsorship: false,
        strictCgu: true,
        notes: 'Gros volume ; CGU strictes anti-scraping, vérifier robots.txt et espacer la fréquence.'
      }
    ]
  },
  usa: {
    country: 'États-Unis',
    countryCode: 'US',
    sources: [
      {
        id: 'myvisajobs_us',
        name: 'MyVisaJobs',
        url: 'https://www.myvisajobs.com/',
        type: 'specialise_visa',
        priority: 1,
        explicitSponsorship: true,
        notes: 'Liste les entreprises historiquement sponsors H1B. Source prioritaire pour cibler les employeurs.'
      },
      {
        id: 'h1bgrader_us',
        name: 'H1BGrader',
        url: 'https://www.h1bgrader.com/',
        type: 'specialise_visa',
        priority: 2,
        explicitSponsorship: true,
        notes: 'Statistiques et offres de sponsorship H1B par entreprise.'
      },
      {
        id: 'usajobs_gov',
        name: 'USAJOBS',
        url: 'https://www.usajobs.gov/',
        type: 'officiel_gouv',
        priority: 3,
        explicitSponsorship: false,
        notes: 'Emplois fédéraux américains ; sponsorship spécifique pour profils très qualifiés.'
      },
      {
        id: 'indeed_usa',
        name: 'Indeed USA',
        url: 'https://www.indeed.com/q-visa-sponsorship-jobs.html',
        type: 'generaliste',
        priority: 4,
        explicitSponsorship: false,
        keywordsFilter: ['visa sponsorship', 'H1B', 'relocation provided'],
        strictCgu: true,
        notes: 'Filtrer par "visa sponsorship" / "H1B".'
      }
    ]
  },
  france: {
    country: 'France',
    countryCode: 'FR',
    sources: [
      {
        id: 'france_travail',
        name: 'France Travail (ex-Pôle Emploi)',
        url: 'https://www.francetravail.fr/candidat/recherche-doffres-demploi.html',
        type: 'officiel_gouv',
        priority: 1,
        explicitSponsorship: false,
        targetSectors: ['Hôtellerie-Restauration', 'BTP', 'Aide à domicile', 'Santé'],
        notes: 'Portail national officiel. Filtrer par métiers en tension souvent ouverts au recrutement international.'
      },
      {
        id: 'apec_france',
        name: 'APEC (Association Pour l\'Emploi des Cadres)',
        url: 'https://www.apec.fr/candidat/recherche-emploi.html',
        type: 'officiel_cadres',
        priority: 2,
        explicitSponsorship: false,
        notes: 'Profils cadres et hautement qualifiés uniquement.'
      },
      {
        id: 'wttj_france',
        name: 'Welcome to the Jungle France',
        url: 'https://www.welcometothejungle.com/fr/jobs',
        type: 'generaliste',
        priority: 3,
        explicitSponsorship: false,
        strictCgu: true,
        notes: 'Bonne structure de filtres et entreprises Tech/Digital. Respecter CGU et rate limits.'
      }
    ]
  },
  belgique: {
    country: 'Belgique',
    countryCode: 'BE',
    sources: [
      {
        id: 'actiris_bruxelles',
        name: 'Actiris (Région Bruxelles-Capitale)',
        url: 'https://www.actiris.brussels/fr/citoyens/offres-demploi/',
        type: 'officiel_region',
        priority: 1,
        explicitSponsorship: false,
        notes: 'Portail officiel de la région Bruxelles-Capitale.'
      },
      {
        id: 'forem_wallonie',
        name: 'Le Forem (Région Wallonie)',
        url: 'https://www.leforem.be/citoyens/nos-offres-d-emploi.html',
        type: 'officiel_region',
        priority: 1,
        explicitSponsorship: false,
        notes: 'Portail officiel de la Région Wallonne.'
      },
      {
        id: 'vdab_flandre',
        name: 'VDAB (Région Flandre)',
        url: 'https://www.vdab.be/vindeenjob',
        type: 'officiel_region',
        priority: 1,
        explicitSponsorship: false,
        notes: 'Portail officiel de la Flandre (interface en néerlandais).'
      },
      {
        id: 'stepstone_be',
        name: 'StepStone Belgique',
        url: 'https://www.stepstone.be/',
        type: 'generaliste',
        priority: 2,
        explicitSponsorship: false,
        strictCgu: true,
        notes: 'Bon volume tous secteurs pour la Belgique.'
      }
    ]
  },
  italie: {
    country: 'Italie',
    countryCode: 'IT',
    sources: [
      {
        id: 'cliclavoro_anpal',
        name: 'Cliclavoro (ANPAL / Ministère du Travail)',
        url: 'https://www.cliclavoro.gov.it/',
        type: 'officiel_gouv',
        priority: 1,
        explicitSponsorship: false,
        notes: 'Portail national officiel de l\'emploi en Italie. Source prioritaire de confiance.'
      },
      {
        id: 'infojobs_it',
        name: 'InfoJobs Italia',
        url: 'https://www.infojobs.it/',
        type: 'generaliste',
        priority: 2,
        explicitSponsorship: false,
        notes: 'Grand volume d\'offres tous secteurs.'
      },
      {
        id: 'subito_lavoro_it',
        name: 'Subito.it — Lavoro',
        url: 'https://www.subito.it/annunci-italia/vendita/lavoro/',
        type: 'generaliste_annonces',
        priority: 3,
        explicitSponsorship: false,
        notes: 'Très utilisé pour les offres saisonnières en restauration et agriculture.'
      }
    ]
  },
  allemagne: {
    country: 'Allemagne',
    countryCode: 'DE',
    sources: [
      {
        id: 'make_it_in_germany',
        name: 'Make it in Germany (Gouvernement Allemand)',
        url: 'https://www.make-it-in-germany.com/en/jobs',
        type: 'officiel_gouv',
        priority: 1,
        explicitSponsorship: true,
        notes: 'Portail officiel dédié aux travailleurs étrangers. Section visa/relocation très explicite — source prioritaire #1.'
      },
      {
        id: 'arbeitsagentur_de',
        name: 'Bundesagentur für Arbeit (Jobbörse)',
        url: 'https://www.arbeitsagentur.de/jobsuche/',
        type: 'officiel_gouv',
        priority: 1,
        explicitSponsorship: false,
        notes: 'Portail national allemand officiel de l\'emploi.'
      },
      {
        id: 'stepstone_de',
        name: 'StepStone Allemagne',
        url: 'https://www.stepstone.de/',
        type: 'generaliste',
        priority: 2,
        explicitSponsorship: false,
        strictCgu: true,
        notes: 'Gros volume tous secteurs en Allemagne.'
      },
      {
        id: 'indeed_de',
        name: 'Indeed Allemagne',
        url: 'https://de.indeed.com/',
        type: 'generaliste',
        priority: 3,
        explicitSponsorship: false,
        keywordsFilter: ['Visa Sponsorship', 'Relocation', 'Aufenthaltstitel'],
        strictCgu: true,
        notes: 'Filtrer par mots-clés visa/relocation/Aufenthaltstitel.'
      }
    ]
  }
};

/**
 * Retourne la liste des sources officielles (gouvernementales et régionales)
 * prioritaires pour minimiser l'ambiguïté des offres et réduire l'usage IA.
 */
export function getOfficialGovernmentSources() {
  const officialSources = [];
  for (const countryKey in RELOCATION_SOURCES_BY_COUNTRY) {
    const countryData = RELOCATION_SOURCES_BY_COUNTRY[countryKey];
    for (const source of countryData.sources) {
      if (source.type.startsWith('officiel')) {
        officialSources.push({
          country: countryData.country,
          countryCode: countryData.countryCode,
          ...source
        });
      }
    }
  }
  return officialSources.sort((a, b) => a.priority - b.priority);
}

/**
 * Obtenir l'ensemble des sources ordonnées par priorité et par pays
 */
export function getAllRelocationSourcesFlat() {
  const list = [];
  for (const countryKey in RELOCATION_SOURCES_BY_COUNTRY) {
    const countryData = RELOCATION_SOURCES_BY_COUNTRY[countryKey];
    for (const source of countryData.sources) {
      list.push({
        country: countryData.country,
        countryCode: countryData.countryCode,
        ...source
      });
    }
  }
  return list.sort((a, b) => a.priority - b.priority);
}
