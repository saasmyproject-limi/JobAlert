/**
 * Script de validation et de test du moteur de matching ESSOR
 */

function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function calculateMatchScore(profile, offer) {
  const profileTypes = profile.search_types || profile.searchTypes || [];
  const offerType = normalizeText(offer.type || '');

  // 1. CRITÈRE ÉLIMINATOIRE : Type de recherche (Emploi Formel, Informel, Stage, Bourse)
  if (profileTypes.length > 0) {
    const matchesType = profileTypes.some(
      (t) => normalizeText(t) === offerType
    );
    if (!matchesType) {
      return 0; // Éliminé d'office
    }
  }

  let totalScore = 0;

  // 2. LOCALISATION (25%)
  const profileLoc = normalizeText(profile.location || '');
  const offerLoc = normalizeText(offer.location || '');

  const isNationalOrAnywhere =
    offerLoc.includes('toutes localisations') ||
    offerLoc.includes('national') ||
    offerLoc.includes('tout le cameroun') ||
    offerLoc.includes('cameroun') ||
    offerLoc.includes('a distance') ||
    offerLoc.includes('en ligne') ||
    offerLoc.includes('remote');

  if (
    isNationalOrAnywhere ||
    (profileLoc && offerLoc && (profileLoc.includes(offerLoc) || offerLoc.includes(profileLoc)))
  ) {
    totalScore += 25;
  }

  // 3. DOMAINE / SECTEUR (35%)
  const profileDomain = normalizeText(profile.domain || '');
  const offerTextPool = normalizeText(
    `${offer.category || ''} ${offer.title || ''} ${offer.short_description || offer.shortDescription || ''} ${offer.full_description || offer.fullDescription || ''}`
  );

  if (profileDomain && offerTextPool) {
    const domainWords = profileDomain
      .split(/[\s&,/]+/)
      .filter((w) => w.length > 3);

    const hasDomainMatch = domainWords.some((word) => offerTextPool.includes(word));
    if (hasDomainMatch || offerTextPool.includes(profileDomain)) {
      totalScore += 35;
    }
  }

  // 4. MOTS-CLÉS / COMPÉTENCES (40%)
  const profileSkills = (profile.skills || []).filter(
    (s) => typeof s === 'string' && s.trim().length > 0
  );

  if (profileSkills.length > 0) {
    const fullRequirementsText = Array.isArray(offer.requirements)
      ? offer.requirements.join(' ')
      : typeof offer.requirements === 'string'
      ? offer.requirements
      : '';

    const offerSearchTarget = normalizeText(
      `${offer.title || ''} ${offer.short_description || offer.shortDescription || ''} ${offer.full_description || offer.fullDescription || ''} ${fullRequirementsText}`
    );

    let matchedSkillsCount = 0;
    for (const skill of profileSkills) {
      const normSkill = normalizeText(skill);
      if (normSkill && offerSearchTarget.includes(normSkill)) {
        matchedSkillsCount++;
      }
    }

    const skillRatio = matchedSkillsCount / profileSkills.length;
    totalScore += Math.round(skillRatio * 40);
  } else {
    if (totalScore >= 35) {
      totalScore += 20;
    }
  }

  return Math.min(100, Math.round(totalScore));
}

// --- CAS DE TEST CONCRETS ---

const candidate1 = {
  name: 'Paul Atangana',
  location: 'Douala',
  domain: 'Informatique & Technologies',
  searchTypes: ['stage', 'emploi-formel'],
  skills: ['React', 'TypeScript', 'Tailwind', 'Git'],
};

const candidate2 = {
  name: 'Marie Nguemo',
  location: 'Yaoundé',
  domain: 'Finance & Comptabilité',
  searchTypes: ['bourse'],
  skills: ['Excel', 'Audit', 'Gestion'],
};

const candidate3 = {
  name: 'Jean Kotto',
  location: 'Bafoussam',
  domain: 'Gestion de Projet',
  searchTypes: ['emploi-formel'],
  skills: ['Agile', 'Scrum', 'Planification', 'Budget'],
};

// --- OFFRES DE TEST (PROVENANT DU SCRAPING ET DE PUBLICATION MANUELLE) ---

const offerA = {
  title: 'Stage Développeur Front-End React & TypeScript',
  organization: 'Orange Cameroun',
  type: 'stage',
  location: 'Douala',
  category: 'Informatique & Télécoms',
  shortDescription: 'Nous recrutons un stagiaire passionné par le développement web React, TypeScript et Git à Douala.',
  requirements: ['React', 'TypeScript', 'Git', 'Esprit d\'équipe'],
};

const offerB = {
  title: 'Concours Direct MINFOPRA - Administrateurs Civils',
  organization: 'MINFOPRA',
  type: 'emploi-formel',
  location: 'Yaoundé',
  category: 'Fonction Publique',
  shortDescription: 'Recrutement direct des élèves administrateurs civils pour le Ministère de la Fonction Publique.',
  requirements: ['Licence en Droit ou Économie'],
};

const offerC = {
  title: 'Chef de Projet Informatique Senior',
  organization: 'MTN Cameroun',
  type: 'emploi-formel',
  location: 'Tout le Cameroun (National)',
  category: 'Informatique & Gestion de Projet',
  shortDescription: 'Gestion de projets agiles, planification stratégique et suivi budgétaire pour nos projets télécoms.',
  requirements: ['Méthode Agile', 'Planification', 'Gestion des risques'],
};

console.log('====================================================');
console.log('  TEST DU MOTEUR DE MATCHING ESSOR (3 EXEMPLES)');
console.log('====================================================\n');

// Test 1: Paul Atangana x Offer A (Stage Dev React à Douala)
const score1 = calculateMatchScore(candidate1, offerA);
console.log(`📌 TEST 1 : ${candidate1.name} (Dev Web) ✖ Offre "${offerA.title}"`);
console.log(`   Pondération : Type Validé | Localisation (Douala = 25%) | Domaine (Tech = 35%) | Compétences (3/4 = 30%)`);
console.log(`   👉 SCORE CALCULÉ : ${score1}% ${score1 >= 70 ? '✅ [MATCH RETENU > 70%]' : '❌ [REJETÉ]'}\n`);

// Test 2: Marie Nguemo (Recherche Bourse) x Offer B (Emploi Formel Admin)
const score2 = calculateMatchScore(candidate2, offerB);
console.log(`📌 TEST 2 : ${candidate2.name} (Recherche Bourse) ✖ Offre "${offerB.title}" (Emploi)`);
console.log(`   Pondération : Critère Éliminatoire (Type Bourse ∉ Emploi)`);
console.log(`   👉 SCORE CALCULÉ : ${score2}% ${score2 >= 70 ? '✅ [MATCH RETENU]' : '❌ [ÉLIMINÉ D\'OFFICE - Score 0%]'}\n`);

// Test 3: Jean Kotto x Offer C (Chef de Projet National)
const score3 = calculateMatchScore(candidate3, offerC);
console.log(`📌 TEST 3 : ${candidate3.name} (Chef de Projet) ✖ Offre "${offerC.title}"`);
console.log(`   Pondération : Type Validé | Localisation (National = 25%) | Domaine (Projet = 35%) | Compétences (2/4 = 20%)`);
console.log(`   👉 SCORE CALCULÉ : ${score3}% ${score3 >= 70 ? '✅ [MATCH RETENU > 70%]' : '❌ [REJETÉ]'}\n`);

console.log('====================================================');
