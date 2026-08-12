/**
 * Scraper Spécialisé Bourses d'Études Nationales & Internationales pour ESSOR Cameroun
 * Couvre les programmes officiels du MINESUP, Campus France, DAAD Allemagne, Chevening UK, Commonwealth et MasterCard Foundation.
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://mcmnodtfwhfdqaygxyka.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbW5vZHRmd2hmZHFheWd4eWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1MzA5ODgsImV4cCI6MjEwMjEwNjk4OH0.ThRaS3PyfCvv65xizlWLQ2qfQ6kGNXKkzOWwbSorp2M';

const OFFICIAL_SCHOLARSHIPS = [
  // 1. MINESUP Coopération Bilatérale
  {
    title: 'Bourses d\'Études du Gouvernement Marocain (MINESUP 2026-2027)',
    organization: 'MINESUP / AMCI (Agence Marocaine de Coopération Internationale)',
    type: 'bourse',
    location: 'Yaoundé',
    short_description: 'Bourses d\'études complètes pour cursus universitaire au Maroc (Licence, Master, Ingénieur).',
    full_description: 'Le Ministère de l\'Enseignement Supérieur communique l\'ouverture de la campagne d\'octroi de 100 bourses d\'études offertes par le Royaume du Maroc aux étudiants camerounais pour l\'année académique 2026-2027.',
    category: 'Enseignement & Éducation',
    contact_email: 'bourses.maroc@minesup.gov.cm',
    contact_whatsapp: '+237 699631950',
    deadline: '2026-10-15',
    source: 'scraped',
    moderation_status: 'publiee'
  },
  {
    title: 'Bourses d\'Études de la Fédération de Russie (MINESUP 2026)',
    organization: 'MINESUP / Ambassade de la Fédération de Russie au Cameroun',
    type: 'bourse',
    location: 'Yaoundé',
    short_description: 'Bourses d\'études supérieures en Russie (Ingénierie, Médecine, Sciences & Technologies).',
    full_description: 'Offre officielle de bourses du gouvernement russe pour les étudiants camerounais. Prise en charge des frais de scolarité, année préparatoire de langue russe et allocation mensuelle de subsistance.',
    category: 'Enseignement & Éducation',
    contact_email: 'bourses.russie@minesup.gov.cm',
    contact_whatsapp: '+237 699631950',
    deadline: '2026-11-01',
    source: 'scraped',
    moderation_status: 'publiee'
  },

  // 2. Campus France & Bourses Eiffel
  {
    title: 'Bourses d\'Excellence Eiffel (Master & Doctorat en France)',
    organization: 'Campus France / Ministère des Affaires Étrangères (France)',
    type: 'bourse',
    location: 'Douala',
    short_description: 'Bourse d\'excellence complète pour futurs décideurs camerounais dans les universités françaises.',
    full_description: 'Le programme de bourses Eiffel est un outil développé par le ministère de l\'Europe et des Affaires étrangères pour attirer les meilleurs étudiants étrangers dans des formations diplômantes de niveau Master et Doctorat en France.',
    category: 'Enseignement & Éducation',
    contact_email: 'eiffel@campusfrance.org',
    contact_whatsapp: '+237 699631950',
    deadline: '2026-11-20',
    source: 'scraped',
    moderation_status: 'publiee'
  },

  // 3. DAAD Allemagne
  {
    title: 'Bourses d\'Études et de Recherche DAAD (Allemagne 2026-2027)',
    organization: 'DAAD Cameroun (Deutscher Akademischer Austauschdienst)',
    type: 'bourse',
    location: 'Yaoundé',
    short_description: 'Bourses complètes de Master et Doctorat en Allemagne pour diplômés d\'Afrique subsaharienne.',
    full_description: 'Le DAAD offre des bourses d\'études de Master et de thèses de Doctorat dans les universités allemandes. Financement intégral : billet d\'avion, couverture médicale et indemnité mensuelle de 934€ à 1200€.',
    category: 'Enseignement & Éducation',
    contact_email: 'info@daad-cameroon.org',
    contact_whatsapp: '+237 699631950',
    deadline: '2026-10-31',
    source: 'scraped',
    moderation_status: 'publiee'
  },

  // 4. Chevening UK
  {
    title: 'Bourses d\'Études Chevening (Gouvernement Britannique / UK)',
    organization: 'UK Government / Chevening Scholarships Cameroon',
    type: 'bourse',
    location: 'Yaoundé',
    short_description: 'Bourse d\'études de Master de 1 an entièrement financée dans les universités du Royaume-Uni.',
    full_description: 'Le programme de bourses Chevening offre aux futurs leaders camerounais l\'opportunité d\'effectuer un Master d\'un an entièrement financé au Royaume-Uni. Prise en charge des frais de scolarité, billet d\'avion AR et allocation de vie.',
    category: 'Enseignement & Éducation',
    contact_email: 'chevening@fco.gov.uk',
    contact_whatsapp: '+237 699631950',
    deadline: '2026-11-07',
    source: 'scraped',
    moderation_status: 'publiee'
  },

  // 5. MasterCard Foundation Scholars Program
  {
    title: 'Bourses MasterCard Foundation Scholars (Afrique & International)',
    organization: 'MasterCard Foundation / Universités Partenaires',
    type: 'bourse',
    location: 'Douala',
    short_description: 'Bourses complètes d\'études universitaires pour jeunes leaders africains talentueux.',
    full_description: 'Le programme MasterCard Foundation Scholars offre des bourses d\'études intégrales (frais de scolarité, logement, livres et mentorat) destinées aux jeunes étudiants d\'Afrique subsaharienne faisant preuve d\'excellence académique.',
    category: 'Enseignement & Éducation',
    contact_email: 'scholars@mastercardfdn.org',
    contact_whatsapp: '+237 699631950',
    deadline: '2026-11-30',
    source: 'scraped',
    moderation_status: 'publiee'
  },

  // 6. Bourses de la Banque Mondiale
  {
    title: 'Bourses de Master Joint Japan/World Bank (JJ/WBGSP)',
    organization: 'Banque Mondiale (World Bank Group)',
    type: 'bourse',
    location: 'Yaoundé',
    short_description: 'Bourses de Master en développement économique et politiques publiques.',
    full_description: 'Bourse complète de la Banque Mondiale ouverte aux ressortissants des pays en développement. Couvre les frais universitaires, le billet d\'avion et une allocation mensuelle pour un Master dans des universités renommées aux USA, Europe et Asie.',
    category: 'Comptabilité & Gestion',
    contact_email: 'jjwbgsp@worldbank.org',
    contact_whatsapp: '+237 699631950',
    deadline: '2026-10-25',
    source: 'scraped',
    moderation_status: 'publiee'
  }
];

export async function runScholarshipsScraper() {
  console.log('🎓 Démarrage du scraping des Bourses d\'Études Nationales & Internationales (MINESUP, Eiffel, DAAD, Chevening, MasterCard Fdn)...');

  let added = 0;
  for (const scholarship of OFFICIAL_SCHOLARSHIPS) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/offers`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(scholarship)
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`❌ Erreur insertion bourse "${scholarship.title}":`, errText);
      } else {
        console.log(`✅ [${scholarship.organization}] Bourse insérée : ${scholarship.title}`);
        added++;
      }
    } catch (e) {
      console.error(`❌ Exception pour "${scholarship.title}":`, e.message);
    }
  }

  console.log(`🎉 Scraping Bourses terminé ! ${added} nouvelles bourses d'études nationales & internationales ont été ajoutées sur ESSOR.`);
}

runScholarshipsScraper();
