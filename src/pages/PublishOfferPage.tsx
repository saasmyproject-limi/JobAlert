import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Link } from '../router/Router';
import { JobType } from '../types';
import { PlusCircle, CheckCircle2, MessageSquare, ArrowRight, Building2, MapPin, Sparkles, Send, AlertCircle } from 'lucide-react';

export const PublishOfferPage: React.FC = () => {
  const { session } = useAuth();

  // Form state
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [type, setType] = useState<JobType>('emploi-formel');
  const [location, setLocation] = useState('Douala');
  const [description, setDescription] = useState('');
  const [contactWhatsApp, setContactWhatsApp] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [deadline, setDeadline] = useState('30 Septembre 2026');
  const [salary, setSalary] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim() || !organization.trim() || !description.trim()) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires (*).');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('offers').insert({
        title: title.trim(),
        organization: organization.trim(),
        type,
        location: location.trim(),
        short_description: description.slice(0, 150) + (description.length > 150 ? '...' : ''),
        full_description: description.trim(),
        requirements: ['Candidat motivé et disponible', 'Expérience selon le poste'],
        deadline: deadline.trim() || 'Non spécifiée',
        category: 'Offre Employeur / Recrutement',
        contact_whatsapp: contactWhatsApp.trim() || null,
        contact_email: contactEmail.trim() || null,
        salary: salary.trim() || null,
        is_urgent: false,
        source: 'manual',
        moderation_status: 'en_attente',
        publisher_id: session?.user?.id || null,
      });

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Erreur lors de la publication de l’offre:', err);
      setErrorMessage(err?.message || 'Erreur lors de la soumission de l’offre.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-or-clair/30 border border-or-ambre/40 text-vert-profond text-xs sm:text-sm font-bold">
          <PlusCircle className="w-4 h-4 text-vert-profond" />
          <span>Espace Recruteurs, Entreprises & Particuliers</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-sora font-extrabold text-vert-profond tracking-tight">
          Publier une offre sur ESSOR
        </h1>
        <p className="text-base text-encre/70 max-w-xl mx-auto">
          Touche instantanément des milliers de candidats qualifiés partout au Cameroun directement sur WhatsApp.
        </p>
      </div>

      {isSubmitted ? (
        /* Confirmation Message Screen */
        <div className="bg-white rounded-[32px] p-8 sm:p-12 border border-sauge/40 shadow-subtle text-center space-y-6 animate-fadeIn">
          
          <div className="w-20 h-20 rounded-full bg-whatsapp/20 text-whatsapp flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-3 max-w-lg mx-auto">
            <span className="px-3 py-1 rounded-full bg-or-ambre/20 text-vert-profond text-xs font-sora font-bold">
              Soumission enregistrée
            </span>
            <h2 className="text-2xl sm:text-3xl font-sora font-extrabold text-vert-profond">
              Votre offre est en attente de modération
            </h2>
            <p className="text-sm text-encre/80 leading-relaxed">
              Merci ! Votre annonce a bien été enregistrée et est actuellement en attente de modération.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-creme border border-sauge/40 max-w-md mx-auto text-left text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-vert-profond">
              <MessageSquare className="w-4 h-4 text-whatsapp fill-whatsapp" />
              <span>Diffusion WhatsApp prévue après modération</span>
            </div>
            <p className="text-encre/70">
              Dès qu'un modérateur valide votre offre, elle basculera au statut "publiée" et apparaîtra instantanément dans le flux public.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setTitle('');
                setDescription('');
              }}
              className="px-6 py-3 rounded-full bg-vert-profond text-creme font-sora font-bold text-xs hover:bg-vert-moyen transition-all"
            >
              Publier une autre offre
            </button>

            <Link
              to="/offres"
              className="px-6 py-3 rounded-full border border-vert-profond text-vert-profond font-sora font-bold text-xs hover:bg-vert-profond/10 transition-all"
            >
              Voir la liste des offres
            </Link>
          </div>

        </div>
      ) : (
        /* Form Card */
        <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-sauge/40 shadow-subtle space-y-6">
          
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-vert-profond mb-1.5">
                Titre de l'offre *
              </label>
              <input
                type="text"
                required
                placeholder="ex: Concours d'entrée, Développeur Web, Plombier BTP..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium transition-all"
              />
            </div>

            {/* Organization & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-vert-profond mb-1.5">
                  Entreprise / Organisation *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Orange Cameroun, Ministère, Particulier..."
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-vert-profond mb-1.5">
                  Type d'opportunité *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as JobType)}
                  className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-semibold transition-all bg-white"
                >
                  <option value="emploi-formel">Emploi Formel (Concours / CDI)</option>
                  <option value="emploi-informel">Emploi Informel / Prestation</option>
                  <option value="stage">Stage Académique / Pro</option>
                  <option value="bourse">Bourse d'études</option>
                </select>
              </div>
            </div>

            {/* Location & Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-vert-profond mb-1.5">
                  Localisation / Ville *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Douala, Yaoundé, Tout le Cameroun..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-vert-profond mb-1.5">
                  Date limite de candidature
                </label>
                <input
                  type="text"
                  placeholder="ex: 30 Octobre 2026"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-vert-profond mb-1.5">
                Description détaillée & Conditions *
              </label>
              <textarea
                rows={5}
                required
                placeholder="Décrivez les missions, le profil recherché, les conditions de candidature..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium transition-all"
              ></textarea>
            </div>

            {/* Contacts & Salary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-vert-profond mb-1.5">
                  WhatsApp Contact
                </label>
                <input
                  type="text"
                  placeholder="ex: +237 699 00 11 22"
                  value={contactWhatsApp}
                  onChange={(e) => setContactWhatsApp(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-vert-profond mb-1.5">
                  Email de réception
                </label>
                <input
                  type="email"
                  placeholder="recrutement@entreprise.cm"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-vert-profond mb-1.5">
                  Rémunération / Salaire
                </label>
                <input
                  type="text"
                  placeholder="ex: 150 000 FCFA / mois"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-vert-profond hover:bg-vert-moyen text-creme font-sora font-extrabold text-base transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-5 h-5 text-or-clair" />
              <span>{isSubmitting ? 'Publication en cours...' : 'Publier l\'offre d\'emploi'}</span>
            </button>

          </form>
        </div>
      )}

    </div>
  );
};
