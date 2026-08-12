import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, JobApplication, JobOffer } from '../types';
import { supabase } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

export interface AuthResult {
  success: boolean;
  requiresEmailConfirmation?: boolean;
  error?: string;
}

interface AuthContextType {
  user: UserProfile;
  session: Session | null;
  loading: boolean;
  applications: JobApplication[];
  jobsList: JobOffer[];
  login: (email: string, pass: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  register: (profileData: {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    domain?: string;
    education?: string;
    experience?: string;
    location?: string;
    searchTypes?: any[];
    skills?: string[];
    cvFileName?: string;
  }) => Promise<AuthResult>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<AuthResult>;
  applyToJob: (job: JobOffer) => boolean;
  addPublishedJob: (job: JobOffer) => void;
  hasApplied: (jobId: string) => boolean;
  refreshProfile: () => Promise<void>;
}

const defaultUserProfile: UserProfile = {
  name: '',
  email: '',
  phone: '',
  domain: '',
  education: '',
  experience: '',
  location: '',
  searchTypes: [],
  skills: [],
  cvFileName: '',
  isLoggedIn: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile>(defaultUserProfile);
  const [loading, setLoading] = useState<boolean>(true);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobsList, setJobsList] = useState<JobOffer[]>([]);

  // Charge le profil utilisateur depuis Supabase
  const loadUserProfile = async (userId: string, userEmail: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erreur chargement profil Supabase:', error);
      }

      if (data) {
        setUser({
          name: data.full_name || 'Utilisateur JobAlert',
          email: data.email || userEmail,
          phone: data.phone_whatsapp || '',
          domain: data.domain || '',
          education: data.education_level || '',
          experience: data.experience_years || '',
          location: data.location || '',
          searchTypes: data.search_types || [],
          skills: data.skills || [],
          cvFileName: data.cv_url || '',
          isLoggedIn: true,
        });
      } else {
        setUser({
          ...defaultUserProfile,
          email: userEmail,
          isLoggedIn: true,
        });
      }
    } catch (err) {
      console.error('Erreur lors du chargement du profil:', err);
    }
  };

  useEffect(() => {
    // 1. Obtenir la session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user.id, session.user.email || '');
      }
      setLoading(false);
    });

    // 2. Écouter les changements d'état d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await loadUserProfile(session.user.id, session.user.email || '');
      } else {
        setUser(defaultUserProfile);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (session?.user) {
      await loadUserProfile(session.user.id, session.user.email || '');
    }
  };

  const login = async (email: string, pass: string): Promise<AuthResult> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        let msg = error.message;
        if (msg.includes('Invalid login credentials')) {
          msg = 'Email ou mot de passe incorrect.';
        } else if (msg.includes('Email not confirmed')) {
          msg = 'Votre adresse email n\'a pas encore été confirmée. Veuillez vérifier votre boîte de réception et cliquer sur le lien de confirmation.';
        }
        return { success: false, error: msg };
      }

      if (data.session?.user) {
        await loadUserProfile(data.session.user.id, data.session.user.email || email);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Erreur lors de la connexion' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(defaultUserProfile);
    setSession(null);
  };

  const register = async (profileData: {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    domain?: string;
    education?: string;
    experience?: string;
    location?: string;
    searchTypes?: any[];
    skills?: string[];
    cvFileName?: string;
  }): Promise<AuthResult> => {
    try {
      if (!profileData.password) {
        return { success: false, error: 'Veuillez saisir un mot de passe.' };
      }

      const redirectTo = typeof window !== 'undefined'
        ? `${window.location.origin}/connexion?confirmed=true`
        : undefined;

      // 1. Inscription de l'utilisateur Supabase Auth avec envoi de l'email de confirmation
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: profileData.email,
        password: profileData.password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            full_name: profileData.name,
          },
        },
      });

      if (authError) {
        let msg = authError.message;
        if (msg.includes('User already registered')) {
          msg = 'Cet email est déjà utilisé par un autre compte.';
        }
        return { success: false, error: msg };
      }

      const userId = authData.user?.id;
      if (!userId) {
        return { success: false, error: 'Impossible de créer le compte.' };
      }

      // 2. Écriture du profil complet dans la table public.profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: profileData.email,
          full_name: profileData.name,
          phone_whatsapp: profileData.phone || '',
          domain: profileData.domain || '',
          education_level: profileData.education || '',
          experience_years: profileData.experience || '',
          location: profileData.location || '',
          search_types: profileData.searchTypes || [],
          skills: profileData.skills || [],
          cv_url: profileData.cvFileName || '',
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Erreur insertion profil public:', profileError);
      }

      // Si la session est null, la confirmation par email est activée dans Supabase
      const requiresEmailConfirmation = !authData.session;

      if (!requiresEmailConfirmation) {
        await loadUserProfile(userId, profileData.email);
      }

      return {
        success: true,
        requiresEmailConfirmation,
      };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Erreur lors de l’inscription' };
    }
  };

  const updateProfile = async (updated: Partial<UserProfile>): Promise<AuthResult> => {
    if (!session?.user) {
      return { success: false, error: 'Vous devez être connecté.' };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updated.name,
          phone_whatsapp: updated.phone,
          domain: updated.domain,
          education_level: updated.education,
          experience_years: updated.experience,
          location: updated.location,
          search_types: updated.searchTypes,
          skills: updated.skills,
          cv_url: updated.cvFileName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      setUser((prev) => ({ ...prev, ...updated }));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Erreur mise à jour profil' };
    }
  };

  const applyToJob = (job: JobOffer): boolean => {
    if (applications.some((app) => app.jobId === job.id)) {
      return false;
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
        session,
        loading,
        applications,
        jobsList,
        login,
        logout,
        register,
        updateProfile,
        applyToJob,
        addPublishedJob,
        hasApplied,
        refreshProfile,
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
