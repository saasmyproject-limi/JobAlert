/**
 * Configuration Multi-Pays ESSOR
 * Cartographie dynamique des pays francophones supportés et de leurs sources officielles de scraping
 */

export interface ScrapingSourceConfig {
  id: string;
  name: string;
  officialUrl: string;
  robotsTxtVerified: boolean;
  robotsTxtUrl: string;
  cguVerified: boolean;
  type: 'emploi' | 'stage' | 'bourse' | 'officiel';
  rateLimitMs: number;
}

export interface CountryConfig {
  code: string; // Ex: 'CM', 'CI', 'SN'
  name: string; // Ex: 'Cameroun', 'Côte d\'Ivoire', 'Sénégal'
  currency: string; // Ex: 'FCFA (XAF)', 'FCFA (XOF)'
  flagEmoji: string;
  defaultCities: string[];
  officialSources: ScrapingSourceConfig[];
}

export const SUPPORTED_COUNTRIES: CountryConfig[] = [
  {
    code: 'CM',
    name: 'Cameroun',
    currency: 'FCFA (XAF)',
    flagEmoji: '🇨🇲',
    defaultCities: ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Bamenda', 'Kribi', 'Tout le Cameroun (National)'],
    officialSources: [
      {
        id: 'fne_cm',
        name: 'Fonds National de l\'Emploi (FNE)',
        officialUrl: 'https://fnecm.org',
        robotsTxtVerified: true,
        robotsTxtUrl: 'https://fnecm.org/robots.txt',
        cguVerified: true,
        type: 'emploi',
        rateLimitMs: 2000,
      },
      {
        id: 'minesup_cm',
        name: 'Ministère de l\'Enseignement Supérieur (MINESUP)',
        officialUrl: 'https://minesup.gov.cm',
        robotsTxtVerified: true,
        robotsTxtUrl: 'https://minesup.gov.cm/robots.txt',
        cguVerified: true,
        type: 'bourse',
        rateLimitMs: 3000,
      },
      {
        id: 'minfopra_cm',
        name: 'MINFOPRA Concours Officiels',
        officialUrl: 'http://www.minfopra.gov.cm',
        robotsTxtVerified: true,
        robotsTxtUrl: 'http://www.minfopra.gov.cm/robots.txt',
        cguVerified: true,
        type: 'officiel',
        rateLimitMs: 3000,
      },
    ],
  },
  {
    code: 'CI',
    name: 'Côte d\'Ivoire',
    currency: 'FCFA (XOF)',
    flagEmoji: '🇨🇮',
    defaultCities: ['Abidjan', 'Bouaké', 'Yamoussoukro', 'San-Pédro', 'Toute la Côte d\'Ivoire'],
    officialSources: [
      {
        id: 'agence_emploi_ci',
        name: 'Agence Emploi Jeunes (AEJ)',
        officialUrl: 'https://www.emploi.gouv.ci',
        robotsTxtVerified: true,
        robotsTxtUrl: 'https://www.emploi.gouv.ci/robots.txt',
        cguVerified: true,
        type: 'emploi',
        rateLimitMs: 2000,
      },
    ],
  },
  {
    code: 'SN',
    name: 'Sénégal',
    currency: 'FCFA (XOF)',
    flagEmoji: '🇸🇳',
    defaultCities: ['Dakar', 'Thies', 'Saint-Louis', 'Ziguinchor', 'Tout le Sénégal'],
    officialSources: [
      {
        id: 'anpej_sn',
        name: 'Agence Nationale pour l\'Emploi des Jeunes (ANPEJ)',
        officialUrl: 'https://anpej.sn',
        robotsTxtVerified: true,
        robotsTxtUrl: 'https://anpej.sn/robots.txt',
        cguVerified: true,
        type: 'emploi',
        rateLimitMs: 2000,
      },
    ],
  },
];

export const GLOBAL_REMOTE_SOURCES: ScrapingSourceConfig[] = [
  {
    id: 'remote_ok_api',
    name: 'Remote OK API Officielle',
    officialUrl: 'https://remoteok.com/api',
    robotsTxtVerified: true,
    robotsTxtUrl: 'https://remoteok.com/robots.txt',
    cguVerified: true,
    type: 'emploi',
    rateLimitMs: 5000,
  },
  {
    id: 'weworkremotely_rss',
    name: 'We Work Remotely RSS Officiel',
    officialUrl: 'https://weworkremotely.com/remote-jobs.rss',
    robotsTxtVerified: true,
    robotsTxtUrl: 'https://weworkremotely.com/robots.txt',
    cguVerified: true,
    type: 'emploi',
    rateLimitMs: 5000,
  },
];

export function getCountryConfig(codeOrName: string): CountryConfig {
  const norm = codeOrName.toLowerCase();
  return (
    SUPPORTED_COUNTRIES.find(
      (c) => c.code.toLowerCase() === norm || c.name.toLowerCase() === norm
    ) || SUPPORTED_COUNTRIES[0]
  );
}
