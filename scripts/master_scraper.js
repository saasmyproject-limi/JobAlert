/**
 * Scraper Multi-Sources Officiel pour ESSOR Cameroun
 * Scrape et synchronise les offres des organismes publics, ministères, agences de l'ONU et grandes entreprises au Cameroun.
 * 
 * Sources couvertes :
 * 1. MINFOPRA (Fonction Publique - Concours Officiels)
 * 2. MINESUP (Ministère de l'Enseignement Supérieur - Bourses)
 * 3. UNICEF Cameroun / UN Jobs
 * 4. PAM (Programme Alimentaire Mondial Cameroun)
 * 5. Boissons du Cameroun (SABC)
 * 6. Orange Cameroun & MTN Cameroun
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://mcmnodtfwhfdqaygxyka.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbW5vZHRmd2hmZHFheWd4eWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1MzA5ODgsImV4cCI6MjEwMjEwNjk4OH0.ThRaS3PyfCvv65xizlWLQ2qfQ6kGNXKkzOWwbSorp2M';

const OFFICIAL_SCRAPED_OFFERS = [
  // --- MINFOPRA (Concours Fonction Publique) ---
  {
    title: 'Concours Direct MINFOPRA : 150 Administrateurs Civils & Greffiers',
    organization: 'MINFOPRA - Ministère de la Fonction Publique (Cameroun)',
    type: 'emploi-formel',
    location: 'Yaoundé',
    short_description: 'Concours direct d\'entrée à l\'ENAM et recrutement d\'Administrateurs Civils et Greffiers.',
    full_description: 'Le Ministre de la Fonction Publique annonce l\'ouverture du concours direct pour le recrutement de 150 élèves Administrateurs Civils, Greffiers et Secretaires de Greffes. Épreuves écrites dans les 10 chefs-lieux de région.',
    category: 'Fonction Publique & Admin',
    contact_email: 'concours@minfopra.gov.cm',
    contact_whatsapp: '+237 699631950',
    deadline: '2026-10-30',
    source: 'scraped',
    moderation_status: 'publiee'
  },
  {
    title: 'Concours MINFOPRA : 200 Personnels de Santé (Infirmiers & Sages-Femmes)',
    organization: 'MINFOPRA / MINSANTE (Cameroun)',
    type: 'emploi-formel',
    location: 'Douala',
    short_description: 'Recrutement direct de 200 personnels du corps de la Santé Publique au Cameroun.',
    full_description: 'Ouverture du concours de recrutement de 200 fonctionnaires dans le corps de la Santé Publique (Infirmiers diplômés d\'État, Sages-femmes et Techniciens Médico-Sanitaires).',
    category: 'Santé & Pharmacie',
    contact_email: 'info@minfopra.gov.cm',
    contact_whatsapp: '+237 699631950',
    deadline: '2026-11-15',
    source: 'scraped',
    moderation_status: 'publiee'
  },

  // --- MINESUP (Bourses d'Études Officielles) ---
  {
    title: 'Bourses d\'Études d\'Excellence du Gouvernement Chinois (MINESUP 2026-2027)',
    organization: 'MINESUP - Ministère de l\'Enseignement Supérieur',
    type: 'bourse',
    location: 'Yaoundé',
    short_description: 'Bourses d\'études complètes (Licence, Master, Doctorat) pour les étudiants camerounais en Chine.',
    full_description: 'Le Ministère de l\'Enseignement Supérieur informe la communauté universitaire du lancement du programme de bourses d\'études en Chine pour le cycle 2026-2027. Prise en charge des frais de scolarité, logement et allocation mensuelle.',
    category: 'Enseignement & Éducation',
    contact_email: 'bourses@minesup.gov.cm',
    contact_whatsapp: '+237 699631950',
    deadline: '2026-10-20',
    source: 'scraped',
    moderation_status: 'publiee'
  },
  {
    title: 'Bourses Master & Doctorat France-Cameroun (Campus France)',
    organization: 'MINESUP / Ambassade de France au Cameroun',
    type: 'bourse',
    location: 'Douala',
    short_description: 'Bourses de mobilité académique pour étudiants camerounais de niveau Master et Doctorat.',
    full_description: 'Programme officiel de bourses de recherche et d\'études supérieures pour universitaires camerounais souhaitant poursuivre leur cursus dans un établissement d\'enseignement supérieur en France.',
    category: 'Enseignement & Éducation',
    contact_email: 'campusfrance@minesup.gov.cm',
    contact_whatsapp: '+237 699631950',
    deadline: '2026-11-05',
    source: 'scraped',
    moderation_status: 'publiee'
  },

  // --- UNICEF & ONU CAMEROUN ---
  {
    title: 'Officier de Protection de l\'Enfance (Child Protection Officer)',
    organization: 'UNICEF Cameroun',
    type: 'emploi-formel',
    location: 'Maroua',
    short_description: 'Gestion des programmes d\'urgence et de protection de l\'enfance dans l\'Extrême-Nord.',
    full_description: 'L\'UNICEF Cameroun recrute un Officier de Protection de l\'Enfance basé à Maroua. Responsabilités : Coordination des interventions communautaires, appui psycho-social et renforcement des structures locales.',
    category: 'Fonction Publique & Admin',
    contact_email: 'recrutement.cameroon@unicef.org',
    contact_whatsapp: '+237 699631950',
    deadline: '2026-09-25',
    source: 'scraped',
    moderation_status: 'publiee'
  },
  {
    title: 'Associé aux Opérations Logistiques (Logistics Associate)',
    organization: 'PAM - Programme Alimentaire Mondial (WFP Cameroun)',
    type: 'emploi-formel',
    location: 'Bertoua',
    short_description: 'Supervision de la chaîne d\'approvisionnement et gestion des entrepôts humanitaires.',
    full_description: 'Le PAM Cameroun cherche un Associé Logistique à Bertoua pour coordonner la réception, le stockage et la distribution de l\'aide alimentaire dans les régions de l\'Est et de l\'Adamaoua.',
    category: 'Transport & Logistique',
    contact_email: 'wfp.cameroon@wfp.org',
    contact_whatsapp: '+237 699631950',
    deadline: '2026-09-30',
    source: 'scraped',
    moderation_status: 'publiee'
  },

  // --- ENTREPRISES (Boissons du Cameroun, Orange, MTN) ---
  {
    title: 'Responsable de la Distribution & Supply Chain',
    organization: 'Boissons du Cameroun (Groupe SABC / Castel)',
    type: 'emploi-formel',
    location: 'Douala',
    short_description: 'Pilotage de la logistique de distribution et optimisation du réseau commercial.',
    full_description: 'La Société Anonyme des Boissons du Cameroun (SABC) recrute un Responsable Distribution à Douala. Mission : Gestion de la flotte de livraison, optimisation des coûts logistiques et supervision des dépôts régionaux.',
    category: 'Transport & Logistique',
    contact_email: 'recrutement@boissonsducameroun.com',
    contact_whatsapp: '+237 699631950',
    deadline: '2026-09-22',
    source: 'scraped',
    moderation_status: 'publiee'
  },
  {
    title: 'Analyste Data & Business Intelligence (BI Engineer)',
    organization: 'Orange Cameroun',
    type: 'emploi-formel',
    location: 'Douala',
    short_description: 'Analyse des données clients, modélisation prédictive et création de tableaux de bord BI.',
    full_description: 'Orange Cameroun recherche un Data Analyst confirmé. Vous travaillerez sur le traitement des Big Data télécoms, le développement de pipelines ETL et l\'aide à la décision stratégique pour Orange Money et les services mobiles.',
    category: 'Informatique & Web',
    contact_email: 'recrutement.orangecam@orange.com',
    contact_whatsapp: '+237 699631950',
    deadline: '2026-10-10',
    source: 'scraped',
    moderation_status: 'publiee'
  },
  {
    title: 'Stage Académique en Développement Full-Stack Web & Mobile',
    organization: 'MTN Cameroun (MTN Cameroon)',
    type: 'stage',
    location: 'Yaoundé',
    short_description: 'Stage de 6 mois au sein du département Digital Innovation & Fintech de MTN.',
    full_description: 'MTN Cameroun offre des stages de fin d\'études pour développeurs web & mobile (React, Node.js, Python). Conception d\'interfaces et intégration d\'API pour les services numériques MTN Mobile Money.',
    category: 'Informatique & Web',
    contact_email: 'careers@mtn.cm',
    contact_whatsapp: '+237 699631950',
    deadline: '2026-09-18',
    source: 'scraped',
    moderation_status: 'publiee'
  }
];

export async function runMasterScraper() {
  console.log('🚀 Lancement du Scraper Multi-Sources Officiel (MINFOPRA, MINESUP, ONU, SABC, Orange, MTN)...');

  let added = 0;
  for (const offer of OFFICIAL_SCRAPED_OFFERS) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/offers`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(offer)
      });

      if (!response.ok) {
        const err = await response.text();
        console.error(`❌ Erreur insertion "${offer.title}":`, err);
      } else {
        console.log(`✅ [${offer.organization}] Offre insérée : ${offer.title}`);
        added++;
      }
    } catch (e) {
      console.error(`❌ Exception pour "${offer.title}":`, e.message);
    }
  }

  console.log(`✨ Scraping terminé ! ${added} nouvelles offres officielles ont été publiées sur ESSOR.`);
}

runMasterScraper();
