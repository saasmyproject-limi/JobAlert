import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from '../router/Router';
import { JobType, JobOffer } from '../types';
import { PlusCircle, CheckCircle2, MessageSquare, ArrowRight, Building2, MapPin, Sparkles, Send } from 'lucide-react';

export const PublishOfferPage: React.FC = () => {
  const { addPublishedJob } = useAuth();

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

  // Confirmation state
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const typeLabels: Record<JobType, string> = {
      'emploi-formel': 'Emploi Formel (CDI/CDD)',
      'emploi-informel': 'Emploi Informel / Mission',
      'stage': 'Stage Académique / Pro',
      'bourse': 'Bourse d\'études',
    };

    const newJob: JobOffer = {
      id: `pub-${Date.now()}`,
      title: title || 'Offre sans titre',
      organization: organization || 'Entreprise / Particulier',
      type,
      typeLabel: typeLabels[type],
      location,
      shortDescription: description.slice(0, 140) + '...',
      fullDescription: description,
      requirements: ['Profil rigoureux et motivé', 'Expérience selon le besoin'],
      deadline: deadline || 'Dans 30 jours',
      matchPercentage: 94,
      category: 'Recrutement Direct',
      contactWhatsApp: contactWhatsApp || undefined,
      contactEmail: contactEmail || undefined,
      salary: salary || undefined,
      postedDate: 'À l\'instant',
    };

    addPublishedJob(newJob);
    setIsSubmitted(true);
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
          Publier une offre sur JobAlert
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
              Merci ! Notre équipe contrôle la conformité des annonces sous 2 heures. Une fois validée, votre offre sera diffusée aux candidats correspondant par alerte WhatsApp.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-creme border border-sauge/40 max-w-md mx-auto text-left text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-vert-profond">
              <MessageSquare className="w-4 h-4 text-whatsapp fill-whatsapp" />
              <span>Diffusion WhatsApp prévue</span>
            </div>
            <p className="text-encre/70">
              Un rapport de diffusion et les candidatures reçues vous seront envoyés sur vos coordonnées de contact.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/offres"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-vert-profond text-creme font-sora font-bold text-sm hover:bg-vert-moyen transition-all w-full sm:w-auto"
            >
              <span>Voir la liste des offres</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setTitle('');
                setDescription('');
              }}
              className="px-6 py-3.5 rounded-full border border-sauge text-vert-profond font-bold text-xs hover:bg-sauge/20 transition-all w-full sm:w-auto"
            >
              Publier une autre offre
            </button>
          </div>

        </div>
      ) : (
        /* Recruiter Form */
        <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-sauge/40 shadow-subtle space-y-6">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Titre de l'offre */}
            <div>
              <label className="block text-sm font-semibold text-vert-profond mb-1.5">
                Titre de l'offre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="ex: Plombier qualifié pour chantier R+4 / Développeur React / Stage RH..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium transition-all"
              />
            </div>

            {/* Organisation / Nom du recruteur */}
            <div>
              <label className="block text-sm font-semibold text-vert-profond mb-1.5">
                Nom de l'entreprise ou du recruteur <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="ex: Brasseries du Cameroun / Cabinet RH / Particulier M. Talla..."
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium transition-all"
              />
            </div>

            {/* Type & Localisation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-vert-profond mb-1.5">
                  Type d'offre <span className="text-red-500">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as JobType)}
                  className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium bg-white"
                >
                  <option value="emploi-formel">Emploi Formel (CDI / CDD)</option>
                  <option value="emploi-informel">Emploi Informel / Mission / Prestation</option>
                  <option value="stage">Stage Académique / Professionnel</option>
                  <option value="bourse">Bourse d'études / Formation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-vert-profond mb-1.5">
                  Localisation (Ville / Quartier) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Douala - Akwa, Yaoundé - Bastos, Kribi..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium transition-all"
                />
              </div>
            </div>

            {/* Description détaillée */}
            <div>
              <label className="block text-sm font-semibold text-vert-profond mb-1.5">
                Description détaillée du besoin <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                placeholder="Décrivez les tâches, le profil recherché, les conditions de travail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium transition-all"
              />
            </div>

            {/* Coordonnées de contact */}
            <div className="p-4 rounded-2xl bg-creme border border-sauge/40 space-y-4">
              <h3 className="font-sora font-extrabold text-sm text-vert-profond">
                Coordonnées de contact pour recevoir les candidatures
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-vert-profond mb-1">
                    Numéro WhatsApp (recommandé)
                  </label>
                  <input
                    type="tel"
                    placeholder="+237 6XX XX XX XX"
                    value={contactWhatsApp}
                    onChange={(e) => setContactWhatsApp(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-sauge/60 bg-white text-encre text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-vert-profond mb-1">
                    Email de contact
                  </label>
                  <input
                    type="email"
                    placeholder="recrutement@entreprise.cm"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-sauge/60 bg-white text-encre text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Optional Salary & Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-vert-profond mb-1.5">
                  Rémunération / Budget (Optionnel)
                </label>
                <input
                  type="text"
                  placeholder="ex: 150 000 FCFA / mois ou 10 000 FCFA / jour"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond outline-none text-encre text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-vert-profond mb-1.5">
                  Date limite de candidature
                </label>
                <input
                  type="text"
                  placeholder="ex: 30 Septembre 2026"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond outline-none text-encre text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-sauge/30">
              <button
                type="submit"
                className="w-full py-4 rounded-full bg-vert-profond hover:bg-vert-moyen text-creme font-sora font-extrabold text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5 text-or-clair" />
                <span>Publier l'offre</span>
              </button>
            </div>

          </form>

        </div>
      )}

    </div>
  );
};
