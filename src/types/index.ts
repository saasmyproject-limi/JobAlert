export type JobType = 'emploi-formel' | 'emploi-informel' | 'stage' | 'bourse';

export interface JobOffer {
  id: string;
  title: string;
  organization: string;
  type: JobType;
  typeLabel: string;
  location: string;
  shortDescription: string;
  fullDescription: string;
  requirements: string[];
  deadline: string;
  matchPercentage: number;
  category: string;
  externalUrl?: string;
  contactWhatsApp?: string;
  contactEmail?: string;
  salary?: string;
  postedDate: string;
  isUrgent?: boolean;
  source?: string;
  city?: string;
  contractType?: string;
  isExpired?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  domain: string;
  education: string;
  experience: string;
  location: string;
  searchTypes: JobType[];
  skills: string[];
  cvFileName?: string;
  isLoggedIn: boolean;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  organization: string;
  location: string;
  appliedDate: string;
  status: 'Envoyée' | 'En cours d\'examen' | 'Entretien programmé' | 'Retenue';
  type: JobType;
}

export interface FilterState {
  searchQuery: string;
  type: JobType | 'all';
  location: string;
}

export type RemoteJobLocationStatus = 'eligible' | 'restricted' | 'manual_check';

export interface RemoteJob {
  id: string;
  title: string;
  company: string;
  source: string;
  sourceUrl: string;
  locationRaw: string;
  isAfricaEligible: boolean;
  locationStatus: RemoteJobLocationStatus;
  category: string;
  tags: string[];
  publishedAt: string;
  fetchedAt: string;
  salaryRaw?: string;
  description?: string;
}

