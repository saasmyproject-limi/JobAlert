import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from '../router/Router';
import { JobType } from '../types';
import { MessageSquare, Upload, CheckCircle2, FileText, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [domain, setDomain] = useState('Informatique & Web');
  const [education, setEducation] = useState('Licence / Bachelor');
  const [experience, setExperience] = useState('1 à 3 ans');
  const [location, setLocation] = useState('Douala');
  
  const [searchTypes, setSearchTypes] = useState<JobType[]>([
    'emploi-formel',
    'stage'
  ]);
  
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['React', 'Comptabilité', 'Gestion de projet']);
  
  // Simulated CV File state
  const [cvFile, setCvFile] = useState<{ name: string; size: string } | null>({
    name: 'Mon_CV_2026.pdf',
    size: '1.4 MB'
  });
  const [isUploading, setIsUploading] = useState(false);

  const toggleSearchType = (type: JobType) => {
    if (searchTypes.includes(type)) {
      if (searchTypes.length > 1) {
        setSearchTypes(searchTypes.filter((t) => t !== type));
      }
    } else {
      setSearchTypes([...searchTypes, type]);
    }
  };

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        setCvFile({
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        });
        setIsUploading(false);
      }, 600);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({
      name: name || 'Candidat JobAlert',
      email: email || 'candidat@jobalert.cm',
      phone: phone || '+237 690 00 11 22',
      domain,
      education,
      experience,
      location,
      searchTypes,
      skills,
      cvFileName: cvFile ? cvFile.name : undefined,
    });
    navigate('/tableau-de-bord');
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-whatsapp/15 border border-whatsapp/30 text-vert-profond text-xs sm:text-sm font-bold">
          <MessageSquare className="w-4 h-4 text-whatsapp fill-whatsapp" />
          <span>Inscription & Alertes WhatsApp directes</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-sora font-extrabold text-vert-profond tracking-tight">
          Crée ton profil JobAlert
        </h1>
        <p className="text-base text-encre/70 max-w-xl mx-auto">
          Reçois des opportunités sur-mesure directement sur WhatsApp dès qu'elles sont publiées au Cameroun.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-sauge/40 shadow-subtle relative overflow-hidden">
        
        {/* Step indicator */}
        <div className="flex items-center justify-between border-b border-sauge/30 pb-6 mb-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`w-9 h-9 rounded-full font-sora font-bold text-sm flex items-center justify-center transition-all ${
                step === 1 ? 'bg-vert-profond text-creme shadow-md' : 'bg-sauge/30 text-vert-profond'
              }`}
            >
              1
            </button>
            <div>
              <p className="text-xs uppercase tracking-wider text-encre/50 font-bold">Étape 1 sur 2</p>
              <p className="font-sora font-bold text-sm text-vert-profond">Compte & WhatsApp</p>
            </div>
          </div>

          <div className="w-12 h-0.5 bg-sauge/40 hidden sm:block"></div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className={`w-9 h-9 rounded-full font-sora font-bold text-sm flex items-center justify-center transition-all ${
                step === 2 ? 'bg-vert-profond text-creme shadow-md' : 'bg-sauge/30 text-vert-profond'
              }`}
            >
              2
            </button>
            <div>
              <p className="text-xs uppercase tracking-wider text-encre/50 font-bold">Étape 2 sur 2</p>
              <p className="font-sora font-bold text-sm text-vert-profond">Critères & CV</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* STEP 1: Account Info */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Nom & Prénom */}
              <div>
                <label className="block text-sm font-semibold text-vert-profond mb-1.5">
                  Nom et Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Jean-Marc Nkoa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-vert-profond mb-1.5">
                  Adresse Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="ex: jeanmarc@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium transition-all"
                />
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-sm font-semibold text-vert-profond mb-1.5">
                  Mot de passe <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 caractères"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium transition-all"
                />
              </div>

              {/* WhatsApp Box Notice (MANDATORY ALERT CHANNEL) */}
              <div className="p-4 rounded-2xl bg-whatsapp/10 border-2 border-whatsapp/40 space-y-2">
                <div className="flex items-center gap-2 text-vert-profond font-sora font-extrabold text-sm">
                  <MessageSquare className="w-4 h-4 text-whatsapp fill-whatsapp shrink-0" />
                  <span>Canal d'alerte instantanée WhatsApp (Obligatoire)</span>
                </div>
                <p className="text-xs text-encre/80 leading-relaxed font-medium">
                  JobAlert t'envoie tes alertes d'offres directement par message WhatsApp dès leur publication. Saisis ton numéro principal.
                </p>
                <div>
                  <label className="block text-xs font-bold text-vert-profond mb-1">
                    Numéro WhatsApp au format +237
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+237 6XX XX XX XX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-whatsapp/50 bg-white focus:border-whatsapp focus:ring-2 focus:ring-whatsapp/20 outline-none text-encre font-bold text-sm tracking-wide"
                  />
                </div>
              </div>

              {/* Action next */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-vert-profond hover:bg-vert-moyen text-creme font-sora font-bold text-sm transition-all duration-200 shadow-md hover:-translate-y-0.5"
                >
                  <span>Continuer vers les critères</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: Profile Criteria & CV */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Row 1: Domain & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-vert-profond mb-1.5">
                    Domaine / Secteur d'activité
                  </label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium bg-white"
                  >
                    <option value="Informatique & Web">Informatique, Web & Télécoms</option>
                    <option value="Fonction Publique & Admin">Fonction Publique & Administration</option>
                    <option value="Comptabilité & Gestion">Comptabilité, Finance & Banque</option>
                    <option value="Marketing & Vente">Marketing, Communication & Commerce</option>
                    <option value="Artisanat & Métiers">Artisanat, BTP & Métiers manuels</option>
                    <option value="Transport & Logistique">Transport, Chauffeur & Logistique</option>
                    <option value="Santé & Pharmacie">Santé, Médical & Pharmacie</option>
                    <option value="Enseignement & Éducation">Enseignement & Éducation</option>
                    <option value="Autre">Autre domaine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-vert-profond mb-1.5">
                    Localisation / Ville
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium bg-white"
                  >
                    <option value="Douala">Douala</option>
                    <option value="Yaoundé">Yaoundé</option>
                    <option value="Bafoussam">Bafoussam</option>
                    <option value="Garoua">Garoua</option>
                    <option value="Bamenda">Bamenda</option>
                    <option value="Kribi">Kribi</option>
                    <option value="Buea">Buea</option>
                    <option value="Tout le Cameroun">Tout le Cameroun</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Education & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-vert-profond mb-1.5">
                    Niveau d'études
                  </label>
                  <select
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium bg-white"
                  >
                    <option value="BEPC / CAP / Probatoire">BEPC / CAP / Probatoire</option>
                    <option value="Baccalauréat / GCE A-Level">Baccalauréat / GCE A-Level</option>
                    <option value="BTS / DUT / HND">BTS / DUT / HND</option>
                    <option value="Licence / Bachelor">Licence / Bachelor (Bac+3)</option>
                    <option value="Master 2 / Master Pro">Master 2 / Master Pro (Bac+5)</option>
                    <option value="Doctorat / PhD">Doctorat / PhD</option>
                    <option value="Formation Professionnelle / Métier">Formation Professionnelle / Métier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-vert-profond mb-1.5">
                    Années d'expérience
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium bg-white"
                  >
                    <option value="Débutant (0 - 1 an)">Débutant (0 - 1 an)</option>
                    <option value="1 à 3 ans">1 à 3 ans</option>
                    <option value="3 à 5 ans">3 à 5 ans</option>
                    <option value="5 à 10 ans">5 à 10 ans</option>
                    <option value="Plus de 10 ans">Plus de 10 ans</option>
                  </select>
                </div>
              </div>

              {/* Type de recherche (Checkboxes) */}
              <div>
                <label className="block text-sm font-semibold text-vert-profond mb-2">
                  Types d'opportunités recherchées (Sélectionne au moins une)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  
                  <label 
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                      searchTypes.includes('emploi-formel')
                        ? 'border-vert-profond bg-vert-profond/10 font-bold text-vert-profond'
                        : 'border-sauge/60 bg-white text-encre/70 hover:bg-sauge/20'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={searchTypes.includes('emploi-formel')}
                      onChange={() => toggleSearchType('emploi-formel')}
                      className="w-4 h-4 accent-vert-profond rounded"
                    />
                    <span className="text-xs sm:text-sm">Emploi formel</span>
                  </label>

                  <label 
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                      searchTypes.includes('emploi-informel')
                        ? 'border-or-ambre bg-or-ambre/15 font-bold text-vert-profond'
                        : 'border-sauge/60 bg-white text-encre/70 hover:bg-sauge/20'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={searchTypes.includes('emploi-informel')}
                      onChange={() => toggleSearchType('emploi-informel')}
                      className="w-4 h-4 accent-or-ambre rounded"
                    />
                    <span className="text-xs sm:text-sm">Emploi informel</span>
                  </label>

                  <label 
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                      searchTypes.includes('stage')
                        ? 'border-vert-moyen bg-sauge/30 font-bold text-vert-profond'
                        : 'border-sauge/60 bg-white text-encre/70 hover:bg-sauge/20'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={searchTypes.includes('stage')}
                      onChange={() => toggleSearchType('stage')}
                      className="w-4 h-4 accent-vert-moyen rounded"
                    />
                    <span className="text-xs sm:text-sm">Stage</span>
                  </label>

                  <label 
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                      searchTypes.includes('bourse')
                        ? 'border-purple-600 bg-purple-50 font-bold text-purple-900'
                        : 'border-sauge/60 bg-white text-encre/70 hover:bg-sauge/20'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={searchTypes.includes('bourse')}
                      onChange={() => toggleSearchType('bourse')}
                      className="w-4 h-4 accent-purple-600 rounded"
                    />
                    <span className="text-xs sm:text-sm">Bourse d'études</span>
                  </label>

                </div>
              </div>

              {/* Keywords / Skills Tag input */}
              <div>
                <label className="block text-sm font-semibold text-vert-profond mb-1.5">
                  Mots-clés / Compétences clés
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="ex: React, Permis B, Plomberie, Sage SAARI..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    className="flex-1 px-4 py-2.5 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill()}
                    className="px-5 py-2.5 rounded-2xl bg-vert-profond text-creme font-bold text-xs hover:bg-vert-moyen transition-all"
                  >
                    Ajouter
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sauge/30 text-vert-profond text-xs font-semibold border border-sauge"
                    >
                      <Tag className="w-3 h-3 text-or-ambre" />
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1 hover:text-red-600 text-xs font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Simulated CV Upload Zone */}
              <div>
                <label className="block text-sm font-semibold text-vert-profond mb-1.5">
                  Zone d'upload de CV (Simulée)
                </label>
                
                <div className="border-2 border-dashed border-sauge rounded-2xl p-6 text-center bg-creme/50 hover:bg-sauge/10 transition-colors relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleSimulatedFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />

                  {isUploading ? (
                    <div className="space-y-2 py-2">
                      <div className="w-8 h-8 border-3 border-vert-profond border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-xs font-semibold text-vert-profond">Analyse du CV en cours...</p>
                    </div>
                  ) : cvFile ? (
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-sauge/60 max-w-md mx-auto shadow-sm">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-vert-profond shrink-0" />
                        <div className="text-left">
                          <p className="text-xs font-bold text-vert-profond">{cvFile.name}</p>
                          <p className="text-[10px] text-encre/60">{cvFile.size} · Fichier sélectionné</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-whatsapp/20 text-vert-profond text-[10px] font-bold border border-whatsapp/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-whatsapp" />
                        Prêt
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-vert-profond mx-auto opacity-70" />
                      <p className="text-xs font-bold text-vert-profond">
                        Glisse ton CV ici ou clique pour parcourir
                      </p>
                      <p className="text-[10px] text-encre/60">Formats acceptés : PDF, DOCX (Max 5 MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Navigation Buttons */}
              <div className="pt-6 border-t border-sauge/30 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-full border border-sauge text-encre/70 hover:bg-sauge/20 font-bold text-xs sm:text-sm"
                >
                  ← Étape précédente
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-vert-profond hover:bg-vert-moyen text-creme font-sora font-extrabold text-sm sm:text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Sparkles className="w-4 h-4 text-or-clair fill-or-clair" />
                  <span>Créer mon profil</span>
                </button>
              </div>

            </div>
          )}

        </form>

      </div>

      {/* Switch to Login link */}
      <div className="text-center mt-6">
        <p className="text-sm text-encre/70 font-medium">
          Tu as déjà un compte JobAlert ?{' '}
          <Link to="/connexion" className="text-vert-profond font-bold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>

    </div>
  );
};
