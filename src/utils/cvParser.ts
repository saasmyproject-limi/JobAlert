/**
 * Utility: Parser IA / Heuristique de CV pour ESSOR
 * Extrait automatiquement les compétences, le domaine, le niveau d'études et l'expérience d'un fichier CV
 */

export interface ParsedCVData {
  domain?: string;
  education?: string;
  experience?: string;
  skills: string[];
  extractedTextLength: number;
}

const COMMON_SKILLS_DICTIONARY: { [key: string]: string[] } = {
  'Informatique & Technologies': [
    'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'PHP', 'Java', 'SQL',
    'HTML', 'CSS', 'Tailwind', 'Git', 'Docker', 'Linux', 'Flutter', 'Vue.js', 'Angular',
    'Wordpress', 'Cybersécurité', 'Réseaux', 'Base de données', 'IA', 'Machine Learning'
  ],
  'Finance & Comptabilité': [
    'Excel', 'Sage', 'Comptabilité generale', 'Audit', 'Fiscalité', 'Gestion budgétaire',
    'Analyse financière', 'Bilan', 'Paie', 'Contrôle de gestion', 'SAP', 'Trésorerie'
  ],
  'Marketing & Communication': [
    'SEO', 'Community Management', 'Réseaux sociaux', 'Canva', 'Copywriting', 'Photoshop',
    'InDesign', 'Google Ads', 'Communication digitale', 'Relations publiques', 'Branding'
  ],
  'Gestion de Projet & Admin': [
    'Agile', 'Scrum', 'Management', 'Planification', 'Gestion des risques', 'MS Project',
    'Rédaction administrative', 'Assistanat de direction', 'Logistique', 'RH'
  ],
  'Génie & Ingénierie': [
    'AutoCAD', 'BTP', 'Génie civil', 'Électricité', 'Maintenance industrielle', 'HSE',
    'Dessin technique', 'Gestion de chantier', 'Qualité'
  ],
};

const EDUCATION_KEYWORDS: { [key: string]: string } = {
  'doctorat': 'Doctorat / PhD',
  'phd': 'Doctorat / PhD',
  'master': 'Master / Bac+5',
  'ingénieur': 'Ingénieur / Bac+5',
  'licence': 'Licence / Bac+3',
  'bachelor': 'Licence / Bac+3',
  'bts': 'BTS / DUT (Bac+2)',
  'dut': 'BTS / DUT (Bac+2)',
  'baccalaureat': 'Baccalauréat',
  'bac': 'Baccalauréat',
};

const EXPERIENCE_PATTERNS = [
  { pattern: /(\d+)\s*(ans|années|ans d'expérience)/i, getExp: (match: string) => `${match} d'expérience` },
  { pattern: /senior|expert/i, getExp: () => '5 ans et +' },
  { pattern: /junior|débutant/i, getExp: () => '1 à 2 ans' },
  { pattern: /stage|stagiaire/i, getExp: () => 'Moins d\'un an (Débutant)' },
];

/**
 * Extrait les informations structurées à partir du texte brut ou d'un fichier CV
 */
export async function parseCVFile(file: File): Promise<ParsedCVData> {
  try {
    const text = await file.text();
    const normalizedText = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const detectedSkills: Set<string> = new Set();
    let detectedDomain = '';
    let domainMatchCount = 0;

    // 1. Détection des compétences et du domaine prédominant
    for (const [domain, skillsList] of Object.entries(COMMON_SKILLS_DICTIONARY)) {
      let count = 0;
      for (const skill of skillsList) {
        const normSkill = skill.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (normalizedText.includes(normSkill)) {
          detectedSkills.add(skill);
          count++;
        }
      }
      if (count > domainMatchCount) {
        domainMatchCount = count;
        detectedDomain = domain;
      }
    }

    // 2. Détection du niveau d'études
    let detectedEducation = '';
    for (const [key, label] of Object.entries(EDUCATION_KEYWORDS)) {
      if (normalizedText.includes(key)) {
        detectedEducation = label;
        break;
      }
    }

    // 3. Détection de l'expérience
    let detectedExperience = '';
    for (const item of EXPERIENCE_PATTERNS) {
      const match = normalizedText.match(item.pattern);
      if (match) {
        detectedExperience = item.getExp(match[1] || match[0]);
        break;
      }
    }

    return {
      domain: detectedDomain || 'Informatique & Technologies',
      education: detectedEducation || 'Licence / Bac+3',
      experience: detectedExperience || '1 à 3 ans',
      skills: Array.from(detectedSkills),
      extractedTextLength: text.length,
    };
  } catch (err) {
    console.warn('Parser de CV : lecture texte brute indisponible, retour par défaut:', err);
    return {
      domain: 'Informatique & Technologies',
      education: 'Licence / Bac+3',
      experience: '1 à 3 ans',
      skills: ['React', 'TypeScript', 'Gestion de Projet'],
      extractedTextLength: 0,
    };
  }
}
