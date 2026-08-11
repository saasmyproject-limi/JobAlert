import React, { createContext, useContext, useState } from 'react';
import { UserProfile, JobApplication, JobOffer } from '../types';
import { MOCK_JOBS } from '../data/mockJobs';

interface AuthContextType {
  user: UserProfile;
  applications: JobApplication[];
  jobsList: JobOffer[];
  login: (email: string, pass: string) => void;
  logout: () => void;
  register: (profileData: Partial<UserProfile>) => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  applyToJob: (job: JobOffer) => boolean;
  addPublishedJob: (job: JobOffer) => void;
  hasApplied: (jobId: string) => boolean;
}

const initialProfile: UserProfile = {
  name: 'Jean-Marc Nkoa',
  email: 'jeanmarc.nkoa@gmail.com',
  phone: '+237 699 00 11 22',
  domain: 'Informatique & Technologies',
  education: 'Master 2',
  experience: '3-5 ans',
  location: 'Douala',
  searchTypes: ['emploi-formel', 'stage', 'bourse'],
  skills: ['React', 'TypeScript', 'Gestion de projet', 'Analyse de données'],
  cvFileName: 'CV_JeanMarc_Nkoa_2026.pdf',
  isLoggedIn: true,
};

const initialApplications: JobApplication[] = [
  {
    id: 'app-1',
    jobId: 'dev-fullstack-douala',
    jobTitle: 'Développeur Fullstack React / Node.js',
    organization: 'TechKamer Solutions',
    location: 'Douala - Bonanjo',
    appliedDate: '10/08/2026',
    status: 'Envoyée',
    type: 'emploi-formel',
  },
  {
    id: 'app-2',
    jobId: 'minfopra-admin-2026',
    jobTitle: 'Concours Direct MINFOPRA - 45 Administrateurs Civils',
    organization: 'MINFOPRA',
    location: 'Yaoundé',
    appliedDate: '08/08/2026',
    status: 'En cours d\'examen',
    type: 'emploi-formel',
  },
  {
    id: 'app-3',
    jobId: 'stage-marketing-orange',
    jobTitle: 'Stage Académique & Pro en Marketing Digital',
    organization: 'Orange Cameroun',
    location: 'Douala',
    appliedDate: '02/08/2026',
    status: 'Entretien programmé',
    type: 'stage',
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(initialProfile);
  const [applications, setApplications] = useState<JobApplication[]>(initialApplications);
  const [jobsList, setJobsList] = useState<JobOffer[]>(MOCK_JOBS);

  const login = (email: string, _pass: string) => {
    setUser((prev) => ({
      ...prev,
      email: email || prev.email,
      isLoggedIn: true,
    }));
  };

  const logout = () => {
    setUser((prev) => ({ ...prev, isLoggedIn: false }));
  };

  const register = (profileData: Partial<UserProfile>) => {
    setUser({
      name: profileData.name || 'Candidat JobAlert',
      email: profileData.email || '',
      phone: profileData.phone || '',
      domain: profileData.domain || 'Informatique',
      education: profileData.education || 'Licence',
      experience: profileData.experience || '1-3 ans',
      location: profileData.location || 'Douala',
      searchTypes: profileData.searchTypes || ['emploi-formel', 'stage'],
      skills: profileData.skills || [],
      cvFileName: profileData.cvFileName || 'Mon_CV_JobAlert.pdf',
      isLoggedIn: true,
    });
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  const applyToJob = (job: JobOffer): boolean => {
    if (applications.some((app) => app.jobId === job.id)) {
      return false; // Already applied
    }
    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      organization: job.organization,
      location: job.location,
      appliedDate: new Date().toLocaleDateString('fr-FR'),
      status: 'Envoyée',
      type: job.type,
    };
    setApplications((prev) => [newApp, ...prev]);
    return true;
  };

  const addPublishedJob = (newJob: JobOffer) => {
    setJobsList((prev) => [newJob, ...prev]);
  };

  const hasApplied = (jobId: string) => {
    return applications.some((app) => app.jobId === jobId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        applications,
        jobsList,
        login,
        logout,
        register,
        updateProfile,
        applyToJob,
        addPublishedJob,
        hasApplied,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
